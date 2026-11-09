// Development only: a local simulation of the E-learning services (accounts, grading, certificates),
// stored in this browser. It is never part of the production build (see getElearningApi).
import { PASS } from '../data/elearning';
import type { Answers, Certificate, ElearningApi, LearnerProfile, LearnerSession, Progress } from './elearningApi';
import type { CourseStatus } from '../data/elearning';
import { EMPTY_PROGRESS, ElearningError, localDraft } from './elearningApi';

interface ServerCourse {
  id: string;
  code?: string;
  defaultStatus?: CourseStatus;
  certTitle: string;
  hours: number;
  steps: { id: string; kind: string; modules: string[] }[];
  key: Record<string, number[][]>;
}
interface Store {
  users: Record<string, { uid: string; password: string; profile: LearnerProfile | null }>;
  session: string | null;
  progress: Record<string, Record<string, Progress & { lastScores?: Record<string, number> }>>;
  certificates: Record<string, Certificate & { uid: string }>;
  enrollments?: Record<string, Record<string, { courseId: string; enrolledAt: string }>>;
  counter: number;
}

const KEY = 'cicexf_elearning_simulation';
/** Local test of the opening status (set from the browser console: localStorage.cicexf_el_course_status = '{"id":"closed"}') */
const mockStatuses = (): Record<string, CourseStatus> => {
  try { return JSON.parse(localStorage.getItem('cicexf_el_course_status') || '{}'); } catch { return {}; }
};
const load = (): Store => {
  try {
    return { users: {}, session: null, progress: {}, certificates: {}, counter: 0, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { users: {}, session: null, progress: {}, certificates: {}, counter: 0 };
  }
};
const save = (s: Store) => localStorage.setItem(KEY, JSON.stringify(s));
const wait = () => new Promise((r) => setTimeout(r, 250));
const authError = (code: string) => Object.assign(new Error(code), { code });

// Answer keys are read from the (unpublished) functions folder, only on the developer's machine
const keyFiles = import.meta.glob('../../functions/elearning/keys/*.json', { import: 'default' });
async function serverCourse(courseId: string): Promise<ServerCourse> {
  for (const loadKey of Object.values(keyFiles)) {
    const c = (await loadKey()) as ServerCourse;
    if (c.id === courseId) return c;
  }
  throw new ElearningError("Clé de correction absente : lancez scripts/build-elearning-course.mjs");
}

export function createMockApi(): ElearningApi {
  const listeners = new Set<(s: LearnerSession | null) => void>();
  const current = (): LearnerSession | null => {
    const s = load();
    const email = Object.keys(s.users).find((e) => s.users[e].uid === s.session);
    return email ? { uid: s.users[email].uid, email } : null;
  };
  const emit = () => listeners.forEach((cb) => cb(current()));
  const isSim = (courseId: string) => courseId === 'cartographie-geomatique' && (current()?.email || '').includes('+simu');
  const uid = () => {
    const s = current();
    if (!s) throw new ElearningError('Session expirée. Reconnectez-vous.');
    return s.uid;
  };

  return {
    simulated: true,
    onSession(cb) {
      listeners.add(cb);
      setTimeout(() => cb(current()), 0);
      return () => listeners.delete(cb);
    },
    async signUp(profile, password) {
      await wait();
      const s = load();
      const email = profile.email.trim().toLowerCase();
      if (s.users[email]) throw authError('auth/email-already-in-use');
      const id = 'sim-' + Math.random().toString(36).slice(2, 10);
      s.users[email] = { uid: id, password, profile: { ...profile, email } };
      s.session = id;
      save(s);
      emit();
    },
    async signIn(email, password) {
      await wait();
      const s = load();
      const u = s.users[email.trim().toLowerCase()];
      if (!u || u.password !== password) throw authError('auth/invalid-credential');
      s.session = u.uid;
      save(s);
      emit();
    },
    async resetPassword() { await wait(); },
    async signOut() {
      const s = load();
      s.session = null;
      save(s);
      emit();
    },
    async getProfile() {
      const s = load(), me = current();
      return me ? s.users[me.email].profile : null;
    },
    async saveProfile(profile) {
      const s = load(), me = current();
      if (!me) throw new ElearningError('Session expirée. Reconnectez-vous.');
      s.users[me.email].profile = { ...profile, email: me.email };
      save(s);
    },
    async getProgress(courseId) {
      const s = load(), me = current();
      return (me && s.progress[me.uid]?.[courseId]) || EMPTY_PROGRESS;
    },
    async grade(courseId, stepId, answers: Answers) {
      await wait();
      const course = await serverCourse(courseId);
      const s = load(), id = uid();
      const sim = isSim(courseId);
      const status = mockStatuses()[courseId] || course.defaultStatus || 'open';
      if (status !== 'open') throw new ElearningError(status === 'deleted' ? "Cette certification n'est plus disponible." : 'Cette certification est momentanément fermée.');
      const prev = s.progress[id]?.[courseId] || { ...EMPTY_PROGRESS };
      const index = course.steps.findIndex((x) => x.id === stepId);
      if (index < 0) throw new ElearningError('Étape introuvable');
      if (!course.steps.slice(0, index).every((x) => (sim ? prev.scores[x.id] !== undefined : (prev.scores[x.id] || 0) >= PASS))) throw new ElearningError("Cette étape n'est pas encore débloquée");
      const step = course.steps[index];
      const modules = step.modules.map((modId) => {
        let good = 0, total = 0;
        course.key[modId].forEach((quiz, qi) => quiz.forEach((g, k) => { total++; if (answers[modId]?.[qi]?.[k] === g) good++; }));
        return { id: modId, good, total, pct: Math.round((good / total) * 100) };
      });
      const good = modules.reduce((n, m) => n + m.good, 0), total = modules.reduce((n, m) => n + m.total, 0);
      const pct = Math.round((good / total) * 100), passed = pct >= PASS;
      const now = new Date().toISOString();
      const progress: Progress = {
        ...prev,
        scores: { ...prev.scores, [stepId]: Math.max(pct, prev.scores[stepId] || 0) },
        attempts: { ...prev.attempts, [stepId]: (prev.attempts[stepId] || 0) + 1 },
        startedAt: prev.startedAt || now,
        finishedAt: prev.finishedAt || (step.kind === 'final' && (passed || sim) ? now : null),
        simulation: sim
      };
      s.progress[id] = { ...(s.progress[id] || {}), [courseId]: progress };
      save(s);
      return { pct, good, total, passed, best: progress.scores[stepId], modules, progress };
    },
    async issueCertificate(courseId) {
      await wait();
      const course = await serverCourse(courseId);
      const s = load(), me = current();
      if (!me) throw new ElearningError('Session expirée. Reconnectez-vous.');
      const prog = s.progress[me.uid]?.[courseId];
      if (prog?.certificate && s.certificates[prog.certificate]) return s.certificates[prog.certificate];
      const sim = isSim(courseId);
      if (!prog || !course.steps.every((x) => (sim ? prog.scores[x.id] !== undefined : (prog.scores[x.id] || 0) >= PASS))) throw new ElearningError('Toutes les étapes doivent être validées avec 80 % au moins');
      const profile = s.users[me.email].profile!;
      s.counter += 1;
      const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const rnd = () => Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
      const day = new Date().toISOString().slice(2, 10).replace(/-/g, '');
      const number = `${sim ? 'SP' : 'CX'}-${(course.code || courseId.slice(0, 3)).toUpperCase()}-${day}-${rnd()}-${rnd()}`;
      const chapters = course.steps.filter((x) => x.kind === 'chapitre');
      const values = course.steps.map((x) => prog.scores[x.id]);
      const cert = {
        uid: me.uid, number, courseId, courseTitle: course.certTitle,
        lastName: profile.nom, firstName: profile.prenom,
        startedAt: prog.startedAt!, finishedAt: prog.finishedAt!, issuedAt: new Date().toISOString(),
        average: Math.round(values.reduce((a, b) => a + b, 0) / values.length), hours: course.hours,
        simulation: sim,
        stats: {
          parts: course.steps.filter((x) => x.kind === 'examen').length,
          chapters: chapters.length,
          modules: chapters.reduce((n, x) => n + x.modules.length, 0),
          quizzes: chapters.reduce((n, x) => n + x.modules.reduce((a, m) => a + course.key[m].length, 0), 0)
        }
      };
      s.certificates[number] = cert;
      prog.certificate = number;
      save(s);
      return cert;
    },
    async getEnrollments() {
      const s = load(), me = current();
      return (me && s.enrollments?.[me.uid]) || {};
    },
    async enroll(courseId) {
      await wait();
      const s = load(), me = current();
      if (!me) throw new ElearningError('Session expirée. Reconnectez-vous.');
      s.enrollments = s.enrollments || {};
      s.enrollments[me.uid] = s.enrollments[me.uid] || {};
      const e = s.enrollments[me.uid][courseId] || { courseId, enrolledAt: new Date().toISOString() };
      s.enrollments[me.uid][courseId] = e;
      save(s);
      return e;
    },
    async getDraft(courseId) {
      const me = current();
      return me ? localDraft.get(me.uid, courseId) : null;
    },
    saveDraft(courseId, draft) {
      const me = current();
      if (me) localDraft.set(me.uid, courseId, draft);
    },
    async clearDraft(courseId) {
      const me = current();
      if (me) localDraft.clear(me.uid, courseId);
    },
    async verifyCertificate(number) {
      await wait();
      return load().certificates[number] || null;
    },
    async getCourseStatuses() {
      return mockStatuses();
    }
  };
}
