// Mid-term report of the practical work as the input of the PDF (reportPdf.ts): the sections written by the learner
// and the tables of their exercises. Used by the learner's page and by the administration (same document).
import type { PracticeSet, WritingExercise } from '../data/elearning/practice';
import { sectionKey, sheetTableText } from './practiceGrading';
import type { ReportPdfInput } from './reportPdf';

type State = Record<string, { answers?: Record<string, string> } | undefined>;

const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The report exercise of a set (writing in sections that can be downloaded), if any */
export const reportExercise = (set: PracticeSet) =>
  set.exercises.find((e): e is WritingExercise => e.kind === 'writing' && !!e.download && !!e.sections?.length);

/** PDF input of the report from a saved state, and the titles of the sections still empty */
export function midtermReport(set: PracticeSet, state: State, learnerName?: string): { input: ReportPdfInput; missing: string[] } | null {
  const ex = reportExercise(set);
  if (!ex || !ex.download || !ex.sections) return null;
  const parts = state[ex.id]?.answers || {};
  const who = learnerName ? slug(learnerName) : '';
  const input: ReportPdfInput = {
    ...ex.download,
    author: learnerName ? `${learnerName}, chef de mission` : undefined,
    sections: ex.sections.map((s) => ({
      title: s.title,
      text: parts[sectionKey(s.id)] || '',
      // Tables of the exercises the learner has done, under the matching part of the report
      tables: (ex.download!.tables || []).filter((t) => t.section === s.id).flatMap((t) => {
        const sheet = set.exercises.find((e) => e.id === t.exercise);
        if (!sheet || sheet.kind !== 'sheet') return [];
        const data = sheetTableText(sheet, t.table, state[t.exercise]?.answers || {}, t.columns, t.rows);
        return data.filled ? [{ title: t.title, columns: data.columns, rows: data.rows }] : [];
      })
    })),
    fileName: `${ex.download.fileName}${who ? `-${who}` : ''}.pdf`
  };
  return { input, missing: ex.sections.filter((s) => !(parts[sectionKey(s.id)] || '').trim()).map((s) => s.title) };
}
