// Public content of the site served from a copy kept in Cloud Storage.
//
// Why: the Firestore database is an Enterprise edition limited to its free tier, which counts reads
// by volume (one read unit per 4 KiB) and blocks every read for the rest of the day once the daily
// allowance is used. Images stored inside documents (base64) and the catalogue PDF (stored in chunks)
// made every visit cost hundreds or thousands of read units.
//
// How:
// - images and files stored as base64 "data:" URLs in the content documents are moved to Storage
//   and replaced in Firestore by a short link to this function (done once per image);
// - after any change to the content, one JSON copy of the public content is rebuilt in Storage;
// - visitors, the ADILINE assistant and the e-learning read that copy through this function:
//   a visit costs no Firestore read at all.
const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const crypto = require('crypto');

const DATABASE_ID = 'ai-studio-cicexfcabinetint-be0c0f21-7527-4112-ae7f-82c61d321a9c';
const BUCKET = 'project-a93f5a0f-743d-4552-852.firebasestorage.app';
const REGION = 'europe-west1';
const PUBLIC_URL = `https://${REGION}-project-a93f5a0f-743d-4552-852.cloudfunctions.net/siteContent`;
const ALLOWED_ORIGINS = ['https://cicexf.com', 'https://www.cicexf.com', 'https://cicexf.gestionsaas.org', 'http://localhost:3000', 'http://localhost:5173'];

const CONTENT_PATH = 'site/content.json';
const DIRTY_PATH = 'site/dirty.json';
const LOCK_PATH = 'site/lock.json';
const FILES_DIR = 'site/files/';
const COLLECTIONS = ['formations', 'accompagnements', 'realisations', 'blog_posts', 'partners'];
const SETTINGS_DOCS = ['deleted_items', 'testimonials', 'catalogue'];
/** data: URLs shorter than this (tiny icons) stay in the document */
const MIN_EXTERNAL_CHARS = 2048;
/** Changes made within this delay are grouped into a single rebuild */
const DEBOUNCE_MS = 8000;

if (!getApps().length) initializeApp();
const db = getFirestore(DATABASE_ID);
const bucket = () => getStorage().bucket(BUCKET);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------------------------
// Moving base64 files out of the documents

const EXT = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
  'image/svg+xml': 'svg', 'image/avif': 'avif', 'application/pdf': 'pdf'
};
const TYPE_OF_EXT = Object.fromEntries(Object.entries(EXT).map(([t, e]) => [e, t]));
TYPE_OF_EXT.jpg = 'image/jpeg';
const DATA_URL_RE = /^data:([a-z0-9.+-]+\/[a-z0-9.+-]+)((?:;[a-z0-9-]+=[^;,]*)*);base64,/i;

/** Uploads one base64 data: URL (once per content) and returns its public link, or null if not movable */
async function externalizeDataUrl(value) {
  const m = DATA_URL_RE.exec(value);
  if (!m) return null;
  const type = m[1].toLowerCase();
  const ext = EXT[type];
  if (!ext) return null;
  const buf = Buffer.from(value.slice(m[0].length), 'base64');
  if (!buf.length) return null;
  const name = `${crypto.createHash('sha256').update(buf).digest('hex').slice(0, 32)}.${ext}`;
  const file = bucket().file(FILES_DIR + name);
  const [exists] = await file.exists();
  if (!exists) {
    await file.save(buf, { resumable: false, contentType: type, metadata: { cacheControl: 'public, max-age=31536000, immutable' } });
  }
  return `${PUBLIC_URL}?file=${name}`;
}

const isPlainObject = (v) => v && typeof v === 'object' && (v.constructor === Object || Object.getPrototypeOf(v) === null);

/** Returns a copy of value where every large data: URL is replaced by a link (other values untouched) */
async function externalize(value) {
  if (typeof value === 'string') {
    if (value.length < MIN_EXTERNAL_CHARS || !value.startsWith('data:')) return { value, changed: false };
    const url = await externalizeDataUrl(value);
    return url ? { value: url, changed: true } : { value, changed: false };
  }
  if (Array.isArray(value)) {
    let changed = false;
    const out = [];
    for (const v of value) { const r = await externalize(v); out.push(r.value); changed = changed || r.changed; }
    return { value: changed ? out : value, changed };
  }
  if (isPlainObject(value)) {
    let changed = false;
    const out = {};
    for (const [k, v] of Object.entries(value)) { const r = await externalize(v); out[k] = r.value; changed = changed || r.changed; }
    return { value: changed ? out : value, changed };
  }
  return { value, changed: false }; // Timestamps, numbers, references…
}

/** Moves the files of one document to Storage and rewrites only the fields that changed. Returns the new data. */
async function externalizeDoc(ref, data) {
  const updates = {};
  const next = { ...data };
  for (const [k, v] of Object.entries(data)) {
    const r = await externalize(v);
    if (r.changed) { updates[k] = r.value; next[k] = r.value; }
  }
  if (Object.keys(updates).length) {
    await ref.update(updates);
    logger.info('Fichiers déplacés vers Storage', { doc: ref.path, fields: Object.keys(updates) });
  }
  return { data: next, changed: Object.keys(updates).length > 0 };
}

// ---------------------------------------------------------------------------------------------
// Building the public copy

/** JSON-friendly copy: Firestore timestamps become ISO dates */
function serialize(value) {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value && typeof value.toDate === 'function') return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(serialize);
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serialize(v)]));
  return value;
}

/** Assembles the catalogue PDF from its Firestore chunks (once per version) */
async function ensureCataloguePdf(meta) {
  const file = bucket().file(`site/catalogue-${meta.version}.pdf`);
  const [exists] = await file.exists();
  if (exists) return true;
  const parts = [];
  for (let i = 0; i < meta.chunkCount; i++) {
    const snap = await db.doc(`app_settings/catalogue_chunk_${i}`).get();
    parts.push((snap.data() || {}).data || '');
  }
  const buf = Buffer.from(parts.join(''), 'base64');
  if (meta.size && buf.length !== meta.size) {
    logger.warn('Catalogue incomplet, nouvel essai à la prochaine modification', { expected: meta.size, got: buf.length });
    return false;
  }
  await file.save(buf, { resumable: false, contentType: 'application/pdf', metadata: { cacheControl: 'public, max-age=31536000, immutable' } });
  return true;
}

let memory = { at: 0, content: null };

async function rebuild(reason) {
  const started = Date.now();
  const content = { version: started, builtAt: new Date(started).toISOString() };
  for (const name of COLLECTIONS) {
    const snap = await db.collection(name).get();
    const items = [];
    for (const d of snap.docs) {
      const { data } = await externalizeDoc(d.ref, d.data());
      items.push({ id: d.id, ...serialize(data) });
    }
    content[name] = items;
  }
  const settings = {};
  for (const id of SETTINGS_DOCS) {
    const ref = db.doc(`app_settings/${id}`);
    const snap = await ref.get();
    settings[id] = snap.exists ? (await externalizeDoc(ref, snap.data())).data : null;
  }
  const del = settings.deleted_items || {};
  content.deleted = {
    formations: del.deletedFormationIds || [],
    accompagnements: del.deletedAccompagnementIds || [],
    realisations: del.deletedRealisationIds || [],
    blog_posts: del.deletedBlogPostIds || [],
    partners: del.deletedPartnerIds || []
  };
  content.testimonials = serialize(((settings.testimonials || {}).items || []).filter((t) => t && t.text));
  const cat = settings.catalogue;
  content.catalogue = cat && cat.chunkCount > 0 && (await ensureCataloguePdf(cat))
    ? { name: cat.name, size: cat.size, mimeType: cat.mimeType || 'application/pdf', chunkCount: cat.chunkCount, version: cat.version, updatedAt: cat.updatedAt }
    : null;
  const courses = await db.collection('elearning_courses').get();
  content.elearningCourses = Object.fromEntries(courses.docs.map((d) => [d.id, d.data().status])
    .filter(([, st]) => ['open', 'closed', 'deleted'].includes(st)));

  await bucket().file(CONTENT_PATH).save(JSON.stringify(content), {
    resumable: false, contentType: 'application/json; charset=utf-8', metadata: { cacheControl: 'no-cache' }
  });
  memory = { at: Date.now(), content };
  logger.info('Copie publique du contenu reconstruite', { reason, ms: Date.now() - started });
  return content;
}

/** Only one rebuild at a time: a lock object created with a "must not exist" condition */
async function withLock(fn) {
  const lock = bucket().file(LOCK_PATH);
  try {
    await lock.save(JSON.stringify({ at: Date.now() }), { resumable: false, preconditionOpts: { ifGenerationMatch: 0 } });
  } catch (e) {
    if (e.code !== 412) throw e;
    // A rebuild is running; a lock older than 5 minutes is left over from a crash
    const [meta] = await lock.getMetadata().catch(() => [null]);
    if (meta && Date.now() - new Date(meta.updated).getTime() < 5 * 60 * 1000) return null;
    await lock.delete({ ignoreNotFound: true });
    return withLock(fn);
  }
  try {
    return await fn();
  } finally {
    await lock.delete({ ignoreNotFound: true }).catch(() => {});
  }
}

/** Reads the public copy (kept 60 s in memory). Builds it the first time. */
async function readContent() {
  if (memory.content && Date.now() - memory.at < 60 * 1000) return memory.content;
  const file = bucket().file(CONTENT_PATH);
  try {
    const [buf] = await file.download();
    memory = { at: Date.now(), content: JSON.parse(buf.toString('utf8')) };
    return memory.content;
  } catch (e) {
    if (e.code !== 404) throw e;
  }
  // No copy yet. After a failed attempt (database quota used up for the day), wait 2 minutes
  // before trying again: visitors get an immediate answer and the site shows its built-in content.
  if (Date.now() - lastBuildFailure < 2 * 60 * 1000) {
    throw Object.assign(new Error('Copie du contenu pas encore disponible'), { status: 503 });
  }
  let built;
  try {
    built = await withLock(() => rebuild('première construction'));
  } catch (e) {
    lastBuildFailure = Date.now();
    throw Object.assign(e, { status: 503 });
  }
  if (built) return built;
  throw Object.assign(new Error('Copie du contenu en cours de construction'), { status: 503 });
}
let lastBuildFailure = 0;

// ---------------------------------------------------------------------------------------------
// Triggers: any change to the public content

async function onContentChange(event, label) {
  const after = event.data && event.data.after;
  // 1. Files sent as base64 are moved to Storage (the rewrite triggers this function again)
  if (after && after.exists) {
    const { changed } = await externalizeDoc(after.ref, after.data());
    if (changed) return;
  }
  // 2. Changes close together are grouped: only the last one rebuilds
  const mark = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await bucket().file(DIRTY_PATH).save(JSON.stringify({ mark, label }), { resumable: false });
  await sleep(DEBOUNCE_MS);
  const [buf] = await bucket().file(DIRTY_PATH).download().catch(() => [null]);
  if (!buf || JSON.parse(buf.toString('utf8')).mark !== mark) return;
  for (let attempt = 0; attempt < 6; attempt++) {
    if (await withLock(() => rebuild(label))) return;
    await sleep(10000); // another rebuild is running: retry after it
  }
  logger.warn('Reconstruction abandonnée (verrou occupé)', { label });
}

const TRIGGER_OPTS = { database: DATABASE_ID, region: REGION, retry: false, timeoutSeconds: 120, memory: '512MiB', maxInstances: 3 };
const contentTrigger = (document) => onDocumentWritten({ ...TRIGGER_OPTS, document }, (event) => {
  const { coll, id } = { coll: document.split('/')[0], id: event.params.id };
  if (coll === 'app_settings' && !SETTINGS_DOCS.includes(id)) return null;
  return onContentChange(event, `${coll}/${id}`);
});

exports.siteFormationsChanged = contentTrigger('formations/{id}');
exports.siteAccompagnementsChanged = contentTrigger('accompagnements/{id}');
exports.siteRealisationsChanged = contentTrigger('realisations/{id}');
exports.siteBlogChanged = contentTrigger('blog_posts/{id}');
exports.sitePartnersChanged = contentTrigger('partners/{id}');
exports.siteSettingsChanged = contentTrigger('app_settings/{id}');
exports.siteCoursesChanged = contentTrigger('elearning_courses/{id}');

// ---------------------------------------------------------------------------------------------
// Public endpoint
//   ?content          → the public content (JSON)
//   ?file=<name>      → an image or file moved out of Firestore
//   ?catalogue=<ver>  → the catalogue PDF (add &dl=1 to download it)

const FILE_RE = /^[a-f0-9]{32}\.(jpg|png|webp|gif|svg|avif|pdf)$/;

exports.siteContent = onRequest(
  { region: REGION, invoker: 'public', timeoutSeconds: 120, memory: '512MiB', maxInstances: 10, concurrency: 80 },
  async (req, res) => {
    const origin = req.get('origin');
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Vary', 'Origin');
    }
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Max-Age', '86400');
      return res.status(204).send('');
    }
    if (req.method !== 'GET') return res.status(405).send('');
    try {
      if (typeof req.query.file === 'string') {
        if (!FILE_RE.test(req.query.file)) return res.status(404).send('');
        const file = bucket().file(FILES_DIR + req.query.file);
        const [buf] = await file.download();
        const ext = req.query.file.split('.').pop();
        res.set('Content-Type', TYPE_OF_EXT[ext] || 'application/octet-stream');
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        if (ext === 'svg') res.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");
        return res.status(200).send(buf);
      }
      if (typeof req.query.catalogue === 'string') {
        const content = await readContent();
        const cat = content.catalogue;
        if (!cat || String(cat.version) !== req.query.catalogue) return res.status(404).send('');
        const [buf] = await bucket().file(`site/catalogue-${cat.version}.pdf`).download();
        const fileName = (cat.name || 'Catalogue-CICEXF.pdf').replace(/[^\w.() -]/g, '_');
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', `${req.query.dl ? 'attachment' : 'inline'}; filename="${fileName}"`);
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        return res.status(200).send(buf);
      }
      const content = await readContent();
      res.set('Cache-Control', 'public, max-age=60');
      return res.status(200).json(content);
    } catch (e) {
      if (e.code === 404) return res.status(404).send('');
      logger.error('siteContent', { error: e.message });
      return res.status(e.status || 500).json({ error: 'Contenu momentanément indisponible' });
    }
  }
);

exports.readSiteContent = readContent;
