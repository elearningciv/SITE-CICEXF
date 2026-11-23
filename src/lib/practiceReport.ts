// Mid-term report of the practical work as the input of the PDF (reportPdf.ts): the sections written by the learner
// and the tables of their exercises. Used by the learner's page and by the administration (same document).
import type { PracticeSet, WritingExercise } from '../data/elearning/practice';
import { gradeCase, sectionKey, sheetTableText, tableWritingKey } from './practiceGrading';
import { exerciseScore, isValidated, practiceResult, type SavedEntry } from './practiceScore';
import type { ReportPdfInput } from './reportPdf';

type State = Record<string, { answers?: Record<string, string> } | undefined>;

const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The report exercise of a set (writing in sections that can be downloaded), if any */
export const reportExercise = (set: PracticeSet) =>
  set.exercises.find((e): e is WritingExercise => e.kind === 'writing' && !!e.download && !!e.sections?.length);

/** Status of one exercise of a learner */
export const exerciseStatus = (e?: SavedEntry) => {
  const started = !!e && (Object.values(e.answers || {}).some((v) => (v || '').trim()) || !!(e.text || '').trim());
  return { started, label: isValidated(e) ? 'Validé' : started ? 'Commencé, pas validé' : 'Pas commencé' };
};

/** Whole practical work of a learner as one PDF (for the administration): every exercise with its status, its note,
 *  the tables as filled, the writings and the answers to the practical case */
export function practiceWorkReport(set: PracticeSet, state: Record<string, SavedEntry | undefined>, learnerName: string,
  opts: { courseTitle: string; quiz?: { label: string; score?: number }[]; weight?: number }): ReportPdfInput {
  const res = practiceResult(set, state as Record<string, SavedEntry>);
  const quiz = opts.quiz || [];
  const quizAvg = quiz.length ? Math.round(quiz.reduce((n, q) => n + (q.score ?? 0), 0) / quiz.length) : null;
  const details = [
    `Formation : ${opts.courseTitle}`,
    `Travaux pratiques : ${res.average} % (${res.done} exercice${res.done > 1 ? 's' : ''} validé${res.done > 1 ? 's' : ''} sur ${res.total})`,
    ...(quiz.length ? [`Quiz : ${quiz.map((q) => `${q.label} ${q.score === undefined ? 'non fait' : `${q.score} %`}`).join(' ; ')}`] : []),
    ...(quizAvg !== null && opts.weight ? [`Note finale estimée : ${Math.round(quizAvg * (1 - opts.weight) + res.average * opts.weight)} % (quiz ${Math.round((1 - opts.weight) * 100)} %, travaux pratiques ${Math.round(opts.weight * 100)} %)`] : [])
  ];
  const sections = set.exercises.map((ex) => {
    const e = state[ex.id];
    const st = exerciseStatus(e);
    let score: number | null = null;
    try { score = e && st.started ? exerciseScore(ex, e) : null; } catch { score = null; }
    const title = `${ex.title} · ${st.label}${score === null ? '' : ` · ${score} %`}`;
    if (!e || !st.started) return { title, text: '(Aucune réponse.)' };
    const answers = e.answers || {};
    if (ex.kind === 'writing') {
      const text = ex.sections
        ? ex.sections.map((s) => `${s.title} :\n${(answers[sectionKey(s.id)] || '').trim() || '(non rédigé)'}`).join('\n')
        : e.text || '';
      return { title, text };
    }
    if (ex.kind === 'case') {
      const r = gradeCase(ex, answers, e.text || '');
      const lines = ex.questions.map((q, i) => {
        const mine = answers[`q${i}`];
        const given = mine !== undefined && mine !== '' ? q.answers[Number(mine)] : 'aucune';
        return `Question ${i + 1} : ${q.question} Réponse : ${given} (${r.ok[i] ? 'juste' : `fausse ; bonne réponse : ${q.answers[q.good]}`}).`;
      });
      return { title, text: [`Questions : ${r.good} sur ${r.total} (${r.quizPct} %) ; rédaction : ${r.writing.score} %.`, ...lines, 'Rédaction :', (e.text || '').trim() || '(non rédigée)'].join('\n') };
    }
    const tables = ex.tables.flatMap((t, ti) => {
      if (!t.columns.length) return [];
      const d = sheetTableText(ex, ti, answers, t.columns.map((_c, j) => j));
      return d.rows.length ? [{ title: t.title, columns: d.columns, rows: d.rows }] : [];
    });
    const writings = [
      ...(ex.writing ? [`Rédaction :\n${(e.text || '').trim() || '(non rédigée)'}`] : []),
      ...ex.tables.flatMap((t) => (t.writing ? [`${t.writing.title} :\n${(answers[tableWritingKey(t.writing.id)] || '').trim() || '(non rédigé)'}`] : []))
    ];
    return { title, text: writings.join('\n'), tables };
  });
  return {
    title: 'Travaux pratiques',
    subtitle: `${learnerName} · projet PGC-Vie`,
    details,
    footer: `Travaux pratiques de ${learnerName} · ${opts.courseTitle}`,
    sections,
    fileName: `travaux-pratiques-${slug(learnerName) || 'apprenant'}.pdf`
  };
}

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
