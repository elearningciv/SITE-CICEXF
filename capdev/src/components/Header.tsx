import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { ChevronDown, Globe, Menu, Moon, Sun, SunMoon, X, ShieldCheck, Bot } from 'lucide-react';
import { Link, navigate, useLocation } from '../lib/router';
import { NAV } from '../lib/nav';
import { LANGUAGES, useSite } from '../lib/site';
import { EASE } from './Motion';

export function BrandMark({ className = 'brand-mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 42 42" aria-hidden="true">
      <rect width="42" height="42" rx="11" fill="var(--deep)" />
      <path d="M9 29 L16 21 L22 25 L32 12" fill="none" stroke="var(--accent)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="21" r="2.4" fill="var(--on-deep)" />
      <circle cx="22" cy="25" r="2.4" fill="var(--on-deep)" />
      <circle cx="32" cy="12" r="3.4" fill="var(--primary)" stroke="var(--on-deep)" strokeWidth="1.6" />
    </svg>
  );
}

export default function Header() {
  const { content, t, lang, setLang, mode, setMode, session, openAssistant } = useSite();
  const { path } = useLocation();
  const [drawer, setDrawer] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setDrawer(false); setLangOpen(false); }, [path]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setDrawer(false); setLangOpen(false); } };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const s = content?.settings;
  const languages = s?.languages || ['fr'];
  const activeTab = NAV.find(n => path.startsWith(n.path));
  const nextMode = mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system';
  const ModeIcon = mode === 'system' ? SunMoon : mode === 'light' ? Sun : Moon;
  const modeLabel = mode === 'system' ? t('Thème automatique') : mode === 'light' ? t('Thème clair') : t('Thème sombre');

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <div className="topbar">
        <div className="container">
          <span className="tagline">{t(s?.fullName || '')}</span>
          <div className="tools">
            {languages.length > 1 && (
              <div className="lang-menu">
                <button className="tool-btn" type="button" aria-expanded={langOpen} aria-haspopup="true" onClick={() => setLangOpen(v => !v)}>
                  <Globe /> {LANGUAGES[lang]?.short || lang.toUpperCase()} <ChevronDown style={{ width: 13 }} />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div className="lang-list" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                      {languages.map(l => (
                        <button key={l} type="button" aria-current={l === lang} onClick={() => { setLang(l); setLangOpen(false); }}>
                          <span>{LANGUAGES[l]?.label || l}</span><span className="mono">{LANGUAGES[l]?.short || l}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <button className="tool-btn" type="button" onClick={() => setMode(nextMode)} title={modeLabel} aria-label={modeLabel}>
              <ModeIcon />
            </button>
          </div>
        </div>
      </div>

      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="container bar">
          <Link to="/" className="brand" aria-label={`${s?.siteName || 'CapDev'}, ${t('Accueil')}`}>
            <BrandMark />
            <span><span className="brand-name">{s?.siteName || 'CapDev'}</span><span className="brand-sub">{t(s?.tagline || '')}</span></span>
          </Link>

          <nav className="nav" aria-label={t('Navigation principale')}>
            {NAV.map(tab => {
              const active = activeTab?.id === tab.id;
              const link = (
                <Link key={tab.id} to={tab.path} className={`nav-tab${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined}>
                  {t(tab.label)}{tab.subs && <ChevronDown className="nav-caret" />}
                  {active && <motion.span layoutId="nav-indicator" className="nav-indicator" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                </Link>
              );
              if (!tab.subs) return link;
              return (
                <div key={tab.id} className="nav-group">
                  {link}
                  <div className="nav-pop" role="menu">
                    {tab.subs.map(sub => <Link key={sub.to} to={sub.to} role="menuitem">{t(sub.label)}</Link>)}
                  </div>
                </div>
              );
            })}
            {session.admin && (
              <Link to="/admin" className={`nav-tab admin-tab${path.startsWith('/admin') ? ' active' : ''}`}>
                <ShieldCheck /> Administration
              </Link>
            )}
          </nav>

          {!path.startsWith('/admin') && <button className="btn btn-accent ask-btn" type="button" onClick={() => openAssistant()}>
            <Bot /> <span className="label"><span className="label-long">{t('Demander à')} </span>{s?.assistantName || 'Docteur'}</span>
          </button>}
          <button className="menu-toggle" type="button" aria-label={t('Ouvrir le menu')} onClick={() => setDrawer(true)}><Menu /></button>
        </div>

      </header>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="drawer-backdrop" onClick={() => setDrawer(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="drawer" role="dialog" aria-label={t('Menu')}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 36 }}>
              <div className="drawer-head">
                <Link to="/" className="brand"><BrandMark /><span className="brand-name">{s?.siteName}</span></Link>
                <button className="menu-toggle" style={{ display: 'inline-flex' }} type="button" aria-label={t('Fermer le menu')} onClick={() => setDrawer(false)}><X /></button>
              </div>
              <Link to="/" className="direct">{t('Accueil')}</Link>
              {NAV.map((tab, i) => (
                <motion.div key={tab.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i + 0.1, duration: 0.4, ease: EASE }}>
                  <Link to={tab.path} className="direct" aria-current={activeTab?.id === tab.id ? 'page' : undefined}>{t(tab.label)}</Link>
                  {tab.subs && <div className="drawer-subs">{tab.subs.map(sub => <Link key={sub.to} to={sub.to}>{t(sub.label)}</Link>)}</div>}
                </motion.div>
              ))}
              {session.admin && <Link to="/admin" className="direct" style={{ color: 'var(--primary)' }}>Administration</Link>}
              <button className="btn btn-accent" style={{ marginTop: 18, justifyContent: 'center' }} type="button" onClick={() => { setDrawer(false); openAssistant(); }}>
                <Bot /> {t('Demander à')} {s?.assistantName}
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export { navigate };
