// Fichier généré par scripts/build-certificate-function.mjs depuis src/lib/certificateDraw.ts : ne pas modifier.
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/lib/certificateDraw.ts
var certificateDraw_exports = {};
__export(certificateDraw_exports, {
  certificateFileName: () => certificateFileName,
  certificateName: () => certificateName,
  certificateVerifyUrl: () => certificateVerifyUrl,
  drawCertificate: () => drawCertificate,
  formatFrenchDate: () => formatFrenchDate
});
module.exports = __toCommonJS(certificateDraw_exports);
var NAVY = [0, 59, 111];
var BURGUNDY = [138, 26, 36];
var GOLD = [201, 147, 63];
var GOLD_LIGHT = [242, 194, 122];
var INK = [15, 23, 42];
var SLATE = [51, 65, 85];
var MUTED = [71, 85, 105];
var PT = 0.3528;
var formatFrenchDate = (iso) => {
  if (!iso) return "";
  const s = new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Abidjan" });
  return s.replace(/^1 /, "1er ");
};
var certificateName = (c) => `${c.lastName} ${c.firstName}`.replace(/\s+/g, " ").trim().toLocaleUpperCase("fr-FR");
var certificateVerifyUrl = (number) => `https://www.cicexf.com/e-learning#verifier/${encodeURIComponent(number)}`;
function drawQrCode(doc, QRCode, text, x, y, size) {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const quiet = 2;
  const cell = size / (n + quiet * 2);
  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, size, size, "F");
  doc.setFillColor(...INK);
  for (let r = 0; r < n; r++) {
    for (let col = 0; col < n; col++) {
      if (!qr.modules.get(r, col)) continue;
      let run = 1;
      while (col + run < n && qr.modules.get(r, col + run)) run++;
      doc.rect(x + (quiet + col) * cell, y + (quiet + r) * cell, run * cell, cell, "F");
      col += run - 1;
    }
  }
}
function drawCertificate({ jsPDF, QRCode }, c, { logo, signature }) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
  const W = 297, H = 210, CX = W / 2;
  doc.setProperties({
    title: `Certificat ${c.number}`,
    subject: c.courseTitle,
    author: "CICEXF",
    creator: "E-learning CICEXF · www.cicexf.com"
  });
  doc.setFillColor(255, 253, 248);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(...NAVY);
  doc.triangle(0, 0, 62, 0, 0, 46, "F");
  doc.setFillColor(...BURGUNDY);
  doc.triangle(W, H, W - 62, H, W, H - 46, "F");
  doc.setFillColor(...GOLD);
  doc.triangle(62, 0, 70, 0, 0, 52, "F");
  doc.triangle(62, 0, 0, 52, 0, 46, "F");
  doc.triangle(W - 62, H, W - 70, H, W, H - 52, "F");
  doc.triangle(W - 62, H, W, H - 52, W, H - 46, "F");
  doc.setDrawColor(236, 214, 178);
  doc.setLineWidth(0.35);
  for (const r of [30, 40, 50]) {
    doc.circle(W, 0, r, "S");
    doc.circle(0, H, r, "S");
  }
  if (c.simulation) {
    doc.setFont("times", "bold");
    doc.setFontSize(96);
    doc.setTextColor(244, 226, 230);
    const mark = "SPÉCIMEN";
    const mw = doc.getTextWidth(mark);
    const a = 22 * Math.PI / 180;
    doc.text(mark, W / 2 - mw / 2 * Math.cos(a), H / 2 + 14 + mw / 2 * Math.sin(a), { angle: 22 });
  }
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(1.6);
  doc.rect(8.8, 8.8, W - 17.6, H - 17.6, "S");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.rect(12.05, 12.05, W - 24.1, H - 24.1, "S");
  const centered = (text, y2, charSpace = 0) => {
    const w = doc.getTextWidth(text) + charSpace * Math.max(0, text.length - 1);
    doc.text(text, CX - w / 2, y2, charSpace ? { charSpace } : void 0);
    return w;
  };
  let y = 15;
  if (logo) {
    const h = 25, w = h * logo.w / logo.h;
    doc.addImage(logo.data, "PNG", CX - w / 2, y, w, h);
  }
  y += 25 + 4 + 31 * PT * 0.78;
  doc.setFont("times", "bold");
  doc.setFontSize(31);
  doc.setTextColor(...NAVY);
  centered("CERTIFICAT DE RÉUSSITE", y, 31 * PT * 0.1);
  y += 2 + 10 * PT;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BURGUNDY);
  centered("E-LEARNING CICEXF", y + 1.2, 10 * PT * 0.32);
  y += 5.5;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.line(CX - 26, y, CX + 26, y);
  doc.setLineWidth(0.4);
  doc.line(CX - 35, y, CX + 35, y);
  y += 9;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11.5);
  doc.setTextColor(...SLATE);
  centered("Le Cabinet International de Consultance, d'Expertise et de Formation certifie que", y);
  const name = certificateName(c);
  let size = 30;
  doc.setFont("times", "bold");
  doc.setFontSize(size);
  while (size > 18 && doc.getTextWidth(name) + name.length * size * PT * 0.04 > 230) doc.setFontSize(size -= 1);
  y += 4 + size * PT * 0.95;
  doc.setTextColor(...INK);
  const nameW = centered(name, y, size * PT * 0.04);
  doc.setDrawColor(...BURGUNDY);
  doc.setLineWidth(0.7);
  doc.line(CX - nameW / 2, y + 2.6, CX + nameW / 2, y + 2.6);
  y += 11;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11.5);
  doc.setTextColor(...SLATE);
  centered("a suivi et validé avec succès la certification en ligne", y);
  doc.setFont("times", "bold");
  doc.setFontSize(19);
  doc.setTextColor(...BURGUNDY);
  const lines = doc.splitTextToSize(c.courseTitle, 220);
  y += 3 + 19 * PT * 0.9;
  for (const line of lines) {
    centered(line, y);
    y += 19 * PT * 1.25;
  }
  y += 1.5;
  doc.setFontSize(11);
  const parts = [
    ["Formation suivie du ", false],
    [formatFrenchDate(c.startedAt), true],
    [" au ", false],
    [formatFrenchDate(c.finishedAt), true],
    [` · durée estimée : ${c.hours} heures`, false]
  ];
  const widthOf = ([t, b]) => {
    doc.setFont("helvetica", b ? "bold" : "normal");
    return doc.getTextWidth(t);
  };
  let x = CX - parts.reduce((n, p) => n + widthOf(p), 0) / 2;
  for (const p of parts) {
    const w = widthOf(p);
    doc.setTextColor(...p[1] ? INK : SLATE);
    doc.text(p[0], x, y);
    x += w;
  }
  y += 9;
  const label = "Résultat obtenu : ";
  const score = `${c.average} %`;
  doc.setFont("times", "bold");
  doc.setFontSize(17);
  const labelW = doc.getTextWidth(label);
  doc.setFontSize(21);
  const scoreW = doc.getTextWidth(score);
  x = CX - (labelW + scoreW) / 2;
  doc.setFontSize(17);
  doc.setTextColor(...NAVY);
  doc.text(label, x, y);
  doc.setFontSize(21);
  doc.setTextColor(...BURGUNDY);
  doc.text(score, x + labelW, y);
  doc.setDrawColor(...BURGUNDY);
  doc.setLineWidth(0.8);
  doc.line(x, y + 2.2, x + labelW + scoreW, y + 2.2);
  doc.setLineWidth(0.3);
  doc.line(x, y + 3.3, x + labelW + scoreW, y + 3.3);
  const bottom = H - 13 - 2;
  const qrSize = 24;
  drawQrCode(doc, QRCode, certificateVerifyUrl(c.number), 22, bottom - qrSize + 0.8, qrSize);
  const left = 22 + qrSize + 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.4);
  doc.setTextColor(...NAVY);
  doc.text(`N° ${c.number}`, left, bottom - 13.4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.6);
  doc.setTextColor(...MUTED);
  doc.text(`Délivré le ${formatFrenchDate(c.issuedAt)}`, left, bottom - 9);
  doc.text("Scannez le QR code pour vérifier", left, bottom - 4.6);
  doc.text("l'authenticité sur www.cicexf.com", left, bottom - 0.2);
  if (c.simulation) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BURGUNDY);
    doc.text("Spécimen de démonstration,", left, bottom - 22.4);
    doc.text("sans valeur officielle", left, bottom - 18.2);
  }
  drawSeal(doc, CX, bottom - 20, 20);
  const signX = 205;
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const place = `Fait à Abidjan, le ${formatFrenchDate(c.issuedAt)}`;
  doc.text(place, signX - doc.getTextWidth(place) / 2, bottom - 31);
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.4);
  doc.line(signX - 34, bottom - 5.2, signX + 34, bottom - 5.2);
  if (signature) {
    const scale = Math.min(64 / signature.w, 24 / signature.h);
    const w = signature.w * scale, h = signature.h * scale;
    doc.addImage(signature.data, "PNG", signX - w / 2, bottom - 3.5 - h, w, h);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.6);
  doc.setTextColor(...INK);
  const sign = "Pour le CICEXF, le Gérant";
  doc.text(sign, signX - doc.getTextWidth(sign) / 2, bottom - 0.6);
  return doc;
}
function drawSeal(doc, cx, cy, r) {
  const u = r / 60;
  doc.setFillColor(...BURGUNDY);
  doc.circle(cx, cy, 57 * u, "F");
  doc.setDrawColor(...GOLD_LIGHT);
  doc.setLineWidth(1.2 * u);
  doc.circle(cx, cy, 53 * u, "S");
  doc.setLineWidth(1 * u);
  doc.circle(cx, cy, 34 * u, "S");
  const ring = "CABINET INTERNATIONAL · CICEXF · ABIDJAN · ";
  const radius = 44 * u;
  const fontPt = 8.6 * u / PT;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontPt);
  doc.setTextColor(255, 255, 255);
  const spacing = 1.6 * u;
  const total = [...ring].reduce((n, ch) => n + doc.getTextWidth(ch) + spacing, 0);
  const stretch = 2 * Math.PI * radius / total;
  let theta = Math.PI;
  for (const ch of ring) {
    const adv = (doc.getTextWidth(ch) + spacing) * stretch;
    if (ch !== " ") {
      const deg = Math.atan2(-Math.cos(theta), -Math.sin(theta)) * 180 / Math.PI;
      doc.text(ch, cx + radius * Math.cos(theta), cy + radius * Math.sin(theta), { angle: deg });
    }
    theta += adv / radius;
  }
  doc.setFont("times", "bold");
  doc.setFontSize(15 * u / PT);
  doc.setTextColor(255, 255, 255);
  doc.text("CICEXF", cx - doc.getTextWidth("CICEXF") / 2, cy - 3 * u);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.4 * u / PT);
  doc.setTextColor(...GOLD_LIGHT);
  const el = "E-LEARNING", cs = 1 * u;
  doc.text(el, cx - (doc.getTextWidth(el) + cs * (el.length - 1)) / 2, cy + 10 * u, { charSpace: cs });
}
var certificateFileName = (c) => {
  const slug = certificateName(c).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `certificat-cicexf-${slug || "apprenant"}-${c.number}.pdf`;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  certificateFileName,
  certificateName,
  certificateVerifyUrl,
  drawCertificate,
  formatFrenchDate
});
