// Practical work attached to some e-learning courses: a project file to read, spreadsheet-like exercises
// filled in on the site and corrected cell by cell, and written answers corrected from the key ideas they
// must contain. This work is formative: the correction and the model answer are shown after each attempt,
// and it does not count for the certificate.

export type Fmt = 'fcfa' | 'pct' | 'n';

/** Fixed text, fixed number, numeric answer or choice in a list */
export type SheetCell =
  | string
  | { v: number; fmt?: Fmt }
  | { id: string; answer: number; fmt?: Fmt; tol?: number }
  | { id: string; answer: string; options: string[] };

export interface SheetTable { title?: string; columns: string[]; rows: SheetCell[][] }

export interface SheetExercise {
  kind: 'sheet';
  id: string;
  title: string;
  /** Skill practised, shown on the card */
  skill: string;
  /** Statement (HTML) */
  intro: string;
  /** Calculation rules reminded under the statement (HTML) */
  rules?: string;
  tables: SheetTable[];
  /** Commentary shown with the correction (HTML) */
  explanation: string;
}

export interface WritingCriterion {
  /** What a good answer must contain */
  label: string;
  /** Words or beginnings of words (accents and case ignored); the criterion is met when `need` of them appear */
  keywords: string[];
  need?: number;
}

export interface WritingExercise {
  kind: 'writing';
  id: string;
  title: string;
  skill: string;
  prompt: string;
  minWords: number;
  criteria: WritingCriterion[];
  /** Model answer shown after the first attempt (HTML) */
  model: string;
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
export const loadPractice = (courseId: string): Promise<PracticeSet | null> => (SETS[courseId] ? SETS[courseId]() : Promise.resolve(null));

/** Input cells of an exercise (spreadsheet) */
export const inputCells = (ex: SheetExercise) =>
  ex.tables.flatMap((t) => t.rows.flat()).filter((c): c is Extract<SheetCell, { id: string }> => typeof c === 'object' && 'id' in c);
