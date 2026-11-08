// Builds an e-learning course from its authoring files (window.COURSE / window.CONTENT scripts).
// Produces two files:
//  - src/data/elearning/<course>.json : everything the learner sees, WITHOUT the correct answers;
//  - functions/elearning/keys/<course>.json : the answer key, read only by the Cloud Function.
// Answers are reordered with a fixed seed so that their position in the public file says nothing.
// The answer key is not committed (see .gitignore): it is deployed with the function only.
//
// Usage: node scripts/build-elearning-course.mjs <authoring folder>
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const dir = process.argv[2] || 'maquettes/e-learning';
const files = fs.readdirSync(dir).filter((f) => /^contenu-.*\.js$/.test(f)).sort((a, b) => {
  // contenu-<course>.js first, then its parts, then the exams
  const rank = (f) => (f.includes('examens') ? 2 : f.split('-').length > 2 ? 1 : 0);
  return rank(a) - rank(b) || a.localeCompare(b);
});
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of files) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), sandbox, { filename: f });
const { COURSE, CONTENT } = sandbox.window;
if (!COURSE || !CONTENT) throw new Error('COURSE ou CONTENT introuvable');

// Deterministic shuffle (mulberry32)
let seed = 0x5eed2026;
const rand = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const permutation = (n) => {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx;
};

// Ordered path: chapters of each part, the part exam, then the final exam
const steps = [];
for (const p of COURSE.parts) {
  for (const c of p.chapters) steps.push({ id: c.id, kind: 'chapitre', part: p.id, title: c.title, modules: c.modules });
  const title = 'Examen de la ' + p.title.split(' : ')[0].toLowerCase();
  steps.push({ id: p.id + 'E', kind: 'examen', part: p.id, title, modules: [{ id: p.id + 'E', title, minutes: 20 }] });
}
steps.push({ id: 'FINAL', kind: 'final', part: null, title: 'Examen final de certification', modules: [{ id: 'FINAL', title: 'Examen final de certification', minutes: 40 }] });

const modules = {};
const key = {};
let questions = 0;
for (const s of steps) {
  for (const m of s.modules) {
    const C = CONTENT[m.id];
    if (!C) throw new Error(`Contenu manquant : ${m.id}`);
    key[m.id] = [];
    modules[m.id] = {
      objectives: C.objectives || [],
      text: C.text || '',
      quizzes: C.quizzes.map((z) => {
        const goods = [];
        const qs = z.questions.map((q) => {
          if (!(q.good >= 0 && q.good < q.answers.length)) throw new Error(`Bonne réponse invalide : ${m.id} / ${q.question}`);
          const perm = permutation(q.answers.length);
          goods.push(perm.indexOf(q.good));
          questions++;
          return { question: q.question, answers: perm.map((i) => q.answers[i]) };
        });
        key[m.id].push(goods);
        return { title: z.title, questions: qs };
      })
    };
  }
}

const course = {
  id: COURSE.id,
  title: COURSE.title,
  certTitle: COURSE.certTitle,
  domain: COURSE.domain,
  summary: COURSE.summary || "Lire une carte, maîtriser les coordonnées, analyser l'espace et produire des cartes professionnelles avec QGIS.",
  parts: COURSE.parts.map((p) => ({ id: p.id, title: p.title })),
  steps,
  modules
};
const minutes = steps.flatMap((s) => s.modules).reduce((n, m) => n + m.minutes, 0);
const server = {
  id: COURSE.id,
  certTitle: COURSE.certTitle,
  hours: Math.round(minutes / 60),
  steps: steps.map((s) => ({ id: s.id, kind: s.kind, modules: s.modules.map((m) => m.id) })),
  key
};

const out1 = path.join('src', 'data', 'elearning', `${COURSE.id}.json`);
const out2 = path.join('functions', 'elearning', 'keys', `${COURSE.id}.json`);
fs.mkdirSync(path.dirname(out1), { recursive: true });
fs.mkdirSync(path.dirname(out2), { recursive: true });
fs.writeFileSync(out1, JSON.stringify(course));
fs.writeFileSync(out2, JSON.stringify(server));
const positions = Object.values(key).flat(2).reduce((a, g) => ((a[g] = (a[g] || 0) + 1), a), {});
console.log(`${COURSE.id} : ${steps.length} étapes, ${Object.keys(modules).length} modules, ${questions} questions, ${Math.round(minutes / 60)} h`);
console.log('Position des bonnes réponses :', positions);
console.log(`→ ${out1} (${(fs.statSync(out1).size / 1024).toFixed(0)} Ko)\n→ ${out2}`);
