import { lazy, Suspense, useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Award, BadgeCheck, BookOpen, CheckCircle2, ChevronDown, ClipboardCheck, Clock, Download, GraduationCap, Loader2, Lock, LogOut, Play, Search, ShieldCheck, UserRound } from 'lucide-react';
import { CATALOG, COMING_SOON, PASS, isExam, loadCourse, stepQuestionCount, type Course, type CourseMeta, type CourseStep } from '../../data/elearning';
import {
  CERTIFICATE_RE, EMPTY_PROGRESS, getElearningApi, learnerErrorMessage, stepCleared,
  type Certificate, type Draft, type ElearningApi, type Enrollment, type LearnerProfile, type LearnerSession, type Progress
} from '../../lib/elearningApi';
import { LoginForm, SignupForm } from './ElearningForms';

const ElearningPlayer = lazy(() => import('./ElearningPlayer'));

/**
 * E-learning tab (/e-learning): free online certifications built on the CICEXF themes.
 * Views are kept in the URL hash: #inscription (account), #connexion, #espace, #certifications,
 * #inscrire/<course>, #parcours/<course>, #etape/<course>/<step>, #certificat/<course>, #verifier/<n°>.
 */

const primary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-brand-emerald hover:bg-brand-emerald-dark disabled:opacity-50 text-white px-5 py-3 font-extrabold text-sm transition-colors';
const ghost = 'inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-blue text-brand-blue dark:border-sky-300 dark:text-sky-300 px-4 py-2.5 font-extrabold text-sm hover:bg-brand-blue hover:text-white transition-colors';
const card = 'rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm';

const readHash = () => decodeURIComponent(window.location.hash.replace(/^#/, ''));
const metaOf = (id: string) => CATALOG.find((c) => c.id === id);
const DEFAULT_COURSE = CATALOG[0]?.id || '';

/** Reads the course (and step) of a route; old links without a course open the first course */
function parseRoute(route: string): { view: string; courseId?: string; stepId?: string } {
  const [view, a, b] = route.split('/');
  if (view === 'etape') return b ? { view, courseId: a, stepId: b } : { view, courseId: DEFAULT_COURSE, stepId: a };
  if (view === 'parcours' || view === 'certificat' || view === 'inscrire') return { view, courseId: a || DEFAULT_COURSE };
  return { view: route.startsWith('verifier') ? 'verifier' : view };
}

export default function ELearning() {
  const [route, setRoute] = useState(readHash);
  const [api, setApi] = useState<ElearningApi | null>(null);
  const [session, setSession] = useState<LearnerSession | null | undefined>(undefined);
  const [profile, setProfile] = useState<LearnerProfile | null | undefined>(undefined);
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({});
  const [draftMap, setDraftMap] = useState<Record<string, Draft | null>>({});
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>({});
  const [courses, setCourses] = useState<Record<string, Course>>({});
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
    getElearningApi()
      .then((a) => { setApi(a); unsub = a.onSession(setSession); })
      .catch(() => setLoadError("L'e-learning n'a pas pu se charger. Vérifiez votre connexion puis rechargez la page."));
    return () => unsub();
  }, []);

  // The full course is downloaded when the learner opens it
  const { view, courseId, stepId } = parseRoute(route);
  useEffect(() => {
    if (!courseId || courses[courseId] || !metaOf(courseId)) return;
    loadCourse(courseId)
      .then((c) => setCourses((m) => ({ ...m, [c.id]: c })))
      .catch(() => setLoadError("Ce parcours n'a pas pu se charger. Vérifiez votre connexion puis rechargez la page."));
  }, [courseId, courses]);

  // Profile, registrations and progress of the signed-in learner (every course)
  const request = useRef(0);
  const refresh = useCallback(async () => {
    if (!api) return;
    const id = ++request.current;
    if (!session) { setProfile(null); setProgressMap({}); setDraftMap({}); setEnrollments({}); return; }
    try {
      const ids = CATALOG.map((c) => c.id);
      const [p, en, progresses, drafts] = await Promise.all([
        api.getProfile(),
        api.getEnrollments(),
        Promise.all(ids.map((c) => api.getProgress(c))),
        Promise.all(ids.map((c) => api.getDraft(c)))
      ]);
      if (id !== request.current) return; // a newer request has been made since
      setProfile(p);
      setEnrollments(en);
      setProgressMap(Object.fromEntries(ids.map((c, i) => [c, progresses[i]])));
      setDraftMap(Object.fromEntries(ids.map((c, i) => [c, drafts[i]])));
    } catch (e) {
      setLoadError(learnerErrorMessage(e));
    }
  }, [api, session]);
  useEffect(() => { setProfile(undefined); refresh(); }, [refresh]);

  if (loadError) return <Shell><p className="text-center font-bold text-brand-emerald py-16">{loadError}</p></Shell>;
  if (!api || session === undefined || (session && profile === undefined)) {
    return <Shell><p className="flex justify-center items-center gap-2 py-24 text-slate-500"><Loader2 className="w-5 h-5 animate-spin" /> Chargement de l'e-learning…</p></Shell>;
  }

  const progressOf = (id: string) => progressMap[id] || EMPTY_PROGRESS;
  const draftOf = (id: string) => draftMap[id] || null;
  const setProgressFor = (id: string, p: Progress) => setProgressMap((m) => ({ ...m, [id]: p }));
  const setDraftFor = (id: string, d: Draft | null) => setDraftMap((m) => ({ ...m, [id]: d }));
  const signedIn = !!session && !!profile;
  // Registered: confirmed registration (or a course already started before registrations existed)
  const isEnrolled = (id: string) => !!enrollments[id] || Object.keys(progressOf(id).scores).length > 0 || !!draftOf(id);
  const bar = signedIn ? <LearnerBar api={api} profile={profile!} go={go} /> : null;
  const shell = (children: ReactNode) => <Shell simulated={api.simulated} bar={bar}>{children}</Shell>;
  const spinner = shell(<p className="flex justify-center items-center gap-2 py-24 text-slate-500"><Loader2 className="w-5 h-5 animate-spin" /> Chargement du parcours…</p>);

  // Verification is public
  if (view === 'verifier') return shell(<VerifyView api={api} initial={route.slice(9)} onBack={() => go('')} />);

  // Signed in without a profile (rare: interrupted sign-up): complete it first
  if (session && !profile) {
    return (
      <Shell simulated={api.simulated}>
        <SignupForm api={api} completeFor={session.email} onDone={async () => { await refresh(); go('certifications'); }} onLogin={() => {}} />
        <p className="mt-4 text-center"><button className="text-sm underline text-slate-600" onClick={() => api.signOut()}>Me déconnecter</button></p>
      </Shell>
    );
  }

  // Account creation first, then the choice of a certification
  if (view === 'inscription' && !signedIn) return shell(<SignupForm api={api} onDone={() => go('certifications')} onLogin={() => go('connexion')} />);
  if (view === 'connexion' && !signedIn) return shell(<LoginForm api={api} onDone={() => go('espace')} onSignup={() => go('inscription')} />);

  const needAccount = ['espace', 'certifications', 'parcours', 'certificat', 'profil', 'etape', 'inscrire'].includes(view);
  if (needAccount && !signedIn) return shell(<LoginForm api={api} onDone={() => go(route)} onSignup={() => go('inscription')} />);

  if (signedIn && view === 'profil') {
    return shell(<SignupForm api={api} initial={profile} onDone={async () => { await refresh(); go('espace'); }} onLogin={() => {}} />);
  }
  if (signedIn && view === 'certifications') return shell(<CertificationsView isEnrolled={isEnrolled} go={go} />);

  if (signedIn && view === 'espace') {
    return shell(
      <EspaceView api={api} metas={CATALOG.filter((c) => isEnrolled(c.id))} enrollments={enrollments} progressOf={progressOf} draftOf={draftOf}
        profile={profile!} go={go} onCertificate={(id, number) => setProgressFor(id, { ...progressOf(id), certificate: number })} />
    );
  }

  // Course views: registration, path, chapter player, certificate
  if (signedIn && courseId) {
    const meta = metaOf(courseId);
    if (!meta) return shell(<CertificationsView isEnrolled={isEnrolled} go={go} />);
    if (!isEnrolled(courseId)) {
      return shell(
        <EnrollView api={api} meta={meta} profile={profile!} go={go}
          onEnrolled={(e) => { setEnrollments((m) => ({ ...m, [e.courseId]: e })); go(`parcours/${e.courseId}`); }} />
      );
    }
    const course = courses[courseId];
    if (!course) return spinner;
    const progress = progressOf(courseId), draft = draftOf(courseId);
    const passed = (id: string) => stepCleared(progress, id, PASS);
    const path = (notice?: string) => shell(<PathView course={course} meta={meta} progress={progress} draft={draft} go={go} notice={notice} />);

    if (view === 'etape') {
      const i = course.steps.findIndex((s) => s.id === stepId);
      if (i < 0 || !course.steps.slice(0, i).every((s) => passed(s.id))) return path("Cette étape n'est pas encore débloquée : validez d'abord les étapes précédentes.");
      return (
        <Suspense fallback={<p className="flex justify-center py-24"><Loader2 className="w-5 h-5 animate-spin" /></p>}>
          <ElearningPlayer
            key={`${course.id}-${course.steps[i].id}-${attempt}`}
            api={api}
            course={course}
            step={course.steps[i]}
            resume={draft}
            onProgress={(p) => { setProgressFor(course.id, p); setDraftFor(course.id, null); }}
            onExit={async () => { setDraftFor(course.id, await api.getDraft(course.id)); go(`parcours/${course.id}`); }}
            onCertificate={() => go(`certificat/${course.id}`)}
            onRestart={async () => { await api.clearDraft(course.id); setDraftFor(course.id, null); setAttempt((n) => n + 1); }}
          />
        </Suspense>
      );
    }
    if (view === 'certificat') {
      if (!passed('FINAL')) return path("Le certificat se débloque après la réussite de l'examen final.");
      return shell(<CertificateView api={api} course={course} profile={profile!} progress={progress} onProgress={(p) => setProgressFor(course.id, p)} go={go} />);
    }
    return path();
  }

  const startFor = (id: string) => (!signedIn ? 'inscription' : isEnrolled(id) ? `parcours/${id}` : `inscrire/${id}`);
  return shell(<HomeView signedIn={signedIn} go={go} startFor={startFor} isEnrolled={isEnrolled} />);
}

function Shell({ children, simulated, bar }: { children: ReactNode; simulated?: boolean; bar?: ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {simulated && (
        <p className="mb-4 rounded-xl bg-amber-100 text-amber-900 text-center text-xs font-bold px-3 py-2">
          Mode test local : comptes, notes et certificats sont simulés dans ce navigateur (rien n'est enregistré en ligne).
        </p>
      )}
      {bar}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
function HomeView({ signedIn, go, startFor, isEnrolled }: {
  signedIn: boolean; go: (h: string) => void; startFor: (id: string) => string; isEnrolled: (id: string) => boolean;
}) {
  return (
    <>
      <section className="relative overflow-hidden rounded-3xl p-7 sm:p-10 text-white bg-gradient-to-r from-[#001B38] via-brand-blue to-brand-blue-light">
        <div aria-hidden className="absolute -right-20 -top-20 w-80 h-80 rounded-full border-2 border-white/20 shadow-[0_0_0_30px_rgba(79,179,255,.08),0_0_0_60px_rgba(255,255,255,.05)]" />
        <p className="relative text-xs font-extrabold tracking-[.18em] uppercase text-amber-300">E-learning CICEXF · 100 % gratuit</p>
        <h1 className="relative mt-2 text-3xl sm:text-4xl font-extrabold text-white max-w-2xl leading-tight">Apprenez à votre rythme et obtenez une certification gratuite</h1>
        <p className="relative mt-3 max-w-2xl text-sky-100">
          Des parcours en ligne construits sur les thématiques du cabinet. Créez votre compte, inscrivez-vous à une certification, étudiez chaque
          module, répondez aux quiz et validez chaque chapitre avec {PASS} % au moins pour obtenir votre certificat.
        </p>
        <div className="relative mt-6 flex flex-wrap gap-3">
          <button onClick={() => go(signedIn ? 'espace' : 'inscription')} className={primary}><GraduationCap className="w-4 h-4" />{signedIn ? 'Mon espace e-learning' : 'Créer mon compte gratuit'}</button>
          {!signedIn && <button onClick={() => go('connexion')} className="inline-flex items-center gap-2 rounded-xl border-2 border-white/70 px-5 py-2.5 font-extrabold text-sm text-white hover:bg-white hover:text-brand-blue transition-colors">J'ai déjà un compte</button>}
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
        {[
          ['Créez votre compte', 'Gratuit, quelques informations suffisent.'],
          ['Inscrivez-vous', 'Choisissez une certification et confirmez.'],
          ['Étudiez et répondez', 'Textes de cours, quiz et examens.'],
          ['Certifiez-vous', `${PASS} % à chaque étape, certificat en PDF.`]
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
        {CATALOG.map((c) => (
          <CourseCard key={c.id} meta={c}>
            <button onClick={() => go(startFor(c.id))} className={`${primary} mt-4`}>
              <Play className="w-4 h-4" />{!signedIn ? 'Commencer gratuitement' : isEnrolled(c.id) ? 'Continuer' : "S'inscrire"}
            </button>
          </CourseCard>
        ))}
        {COMING_SOON.map((t) => <SoonCard key={t} title={t} />)}
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

function CourseCard({ meta, children }: { meta: CourseMeta; children: ReactNode; key?: string }) {
  const st = meta.stats;
  return (
    <div className={`${card} p-5 flex flex-col border-2 border-brand-emerald/70`}>
      <span className="self-start text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-sky-50 text-brand-blue dark:bg-sky-950 dark:text-sky-300">{meta.domain}</span>
      <h3 className="mt-3 mb-1.5 text-lg font-extrabold text-slate-900 dark:text-white">{meta.title}</h3>
      <p className="flex-1 text-sm text-slate-600 dark:text-slate-400">{meta.summary}</p>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{st.chapters} chapitres · {st.modules} modules · {st.quizzes} quiz · {st.exams} examens · {meta.hours} h environ</p>
      {children}
    </div>
  );
}

function SoonCard({ title }: { title: string; key?: string }) {
  return (
    <div className={`${card} p-5 flex flex-col`}>
      <span className="self-start text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Bientôt</span>
      <h3 className="mt-3 text-lg font-extrabold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">Parcours en préparation.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Learner bar: the learner's name in the top-left corner; a click shows the account details
// ---------------------------------------------------------------------------
function LearnerBar({ api, profile, go }: { api: ElearningApi; profile: LearnerProfile; go: (h: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [open]);
  const goTo = (h: string) => { setOpen(false); go(h); };
  const row = 'grid grid-cols-[92px_1fr] gap-2 py-1';

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div ref={ref} className="relative">
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="true"
          className="inline-flex items-center gap-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 pl-1.5 pr-3.5 py-1.5 shadow-sm hover:border-brand-blue">
          <span className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center"><UserRound className="w-4 h-4" /></span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">{profile.prenom} {profile.nom.toLocaleUpperCase('fr-FR')}</span>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div role="menu" className="absolute left-0 top-full mt-2 z-30 w-[min(92vw,340px)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-4">
            <p className="text-[11px] font-extrabold tracking-widest uppercase text-slate-500">Mes informations</p>
            <dl className="mt-2 text-sm">
              <div className={row}><dt className="text-slate-500">E-mail</dt><dd className="font-bold break-all text-slate-800 dark:text-slate-200">{profile.email}</dd></div>
              <div className={row}><dt className="text-slate-500">Téléphone</dt><dd className="font-bold text-slate-800 dark:text-slate-200">{profile.telephone}</dd></div>
              <div className={row}><dt className="text-slate-500">Pays</dt><dd className="font-bold text-slate-800 dark:text-slate-200">{profile.pays}</dd></div>
              <div className={row}><dt className="text-slate-500">Activité</dt><dd className="font-bold text-slate-800 dark:text-slate-200">{profile.activite}</dd></div>
              <div className={row}><dt className="text-slate-500">Formation</dt><dd className="font-bold text-slate-800 dark:text-slate-200">{profile.formation}</dd></div>
              <div className={row}><dt className="text-slate-500">Expérience</dt><dd className="font-bold text-slate-800 dark:text-slate-200">{profile.experience}</dd></div>
            </dl>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 grid gap-1 text-sm font-bold">
              <button role="menuitem" onClick={() => goTo('espace')} className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-brand-blue dark:text-sky-300 hover:bg-slate-100 dark:hover:bg-slate-800"><GraduationCap className="w-4 h-4" />Mon espace e-learning</button>
              <button role="menuitem" onClick={() => goTo('certifications')} className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"><ClipboardCheck className="w-4 h-4" />S'inscrire à une certification</button>
              <button role="menuitem" onClick={() => goTo('profil')} className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"><UserRound className="w-4 h-4" />Modifier mes informations</button>
              <button role="menuitem" onClick={() => { setOpen(false); api.signOut(); go(''); }} className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"><LogOut className="w-4 h-4" />Déconnexion</button>
            </div>
          </div>
        )}
      </div>
      <button onClick={() => go('espace')} className="ml-auto inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue dark:text-sky-300 hover:underline"><GraduationCap className="w-4 h-4" />Mon espace e-learning</button>
    </div>
  );
}

const draftWhere = (meta: CourseMeta | undefined, d: Draft) => {
  const step = meta?.steps.find((s) => s.id === d.stepId);
  if (!step) return '';
  const answered = (Object.values(d.answers) as number[][][]).reduce<number>((n, m) => n + m.reduce<number>((a, arr) => a + (arr ? arr.filter((v) => v !== undefined && v !== null).length : 0), 0), 0);
  const mod = step.kind !== 'chapitre' ? '' : ` · module ${d.mi + 1}/${step.modules}`;
  return `${step.title.split(' : ')[0]}${mod} · ${answered} question${answered > 1 ? 's' : ''} répondue${answered > 1 ? 's' : ''}`;
};
const fmtDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

// ---------------------------------------------------------------------------
// Certifications open for registration
// ---------------------------------------------------------------------------
function CertificationsView({ isEnrolled, go }: { isEnrolled: (id: string) => boolean; go: (h: string) => void }) {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">S'inscrire à une certification</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">Choisissez la certification que vous voulez suivre. L'inscription est gratuite et se fait en une confirmation.</p>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATALOG.map((c) => (
          <CourseCard key={c.id} meta={c}>
            {isEnrolled(c.id)
              ? <button onClick={() => go(`parcours/${c.id}`)} className={`${ghost} mt-4`}><CheckCircle2 className="w-4 h-4" />Déjà inscrit : continuer</button>
              : <button onClick={() => go(`inscrire/${c.id}`)} className={`${primary} mt-4`}><ClipboardCheck className="w-4 h-4" />S'inscrire</button>}
          </CourseCard>
        ))}
        {COMING_SOON.map((t) => <SoonCard key={t} title={t} />)}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Registration form: a summary of the certification and a simple confirmation
// ---------------------------------------------------------------------------
function EnrollView({ api, meta, profile, go, onEnrolled }: {
  api: ElearningApi; meta: CourseMeta; profile: LearnerProfile; go: (h: string) => void; onEnrolled: (e: Enrollment) => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const st = meta.stats;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!confirmed) return setError('Cochez la case pour confirmer votre inscription.');
    setBusy(true); setError('');
    try {
      onEnrolled(await api.enroll(meta.id));
    } catch (err) {
      setError(learnerErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className={`${card} max-w-3xl mx-auto p-6 sm:p-8`}>
      <p className="text-xs font-extrabold tracking-widest uppercase text-brand-emerald">Inscription à une certification</p>
      <h1 className="mt-1 text-2xl font-extrabold text-brand-blue dark:text-sky-300">{meta.title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{meta.summary}</p>

      <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
        <li className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2.5"><BookOpen className="w-4 h-4 text-brand-blue shrink-0" />{st.parts} parties · {st.chapters} chapitres · {st.modules} modules</li>
        <li className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2.5"><ClipboardCheck className="w-4 h-4 text-brand-blue shrink-0" />{st.quizzes} quiz et {st.exams} examens</li>
        <li className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2.5"><Clock className="w-4 h-4 text-brand-blue shrink-0" />{meta.hours} heures environ, à votre rythme</li>
        <li className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2.5"><Award className="w-4 h-4 text-brand-blue shrink-0" />Certificat de réussite dès {PASS} % à chaque étape</li>
      </ul>

      <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
        <p className="text-xs font-extrabold tracking-wide uppercase text-slate-500">Apprenant</p>
        <p className="mt-1 font-extrabold text-slate-900 dark:text-white">{profile.prenom} {profile.nom.toLocaleUpperCase('fr-FR')}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{profile.email} · {profile.telephone}</p>
        <p className="mt-1 text-xs text-slate-500">Ces informations figureront sur votre certificat. <button type="button" onClick={() => go('profil')} className="underline font-bold">Les modifier</button></p>
      </div>

      <label className="mt-5 flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" />
        <span>Je confirme mon inscription gratuite à la certification « {meta.certTitle} ».</span>
      </label>
      <p className="mt-3 min-h-[1.25rem] text-sm font-bold text-brand-emerald" role="alert">{error}</p>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy} className={primary}>{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}Confirmer mon inscription</button>
        <button type="button" onClick={() => go('certifications')} className="text-sm font-bold text-slate-600 dark:text-slate-300 underline">Choisir une autre certification</button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Personal training space: only the certifications the learner registered for
// ---------------------------------------------------------------------------
function EspaceView({ api, metas, enrollments, progressOf, draftOf, profile, go, onCertificate }: {
  api: ElearningApi; metas: CourseMeta[]; enrollments: Record<string, Enrollment>; progressOf: (id: string) => Progress; draftOf: (id: string) => Draft | null;
  profile: LearnerProfile; go: (h: string) => void; onCertificate: (courseId: string, number: string) => void;
}) {
  const [certs, setCerts] = useState<Record<string, Certificate | null>>({});
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const rows = metas.map((c) => {
    const p = progressOf(c.id), d = draftOf(c.id);
    const done = c.steps.filter((s) => stepCleared(p, s.id, PASS)).length;
    const finished = stepCleared(p, 'FINAL', PASS);
    const current = c.steps.find((s) => !stepCleared(p, s.id, PASS));
    return { c, p, d, done, finished, current, pct: Math.round((done / c.steps.length) * 100) };
  });
  const inProgress = rows.filter((r) => !r.finished);
  const finished = rows.filter((r) => r.finished);
  const certCount = finished.filter((r) => r.p.certificate).length;

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
  const heading = 'flex items-center gap-2 mt-7 mb-3 text-lg font-extrabold text-slate-900 dark:text-white';

  return (
    <>
      <section className="rounded-3xl p-5 sm:p-7 text-white bg-gradient-to-r from-[#001B38] via-brand-blue to-brand-blue-light">
        <p className="text-xs font-extrabold tracking-[.18em] uppercase text-amber-300">Mon espace e-learning</p>
        <h1 className="mt-1 text-2xl font-extrabold text-white">Bonjour {profile.prenom} !</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-white/15 px-3 py-1 font-bold">{inProgress.length} formation{inProgress.length > 1 ? 's' : ''} en cours</span>
          <span className="rounded-full bg-white/15 px-3 py-1 font-bold">{finished.length} terminée{finished.length > 1 ? 's' : ''}</span>
          <span className="rounded-full bg-white/15 px-3 py-1 font-bold">{certCount} certificat{certCount > 1 ? 's' : ''}</span>
        </div>
      </section>

      {!rows.length && (
        <div className={`${card} mt-5 p-6 text-center`}>
          <ClipboardCheck className="w-10 h-10 mx-auto text-brand-blue dark:text-sky-300" />
          <p className="mt-2 font-extrabold text-slate-900 dark:text-white">Vous n'êtes inscrit à aucune certification pour le moment.</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Choisissez une certification et confirmez votre inscription pour commencer.</p>
          <button onClick={() => go('certifications')} className={`${primary} mt-4`}><ClipboardCheck className="w-4 h-4" />S'inscrire à une certification</button>
        </div>
      )}

      {inProgress.length > 0 && <h2 className={heading}><Play className="w-5 h-5 text-brand-emerald" />Mes formations en cours</h2>}
      <div className="grid gap-4">
        {inProgress.map(({ c, d, done, pct, current }) => (
          <div key={c.id} className={`${card} p-5`}>
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300">{c.domain}</span>
            <h3 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{c.title}</h3>
            {enrollments[c.id]?.enrolledAt && <p className="text-xs text-slate-500">Inscrit le {fmtDate(enrollments[c.id].enrolledAt)}</p>}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"><i className="block h-full bg-gradient-to-r from-brand-blue to-amber-400" style={{ width: `${pct}%` }} /></div>
              <strong className="text-sm text-brand-blue dark:text-sky-300">{pct} %</strong>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{done} étape{done > 1 ? 's' : ''} validée{done > 1 ? 's' : ''} sur {c.steps.length}{current ? ` · prochaine étape : ${current.title}` : ''}</p>
            {d && <p className="mt-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 px-3 py-2 text-sm text-slate-800 dark:text-slate-200"><strong>Reprise enregistrée :</strong> {draftWhere(c, d)}</p>}
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => go(d ? `etape/${c.id}/${d.stepId}` : current ? `etape/${c.id}/${current.id}` : `parcours/${c.id}`)} className={primary}><Play className="w-4 h-4" />{d ? 'Reprendre là où je me suis arrêté' : done ? 'Continuer' : 'Commencer'}</button>
              <button onClick={() => go(`parcours/${c.id}`)} className={ghost}>Voir le parcours</button>
            </div>
          </div>
        ))}
      </div>

      {finished.length > 0 && <h2 className={heading}><Award className="w-5 h-5 text-amber-500" />Mes formations terminées et mes certificats</h2>}
      {error && <p className="mb-3 font-bold text-brand-emerald">{error}</p>}
      <div className="grid gap-4">
        {finished.map(({ c, p }) => {
          const cert = certs[c.id];
          return (
            <div key={c.id} className={`${card} p-5 border-l-4 border-l-emerald-600`}>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wider uppercase text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" />Terminée{p.finishedAt ? ` le ${fmtDate(p.finishedAt)}` : ''}</span>
              <h3 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{c.certTitle}</h3>
              <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><dt className="text-slate-500">N° du certificat</dt><dd className="font-extrabold text-slate-900 dark:text-white">{p.certificate || 'À obtenir'}</dd></div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><dt className="text-slate-500">Résultat moyen</dt><dd className="font-extrabold text-slate-900 dark:text-white">{cert ? `${cert.average} %` : p.certificate ? '…' : '—'}</dd></div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><dt className="text-slate-500">Délivré le</dt><dd className="font-extrabold text-slate-900 dark:text-white">{cert ? fmtDate(cert.issuedAt) : p.certificate ? '…' : '—'}</dd></div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => download(c.id)} disabled={busy === c.id} className={primary}>
                  {busy === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}{p.certificate ? 'Télécharger mon certificat (PDF)' : 'Obtenir mon certificat'}
                </button>
                {p.certificate && <button onClick={() => go(`verifier/${p.certificate}`)} className={ghost}><ShieldCheck className="w-4 h-4" />Vérifier</button>}
                <button onClick={() => go(`parcours/${c.id}`)} className={ghost}>Revoir le parcours</button>
              </div>
            </div>
          );
        })}
      </div>

      {rows.length > 0 && (
        <div className={`${card} mt-7 p-5 flex flex-wrap items-center gap-4`}>
          <ClipboardCheck className="w-7 h-7 text-brand-blue dark:text-sky-300 shrink-0" />
          <p className="flex-1 min-w-[200px] text-sm text-slate-600 dark:text-slate-400"><strong className="text-slate-900 dark:text-white">Une autre certification vous intéresse ?</strong> Inscrivez-vous en une confirmation : elle apparaîtra ici.</p>
          <button onClick={() => go('certifications')} className={ghost}>S'inscrire à une certification</button>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Learner path (full width, compact)
// ---------------------------------------------------------------------------
function PathView({ course, meta, progress, draft, go, notice }: {
  course: Course; meta: CourseMeta; progress: Progress; draft: Draft | null; go: (h: string) => void; notice?: string;
}) {
  const passed = (id: string) => stepCleared(progress, id, PASS);
  const isOpen = (i: number) => course.steps.slice(0, i).every((s) => passed(s.id));
  const done = course.steps.filter((s) => passed(s.id)).length;
  const pct = Math.round((done / course.steps.length) * 100);

  const block = (s: CourseStep, i: number) => {
    const open = isOpen(i), ok = passed(s.id), sc = progress.scores[s.id];
    const resuming = open && draft?.stepId === s.id;
    const sub = isExam(s)
      ? `${stepQuestionCount(course, s)} questions · ${PASS} % requis`
      : `${s.modules.length} modules · ${s.modules.reduce((n, m) => n + course.modules[m.id].quizzes.length, 0)} quiz · ${PASS} % requis`;
    const target = `etape/${course.id}/${s.id}`;
    return (
      <div key={s.id} className="px-4 sm:px-5 py-4 border-t border-slate-200 dark:border-slate-800">
        <div className={`flex flex-wrap items-center gap-3 ${open ? 'cursor-pointer' : ''}`} onClick={open ? () => go(target) : undefined}>
          <span className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${ok ? 'bg-emerald-100 text-emerald-700' : open ? 'bg-brand-emerald text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
            {ok ? <CheckCircle2 className="w-5 h-5" /> : open ? <Play className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </span>
          <div className="flex-1 min-w-[190px]">
            <strong className={`block text-base sm:text-lg leading-snug ${open ? 'text-brand-blue dark:text-sky-300' : 'text-slate-400'}`}>{s.title}</strong>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{sub}</span>
            {resuming && <span className="block mt-0.5 text-xs sm:text-sm font-bold text-brand-emerald">En cours : {draftWhere(meta, draft!)}</span>}
          </div>
          {sc !== undefined && <span className={`text-sm font-extrabold ${sc >= PASS ? 'text-emerald-700 dark:text-emerald-400' : 'text-brand-emerald'}`}>{sc} %</span>}
          {open && (
            <button onClick={(e) => { e.stopPropagation(); go(target); }}
              className={`ml-12 sm:ml-0 inline-flex items-center justify-center rounded-xl px-4 py-2 font-extrabold text-sm transition-colors ${ok && !resuming ? 'border-2 border-brand-blue text-brand-blue dark:border-sky-300 dark:text-sky-300 hover:bg-brand-blue hover:text-white' : 'bg-brand-emerald hover:bg-brand-emerald-dark text-white'}`}>
              {resuming ? 'Reprendre' : ok ? 'Revoir' : sc !== undefined ? 'Recommencer' : 'Commencer'}
            </button>
          )}
        </div>
        {!isExam(s) && (
          <ul className={`mt-2 ml-12 space-y-0.5 text-sm ${open ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
            {s.modules.map((m) => <li key={m.id}><span className="text-amber-500">▸ </span>{m.title} · {m.minutes} min</li>)}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={`${card} p-5 mb-5 flex flex-wrap items-center gap-4`}>
        <div className="flex-1 min-w-[220px]">
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-brand-blue dark:text-sky-300">{course.domain}</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{course.title}</h1>
          <div className="mt-2 flex items-center gap-3 max-w-md">
            <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"><i className="block h-full bg-gradient-to-r from-brand-blue to-amber-400" style={{ width: `${pct}%` }} /></div>
            <span className="text-sm text-slate-500 whitespace-nowrap">{done}/{course.steps.length} étapes</span>
          </div>
        </div>
        {passed('FINAL') && <button onClick={() => go(`certificat/${course.id}`)} className={primary}><Award className="w-4 h-4" />Mon certificat</button>}
      </div>

      {progress.simulation && (
        <p className="mb-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border-l-4 border-violet-500 px-4 py-3 text-sm text-slate-800 dark:text-slate-200">
          <strong>Mode simulation :</strong> chaque étape se débloque dès qu'elle a été passée, même sous {PASS} %. Le certificat délivré est un spécimen de démonstration, sans valeur officielle.
        </p>
      )}
      {notice && <p className="mb-4 rounded-2xl bg-amber-50 border-l-4 border-amber-400 px-4 py-3 text-sm font-bold text-slate-800">{notice}</p>}
      {course.parts.map((p) => (
        <div key={p.id} className={`${card} mb-4 overflow-hidden`}>
          <h2 className="px-4 sm:px-5 py-3 text-base sm:text-lg text-white font-extrabold bg-gradient-to-r from-brand-blue to-brand-blue-light">{p.title}</h2>
          {course.steps.map((s, i) => (s.part === p.id ? block(s, i) : null))}
        </div>
      ))}
      <div className={`${card} overflow-hidden`}>
        <h2 className="px-4 sm:px-5 py-3 text-base sm:text-lg text-white font-extrabold bg-gradient-to-r from-brand-emerald to-brand-emerald-light">Certification</h2>
        {block(course.steps[course.steps.length - 1], course.steps.length - 1)}
      </div>
    </>
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
            {cert.simulation
              ? <p className="mt-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 px-3 py-2 text-violet-800 dark:text-violet-300 font-bold">Mode simulation : voici un certificat spécimen (moyenne {cert.average} %), sans valeur officielle, pour voir comment il est délivré.</p>
              : <p className="mt-2 text-slate-600 dark:text-slate-300">Vous avez validé toutes les étapes avec une moyenne de {cert.average} %. Votre certificat est prêt.</p>}
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
      <p className="mt-4 text-center"><button onClick={() => go(`parcours/${course.id}`)} className="text-sm font-bold underline text-slate-600 dark:text-slate-300">Retour au parcours</button></p>
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
          <p className="inline-flex items-center gap-2 font-extrabold text-emerald-800 dark:text-emerald-300"><CheckCircle2 className="w-5 h-5" />{state.cert.simulation ? 'Spécimen de démonstration (simulation), sans valeur officielle' : 'Certificat authentique'}</p>
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
