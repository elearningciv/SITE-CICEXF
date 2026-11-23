// Written report of the practical work (e.g. the mid-term report) as one structured A4 PDF, built in the browser:
// cover with title, author, date and contents, then one heading per section, page numbers in the footer.
// jsPDF is heavy, so it is downloaded only when a report is generated.
import { imageData } from './certificatePdf';

export interface ReportPdfInput {
  title: string;
  subtitle: string;
  /** Lines shown under the title (period, addressee…) */
  details: string[];
  author?: string;
  /** Footer text, left side */
  footer: string;
  sections: { title: string; text: string }[];
  fileName: string;
}

const NAVY: [number, number, number] = [0, 59, 111];
const GOLD: [number, number, number] = [201, 147, 63];
const INK: [number, number, number] = [30, 41, 59];
const GREY: [number, number, number] = [100, 116, 139];

/** The standard PDF fonts only know the Western European characters: typographic signs outside them are replaced */
const pdfText = (s: string) => s
  .replace(/[‘’‛′]/g, "'").replace(/[“”„]/g, '"')
  .replace(/[–—−]/g, '-').replace(/…/g, '...').replace(/œ/g, 'oe').replace(/Œ/g, 'OE')
  .replace(/€/g, 'EUR').replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/[•▪●]/g, '-')
  .replace(/[    ]/g, ' ').replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, '');

const frenchDate = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export async function downloadReportPdf(input: ReportPdfInput) {
  const [{ jsPDF }, logo] = await Promise.all([import('jspdf'), imageData('/elearning/logo-cicexf.png')]);
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const W = 210, H = 297, M = 20, TW = W - 2 * M, BOTTOM = H - 22, LH = 5.6;

  // Body of the report: laid out once to know where each section starts (for the contents), then drawn
  const layout = (draw: boolean) => {
    const starts: number[] = [];
    let page = 2, y = M + 4;
    if (draw) doc.addPage();
    const newPage = () => { page += 1; y = M + 4; if (draw) doc.addPage(); };
    input.sections.forEach((s, k) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      const head: string[] = doc.splitTextToSize(pdfText(s.title), TW);
      if (k > 0) y += 4;
      if (y + head.length * 6 + 3 * LH > BOTTOM) newPage();
      starts.push(page);
      if (draw) { doc.setTextColor(...NAVY); doc.text(head, M, y); }
      y += head.length * 6;
      if (draw) { doc.setDrawColor(...GOLD); doc.setLineWidth(0.6); doc.line(M, y - 3.2, M + 30, y - 3.2); }
      y += 2.5;
      const paras = s.text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
      if (!paras.length) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10.5);
        if (draw) { doc.setTextColor(...GREY); doc.text('(Partie non rédigée)', M, y); }
        y += LH;
        return;
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      paras.forEach((p) => {
        const lines: string[] = doc.splitTextToSize(pdfText(p), TW);
        lines.forEach((line, li) => {
          if (y > BOTTOM) newPage();
          if (draw) {
            doc.setTextColor(...INK);
            // Justified text, except the last line of each paragraph
            if (li < lines.length - 1) doc.text(line, M, y, { align: 'justify', maxWidth: TW });
            else doc.text(line, M, y);
          }
          y += LH;
        });
        y += 2;
      });
    });
    return starts;
  };

  // Cover: logo, title, details, contents
  let y = M;
  if (logo) {
    const h = 16, w = (logo.w / logo.h) * h;
    doc.addImage(logo.data, 'PNG', M, y, w, h);
    y += h + 10;
  } else {
    y += 10;
  }
  doc.setFillColor(...NAVY);
  doc.rect(M, y, 3, 30, 'F');
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(pdfText(input.title), M + 8, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12.5);
  doc.setTextColor(...INK);
  const sub: string[] = doc.splitTextToSize(pdfText(input.subtitle), TW - 8);
  doc.text(sub, M + 8, y + 17);
  y += Math.max(36, 17 + sub.length * 6 + 6);
  doc.setFontSize(11);
  const details = [...input.details, ...(input.author ? [`Rédigé par : ${input.author}`] : []), `Date : ${frenchDate(new Date())}`];
  details.forEach((d) => { doc.setTextColor(...GREY); doc.text(pdfText(d), M + 8, y); y += 6.2; });
  y += 6;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.line(M, y, W - M, y);
  y += 11;

  const starts = layout(false);
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Sommaire', M, y);
  y += 8;
  doc.setFontSize(11);
  input.sections.forEach((s, k) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...INK);
    const t: string = doc.splitTextToSize(pdfText(s.title), TW - 20)[0];
    doc.text(t, M + 2, y);
    const num = String(starts[k]);
    const tw = doc.getTextWidth(t), nw = doc.getTextWidth(num);
    doc.setTextColor(...GREY);
    // Dot leaders between the title and its page number
    const dots = '.'.repeat(Math.max(2, Math.floor((TW - 4 - tw - nw) / doc.getTextWidth('.'))));
    doc.text(dots, M + 3 + tw, y);
    doc.text(num, W - M, y, { align: 'right' });
    y += 7.2;
  });

  layout(true);

  // Footer on every page
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(M, H - 15, W - M, H - 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...GREY);
    doc.text(pdfText(input.footer), M, H - 10);
    doc.text(`Page ${p} / ${total}`, W - M, H - 10, { align: 'right' });
  }
  doc.save(input.fileName);
}
