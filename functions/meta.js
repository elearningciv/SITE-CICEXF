// Facebook & Instagram (Meta) : un seul point d'entrée « webhook » pour
//  1. les prospects des publicités à formulaire (Lead Ads) -> collection `prospects` ;
//  2. les messages reçus par la page Facebook (Messenger) et le compte Instagram professionnel
//     -> réponse automatique d'ADILINE + première prise de contact enregistrée dans `prospects`.
// Uniquement des personnes qui ont elles-mêmes écrit à la page ou rempli un formulaire (pas de démarchage).
//
// Codes d'accès (Secret Manager, saisis par le cabinet dans son terminal, jamais dans le code) :
//  META_VERIFY_TOKEN  phrase libre choisie par le cabinet, recopiée dans l'application Meta
//  META_APP_SECRET    « Clé secrète » de l'application Meta (vérifie que les envois viennent bien de Meta)
//  META_PAGE_TOKEN    jeton d'accès de la page Facebook (lecture des prospects, envoi des réponses)
const crypto = require('crypto');
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { logger } = require('firebase-functions');
const { FieldValue, Timestamp } = require('firebase-admin/firestore');
const { answerVisitor, db } = require('./adiline');

const META_VERIFY_TOKEN = defineSecret('META_VERIFY_TOKEN');
const META_APP_SECRET = defineSecret('META_APP_SECRET');
const META_PAGE_TOKEN = defineSecret('META_PAGE_TOKEN');

const GRAPH = 'https://graph.facebook.com/v23.0';
const FALLBACK_REPLY = "Merci pour votre message ! Un conseiller du CICEXF vous répond très vite. Vous pouvez aussi nous joindre au +225 07 01 97 00 65 (WhatsApp) ou sur https://www.cicexf.com";

async function graph(pathAndQuery, token, init = {}) {
  const sep = pathAndQuery.includes('?') ? '&' : '?';
  const res = await fetch(`${GRAPH}/${pathAndQuery}${sep}access_token=${encodeURIComponent(token)}`, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Graph ${res.status}: ${JSON.stringify(body.error || body).slice(0, 300)}`);
  return body;
}

function validSignature(req, appSecret) {
  const header = req.get('x-hub-signature-256') || '';
  if (!header.startsWith('sha256=') || !req.rawBody) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', appSecret).update(req.rawBody).digest('hex');
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---------------------------------------------------------------------------
// 1. Publicités à formulaire -> prospects
// ---------------------------------------------------------------------------
const FIELD_ALIASES = {
  name: ['full_name', 'nom_complet', 'nom', 'name'],
  first: ['first_name', 'prenom', 'prénom'],
  last: ['last_name', 'nom_de_famille'],
  email: ['email', 'e-mail', 'adresse_e-mail'],
  phone: ['phone_number', 'telephone', 'téléphone', 'whatsapp', 'phone'],
  company: ['company_name', 'entreprise', 'organisation', 'structure'],
  job: ['job_title', 'fonction', 'poste']
};

async function saveLead(leadgenId, token) {
  const ref = db.collection('prospects').doc(`meta_lead_${leadgenId}`);
  if ((await ref.get()).exists) return; // Meta peut renvoyer le même événement
  const lead = await graph(`${leadgenId}?fields=created_time,field_data,ad_name,campaign_name,form_id,platform`, token);
  const values = {};
  for (const f of lead.field_data || []) values[String(f.name).toLowerCase()] = (f.values || []).join(', ');
  const pick = (key) => FIELD_ALIASES[key].map(k => values[k]).find(Boolean) || '';
  const used = new Set(Object.values(FIELD_ALIASES).flat());
  const extra = Object.entries(values).filter(([k]) => !used.has(k)).map(([k, v]) => `${k} : ${v}`);
  const platform = /ig|instagram/i.test(lead.platform || '') ? 'Instagram' : 'Facebook';

  await ref.set({
    name: pick('name') || [pick('first'), pick('last')].filter(Boolean).join(' ') || `Prospect ${platform}`,
    email: pick('email'),
    phone: pick('phone'),
    company: pick('company'),
    type: 'Contact / Renseignement',
    target: lead.campaign_name || lead.ad_name || `Formulaire ${platform}`,
    notes: [`Source : publicité à formulaire ${platform}`, pick('job') && `Fonction : ${pick('job')}`, ...extra].filter(Boolean).join(' | '),
    channel: platform,
    status: 'Nouveau',
    createdAt: Timestamp.now()
  });
  logger.info('Prospect Meta enregistré', { leadgenId, platform });
}

// ---------------------------------------------------------------------------
// 2. Messages Messenger / Instagram -> réponse d'ADILINE
// ---------------------------------------------------------------------------
async function handleMessage(platform, event, token) {
  const senderId = event.sender && event.sender.id;
  const text = event.message && !event.message.is_echo && event.message.text;
  if (!senderId || !text) return;

  const convRef = db.collection('social_conversations').doc(`${platform}_${senderId}`);
  const conv = await convRef.get();
  const history = conv.exists ? (conv.data().messages || []) : [];

  // Première prise de contact : enregistrée comme demande, visible dans « Devis & Inscriptions »
  if (!conv.exists) {
    await db.collection('prospects').add({
      name: `Contact ${platform}`,
      email: '',
      phone: '',
      type: 'Contact / Renseignement',
      target: `Message ${platform}`,
      notes: `Premier message : ${text.slice(0, 500)} | Répondre depuis la messagerie ${platform} de la page`,
      channel: platform,
      status: 'Nouveau',
      createdAt: Timestamp.now()
    });
  }

  let reply = FALLBACK_REPLY;
  try {
    reply = (await answerVisitor(text, history)) || FALLBACK_REPLY;
  } catch (err) {
    logger.error('ADILINE (messagerie) : échec de la réponse', { error: err.message });
  }

  await graph('me/messages', token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient: { id: senderId }, messaging_type: 'RESPONSE', message: { text: reply.slice(0, 1900) } })
  });

  const messages = [...history, { role: 'user', text: text.slice(0, 2000) }, { role: 'model', text: reply.slice(0, 2000) }].slice(-20);
  await convRef.set({ platform, senderId, messages, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

exports.metaWebhook = onRequest(
  { region: 'europe-west1', invoker: 'public', timeoutSeconds: 60, memory: '512MiB', maxInstances: 3, secrets: [META_VERIFY_TOKEN, META_APP_SECRET, META_PAGE_TOKEN] },
  async (req, res) => {
    // Vérification de l'adresse par Meta lors de la configuration
    if (req.method === 'GET') {
      if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === META_VERIFY_TOKEN.value()) {
        return res.status(200).send(String(req.query['hub.challenge'] || ''));
      }
      return res.status(403).send('Forbidden');
    }
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');
    if (!validSignature(req, META_APP_SECRET.value())) {
      logger.warn('Webhook Meta : signature invalide');
      return res.status(401).send('Invalid signature');
    }

    const body = req.body || {};
    const token = META_PAGE_TOKEN.value();
    const platform = body.object === 'instagram' ? 'Instagram' : 'Facebook';
    const jobs = [];
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'leadgen' && change.value && change.value.leadgen_id) jobs.push(saveLead(change.value.leadgen_id, token));
      }
      for (const event of entry.messaging || []) jobs.push(handleMessage(platform, event, token));
    }
    const results = await Promise.allSettled(jobs);
    results.filter(r => r.status === 'rejected').forEach(r => logger.error('Webhook Meta : traitement en échec', { error: r.reason && r.reason.message }));
    res.status(200).send('EVENT_RECEIVED');
  }
);
