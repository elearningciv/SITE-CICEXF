// Note of the practical work of a course, computed from the saved answers with the same correction as the site.
// The site uses it to show the note; the server uses a copy bundled by `node scripts/build-practice-function.mjs`
// (functions/practice/score.cjs) to compute it again when it issues the certificate, so that a note stored by the
// browser is never trusted. It must not use browser APIs.
import type { PracticeExercise, PracticeSet } from '../data/elearning/practice';
import { gradeSheet, gradeSheetWriting, gradeTableWritings, gradeWritingEntry } from './practiceGrading';

/** What the site saves for one exercise (only these fields are used) */
export interface SavedEntry { answers?: Record<string, string>; text?: string; score?: number; pending?: boolean }

export interface PracticeResult {
  total: number;
  /** Exercises validated (submitted at least once, with no change typed since) */
  done: number;
  /** Titles of the exercises still to validate */
  missing: string[];
  scores: Record<string, number>;
  /** Average of all the exercises (an exercise not validated counts 0) */
  average: number;
}

/** An exercise counts once it has been validated and nothing has been typed since */
export const isValidated = (e?: SavedEntry) => !!e && e.score !== undefined && !e.pending;

/** Note of one exercise: the table, or the table and its writings (half each), or the writing */
export function exerciseScore(ex: PracticeExercise, e: SavedEntry): number {
  const answers = e.answers || {};
  if (ex.kind === 'writing') return gradeWritingEntry(ex, e.text || '', answers).score;
  const table = gradeSheet(ex, answers).score;
  const writings = [
    ...(ex.writing ? [gradeSheetWriting(ex, answers, e.text || '')!.score] : []),
    ...gradeTableWritings(ex, answers).map((w) => w.result.score)
  ];
  return writings.length ? Math.round((table + Math.min(...writings)) / 2) : table;
}

export function practiceResult(set: PracticeSet, state: Record<string, SavedEntry>): PracticeResult {
  const scores: Record<string, number> = {};
  const missing: string[] = [];
  for (const ex of set.exercises) {
    const e = state[ex.id];
    if (isValidated(e)) {
      try { scores[ex.id] = exerciseScore(ex, e!); } catch { scores[ex.id] = 0; }
    } else missing.push(ex.title);
  }
  const total = set.exercises.length;
  const sum = Object.values(scores).reduce((a, b) => a + b, 0);
  return { total, done: total - missing.length, missing, scores, average: total ? Math.round(sum / total) : 0 };
}

/** Final note of the certificate: quizzes and exams, weighted with the practical work */
export const combinedNote = (quiz: number, practice: number, weight: number) => Math.round(quiz * (1 - weight) + practice * weight);
