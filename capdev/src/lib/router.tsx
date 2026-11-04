import React, { useEffect, useSyncExternalStore } from 'react';
import { DEMO } from './demo';

// Minimal router: one address per tab (/institut, /publications…), history API, scroll restoration.

const listeners = new Set<() => void>();
// In the demonstration build the address lives in the hash: "/institut#mission" is written "#institut--mission"
const toHash = (to: string) => { const [p, h] = to.split('#'); const base = p.replace(/^\/+|\/+$/g, ''); return '#' + (base || 'accueil') + (h ? '--' + h : ''); };
const fromHash = () => { const raw = window.location.hash.slice(1); if (!raw) return '/'; const [p, h] = raw.split('--'); return '/' + (p === 'accueil' ? '' : p) + (h ? '#' + h : ''); };
const EVT = DEMO ? 'hashchange' : 'popstate';
const subscribe = (fn: () => void) => { listeners.add(fn); window.addEventListener(EVT, fn); return () => { listeners.delete(fn); window.removeEventListener(EVT, fn); }; };
const snapshot = () => (DEMO ? fromHash() : window.location.pathname + window.location.hash);
export const hrefFor = (to: string) => (DEMO ? toHash(to) : to);

export function navigate(to: string) {
  if (to === snapshot()) return;
  if (DEMO) window.location.hash = toHash(to).slice(1);
  else window.history.pushState({}, '', to);
  listeners.forEach(fn => fn());
  const hash = to.split('#')[1];
  // A section named in the address is scrolled into view; a sub-tab (no such section) opens at the top
  const target = hash ? document.getElementById(hash) : null;
  if (hash && target) requestAnimationFrame(() => setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350));
  else if (hash) requestAnimationFrame(() => setTimeout(() => { const el = document.getElementById(hash); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }, 60));
  else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

export function useLocation() {
  const loc = useSyncExternalStore(subscribe, snapshot);
  const [path, hash = ''] = loc.split('#');
  return { path: path.replace(/\/+$/, '') || '/', hash };
}

export function Link({ to, children, onClick, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return (
    <a
      href={hrefFor(to)}
      {...rest}
      onClick={e => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

export function useDocumentTitle(title: string) {
  useEffect(() => { document.title = title; }, [title]);
}
