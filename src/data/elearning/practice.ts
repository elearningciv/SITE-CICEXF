// Practical work attached to some e-learning courses: a project file to read, spreadsheet-like exercises
// filled in on the site (with cells calculated automatically, as in a spreadsheet) and corrected, and
// written answers corrected from the key ideas they must contain. For the courses listed in PRACTICE_WEIGHTS,
// the practical work counts in the note of the certificate (computed again by the server, see practiceScore.ts).

export type Fmt = 'fcfa' | 'pct' | 'n';

/** Read access to the other cells of the exercise, for calculated cells, answers and checks */
export interface Ctx {
  /** Numeric value of a cell (typed number or calculation, calculated cell), null if empty or invalid */
  num(id: string): number | null;
  /** Text of a cell (choice, calculated text) */
  text(id: string): string;
}
/** A fixed expected value, or one that depends on what the learner typed elsewhere */
export type Dyn<T> = T | ((c: Ctx) => T | null);

/** Number typed by the learner: corrected against `answer` (with `tol`) or `range`; neither = free entry.
 *  `noScore`: the cell is shown right or wrong but does not count alone (the points come from the checks). */
export interface NumInput { id: string; answer?: Dyn<number>; fmt?: Fmt; tol?: number; range?: [number, number]; noScore?: boolean }
/** Choice in a drop-down list: corrected against `answer` (one value or the list of accepted values); no answer = free choice */
export interface ChoiceInput { id: string; options: string[]; answer?: Dyn<string | string[]>; noScore?: boolean }
/** Free text typed by the learner (e.g. an observation); used by the checks */
export interface TextInput { id: string; text: true; placeholder?: string }
/** Cell calculated automatically from the others (like a spreadsheet formula) */
/** Colour band of a calculated cell (load level): under-load, balanced, tight, overload */
export type Tone = 'low' | 'ok' | 'high' | 'over';
export interface CalcCell { id: string; calc: (c: Ctx) => number | string | null; fmt?: Fmt; tone?: (c: Ctx) => Tone | null }

export type SheetCell = string | { v: number; fmt?: Fmt } | NumInput | ChoiceInput | TextInput | CalcCell;

/** Eisenhower chart drawn from the learner's entries: each item is placed in its quadrant
 *  (1 important and urgent, 2 important not urgent, 3 urgent not important, 4 neither), sized by its value */
export interface EisenhowerChart {
  kind: 'eisenhower';
  items: (c: Ctx) => { label: string; value: number; quadrant: 1 | 2 | 3 | 4 }[];
  /** Unit of the values (e.g. « j ») */
  unit: string;
  /** Shown when there is nothing to place yet */
  empty: string;
  /** Short note under the chart (HTML), e.g. how the activities are classified */
  note?: string;
}

/** A table, optionally followed by a colour legend, a chart and a writing (an empty `columns` list draws no grid) */
export interface SheetTable {
  title?: string;
  columns: string[];
  rows: SheetCell[][];
  legend?: { tone: Tone; label: string }[];
  /** Rows shown only when this returns true (e.g. the activities of one person); hidden rows keep their answers */
  showRow?: (c: Ctx, rowIndex: number) => boolean;
  /** Shown instead of the grid when no row is shown */
  emptyText?: string;
  chart?: EisenhowerChart;
  /** Writing placed right under this table; its text is stored with the answers */
  writing?: SheetWriting & { id: string; title: string };
}

/** Overall condition checked at correction time (e.g. every activity fully assigned) */
export interface SheetCheck { label: string; test: (c: Ctx) => boolean }

export interface SheetExercise {
  kind: 'sheet';
  id: string;
  title: string;
  /** Skill practised, shown on the card */
  skill: string;
  /** Statement (HTML) */
  intro: string;
  /** How to fill in the table (HTML) */
  rules?: string;
  tables: SheetTable[];
  checks?: SheetCheck[];
  /** Example of a complete answer for the free cells (used by the tests, never shown) */
  sample?: Record<string, string>;
  /** Writing asked below the tables (e.g. an analysis note), corrected like the writing exercises */
  writing?: SheetWriting;
  /** Commentary shown once the table is entirely right (HTML) */
  explanation: string;
}

export interface SheetWriting {
  prompt: string;
  minWords: number;
  /** Longest accepted text (words) */
  maxWords?: number;
  criteria: WritingCriterion[];
  /** Criteria that depend on what the learner declared in the tables */
  dynamicCriteria?: (c: Ctx) => WritingCriterion[];
}

export interface WritingCriterion {
  /** What a good answer must contain */
  label: string;
  /** Words or beginnings of words (accents and case ignored); the criterion is met when `need` of them appear */
  keywords: string[];
  need?: number;
}

/** One part of a long writing (e.g. a section of a report), written in its own box and corrected on its own criteria */
export interface WritingSection { id: string; title: string; hint?: string; criteria: WritingCriterion[] }

export interface WritingExercise {
  kind: 'writing';
  id: string;
  title: string;
  skill: string;
  prompt: string;
  /** Whole text (all sections together) */
  minWords: number;
  criteria: WritingCriterion[];
  /** Writing split into sections: each has its own box and criteria (`criteria` then stays empty) */
  sections?: WritingSection[];
  /** The sections can be downloaded together as one structured PDF document */
  download?: {
    title: string; subtitle: string; details: string[]; footer: string; fileName: string;
    /** Tables of the learner's exercises added under a section (columns and rows picked by index; empty tables skipped) */
    tables?: { section: string; exercise: string; table: number; title: string; columns: number[]; rows?: number[] }[];
  };
}

export type PracticeExercise = SheetExercise | WritingExercise;

export interface PracticeSet {
  courseId: string;
  title: string;
  intro: string;
  dossier: { id: string; title: string; html: string }[];
  exercises: PracticeExercise[];
}

const SETS: Record<string, () => Promise<PracticeSet>> = {
  'management-pilotage-communautaire': () => import('./practice/management-pilotage-communautaire').then((m) => m.default)
};

export const hasPractice = (courseId: string) => courseId in SETS;

/** Weight of the practical work in the note of the certificate (the quizzes and exams make up the rest); every
 *  exercise must be validated before the certificate is issued */
export const PRACTICE_WEIGHTS: Record<string, number> = { 'management-pilotage-communautaire': 0.6 };
/** Note of the practical work (average of the exercises) required for the certificate */
export const PRACTICE_PASS = 80;
export const loadPractice = (courseId: string): Promise<PracticeSet | null> => (SETS[courseId] ? SETS[courseId]() : Promise.resolve(null));

export const isCalc = (c: SheetCell): c is CalcCell => typeof c === 'object' && 'calc' in c;
export const isChoice = (c: SheetCell): c is ChoiceInput => typeof c === 'object' && 'options' in c;
export const isTextInput = (c: SheetCell): c is TextInput => typeof c === 'object' && 'text' in c;
export const isNumInput = (c: SheetCell): c is NumInput => typeof c === 'object' && 'id' in c && !('calc' in c) && !('options' in c) && !('text' in c);
export const isInput = (c: SheetCell): c is NumInput | ChoiceInput | TextInput => isNumInput(c) || isChoice(c) || isTextInput(c);

/** Cells the learner fills in */
export const inputCells = (ex: SheetExercise) => ex.tables.flatMap((t) => t.rows.flat()).filter(isInput);
/** Cells that are corrected one by one */
export const gradedCells = (ex: SheetExercise) =>
  inputCells(ex).filter((c): c is NumInput | ChoiceInput => !isTextInput(c) && (c.answer !== undefined || (isNumInput(c) && c.range !== undefined)));
