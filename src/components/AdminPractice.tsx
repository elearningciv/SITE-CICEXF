// Administration: practical work of one learner — note, every answer (tables, writings, practical case) and the
// mid-term report as a PDF. The learner's saved work is read only when this panel is opened (one database read).
import { useEffect, useMemo, useState } from 'react';
import { collectionGroup, doc, getDoc, getDocs, Timestamp } from 'firebase/firestore';
import { CheckCircle2, ClipboardList, Download, FileSpreadsheet, FileText, Loader2, PenLine, RefreshCw, Users, X, XCircle } from 'lucide-react';
import { db } from '../firebase';
import { CATALOG } from '../data/elearning';
import { PRACTICE_PASS, PRACTICE_WEIGHTS, hasPractice, loadPractice, type PracticeExercise, type PracticeSet } from '../data/elearning/practice';
import { gradeCase, gradeWritingEntry, gradeSheetWriting, gradeTableWritings, sectionKey, sheetTableText, tableWritingKey } from '../lib/practiceGrading';
import { exerciseScore, isValidated, practiceResult, type SavedEntry } from '../lib/practiceScore';
import { midtermReport, practiceWorkReport } from '../lib/practiceReport';

type Saved = { state: Record<string, SavedEntry>; savedAt: string };
type Quiz = { label: string; score?: number }[];
interface Props { uid: string; name: string; courseId: string; onClose: () => void; preloaded?: Saved; quiz?: Quiz }

const savedDate = (t?: Timestamp) => (t?.toDate ? t.toDate().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '');
const courseTitleOf = (courseId: string) => CATALOG.find((c) => c.id === courseId)?.certTitle || courseId;

async function downloadPdf(input: Parameters<typeof import('../lib/reportPdf')['downloadReportPdf']>[0]) {
  const { downloadReportPdf } = await import('../lib/reportPdf');
  await downloadReportPdf(input);
}

const kindLabel = (e: PracticeExercise) => (e.kind === 'sheet' ? 'Tableau' : e.kind === 'case' ? 'Cas pratique' : 'Rédaction');

export default function AdminPractice({ uid, name, courseId, onClose, preloaded, quiz }: Props) {
  const [set, setSet] = useState<PracticeSet | null>(null);
  const [state, setState] = useState<Record<string, SavedEntry> | null>(null);
  const [savedAt, setSavedAt] = useState('');
  const [error, setError] = useState('');
  const [pdf, setPdf] = useState<'idle' | 'busy' | 'error'>('idle');

  useEffect(() => {
    let live = true;
    if (preloaded) {
      // Already read with all the learners (tab « Suivi des travaux pratiques »): no new database read
      loadPractice(courseId).then((s) => { if (live) { setSet(s); setState(preloaded.state); setSavedAt(preloaded.savedAt); } });
      return () => { live = false; };
    }
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
  }, [uid, courseId, preloaded]);

  const report = set && state ? midtermReport(set, state, name) : null;
  const [work, setWork] = useState<'idle' | 'busy' | 'error'>('idle');
  const downloadWork = async () => {
    if (!set || !state) return;
    setWork('busy');
    try {
      await downloadPdf(practiceWorkReport(set, state, name, { courseTitle: courseTitleOf(courseId), quiz, weight: PRACTICE_WEIGHTS[courseId] }));
      setWork('idle');
    } catch {
      setWork('error');
    }
  };
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

              <div className="flex flex-wrap items-center gap-3">
                <button onClick={downloadWork} disabled={work === 'busy'} className="inline-flex items-center gap-1.5 rounded-xl border-2 border-brand-blue text-brand-blue dark:border-sky-300 dark:text-sky-300 px-4 py-2 text-sm font-bold disabled:opacity-40">
                  {work === 'busy' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}Télécharger le travail complet (PDF)
                </button>
                <span className="text-xs text-slate-500">Toutes les réponses, tableaux et rédactions, exercice par exercice, avec les notes.</span>
                {work === 'error' && <span className="text-xs font-bold text-brand-emerald">Le PDF n'a pas pu être créé.</span>}
              </div>
              {quiz && quiz.length > 0 && (
                <p className="text-sm text-slate-700 dark:text-slate-200"><strong>Quiz :</strong> {quiz.map((q) => `${q.label} ${q.score === undefined ? 'non fait' : `${q.score} %`}`).join(' · ')}</p>
              )}
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

// ---------------------------------------------------------------------------------------------
// Follow-up of a course with practical work: every enrolled learner, quizzes, practical work, report,
// with their answers and their documents. All the saved work is read once, when this tab is opened.

interface FollowLearner { uid: string; nom: string; prenom: string; email: string }
interface FollowProgress { scores?: Record<string, number>; certificate?: string }

const csvDownload = (name: string, rows: (string | number)[][]) => {
  const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const blob = new Blob(['﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

export function PracticeFollowUp({ learners, progress, enrolledAt }: {
  learners: FollowLearner[]; progress: Map<string, FollowProgress>; enrolledAt: Map<string, unknown>;
}) {
  const courses = CATALOG.filter((c) => hasPractice(c.id));
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const meta = CATALOG.find((c) => c.id === courseId);
  const [set, setSet] = useState<PracticeSet | null>(null);
  const [saved, setSaved] = useState<Map<string, Saved> | null>(null);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [open, setOpen] = useState<{ uid: string; name: string } | null>(null);
  const [busy, setBusy] = useState('');

  useEffect(() => {
    let live = true;
    setSaved(null);
    setError('');
    Promise.all([loadPractice(courseId), getDocs(collectionGroup(db, 'practice'))])
      .then(([s, snap]) => {
        if (!live) return;
        setSet(s);
        const m = new Map<string, Saved>();
        snap.docs.filter((d) => d.id === courseId).forEach((d) => {
          try { m.set(d.ref.parent.parent?.id || '', { state: JSON.parse(d.data().state || '{}'), savedAt: savedDate(d.data().savedAt) }); } catch { /* état illisible : ignoré */ }
        });
        setSaved(m);
      })
      .catch((e) => live && setError(`Les travaux pratiques n'ont pas pu être lus (${e?.code || e?.message || 'erreur inconnue'}).`));
    return () => { live = false; };
  }, [courseId, reload]);

  const rows = useMemo(() => {
    if (!set || !saved || !meta) return [];
    const uids = new Set<string>([...enrolledAt.keys()].filter((k) => k.endsWith(`/${courseId}`)).map((k) => k.split('/')[0]));
    saved.forEach((_v, uid) => uids.add(uid));
    const weight = PRACTICE_WEIGHTS[courseId] ?? 0;
    return [...uids].map((uid) => {
      const l = learners.find((x) => x.uid === uid);
      const name = l ? `${l.prenom} ${l.nom.toLocaleUpperCase('fr-FR')}` : uid;
      const p = progress.get(`${uid}/${courseId}`);
      const quiz: Quiz = meta.steps.map((st) => ({ label: st.title.replace(/^Quiz de la /, '').replace(/^./, (c) => c.toUpperCase()), score: p?.scores?.[st.id] }));
      const quizAvg = Math.round(quiz.reduce((n, q) => n + (q.score ?? 0), 0) / Math.max(1, quiz.length));
      const sv = saved.get(uid);
      const state = sv?.state || {};
      const tp = practiceResult(set, state);
      const report = midtermReport(set, state, name);
      return {
        uid, name, email: l?.email || '', quiz, quizAvg, tp, sv, state, report,
        written: report ? report.input.sections.filter((x) => x.text.trim()).length : 0,
        final: Math.round(quizAvg * (1 - weight) + tp.average * weight),
        certificate: p?.certificate || ''
      };
    }).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }, [set, saved, meta, learners, progress, enrolledAt, courseId]);

  const run = async (key: string, task: () => Promise<void>) => {
    setBusy(key);
    try { await task(); } catch { alert("Le PDF n'a pas pu être créé."); } finally { setBusy(''); }
  };

  const exportOverview = () => csvDownload(`suivi-travaux-pratiques-${new Date().toISOString().slice(0, 10)}.csv`, [
    ['Apprenant', 'E-mail', ...(meta?.steps.map((st) => st.title) || []), 'Moyenne des quiz', 'Exercices validés', 'Note des travaux pratiques', 'Note finale estimée', 'Parties du rapport rédigées', 'Certificat'],
    ...rows.map((r) => [r.name, r.email, ...r.quiz.map((q) => (q.score === undefined ? '' : `${q.score} %`)), `${r.quizAvg} %`, `${r.tp.done}/${r.tp.total}`, `${r.tp.average} %`, `${r.final} %`, r.report ? `${r.written}/${r.report.input.sections.length}` : '', r.certificate])
  ]);
  // Every writing of every learner, one row each, to correct them by hand (in Excel)
  const exportWritings = () => {
    if (!set) return;
    const out: (string | number)[][] = [['Apprenant', 'E-mail', 'Exercice', 'Partie', 'Texte', 'Note automatique', 'Nombre de mots']];
    const words = (t: string) => (t.trim().match(/[\p{L}\p{N}]+/gu) || []).length;
    for (const r of rows) {
      for (const ex of set.exercises) {
        const e = r.state[ex.id];
        if (!e) continue;
        const a = e.answers || {};
        const push = (part: string, text: string, note: number | null) => { if (text.trim()) out.push([r.name, r.email, ex.title, part, text.trim(), note === null ? '' : `${note} %`, words(text)]); };
        if (ex.kind === 'writing') {
          const g = gradeWritingEntry(ex, e.text || '', a).score;
          if (ex.sections) ex.sections.forEach((sec) => push(sec.title, a[sectionKey(sec.id)] || '', g));
          else push('Rédaction', e.text || '', g);
        } else if (ex.kind === 'case') {
          push('Rédaction du cas pratique', e.text || '', gradeCase(ex, a, e.text || '').writing.score);
        } else {
          if (ex.writing) push('Rédaction', e.text || '', gradeSheetWriting(ex, a, e.text || '')?.score ?? null);
          const tw = Object.fromEntries(gradeTableWritings(ex, a).map((w) => [w.id, w.result.score]));
          ex.tables.forEach((t) => { if (t.writing) push(t.writing.title, a[tableWritingKey(t.writing.id)] || '', tw[t.writing.id] ?? null); });
        }
      }
    }
    csvDownload(`redactions-travaux-pratiques-${new Date().toISOString().slice(0, 10)}.csv`, out);
  };

  if (!courses.length) return <p className="text-slate-500">Aucune formation n'a de travaux pratiques.</p>;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {courses.length > 1 && (
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm">
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        )}
        <p className="flex-1 min-w-[220px] text-sm font-bold text-slate-800 dark:text-slate-100"><ClipboardList className="inline w-4 h-4 mr-1 -mt-0.5 text-brand-blue" />{meta?.title}</p>
        <button onClick={() => setReload((n) => n + 1)} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold"><RefreshCw className="w-4 h-4" />Actualiser</button>
        <button onClick={exportOverview} disabled={!rows.length} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-blue text-white text-sm font-bold disabled:opacity-40"><Download className="w-4 h-4" />Exporter le suivi (CSV)</button>
        <button onClick={exportWritings} disabled={!rows.length} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-blue text-white text-sm font-bold disabled:opacity-40"><Download className="w-4 h-4" />Exporter toutes les rédactions (CSV)</button>
      </div>
      <p className="text-xs text-slate-500">Notes recalculées à partir des réponses enregistrées par chaque apprenant ; note finale estimée = {Math.round((1 - (PRACTICE_WEIGHTS[courseId] ?? 0)) * 100)} % quiz + {Math.round((PRACTICE_WEIGHTS[courseId] ?? 0) * 100)} % travaux pratiques ({PRACTICE_PASS} % exigés sur les travaux pratiques).</p>
      {error && <p className="font-bold text-brand-emerald">{error}</p>}
      {!error && !saved && <p className="flex items-center gap-2 text-slate-500"><Loader2 className="w-4 h-4 animate-spin" />Lecture des travaux pratiques de tous les apprenants…</p>}
      {saved && !rows.length && <p className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500">Aucun apprenant inscrit à cette formation pour le moment.</p>}
      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="p-3">Apprenant</th><th className="p-3">Quiz</th><th className="p-3">Travaux pratiques</th><th className="p-3">Rapport</th><th className="p-3">Note finale estimée</th><th className="p-3">Documents et réponses</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.uid} className="border-t border-slate-100 dark:border-slate-800 align-top">
                  <td className="p-3"><span className="font-bold text-slate-900 dark:text-white">{r.name}</span><div className="text-xs text-slate-500 break-all">{r.email}</div>{r.sv?.savedAt && <div className="text-[11px] text-slate-400">Enregistré le {r.sv.savedAt}</div>}</td>
                  <td className="p-3 text-xs whitespace-nowrap">{r.quiz.map((q) => <div key={q.label}>{q.label} : <strong>{q.score === undefined ? '—' : `${q.score} %`}</strong></div>)}<div className="mt-0.5 text-slate-500">Moyenne {r.quizAvg} %</div></td>
                  <td className="p-3 text-xs whitespace-nowrap"><strong className={r.tp.average >= PRACTICE_PASS ? 'text-brand-blue dark:text-sky-300' : 'text-brand-emerald'}>{r.tp.average} %</strong><div>{r.tp.done}/{r.tp.total} validés</div></td>
                  <td className="p-3 text-xs whitespace-nowrap">{r.report ? `${r.written}/${r.report.input.sections.length} parties` : '—'}</td>
                  <td className="p-3 text-sm font-extrabold whitespace-nowrap">{r.final} %{r.certificate && <div className="text-[11px] font-bold text-emerald-700">Certificat {r.certificate}</div>}</td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1.5 min-w-[13rem]">
                      <button onClick={() => setOpen({ uid: r.uid, name: r.name })} className="inline-flex items-center gap-1 rounded-lg border border-brand-blue/40 px-2 py-1 text-xs font-bold text-brand-blue dark:text-sky-300"><ClipboardList className="w-3.5 h-3.5" />Voir les réponses</button>
                      <button disabled={busy === `w-${r.uid}`} onClick={() => run(`w-${r.uid}`, () => downloadPdf(practiceWorkReport(set!, r.state, r.name, { courseTitle: courseTitleOf(courseId), quiz: r.quiz, weight: PRACTICE_WEIGHTS[courseId] })))} className="inline-flex items-center gap-1 rounded-lg border border-brand-blue/40 px-2 py-1 text-xs font-bold text-brand-blue dark:text-sky-300 disabled:opacity-40">{busy === `w-${r.uid}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}Travail complet (PDF)</button>
                      <button disabled={!r.written || busy === `r-${r.uid}`} onClick={() => r.report && run(`r-${r.uid}`, () => downloadPdf(r.report!.input))} className="inline-flex items-center gap-1 rounded-lg border border-brand-blue/40 px-2 py-1 text-xs font-bold text-brand-blue dark:text-sky-300 disabled:opacity-40">{busy === `r-${r.uid}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}Rapport à mi-parcours (PDF)</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {open && (() => {
        const r = rows.find((x) => x.uid === open.uid);
        return <AdminPractice uid={open.uid} name={open.name} courseId={courseId} onClose={() => setOpen(null)} preloaded={r?.sv || { state: {}, savedAt: '' }} quiz={r?.quiz} />;
      })()}
    </div>
  );
}
