// Correction of the practical work: spreadsheet cells (numbers, calculations, choices) and written answers
// (key ideas found from expected words, accents and case ignored).
import { inputCells, type Fmt, type SheetExercise, type WritingExercise } from '../data/elearning/practice';

// ---------------------------------------------------------------------------------------------
// Numbers and calculations typed by the learner: "1 650 000", "1650000 FCFA", "33,3 %", "=4*550000", "(12/30)*100"

/** Small calculator (+ − × ÷ and parentheses); returns null when the text is not a valid calculation */
export function evaluate(raw: string): number | null {
  const s = raw
    .replace(/fcfa|f\s*cfa|francs?/gi, '')
    .replace(/[\s  ]/g, '')
    .replace(/^=/, '')
    .replace(/%$/, '')
    .replace(/×|x(?=\d|\()/gi, '*')
    .replace(/÷/g, '/');
  if (!s) return null;
  // A decimal comma ("33,3") becomes a point; thousands separators made of points ("1.650.000") are removed
  const normalized = /^\d{1,3}(\.\d{3})+$/.test(s) ? s.replace(/\./g, '') : s.replace(/,/g, '.');
  if (!/^[\d.+\-*/()]+$/.test(normalized)) return null;
  let i = 0;
  const peek = () => normalized[i];
  const number = (): number | null => {
    const m = /^\d+(\.\d+)?|^\.\d+/.exec(normalized.slice(i));
    if (!m) return null;
    i += m[0].length;
    return parseFloat(m[0]);
  };
  const factor = (): number | null => {
    if (peek() === '-') { i++; const f = factor(); return f === null ? null : -f; }
    if (peek() === '+') { i++; return factor(); }
    if (peek() === '(') {
      i++;
      const v = expr();
      if (v === null || peek() !== ')') return null;
      i++;
      return v;
    }
    return number();
  };
  const term = (): number | null => {
    let v = factor();
    while (v !== null && (peek() === '*' || peek() === '/')) {
      const op = normalized[i++];
      const f = factor();
      if (f === null) return null;
      v = op === '*' ? v * f : f === 0 ? null : v / f;
    }
    return v;
  };
  const expr = (): number | null => {
    let v = term();
    while (v !== null && (peek() === '+' || peek() === '-')) {
      const op = normalized[i++];
      const t = term();
      if (t === null) return null;
      v = op === '+' ? v + t : v - t;
    }
    return v;
  };
  const v = expr();
  return v !== null && i === normalized.length && Number.isFinite(v) ? v : null;
}

const defaultTol = (fmt: Fmt | undefined) => (fmt === 'pct' ? 0.6 : fmt === 'fcfa' ? 1 : 0.01);

/** Is the typed value right? Percentages may be typed as 33,3 or 0,333. */
export function numericOk(raw: string, answer: number, fmt?: Fmt, tol?: number): boolean {
  let v = evaluate(raw);
  if (v === null) return false;
  const t = tol ?? defaultTol(fmt);
  if (fmt === 'pct' && Math.abs(answer) >= 2 && Math.abs(v) <= 1.5 && Math.abs(v * 100 - answer) <= t) v *= 100;
  return Math.abs(v - answer) <= t;
}

export const formatValue = (v: number, fmt?: Fmt) => {
  const s = v.toLocaleString('fr-FR', { maximumFractionDigits: fmt === 'fcfa' ? 0 : 1 }).replace(/ | /g, ' ');
  return fmt === 'pct' ? `${s} %` : s;
};

export interface SheetResult { score: number; good: number; total: number; ok: Record<string, boolean> }

export function gradeSheet(ex: SheetExercise, answers: Record<string, string>): SheetResult {
  const cells = inputCells(ex);
  const ok: Record<string, boolean> = {};
  for (const c of cells) {
    const raw = (answers[c.id] || '').trim();
    ok[c.id] = typeof c.answer === 'number'
      ? numericOk(raw, c.answer, 'fmt' in c ? c.fmt : undefined, 'tol' in c ? c.tol : undefined)
      : raw === c.answer;
  }
  const good = Object.values(ok).filter(Boolean).length;
  return { score: cells.length ? Math.round((good / cells.length) * 100) : 0, good, total: cells.length, ok };
}

// ---------------------------------------------------------------------------------------------
// Written answers

/** Lower case, no accents, punctuation turned into spaces */
export const normalizeText = (s: string) =>
  ` ${s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').replace(/[^a-z0-9%]+/g, ' ').trim()} `;

export const wordCount = (s: string) => (s.trim().match(/[\p{L}\p{N}]+/gu) || []).length;

export interface WritingResult {
  score: number;
  words: number;
  tooShort: boolean;
  criteria: { label: string; met: boolean; found: string[] }[];
}

/** Does the (normalized) answer contain this key word? "mot" matches the words starting with "mot";
 *  "mot$" matches the whole word only (so that "age$" does not match "agent"). */
export const hasKeyword = (norm: string, keyword: string) => {
  const whole = keyword.endsWith('$');
  const k = normalizeText(whole ? keyword.slice(0, -1) : keyword).trim();
  return k.length > 0 && norm.includes(whole ? ` ${k} ` : ` ${k}`);
};

/** A criterion is met when enough of its words (or word beginnings) appear in the answer */
export function gradeWriting(ex: WritingExercise, text: string): WritingResult {
  const norm = normalizeText(text);
  const words = wordCount(text);
  const criteria = ex.criteria.map((c) => {
    const found = c.keywords.filter((k) => hasKeyword(norm, k));
    return { label: c.label, met: found.length >= (c.need ?? 1), found };
  });
  const met = criteria.filter((c) => c.met).length;
  const tooShort = words < ex.minWords;
  let score = Math.round((met / criteria.length) * 100);
  // A list of key words is not a written answer: a too short text is capped at half the points
  if (tooShort) score = Math.min(score, 50);
  return { score, words, tooShort, criteria };
}
