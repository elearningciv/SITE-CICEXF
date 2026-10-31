import { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Training catalogue (PDF) uploaded from the admin console.
 *
 * Firestore documents are limited to 1 MiB, so the file is stored base64-encoded in
 * several "chunk" documents next to a small metadata document, all in app_settings
 * (public read, admin-only write in firestore.rules). No extra Firebase product needed.
 */
export interface CatalogueMeta {
  name: string;
  size: number;
  mimeType: string;
  chunkCount: number;
  version: number;
  updatedAt: string;
}

export const MAX_CATALOGUE_BYTES = 15 * 1024 * 1024;
const CHUNK_CHARS = 700_000; // ~700 KB of base64 per document, well under the 1 MiB limit
const META_REF = () => doc(db, 'app_settings', 'catalogue');
const CHUNK_REF = (i: number) => doc(db, 'app_settings', `catalogue_chunk_${i}`);

export function useCatalogueMeta(): { meta: CatalogueMeta | null; loading: boolean } {
  const [state, setState] = useState<{ meta: CatalogueMeta | null; loading: boolean }>({ meta: null, loading: true });
  useEffect(() => onSnapshot(
    META_REF(),
    (snap) => {
      const data = snap.data() as CatalogueMeta | undefined;
      setState({ meta: data && data.chunkCount > 0 ? data : null, loading: false });
    },
    (err) => { console.error('Catalogue sync error:', err); setState({ meta: null, loading: false }); }
  ), []);
  return state;
}

export async function getCatalogueMeta(): Promise<CatalogueMeta | null> {
  const snap = await getDoc(META_REF());
  const data = snap.data() as CatalogueMeta | undefined;
  return data && data.chunkCount > 0 ? data : null;
}

const readAsBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(reader.error);
  reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
  reader.readAsDataURL(file);
});

export async function uploadCatalogue(file: File, onProgress?: (percent: number) => void): Promise<void> {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Le fichier doit être un PDF.');
  }
  if (file.size > MAX_CATALOGUE_BYTES) {
    throw new Error('Le PDF dépasse 15 Mo. Compressez-le (par ex. avec ilovepdf.com) puis réessayez.');
  }
  const previous = await getCatalogueMeta();
  const base64 = await readAsBase64(file);
  const chunkCount = Math.ceil(base64.length / CHUNK_CHARS);
  for (let i = 0; i < chunkCount; i++) {
    await setDoc(CHUNK_REF(i), { data: base64.slice(i * CHUNK_CHARS, (i + 1) * CHUNK_CHARS) });
    onProgress?.(Math.round(((i + 1) / chunkCount) * 100));
  }
  await setDoc(META_REF(), {
    name: file.name,
    size: file.size,
    mimeType: 'application/pdf',
    chunkCount,
    version: (previous?.version || 0) + 1,
    updatedAt: new Date().toISOString()
  } satisfies CatalogueMeta);
  // Remove the leftover pieces of a bigger previous file
  for (let i = chunkCount; i < (previous?.chunkCount || 0); i++) await deleteDoc(CHUNK_REF(i));
}

export async function deleteCatalogue(): Promise<void> {
  const previous = await getCatalogueMeta();
  await setDoc(META_REF(), { chunkCount: 0, name: '', size: 0, mimeType: '', version: (previous?.version || 0) + 1, updatedAt: new Date().toISOString() });
  for (let i = 0; i < (previous?.chunkCount || 0); i++) await deleteDoc(CHUNK_REF(i));
}

// The assembled file is kept in memory per version, so opening it twice costs one download
let cache: { version: number; blob: Blob } | null = null;

export async function loadCatalogueBlob(meta: CatalogueMeta): Promise<Blob> {
  if (cache && cache.version === meta.version) return cache.blob;
  const parts = await Promise.all(
    Array.from({ length: meta.chunkCount }, (_, i) => getDoc(CHUNK_REF(i)).then(s => (s.data()?.data as string) || ''))
  );
  const binary = atob(parts.join(''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  cache = { version: meta.version, blob };
  return blob;
}

/** Opens the PDF in a new tab (the browser's built-in viewer) */
export async function openCatalogue(meta: CatalogueMeta, win?: Window | null): Promise<void> {
  const url = URL.createObjectURL(await loadCatalogueBlob(meta));
  if (win) win.location.href = url; else window.open(url, '_blank', 'noopener');
}

/** Saves the PDF on the visitor's device */
export async function downloadCatalogue(meta: CatalogueMeta): Promise<void> {
  const url = URL.createObjectURL(await loadCatalogueBlob(meta));
  const a = document.createElement('a');
  a.href = url;
  a.download = meta.name || 'Catalogue-CICEXF.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo` : `${Math.max(1, Math.round(bytes / 1024))} Ko`;

/**
 * Shareable links: /catalogue?action=ouvrir shows the PDF in the visitor's browser,
 * /catalogue?action=telecharger saves it. The Catalogue page runs the action on arrival.
 */
export type CatalogueLinkAction = 'ouvrir' | 'telecharger';
export const catalogueLink = (action: CatalogueLinkAction) => `${window.location.origin}/catalogue?action=${action}`;

/** Shows the PDF in the current tab (used when arriving from a shared "open" link) */
export async function openCatalogueHere(meta: CatalogueMeta): Promise<void> {
  window.location.href = URL.createObjectURL(await loadCatalogueBlob(meta));
}
