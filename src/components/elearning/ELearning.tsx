import { lazy, Suspense, useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Award, BadgeCheck, BookOpen, CheckCircle2, ChevronDown, Download, GraduationCap, Loader2, Lock, LogOut, Play, Search, ShieldCheck, UserRound } from 'lucide-react';
import { COMING_SOON, COURSES, PASS, courseHours, courseStats, isExam, stepQuestionCount, type Course, type CourseStep } from '../../data/elearning';
import {
  CERTIFICATE_RE, EMPTY_PROGRESS, getElearningApi, learnerErrorMessage,
  type Certificate, type Draft, type ElearningApi, type LearnerProfile, type LearnerSession, type Progress
} from '../../lib/elearningApi';
import { LoginForm, SignupForm } from './ElearningForms';

const ElearningPlayer = lazy(() => import('./ElearningPlayer'));

/**
 * E-learning tab (/e-learning): free online certifications built on the CICEXF themes.
 * Views are kept in the URL hash: #inscription, #connexion, #espace, #parcours, #etape/<id>, #certificat, #verifier/<n°>.
 */

const primary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-brand-emerald hover:bg-brand-emerald-dark disabled:opacity-50 text-white px-5 py-3 font-extrabold text-sm transition-colors';
const ghost = 'inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-blue text-brand-blue dark:border-sky-300 dark:text-sky-300 px-4 py-2.5 font-extrabold text-sm hover:bg-brand-blue hover:text-white transition-colors';
const card = 'rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm';

const readHash = () => decodeURIComponent(window.location.hash.replace(/^#/, ''));

export default function ELearning() {
  const [route, setRoute] = useState(readHash);
  const [api, setApi] = useState<ElearningApi | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [session, setSession] = useState<LearnerSession | null | undefined>(undefined);
  const [profile, setProfile] = useState<LearnerProfile | null | undefined>(undefined);
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const go = useCallback((h: string) => {
    if (readHash() === h) setRoute(h);
    else window.location.hash = h;
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [route]);

  useEffect(() => {
    let unsub = () => {};
    Promise.all([getElearningApi(), COURSES[0].load()])
      .then(([a, c]) => {
        setApi(a);
        setCourse(c);
        unsub = a.onSession(setSession);
      })
      .catch(() => setLoadError("L'e-learning n'a pas pu se charger. Vérifiez votre connexion puis rechargez la page."));
    return () => unsub();
  }, []);

  // Profile and progress of the signed-in learner
  const request = useRef(0);
  const refresh = useCallback(async () => {
    if (!api || !course) return;
    const id = ++request.current;
    if (!session) { setProfile(null); setProgress(EMPTY_PROGRESS); setDraft(null); return; }
    try {
      const [p, pr, d] = await Promise.all([api.getProfile(), api.getProgress(course.id), api.getDraft(course.id)]);
      if (id !== request.current) return; // a newer request has been made since
      setProfile(p);
      setProgress(pr);
      setDraft(d);
    } catch (e) {
      setLoadError(learnerErrorMessage(e));
    }
  }, [api, course, session]);
  useEffect(() => { setProfile(undefined); refresh(); }, [refresh]);

  if (loadError) return <Shell><p className="text-center font-bold text-brand-emerald py-16">{loadError}</p></Shell>;
  if (!api || !course || session === undefined || (session && profile === undefined)) {
    return <Shell><p className="flex justify-center items-center gap-2 py-24 text-slate-500"><Loader2 className="w-5 h-5 animate-spin" /> Chargement de l'e-learning…</p></Shell>;
  }

  const passed = (id: string) => (progress.scores[id] || 0) >= PASS;
  const isOpen = (i: number) => course.steps.slice(0, i).every((s) => passed(s.id));
  const signedIn = !!session && !!profile;

  // Verification is public
  if (route === 'verifier' || route.startsWith('verifier/')) {
    return <Shell simulated={api.simulated}><VerifyView api={api} initial={route.slice(9)} onBack={() => go('')} /></Shell>;
  }

  // Signed in without a profile (rare: interrupted sign-up): complete it first
  if (session && !profile) {
    return (
      <Shell simulated={api.simulated}>
        <SignupForm api={api} completeFor={session.email} onDone={async () => { await refresh(); go('espace'); }} onLogin={() => {}} />
        <p className="mt-4 text-center"><button className="text-sm underline text-slate-600" onClick={() => api.signOut()}>Me déconnecter</button></p>
      </Shell>
    );
  }

  if (route === 'inscription' && !signedIn) {
    return <Shell simulated={api.simulated}><SignupForm api={api} onDone={() => go('espace')} onLogin={() => go('connexion')} /></Shell>;
  }
  if (route === 'connexion' && !signedIn) {
    return <Shell simulated={api.simulated}><LoginForm api={api} onDone={() => go('espace')} onSignup={() => go('inscription')} /></Shell>;
  }

  const needAccount = ['espace', 'parcours', 'certificat', 'profil'].includes(route) || route.startsWith('etape/');
  if (needAccount && !signedIn) {
    return <Shell simulated={api.simulated}><LoginForm api={api} onDone={() => go(route)} onSignup={() => go('inscription')} /></Shell>;
  }

  if (signedIn && route === 'profil') {
    return <Shell simulated={api.simulated}><SignupForm api={api} initial={profile} onDone={async () => { await refresh(); go('espace'); }} onLogin={() => {}} /></Shell>;
  }

  if (signedIn && route.startsWith('etape/')) {
    const i = course.steps.findIndex((s) => s.id === route.slice(6));
    if (i < 0 || !isOpen(i)) {
      return <Shell simulated={api.simulated}><PathView course={course} profile={profile!} progress={progress} draft={draft} go={go} api={api} notice="Cette étape n'est pas encore débloquée : validez d'abord les étapes précédentes." /></Shell>;
    }
    return (
      <Suspense fallback={<p className="flex justify-center py-24"><Loader2 className="w-5 h-5 animate-spin" /></p>}>
        <ElearningPlayer
          key={`${course.steps[i].id}-${attempt}`}
          api={api}
          course={course}
          step={course.steps[i]}
          resume={draft}
          onProgress={(p) => { setProgress(p); setDraft(null); }}
          onExit={async () => { setDraft(await api.getDraft(course.id)); go('parcours'); }}
          onCertificate={() => go('certificat')}
          onRestart={async () => { await api.clearDraft(course.id); setDraft(null); setAttempt((n) => n + 1); }}
        />
      </Suspense>
    );
  }

  if (signedIn && route === 'certificat') {
    if (!passed('FINAL')) return <Shell simulated={api.simulated}><PathView course={course} profile={profile!} progress={progress} draft={draft} go={go} api={api} notice="Le certificat se débloque après la réussite de l'examen final." /></Shell>;
    return <Shell simulated={api.simulated}><CertificateView api={api} course={course} profile={profile!} progress={progress} onProgress={setProgress} go={go} /></Shell>;
  }

  if (signedIn && route === 'espace') {
    return (
      <Shell simulated={api.simulated}>
        <EspaceView api={api} courses={[course]} progressOf={() => progress} draftOf={() => draft} profile={profile!} go={go}
          onCertificate={(_, number) => setProgress((p) => ({ ...p, certificate: number }))} />
      </Shell>
    );
  }

  if (signedIn && route === 'parcours') {
    return <Shell simulated={api.simulated}><PathView course={course} profile={profile!} progress={progress} draft={draft} go={go} api={api} /></Shell>;
  }

  return <Shell simulated={api.simulated}><HomeView course={course} signedIn={signedIn} go={go} /></Shell>;
}

function Shell({ children, simulated }: { children: ReactNode; simulated?: boolean }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {simulated && (
        <p className="mb-5 rounded-xl bg-amber-100 text-amber-900 text-center text-xs font-bold px-3 py-2">
          Mode test local : comptes, notes et certificats sont simulés dans ce navigateur (rien n'est enregistré en ligne).
        </p>
      )}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
function HomeView({ course, signedIn, go }: { course: Course; signedIn: boolean; go: (h: string) => void }) {
  const st = courseStats(course);
  const start = () => go(signedIn ? 'espace' : 'inscription');
  return (
    <>
      <section className="relative overflow-hidden rounded-3xl p-7 sm:p-10 text-white bg-gradient-to-r from-[#001B38] via-brand-blue to-brand-blue-light">
        <div aria-hidden className="absolute -right-20 -top-20 w-80 h-80 rounded-full border-2 border-white/20 shadow-[0_0_0_30px_rgba(79,179,255,.08),0_0_0_60px_rgba(255,255,255,.05)]" />
        <p className="relative text-xs font-extrabold tracking-[.18em] uppercase text-amber-300">E-learning CICEXF · 100 % gratuit</p>
        <h1 className="relative mt-2 text-3xl sm:text-4xl font-extrabold text-white max-w-2xl leading-tight">Apprenez à votre rythme et obtenez une certification gratuite</h1>
        <p className="relative mt-3 max-w-2xl text-sky-100">
          Des parcours en ligne construits sur les thématiques du cabinet. Créez votre compte, étudiez chaque module, répondez aux quiz et
          validez chaque chapitre avec {PASS} % au moins pour obtenir votre certificat.
        </p>
        <div className="relative mt-6 flex flex-wrap gap-3">
          <button onClick={start} className={primary}><GraduationCap className="w-4 h-4" />{signedIn ? 'Mon espace de formation' : 'Créer mon compte gratuit'}</button>
          {!signedIn && <button onClick={() => go('connexion')} className="inline-flex items-center gap-2 rounded-xl border-2 border-white/70 px-5 py-2.5 font-extrabold text-sm text-white hover:bg-white hover:text-brand-blue transition-colors">J'ai déjà un compte</button>}
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
        {[
          ['Créez votre compte', 'Gratuit, quelques informations suffisent.'],
          ['Étudiez les modules', 'Chaque chapitre est découpé en modules.'],
          ['Répondez aux quiz', 'Le texte se ferme pendant les questions.'],
          ['Validez et certifiez-vous', `${PASS} % par chapitre, certificat en PDF.`]
        ].map(([t, d], i) => (
          <div key={t} className={`${card} p-4 border-t-4 border-t-brand-blue-light`}>
            <b className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-brand-blue text-white text-sm">{i + 1}</b>
            <strong className="block mt-2 mb-1 text-slate-900 dark:text-white">{t}</strong>
            <span className="text-sm text-slate-600 dark:text-slate-400">{d}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-xl font-extrabold text-slate-900 dark:text-white">Certifications disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={`${card} p-5 flex flex-col border-2 border-brand-emerald`}>
          <span className="self-start text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-sky-50 text-brand-blue dark:bg-sky-950 dark:text-sky-300">{course.domain}</span>
          <h3 className="mt-3 mb-1.5 text-lg font-extrabold text-slate-900 dark:text-white">{course.title}</h3>
          <p className="flex-1 text-sm text-slate-600 dark:text-slate-400">{course.summary}</p>
          <p className="mt-3 mb-4 text-xs text-slate-500 dark:text-slate-400">
            {st.parts} parties · {st.chapters} chapitres · {st.modules} modules · {st.quizzes} quiz · {st.exams} examens · {courseHours(course)} h environ
          </p>
          <button onClick={start} className={primary}><Play className="w-4 h-4" />{signedIn ? 'Continuer' : 'Commencer gratuitement'}</button>
        </div>
        {COMING_SOON.map((t) => (
          <div key={t} className={`${card} p-5 flex flex-col`}>
            <span className="self-start text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Bientôt</span>
            <h3 className="mt-3 mb-1.5 text-lg font-extrabold text-slate-900 dark:text-white">{t}</h3>
            <p className="flex-1 text-sm text-slate-600 dark:text-slate-400">Parcours en préparation, sur le même modèle.</p>
            <button disabled className="mt-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-400 px-4 py-2.5 font-extrabold text-sm cursor-not-allowed">Bientôt disponible</button>
          </div>
        ))}
      </div>

      <div className={`${card} mt-8 p-5 flex flex-wrap items-center gap-4`}>
        <ShieldCheck className="w-8 h-8 text-brand-blue dark:text-sky-300 shrink-0" />
        <div className="flex-1 min-w-[220px]">
          <strong className="text-slate-900 dark:text-white">Vérifier un certificat</strong>
          <p className="text-sm text-slate-600 dark:text-slate-400">Employeurs et partenaires : contrôlez l'authenticité d'un certificat e-learning CICEXF à partir de son numéro.</p>
        </div>
        <button onClick={() => go('verifier')} className={ghost}><Search className="w-4 h-4" />Vérifier un numéro</button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Account card: details closed by default, opened with the "Mes informations" button
// ---------------------------------------------------------------------------
function AccountCard({ api, profile, go, compact }: { api: ElearningApi; profile: LearnerProfile; go: (h: string) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={compact ? '' : `${card} p-5`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center shrink-0"><UserRound className="w-6 h-6" /></span>
        <h3 className="flex-1 min-w-[140px] text-lg font-extrabold text-slate-900 dark:text-white">{profile.prenom} {profile.nom.toLocaleUpperCase('fr-FR')}</h3>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 px-3.5 py-2 text-sm font-extrabold text-brand-blue dark:text-sky-300 hover:border-brand-blue">
          Mes informations <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-slate-500">E-mail</dt><dd className="font-bold break-all text-slate-800 dark:text-slate-200">{profile.email}</dd>
            <dt className="text-slate-500">Téléphone</dt><dd className="font-bold text-slate-800 dark:text-slate-200">{profile.telephone}</dd>
            <dt className="text-slate-500">Pays</dt><dd className="font-bold text-slate-800 dark:text-slate-200">{profile.pays}</dd>
            <dt className="text-slate-500">Activité</dt><dd className="font-bold text-slate-800 dark:text-slate-200">{profile.activite}</dd>
            <dt className="text-slate-500">Formation</dt><dd className="font-bold text-slate-800 dark:text-slate-200">{profile.formation}</dd>
            <dt className="text-slate-500">Expérience</dt><dd className="font-bold text-slate-800 dark:text-slate-200">{profile.experience}</dd>
          </dl>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <button onClick={() => go('profil')} className="font-bold text-brand-blue dark:text-sky-300 underline">Modifier mes informations</button>
            <button onClick={() => { api.signOut(); go(''); }} className="inline-flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300 underline"><LogOut className="w-3.5 h-3.5" />Déconnexion</button>
          </div>
        </div>
      )}
    </div>
  );
}

const draftWhere = (course: Course, d: Draft) => {
  const step = course.steps.find((s) => s.id === d.stepId);
  if (!step) return '';
  const answered = (Object.values(d.answers) as number[][][]).reduce<number>((n, m) => n + m.reduce<number>((a, arr) => a + (arr ? arr.filter((v) => v !== undefined && v !== null).length : 0), 0), 0);
  const mod = isExam(step) ? '' : ` · module ${d.mi + 1}/${step.modules.length}`;
  return `${step.title.split(' : ')[0]}${mod} · ${answered} question${answered > 1 ? 's' : ''} répondue${answered > 1 ? 's' : ''}`;
};

// ---------------------------------------------------------------------------
// Personal training space: courses in progress, completed courses and certificates
// ---------------------------------------------------------------------------
function EspaceView({ api, courses, progressOf, draftOf, profile, go, onCertificate }: {
  api: ElearningApi; courses: Course[]; progressOf: (id: string) => Progress; draftOf: (id: string) => Draft | null;
  profile: LearnerProfile; go: (h: string) => void; onCertificate: (courseId: string, number: string) => void;
}) {
  const [certs, setCerts] = useState<Record<string, Certificate | null>>({});
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const rows = courses.map((c) => {
    const p = progressOf(c.id), d = draftOf(c.id);
    const done = c.steps.filter((s) => (p.scores[s.id] || 0) >= PASS).length;
    const finished = (p.scores.FINAL || 0) >= PASS;
    const started = done > 0 || Object.keys(p.scores).length > 0 || !!d;
    const current = c.steps.find((s) => (p.scores[s.id] || 0) < PASS);
    return { c, p, d, done, finished, started, current, pct: Math.round((done / c.steps.length) * 100) };
  });
  const inProgress = rows.filter((r) => r.started && !r.finished);
  const finished = rows.filter((r) => r.finished);
  const available = rows.filter((r) => !r.started);

  // Certificates already issued, read from the account
  const numbers = finished.map((r) => r.p.certificate).filter(Boolean).join(',');
  useEffect(() => {
    finished.forEach((r) => {
      if (r.p.certificate && certs[r.c.id] === undefined) {
        api.verifyCertificate(r.p.certificate).then((c) => setCerts((m) => ({ ...m, [r.c.id]: c }))).catch(() => {});
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numbers]);

  const download = async (courseId: string) => {
    setBusy(courseId); setError('');
    try {
      const cert = certs[courseId] || await api.issueCertificate(courseId);
      setCerts((m) => ({ ...m, [courseId]: cert }));
      onCertificate(courseId, cert.number);
      const { downloadCertificate } = await import('../../lib/certificatePdf');
      await downloadCertificate(cert);
    } catch (e) {
      setError(learnerErrorMessage(e));
    } finally {
      setBusy('');
    }
  };
  const fmt = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
  const heading = 'flex items-center gap-2 mt-8 mb-3 text-xl font-extrabold text-slate-900 dark:text-white';

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white bg-gradient-to-r from-[#001B38] via-brand-blue to-brand-blue-light">
        <p className="text-xs font-extrabold tracking-[.18em] uppercase text-amber-300">Mon espace de formation</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">Bonjour {profile.prenom} !</h1>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-white/15 px-3.5 py-1.5 font-bold">{inProgress.length} formation{inProgress.length > 1 ? 's' : ''} en cours</span>
          <span className="rounded-full bg-white/15 px-3.5 py-1.5 font-bold">{finished.length} terminée{finished.length > 1 ? 's' : ''}</span>
          <span className="rounded-full bg-white/15 px-3.5 py-1.5 font-bold">{finished.filter((r) => r.p.certificate).length} certificat{finished.filter((r) => r.p.certificate).length > 1 ? 's' : ''}</span>
        </div>
      </section>

      <div className="mt-5"><AccountCard api={api} profile={profile} go={go} /></div>

      <h2 className={heading}><Play className="w-5 h-5 text-brand-emerald" />Mes formations en cours</h2>
      {!inProgress.length && <p className={`${card} p-5 text-slate-600 dark:text-slate-400`}>Aucune formation en cours. Choisissez une formation ci-dessous pour commencer.</p>}
      <div className="grid gap-4">
        {inProgress.map(({ c, d, done, pct, current }) => (
          <div key={c.id} className={`${card} p-5 sm:p-6`}>
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300">{c.domain}</span>
            <h3 className="mt-1 text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{c.title}</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"><i className="block h-full bg-gradient-to-r from-brand-blue to-amber-400" style={{ width: `${pct}%` }} /></div>
              <strong className="text-brand-blue dark:text-sky-300">{pct} %</strong>
            </div>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{done} étape{done > 1 ? 's' : ''} validée{done > 1 ? 's' : ''} sur {c.steps.length}{current ? ` · prochaine étape : ${current.title}` : ''}</p>
            {d && <p className="mt-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 px-3 py-2 text-sm text-slate-800 dark:text-slate-200"><strong>Reprise enregistrée :</strong> {draftWhere(c, d)}</p>}
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => go(d ? `etape/${d.stepId}` : current ? `etape/${current.id}` : 'parcours')} className={primary}><Play className="w-4 h-4" />{d ? 'Reprendre là où je me suis arrêté' : 'Continuer'}</button>
              <button onClick={() => go('parcours')} className={ghost}>Voir le parcours</button>
            </div>
          </div>
        ))}
      </div>

      <h2 className={heading}><Award className="w-5 h-5 text-amber-500" />Mes formations terminées et mes certificats</h2>
      {error && <p className="mb-3 font-bold text-brand-emerald">{error}</p>}
      {!finished.length && <p className={`${card} p-5 text-slate-600 dark:text-slate-400`}>Vos certificats apparaîtront ici dès que vous aurez réussi l'examen final d'une formation.</p>}
      <div className="grid gap-4">
        {finished.map(({ c, p }) => {
          const cert = certs[c.id];
          return (
            <div key={c.id} className={`${card} p-5 sm:p-6 border-l-4 border-l-emerald-600`}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1 min-w-[220px]">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wider uppercase text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" />Terminée{p.finishedAt ? ` le ${fmt(p.finishedAt)}` : ''}</span>
                  <h3 className="mt-1 text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{c.certTitle}</h3>
                </div>
                <Award className="w-10 h-10 text-amber-500 shrink-0" />
              </div>
              <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><dt className="text-slate-500">N° du certificat</dt><dd className="font-extrabold text-slate-900 dark:text-white">{p.certificate || 'À obtenir'}</dd></div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><dt className="text-slate-500">Résultat moyen</dt><dd className="font-extrabold text-slate-900 dark:text-white">{cert ? `${cert.average} %` : '…'}</dd></div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><dt className="text-slate-500">Délivré le</dt><dd className="font-extrabold text-slate-900 dark:text-white">{cert ? fmt(cert.issuedAt) : p.certificate ? '…' : '—'}</dd></div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => download(c.id)} disabled={busy === c.id} className={primary}>
                  {busy === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}{p.certificate ? 'Télécharger mon certificat (PDF)' : 'Obtenir mon certificat'}
                </button>
                {p.certificate && <button onClick={() => go(`verifier/${p.certificate}`)} className={ghost}><ShieldCheck className="w-4 h-4" />Vérifier</button>}
                <button onClick={() => go('parcours')} className={ghost}>Revoir le parcours</button>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className={heading}><BookOpen className="w-5 h-5 text-brand-blue dark:text-sky-300" />Formations disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {available.map(({ c }) => (
          <div key={c.id} className={`${card} p-5 flex flex-col border-2 border-brand-emerald`}>
            <span className="self-start text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-sky-50 text-brand-blue dark:bg-sky-950 dark:text-sky-300">{c.domain}</span>
            <h3 className="mt-3 mb-1.5 text-lg font-extrabold text-slate-900 dark:text-white">{c.title}</h3>
            <p className="flex-1 text-sm text-slate-600 dark:text-slate-400">{c.summary}</p>
            <button onClick={() => go('parcours')} className={`${primary} mt-4`}><Play className="w-4 h-4" />Commencer</button>
          </div>
        ))}
        {COMING_SOON.map((t) => (
          <div key={t} className={`${card} p-5 flex flex-col`}>
            <span className="self-start text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Bientôt</span>
            <h3 className="mt-3 text-lg font-extrabold text-slate-900 dark:text-white">{t}</h3>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Learner path
// ---------------------------------------------------------------------------
function PathView({ api, course, profile, progress, draft, go, notice }: {
  api: ElearningApi; course: Course; profile: LearnerProfile; progress: Progress; draft: Draft | null; go: (h: string) => void; notice?: string;
}) {
  const passed = (id: string) => (progress.scores[id] || 0) >= PASS;
  const isOpen = (i: number) => course.steps.slice(0, i).every((s) => passed(s.id));
  const done = course.steps.filter((s) => passed(s.id)).length;
  const pct = Math.round((done / course.steps.length) * 100);
  const big = 'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-extrabold text-base transition-colors';

  const block = (s: CourseStep, i: number) => {
    const open = isOpen(i), ok = passed(s.id), sc = progress.scores[s.id];
    const resuming = open && draft?.stepId === s.id;
    const sub = isExam(s)
      ? `${stepQuestionCount(course, s)} questions · ${PASS} % requis`
      : `${s.modules.length} modules · ${s.modules.reduce((n, m) => n + course.modules[m.id].quizzes.length, 0)} quiz · ${PASS} % requis`;
    return (
      <div key={s.id} className="px-5 sm:px-7 py-5 sm:py-6 border-t border-slate-200 dark:border-slate-800">
        <div className={`flex flex-wrap items-center gap-4 ${open ? 'cursor-pointer' : ''}`} onClick={open ? () => go(`etape/${s.id}`) : undefined}>
          <span className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-extrabold ${ok ? 'bg-emerald-100 text-emerald-700' : open ? 'bg-brand-emerald text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
            {ok ? <CheckCircle2 className="w-6 h-6" /> : open ? <Play className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </span>
          <div className="flex-1 min-w-[200px]">
            <strong className={`block text-xl sm:text-2xl leading-snug ${open ? 'text-brand-blue dark:text-sky-300' : 'text-slate-400'}`}>{s.title}</strong>
            <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400">{sub}</span>
            {resuming && <span className="block mt-1 text-sm font-bold text-brand-emerald">En cours : {draftWhere(course, draft!)}</span>}
          </div>
          {sc !== undefined && <span className={`text-lg font-extrabold ${ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-brand-emerald'}`}>{sc} %</span>}
          {open && (
            <button onClick={(e) => { e.stopPropagation(); go(`etape/${s.id}`); }}
              className={`${big} ${ok && !resuming ? 'border-2 border-brand-blue text-brand-blue dark:border-sky-300 dark:text-sky-300 hover:bg-brand-blue hover:text-white' : 'bg-brand-emerald hover:bg-brand-emerald-dark text-white'}`}>
              {resuming ? 'Reprendre' : ok ? 'Revoir' : sc !== undefined ? 'Recommencer' : 'Commencer'}
            </button>
          )}
        </div>
        {!isExam(s) && (
          <ul className={`mt-3 ml-16 space-y-1.5 text-base sm:text-lg ${open ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
            {s.modules.map((m) => <li key={m.id}><span className="text-amber-500">▸ </span>{m.title} · {m.minutes} min</li>)}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
      <aside className={`${card} p-6 lg:sticky lg:top-28`}>
        <AccountCard api={api} profile={profile} go={go} compact />
        <button onClick={() => go('espace')} className={`${ghost} w-full mt-5`}><GraduationCap className="w-4 h-4" />Mon espace de formation</button>
        <p className="mt-5 font-extrabold text-slate-900 dark:text-white">{course.title}</p>
        <div className="mt-2 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"><i className="block h-full bg-gradient-to-r from-brand-blue to-amber-400" style={{ width: `${pct}%` }} /></div>
        <span className="text-sm text-slate-500">{done} étape(s) validée(s) sur {course.steps.length}</span>
        <div className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
          <strong>Comment ça marche :</strong> dans chaque chapitre, lisez le texte du module puis répondez à ses quiz. Le texte se ferme pendant les
          questions et aucune correction n'apparaît en cours de route. À la fin du chapitre, il faut <strong>{PASS} % au moins</strong> pour débloquer le chapitre suivant.
          Votre progression est enregistrée : vous pouvez quitter et reprendre à tout moment.
        </div>
        {passed('FINAL') && <button onClick={() => go('certificat')} className={`${primary} w-full mt-4`}><Award className="w-4 h-4" />Mon certificat</button>}
      </aside>

      <section>
        {notice && <p className="mb-4 rounded-2xl bg-amber-50 border-l-4 border-amber-400 px-4 py-3 text-sm font-bold text-slate-800">{notice}</p>}
        {course.parts.map((p) => (
          <div key={p.id} className={`${card} mb-5 overflow-hidden`}>
            <h3 className="px-5 sm:px-7 py-4 text-lg sm:text-xl text-white font-extrabold bg-gradient-to-r from-brand-blue to-brand-blue-light">{p.title}</h3>
            {course.steps.map((s, i) => (s.part === p.id ? block(s, i) : null))}
          </div>
        ))}
        <div className={`${card} overflow-hidden`}>
          <h3 className="px-5 sm:px-7 py-4 text-lg sm:text-xl text-white font-extrabold bg-gradient-to-r from-brand-emerald to-brand-emerald-light">Certification</h3>
          {block(course.steps[course.steps.length - 1], course.steps.length - 1)}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Certificate
// ---------------------------------------------------------------------------
function CertificateView({ api, course, profile, progress, onProgress, go }: {
  api: ElearningApi; course: Course; profile: LearnerProfile; progress: Progress; onProgress: (p: Progress) => void; go: (h: string) => void;
}) {
  const [cert, setCert] = useState<Certificate | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.issueCertificate(course.id)
      .then((c) => {
        if (cancelled) return;
        setCert(c);
        if (progress.certificate !== c.number) onProgress({ ...progress, certificate: c.number });
      })
      .catch((e) => !cancelled && setError(learnerErrorMessage(e)));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, course.id]);

  const download = async () => {
    if (!cert) return;
    setBusy(true);
    try {
      const { downloadCertificate } = await import('../../lib/certificatePdf');
      await downloadCertificate(cert);
    } catch {
      setError('Le PDF n\'a pas pu être créé. Réessayez.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className={`${card} p-7 text-center`}>
        <Award className="w-12 h-12 mx-auto text-amber-500" />
        <h2 className="mt-2 text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">Félicitations, {profile.prenom} !</h2>
        {!cert && !error && <p className="mt-4 inline-flex items-center gap-2 text-slate-500"><Loader2 className="w-4 h-4 animate-spin" />Préparation de votre certificat…</p>}
        {error && <p className="mt-4 font-bold text-brand-emerald">{error}</p>}
        {cert && (
          <>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Vous avez validé toutes les étapes avec une moyenne de {cert.average} %. Votre certificat est prêt.</p>
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-sm">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><dt className="text-slate-500">Titulaire</dt><dd className="font-extrabold text-slate-900 dark:text-white">{`${cert.lastName} ${cert.firstName}`.toLocaleUpperCase('fr-FR')}</dd></div>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><dt className="text-slate-500">Numéro</dt><dd className="font-extrabold text-slate-900 dark:text-white">{cert.number}</dd></div>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 sm:col-span-2"><dt className="text-slate-500">Certification</dt><dd className="font-extrabold text-slate-900 dark:text-white">{cert.courseTitle}</dd></div>
            </dl>
            <button onClick={download} disabled={busy} className={`${primary} mt-6`}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}Télécharger mon certificat (PDF)
            </button>
            <p className="mt-4 text-xs text-slate-500">
              Toute personne peut vérifier ce certificat sur www.cicexf.com/e-learning, rubrique « Vérifier un certificat », avec le numéro {cert.number}.
            </p>
          </>
        )}
      </div>
      <p className="mt-4 text-center"><button onClick={() => go('parcours')} className="text-sm font-bold underline text-slate-600 dark:text-slate-300">Retour au parcours</button></p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public verification
// ---------------------------------------------------------------------------
function VerifyView({ api, initial, onBack }: { api: ElearningApi; initial: string; onBack: () => void }) {
  const [number, setNumber] = useState(initial);
  const [state, setState] = useState<{ status: 'idle' | 'busy' | 'found' | 'missing' | 'error'; cert?: Certificate }>({ status: 'idle' });

  const check = useCallback(async (n: string) => {
    const clean = n.trim().toUpperCase();
    if (!CERTIFICATE_RE.test(clean)) return setState({ status: 'missing' });
    setState({ status: 'busy' });
    try {
      const cert = await api.verifyCertificate(clean);
      setState(cert ? { status: 'found', cert } : { status: 'missing' });
    } catch {
      setState({ status: 'error' });
    }
  }, [api]);
  useEffect(() => { if (initial) check(initial); }, [initial, check]);

  const submit = (e: FormEvent) => { e.preventDefault(); check(number); };
  const date = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className={`${card} max-w-2xl mx-auto p-6 sm:p-8`}>
      <div className="flex items-center gap-3">
        <BadgeCheck className="w-8 h-8 text-brand-blue dark:text-sky-300" />
        <h2 className="text-2xl font-extrabold text-brand-blue dark:text-sky-300">Vérifier un certificat</h2>
      </div>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Saisissez le numéro inscrit en bas à gauche du certificat, par exemple CICEXF-EL-2026-000001.</p>
      <form onSubmit={submit} className="mt-5 flex flex-col sm:flex-row gap-3">
        <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="CICEXF-EL-2026-000001" aria-label="Numéro du certificat"
          className="flex-1 rounded-xl border-[1.5px] border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 uppercase tracking-wide text-slate-900 dark:text-white" />
        <button type="submit" disabled={state.status === 'busy'} className={primary}>{state.status === 'busy' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}Vérifier</button>
      </form>
      {state.status === 'found' && state.cert && (
        <div className="mt-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-600 p-5">
          <p className="inline-flex items-center gap-2 font-extrabold text-emerald-800 dark:text-emerald-300"><CheckCircle2 className="w-5 h-5" />Certificat authentique</p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm text-slate-800 dark:text-slate-200">
            <dt className="text-slate-500">Titulaire</dt><dd className="font-bold">{`${state.cert.lastName} ${state.cert.firstName}`.toLocaleUpperCase('fr-FR')}</dd>
            <dt className="text-slate-500">Certification</dt><dd className="font-bold">{state.cert.courseTitle}</dd>
            <dt className="text-slate-500">Formation suivie</dt><dd>du {date(state.cert.startedAt)} au {date(state.cert.finishedAt)}</dd>
            <dt className="text-slate-500">Délivré le</dt><dd>{date(state.cert.issuedAt)}</dd>
            <dt className="text-slate-500">Numéro</dt><dd className="font-bold">{state.cert.number}</dd>
          </dl>
        </div>
      )}
      {state.status === 'missing' && <p className="mt-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border-l-4 border-brand-emerald p-4 font-bold text-brand-emerald">Aucun certificat ne correspond à ce numéro. Vérifiez la saisie.</p>}
      {state.status === 'error' && <p className="mt-6 font-bold text-brand-emerald">Vérification impossible pour le moment. Réessayez.</p>}
      <p className="mt-6"><button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-bold underline text-slate-600 dark:text-slate-300"><BookOpen className="w-4 h-4" />Découvrir l'e-learning CICEXF</button></p>
    </div>
  );
}
