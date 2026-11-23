// Prepares the correction of the practical work for the server (function elearning), so that the note of the
// practical work counted in the certificate is computed again from the saved answers, exactly as on the site:
//   - bundles src/lib/practiceScoreServer.ts (exercise data + correction) into functions/practice/score.cjs
// Run after any change to the practical work (exercises, criteria, correction), then redeploy `elearning`.
//   node scripts/build-practice-function.mjs
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'functions', 'practice');
mkdirSync(out, { recursive: true });

await build({
  entryPoints: [join(root, 'src', 'lib', 'practiceScoreServer.ts')],
  outfile: join(out, 'score.cjs'),
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  charset: 'utf8',
  banner: { js: '// Fichier généré par scripts/build-practice-function.mjs depuis src/lib/practiceScoreServer.ts : ne pas modifier.' },
  logLevel: 'warning'
});
console.log('functions/practice/score.cjs prêt');
