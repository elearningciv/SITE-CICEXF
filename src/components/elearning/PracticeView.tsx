// Practical work of a course: project file, spreadsheet-like exercises corrected cell by cell,
// written answers corrected from their key ideas. Formative: the correction is shown after each attempt.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, CheckCircle2, ClipboardList, Download, FileSpreadsheet, FileText, Loader2, PenLine, RotateCcw, XCircle } from 'lucide-react';
import { gradedCells, inputCells, isCalc, isChoice, isInput, isTextInput, loadPractice, type PracticeSet, type SheetCell, type SheetExercise, type WritingExercise } from '../../data/elearning/practice';
import type { ElearningApi, PracticeEntry, PracticeState } from '../../lib/elearningApi';
import { PASS } from '../../data/elearning';
import { calcText, formatValue, gradeSheet, gradeSheetWriting, gradeWriting, makeCtx, wordCount } from '../../lib/practiceGrading';

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
  go: (h: string) => void;
}

export default function PracticeView({ api, courseId, courseTitle, exerciseId, reviewer, go }: Props) {
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
  if (ex) {
    const entry = state[ex.id] || { answers: {} };
    return (
      <div className="max-w-6xl mx-auto">
        <button onClick={back} className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue dark:text-sky-300 underline"><ArrowLeft className="w-4 h-4" />Tous les travaux pratiques</button>
        <Dossier set={set} compact />
        {ex.kind === 'sheet'
          ? <SheetView key={ex.id} ex={ex} entry={entry} onChange={(e) => update(ex.id, e)} />
          : <WritingView key={ex.id} ex={ex} entry={entry} reviewer={reviewer} onChange={(e) => update(ex.id, e)} />}
        <Next set={set} current={ex.id} go={(id) => go(`pratique/${courseId}/${id}`)} />
      </div>
    );
  }

  const done = set.exercises.filter((e) => state[e.id]?.score !== undefined).length;
  return (
    <div className="max-w-6xl mx-auto">
      <button onClick={() => go(`parcours/${courseId}`)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue dark:text-sky-300 underline"><ArrowLeft className="w-4 h-4" />Retour au parcours</button>
      <div className={`${card} p-5 sm:p-7 mb-5`}>
        <span className="text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300">{courseTitle}</span>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2"><ClipboardList className="w-6 h-6 text-[#C9933F]" />{set.title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{set.intro}</p>
        <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">{done} exercice{done > 1 ? 's' : ''} réalisé{done > 1 ? 's' : ''} sur {set.exercises.length}</p>
      </div>
      <Dossier set={set} />
      <div className="grid gap-4 sm:grid-cols-2 mt-5">
        {set.exercises.map((e) => {
          const st = state[e.id];
          return (
            <div key={e.id} className={`${card} p-5 flex flex-col`}>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300">
                {e.kind === 'sheet' ? <FileSpreadsheet className="w-4 h-4" /> : <PenLine className="w-4 h-4" />}{e.kind === 'sheet' ? 'Tableau à remplir' : 'Rédaction'} · {e.skill}
              </span>
              <h2 className="mt-1.5 text-lg font-extrabold text-slate-900 dark:text-white">{e.title}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 flex-1">
                {st?.score !== undefined ? <>Dernier résultat : <strong className={scoreColor(st.score)}>{st.score} %</strong>{st.best !== undefined && st.best !== st.score ? ` · meilleur : ${st.best} %` : ''}{e.kind === 'writing' ? (st.score >= PASS ? ' · rédaction acceptée' : ' · à refaire') : st.writingScore !== undefined ? (st.writingScore >= PASS ? ' · note acceptée' : ' · note à refaire') : ''}</> : 'Pas encore réalisé'}
              </p>
              <div className="mt-3">
                <button onClick={() => go(`pratique/${courseId}/${e.id}`)} className={st?.score !== undefined ? ghost : primary}>{st?.score !== undefined ? 'Revoir ou recommencer' : 'Commencer'}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

function Next({ set, current, go }: { set: PracticeSet; current: string; go: (id: string) => void }) {
  const i = set.exercises.findIndex((e) => e.id === current);
  const next = set.exercises[i + 1];
  if (!next) return null;
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
function WritingFeedback({ result, minWords }: { result: ReturnType<typeof gradeWriting>; minWords: number }) {
  const accepted = result.score >= PASS;
  return (
    <Result score={result.score}>
      {accepted ? (
        <p className="mt-1 inline-flex items-center gap-2 font-extrabold text-brand-blue dark:text-sky-300"><CheckCircle2 className="w-5 h-5" />Rédaction acceptée : vous atteignez au moins {PASS} % des éléments attendus.</p>
      ) : (
        <p className="mt-1 font-extrabold text-brand-emerald dark:text-[#E9A091]">Rédaction non acceptée : il faut au moins {PASS} %. Complétez votre texte avec les éléments surlignés ci-dessous, puis validez à nouveau.</p>
      )}
      {result.tooShort && <p className="mt-1 font-bold text-brand-emerald">Réponse trop courte ({result.words} mots pour {minWords} attendus) : le résultat est limité à 50 %.</p>}
      <p className="mt-3 font-bold text-slate-800 dark:text-slate-100">Les éléments recherchés dans votre texte :</p>
      <ul className="mt-2 space-y-1.5">
        {result.criteria.map((c) => (
          <li key={c.label} className={`flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-sm ${c.met ? 'text-slate-800 dark:text-slate-200' : 'bg-[#C9933F]/15 border border-[#C9933F]/50 font-bold text-[#7A5312] dark:text-amber-200'}`}>
            {c.met ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-brand-blue dark:text-sky-300" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#B07A1F] dark:text-amber-300" />}
            <span>{c.met ? c.label : `À ajouter : ${c.label}`}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">La correction repère les idées clés attendues ; elle ne juge pas le style.</p>
    </Result>
  );
}

function SheetView({ ex, entry, onChange }: { ex: SheetExercise; entry: PracticeEntry; onChange: (e: PracticeEntry) => void; key?: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>(entry.answers || {});
  const [text, setText] = useState(entry.text || '');
  const [checked, setChecked] = useState(entry.score !== undefined);
  // Cells calculated live from what is typed, as in a spreadsheet
  const ctx = useMemo(() => makeCtx(ex, answers), [ex, answers]);
  const result = useMemo(() => gradeSheet(ex, answers), [ex, answers]);
  const writingResult = useMemo(() => gradeSheetWriting(ex, answers, text), [ex, answers, text]);
  const cells = inputCells(ex);
  const graded = new Set(gradedCells(ex).map((c) => c.id));
  const filled = cells.filter((c) => (answers[c.id] || '').trim()).length;

  const set = (id: string, v: string) => {
    const next = { ...answers, [id]: v };
    setAnswers(next);
    if (checked) setChecked(false);
    onChange({ ...entry, answers: next, text });
  };
  const write = (v: string) => {
    setText(v);
    if (checked) setChecked(false);
    onChange({ ...entry, answers, text: v });
  };
  const validate = () => {
    const r = gradeSheet(ex, answers);
    const w = gradeSheetWriting(ex, answers, text);
    setChecked(true);
    onChange({
      ...entry, answers, text, score: r.score, best: Math.max(r.score, entry.best ?? 0),
      ...(w ? { writingScore: w.score } : {}), submittedAt: new Date().toISOString(), attempts: (entry.attempts || 0) + 1
    });
  };
  const restart = () => { setAnswers({}); setText(''); setChecked(false); onChange({ ...entry, answers: {}, text: '' }); };

  const exportCsv = () => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const lines = [esc(ex.title), ''];
    for (const t of ex.tables) {
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
          <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  {t.columns.map((c, ci) => <th key={ci} className="px-2.5 py-2 text-left font-extrabold text-slate-700 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 align-bottom">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row, ri) => (
                  <tr key={ri} className="even:bg-slate-50/60 dark:even:bg-slate-800/30">
                    {row.map((c, ci) => {
                      if (isCalc(c)) {
                        return <td key={ci} className="px-2.5 py-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/70 text-right font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">{calcText(c, ctx)}</td>;
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
                            <span className="mt-0.5 flex items-center gap-1 text-[11px] font-bold whitespace-nowrap text-brand-emerald dark:text-[#E9A091]"><XCircle className="w-3.5 h-3.5" />Réponse incorrecte</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          {result.score === 100 && <div className="el-text mt-3 text-sm" dangerouslySetInnerHTML={{ __html: ex.explanation }} />}
          <div className="mt-4"><button onClick={restart} className={ghost}><RotateCcw className="w-4 h-4" />Recommencer</button></div>
        </Result>
      )}
      {checked && writingResult && ex.writing && <WritingFeedback result={writingResult} minWords={ex.writing.minWords} />}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Written answers

function WritingView({ ex, entry, onChange }: { ex: WritingExercise; entry: PracticeEntry; reviewer?: boolean; onChange: (e: PracticeEntry) => void; key?: string }) {
  const [text, setText] = useState(entry.text || '');
  const [checked, setChecked] = useState(entry.score !== undefined);
  const result = useMemo(() => gradeWriting(ex, text), [ex, text]);
  const words = wordCount(text);

  const change = (v: string) => {
    setText(v);
    if (checked) setChecked(false);
    onChange({ ...entry, answers: entry.answers || {}, text: v });
  };
  const validate = () => {
    const r = gradeWriting(ex, text);
    setChecked(true);
    onChange({ ...entry, answers: entry.answers || {}, text, score: r.score, best: Math.max(r.score, entry.best ?? 0), submittedAt: new Date().toISOString(), attempts: (entry.attempts || 0) + 1 });
  };
  const restart = () => { setText(''); setChecked(false); onChange({ ...entry, answers: entry.answers || {}, text: '' }); };

  return (
    <div className={`${card} p-5 sm:p-7`}>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300"><PenLine className="w-4 h-4" />Rédaction · {ex.skill}</span>
      <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{ex.title}</h1>
      <div className="el-text mt-3" dangerouslySetInnerHTML={{ __html: ex.prompt }} />
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Votre rédaction est acceptée à partir de {PASS} % des éléments attendus. Rédigez directement dans la zone ci-dessous : le copier-coller est désactivé.</p>
      <label htmlFor={`w-${ex.id}`} className="mt-4 block text-xs font-extrabold tracking-wide uppercase text-slate-600 dark:text-slate-300">Votre réponse</label>
      <NoPasteTextarea id={`w-${ex.id}`} value={text} onChange={change} />
      <p className={`mt-1 text-xs ${words >= ex.minWords ? 'text-slate-500' : 'text-brand-emerald font-bold'}`}>{words} mot{words > 1 ? 's' : ''} · {ex.minWords} au minimum</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={validate} disabled={!text.trim()} className={primary}><CheckCircle2 className="w-4 h-4" />Valider ma rédaction</button>
        {checked && result.score < PASS && <button onClick={restart} className={ghost}><RotateCcw className="w-4 h-4" />Recommencer à zéro</button>}
      </div>
      {checked && <WritingFeedback result={result} minWords={ex.minWords} />}
    </div>
  );
}
