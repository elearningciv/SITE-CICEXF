// Envoie un e-mail au cabinet à chaque nouvelle demande enregistrée dans `prospects`
// (inscriptions, demandes de devis, formulaires de contact, ADILINE).
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const { logger } = require('firebase-functions');
const nodemailer = require('nodemailer');

// Assistante virtuelle ADILINE (Gemini + contenu du site)
exports.adilineChat = require('./adiline').adilineChat;

// Compte Gmail qui envoie les notifications, et destinataires
// (le mot de passe d'application GMAIL_APP_PASSWORD appartient à ce compte)
const SENDER = 'elearningciv@gmail.com';
const RECIPIENTS = ['cabinetcicexf@gmail.com'];
const CC = ['elearningciv@gmail.com'];
const ADMIN_URL = 'https://cicexf.gestionsaas.org/admin';

// Mot de passe d'application Gmail, stocké dans Secret Manager (jamais dans le code)
const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD');

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const FIELDS = [
  ['Type de demande', 'type'],
  ['Nom', 'name'],
  ['Téléphone', 'phone'],
  ['E-mail', 'email'],
  ['Formation / sujet', 'target'],
  ['Session souhaitée', 'session'],
  ['Modalité', 'modality'],
  ['Entreprise', 'company'],
  ['Participants', 'participants'],
  ['Canal', 'channel'],
  ['Message / remarques', 'notes']
];

exports.notifyNewProspect = onDocumentCreated(
  {
    document: 'prospects/{prospectId}',
    database: 'ai-studio-cicexfcabinetint-be0c0f21-7527-4112-ae7f-82c61d321a9c',
    region: 'europe-west1',
    secrets: [GMAIL_APP_PASSWORD],
    retry: false
  },
  async (event) => {
    const p = event.data?.data();
    if (!p) return;

    const rows = FIELDS
      .filter(([, key]) => p[key] && String(p[key]).trim() !== '')
      .map(([label, key]) => `<tr><td style="padding:6px 12px;color:#475569;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 12px;color:#0f172a;font-weight:600">${escapeHtml(p[key]).replace(/\n/g, '<br>')}</td></tr>`)
      .join('');

    const text = FIELDS
      .filter(([, key]) => p[key] && String(p[key]).trim() !== '')
      .map(([label, key]) => `${label} : ${p[key]}`)
      .join('\n');

    const subject = `Nouvelle demande CICEXF : ${p.type || 'Demande'} - ${p.name || 'Sans nom'}`;

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px">
        <h2 style="color:#003B6F;margin:0 0 4px">Nouvelle demande reçue sur le site</h2>
        <p style="color:#475569;margin:0 0 16px">Enregistrée automatiquement depuis cicexf.gestionsaas.org</p>
        <table style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0">${rows}</table>
        <p style="margin:20px 0">
          <a href="${ADMIN_URL}" style="background:#8A2E1C;color:#ffffff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Ouvrir l'administration</a>
        </p>
        <p style="color:#64748b;font-size:12px">Répondez directement à cet e-mail pour écrire au demandeur.</p>
      </div>`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      // Google affiche le code par groupes de 4 : on retire les espaces éventuels
      auth: { user: SENDER, pass: GMAIL_APP_PASSWORD.value().replace(/\s+/g, '') }
    });

    try {
      await transporter.sendMail({
        from: `"Site CICEXF" <${SENDER}>`,
        to: RECIPIENTS,
        cc: CC,
        replyTo: p.email || undefined,
        subject,
        text: `Nouvelle demande reçue sur le site CICEXF\n\n${text}\n\nAdministration : ${ADMIN_URL}`,
        html
      });
      logger.info('Notification envoyée', { prospectId: event.params.prospectId });
    } catch (err) {
      logger.error('Échec de l\'envoi de la notification', { prospectId: event.params.prospectId, error: err.message });
    }
  }
);
