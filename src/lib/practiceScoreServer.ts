// Entry of the server copy of the practical work correction (bundled into functions/practice/score.cjs by
// `node scripts/build-practice-function.mjs`): the courses whose certificate note includes the practical work.
import mpc from '../data/elearning/practice/management-pilotage-communautaire';
import { PRACTICE_PASS, PRACTICE_WEIGHTS, type PracticeSet } from '../data/elearning/practice';
import { practiceResult, type SavedEntry } from './practiceScore';

const SETS: Record<string, PracticeSet> = { [mpc.courseId]: mpc };

export const PRACTICE_COURSES = Object.keys(SETS);

/** Note of the practical work of a course from the saved state, with its weight in the certificate (null if none) */
export function practiceFor(courseId: string, state: Record<string, SavedEntry>) {
  const set = SETS[courseId];
  if (!set) return null;
  return { weight: PRACTICE_WEIGHTS[courseId] ?? 0, pass: PRACTICE_PASS, ...practiceResult(set, state || {}) };
}
