// Learner accounts, progress, grading and certificates for the E-learning tab.
// In production: Firebase Auth (separate learner app) + Firestore + the `elearning` Cloud Function.
// In development (npm run dev) a local simulation is used by default, so that tests never create
// accounts or data online; set VITE_ELEARNING_MOCK=0 to test against the real services.
import type { CourseStatus } from '../data/elearning';

export interface LearnerProfile {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  pays: string;
  activite: string;
  formation: string;
  experience: string;
}
export interface LearnerSession { uid: string; email: string }
export interface Progress {
  scores: Record<string, number>;
  attempts: Record<string, number>;
  startedAt: string | null;
  finishedAt: string | null;
  certificate: string | null;
  /** Temporary simulation: steps unlock once attempted, even under 80 % (specimen certificate) */
  simulation?: boolean;
}
export interface GradeResult {
  pct: number;
  good: number;
  total: number;
  passed: boolean;
  best: number;
  modules: { id: string; good: number; total: number; pct: number }[];
  progress: Progress;
}
export interface Certificate {
  number: string;
  courseId: string;
  courseTitle: string;
  lastName: string;
  firstName: string;
  startedAt: string;
  finishedAt: string;
  issuedAt: string;
  average: number;
  hours: number;
  stats: { parts: number; chapters: number; modules: number; quizzes: number };
  /** Specimen issued in simulation mode, with no official value */
  simulation?: boolean;
}
/** answers[moduleId][quizIndex][questionIndex] = index of the chosen answer */
export type Answers = Record<string, number[][]>;
/** Registration to a certification (confirmed by the learner) */
export interface Enrollment { courseId: string; enrolledAt: string }
/** A chapter or exam in progress, saved so that the learner can resume it later (on any device) */
export interface Draft {
  stepId: string;
  mi: number;
  phase: 'lesson' | 'intro' | 'quiz';
  qi: number;
  k: number;
  answers: Answers;
  order: Record<string, number[]>;
  savedAt: string;
}

export interface ElearningApi {
  readonly simulated: boolean;
  onSession(cb: (s: LearnerSession | null) => void): () => void;
  signUp(profile: LearnerProfile, password: string): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
  getProfile(): Promise<LearnerProfile | null>;
  saveProfile(profile: LearnerProfile): Promise<void>;
  getProgress(courseId: string): Promise<Progress>;
  grade(courseId: string, stepId: string, answers: Answers): Promise<GradeResult>;
  issueCertificate(courseId: string): Promise<Certificate>;
  getEnrollments(): Promise<Record<string, Enrollment>>;
  enroll(courseId: string): Promise<Enrollment>;
  getDraft(courseId: string): Promise<Draft | null>;
  /** Saved at once in this browser, and in the account a moment later */
  saveDraft(courseId: string, draft: Draft): void;
  clearDraft(courseId: string): Promise<void>;
  verifyCertificate(number: string): Promise<Certificate | null>;
  /** Opening status chosen by the administrator for each course (courses not listed keep their default) */
  getCourseStatuses(): Promise<Record<string, CourseStatus>>;
  /** Answer key of a course (control accounts only): index of the right answer in the public file order */
  getAnswerKey(courseId: string): Promise<Record<string, number[][]>>;
}

export const EMPTY_PROGRESS: Progress = { scores: {}, attempts: {}, startedAt: null, finishedAt: null, certificate: null };

export const ELEARNING_API_URL: string =
  import.meta.env.VITE_ELEARNING_API_URL || 'https://elearning-3ksz72m3ta-ew.a.run.app';

/** Certificate numbers: CX-<course>-<YYMMDD>-XXXX-XXXX (8 random characters), SP- for simulation specimens;
 *  the first certificates (CICEXF-EL-2026-000001) remain valid */
export const CERTIFICATE_RE = /^(CICEXF-EL-(TEST-)?20\d{2}-\d{6}|(CX|SP)-[A-Z0-9]{3}-\d{6}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4})$/;
export const CERTIFICATE_EXAMPLE = 'CX-SEM-261109-K7QF-3MZP';

/** Control accounts (administrators): SHA-256 of their e-mail, so that the addresses are not published.
 *  The server keeps its own list (functions/elearning/reviewers.json) and enforces the access. */
const REVIEWER_HASHES = [
  '3f7544895a8ca49c74e0bcf5d359f745eae010ab17b31f205c32913e02bff87b',
  'cdcf121e0ba29e7b5949dc72a088024b07ee9e7a19cddc861cd1c0a7ea34ad40',
  '3932f8b3097248dffe7eef25da0038e10d4a66dd71439600d83e6f96d1c14912',
  ...(import.meta.env.DEV ? ['7c1174a877c6fb78f60f8fec7192fa7f5f3ad6e5109465611ddb1d5250c62146'] : []) // local test account
];
export async function isReviewerEmail(email: string | null | undefined): Promise<boolean> {
  if (!email || !globalThis.crypto?.subtle) return false;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.trim().toLowerCase()));
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return REVIEWER_HASHES.includes(hex);
}

/** A step counts as cleared at 80 % or more, or once attempted in simulation mode */
export const stepCleared = (p: Progress, stepId: string, pass: number) =>
  p.simulation ? p.scores[stepId] !== undefined : (p.scores[stepId] || 0) >= pass;

export class ElearningError extends Error {}

const draftKey = (uid: string, courseId: string) => `cicexf_el_draft_${uid}_${courseId}`;
export const localDraft = {
  get(uid: string, courseId: string): Draft | null {
    try { return JSON.parse(localStorage.getItem(draftKey(uid, courseId)) || 'null'); } catch { return null; }
  },
  set(uid: string, courseId: string, d: Draft) {
    try { localStorage.setItem(draftKey(uid, courseId), JSON.stringify(d)); } catch {}
  },
  clear(uid: string, courseId: string) {
    try { localStorage.removeItem(draftKey(uid, courseId)); } catch {}
  }
};
export const newestDraft = (a: Draft | null, b: Draft | null) => (!a ? b : !b ? a : a.savedAt >= b.savedAt ? a : b);

export function learnerErrorMessage(err: any): string {
  if (err instanceof ElearningError) return err.message;
  switch (err?.code) {
    case 'auth/email-already-in-use':
      return 'Un compte existe déjà avec cette adresse e-mail. Connectez-vous, ou utilisez « Mot de passe oublié ».';
    case 'auth/invalid-email':
      return "L'adresse e-mail n'est pas valide.";
    case 'auth/weak-password':
      return 'Mot de passe trop faible : 8 caractères au moins.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return "Adresse e-mail ou mot de passe incorrect. Vous pouvez utiliser « Mot de passe oublié ».";
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Patientez quelques minutes avant de réessayer.';
    case 'auth/network-request-failed':
    case 'unavailable':
      return 'Connexion réseau indisponible. Vérifiez votre accès Internet.';
    case 'permission-denied':
      return "Enregistrement refusé. Vérifiez les informations saisies, puis réessayez.";
    default:
      return 'Opération impossible pour le moment. Veuillez réessayer.';
  }
}

const toIso = (v: any): string | null => (v && typeof v.toDate === 'function' ? v.toDate().toISOString() : v || null);

async function createFirebaseApi(): Promise<ElearningApi> {
  const [{ learnerAuth, learnerDb }, authMod, fs, { db: publicDb }] = await Promise.all([
    import('../elearningFirebase'),
    import('firebase/auth'),
    import('firebase/firestore'),
    import('../firebase')
  ]);
  const { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } = authMod;
  const { doc, getDoc, getDocs, setDoc, deleteDoc, collection, serverTimestamp } = fs;
  const draftTimers: Record<string, ReturnType<typeof setTimeout>> = {};
  const draftRef = (uid: string, courseId: string) => doc(learnerDb, 'learners', uid, 'drafts', courseId);

  const call = async <T,>(body: Record<string, unknown>): Promise<T> => {
    const user = learnerAuth.currentUser;
    if (!user) throw new ElearningError('Session expirée. Reconnectez-vous.');
    const res = await fetch(ELEARNING_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` },
      body: JSON.stringify(body)
    }).catch(() => { throw new ElearningError('Connexion réseau indisponible. Vérifiez votre accès Internet.'); });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ElearningError(data.error || 'Opération impossible pour le moment. Réessayez.');
    return data as T;
  };

  const writeProfile = async (uid: string, email: string, profile: LearnerProfile, isNew: boolean) => {
    const ref = doc(learnerDb, 'learners', uid);
    const existing = isNew ? null : await getDoc(ref);
    await setDoc(ref, {
      nom: profile.nom.trim(),
      prenom: profile.prenom.trim(),
      telephone: profile.telephone.trim(),
      email,
      pays: profile.pays,
      activite: profile.activite.trim(),
      formation: profile.formation,
      experience: profile.experience,
      consent: true,
      createdAt: existing?.exists() ? existing.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  };

  // During a sign-up, the new session is announced only once the profile is saved
  let pendingSignup: Promise<unknown> | null = null;

  return {
    simulated: false,
    onSession: (cb) => onAuthStateChanged(learnerAuth, async (u) => {
      if (pendingSignup) await pendingSignup.catch(() => {});
      cb(u ? { uid: u.uid, email: u.email || '' } : null);
    }),
    async signUp(profile, password) {
      pendingSignup = (async () => {
        const { user } = await createUserWithEmailAndPassword(learnerAuth, profile.email.trim(), password);
        await writeProfile(user.uid, user.email || profile.email.trim().toLowerCase(), profile, true);
      })();
      try {
        await pendingSignup;
      } finally {
        pendingSignup = null;
      }
    },
    async signIn(email, password) {
      await signInWithEmailAndPassword(learnerAuth, email.trim(), password);
    },
    resetPassword: (email) => sendPasswordResetEmail(learnerAuth, email.trim()),
    signOut: () => signOut(learnerAuth),
    async getProfile() {
      const u = learnerAuth.currentUser;
      if (!u) return null;
      const snap = await getDoc(doc(learnerDb, 'learners', u.uid));
      return snap.exists() ? (snap.data() as LearnerProfile) : null;
    },
    async saveProfile(profile) {
      const u = learnerAuth.currentUser;
      if (!u) throw new ElearningError('Session expirée. Reconnectez-vous.');
      await writeProfile(u.uid, u.email || profile.email, profile, false);
    },
    async getProgress(courseId) {
      const u = learnerAuth.currentUser;
      if (!u) return EMPTY_PROGRESS;
      const snap = await getDoc(doc(learnerDb, 'learners', u.uid, 'progress', courseId));
      if (!snap.exists()) return EMPTY_PROGRESS;
      const d = snap.data();
      return {
        scores: d.scores || {},
        attempts: d.attempts || {},
        startedAt: toIso(d.startedAt),
        finishedAt: toIso(d.finishedAt),
        certificate: d.certificate || null,
        simulation: !!d.simulation
      };
    },
    grade: (courseId, stepId, answers) => call<GradeResult>({ action: 'grade', courseId, stepId, answers }),
    issueCertificate: (courseId) => call<{ certificate: Certificate }>({ action: 'certificate', courseId }).then((r) => r.certificate),
    async getEnrollments() {
      const u = learnerAuth.currentUser;
      if (!u) return {};
      const snap = await getDocs(collection(learnerDb, 'learners', u.uid, 'enrollments'));
      return Object.fromEntries(snap.docs.map((d) => [d.id, { courseId: d.id, enrolledAt: toIso(d.data().enrolledAt) || '' }]));
    },
    async enroll(courseId) {
      const u = learnerAuth.currentUser;
      if (!u) throw new ElearningError('Session expirée. Reconnectez-vous.');
      const ref = doc(learnerDb, 'learners', u.uid, 'enrollments', courseId);
      const existing = await getDoc(ref);
      if (!existing.exists()) await setDoc(ref, { courseId, enrolledAt: serverTimestamp() });
      return { courseId, enrolledAt: existing.exists() ? toIso(existing.data().enrolledAt) || '' : new Date().toISOString() };
    },
    async getDraft(courseId) {
      const u = learnerAuth.currentUser;
      if (!u) return null;
      let remote: Draft | null = null;
      try {
        const snap = await getDoc(draftRef(u.uid, courseId));
        if (snap.exists()) remote = { ...JSON.parse(snap.data().state), savedAt: toIso(snap.data().savedAt) || '' };
      } catch {}
      return newestDraft(localDraft.get(u.uid, courseId), remote);
    },
    saveDraft(courseId, draft) {
      const u = learnerAuth.currentUser;
      if (!u) return;
      localDraft.set(u.uid, courseId, draft);
      clearTimeout(draftTimers[courseId]);
      draftTimers[courseId] = setTimeout(() => {
        const { savedAt, ...state } = draft;
        void savedAt;
        setDoc(draftRef(u.uid, courseId), { stepId: draft.stepId, state: JSON.stringify(state), savedAt: serverTimestamp() })
          .catch((e) => console.warn('Brouillon non enregistré en ligne :', e?.code));
      }, 1500);
    },
    async clearDraft(courseId) {
      const u = learnerAuth.currentUser;
      if (!u) return;
      clearTimeout(draftTimers[courseId]);
      localDraft.clear(u.uid, courseId);
      await deleteDoc(draftRef(u.uid, courseId)).catch(() => {});
    },
    getAnswerKey: (courseId) => call<{ key: Record<string, number[][]> }>({ action: 'review', courseId }).then((r) => r.key),
    async getCourseStatuses() {
      const snap = await getDocs(collection(publicDb, 'elearning_courses'));
      return Object.fromEntries(snap.docs.map((d) => [d.id, d.data().status as CourseStatus]).filter(([, st]) => ['open', 'closed', 'deleted'].includes(st as string)));
    },
    async verifyCertificate(number) {
      if (!CERTIFICATE_RE.test(number)) return null;
      const snap = await getDoc(doc(publicDb, 'certificates', number));
      if (!snap.exists()) return null;
      const d = snap.data();
      return {
        number: d.number, courseId: d.courseId, courseTitle: d.courseTitle, lastName: d.lastName, firstName: d.firstName,
        startedAt: toIso(d.startedAt)!, finishedAt: toIso(d.finishedAt)!, issuedAt: toIso(d.issuedAt)!,
        average: d.average, hours: d.hours, stats: d.stats, simulation: !!d.simulation
      };
    }
  };
}

let apiPromise: Promise<ElearningApi> | null = null;

export function getElearningApi(): Promise<ElearningApi> {
  if (!apiPromise) {
    apiPromise = import.meta.env.DEV && import.meta.env.VITE_ELEARNING_MOCK !== '0'
      ? import('./elearningMock').then((m) => m.createMockApi())
      : createFirebaseApi();
  }
  return apiPromise;
}
