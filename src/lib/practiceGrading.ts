// Correction of the practical work: spreadsheet cells (numbers, calculations, choices) and written answers
// (key ideas found from expected words, accents and case ignored).
import { gradedCells, isCalc, isChoice, type CalcCell, type ChoiceInput, type Ctx, type Dyn, type Fmt, type NumInput, type SheetCell, type SheetExercise, type SheetWriting, type WritingCriterion, type WritingExercise, type CaseExercise } from '../data/elearning/practice';

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

/** Values of the cells (typed or calculated), as a spreadsheet would compute them */
export function makeCtx(ex: SheetExercise, answers: Record<string, string>): Ctx {
  const byId = new Map<string, SheetCell>();
  for (const t of ex.tables) for (const row of t.rows) for (const c of row) if (typeof c === 'object' && 'id' in c) byId.set(c.id, c);
  const memo = new Map<string, number | string | null>();
  const busy = new Set<string>();
  const ctx: Ctx = {
    num(id) {
      const c = byId.get(id);
      if (!c) return null;
      if (isCalc(c)) {
        const v = calcValue(id, c);
        return typeof v === 'number' && Number.isFinite(v) ? v : null;
      }
      const raw = (answers[id] || '').trim();
      return raw ? evaluate(raw) : null;
    },
    text(id) {
      const c = byId.get(id);
      if (!c) return '';
      if (isCalc(c)) { const v = calcValue(id, c); return v === null ? '' : String(v); }
      return (answers[id] || '').trim();
    }
  };
  const calcValue = (id: string, c: CalcCell) => {
    if (memo.has(id)) return memo.get(id)!;
    if (busy.has(id)) return null; // circular reference
    busy.add(id);
    let v: number | string | null = null;
    try { v = c.calc(ctx); } catch { v = null; }
    busy.delete(id);
    memo.set(id, v);
    return v;
  };
  return ctx;
}

const resolve = <T,>(d: Dyn<T> | undefined, ctx: Ctx): T | null | undefined => (typeof d === 'function' ? (d as (c: Ctx) => T | null)(ctx) : d);

/** Text shown as the expected value of a cell after correction */
export function expectedText(c: NumInput | ChoiceInput, ctx: Ctx): string {
  if (isChoice(c)) { const a = resolve(c.answer, ctx); return Array.isArray(a) ? a.join(' ou ') : a ?? ''; }
  if (c.range) return `entre ${formatValue(c.range[0], c.fmt)} et ${formatValue(c.range[1], c.fmt)}`;
  const a = resolve(c.answer, ctx);
  return a === null || a === undefined ? '' : formatValue(a, c.fmt);
}

/** Text shown in a calculated cell */
export function calcText(c: CalcCell, ctx: Ctx): string {
  const n = ctx.num(c.id);
  if (n !== null) return formatValue(n, c.fmt);
  return ctx.text(c.id) || '—';
}

export interface SheetResult {
  score: number;
  good: number;
  total: number;
  ok: Record<string, boolean>;
  checks: { label: string; ok: boolean }[];
}

export function gradeSheet(ex: SheetExercise, answers: Record<string, string>): SheetResult {
  const ctx = makeCtx(ex, answers);
  const ok: Record<string, boolean> = {};
  // An empty cell counts as 0 (as in a spreadsheet) only when another cell of the same row is filled in
  const rowStarted = new Set<string>();
  for (const t of ex.tables) for (const row of t.rows) {
    const ids = row.filter((c): c is SheetCell & { id: string } => typeof c === 'object' && 'id' in c && !isCalc(c)).map((c) => c.id);
    if (ids.some((id) => (answers[id] || '').trim())) ids.forEach((id) => rowStarted.add(id));
  }
  for (const c of gradedCells(ex)) {
    const raw = (answers[c.id] || '').trim();
    if (isChoice(c)) {
      const a = resolve(c.answer, ctx);
      ok[c.id] = !!raw && a !== null && a !== undefined && (Array.isArray(a) ? a.includes(raw) : raw === a);
    } else if (c.range) {
      const v = ctx.num(c.id);
      ok[c.id] = v !== null && v >= c.range[0] - 1e-9 && v <= c.range[1] + 1e-9;
    } else {
      const a = resolve(c.answer, ctx);
      ok[c.id] = a !== null && a !== undefined && (raw === '' ? a === 0 && rowStarted.has(c.id) : numericOk(raw, a, c.fmt, c.tol));
    }
  }
  const checks = (ex.checks || []).map((k) => {
    let pass = false;
    try { pass = !!k.test(ctx); } catch { pass = false; }
    return { label: k.label, ok: pass };
  });
  // Cells marked noScore are shown right or wrong but only the checks give their points
  const scored = gradedCells(ex).filter((c) => !c.noScore).map((c) => c.id);
  const good = scored.filter((id) => ok[id]).length + checks.filter((k) => k.ok).length;
  const total = scored.length + checks.length;
  return { score: total ? Math.round((good / total) * 100) : 0, good, total, ok, checks };
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
  tooLong?: boolean;
  criteria: { label: string; met: boolean; found: string[]; keywords: string[] }[];
}

/** Does the (normalized) answer contain this key word? "mot" matches the words starting with "mot";
 *  "mot$" matches the whole word only (so that "age$" does not match "agent"). */
export const hasKeyword = (norm: string, keyword: string) => {
  const whole = keyword.endsWith('$');
  const k = normalizeText(whole ? keyword.slice(0, -1) : keyword).trim();
  return k.length > 0 && norm.includes(whole ? ` ${k} ` : ` ${k}`);
};

/** A criterion is met when enough of its words (or word beginnings) appear in the answer */
export function gradeWriting(ex: { criteria: WritingCriterion[]; minWords: number; maxWords?: number }, text: string): WritingResult {
  const norm = normalizeText(text);
  const words = wordCount(text);
  const criteria = ex.criteria.map((c) => {
    const found = c.keywords.filter((k) => hasKeyword(norm, k));
    return { label: c.label, met: found.length >= (c.need ?? 1), found, keywords: c.keywords };
  });
  const met = criteria.filter((c) => c.met).length;
  const tooShort = words < ex.minWords;
  const tooLong = ex.maxWords !== undefined && words > ex.maxWords;
  let score = Math.round((met / criteria.length) * 100);
  // A list of key words is not a written answer: a too short text is capped at half the points; so is a text
  // longer than the limit asked
  if (tooShort || tooLong) score = Math.min(score, 50);
  return { score, words, tooShort, tooLong, criteria };
}

/** Writing asked below the tables: fixed criteria plus those that depend on the learner's tables */
export function gradeSheetWriting(ex: SheetExercise, answers: Record<string, string>, text: string): WritingResult | null {
  if (!ex.writing) return null;
  return gradeWithCtx(ex.writing, makeCtx(ex, answers), text);
}

function gradeWithCtx(w: SheetWriting, ctx: Ctx, text: string): WritingResult {
  let dyn: WritingCriterion[] = [];
  try { dyn = w.dynamicCriteria ? w.dynamicCriteria(ctx) : []; } catch { dyn = []; }
  return gradeWriting({ criteria: [...w.criteria, ...dyn], minWords: w.minWords, maxWords: w.maxWords }, text);
}

/** A table of a sheet exercise as plain text, as the learner filled it (for a report): chosen columns and rows,
 *  hidden rows left out; `filled` is false when the learner has not started the exercise */
export function sheetTableText(ex: SheetExercise, tableIndex: number, answers: Record<string, string>, columns: number[], rows?: number[]) {
  const t = ex.tables[tableIndex];
  const ctx = makeCtx(ex, answers);
  const text = (c: SheetCell): string => {
    if (typeof c === 'string') return c;
    if ('v' in c) return formatValue(c.v, c.fmt);
    if (isCalc(c)) { const s = calcText(c, ctx); return s === '—' ? '' : s; }
    const raw = (answers[c.id] || '').trim();
    if (!raw || isChoice(c) || 'text' in c) return raw;
    const n = ctx.num(c.id);
    return n === null ? raw : formatValue(n, (c as NumInput).fmt);
  };
  const picked = (rows ?? t.rows.map((_r, i) => i)).filter((i) => {
    if (!t.showRow) return true;
    try { return t.showRow(ctx, i); } catch { return true; }
  });
  return {
    columns: columns.map((j) => t.columns[j]),
    rows: picked.map((i) => columns.map((j) => text(t.rows[i][j] ?? ''))),
    filled: picked.length > 0 && Object.values(answers).some((v) => (v || '').trim() !== '')
  };
}

/** Practical case: the questions (answers stored as « q0 », « q1 »… = index of the chosen answer) and the writing */
export function gradeCase(ex: CaseExercise, answers: Record<string, string>, text: string) {
  const ok = ex.questions.map((q, i) => (answers[`q${i}`] ?? '') !== '' && Number(answers[`q${i}`]) === q.good);
  const good = ok.filter(Boolean).length;
  const quizPct = Math.round((good / ex.questions.length) * 100);
  const writing = gradeWriting(ex.writing, text);
  return { ok, good, total: ex.questions.length, quizPct, writing, score: Math.round((quizPct + writing.score) / 2) };
}

/** Key under which the text of one section of a writing is stored with the answers */
export const sectionKey = (id: string) => `sec:${id}`;

/** A writing exercise, in one box or in sections (each section is corrected on its own criteria) */
export function gradeWritingEntry(ex: WritingExercise, text: string, answers: Record<string, string>): WritingResult {
  if (!ex.sections?.length) return gradeWriting(ex, text);
  const parts = ex.sections.map((s) => ({ s, r: gradeWriting({ criteria: s.criteria, minWords: 0 }, answers[sectionKey(s.id)] || '') }));
  const criteria = parts.flatMap(({ s, r }) => r.criteria.map((c) => ({ ...c, label: `${s.title} : ${c.label}` })));
  const words = parts.reduce((n, p) => n + p.r.words, 0);
  const tooShort = words < ex.minWords;
  const tooLong = ex.maxWords !== undefined && words > ex.maxWords;
  let score = Math.round((criteria.filter((c) => c.met).length / Math.max(1, criteria.length)) * 100);
  if (tooShort || tooLong) score = Math.min(score, 50);
  return { score, words, tooShort, tooLong, criteria };
}

/** Key under which the text of a writing placed under a table is stored with the answers */
export const tableWritingKey = (id: string) => `txt:${id}`;

/** Writings placed under the tables, each with its own correction */
export function gradeTableWritings(ex: SheetExercise, answers: Record<string, string>): { id: string; result: WritingResult }[] {
  const ctx = makeCtx(ex, answers);
  return ex.tables.flatMap((t) => (t.writing ? [{ id: t.writing.id, result: gradeWithCtx(t.writing, ctx, answers[tableWritingKey(t.writing.id)] || '') }] : []));
}
