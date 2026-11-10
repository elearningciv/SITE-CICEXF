// E-learning : dès qu'un certificat est délivré, il est envoyé en PDF à l'adresse e-mail que l'apprenant
// a utilisée lors de son inscription. Le téléchargement depuis le site reste disponible.
// Le PDF est dessiné par le même code que sur le site (functions/certificate/draw.cjs, généré depuis
// src/lib/certificateDraw.ts par `node scripts/build-certificate-function.mjs`).
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const { logger } = require('firebase-functions');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const DATABASE_ID = 'ai-studio-cicexfcabinetint-be0c0f21-7527-4112-ae7f-82c61d321a9c';
const SENDER = 'elearningciv@gmail.com';
const REPLY_TO = 'cabinetcicexf@gmail.com';
const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD');

if (!getApps().length) initializeApp();
const db = getFirestore(DATABASE_ID);

const draw = require('./certificate/draw.cjs');

/** PNG read from disk, in the form the drawing expects (data URL + pixel size read from the header) */
function pngImage(file) {
  try {
    const buf = fs.readFileSync(path.join(__dirname, 'certificate', file));
    return { data: `data:image/png;base64,${buf.toString('base64')}`, w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  } catch (err) {
    logger.warn('Image du certificat absente', { file, error: err.message });
    return null;
  }
}
const IMAGES = { logo: pngImage('logo-cicexf.png'), signature: pngImage('signature.png') };

const toIso = (v) => (v && typeof v.toDate === 'function' ? v.toDate().toISOString() : v || null);
const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Same fields as the certificate shown on the site */
function certificateOf(d) {
  return {
    number: d.number, courseId: d.courseId, courseTitle: d.courseTitle, lastName: d.lastName, firstName: d.firstName,
    startedAt: toIso(d.startedAt), finishedAt: toIso(d.finishedAt), issuedAt: toIso(d.issuedAt),
    average: d.average, hours: d.hours, stats: d.stats, simulation: !!d.simulation
  };
}

function buildPdf(cert) {
  const { jsPDF } = require('jspdf');
  const QRCode = require('qrcode');
  const doc = draw.drawCertificate({ jsPDF, QRCode }, cert, IMAGES);
  return Buffer.from(doc.output('arraybuffer'));
}

function buildMail(cert) {
  const name = `${cert.firstName} ${cert.lastName}`.replace(/\s+/g, ' ').trim();
  const verifyUrl = draw.certificateVerifyUrl(cert.number);
  const date = draw.formatFrenchDate(cert.issuedAt);
  const specimen = cert.simulation
    ? '<p style="margin:0 0 16px;color:#8A2E1C;font-weight:bold">Spécimen de démonstration (mode simulation), sans valeur officielle.</p>'
    : '';
  const subject = cert.simulation
    ? `Spécimen de certificat CICEXF : ${cert.courseTitle}`
    : `Votre certificat CICEXF : ${cert.courseTitle}`;
  const html = `
  <div style="background:#f4f6f9;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-top:6px solid #003B6F;border-radius:8px;overflow:hidden">
      <div style="padding:24px 28px">
        <p style="margin:0 0 4px;color:#8A2E1C;font-size:12px;font-weight:bold;letter-spacing:2px">E-LEARNING CICEXF</p>
        <h1 style="margin:0 0 18px;color:#003B6F;font-size:22px">Félicitations, ${escapeHtml(cert.firstName || name)} !</h1>
        ${specimen}
        <p style="margin:0 0 14px;color:#1e293b;font-size:15px;line-height:1.6">
          Vous avez validé la certification <strong>« ${escapeHtml(cert.courseTitle)} »</strong>.
          Votre certificat de réussite, délivré le ${escapeHtml(date)}, est joint à cet e-mail au format PDF.
        </p>
        <table role="presentation" style="margin:0 0 18px;border-left:4px solid #C9933F;background:#f8f5ef;width:100%">
          <tr><td style="padding:12px 16px;color:#1e293b;font-size:14px;line-height:1.7">
            Titulaire : <strong>${escapeHtml(name.toLocaleUpperCase('fr-FR'))}</strong><br>
            Résultat obtenu : <strong>${escapeHtml(cert.average)} %</strong><br>
            N° du certificat : <strong style="color:#8A2E1C">${escapeHtml(cert.number)}</strong>
          </td></tr>
        </table>
        <p style="margin:0 0 18px;color:#1e293b;font-size:14px;line-height:1.6">
          Le QR code imprimé sur le certificat permet à toute personne de vérifier son authenticité.
          Vous pouvez aussi le retrouver et le télécharger à tout moment depuis votre espace e-learning.
        </p>
        <p style="margin:0 0 22px">
          <a href="${escapeHtml(verifyUrl)}" style="display:inline-block;background:#003B6F;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:6px">Vérifier mon certificat en ligne</a>
        </p>
        <p style="margin:0;color:#475569;font-size:13px;line-height:1.6">
          Cabinet International de Consultance, d'Expertise et de Formation (CICEXF), Abidjan<br>
          <a href="https://www.cicexf.com/e-learning" style="color:#003B6F">www.cicexf.com/e-learning</a>
        </p>
      </div>
    </div>
  </div>`;
  const text = [
    `Félicitations, ${cert.firstName || name} !`,
    cert.simulation ? 'Spécimen de démonstration (mode simulation), sans valeur officielle.' : '',
    `Vous avez validé la certification « ${cert.courseTitle} ». Votre certificat de réussite, délivré le ${date}, est joint à cet e-mail (PDF).`,
    `Résultat obtenu : ${cert.average} %`,
    `N° du certificat : ${cert.number}`,
    `Vérifier le certificat : ${verifyUrl}`,
    'CICEXF, Abidjan · www.cicexf.com/e-learning'
  ].filter(Boolean).join('\n\n');
  return { subject, html, text };
}

/** Recipient: the address saved with the certificate (the one of the learner's account) */
async function recipientOf(d) {
  if (d.email) return d.email;
  if (!d.uid) return null;
  try { return (await getAuth().getUser(d.uid)).email || null; } catch { return null; }
}

exports.certificateMail = onDocumentCreated(
  {
    document: 'certificates/{number}',
    database: DATABASE_ID,
    region: 'europe-west1',
    secrets: [GMAIL_APP_PASSWORD],
    retry: false,
    timeoutSeconds: 60,
    memory: '512MiB',
    maxInstances: 5
  },
  async (event) => {
    const snap = event.data;
    const d = snap && snap.data();
    if (!d) return;
    const to = await recipientOf(d);
    if (!to) {
      logger.warn('Certificat sans adresse e-mail : envoi impossible', { number: d.number });
      return;
    }
    const cert = certificateOf(d);
    try {
      const pdf = buildPdf(cert);
      const { subject, html, text } = buildMail(cert);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: SENDER, pass: GMAIL_APP_PASSWORD.value().replace(/\s+/g, '') }
      });
      await transporter.sendMail({
        from: `"E-learning CICEXF" <${SENDER}>`,
        to,
        replyTo: REPLY_TO,
        subject,
        html,
        text,
        attachments: [{ filename: draw.certificateFileName(cert), content: pdf, contentType: 'application/pdf' }]
      });
      await snap.ref.update({ emailedAt: Timestamp.now() });
      logger.info('Certificat envoyé par e-mail', { number: d.number });
    } catch (err) {
      logger.error('Envoi du certificat par e-mail impossible', { number: d.number, error: err.message });
      await snap.ref.update({ emailError: String(err.message || err).slice(0, 300) }).catch(() => {});
    }
  }
);

// Exposed for local tests
exports._test = { buildPdf, buildMail, certificateOf };
