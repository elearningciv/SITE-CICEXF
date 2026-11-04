// Collects every interface text written as t('…') or t("…") in src/,
// so the Administration › Traductions page can list them all.
import fs from 'node:fs';
import path from 'node:path';

const found = new Set();
const re = /\bt\(\s*(['"])((?:\\.|(?!\1).)*?)\1\s*[,)]/g;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'admin') walk(p); // the admin area stays in French
    } else if (/\.tsx?$/.test(entry.name)) {
      const src = fs.readFileSync(p, 'utf8');
      for (const m of src.matchAll(re)) found.add(m[2].replace(/\\(['"\\])/g, '$1'));
    }
  }
}

walk('src');
fs.writeFileSync('src/lib/uiStrings.json', JSON.stringify([...found].sort(), null, 1));
console.log(`[extract] ${found.size} textes d'interface`);
