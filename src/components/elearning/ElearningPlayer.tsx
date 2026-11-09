import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, Eye, EyeOff, Loader2, LogOut, RotateCcw, XCircle } from 'lucide-react';
import { PASS, isExam, stepQuestionCount, stepWords, type Course, type CourseStep } from '../../data/elearning';
import type { Answers, Draft, ElearningApi, GradeResult, Progress } from '../../lib/elearningApi';
import { learnerErrorMessage } from '../../lib/elearningApi';

type Phase = 'lesson' | 'intro' | 'quiz' | 'result';

const shuffled = (n: number) => {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
};

const stepWord = (s: CourseStep) => stepWords(s).the;

interface Props {
  api: ElearningApi;
  course: Course;
  step: CourseStep;
  onProgress: (p: Progress) => void;
  onExit: () => void;
  onCertificate: () => void;
  onRestart: () => void;
  /** Work saved when the learner left this step: they continue where they stopped */
  resume?: Draft | null;
  /** Administrator control mode: free navigation between steps and preview of the questions with their answers */
  reviewer?: boolean;
  onNavigate?: (stepId: string) => void;
}

// Answer keys fetched for the control mode, kept for the session
const keyCache: Record<string, Promise<Record<string, number[][]>>> = {};

/**
 * Chapter (or exam) player in focus mode: the module text, then its quizzes one question at a time
 * (the text closes, no correction shown), and the result only at the end, graded by the server.
 */
export default function ElearningPlayer({ api, course, step, onProgress, onExit, onCertificate, onRestart, resume, reviewer, onNavigate }: Props) {
  const firstHasText = !!course.modules[step.modules[0].id].text;
  const saved = resume && resume.stepId === step.id && step.modules[resume.mi] ? resume : null;
  const [mi, setMi] = useState(saved ? saved.mi : 0);
  const [phase, setPhase] = useState<Phase>(saved ? saved.phase : firstHasText ? 'lesson' : 'intro');
  const [qi, setQi] = useState(saved ? saved.qi : 0);
  const [k, setK] = useState(saved ? saved.k : 0);
  const [answers, setAnswers] = useState<Answers>(saved ? saved.answers : {});
  const [resumed, setResumed] = useState(!!saved);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState(false);
  const [answerKey, setAnswerKey] = useState<Record<string, number[][]> | null>(null);
  const [keyError, setKeyError] = useState('');
  useEffect(() => {
    if (!reviewer || !preview || answerKey) return;
    (keyCache[course.id] ||= api.getAnswerKey(course.id)).then(setAnswerKey).catch((e) => { delete keyCache[course.id]; setKeyError(learnerErrorMessage(e)); });
  }, [reviewer, preview, answerKey, api, course.id]);
  const stepIndex = course.steps.findIndex((x) => x.id === step.id);
  const prevStep = course.steps[stepIndex - 1], nextStep = course.steps[stepIndex + 1];
  // Answers appear in a new random order at every attempt (kept when the learner resumes)
  const order = useMemo(() => {
    const o: Record<string, number[]> = {};
    for (const m of step.modules) course.modules[m.id].quizzes.forEach((z, a) => z.questions.forEach((q, b) => {
      const key = `${m.id}-${a}-${b}`;
      const kept = saved?.order[key];
      o[key] = kept && kept.length === q.answers.length ? kept : shuffled(q.answers.length);
    }));
    return o;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, step]);

  const exam = isExam(step);
  const words = stepWords(step);
  const mod = step.modules[mi];
  const content = course.modules[mod.id];
  const quiz = content.quizzes[qi];
  // Acronyms that appear in this module's text (definitions from the course glossary)
  const moduleText = content.text.replace(/<[^>]+>/g, ' ') + ' ' + content.objectives.join(' ');
  const moduleGlossary = (course.glossary || []).filter((g) => new RegExp(`(^|[^\\p{L}\\d])${g.s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}\\d])`, 'u').test(moduleText));
  const total = stepQuestionCount(course, step);
  const answered = (Object.values(answers) as number[][][]).reduce<number>((n, m) => n + m.reduce<number>((a, arr) => a + (arr ? arr.filter((v) => v !== undefined).length : 0), 0), 0);
  const partTitle = step.part ? course.parts.find((p) => p.id === step.part)?.title.split(' : ')[0] : 'Certification';

  // Focus mode: menu, footer and floating buttons are hidden while the learner works
  useEffect(() => {
    document.body.classList.add('el-focus');
    return () => document.body.classList.remove('el-focus');
  }, []);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [mi, phase, qi, k]);
  // Work in progress is saved continuously: leaving the site and coming back resumes here
  useEffect(() => {
    if (phase === 'result') return;
    api.saveDraft(course.id, { stepId: step.id, mi, phase, qi, k, answers, order, savedAt: new Date().toISOString() });
  }, [api, course.id, step.id, mi, phase, qi, k, answers, order]);

  const chosen = answers[mod.id]?.[qi]?.[k];

  const choose = (ai: number) => {
    setAnswers((prev) => {
      const m = (prev[mod.id] || []).map((a) => (a ? [...a] : a));
      m[qi] = m[qi] || [];
      m[qi][k] = ai;
      return { ...prev, [mod.id]: m };
    });
  };

  const submit = async (final: Answers) => {
    setPhase('result');
    setSending(true);
    setError('');
    try {
      const r = await api.grade(course.id, step.id, final);
      api.clearDraft(course.id);
      setResult(r);
      onProgress(r.progress);
    } catch (e) {
      setError(learnerErrorMessage(e));
    } finally {
      setSending(false);
    }
  };

  const next = () => {
    if (k < quiz.questions.length - 1) return setK(k + 1);
    if (qi < content.quizzes.length - 1) { setQi(qi + 1); setK(0); return setPhase('intro'); }
    if (mi < step.modules.length - 1) {
      const n = mi + 1;
      setMi(n); setQi(0); setK(0);
      return setPhase(course.modules[step.modules[n].id].text ? 'lesson' : 'intro');
    }
    submit(answers);
  };

  const quit = () => onExit();

  const where = phase === 'result'
    ? `Résultat ${words.of}`
    : exam ? (step.kind === 'test' ? 'Test de chapitre' : 'Examen')
    : step.modules.length > 1
      ? `Module ${mi + 1}/${step.modules.length}${phase === 'lesson' ? ' · Lecture' : ` · Quiz ${qi + 1}/${content.quizzes.length}`}`
      : phase === 'lesson' ? 'Lecture du module' : 'Quiz du module';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 mb-4">
        <img src="/elearning/logo-cicexf.png" alt="CICEXF" className="h-9 w-auto" />
        <div className="flex-1 min-w-[220px]">
          <small className="block text-[11px] font-extrabold tracking-widest uppercase text-slate-500">{course.title} · {partTitle}</small>
          <strong className="text-brand-blue dark:text-sky-300">{step.title}</strong>
          <span className="text-slate-600 dark:text-slate-300"> · {where}</span>
        </div>
        <div className="min-w-[180px]">
          <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <i className="block h-full bg-amber-400 transition-all" style={{ width: `${Math.round((answered / total) * 100)}%` }} />
          </div>
          <small className="text-slate-500 dark:text-slate-400">{answered} / {total} questions répondues</small>
        </div>
        <button onClick={quit} className="inline-flex items-center gap-2 rounded-xl border-2 border-brand-blue text-brand-blue dark:border-sky-300 dark:text-sky-300 px-4 py-2 text-sm font-extrabold hover:bg-brand-blue hover:text-white transition-colors">
          <LogOut className="w-4 h-4" /> Quitter {stepWord(step)}
        </button>
      </div>
      {phase !== 'result' && (
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          Votre progression est enregistrée automatiquement : vous pouvez quitter et reprendre plus tard exactement à cet endroit.
        </p>
      )}
      {resumed && phase !== 'result' && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border-l-4 border-brand-blue px-4 py-3 text-sm text-slate-800 dark:text-slate-200">
          <span className="flex-1"><strong>Bon retour !</strong> Vous reprenez {stepWord(step)} là où vous vous étiez arrêté ({answered} question{answered > 1 ? 's' : ''} déjà répondue{answered > 1 ? 's' : ''}).</span>
          <button onClick={() => setResumed(false)} className="text-xs font-bold underline">Fermer</button>
        </div>
      )}

      {reviewer && (
        <div className="mb-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900 p-3 flex flex-wrap items-center gap-2">
          <strong className="text-sm text-violet-900 dark:text-violet-200 mr-auto">Mode contrôle administrateur</strong>
          <button disabled={!prevStep} onClick={() => prevStep && onNavigate?.(prevStep.id)} className="inline-flex items-center gap-1.5 rounded-xl border border-violet-300 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold text-violet-900 dark:text-violet-200 disabled:opacity-40"><ArrowLeft className="w-4 h-4" />Étape précédente</button>
          <button onClick={() => setPreview((v) => !v)} className="inline-flex items-center gap-1.5 rounded-xl bg-violet-700 px-3 py-2 text-sm font-bold text-white">{preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}{preview ? 'Masquer les questions' : 'Voir toutes les questions et réponses'}</button>
          <button disabled={!nextStep} onClick={() => nextStep && onNavigate?.(nextStep.id)} className="inline-flex items-center gap-1.5 rounded-xl border border-violet-300 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold text-violet-900 dark:text-violet-200 disabled:opacity-40">Étape suivante<ArrowRight className="w-4 h-4" /></button>
        </div>
      )}
      {reviewer && preview && (
        <section className="mb-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-violet-300 dark:border-violet-800 p-5 sm:p-7">
          <p className="text-xs font-extrabold tracking-widest uppercase text-violet-700 dark:text-violet-300">Aperçu administrateur · {total} questions</p>
          <h2 className="mt-1 text-xl font-extrabold text-brand-blue dark:text-sky-300">{step.title}</h2>
          {keyError && <p className="mt-2 text-sm font-bold text-brand-emerald">{keyError}</p>}
          {!answerKey && !keyError && <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500"><Loader2 className="w-4 h-4 animate-spin" />Chargement des bonnes réponses…</p>}
          {step.modules.map((m) => course.modules[m.id].quizzes.map((z, zi) => (
            <div key={`${m.id}-${zi}`} className="mt-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white">{z.title}</h3>
              <ol className="mt-2 space-y-3 list-decimal pl-5">
                {z.questions.map((qq, qk) => (
                  <li key={qk} className="text-slate-800 dark:text-slate-200">
                    <span className="font-bold">{qq.question}</span>
                    <ul className="mt-1 space-y-0.5">
                      {qq.answers.map((a, ai) => {
                        const good = answerKey?.[m.id]?.[zi]?.[qk] === ai;
                        return <li key={ai} className={`text-sm ${good ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>{good ? '✓ ' : '• '}{a}</li>;
                      })}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          )))}
        </section>
      )}

      <article className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-10 shadow-sm">
        {phase === 'lesson' && (
          <>
            <h2 className="font-display text-2xl sm:text-[32px] font-extrabold uppercase leading-tight text-slate-900 dark:text-white break-words">{mod.title}</h2>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-emerald dark:text-orange-300">Objectifs du module</p>
            <ul className="mt-1.5 list-disc pl-5 space-y-1 text-[15px] sm:text-base leading-relaxed text-slate-700 dark:text-slate-200">
              {content.objectives.map((o) => <li key={o}>{o}</li>)}
            </ul>
            <hr className="my-6 border-slate-200 dark:border-slate-800" />
            <div className="el-text" dangerouslySetInnerHTML={{ __html: content.text }} />
            {moduleGlossary.length > 0 && (
              <details className="group mt-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-extrabold text-slate-800 dark:text-slate-100">
                  Sigles utilisés dans ce module ({moduleGlossary.length})
                  <span className="ml-auto text-xs font-bold text-brand-blue dark:text-sky-300 group-open:hidden">Afficher</span>
                </summary>
                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 px-4 pb-4 text-sm">
                  {moduleGlossary.map((g) => (
                    <div key={g.s} className="flex gap-2"><dt className="font-extrabold text-brand-blue dark:text-sky-300 shrink-0 min-w-[3.5rem]">{g.s}</dt><dd className="text-slate-600 dark:text-slate-400">{g.d}</dd></div>
                  ))}
                </dl>
              </details>
            )}
            <div className="mt-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 px-5 py-4 text-sm text-slate-800 dark:text-slate-200">
              <strong>Avant de commencer {content.quizzes.length > 1 ? 'les quiz' : 'le quiz'} :</strong> ce module comporte {content.quizzes.length > 1 ? `${content.quizzes.length} quiz de ${content.quizzes[0].questions.length} questions` : `un quiz de ${content.quizzes[0].questions.length} questions`}{step.kind === 'module' ? `, à réussir avec ${PASS} % au moins pour débloquer l'étape suivante` : ''}.
              Dès que vous commencez, <strong>ce texte se ferme</strong> et vous ne pourrez plus le consulter pendant les questions. Prenez le temps de bien le lire.
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={() => { setQi(0); setK(0); setPhase('intro'); }} className="inline-flex items-center gap-2 rounded-xl bg-brand-emerald hover:bg-brand-emerald-dark text-white px-5 py-3 font-extrabold text-sm">
                J'ai terminé ma lecture, commencer {content.quizzes.length > 1 ? 'les quiz' : 'le quiz'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {phase === 'intro' && (
          <div className="text-center py-4">
            <p className="text-xs font-extrabold tracking-widest uppercase text-brand-emerald">{exam ? course.title : mod.title}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-brand-blue dark:text-sky-300">{quiz.title}</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">{quiz.questions.length} questions, une à la fois. Choisissez une réponse puis passez à la suivante : il n'est pas possible de revenir en arrière.</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Aucune correction n'est affichée pendant {exam ? words.the : 'le quiz'}. Votre résultat sera calculé à la fin {words.of}.</p>
            <button onClick={() => { setK(0); setPhase('quiz'); }} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-emerald hover:bg-brand-emerald-dark text-white px-6 py-3 font-extrabold text-sm">
              {exam ? `Commencer ${words.the}` : `Commencer le ${quiz.title.split(' : ')[0].toLowerCase()}`} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {phase === 'quiz' && (
          <>
            <p className="text-xs font-extrabold tracking-widest uppercase text-brand-emerald">{quiz.title} · Question {k + 1} sur {quiz.questions.length}</p>
            <p className="mt-2 mb-5 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{quiz.questions[k].question}</p>
            <div role="radiogroup" className="space-y-2.5">
              {order[`${mod.id}-${qi}-${k}`].map((ai) => (
                <label key={ai} className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 cursor-pointer transition-colors ${chosen === ai ? 'border-brand-blue bg-sky-50 dark:bg-sky-950/40' : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}>
                  <input type="radio" name={`q-${mod.id}-${qi}-${k}`} checked={chosen === ai} onChange={() => choose(ai)} className="w-[18px] h-[18px] accent-[#003B6F]" />
                  <span className="text-slate-800 dark:text-slate-100">{quiz.questions[k].answers[ai]}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={next} disabled={chosen === undefined} className="inline-flex items-center gap-2 rounded-xl bg-brand-emerald hover:bg-brand-emerald-dark disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 font-extrabold text-sm">
                {k === quiz.questions.length - 1 ? 'Terminer ce quiz' : 'Question suivante'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {phase === 'result' && (
          <div className="text-center py-2">
            <p className="text-xs font-extrabold tracking-widest uppercase text-brand-emerald">Fin {words.of}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-brand-blue dark:text-sky-300">{step.title}</h2>
            {sending && <p className="mt-8 mb-6 inline-flex items-center gap-2 text-slate-600 dark:text-slate-300"><Loader2 className="w-5 h-5 animate-spin" /> Correction en cours…</p>}
            {!sending && error && (
              <div className="mt-6">
                <p className="font-bold text-brand-emerald">{error}</p>
                <button onClick={() => submit(answers)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-emerald text-white px-5 py-3 font-extrabold text-sm">
                  <RotateCcw className="w-4 h-4" /> Réessayer l'envoi
                </button>
              </div>
            )}
            {!sending && result && (
              <>
                <p className={`mt-2 text-5xl font-extrabold ${result.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-brand-emerald'}`}>{result.pct} %</p>
                <p className="mt-1 text-slate-700 dark:text-slate-300"><strong>{result.good} bonnes réponses sur {result.total}.</strong> Seuil requis : {PASS} %.</p>
                {!exam && result.modules.length > 1 && (
                  <table className="w-full mt-5 text-sm text-left">
                    <thead><tr className="border-b border-slate-200 dark:border-slate-700"><th className="py-2 pr-3">Module</th><th className="py-2 text-right">Résultat</th></tr></thead>
                    <tbody>
                      {result.modules.map((m) => (
                        <tr key={m.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 pr-3 text-slate-700 dark:text-slate-300">{step.modules.find((x) => x.id === m.id)?.title}</td>
                          <td className="py-2 text-right font-extrabold">{m.pct} %</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {result.passed ? (
                  <>
                    <p className="mt-5 inline-flex items-center gap-2 font-extrabold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      Félicitations : {words.done}. {step.kind === 'final' ? 'Votre certificat est prêt.' : nextTitle(course, step)}
                    </p>
                    <div className="mt-5 flex justify-center">
                      {step.kind === 'final'
                        ? <button onClick={onCertificate} className="inline-flex items-center gap-2 rounded-xl bg-brand-emerald text-white px-6 py-3 font-extrabold text-sm"><BookOpenCheck className="w-4 h-4" /> Voir mon certificat</button>
                        : <button onClick={onExit} className="inline-flex items-center gap-2 rounded-xl bg-brand-emerald text-white px-6 py-3 font-extrabold text-sm">Retour au parcours <ArrowRight className="w-4 h-4" /></button>}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-5 inline-flex items-center gap-2 font-extrabold text-brand-emerald">
                      <XCircle className="w-5 h-5" />
                      Vous n'avez pas atteint les {PASS} % requis pour {words.next}.
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {step.kind === 'module' ? 'Relisez attentivement le texte du module, puis recommencez-le.' : step.kind === 'test' ? 'Revoyez les modules du chapitre, puis repassez le test.' : exam ? "Révisez les chapitres concernés, puis repassez l'examen." : 'Relisez les modules où votre résultat est le plus faible, puis recommencez le chapitre.'} Vous pouvez recommencer autant de fois que nécessaire.
                    </p>
                    {result.progress.simulation && (
                      <p className="mt-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 px-3 py-2 text-sm font-bold text-violet-800 dark:text-violet-300">
                        Mode simulation : vous pouvez continuer {step.kind === 'final' ? 'et voir le certificat spécimen' : "vers l'étape suivante"} malgré ce résultat.
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                      {result.progress.simulation && (step.kind === 'final'
                        ? <button onClick={onCertificate} className="inline-flex items-center gap-2 rounded-xl bg-violet-700 text-white px-5 py-3 font-extrabold text-sm"><BookOpenCheck className="w-4 h-4" /> Voir le certificat spécimen</button>
                        : <button onClick={onExit} className="inline-flex items-center gap-2 rounded-xl bg-violet-700 text-white px-5 py-3 font-extrabold text-sm">Continuer le parcours <ArrowRight className="w-4 h-4" /></button>)}
                      <button onClick={onExit} className="rounded-xl border-2 border-brand-blue text-brand-blue dark:border-sky-300 dark:text-sky-300 px-5 py-2.5 font-extrabold text-sm">Retour au parcours</button>
                      <button onClick={onRestart} className="inline-flex items-center gap-2 rounded-xl bg-brand-emerald text-white px-5 py-3 font-extrabold text-sm"><RotateCcw className="w-4 h-4" /> Recommencer {stepWord(step)}</button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </article>
    </div>
  );
}

function nextTitle(course: Course, step: CourseStep) {
  const i = course.steps.findIndex((s) => s.id === step.id);
  const next = course.steps[i + 1];
  return next ? `« ${next.title} » est maintenant débloqué.` : '';
}
