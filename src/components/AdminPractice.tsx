// Administration: practical work of one learner — note, every answer (tables, writings, practical case) and the
// mid-term report as a PDF. The learner's saved work is read only when this panel is opened (one database read).
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { CheckCircle2, Download, FileSpreadsheet, Loader2, PenLine, Users, X, XCircle } from 'lucide-react';
import { db } from '../firebase';
import { PRACTICE_PASS, PRACTICE_WEIGHTS, loadPractice, type PracticeExercise, type PracticeSet } from '../data/elearning/practice';
import { gradeCase, sectionKey, sheetTableText, tableWritingKey } from '../lib/practiceGrading';
import { exerciseScore, isValidated, practiceResult, type SavedEntry } from '../lib/practiceScore';
import { midtermReport } from '../lib/practiceReport';

interface Props { uid: string; name: string; courseId: string; onClose: () => void }

const kindLabel = (e: PracticeExercise) => (e.kind === 'sheet' ? 'Tableau' : e.kind === 'case' ? 'Cas pratique' : 'Rédaction');

export default function AdminPractice({ uid, name, courseId, onClose }: Props) {
  const [set, setSet] = useState<PracticeSet | null>(null);
  const [state, setState] = useState<Record<string, SavedEntry> | null>(null);
  const [savedAt, setSavedAt] = useState('');
  const [error, setError] = useState('');
  const [pdf, setPdf] = useState<'idle' | 'busy' | 'error'>('idle');

  useEffect(() => {
    let live = true;
    Promise.all([loadPractice(courseId), getDoc(doc(db, 'learners', uid, 'practice', courseId))])
      .then(([s, snap]) => {
        if (!live) return;
        setSet(s);
        if (snap.exists()) {
          const d = snap.data();
          setState(JSON.parse(d.state || '{}'));
          setSavedAt(d.savedAt?.toDate ? d.savedAt.toDate().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '');
        } else setState({});
      })
      .catch((e) => live && setError(`Les travaux pratiques n'ont pas pu être lus (${e?.code || e?.message || 'erreur inconnue'}).`));
    return () => { live = false; };
  }, [uid, courseId]);

  const report = set && state ? midtermReport(set, state, name) : null;
  const written = report ? report.input.sections.filter((s) => s.text.trim()).length : 0;
  const downloadReport = async () => {
    if (!report) return;
    setPdf('busy');
    try {
      const { downloadReportPdf } = await import('../lib/reportPdf');
      await downloadReportPdf(report.input);
      setPdf('idle');
    } catch {
      setPdf('error');
    }
  };

  const note = set && state ? practiceResult(set, state) : null;
  const weight = PRACTICE_WEIGHTS[courseId] ?? 0;

  return (
    <div className="fixed inset-0 z-[80] bg-slate-900/60 flex items-start justify-center overflow-y-auto p-3 sm:p-6" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="w-full max-w-5xl rounded-2xl bg-white dark:bg-slate-900 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center gap-3 rounded-t-2xl bg-brand-blue px-4 sm:px-5 py-3 text-white">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-200">Travaux pratiques</p>
            <p className="font-extrabold truncate">{name}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Fermer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {error && <p className="font-bold text-brand-emerald">{error}</p>}
          {!error && (!set || !state) && <p className="flex items-center gap-2 text-slate-500"><Loader2 className="w-4 h-4 animate-spin" />Lecture des travaux pratiques…</p>}

          {set && state && note && (
            <>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-700 dark:text-slate-200">
                <p><strong>Note des travaux pratiques : {note.average} %</strong> · {note.done} exercice{note.done > 1 ? 's' : ''} validé{note.done > 1 ? 's' : ''} sur {note.total}
                  {weight > 0 && <> · compte pour {Math.round(weight * 100)} % de la note finale ; {PRACTICE_PASS} % exigés</>}.</p>
                <p className="mt-1 text-xs text-slate-500">{savedAt ? `Dernier enregistrement : ${savedAt}.` : "Aucun travail enregistré en ligne pour cet apprenant."} Notes recalculées à partir des réponses enregistrées.</p>
              </div>

              {report && (
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={downloadReport} disabled={!written || pdf === 'busy'} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue text-white px-4 py-2.5 text-sm font-bold disabled:opacity-40">
                    {pdf === 'busy' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}Télécharger le rapport à mi-parcours (PDF)
                  </button>
                  <span className="text-xs text-slate-500">{written ? `${written} partie${written > 1 ? 's' : ''} rédigée${written > 1 ? 's' : ''} sur ${report.input.sections.length}` : 'Rapport pas encore rédigé'}</span>
                  {pdf === 'error' && <span className="text-xs font-bold text-brand-emerald">Le PDF n'a pas pu être créé.</span>}
                </div>
              )}

              <div className="space-y-2">
                {set.exercises.map((ex) => <ExerciseAnswers key={ex.id} ex={ex} entry={state[ex.id]} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ExerciseAnswers({ ex, entry }: { ex: PracticeExercise; entry?: SavedEntry; key?: string }) {
  const validated = isValidated(entry);
  const started = !!entry && (Object.values(entry.answers || {}).some((v) => (v || '').trim()) || !!(entry.text || '').trim());
  let score: number | null = null;
  try { score = entry && started ? exerciseScore(ex, entry) : null; } catch { score = null; }
  const status = validated ? 'Validé' : started ? 'Commencé, pas validé' : 'Pas commencé';
  const Icon = ex.kind === 'sheet' ? FileSpreadsheet : ex.kind === 'case' ? Users : PenLine;
  return (
    <details className="group rounded-xl border border-slate-200 dark:border-slate-800">
      <summary className="flex flex-wrap items-center gap-2 px-4 py-3 cursor-pointer">
        <Icon className="w-4 h-4 text-brand-blue dark:text-sky-300 shrink-0" />
        <span className="flex-1 min-w-[200px] font-bold text-slate-900 dark:text-white">{ex.title}</span>
        <span className="text-xs text-slate-500">{kindLabel(ex)} · {status}</span>
        <span className={`text-sm font-extrabold ${score === null ? 'text-slate-400' : score >= PRACTICE_PASS ? 'text-brand-blue dark:text-sky-300' : 'text-brand-emerald'}`}>{score === null ? '—' : `${score} %`}</span>
      </summary>
      <div className="px-4 pb-4 text-sm text-slate-700 dark:text-slate-200 space-y-3">
        {!started ? <p className="text-slate-500">Aucune réponse.</p> : <Answers ex={ex} entry={entry!} />}
      </div>
    </details>
  );
}

const Text = ({ title, text }: { title?: string; text?: string; key?: string | number }) => (
  <div>
    {title && <p className="font-bold text-slate-900 dark:text-white">{title}</p>}
    <p className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2">{(text || '').trim() || '—'}</p>
  </div>
);

function Answers({ ex, entry }: { ex: PracticeExercise; entry: SavedEntry }) {
  const answers = entry.answers || {};
  if (ex.kind === 'writing') {
    return ex.sections ? <>{ex.sections.map((s) => <Text key={s.id} title={s.title} text={answers[sectionKey(s.id)]} />)}</> : <Text text={entry.text} />;
  }
  if (ex.kind === 'case') {
    const r = gradeCase(ex, answers, entry.text || '');
    return (
      <>
        <p className="font-bold text-slate-900 dark:text-white">Questions : {r.good} sur {r.total} ({r.quizPct} %) · rédaction : {r.writing.score} %</p>
        <ol className="space-y-1.5">
          {ex.questions.map((q, i) => {
            const mine = answers[`q${i}`];
            return (
              <li key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
                <p className="font-semibold">{i + 1}. {q.question}</p>
                <p className="mt-0.5 flex items-start gap-1.5">{r.ok[i] ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-brand-blue" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-brand-emerald" />}Réponse : {mine !== undefined && mine !== '' ? q.answers[Number(mine)] : 'aucune'}</p>
                {!r.ok[i] && <p className="mt-0.5 text-xs font-bold">Bonne réponse : {q.answers[q.good]}</p>}
              </li>
            );
          })}
        </ol>
        <Text title="Rédaction" text={entry.text} />
      </>
    );
  }
  return (
    <>
      {ex.tables.map((t, ti) => {
        if (!t.columns.length) return t.writing ? <Text key={ti} title={t.writing.title} text={answers[tableWritingKey(t.writing.id)]} /> : null;
        const data = sheetTableText(ex, ti, answers, t.columns.map((_c, j) => j));
        return (
          <div key={ti}>
            {t.title && <p className="font-bold text-slate-900 dark:text-white">{t.title}</p>}
            <div className="mt-1 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800"><tr>{data.columns.map((c, j) => <th key={j} className="px-2 py-1.5 text-left font-bold">{c}</th>)}</tr></thead>
                <tbody>{data.rows.map((row, ri) => <tr key={ri} className="border-t border-slate-100 dark:border-slate-800">{row.map((c, j) => <td key={j} className="px-2 py-1 align-top">{c || '—'}</td>)}</tr>)}</tbody>
              </table>
            </div>
            {t.writing && <div className="mt-2"><Text title={t.writing.title} text={answers[tableWritingKey(t.writing.id)]} /></div>}
          </div>
        );
      })}
      {ex.writing && <Text title="Rédaction" text={entry.text} />}
    </>
  );
}
