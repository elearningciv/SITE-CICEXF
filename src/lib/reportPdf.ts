// Written report of the practical work (e.g. the mid-term report) as one structured A4 PDF, built in the browser:
// cover with title, author, date and contents, then one heading per section with its text and tables, page
// numbers in the footer. A table can come from the learner's exercises, or from lines of the text whose cells are
// separated by « | » (first line = headings). jsPDF is heavy, so it is downloaded only when a report is generated.
import { imageData } from './certificatePdf';

export interface ReportTable { title?: string; columns: string[]; rows: string[][] }

export interface ReportPdfInput {
  title: string;
  subtitle: string;
  /** Lines shown under the title (period, addressee…) */
  details: string[];
  author?: string;
  /** Footer text, left side */
  footer: string;
  sections: { title: string; text: string; tables?: ReportTable[] }[];
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

/** Text of a section cut into paragraphs and tables (consecutive lines with « | » between their cells) */
type Block = { kind: 'para'; text: string } | { kind: 'table'; table: ReportTable };
export function textBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let rows: string[][] = [];
  const flush = () => {
    if (rows.length >= 2) {
      const n = Math.max(...rows.map((r) => r.length));
      blocks.push({ kind: 'table', table: { columns: pad(rows[0], n), rows: rows.slice(1).map((r) => pad(r, n)) } });
    } else if (rows.length === 1) blocks.push({ kind: 'para', text: rows[0].join(' | ') });
    rows = [];
  };
  for (const raw of text.split(/\n/)) {
    const line = raw.trim();
    const cells = line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    if (line.includes('|') && cells.length >= 2) { rows.push(cells); continue; }
    flush();
    if (line) blocks.push({ kind: 'para', text: line });
  }
  flush();
  return blocks;
}
const pad = (r: string[], n: number) => [...r, ...Array(Math.max(0, n - r.length)).fill('')];
const numeric = (s: string) => /^[-+]?\d[\d\s]*([,.]\d+)?\s?(%|j|FCFA)?$/.test(s.trim());
const TONES: [string, [number, number, number]][] = [
  ['Sous-charge', [226, 232, 240]], ['Équilibré', [214, 225, 236]], ['Tendu', [242, 226, 197]], ['Surcharge', [138, 46, 28]]
];

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

    const paragraph = (p: string) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
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
    };

    const table = (t: ReportTable) => {
      const FS = 8.5, LINE = 3.6, PADX = 1.6, PADY = 1.5;
      const n = t.columns.length;
      if (!n) return;
      // Column widths from their content, stretched or shrunk to the width of the page
      doc.setFontSize(FS);
      const longestWord = (s: string, bold: boolean) => {
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        return Math.max(0, ...pdfText(s).split(/\s+/).map((x) => doc.getTextWidth(x)));
      };
      // Narrowest width that never cuts a word, and the width the content would like
      // A number (« 1 650 000 », « 33,3 % ») is never cut: its whole width counts
      const unbreakable = (s: string) => { if (!numeric(s)) return longestWord(s, false); doc.setFont('helvetica', 'normal'); return doc.getTextWidth(pdfText(s)); };
      const minimal = t.columns.map((h, j) => Math.min(Math.max(longestWord(h, true), ...t.rows.map((r) => unbreakable(r[j] || ''))), 45) + 2 * PADX + 1);
      const natural = t.columns.map((h, j) => {
        doc.setFont('helvetica', 'normal');
        let w = 0;
        for (const r of t.rows) w = Math.max(w, Math.min(doc.getTextWidth(pdfText(r[j] || '')), j === 0 ? 70 : 42));
        return Math.max(minimal[j], w + 2 * PADX + 1);
      });
      const sum = natural.reduce((a, b) => a + b, 0), sumMin = minimal.reduce((a, b) => a + b, 0);
      let widths: number[];
      if (sum <= TW) widths = natural.map((w) => (w * TW) / sum);
      else if (sumMin <= TW) {
        // Each column keeps its minimal width; the remaining space goes to the columns that want more
        const extra = natural.map((w, j) => w - minimal[j]), sumExtra = extra.reduce((a, b) => a + b, 0) || 1;
        widths = minimal.map((m, j) => m + ((TW - sumMin) * extra[j]) / sumExtra);
      } else widths = minimal.map((m) => (m * TW) / sumMin);
      const cellLines = (cells: string[], bold: boolean) => cells.map((c, j) => {
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        return doc.splitTextToSize(pdfText(c || ''), widths[j] - 2 * PADX) as string[];
      });
      const header = cellLines(t.columns, true);
      const headH = Math.max(...header.map((l) => l.length)) * LINE + 2 * PADY;
      const drawRow = (lines: string[][], h: number, head: boolean, shade: boolean, cells: string[]) => {
        if (!draw) return;
        let x = M;
        if (head) doc.setFillColor(...NAVY);
        else doc.setFillColor(shade ? 241 : 255, shade ? 245 : 255, shade ? 249 : 255);
        doc.rect(M, y, TW, h, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.2);
        doc.rect(M, y, TW, h);
        lines.forEach((l, j) => {
          doc.setFont('helvetica', head ? 'bold' : 'normal');
          doc.setFontSize(FS);
          // Load levels coloured as on the site (grey, navy, gold, burgundy)
          const tone = head ? undefined : TONES.find(([k]) => (cells[j] || '').trim().endsWith(k));
          if (tone) { doc.setFillColor(...tone[1]); doc.rect(x, y, widths[j], h, 'F'); doc.rect(x, y, widths[j], h); }
          if (head || tone?.[0] === 'Surcharge') doc.setTextColor(255, 255, 255); else doc.setTextColor(...INK);
          const right = !head && j > 0 && numeric(cells[j] || '');
          doc.text(l, right ? x + widths[j] - PADX : x + PADX, y + PADY + LINE - 0.9, { align: right ? 'right' : 'left', lineHeightFactor: LINE / (FS * 0.3528) });
          if (j > 0) doc.line(x, y, x, y + h);
          x += widths[j];
        });
      };
      if (t.title) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        const tl: string[] = doc.splitTextToSize(pdfText(t.title), TW);
        if (y + tl.length * 4.6 + headH + 8 > BOTTOM) newPage();
        if (draw) { doc.setTextColor(...NAVY); doc.text(tl, M, y); }
        y += tl.length * 4.6 - 1.5;
      } else if (y + headH + 8 > BOTTOM) newPage();
      drawRow(header, headH, true, false, t.columns);
      y += headH;
      t.rows.forEach((r, ri) => {
        const lines = cellLines(r, false);
        const h = Math.max(1, ...lines.map((l) => l.length)) * LINE + 2 * PADY;
        if (y + h > BOTTOM) {
          newPage();
          // The headings are repeated at the top of the new page
          drawRow(header, headH, true, false, t.columns);
          y += headH;
        }
        drawRow(lines, h, false, ri % 2 === 1, r);
        y += h;
      });
      y += 6;
    };

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
      const blocks = textBlocks(s.text);
      if (!blocks.length && !s.tables?.length) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10.5);
        if (draw) { doc.setTextColor(...GREY); doc.text('(Partie non rédigée)', M, y); }
        y += LH;
        return;
      }
      blocks.forEach((b) => (b.kind === 'para' ? paragraph(b.text) : (y += 2, table(b.table))));
      (s.tables || []).forEach((t) => { y += 2; table(t); });
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
