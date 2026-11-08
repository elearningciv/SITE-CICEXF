// E-learning certificate (A4 landscape), drawn as a vector PDF with jsPDF.
// Same design as the validated model: navy and burgundy corners, gold frame, logo, seal and signature block.
import type { Certificate } from './elearningApi';

const NAVY: [number, number, number] = [0, 59, 111];
const BURGUNDY: [number, number, number] = [138, 26, 36];
const GOLD: [number, number, number] = [201, 147, 63];
const GOLD_LIGHT: [number, number, number] = [242, 194, 122];
const INK: [number, number, number] = [15, 23, 42];
const SLATE: [number, number, number] = [51, 65, 85];
const MUTED: [number, number, number] = [71, 85, 105];
const PT = 0.3528; // 1 pt in mm

export const formatFrenchDate = (iso: string | null | undefined) => {
  if (!iso) return '';
  const s = new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Abidjan' });
  return s.replace(/^1 /, '1er ');
};

export const certificateName = (c: Pick<Certificate, 'lastName' | 'firstName'>) =>
  `${c.lastName} ${c.firstName}`.replace(/\s+/g, ' ').trim().toLocaleUpperCase('fr-FR');

async function imageData(url: string): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok || !(res.headers.get('content-type') || '').startsWith('image/')) return null;
    // The hosting CDN may answer in WebP or JPEG instead of PNG: the image is redrawn
    // and re-encoded as PNG (transparency kept) so that the PDF always receives a clean PNG.
    const objectUrl = URL.createObjectURL(await res.blob());
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = objectUrl;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      return { data: canvas.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

export async function buildCertificatePdf(c: Certificate) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
  const W = 297, H = 210, CX = W / 2;
  const [logo, signature] = await Promise.all([imageData('/elearning/logo-cicexf.png'), imageData('/elearning/signature.png?v=2')]);

  doc.setProperties({
    title: `Certificat ${c.number}`,
    subject: c.courseTitle,
    author: 'CICEXF',
    creator: 'E-learning CICEXF · www.cicexf.com'
  });

  // Paper
  doc.setFillColor(255, 253, 248);
  doc.rect(0, 0, W, H, 'F');

  // Corner ornaments
  doc.setFillColor(...NAVY);
  doc.triangle(0, 0, 62, 0, 0, 46, 'F');
  doc.setFillColor(...BURGUNDY);
  doc.triangle(W, H, W - 62, H, W, H - 46, 'F');
  doc.setFillColor(...GOLD);
  doc.triangle(62, 0, 70, 0, 0, 52, 'F');
  doc.triangle(62, 0, 0, 52, 0, 46, 'F');
  doc.triangle(W - 62, H, W - 70, H, W, H - 52, 'F');
  doc.triangle(W - 62, H, W, H - 52, W, H - 46, 'F');
  doc.setDrawColor(236, 214, 178);
  doc.setLineWidth(0.35);
  for (const r of [30, 40, 50]) {
    doc.circle(W, 0, r, 'S');
    doc.circle(0, H, r, 'S');
  }

  // Frame
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(1.6);
  doc.rect(8.8, 8.8, W - 17.6, H - 17.6, 'S');
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.rect(12.05, 12.05, W - 24.1, H - 24.1, 'S');

  const centered = (text: string, y: number, charSpace = 0) => {
    const w = doc.getTextWidth(text) + charSpace * Math.max(0, text.length - 1);
    doc.text(text, CX - w / 2, y, charSpace ? { charSpace } : undefined);
    return w;
  };

  // Logo and title
  let y = 15;
  if (logo) {
    const h = 25, w = (h * logo.w) / logo.h;
    doc.addImage(logo.data, 'PNG', CX - w / 2, y, w, h);
  }
  y += 25 + 4 + 31 * PT * 0.78;
  doc.setFont('times', 'bold');
  doc.setFontSize(31);
  doc.setTextColor(...NAVY);
  centered('CERTIFICAT DE RÉUSSITE', y, 31 * PT * 0.1);

  y += 2 + 10 * PT;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...BURGUNDY);
  centered('E-LEARNING CICEXF', y + 1.2, 10 * PT * 0.32);

  y += 5.5;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.line(CX - 26, y, CX + 26, y);
  doc.setLineWidth(0.4);
  doc.line(CX - 35, y, CX + 35, y);

  // Learner
  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11.5);
  doc.setTextColor(...SLATE);
  centered("Le Cabinet International de Consultance, d'Expertise et de Formation certifie que", y);

  const name = certificateName(c);
  let size = 30;
  doc.setFont('times', 'bold');
  doc.setFontSize(size);
  while (size > 18 && doc.getTextWidth(name) + name.length * size * PT * 0.04 > 230) doc.setFontSize((size -= 1));
  y += 4 + size * PT * 0.95;
  doc.setTextColor(...INK);
  const nameW = centered(name, y, size * PT * 0.04);
  doc.setDrawColor(...BURGUNDY);
  doc.setLineWidth(0.7);
  doc.line(CX - nameW / 2, y + 2.6, CX + nameW / 2, y + 2.6);

  y += 11;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11.5);
  doc.setTextColor(...SLATE);
  centered('a suivi et validé avec succès la certification en ligne', y);

  // Course title: not underlined, sentence case (as written in the course file)
  doc.setFont('times', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...BURGUNDY);
  const lines: string[] = doc.splitTextToSize(c.courseTitle, 220);
  y += 3 + 19 * PT * 0.9;
  for (const line of lines) {
    centered(line, y);
    y += 19 * PT * 1.25;
  }

  // Dates
  y += 1.5;
  doc.setFontSize(11);
  const parts: [string, boolean][] = [
    ['Formation suivie du ', false], [formatFrenchDate(c.startedAt), true], [' au ', false], [formatFrenchDate(c.finishedAt), true]
  ];
  const widthOf = ([t, b]: [string, boolean]) => { doc.setFont('helvetica', b ? 'bold' : 'normal'); return doc.getTextWidth(t); };
  let x = CX - parts.reduce((n, p) => n + widthOf(p), 0) / 2;
  for (const p of parts) {
    const w = widthOf(p);
    doc.setTextColor(...(p[1] ? INK : SLATE));
    doc.text(p[0], x, y);
    x += w;
  }

  // Facts
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.6);
  const s = c.stats;
  const facts = [
    `${s.parts} parties · ${s.chapters} chapitres · ${s.modules} modules · ${s.quizzes} quiz`,
    `Durée estimée : ${c.hours} heures`,
    `Résultat moyen : ${c.average} %`
  ];
  const pad = 3.4, gap = 6, chipH = 6;
  const widths = facts.map((f) => doc.getTextWidth(f) + pad * 2);
  x = CX - (widths.reduce((a, b) => a + b, 0) + gap * (facts.length - 1)) / 2;
  facts.forEach((f, i) => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(x, y, widths[i], chipH, 3, 3, 'F');
    doc.setTextColor(...MUTED);
    doc.text(f, x + pad, y + chipH / 2 + 9.6 * PT * 0.35);
    x += widths[i] + gap;
  });

  // Bottom: reference, seal, signature
  const bottom = H - 13 - 2;
  const left = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.4);
  doc.setTextColor(...NAVY);
  doc.text(`N° ${c.number}`, left, bottom - 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.6);
  doc.setTextColor(...MUTED);
  doc.text(`Délivré le ${formatFrenchDate(c.issuedAt)}`, left, bottom - 4.6);
  doc.text('Authenticité vérifiable sur www.cicexf.com/e-learning', left, bottom - 0.2);

  drawSeal(doc, CX, bottom - 20, 20);

  // Kept clear of the burgundy corner
  const signX = 205;
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const place = `Fait à Abidjan, le ${formatFrenchDate(c.issuedAt)}`;
  doc.text(place, signX - doc.getTextWidth(place) / 2, bottom - 31);
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.4);
  doc.line(signX - 34, bottom - 5.2, signX + 34, bottom - 5.2);
  if (signature) {
    // Stamp and signature of the manager, fitted in a 64 × 24 mm box resting on the line
    const scale = Math.min(64 / signature.w, 24 / signature.h);
    const w = signature.w * scale, h = signature.h * scale;
    doc.addImage(signature.data, 'PNG', signX - w / 2, bottom - 3.5 - h, w, h);
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.6);
  doc.setTextColor(...INK);
  const sign = 'Pour le CICEXF, le Gérant';
  doc.text(sign, signX - doc.getTextWidth(sign) / 2, bottom - 0.6);

  return doc;
}

/** Round seal with the text around the ring (characters placed one by one along the circle) */
function drawSeal(doc: any, cx: number, cy: number, r: number) {
  const u = r / 60; // the model's seal is drawn in a 120-unit box
  doc.setFillColor(...BURGUNDY);
  doc.circle(cx, cy, 57 * u, 'F');
  doc.setDrawColor(...GOLD_LIGHT);
  doc.setLineWidth(1.2 * u);
  doc.circle(cx, cy, 53 * u, 'S');
  doc.setLineWidth(1 * u);
  doc.circle(cx, cy, 34 * u, 'S');

  const ring = 'CABINET INTERNATIONAL · CICEXF · ABIDJAN · ';
  const radius = 44 * u;
  const fontPt = (8.6 * u) / PT;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontPt);
  doc.setTextColor(255, 255, 255);
  const spacing = 1.6 * u;
  const total = [...ring].reduce((n, ch) => n + doc.getTextWidth(ch) + spacing, 0);
  const stretch = (2 * Math.PI * radius) / total; // spread the text evenly around the whole ring
  let theta = Math.PI;
  for (const ch of ring) {
    const adv = (doc.getTextWidth(ch) + spacing) * stretch;
    if (ch !== ' ') {
      const deg = (Math.atan2(-Math.cos(theta), -Math.sin(theta)) * 180) / Math.PI;
      doc.text(ch, cx + radius * Math.cos(theta), cy + radius * Math.sin(theta), { angle: deg });
    }
    theta += adv / radius;
  }

  doc.setFont('times', 'bold');
  doc.setFontSize((15 * u) / PT);
  doc.setTextColor(255, 255, 255);
  doc.text('CICEXF', cx - doc.getTextWidth('CICEXF') / 2, cy - 3 * u);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize((6.4 * u) / PT);
  doc.setTextColor(...GOLD_LIGHT);
  const el = 'E-LEARNING', cs = 1 * u;
  doc.text(el, cx - (doc.getTextWidth(el) + cs * (el.length - 1)) / 2, cy + 10 * u, { charSpace: cs });
}

export async function downloadCertificate(c: Certificate) {
  const doc = await buildCertificatePdf(c);
  const slug = certificateName(c).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  doc.save(`certificat-cicexf-${slug || 'apprenant'}-${c.number}.pdf`);
}
