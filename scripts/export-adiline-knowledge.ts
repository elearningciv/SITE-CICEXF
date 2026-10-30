// Exporte la base de connaissances du site (src/) en JSON pour l'assistante ADILINE
// (fonction Firebase `adilineChat`). À relancer après toute modification des données du site :
//   npx tsx scripts/export-adiline-knowledge.ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CABINET_INFO,
  FORMATIONS,
  DOMAINS_INTERVENTION,
  TEAM_MEMBERS,
  PROJECTS,
  BLOG_POSTS,
  TESTIMONIALS,
  PARTNERS,
  GLOBAL_FAQ
} from '../src/knowledgeBase';
import { ACCOMPANIMENT_ENRICHMENTS } from '../src/data/accompanimentEnrichments';

// Images, icônes et liens d'avatars n'apportent rien à l'assistante : on les retire
const DROP_KEYS = new Set(['featuredImage', 'imageUrl', 'iconName', 'avatarUrl', 'logoUrl', 'icon', 'iconUrl', 'image']);
const strip = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([k]) => !DROP_KEYS.has(k))
        .map(([k, v]) => [k, strip(v)])
    );
  }
  return value;
};

const knowledge = strip({
  exportedAt: new Date().toISOString(),
  cabinet: CABINET_INFO,
  formations: FORMATIONS,
  accompagnements: DOMAINS_INTERVENTION,
  accompagnementsDetails: ACCOMPANIMENT_ENRICHMENTS,
  equipe: TEAM_MEMBERS,
  realisations: PROJECTS,
  actualites: BLOG_POSTS,
  temoignages: TESTIMONIALS,
  partenaires: PARTNERS,
  faq: GLOBAL_FAQ
});

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../functions/knowledge/static.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(knowledge, null, 1), 'utf8');
console.log(`Base de connaissances exportée : ${out} (${Math.round(JSON.stringify(knowledge).length / 1024)} Ko)`);
