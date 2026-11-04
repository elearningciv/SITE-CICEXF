import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { store, UPLOAD_DIR, newId } from './server/store.ts';
import { login, logout, currentAdmin, requireAdmin } from './server/auth.ts';
import { aiAvailable, aiAnswer, offlineAnswer, translateBatch } from './server/assistant.ts';
import { COLLECTIONS, type CollectionName, type Content, type InboxMessage } from './src/types.ts';

const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT || 3000);
const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
app.use(express.json({ limit: '8mb' }));

// Requests that change data must be JSON (blocks cross-site form posts)
app.use('/api', (req, res, next) => {
  if (req.method !== 'GET' && !req.is('application/json')) return res.status(415).json({ error: 'JSON attendu.' });
  next();
});

// Simple per-IP rate limiter for public write routes
function limiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const now = Date.now();
    const key = req.ip || 'x';
    const list = (hits.get(key) || []).filter(t => now - t < windowMs);
    if (list.length >= max) return res.status(429).json({ error: 'Trop de requêtes, réessayez dans un instant.' });
    list.push(now);
    hits.set(key, list);
    next();
  };
}

const str = (v: unknown, max = 4000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// ---------- Public ----------

app.get('/api/content', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.json(store.getContent());
});

app.get('/api/session', (req, res) => {
  const email = currentAdmin(req);
  res.json(email ? { admin: true, email } : { admin: false });
});

app.post('/api/login', limiter(20, 15 * 60_000), login);
app.post('/api/logout', logout);

const KINDS: InboxMessage['kind'][] = ['contact', 'inscription', 'etude', 'partenariat'];
app.post('/api/messages', limiter(10, 10 * 60_000), (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot field filled by bots
  const kind = KINDS.includes(b.kind) ? b.kind : 'contact';
  const name = str(b.name, 120), email = str(b.email, 160), phone = str(b.phone, 40), message = str(b.message, 4000);
  if (!name || (!email && !phone) || !message) {
    return res.status(400).json({ error: 'Merci d\'indiquer votre nom, un moyen de contact et votre message.' });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Adresse e-mail invalide.' });
  store.addMessage({ kind, name, email, phone, subject: str(b.subject, 200), message });
  res.json({ ok: true });
});

app.post('/api/assistant', limiter(40, 10 * 60_000), async (req, res) => {
  const message = str(req.body?.message, 1500);
  const lang = /^[a-z]{2}$/.test(req.body?.lang) ? req.body.lang : 'fr';
  const history = Array.isArray(req.body?.history) ? req.body.history.filter((t: any) => t && typeof t.text === 'string').slice(-10) : [];
  const conversationId = /^[a-z0-9-]{6,40}$/i.test(req.body?.conversationId) ? req.body.conversationId : newId('c');
  const visitor = /^[a-z0-9-]{6,40}$/i.test(req.body?.visitorId) ? req.body.visitorId : 'anonyme';
  if (!message) return res.status(400).json({ error: 'Message vide.' });

  const content = store.getContent();
  let answer = '';
  let source: 'ai' | 'local' = 'local';
  if (aiAvailable()) {
    try { answer = await aiAnswer(content, message, history, lang); source = 'ai'; }
    catch (err) { console.error('[assistant]', (err as Error).message); }
  }
  if (!answer) answer = offlineAnswer(content, message, lang);

  store.logTurns(conversationId, visitor, lang, [{ role: 'user', text: message }, { role: 'assistant', text: answer }]);

  // A visitor who leaves an e-mail or phone number in the chat becomes a lead in the inbox
  const email = message.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0];
  const phone = message.match(/(\+?\d[\d\s.-]{7,}\d)/)?.[0];
  if (email || phone) {
    const prev = history.filter((t: any) => t.role === 'user').map((t: any) => t.text).join('\n');
    store.addMessage({ kind: 'assistant', name: 'Visiteur (assistant)', email: email || '', phone: phone || '', subject: `Contact laissé à ${content.settings.assistantName}`, message: `${prev}\n${message}`.trim().slice(0, 4000) });
  }
  res.json({ answer, conversationId, source });
});

// ---------- Administration (principal administrator only) ----------

const admin = express.Router();
admin.use(requireAdmin);

admin.get('/status', (_req, res) => res.json({ ai: aiAvailable() }));

admin.put('/settings', (req, res) => {
  const c = store.getContent();
  const incoming = req.body || {};
  const settings = { ...c.settings };
  for (const [k, v] of Object.entries(incoming)) {
    if (!(k in settings)) continue;
    if (k === 'stats' && Array.isArray(v)) settings.stats = v.slice(0, 8).map((s: any) => ({ value: str(s?.value, 20), label: str(s?.label, 80) }));
    else if (k === 'languages' && Array.isArray(v)) settings.languages = ['fr', ...v.filter((l: any) => /^[a-z]{2}$/.test(l) && l !== 'fr')].slice(0, 8);
    else if (k === 'palette' && ['lagune', 'foret', 'nuit', 'petrole'].includes(v as string)) settings.palette = v as any;
    else if (typeof v === 'string') (settings as any)[k] = str(v, 6000);
  }
  for (const l of settings.languages) if (l !== 'fr') c.translations[l] ||= {};
  res.json(store.saveContent({ ...c, settings }));
});

admin.put('/collection/:name', (req, res) => {
  const name = req.params.name as CollectionName;
  if (!COLLECTIONS.includes(name)) return res.status(404).json({ error: 'Rubrique inconnue.' });
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length > 2000) return res.status(400).json({ error: 'Liste invalide.' });
  const clean = items.map((it: any) => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(it || {})) if (typeof v === 'string' && /^[a-zA-Z]{1,30}$/.test(k)) out[k] = v.slice(0, 20000);
    out.id ||= newId(name.slice(0, 3));
    return out;
  });
  const c = store.getContent();
  res.json(store.saveContent({ ...c, [name]: clean } as Content));
});

admin.put('/translations/:lang', (req, res) => {
  const lang = req.params.lang;
  if (!/^[a-z]{2}$/.test(lang) || lang === 'fr') return res.status(400).json({ error: 'Langue invalide.' });
  const map = req.body?.map;
  if (!map || typeof map !== 'object') return res.status(400).json({ error: 'Traductions invalides.' });
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(map)) if (typeof v === 'string' && v.trim()) clean[k.slice(0, 20000)] = v.slice(0, 20000);
  const c = store.getContent();
  res.json(store.saveContent({ ...c, translations: { ...c.translations, [lang]: clean } }));
});

admin.post('/translate', async (req, res) => {
  if (!aiAvailable()) return res.status(503).json({ error: 'Traduction automatique indisponible : ajoutez GEMINI_API_KEY sur le serveur. Vous pouvez traduire à la main en attendant.' });
  const lang = str(req.body?.lang, 2);
  const strings = Array.isArray(req.body?.strings) ? req.body.strings.filter((s: unknown) => typeof s === 'string' && s.trim()).slice(0, 600) : [];
  if (!/^[a-z]{2}$/.test(lang) || !strings.length) return res.status(400).json({ error: 'Requête invalide.' });
  try {
    res.json({ map: await translateBatch(strings, lang) });
  } catch (err) {
    console.error('[translate]', (err as Error).message);
    res.status(502).json({ error: 'Le service de traduction n\'a pas répondu. Réessayez.' });
  }
});

admin.get('/inbox', (_req, res) => res.json(store.getInbox()));
admin.patch('/inbox/:id', (req, res) => { store.updateMessage(req.params.id, { read: Boolean(req.body?.read) }); res.json({ ok: true }); });
admin.delete('/inbox/:id', (req, res) => { store.deleteMessage(req.params.id); res.json({ ok: true }); });
admin.get('/conversations', (_req, res) => res.json(store.getConversations()));
admin.delete('/conversations/:id', (req, res) => { store.deleteConversation(req.params.id); res.json({ ok: true }); });

// Images arrive already resized by the browser, as a data URL (webp, jpeg or png)
admin.post('/upload', (req, res) => {
  const m = String(req.body?.dataUrl || '').match(/^data:image\/(webp|jpeg|png);base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return res.status(400).json({ error: 'Image invalide (formats acceptés : WebP, JPEG, PNG).' });
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 3 * 1024 * 1024) return res.status(413).json({ error: 'Image trop lourde (3 Mo maximum).' });
  const file = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, file), buf);
  res.json({ url: `/uploads/${file}` });
});

app.use('/api/admin', admin);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Route inconnue.' }));
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true }));

// ---------- Front-end ----------

async function start() {
  if (isProd) {
    const dist = path.resolve('dist');
    app.use(express.static(dist, { index: false, maxAge: '1h' }));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`CapDev en ligne sur http://localhost:${PORT} (${aiAvailable() ? 'assistant IA actif' : 'assistant en mode hors ligne'})`));
}
start();
