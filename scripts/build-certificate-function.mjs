// Prepares the certificate drawing for the server (function certificateMail), so that the PDF sent by
// e-mail is exactly the one learners download from the site:
//   - bundles src/lib/certificateDraw.ts into functions/certificate/draw.cjs
//   - copies the logo and the signature next to it
// Run after any change to the certificate design or images, then redeploy `certificateMail`.
//   node scripts/build-certificate-function.mjs
import { build } from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'functions', 'certificate');
mkdirSync(out, { recursive: true });

await build({
  entryPoints: [join(root, 'src', 'lib', 'certificateDraw.ts')],
  outfile: join(out, 'draw.cjs'),
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  charset: 'utf8',
  banner: { js: '// Fichier généré par scripts/build-certificate-function.mjs depuis src/lib/certificateDraw.ts : ne pas modifier.' },
  logLevel: 'warning'
});
copyFileSync(join(root, 'public', 'elearning', 'logo-cicexf.png'), join(out, 'logo-cicexf.png'));
copyFileSync(join(root, 'public', 'elearning', 'signature.png'), join(out, 'signature.png'));
console.log('functions/certificate prêt (draw.cjs, logo-cicexf.png, signature.png)');
