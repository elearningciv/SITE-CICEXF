// Practical work of a course: project file, spreadsheet-like exercises corrected cell by cell,
// written answers corrected from their key ideas. Formative: the correction is shown after each attempt.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, CheckCircle2, ClipboardList, Download, FileSpreadsheet, FileText, Loader2, Lock, PenLine, RotateCcw, Users, XCircle } from 'lucide-react';
import { gradedCells, inputCells, isCalc, isChoice, isInput, isTextInput, loadPractice, PRACTICE_PASS, PRACTICE_WEIGHTS, type CaseExercise, type EisenhowerChart, type PracticeSet, type SheetCell, type SheetExercise, type Tone, type WritingExercise } from '../../data/elearning/practice';
import type { ElearningApi, PracticeEntry, PracticeState } from '../../lib/elearningApi';
import { practiceResult } from '../../lib/practiceScore';
import { PASS } from '../../data/elearning';
import { calcText, expectedText, formatValue, gradeCase, gradeSheet, gradeSheetWriting, gradeTableWritings, gradeWriting, gradeWritingEntry, makeCtx, sectionKey, tableWritingKey, wordCount } from '../../lib/practiceGrading';
import { midtermReport } from '../../lib/practiceReport';

const card = 'rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm';
const primary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-brand-emerald hover:bg-brand-emerald-dark disabled:opacity-50 text-white px-5 py-3 font-extrabold text-sm transition-colors';
const ghost = 'inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-blue text-brand-blue dark:border-sky-300 dark:text-sky-300 px-4 py-2.5 font-extrabold text-sm hover:bg-brand-blue hover:text-white transition-colors';
const scoreColor = (s: number) => (s >= 80 ? 'text-brand-blue dark:text-sky-300' : s >= 50 ? 'text-[#B07A1F] dark:text-amber-300' : 'text-brand-emerald dark:text-[#E9A091]');

interface Props {
  api: ElearningApi;
  courseId: string;
  courseTitle: string;
  exerciseId?: string;
  reviewer?: boolean;
  /** Administrators and authorised accounts: the right answers are shown with the correction */
  showAnswers?: boolean;
  /** First name and name of the learner, written as the author of the downloaded reports */
  learnerName?: string;
  go: (h: string) => void;
}

export default function PracticeView({ api, courseId, courseTitle, exerciseId, reviewer, showAnswers, learnerName, go }: Props) {
  const [set, setSet] = useState<PracticeSet | null | undefined>(undefined);
  const [state, setState] = useState<PracticeState | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all([loadPractice(courseId), api.getPractice(courseId)])
      .then(([s, st]) => { if (live) { setSet(s); setState(st); } })
      .catch(() => { if (live) { setSet(null); setState({}); } });
    return () => { live = false; };
  }, [api, courseId]);

  const update = (id: string, entry: PracticeEntry) => {
    setState((prev) => {
      const next = { ...(prev || {}), [id]: entry };
      api.savePractice(courseId, next);
      return next;
    });
  };

  if (set === undefined || !state) return <p className="flex justify-center items-center gap-2 py-24 text-slate-500"><Loader2 className="w-5 h-5 animate-spin" /> Chargement des travaux pratiques…</p>;
  if (!set) return <p className="py-16 text-center font-bold text-brand-emerald">Les travaux pratiques n'ont pas pu se charger. Réessayez.</p>;

  const ex = set.exercises.find((e) => e.id === exerciseId);
  const back = () => go(`pratique/${courseId}`);
  // Every exercise can be read freely; once something is typed in one, it must be validated before another
  // one is opened (administrators excepted)
  const inProgress = reviewer ? undefined : set.exercises.find((e) => isStarted(state[e.id]));
  const resume = (id: string) => go(`pratique/${courseId}/${id}`);
  if (ex && inProgress && inProgress.id !== ex.id) {
    return (
      <div className="w-full">
        <button onClick={back} className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue dark:text-sky-300 underline"><ArrowLeft className="w-4 h-4" />Tous les travaux pratiques</button>
        <div className={`${card} p-6 sm:p-8 text-center`}>
          <Lock className="mx-auto w-9 h-9 text-[#C9933F]" />
          <h1 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">Validez d'abord l'exercice commencé</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Vous avez commencé « {inProgress.title} ». Validez-le avant d'ouvrir « {ex.title} ».</p>
          <button onClick={() => resume(inProgress.id)} className={`${primary} mt-5`}>Reprendre l'exercice commencé</button>
        </div>
      </div>
    );
  }

  if (ex) {
    const entry = state[ex.id] || { answers: {} };
    return (
      <div className="w-full">
        <button onClick={back} className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue dark:text-sky-300 underline"><ArrowLeft className="w-4 h-4" />Tous les travaux pratiques</button>
        {showAnswers && <AdminNotice />}
        <Dossier set={set} compact />
        {ex.kind === 'sheet'
          ? <SheetView key={ex.id} ex={ex} entry={entry} showAnswers={showAnswers} onChange={(e) => update(ex.id, e)} />
          : ex.kind === 'case'
          ? <CaseView key={ex.id} ex={ex} entry={entry} showAnswers={showAnswers} onChange={(e) => update(ex.id, e)} />
          : <WritingView key={ex.id} ex={ex} entry={entry} reviewer={reviewer} showAnswers={showAnswers} learnerName={learnerName} practice={{ set, state }} onChange={(e) => update(ex.id, e)} />}
        <Next set={set} current={ex.id} locked={inProgress?.id === ex.id} go={(id) => go(`pratique/${courseId}/${id}`)} />
      </div>
    );
  }

  const done = set.exercises.filter((e) => state[e.id]?.score !== undefined).length;
  // Note counted in the certificate (the server computes it again from the saved answers)
  const weight = PRACTICE_WEIGHTS[courseId] ?? 0;
  const note = practiceResult(set, state);
  return (
    <div className="w-full">
      <button onClick={() => go(`parcours/${courseId}`)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue dark:text-sky-300 underline"><ArrowLeft className="w-4 h-4" />Retour au parcours</button>
      <div className={`${card} p-5 sm:p-7 mb-5`}>
        <span className="text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300">{courseTitle}</span>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2"><ClipboardList className="w-6 h-6 text-[#C9933F]" />{set.title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{set.intro}</p>
        <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">{done} exercice{done > 1 ? 's' : ''} réalisé{done > 1 ? 's' : ''} sur {set.exercises.length}</p>
        {weight > 0 && (
          <p className="mt-3 rounded-xl bg-brand-blue/[0.06] dark:bg-sky-950/40 border-l-4 border-brand-blue px-3 py-2 text-sm text-slate-800 dark:text-slate-100">
            <strong>Note des travaux pratiques : {note.average} %</strong> ({note.done} exercice{note.done > 1 ? 's' : ''} validé{note.done > 1 ? 's' : ''} sur {note.total}, un exercice non validé compte 0 %).
            Elle compte pour {Math.round(weight * 100)} % de la note finale du certificat, les quiz pour {Math.round((1 - weight) * 100)} %. Le certificat n'est délivré qu'une fois tous les exercices validés, avec une note des travaux pratiques d'au moins {PRACTICE_PASS} %.
          </p>
        )}
      </div>
      {inProgress && (
        <div className="mb-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-l-4 border-[#C9933F] px-4 py-3 flex flex-wrap items-center gap-3">
          <Lock className="w-5 h-5 text-[#C9933F] shrink-0" />
          <p className="flex-1 min-w-[220px] text-sm font-bold text-slate-800 dark:text-slate-100">Exercice en cours : « {inProgress.title} ». Validez-le avant d'ouvrir un autre exercice.</p>
          <button onClick={() => resume(inProgress.id)} className={primary}>Reprendre</button>
        </div>
      )}
      <Dossier set={set} />
      <div className="grid gap-4 sm:grid-cols-2 mt-5">
        {set.exercises.map((e) => {
          const st = state[e.id];
          return (
            <div key={e.id} className={`${card} p-5 flex flex-col`}>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300">
                {e.kind === 'sheet' ? <FileSpreadsheet className="w-4 h-4" /> : e.kind === 'case' ? <Users className="w-4 h-4" /> : <PenLine className="w-4 h-4" />}{e.kind === 'sheet' ? 'Tableau à remplir' : e.kind === 'case' ? 'Cas pratique' : 'Rédaction'} · {e.skill}
              </span>
              <h2 className="mt-1.5 text-lg font-extrabold text-slate-900 dark:text-white">{e.title}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 flex-1">
                {isStarted(st) ? <strong className="text-[#A6762C] dark:text-amber-300">Commencé : à valider</strong> : st?.score !== undefined ? <>Dernier résultat : <strong className={scoreColor(st.score)}>{st.score} %</strong>{st.best !== undefined && st.best !== st.score ? ` · meilleur : ${st.best} %` : ''}{e.kind === 'writing' ? (st.score >= PASS ? ' · rédaction acceptée' : ' · à refaire') : st.writingScore !== undefined ? (st.writingScore >= PASS ? ' · note acceptée' : ' · note à refaire') : ''}</> : 'Pas encore réalisé'}
              </p>
              <div className="mt-3">
                {inProgress && inProgress.id !== e.id
                  ? <button disabled className={`${ghost} opacity-60 cursor-not-allowed`}><Lock className="w-4 h-4" />Après validation de l'exercice en cours</button>
                  : <button onClick={() => go(`pratique/${courseId}/${e.id}`)} className={inProgress?.id === e.id || st?.score === undefined ? primary : ghost}>{inProgress?.id === e.id ? 'Reprendre et valider' : st?.score !== undefined ? 'Revoir ou recommencer' : 'Commencer'}</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Load levels in the CICEXF colours (no green): grey under-load, navy balanced, gold tight, burgundy overload */
const TONE_CLASS: Record<Tone, string> = {
  low: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100',
  ok: 'bg-[#003B6F]/15 text-[#003B6F] dark:bg-sky-900/60 dark:text-sky-100',
  high: 'bg-[#C9933F]/30 text-[#6B4A12] dark:bg-amber-800/60 dark:text-amber-50',
  over: 'bg-[#8A2E1C] text-white'
};

const QUADS: { n: 1 | 2 | 3 | 4; title: string; sub: string; box: string; dot: string }[] = [
  { n: 1, title: '1 · Faire maintenant', sub: 'Important et urgent', box: 'bg-[#8A2E1C]/10 border-[#8A2E1C]/40', dot: 'bg-[#8A2E1C] text-white' },
  { n: 2, title: '2 · Planifier', sub: 'Important, pas urgent', box: 'bg-[#003B6F]/10 border-[#003B6F]/40', dot: 'bg-[#003B6F] text-white' },
  { n: 3, title: '3 · Déléguer', sub: 'Urgent, peu important', box: 'bg-[#C9933F]/15 border-[#C9933F]/50', dot: 'bg-[#C9933F] text-white' },
  { n: 4, title: '4 · Éliminer ou reporter', sub: 'Ni urgent ni important', box: 'bg-slate-100 border-slate-300 dark:bg-slate-800/60 dark:border-slate-600', dot: 'bg-slate-500 text-white' }
];

/** Eisenhower matrix drawn from the learner's entries: bubbles sized by the days of each activity */
function EisenhowerView({ chart, ctx }: { chart: EisenhowerChart; ctx: ReturnType<typeof makeCtx> }) {
  let items: ReturnType<EisenhowerChart['items']> = [];
  try { items = chart.items(ctx).filter((it) => it.value > 0); } catch { items = []; }
  const total = items.reduce((n, it) => n + it.value, 0);
  const max = Math.max(1, ...items.map((it) => it.value));
  const fmt = (v: number) => v.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
  return (
    <div className="mt-3">
      {!items.length ? (
        <p className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 px-4 py-6 text-center text-sm text-slate-500">{chart.empty}</p>
      ) : (
        <div className="grid grid-cols-[auto_1fr_1fr] gap-2 text-sm">
          <span />
          <span className="text-center text-xs font-extrabold uppercase tracking-wider text-slate-500">Urgent</span>
          <span className="text-center text-xs font-extrabold uppercase tracking-wider text-slate-500">Pas urgent</span>
          {[0, 1].map((row) => (
            <div key={row} className="contents">
              <span className="flex items-center justify-center text-xs font-extrabold uppercase tracking-wider text-slate-500 [writing-mode:vertical-rl] rotate-180">{row === 0 ? 'Important' : 'Peu important'}</span>
              {QUADS.slice(row * 2, row * 2 + 2).map((q) => {
                const its = items.filter((it) => it.quadrant === q.n);
                const days = its.reduce((n, it) => n + it.value, 0);
                return (
                  <div key={q.n} className={`min-h-[9rem] rounded-xl border p-3 ${q.box}`}>
                    <p className="font-extrabold text-slate-900 dark:text-white">{q.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{q.sub} · {fmt(days)} {chart.unit} ({total ? Math.round((days / total) * 100) : 0} %)</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {its.map((it) => {
                        const d = Math.round(30 + 34 * Math.sqrt(it.value / max));
                        return (
                          <span key={it.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-slate-900/70 pr-2.5 shadow-sm">
                            <span className={`inline-flex items-center justify-center rounded-full font-extrabold text-xs ${q.dot}`} style={{ width: d, height: d }}>{fmt(it.value)}</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[11rem]">{it.label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {chart.note && <div className="mt-2 text-xs text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: chart.note }} />}
    </div>
  );
}

/** Something typed since the last validation */
const isStarted = (e?: PracticeEntry) =>
  !!e?.pending && (Object.values(e.answers || {}).some((v) => (v || '').trim() !== '') || (e.text || '').trim() !== '');

const AdminNotice = () => (
  <p className="mb-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900 px-4 py-3 text-sm font-bold text-violet-900 dark:text-violet-200">
    Affichage administrateur : les bonnes réponses et le corrigé sont visibles pour ce compte uniquement. Les apprenants ne voient que les réponses incorrectes signalées.
  </p>
);

/** Project file (terms of reference, financial offer) */
function Dossier({ set, compact }: { set: PracticeSet; compact?: boolean }) {
  return (
    <div className={`${card} overflow-hidden ${compact ? 'mb-5' : ''}`}>
      <h2 className="px-4 sm:px-5 py-3 text-base sm:text-lg text-white font-extrabold bg-gradient-to-r from-brand-blue to-brand-blue-light flex items-center gap-2">
        <FileText className="w-5 h-5" />{compact ? 'Revoir le dossier du projet' : 'Dossier du projet : à lire avant les exercices'}
      </h2>
      {set.dossier.map((d) => (
        <details key={d.id} className="group border-t border-slate-200 dark:border-slate-800">
          <summary className="px-4 sm:px-5 py-3 cursor-pointer font-extrabold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60">{d.title}</summary>
          <div className="el-text px-4 sm:px-6 pb-5 overflow-x-auto" dangerouslySetInnerHTML={{ __html: d.html }} />
        </details>
      ))}
    </div>
  );
}

function Next({ set, current, locked, go }: { set: PracticeSet; current: string; locked?: boolean; go: (id: string) => void }) {
  const i = set.exercises.findIndex((e) => e.id === current);
  const next = set.exercises[i + 1];
  if (!next) return null;
  if (locked) return <p className="mt-5 text-right text-sm font-bold text-slate-500 dark:text-slate-400"><Lock className="inline w-4 h-4 mr-1 -mt-0.5" />Validez cet exercice pour passer au suivant : {next.title}</p>;
  return <p className="mt-5 text-right"><button onClick={() => go(next.id)} className="text-sm font-bold text-brand-blue dark:text-sky-300 underline">Exercice suivant : {next.title} →</button></p>;
}

function Result({ score, children }: { score: number; children?: ReactNode }) {
  return (
    <div className="mt-5 rounded-2xl bg-brand-blue/[0.05] dark:bg-sky-950/40 border border-brand-blue/15 dark:border-sky-900 border-l-4 border-l-brand-blue dark:border-l-sky-400 p-5">
      <p className="text-sm font-extrabold uppercase tracking-wider text-slate-500">Votre résultat</p>
      <p className={`text-4xl font-extrabold ${scoreColor(score)}`}>{score} %</p>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Spreadsheet exercises

const fixedText = (c: SheetCell) => (typeof c === 'string' ? c : 'v' in c ? formatValue(c.v, c.fmt) : '');

/** Characters that a single keystroke can add; more at once means a paste (or an inserted text) */
const MAX_INSERT = 40;

/** Writing area where the answer must be typed: paste, drop and sudden long insertions are refused (for everyone) */
function NoPasteTextarea({ id, value, onChange, rows = 12, placeholder }: { id: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  const area = useRef<HTMLTextAreaElement>(null);
  const [warning, setWarning] = useState(false);
  const warn = () => { setWarning(true); window.setTimeout(() => setWarning(false), 4500); };
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const block = (e: Event) => { e.preventDefault(); warn(); };
    const beforeInput = (e: InputEvent) => {
      if (/^insertFrom(Paste|Drop|Yank|PasteAsQuotation)/.test(e.inputType) || (e.inputType === 'insertText' && (e.data || '').length > MAX_INSERT)) block(e);
    };
    el.addEventListener('paste', block);
    el.addEventListener('drop', block);
    el.addEventListener('beforeinput', beforeInput);
    return () => {
      el.removeEventListener('paste', block);
      el.removeEventListener('drop', block);
      el.removeEventListener('beforeinput', beforeInput);
    };
  }, []);
  return (
    <>
      <textarea ref={area} id={id} value={value} rows={rows} autoComplete="off" spellCheck placeholder={placeholder || 'Rédigez votre réponse ici, en phrases complètes.'}
        onChange={(e) => {
          // Safety net for browsers that do not report the paste: a sudden long insertion is refused
          if (e.target.value.length - value.length > MAX_INSERT) { warn(); return; }
          onChange(e.target.value);
        }}
        className="mt-1.5 w-full rounded-xl border-[1.5px] border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:border-brand-blue" />
      {warning && <p className="mt-1 text-xs font-bold text-brand-emerald">Le copier-coller est désactivé : saisissez votre réponse directement ici.</p>}
    </>
  );
}

/** Result of a writing: accepted from 80 %, expected elements listed, missing ones highlighted (no model answer) */
function WritingFeedback({ result, minWords, maxWords, showAnswers }: { result: ReturnType<typeof gradeWriting>; minWords: number; maxWords?: number; showAnswers?: boolean }) {
  const accepted = result.score >= PASS;
  return (
    <Result score={result.score}>
      {accepted ? (
        <p className="mt-1 inline-flex items-center gap-2 font-extrabold text-brand-blue dark:text-sky-300"><CheckCircle2 className="w-5 h-5" />Rédaction acceptée : vous atteignez au moins {PASS} % des éléments attendus.</p>
      ) : (
        <p className="mt-1 font-extrabold text-brand-emerald dark:text-[#E9A091]">Rédaction non acceptée : il faut au moins {PASS} %. Complétez votre texte avec les éléments surlignés ci-dessous, puis validez à nouveau.</p>
      )}
      {result.tooShort && <p className="mt-1 font-bold text-brand-emerald">Réponse trop courte ({result.words} mots pour {minWords} attendus) : le résultat est limité à 50 %.</p>}
      {result.tooLong && <p className="mt-1 font-bold text-brand-emerald">Réponse trop longue ({result.words} mots pour {maxWords} au maximum) : raccourcissez-la ; le résultat est limité à 50 %.</p>}
      <p className="mt-3 font-bold text-slate-800 dark:text-slate-100">Les éléments recherchés dans votre texte :</p>
      <ul className="mt-2 space-y-1.5">
        {result.criteria.map((c) => (
          <li key={c.label} className={`flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-sm ${c.met ? 'text-slate-800 dark:text-slate-200' : 'bg-[#C9933F]/15 border border-[#C9933F]/50 font-bold text-[#7A5312] dark:text-amber-200'}`}>
            {c.met ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-brand-blue dark:text-sky-300" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#B07A1F] dark:text-amber-300" />}
            <span>{c.met ? c.label : `À ajouter : ${c.label}`}{showAnswers && <span className="block text-[11px] font-normal text-violet-700 dark:text-violet-300">Mots recherchés : {c.keywords.map((k) => k.replace(/\$$/, '')).join(', ')}{c.found.length ? ` · trouvés : ${c.found.map((k) => k.replace(/\$$/, '')).join(', ')}` : ''}</span>}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">La correction repère les idées clés attendues ; elle ne juge pas le style.</p>
    </Result>
  );
}

function SheetView({ ex, entry, showAnswers, onChange }: { ex: SheetExercise; entry: PracticeEntry; showAnswers?: boolean; onChange: (e: PracticeEntry) => void; key?: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>(entry.answers || {});
  const [text, setText] = useState(entry.text || '');
  const [checked, setChecked] = useState(entry.score !== undefined);
  const [showKey, setShowKey] = useState(false);
  // Cells calculated live from what is typed, as in a spreadsheet
  const ctx = useMemo(() => makeCtx(ex, answers), [ex, answers]);
  const result = useMemo(() => gradeSheet(ex, answers), [ex, answers]);
  const writingResult = useMemo(() => gradeSheetWriting(ex, answers, text), [ex, answers, text]);
  const tableWritings = useMemo(() => Object.fromEntries(gradeTableWritings(ex, answers).map((w) => [w.id, w.result])), [ex, answers]);
  const rowShown = (t: SheetExercise['tables'][number], ri: number) => { if (!t.showRow) return true; try { return t.showRow(ctx, ri); } catch { return true; } };
  const cells = inputCells(ex);
  const graded = new Set(gradedCells(ex).map((c) => c.id));
  const filled = cells.filter((c) => (answers[c.id] || '').trim()).length;

  const set = (id: string, v: string) => {
    const next = { ...answers, [id]: v };
    setAnswers(next);
    if (checked) setChecked(false);
    onChange({ ...entry, answers: next, text, pending: true });
  };
  const write = (v: string) => {
    setText(v);
    if (checked) setChecked(false);
    onChange({ ...entry, answers, text: v, pending: true });
  };
  const validate = () => {
    const r = gradeSheet(ex, answers);
    const w = gradeSheetWriting(ex, answers, text);
    // Several writings: the lowest result decides whether the writing part is accepted
    const ws = [...(w ? [w.score] : []), ...gradeTableWritings(ex, answers).map((t) => t.result.score)];
    setChecked(true);
    onChange({
      ...entry, answers, text, pending: false, score: r.score, best: Math.max(r.score, entry.best ?? 0),
      ...(ws.length ? { writingScore: Math.min(...ws) } : {}), submittedAt: new Date().toISOString(), attempts: (entry.attempts || 0) + 1
    });
  };
  const restart = () => { setAnswers({}); setText(''); setChecked(false); onChange({ ...entry, answers: {}, text: '', pending: false }); };

  const exportCsv = () => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const lines = [esc(ex.title), ''];
    for (const t of ex.tables) {
      if (!t.columns.length) continue;
      if (t.title) lines.push(esc(t.title));
      lines.push(t.columns.map(esc).join(';'));
      for (const row of t.rows) {
        lines.push(row.map((c) => esc(isCalc(c) ? calcText(c, ctx).replace('—', '') : isInput(c) ? answers[c.id] || '' : fixedText(c))).join(';'));
      }
      lines.push('');
    }
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${ex.id}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
  };

  return (
    <div className={`${card} p-5 sm:p-7`}>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300"><FileSpreadsheet className="w-4 h-4" />Tableau à remplir · {ex.skill}</span>
      <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{ex.title}</h1>
      <div className="el-text mt-3" dangerouslySetInnerHTML={{ __html: ex.intro }} />
      {ex.rules && (
        <div className="mt-4 rounded-2xl bg-[#C9933F]/10 border-l-4 border-[#C9933F] px-4 py-3 text-sm text-slate-800 dark:text-slate-200">
          <strong>Comment remplir le tableau</strong>
          <div className="mt-1" dangerouslySetInnerHTML={{ __html: ex.rules }} />
        </div>
      )}
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Cases blanches : à remplir avec un nombre (1 650 000), un pourcentage (33,3) ou un calcul comme dans un tableur (=4*550000). Cases grisées : calculées automatiquement.</p>

      {ex.tables.map((t, ti) => (
        <div key={ti} className="mt-5">
          {t.title && <h2 className="mb-2 font-extrabold text-brand-blue dark:text-sky-300">{t.title}</h2>}
          {t.columns.length > 0 && t.showRow && !t.rows.some((_r, ri) => rowShown(t, ri)) && (
            <p className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 px-4 py-5 text-center text-sm text-slate-500">{t.emptyText || 'Rien à afficher pour le moment.'}</p>
          )}
          {t.columns.length > 0 && (!t.showRow || t.rows.some((_r, ri) => rowShown(t, ri))) && <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  {t.columns.map((c, ci) => <th key={ci} className="px-2.5 py-2 text-left font-extrabold text-slate-700 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 align-bottom">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row, ri) => !rowShown(t, ri) ? null : (
                  <tr key={ri} className="even:bg-slate-50/60 dark:even:bg-slate-800/30">
                    {row.map((c, ci) => {
                      if (isCalc(c)) {
                        let tone: Tone | null = null;
                        try { tone = c.tone ? c.tone(ctx) : null; } catch { tone = null; }
                        return <td key={ci} className={`px-2.5 py-1.5 border-b border-slate-200 dark:border-slate-800 text-right font-bold whitespace-nowrap ${tone ? TONE_CLASS[tone] : 'bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100'}`}>{calcText(c, ctx)}</td>;
                      }
                      if (!isInput(c)) {
                        const numeric = typeof c === 'object';
                        return <td key={ci} className={`px-2.5 py-1.5 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 ${numeric ? 'text-right whitespace-nowrap' : ''} ${ci === 0 ? 'font-semibold min-w-[11rem]' : ''}`}>{fixedText(c)}</td>;
                      }
                      // After validation, a wrong cell is marked as such; the right answer is never shown
                      const state = checked && graded.has(c.id) ? (result.ok[c.id] ? 'ok' : 'ko') : '';
                      const border = state === 'ok' ? 'border-brand-blue bg-brand-blue/5' : state === 'ko' ? 'border-brand-emerald bg-brand-emerald/10 ring-1 ring-brand-emerald' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950';
                      return (
                        <td key={ci} className="px-1.5 py-1 border-b border-slate-200 dark:border-slate-800 align-top">
                          {isTextInput(c) ? (
                            <input type="text" value={answers[c.id] || ''} onChange={(e) => set(c.id, e.target.value)} aria-label={t.columns[ci]} placeholder={c.placeholder}
                              className="w-full min-w-[15rem] rounded-lg border-[1.5px] px-2 py-1.5 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950" />
                          ) : isChoice(c) ? (
                            <select value={answers[c.id] || ''} onChange={(e) => set(c.id, e.target.value)} aria-label={t.columns[ci]}
                              className={`w-full min-w-[8.5rem] rounded-lg border-[1.5px] px-2 py-1.5 text-slate-900 dark:text-white ${border}`}>
                              <option value="">Choisir…</option>
                              {c.options.map((o) => <option key={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input value={answers[c.id] || ''} onChange={(e) => set(c.id, e.target.value)} inputMode="decimal" aria-label={t.columns[ci]}
                              className={`w-full ${c.fmt === 'fcfa' ? 'min-w-[8.5rem]' : 'min-w-[4.5rem]'} rounded-lg border-[1.5px] px-2 py-1.5 text-right text-slate-900 dark:text-white ${border}`} />
                          )}
                          {state === 'ko' && (
                            <span className="mt-0.5 flex items-center gap-1 text-[11px] font-bold whitespace-nowrap text-brand-emerald dark:text-[#E9A091]"><XCircle className="w-3.5 h-3.5" />Réponse incorrecte{showAnswers && !isTextInput(c) ? ` · attendu : ${expectedText(c, ctx) || 'complétez le tableau'}` : ''}</span>
                          )}
                          {showAnswers && checked && showKey && state !== 'ko' && (
                            <span className="mt-0.5 block text-[11px] font-bold whitespace-nowrap text-violet-700 dark:text-violet-300">
                              {graded.has(c.id) && !isTextInput(c) ? `Attendu : ${expectedText(c, ctx)}` : ex.sample?.[c.id] !== undefined ? `Exemple : ${ex.sample[c.id] || '0'}` : ''}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
          {t.legend && (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="text-slate-500">Code couleur :</span>
              {t.legend.map((l) => <span key={l.tone} className={`rounded-md px-2 py-0.5 ${TONE_CLASS[l.tone]}`}>{l.label}</span>)}
            </p>
          )}
          {t.chart && <EisenhowerView chart={t.chart} ctx={ctx} />}
          {t.writing && (() => {
            const w = t.writing, key = tableWritingKey(w.id), value = answers[key] || '', n = wordCount(value);
            const bad = n < w.minWords || (w.maxWords !== undefined && n > w.maxWords);
            return (
              <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300"><PenLine className="w-4 h-4" />Rédaction · {w.title}</span>
                <div className="el-text mt-2" dangerouslySetInnerHTML={{ __html: w.prompt }} />
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Votre texte est accepté à partir de {PASS} % des éléments attendus. Rédigez directement dans la zone ci-dessous : le copier-coller est désactivé.</p>
                <NoPasteTextarea id={`w-${ex.id}-${w.id}`} value={value} onChange={(v) => set(key, v)} rows={9} placeholder="Rédigez votre texte ici." />
                <p className={`mt-1 text-xs ${bad ? 'text-brand-emerald font-bold' : 'text-slate-500'}`}>{n} mots · {w.maxWords !== undefined ? `entre ${w.minWords} et ${w.maxWords}` : `${w.minWords} au minimum`}</p>
                {checked && tableWritings[w.id] && <WritingFeedback result={tableWritings[w.id]} minWords={w.minWords} maxWords={w.maxWords} showAnswers={showAnswers} />}
              </div>
            );
          })()}
        </div>
      ))}

      {ex.writing && (
        <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300"><PenLine className="w-4 h-4" />Rédaction</span>
          <div className="el-text mt-2" dangerouslySetInnerHTML={{ __html: ex.writing.prompt }} />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Votre note est acceptée à partir de {PASS} % des éléments attendus. Rédigez directement dans la zone ci-dessous : le copier-coller est désactivé.</p>
          <NoPasteTextarea id={`w-${ex.id}`} value={text} onChange={write} rows={16} placeholder="Rédigez votre note d'analyse ici (une page)." />
          <p className={`mt-1 text-xs ${wordCount(text) >= ex.writing.minWords ? 'text-slate-500' : 'text-brand-emerald font-bold'}`}>{wordCount(text)} mots · {ex.writing.minWords} au minimum</p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={validate} disabled={filled === 0 && !text.trim()} className={primary}><CheckCircle2 className="w-4 h-4" />Valider mes réponses</button>
        <span className="text-sm text-slate-500">{filled} / {cells.length} cases remplies</span>
        <button onClick={exportCsv} className="ml-auto inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue dark:text-sky-300 underline"><Download className="w-4 h-4" />Télécharger pour Excel</button>
      </div>

      {checked && (
        <Result score={result.score}>
          <p className="mt-1 text-slate-700 dark:text-slate-300"><strong>Tableau : {result.good} point{result.good > 1 ? 's' : ''} sur {result.total}.</strong> {result.score < 100 ? 'Les cases marquées « Réponse incorrecte » sont à revoir : corrigez-les puis validez à nouveau.' : 'Toutes les réponses du tableau sont justes.'}</p>
          {result.checks.length > 0 && (
            <>
              <p className="mt-3 font-bold text-slate-800 dark:text-slate-100">Vérifications d'ensemble :</p>
              <ul className="mt-1.5 space-y-1.5">
                {result.checks.map((k) => (
                  <li key={k.label} className={`flex items-start gap-2 rounded-lg px-2 py-1 text-sm ${k.ok ? 'text-slate-800 dark:text-slate-200' : 'bg-[#C9933F]/15 font-bold text-[#7A5312] dark:text-amber-200'}`}>
                    {k.ok ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-brand-blue dark:text-sky-300" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#B07A1F] dark:text-amber-300" />}
                    <span>{k.label}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {(result.score === 100 || showAnswers) && <div className="el-text mt-3 text-sm" dangerouslySetInnerHTML={{ __html: ex.explanation }} />}
          <div className="mt-4 flex flex-wrap gap-3">
            {showAnswers && <button onClick={() => setShowKey((v) => !v)} className={ghost}>{showKey ? 'Masquer le corrigé complet' : 'Voir le corrigé complet (administrateur)'}</button>}
            <button onClick={restart} className={ghost}><RotateCcw className="w-4 h-4" />Recommencer</button>
          </div>
        </Result>
      )}
      {checked && writingResult && ex.writing && <WritingFeedback result={writingResult} minWords={ex.writing.minWords} showAnswers={showAnswers} />}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Practical case: situation, questions about it, then a writing about it

function CaseView({ ex, entry, showAnswers, onChange }: { ex: CaseExercise; entry: PracticeEntry; showAnswers?: boolean; onChange: (e: PracticeEntry) => void; key?: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>(entry.answers || {});
  const [text, setText] = useState(entry.text || '');
  const [checked, setChecked] = useState(entry.score !== undefined);
  const result = useMemo(() => gradeCase(ex, answers, text), [ex, answers, text]);
  const answered = ex.questions.filter((_q, i) => (answers[`q${i}`] ?? '') !== '').length;
  const words = wordCount(text);

  const choose = (i: number, a: number) => {
    const next = { ...answers, [`q${i}`]: String(a) };
    setAnswers(next);
    if (checked) setChecked(false);
    onChange({ ...entry, answers: next, text, pending: true });
  };
  const write = (v: string) => {
    setText(v);
    if (checked) setChecked(false);
    onChange({ ...entry, answers, text: v, pending: true });
  };
  const validate = () => {
    const r = gradeCase(ex, answers, text);
    setChecked(true);
    onChange({ ...entry, answers, text, pending: false, score: r.score, best: Math.max(r.score, entry.best ?? 0), writingScore: r.writing.score, submittedAt: new Date().toISOString(), attempts: (entry.attempts || 0) + 1 });
  };
  const restart = () => { setAnswers({}); setText(''); setChecked(false); onChange({ ...entry, answers: {}, text: '', pending: false }); };

  return (
    <div className={`${card} p-5 sm:p-7`}>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300"><Users className="w-4 h-4" />Cas pratique · {ex.skill}</span>
      <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{ex.title}</h1>
      <div className="el-text mt-3" dangerouslySetInnerHTML={{ __html: ex.situation }} />

      <h2 className="mt-7 text-lg font-extrabold text-brand-blue dark:text-sky-300">Partie 1 : {ex.questions.length} questions sur la situation</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Une seule bonne réponse par question ; les propositions se ressemblent volontairement : lisez chaque mot.</p>
      <ol className="mt-3 space-y-4">
        {ex.questions.map((q, i) => {
          const mine = answers[`q${i}`];
          const wrong = checked && !result.ok[i];
          return (
            <li key={i} className={`rounded-2xl border p-4 ${wrong ? 'border-brand-emerald bg-brand-emerald/5' : checked ? 'border-brand-blue/40 bg-brand-blue/[0.03]' : 'border-slate-200 dark:border-slate-800'}`}>
              <p className="font-bold text-slate-900 dark:text-white">{i + 1}. {q.question}</p>
              <div role="radiogroup" className="mt-2 space-y-1.5">
                {q.answers.map((a, k) => (
                  <label key={k} className={`flex items-start gap-2.5 rounded-xl border px-3 py-2 cursor-pointer text-sm ${mine === String(k) ? 'border-brand-blue bg-sky-50 dark:bg-sky-950/40' : 'border-slate-200 dark:border-slate-700'}`}>
                    <input type="radio" name={`${ex.id}-q${i}`} checked={mine === String(k)} onChange={() => choose(i, k)} className="mt-0.5 w-4 h-4 accent-[#003B6F] shrink-0" />
                    <span className="text-slate-800 dark:text-slate-100">{a}</span>
                  </label>
                ))}
              </div>
              {wrong && (
                <p className="mt-2 flex items-center gap-1 text-xs font-bold text-brand-emerald dark:text-[#E9A091]"><XCircle className="w-3.5 h-3.5" />{mine === undefined || mine === '' ? 'Sans réponse' : 'Réponse incorrecte'}{showAnswers ? ` · attendu : ${q.answers[q.good]}` : ''}</p>
              )}
            </li>
          );
        })}
      </ol>

      <h2 className="mt-7 text-lg font-extrabold text-brand-blue dark:text-sky-300">Partie 2 : votre rédaction</h2>
      <div className="el-text mt-1" dangerouslySetInnerHTML={{ __html: ex.writing.prompt }} />
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Votre texte est accepté à partir de {PASS} % des éléments attendus. Rédigez directement dans la zone ci-dessous : le copier-coller est désactivé.</p>
      <NoPasteTextarea id={`w-${ex.id}`} value={text} onChange={write} rows={12} placeholder="Rédigez votre réponse de chef de mission ici." />
      <p className={`mt-1 text-xs ${words >= ex.writing.minWords ? 'text-slate-500' : 'text-brand-emerald font-bold'}`}>{words} mot{words > 1 ? 's' : ''} · {ex.writing.minWords} au minimum</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={validate} disabled={answered === 0 && !text.trim()} className={primary}><CheckCircle2 className="w-4 h-4" />Valider mes réponses</button>
        <span className="text-sm text-slate-500">{answered} / {ex.questions.length} questions répondues</span>
      </div>
      {checked && (
        <Result score={result.score}>
          <p className="mt-1 text-slate-700 dark:text-slate-300">
            <strong>Questions : {result.good} sur {result.total} ({result.quizPct} %) · rédaction : {result.writing.score} %.</strong> La note du cas pratique est la moyenne des deux parties.
            {result.good < result.total ? ' Les questions marquées sont à revoir : relisez les faits et les règles de référence.' : ''}
          </p>
          <div className="mt-4"><button onClick={restart} className={ghost}><RotateCcw className="w-4 h-4" />Recommencer</button></div>
        </Result>
      )}
      {checked && <WritingFeedback result={result.writing} minWords={ex.writing.minWords} showAnswers={showAnswers} />}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Written answers

function WritingView({ ex, entry, showAnswers, learnerName, practice, onChange }: { ex: WritingExercise; entry: PracticeEntry; reviewer?: boolean; showAnswers?: boolean; learnerName?: string; practice?: { set: PracticeSet; state: PracticeState }; onChange: (e: PracticeEntry) => void; key?: string }) {
  const [text, setText] = useState(entry.text || '');
  const [parts, setParts] = useState<Record<string, string>>(entry.answers || {});
  const [checked, setChecked] = useState(entry.score !== undefined);
  const result = useMemo(() => gradeWritingEntry(ex, text, parts), [ex, text, parts]);
  const words = ex.sections ? ex.sections.reduce((n, s) => n + wordCount(parts[sectionKey(s.id)] || ''), 0) : wordCount(text);
  const empty = ex.sections ? !ex.sections.some((s) => (parts[sectionKey(s.id)] || '').trim()) : !text.trim();
  // The report can be downloaded once every section is written
  const missing = ex.sections ? ex.sections.filter((s) => !(parts[sectionKey(s.id)] || '').trim()) : [];
  const [pdfState, setPdfState] = useState<'idle' | 'busy' | 'error'>('idle');
  const downloadPdf = async () => {
    if (!ex.download || !ex.sections || missing.length) return;
    setPdfState('busy');
    try {
      const report = practice && midtermReport(practice.set, { ...practice.state, [ex.id]: { answers: parts } }, learnerName);
      if (!report) throw new Error('rapport introuvable');
      const { downloadReportPdf } = await import('../../lib/reportPdf');
      await downloadReportPdf(report.input);
      setPdfState('idle');
    } catch {
      setPdfState('error');
    }
  };
  const changePart = (id: string, v: string) => {
    const next = { ...parts, [sectionKey(id)]: v };
    setParts(next);
    if (checked) setChecked(false);
    onChange({ ...entry, answers: next, text, pending: true });
  };

  const change = (v: string) => {
    setText(v);
    if (checked) setChecked(false);
    onChange({ ...entry, answers: entry.answers || {}, text: v, pending: true });
  };
  const validate = () => {
    const r = gradeWritingEntry(ex, text, parts);
    setChecked(true);
    onChange({ ...entry, answers: parts, text, pending: false, score: r.score, best: Math.max(r.score, entry.best ?? 0), submittedAt: new Date().toISOString(), attempts: (entry.attempts || 0) + 1 });
  };
  const restart = () => { setText(''); setParts({}); setChecked(false); onChange({ ...entry, answers: {}, text: '', pending: false }); };

  return (
    <div className={`${card} p-5 sm:p-7`}>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300"><PenLine className="w-4 h-4" />Rédaction · {ex.skill}</span>
      <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{ex.title}</h1>
      <div className="el-text mt-3" dangerouslySetInnerHTML={{ __html: ex.prompt }} />
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Votre rédaction est acceptée à partir de {PASS} % des éléments attendus. Rédigez directement dans la zone ci-dessous : le copier-coller est désactivé.</p>
      {ex.sections ? (
        <div className="mt-4 space-y-4">
          {ex.sections.map((s) => {
            const v = parts[sectionKey(s.id)] || '', n = wordCount(v);
            return (
              <div key={s.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <label htmlFor={`w-${ex.id}-${s.id}`} className="block font-extrabold text-brand-blue dark:text-sky-300">{s.title}</label>
                {s.hint && <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{s.hint}</p>}
                <NoPasteTextarea id={`w-${ex.id}-${s.id}`} value={v} onChange={(x) => changePart(s.id, x)} rows={5} placeholder="Rédigez cette partie du rapport." />
                <p className="mt-1 text-xs text-slate-500">{n} mot{n > 1 ? 's' : ''}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <label htmlFor={`w-${ex.id}`} className="mt-4 block text-xs font-extrabold tracking-wide uppercase text-slate-600 dark:text-slate-300">Votre réponse</label>
          <NoPasteTextarea id={`w-${ex.id}`} value={text} onChange={change} />
        </>
      )}
      <p className={`mt-1 text-xs ${words >= ex.minWords ? 'text-slate-500' : 'text-brand-emerald font-bold'}`}>{ex.sections ? 'Total : ' : ''}{words} mot{words > 1 ? 's' : ''} · {ex.minWords} au minimum</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={validate} disabled={empty} className={primary}><CheckCircle2 className="w-4 h-4" />Valider ma rédaction</button>
        {ex.download && (
          <button onClick={downloadPdf} disabled={missing.length > 0 || pdfState === 'busy'} className={`${ghost} disabled:opacity-50 disabled:cursor-not-allowed`}>
            {pdfState === 'busy' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}Télécharger le rapport (PDF)
          </button>
        )}
        {checked && result.score < PASS && <button onClick={restart} className={ghost}><RotateCcw className="w-4 h-4" />Recommencer à zéro</button>}
      </div>
      {ex.download && missing.length > 0 && !empty && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Pour télécharger le rapport en PDF, rédigez toutes les parties. Il reste : {missing.map((s) => s.title.replace(/ \(.*\)$/, '')).join(' ; ')}.</p>
      )}
      {pdfState === 'error' && <p className="mt-2 text-sm font-bold text-brand-emerald">Le PDF n'a pas pu être créé. Réessayez.</p>}
      {checked && <WritingFeedback result={result} minWords={ex.minWords} showAnswers={showAnswers} />}
    </div>
  );
}
