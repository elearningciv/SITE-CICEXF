// Demonstration mode (VITE_DEMO=1): the whole site runs in the browser, without the server.
// Content starts from the seed; admin changes are kept in this browser only.
import { SEED } from '../../server/seed';
import { offlineAnswer } from '../../server/offline';
import { COLLECTIONS, type Content, type Session } from '../types';

export const DEMO = import.meta.env.VITE_DEMO === '1';
const KEY = 'capdev_demo_content';
const DEMO_EMAIL = 'admin@capdev.local';
const DEMO_PASSWORD = 'capdev-admin';

let store: Content | null = null;
function load(): Content {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...structuredClone(SEED), ...JSON.parse(raw) }; } catch { /* storage blocked */ }
  return structuredClone(SEED);
}
let session: Session = { admin: false };

const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch { /* storage blocked */ } };
const save = (next: Content) => { store = { ...next, updatedAt: new Date().toISOString() }; persist(); return store; };
const fail = (msg: string) => { throw new Error(msg); };

export async function demoRequest(method: string, url: string, body: any): Promise<unknown> {
  await new Promise(r => setTimeout(r, 180));
  const content = (store ||= load());
  const path = url.replace(/\?.*$/, '');
  if (path === '/api/content') return content;
  if (path === '/api/session') return session;
  if (path === '/api/login') {
    if (String(body?.email).trim().toLowerCase() === DEMO_EMAIL && body?.password === DEMO_PASSWORD) return (session = { admin: true, email: DEMO_EMAIL });
    return fail('Adresse e-mail ou mot de passe incorrect.');
  }
  if (path === '/api/logout') return (session = { admin: false });
  if (path === '/api/messages') return fail('Version de démonstration : les formulaires seront actifs sur le site en ligne.');
  if (path === '/api/assistant') {
    await new Promise(r => setTimeout(r, 500));
    return { answer: offlineAnswer(content, String(body?.message || ''), body?.lang || 'fr'), conversationId: body?.conversationId || 'demo', source: 'local' };
  }
  if (!path.startsWith('/api/admin/')) return fail('Route inconnue.');
  if (!session.admin) return fail('Connexion administrateur requise.');
  const p = path.slice('/api/admin/'.length);
  if (p === 'status') return { ai: false };
  if (p === 'inbox' || p === 'conversations') return [];
  if (p === 'settings') {
    const s = { ...content.settings, ...body };
    if (Array.isArray(body?.languages)) s.languages = ['fr', ...body.languages.filter((l: string) => l !== 'fr')];
    for (const l of s.languages) if (l !== 'fr') content.translations[l] ||= {};
    return save({ ...content, settings: s });
  }
  if (p.startsWith('collection/')) {
    const name = p.split('/')[1] as (typeof COLLECTIONS)[number];
    if (!COLLECTIONS.includes(name)) return fail('Rubrique inconnue.');
    const items = (body?.items || []).map((it: Record<string, string>) => ({ ...it, id: it.id || `${name.slice(0, 3)}-${Math.random().toString(36).slice(2, 8)}` }));
    return save({ ...content, [name]: items } as Content);
  }
  if (p.startsWith('translations/')) return save({ ...content, translations: { ...content.translations, [p.split('/')[1]]: body?.map || {} } });
  if (p === 'translate') return fail("Version de démonstration : la traduction automatique sera active sur le site en ligne avec la clé Gemini. Vous pouvez traduire à la main.");
  if (p === 'upload') return { url: body?.dataUrl };
  if (method === 'PATCH' || method === 'DELETE') return { ok: true };
  return fail('Route inconnue.');
}
