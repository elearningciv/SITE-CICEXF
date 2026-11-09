import { useEffect, useState } from 'react';
import type { Testimonial } from '../types';

/**
 * Public content of the site (formations, accompagnements, réalisations, actualités, partenaires,
 * témoignages, catalogue, état des certifications e-learning).
 *
 * Visitors never read the Firestore database for it: they read one copy kept up to date by the
 * `siteContent` Cloud Function (the database is limited to a small free daily read allowance,
 * counted by volume). The last copy received is kept on the device so that pages show it at once,
 * and the site falls back on its built-in content when the copy cannot be reached.
 */
export const SITE_CONTENT_URL = import.meta.env.VITE_SITE_CONTENT_URL
  || 'https://europe-west1-project-a93f5a0f-743d-4552-852.cloudfunctions.net/siteContent';

export interface PublicCatalogueMeta {
  name: string; size: number; mimeType: string; chunkCount: number; version: number; updatedAt: string;
}

export interface SiteContent {
  version: number;
  builtAt: string;
  formations: any[];
  accompagnements: any[];
  realisations: any[];
  blog_posts: any[];
  partners: any[];
  deleted: { formations: string[]; accompagnements: string[]; realisations: string[]; blog_posts: string[]; partners: string[] };
  testimonials: Testimonial[];
  catalogue: PublicCatalogueMeta | null;
  elearningCourses: Record<string, string>;
}

const CACHE_KEY = 'cicexf_site_content';

const isContent = (c: any): c is SiteContent =>
  !!c && typeof c === 'object' && Array.isArray(c.formations) && Array.isArray(c.blog_posts) && !!c.deleted;

/** Copy received during a previous visit (null if none) */
export function cachedSiteContent(): SiteContent | null {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    return isContent(c) ? c : null;
  } catch {
    return null;
  }
}

let current: SiteContent | null = null;
let pending: Promise<SiteContent | null> | null = null;
const listeners = new Set<(c: SiteContent) => void>();

async function fetchOnce(): Promise<SiteContent> {
  // Never leave a page waiting: give up after 10 seconds (the built-in or saved content stays shown)
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  const res = await fetch(`${SITE_CONTENT_URL}?content`, { headers: { Accept: 'application/json' }, signal: ctrl.signal })
    .finally(() => clearTimeout(timer));
  if (!res.ok) throw new Error(`Contenu indisponible (${res.status})`);
  const c = await res.json();
  if (!isContent(c)) throw new Error('Contenu illisible');
  return c;
}

/** Downloads the copy once per page load (two attempts). Resolves null if it cannot be reached. */
export function loadSiteContent(): Promise<SiteContent | null> {
  if (!pending) {
    pending = (async () => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const c = await fetchOnce();
          current = c;
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch { /* storage full or blocked */ }
          listeners.forEach((l) => l(c));
          return c;
        } catch (e) {
          if (attempt === 0) await new Promise((r) => setTimeout(r, 3000));
          else console.warn('Contenu du site :', (e as Error).message);
        }
      }
      return null;
    })();
  }
  return pending;
}

/** Latest copy available: the downloaded one, else the one kept on the device, then updated once downloaded */
export function useSiteContent(): SiteContent | null {
  const [content, setContent] = useState<SiteContent | null>(() => current || cachedSiteContent());
  useEffect(() => {
    listeners.add(setContent);
    loadSiteContent().then((c) => { if (c) setContent(c); });
    return () => { listeners.delete(setContent); };
  }, []);
  return content;
}
