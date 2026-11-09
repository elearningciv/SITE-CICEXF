// E-learning CICEXF : correction des chapitres et examens, progression et délivrance des certificats.
// Les bonnes réponses restent ici (elearning/keys/*.json, non publiées) : le navigateur n'envoie que
// les choix de l'apprenant, et seule cette fonction écrit la progression et les certificats.
const { onRequest } = require('firebase-functions/v2/https');
const { logger } = require('firebase-functions');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATABASE_ID = 'ai-studio-cicexfcabinetint-be0c0f21-7527-4112-ae7f-82c61d321a9c';
const ALLOWED_ORIGINS = ['https://cicexf.com', 'https://www.cicexf.com', 'https://cicexf.gestionsaas.org', 'http://localhost:3000', 'http://localhost:5173'];
const PASS = 80;

if (!getApps().length) initializeApp();
const db = getFirestore(DATABASE_ID);

// Clés de correction, chargées une fois par instance
const KEYS = {};
const keysDir = path.join(__dirname, 'elearning', 'keys');
if (fs.existsSync(keysDir)) {
  for (const f of fs.readdirSync(keysDir).filter((x) => x.endsWith('.json'))) {
    const k = JSON.parse(fs.readFileSync(path.join(keysDir, f), 'utf8'));
    KEYS[k.id] = k;
  }
}

// Mode simulation (temporaire) : pour les comptes et parcours listés dans elearning/simulation.json
// (fichier non publié), les étapes se débloquent dès qu'elles ont été tentées, même sous 80 %,
// et le certificat délivré est un spécimen à numérotation de test, sans valeur officielle.
let SIMULATION = { emails: [], courses: [] };
const simFile = path.join(__dirname, 'elearning', 'simulation.json');
if (fs.existsSync(simFile)) SIMULATION = { emails: [], courses: [], ...JSON.parse(fs.readFileSync(simFile, 'utf8')) };
const isSimulation = (email, courseId) =>
  !!email && SIMULATION.emails.map((e) => e.toLowerCase()).includes(String(email).toLowerCase()) && SIMULATION.courses.includes(courseId);
// Comptes de contrôle (administrateurs, liste non publiée elearning/reviewers.json) : toutes les étapes
// et toutes les certifications, même fermées, sont accessibles sans la condition des 80 % ; leurs résultats
// sont marqués comme simulation et un éventuel certificat est un spécimen. Ils peuvent aussi voir les corrigés.
let REVIEWERS = [];
const reviewersFile = path.join(__dirname, 'elearning', 'reviewers.json');
if (fs.existsSync(reviewersFile)) REVIEWERS = (JSON.parse(fs.readFileSync(reviewersFile, 'utf8')).emails || []).map((e) => String(e).toLowerCase());
const isReviewer = (email) => !!email && REVIEWERS.includes(String(email).toLowerCase());
// Étape franchie : 80 % au moins, ou simplement tentée en mode simulation
const cleared = (scores, stepId, sim) => (sim ? scores[stepId] !== undefined : (scores[stepId] || 0) >= PASS);

const hits = new Map();
function rateLimited(uid, max = 60) {
  const now = Date.now();
  const list = (hits.get(uid) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(uid, list);
  return list.length > max;
}

const progressRef = (uid, courseId) => db.doc(`learners/${uid}/progress/${courseId}`);

// Ouverture des certifications : choisie par l'administrateur (elearning_courses/{id}), sinon valeur par défaut du parcours
async function courseStatus(course) {
  const snap = await db.doc(`elearning_courses/${course.id}`).get();
  const chosen = snap.exists ? snap.data().status : null;
  return ['open', 'closed', 'deleted'].includes(chosen) ? chosen : course.defaultStatus || 'open';
}

// Numéro de certificat : CX-<code du parcours>-<AAMMJJ>-XXXX-XXXX, 8 caractères tirés au hasard
// (alphabet sans 0/O ni 1/I), donc impossible à deviner ; SP- pour les spécimens de simulation.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const randomBlock = () => Array.from({ length: 4 }, () => ALPHABET[crypto.randomInt(ALPHABET.length)]).join('');
function courseCode(course) {
  if (course.code) return course.code;
  const w = course.id.toUpperCase().split('-');
  return w.length >= 3 ? w.slice(0, 3).map((x) => x[0]).join('') : w.length === 2 ? w[0][0] + w[1].slice(0, 2) : w[0].slice(0, 3);
}
function certificateNumber(course, sim) {
  const day = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // AAMMJJ (heure d'Abidjan = UTC)
  return `${sim ? 'SP' : 'CX'}-${courseCode(course)}-${day}-${randomBlock()}-${randomBlock()}`;
}
const isOpen = (course, scores, index, sim) => course.steps.slice(0, index).every((s) => cleared(scores, s.id, sim));

// Note d'une étape : bonnes réponses par module puis pour l'ensemble
function grade(course, step, answers) {
  const modules = step.modules.map((modId) => {
    const key = course.key[modId];
    const given = (answers && answers[modId]) || [];
    let good = 0, total = 0;
    key.forEach((quiz, qi) => quiz.forEach((g, k) => {
      total++;
      if (Array.isArray(given[qi]) && given[qi][k] === g) good++;
    }));
    return { id: modId, good, total, pct: Math.round((good / total) * 100) };
  });
  const good = modules.reduce((n, m) => n + m.good, 0);
  const total = modules.reduce((n, m) => n + m.total, 0);
  return { modules, good, total, pct: Math.round((good / total) * 100) };
}

const toIso = (v) => (v && typeof v.toDate === 'function' ? v.toDate().toISOString() : v || null);
const publicProgress = (d) => (d ? {
  scores: d.scores || {},
  attempts: d.attempts || {},
  startedAt: toIso(d.startedAt),
  finishedAt: toIso(d.finishedAt),
  certificate: d.certificate || null,
  simulation: !!d.simulation
} : { scores: {}, attempts: {}, startedAt: null, finishedAt: null, certificate: null, simulation: false });

async function handleGrade(uid, email, body) {
  const course = KEYS[body.courseId];
  const reviewer = isReviewer(email);
  const sim = reviewer || isSimulation(email, body.courseId);
  if (!course) return [404, { error: 'Parcours introuvable' }];
  const status = await courseStatus(course);
  if (status !== 'open' && !reviewer) return [403, { error: status === 'deleted' ? "Cette certification n'est plus disponible." : 'Cette certification est momentanément fermée. Votre progression est conservée.' }];
  const index = course.steps.findIndex((s) => s.id === body.stepId);
  if (index < 0) return [404, { error: 'Étape introuvable' }];
  const step = course.steps[index];

  const learner = await db.doc(`learners/${uid}`).get();
  if (!learner.exists) return [403, { error: 'Compte apprenant incomplet' }];

  return db.runTransaction(async (tx) => {
    const ref = progressRef(uid, course.id);
    const snap = await tx.get(ref);
    const prev = snap.exists ? snap.data() : {};
    const scores = prev.scores || {};
    if (!reviewer && !isOpen(course, scores, index, sim)) return [403, { error: 'Cette étape n’est pas encore débloquée' }];

    const result = grade(course, step, body.answers);
    const best = Math.max(result.pct, scores[step.id] || 0);
    const passed = result.pct >= PASS;
    const now = Timestamp.now();
    const update = {
      courseId: course.id,
      scores: { ...scores, [step.id]: best },
      attempts: { ...(prev.attempts || {}), [step.id]: ((prev.attempts || {})[step.id] || 0) + 1 },
      lastScores: { ...(prev.lastScores || {}), [step.id]: result.pct },
      startedAt: prev.startedAt || now,
      updatedAt: now,
      simulation: sim
    };
    if (step.kind === 'final' && (passed || sim) && !prev.finishedAt) update.finishedAt = now;
    tx.set(ref, update, { merge: true });
    return [200, { ...result, passed, best, progress: publicProgress({ ...prev, ...update }) }];
  });
}

async function handleCertificate(uid, email, courseId) {
    const course = KEYS[courseId];
    const reviewer = isReviewer(email);
    const sim = reviewer || isSimulation(email, courseId);
    if (!course) return [404, { error: 'Parcours introuvable' }];
    const learnerSnap = await db.doc(`learners/${uid}`).get();
    if (!learnerSnap.exists) return [403, { error: 'Compte apprenant incomplet' }];
    const learner = learnerSnap.data();

    return db.runTransaction(async (tx) => {
      const ref = progressRef(uid, course.id);
      const snap = await tx.get(ref);
      const prog = snap.exists ? snap.data() : {};
      if (prog.certificate) {
        const cert = await tx.get(db.doc(`certificates/${prog.certificate}`));
        if (cert.exists) return [200, { certificate: serializeCertificate(cert.data()) }];
      }
      const scores = prog.scores || {};
      if (reviewer ? scores.FINAL === undefined : !course.steps.every((s) => cleared(scores, s.id, sim))) {
        return [403, { error: sim ? 'Toutes les étapes doivent avoir été passées' : 'Toutes les étapes doivent être validées avec 80 % au moins' }];
      }

      // Numéro aléatoire, vérifié comme inédit (les spécimens de simulation commencent par SP-)
      let number = null;
      for (let i = 0; i < 5 && !number; i++) {
        const candidate = certificateNumber(course, sim);
        if (!(await tx.get(db.doc(`certificates/${candidate}`))).exists) number = candidate;
      }
      if (!number) throw new Error('Numéro de certificat indisponible');
      const values = course.steps.map((s) => scores[s.id]);
      const now = Timestamp.now();
      const cert = {
        number,
        uid,
        courseId: course.id,
        courseTitle: course.certTitle,
        lastName: String(learner.nom || '').trim(),
        firstName: String(learner.prenom || '').trim(),
        email: learner.email || null,
        startedAt: prog.startedAt || now,
        finishedAt: prog.finishedAt || now,
        issuedAt: now,
        average: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
        hours: course.hours,
        stats: certificateStats(course),
        simulation: sim
      };
      tx.set(db.doc(`certificates/${number}`), cert);
      tx.set(ref, { certificate: number }, { merge: true });
      return [200, { certificate: serializeCertificate(cert) }];
    });
}

// Corrigé d'un parcours, réservé aux comptes de contrôle (index des bonnes réponses dans l'ordre du fichier public)
function handleReview(email, courseId) {
  if (!isReviewer(email)) return [403, { error: 'Accès réservé aux administrateurs' }];
  const course = KEYS[courseId];
  if (!course) return [404, { error: 'Parcours introuvable' }];
  return [200, { key: course.key }];
}

function certificateStats(course) {
  const chapters = course.steps.filter((s) => s.kind === 'chapitre');
  const parts = course.parts ?? course.steps.filter((s) => s.kind === 'examen').length;
  const modules = chapters.reduce((n, s) => n + s.modules.length, 0);
  const quizzes = chapters.reduce((n, s) => n + s.modules.reduce((a, m) => a + course.key[m].length, 0), 0);
  return { parts, chapters: chapters.length, modules, quizzes };
}

function serializeCertificate(c) {
  return {
    number: c.number,
    courseId: c.courseId,
    courseTitle: c.courseTitle,
    lastName: c.lastName,
    firstName: c.firstName,
    startedAt: toIso(c.startedAt),
    finishedAt: toIso(c.finishedAt),
    issuedAt: toIso(c.issuedAt),
    average: c.average,
    hours: c.hours,
    stats: c.stats,
    simulation: !!c.simulation
  };
}

exports.elearning = onRequest(
  { region: 'europe-west1', invoker: 'public', timeoutSeconds: 30, memory: '256MiB', maxInstances: 5, concurrency: 40 },
  async (req, res) => {
    const origin = req.get('origin');
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Vary', 'Origin');
    }
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(204).send('');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
    if (origin && !ALLOWED_ORIGINS.includes(origin)) return res.status(403).json({ error: 'Origine non autorisée' });

    // Apprenant connecté : jeton Firebase Auth obligatoire
    const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
    let uid, email;
    try {
      ({ uid, email } = await getAuth().verifyIdToken(token));
    } catch {
      return res.status(401).json({ error: 'Session expirée. Reconnectez-vous.' });
    }
    if (rateLimited(uid)) return res.status(429).json({ error: 'Trop de requêtes. Patientez quelques minutes.' });

    const body = req.body || {};
    try {
      let out;
      if (body.action === 'grade') out = await handleGrade(uid, email, body);
      else if (body.action === 'certificate') out = await handleCertificate(uid, email, body.courseId);
      else if (body.action === 'review') out = handleReview(email, body.courseId);
      else out = [400, { error: 'Action inconnue' }];
      return res.status(out[0]).json(out[1]);
    } catch (err) {
      logger.error('E-learning', { action: body.action, error: err.message });
      return res.status(500).json({ error: 'Opération impossible pour le moment. Réessayez.' });
    }
  }
);

exports.grade = grade;
