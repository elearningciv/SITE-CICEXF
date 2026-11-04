import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Content, Session, PaletteId } from '../types';
import { api } from './api';
import { applyPalette } from './palettes';

export const LANGUAGES: Record<string, { label: string; short: string; dir?: 'rtl'; locale: string }> = {
  fr: { label: 'Français', short: 'FR', locale: 'fr-FR' },
  en: { label: 'English', short: 'EN', locale: 'en-GB' },
  es: { label: 'Español', short: 'ES', locale: 'es-ES' },
  pt: { label: 'Português', short: 'PT', locale: 'pt-PT' },
  ar: { label: 'العربية', short: 'AR', dir: 'rtl', locale: 'ar' },
  de: { label: 'Deutsch', short: 'DE', locale: 'de-DE' },
  it: { label: 'Italiano', short: 'IT', locale: 'it-IT' },
  zh: { label: '中文', short: 'ZH', locale: 'zh-CN' }
};

type Mode = 'light' | 'dark' | 'system';

interface SiteValue {
  content: Content | null;
  setContent: (c: Content) => void;
  session: Session;
  setSession: (s: Session) => void;
  lang: string;
  setLang: (l: string) => void;
  /** Translates a French source text into the visitor's language (falls back to French) */
  t: (fr: string) => string;
  fmtDate: (iso: string, opts?: Intl.DateTimeFormatOptions) => string;
  mode: Mode;
  setMode: (m: Mode) => void;
  isDark: boolean;
  /** Temporarily shows another palette (admin preview) without saving it */
  previewPalette: (id: PaletteId | null) => void;
  assistantOpen: boolean;
  openAssistant: (question?: string) => void;
  closeAssistant: () => void;
  pendingQuestion: string | null;
  consumeQuestion: () => void;
}

const SiteContext = createContext<SiteValue | null>(null);

const readPref = (k: string, d: string) => { try { return localStorage.getItem(k) || d; } catch { return d; } };
const writePref = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);
  const [session, setSession] = useState<Session>({ admin: false });
  const [lang, setLangState] = useState(() => readPref('capdev_lang', 'fr'));
  const [mode, setModeState] = useState<Mode>(() => readPref('capdev_mode', 'system') as Mode);
  const [systemDark, setSystemDark] = useState(() => {
    const forced = document.documentElement.getAttribute('data-theme');
    return forced ? forced === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [preview, setPreview] = useState<PaletteId | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  useEffect(() => {
    api.content().then(setContent).catch(() => setContent(null));
    api.session().then(setSession).catch(() => undefined);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const isDark = mode === 'dark' || (mode === 'system' && systemDark);
  const palette = preview || content?.settings.palette || 'lagune';
  useEffect(() => { applyPalette(palette, isDark); }, [palette, isDark]);

  // A language the admin has removed falls back to French
  const offered = content?.settings.languages || ['fr'];
  const activeLang = offered.includes(lang) ? lang : 'fr';
  useEffect(() => {
    document.documentElement.lang = activeLang;
    document.documentElement.dir = LANGUAGES[activeLang]?.dir || 'ltr';
  }, [activeLang]);

  const t = useCallback((fr: string) => {
    if (activeLang === 'fr' || !fr) return fr;
    return content?.translations?.[activeLang]?.[fr] || fr;
  }, [activeLang, content]);

  const fmtDate = useCallback((iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) => {
    if (!iso) return '';
    const d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(LANGUAGES[activeLang]?.locale || 'fr-FR', opts);
  }, [activeLang]);

  const value = useMemo<SiteValue>(() => ({
    content, setContent, session, setSession,
    lang: activeLang,
    setLang: l => { setLangState(l); writePref('capdev_lang', l); },
    t, fmtDate, mode,
    setMode: m => { setModeState(m); writePref('capdev_mode', m); },
    isDark,
    previewPalette: setPreview,
    assistantOpen,
    openAssistant: q => { setAssistantOpen(true); if (q) setPendingQuestion(q); },
    closeAssistant: () => setAssistantOpen(false),
    pendingQuestion,
    consumeQuestion: () => setPendingQuestion(null)
  }), [content, session, activeLang, t, fmtDate, mode, isDark, assistantOpen, pendingQuestion]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const v = useContext(SiteContext);
  if (!v) throw new Error('useSite outside SiteProvider');
  return v;
}
