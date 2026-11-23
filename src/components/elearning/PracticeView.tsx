// Practical work of a course: project file, spreadsheet-like exercises corrected cell by cell,
// written answers corrected from their key ideas. Formative: the correction is shown after each attempt.
import { useEffect, useMemo, useState, type ClipboardEvent, type ReactNode } from 'react';
import { ArrowLeft, CheckCircle2, ClipboardList, Download, FileSpreadsheet, FileText, Loader2, PenLine, RotateCcw, XCircle } from 'lucide-react';
import { inputCells, loadPractice, type PracticeSet, type SheetCell, type SheetExercise, type WritingExercise } from '../../data/elearning/practice';
import type { ElearningApi, PracticeEntry, PracticeState } from '../../lib/elearningApi';
import { formatValue, gradeSheet, gradeWriting, wordCount } from '../../lib/practiceGrading';

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
                {st?.score !== undefined ? <>Dernier résultat : <strong className={scoreColor(st.score)}>{st.score} %</strong>{st.best !== undefined && st.best !== st.score ? ` · meilleur : ${st.best} %` : ''}</> : 'Pas encore réalisé'}
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

const isInput = (c: SheetCell): c is Extract<SheetCell, { id: string }> => typeof c === 'object' && 'id' in c;
const fixedText = (c: SheetCell) => (typeof c === 'string' ? c : 'v' in c ? formatValue(c.v, c.fmt) : '');

function SheetView({ ex, entry, onChange }: { ex: SheetExercise; entry: PracticeEntry; onChange: (e: PracticeEntry) => void; key?: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>(entry.answers || {});
  const [checked, setChecked] = useState(entry.score !== undefined);
  const [showKey, setShowKey] = useState(false);
  const result = useMemo(() => gradeSheet(ex, answers), [ex, answers]);
  const cells = inputCells(ex);
  const filled = cells.filter((c) => (answers[c.id] || '').trim()).length;

  const set = (id: string, v: string) => {
    const next = { ...answers, [id]: v };
    setAnswers(next);
    if (checked) setChecked(false);
    onChange({ ...entry, answers: next });
  };
  const validate = () => {
    const r = gradeSheet(ex, answers);
    setChecked(true);
    onChange({ ...entry, answers, score: r.score, best: Math.max(r.score, entry.best ?? 0), submittedAt: new Date().toISOString(), attempts: (entry.attempts || 0) + 1 });
  };
  const restart = () => { setAnswers({}); setChecked(false); setShowKey(false); onChange({ ...entry, answers: {} }); };

  const exportCsv = () => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const lines = [ex.title, ''];
    for (const t of ex.tables) {
      if (t.title) lines.push(esc(t.title));
      lines.push(t.columns.map(esc).join(';'));
      for (const row of t.rows) lines.push(row.map((c) => esc(isInput(c) ? answers[c.id] || '' : fixedText(c))).join(';'));
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
          <strong>Règles de calcul</strong>
          <div className="mt-1" dangerouslySetInnerHTML={{ __html: ex.rules }} />
        </div>
      )}
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Saisissez un nombre (1 650 000), un pourcentage (33,3) ou un calcul comme dans un tableur (=4*550000). Les cases blanches sont à remplir.</p>

      {ex.tables.map((t, ti) => (
        <div key={ti} className="mt-5">
          {t.title && <h2 className="mb-2 font-extrabold text-brand-blue dark:text-sky-300">{t.title}</h2>}
          <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  {t.columns.map((c) => <th key={c} className="px-2.5 py-2 text-left font-extrabold text-slate-700 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 whitespace-nowrap">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row, ri) => (
                  <tr key={ri} className="even:bg-slate-50/60 dark:even:bg-slate-800/30">
                    {row.map((c, ci) => {
                      if (!isInput(c)) {
                        const numeric = typeof c === 'object';
                        return <td key={ci} className={`px-2.5 py-1.5 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 ${numeric ? 'text-right whitespace-nowrap' : ''} ${ci === 0 ? 'font-semibold' : ''}`}>{fixedText(c)}</td>;
                      }
                      const ok = result.ok[c.id];
                      const state = checked ? (ok ? 'ok' : 'ko') : '';
                      const expected = typeof c.answer === 'number' ? formatValue(c.answer, 'fmt' in c ? c.fmt : undefined) : c.answer;
                      const border = state === 'ok' ? 'border-brand-blue bg-brand-blue/5' : state === 'ko' ? 'border-brand-emerald bg-brand-emerald/5' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950';
                      return (
                        <td key={ci} className="px-1.5 py-1 border-b border-slate-200 dark:border-slate-800 align-top">
                          {'options' in c ? (
                            <select value={answers[c.id] || ''} onChange={(e) => set(c.id, e.target.value)} aria-label={t.columns[ci]}
                              className={`w-full min-w-[8.5rem] rounded-lg border-[1.5px] px-2 py-1.5 text-slate-900 dark:text-white ${border}`}>
                              <option value="">Choisir…</option>
                              {c.options.map((o) => <option key={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input value={answers[c.id] || ''} onChange={(e) => set(c.id, e.target.value)} inputMode="decimal" aria-label={t.columns[ci]}
                              className={`w-full ${'fmt' in c && c.fmt === 'fcfa' ? 'min-w-[8.5rem]' : 'min-w-[5.5rem]'} rounded-lg border-[1.5px] px-2 py-1.5 text-right text-slate-900 dark:text-white ${border}`} />
                          )}
                          {checked && (showKey || !ok) && (
                            <span className={`mt-0.5 flex items-center gap-1 text-[11px] font-bold whitespace-nowrap ${ok ? 'text-brand-blue dark:text-sky-300' : 'text-brand-emerald dark:text-[#E9A091]'}`}>
                              {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}{showKey || !ok ? `Attendu : ${expected}` : ''}
                            </span>
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

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={validate} disabled={filled === 0} className={primary}><CheckCircle2 className="w-4 h-4" />Valider mes réponses</button>
        <span className="text-sm text-slate-500">{filled} / {cells.length} cases remplies</span>
        <button onClick={exportCsv} className="ml-auto inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue dark:text-sky-300 underline"><Download className="w-4 h-4" />Télécharger pour Excel</button>
      </div>

      {checked && (
        <Result score={result.score}>
          <p className="mt-1 text-slate-700 dark:text-slate-300"><strong>{result.good} bonne{result.good > 1 ? 's' : ''} réponse{result.good > 1 ? 's' : ''} sur {result.total}.</strong> Les cases erronées indiquent la valeur attendue.</p>
          <div className="el-text mt-3 text-sm" dangerouslySetInnerHTML={{ __html: ex.explanation }} />
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => setShowKey((v) => !v)} className={ghost}>{showKey ? 'Masquer le corrigé complet' : 'Voir le corrigé complet'}</button>
            <button onClick={restart} className={ghost}><RotateCcw className="w-4 h-4" />Recommencer</button>
          </div>
        </Result>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Written answers

function WritingView({ ex, entry, reviewer, onChange }: { ex: WritingExercise; entry: PracticeEntry; reviewer?: boolean; onChange: (e: PracticeEntry) => void; key?: string }) {
  const [text, setText] = useState(entry.text || '');
  const [checked, setChecked] = useState(entry.score !== undefined);
  const [pasteWarning, setPasteWarning] = useState(false);
  const result = useMemo(() => gradeWriting(ex, text), [ex, text]);
  const words = wordCount(text);
  const attempted = (entry.attempts || 0) > 0;

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
  // The answer is written on the site: pasting a text written elsewhere (or by an AI) is not allowed
  const noPaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    if (reviewer) return;
    e.preventDefault();
    setPasteWarning(true);
    window.setTimeout(() => setPasteWarning(false), 4000);
  };

  return (
    <div className={`${card} p-5 sm:p-7`}>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300"><PenLine className="w-4 h-4" />Rédaction · {ex.skill}</span>
      <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{ex.title}</h1>
      <div className="el-text mt-3" dangerouslySetInnerHTML={{ __html: ex.prompt }} />
      <label htmlFor={`w-${ex.id}`} className="mt-4 block text-xs font-extrabold tracking-wide uppercase text-slate-600 dark:text-slate-300">Votre réponse</label>
      <textarea id={`w-${ex.id}`} value={text} onChange={(e) => change(e.target.value)} onPaste={noPaste} onDrop={(e) => { if (!reviewer) e.preventDefault(); }} rows={12}
        className="mt-1.5 w-full rounded-xl border-[1.5px] border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:border-brand-blue"
        placeholder="Rédigez votre réponse ici, en phrases complètes." />
      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
        <span className={words >= ex.minWords ? 'text-slate-500' : 'text-brand-emerald font-bold'}>{words} mot{words > 1 ? 's' : ''} · {ex.minWords} au minimum</span>
        {pasteWarning && <span className="font-bold text-brand-emerald">Le collage est désactivé : rédigez votre réponse directement ici.</span>}
      </div>
      <div className="mt-4">
        <button onClick={validate} disabled={!text.trim()} className={primary}><CheckCircle2 className="w-4 h-4" />Valider ma rédaction</button>
      </div>

      {checked && (
        <Result score={result.score}>
          {result.tooShort && <p className="mt-1 font-bold text-brand-emerald">Réponse trop courte ({result.words} mots pour {ex.minWords} attendus) : le résultat est limité à 50 %.</p>}
          <p className="mt-2 font-bold text-slate-800 dark:text-slate-100">Ce que la correction a recherché dans votre texte :</p>
          <ul className="mt-2 space-y-1.5">
            {result.criteria.map((c) => (
              <li key={c.label} className="flex items-start gap-2 text-sm">
                {c.met ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-brand-blue dark:text-sky-300" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-brand-emerald dark:text-[#E9A091]" />}
                <span className={c.met ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}>{c.label}{c.met ? '' : ' : absent ou pas assez explicite'}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">La correction automatique repère les idées clés attendues ; elle ne juge pas le style. Comparez votre texte au corrigé ci-dessous.</p>
        </Result>
      )}
      {(checked || attempted) && (
        <details className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800" open={checked}>
          <summary className="px-4 py-3 cursor-pointer font-extrabold text-slate-800 dark:text-slate-100">Corrigé proposé</summary>
          <div className="el-text px-4 pb-4" dangerouslySetInnerHTML={{ __html: ex.model }} />
        </details>
      )}
    </div>
  );
}
