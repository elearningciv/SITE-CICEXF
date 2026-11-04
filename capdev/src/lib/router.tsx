import React, { useEffect, useSyncExternalStore } from 'react';

// Minimal router: one address per tab (/institut, /publications…), history API, scroll restoration.

const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => { listeners.add(fn); window.addEventListener('popstate', fn); return () => { listeners.delete(fn); window.removeEventListener('popstate', fn); }; };
const snapshot = () => window.location.pathname + window.location.hash;

export function navigate(to: string) {
  if (to === snapshot()) return;
  window.history.pushState({}, '', to);
  listeners.forEach(fn => fn());
  const hash = to.split('#')[1];
  if (hash) requestAnimationFrame(() => setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350));
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
      href={to}
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
