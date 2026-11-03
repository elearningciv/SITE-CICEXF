/**
 * First barrier in front of /admin: a visitor sees no login form without the private link
 * (/admin#acces=...), which is remembered on the device. Only the SHA-256 of the key is in the code.
 * Data stays protected by Firebase Auth and firestore.rules, whatever happens here.
 */

const KEY_HASH = '2711624b5cfef64d117a842467b402bbb88ca9c05c5561ae50e6995b3f2ea642';
const GATE_KEY = 'cicexf_admin_gate';
const DEVICE_KEY = 'cicexf_admin_device';

export function hasAdminAccess(): boolean {
  try { return !!localStorage.getItem(GATE_KEY) || !!localStorage.getItem(DEVICE_KEY); } catch { return false; }
}

export function grantAdminAccess() {
  try { localStorage.setItem(GATE_KEY, '1'); } catch {}
}

export const hasAccessKeyInUrl = () => window.location.hash.startsWith('#acces=');

/** Checks the key of the private link, then removes it from the address bar */
export async function unlockAdminFromUrl(): Promise<boolean> {
  if (!hasAccessKeyInUrl()) return false;
  const candidate = window.location.hash.slice('#acces='.length);
  window.history.replaceState(null, '', window.location.pathname);
  try {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(candidate));
    const hex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    if (hex !== KEY_HASH) return false;
    grantAdminAccess();
    return true;
  } catch {
    return false;
  }
}
