import React, { Suspense, lazy, useEffect } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import Header from './components/Header';
import { Footer } from './components/Common';
import Assistant from './components/Assistant';
import { SiteProvider, useSite } from './lib/site';
import { navigate, useLocation } from './lib/router';
import { NAV, ALIASES } from './lib/nav';
import { api } from './lib/api';
import Home from './pages/Home';
import { Institut, Formations, Contact, NotFound } from './pages/Sections';
import Galerie from './pages/Galerie';
import { Publications, Expertise, Actualites } from './pages/Merged';
import Login from './pages/Login';
import { EASE } from './components/Motion';

// The admin area is only downloaded by the administrator
const Admin = lazy(() => import('./admin/Admin'));

const PAGES: Record<string, React.ComponentType> = {
  '/': Home, '/institut': Institut, '/galerie': Galerie, '/publications': Publications,
  '/accompagnement': Formations, '/expertise': Expertise, '/actualites': Actualites, '/contact': Contact,
  '/connexion': Login
};

function Shell() {
  const { content, session, t } = useSite();
  const { path, hash } = useLocation();
  const isAdmin = path === '/admin';

  // Former addresses of merged tabs
  useEffect(() => { if (ALIASES[path]) navigate(ALIASES[path]); }, [path]);

  // /admin without an admin session goes to the login page
  useEffect(() => { if (isAdmin && content && !session.admin) { api.session().then(s => { if (!s.admin) navigate('/connexion'); }); } }, [isAdmin, session.admin, content]);

  useEffect(() => {
    const tab = NAV.find(n => n.path === path);
    const name = content?.settings.siteName || 'CapDev';
    document.title = isAdmin ? `Administration · ${name}` : tab ? `${t(tab.label)} · ${name}` : `${name} · ${t(content?.settings.fullName || '')}`;
  }, [path, content, t, isAdmin]);

  // Scroll to the section named in the address once the page is drawn
  useEffect(() => { if (hash && !isAdmin) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 500); }, [path]);

  if (!content) {
    return <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', background: 'var(--deep)' }}><motion.div style={{ width: 48, height: 48, borderRadius: 12, border: '3px solid var(--accent)', borderTopColor: 'transparent' }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }} /></div>;
  }

  const Page = isAdmin || ALIASES[path] ? null : PAGES[path] || NotFound;
  return (
    <>
      <a href="#contenu" className="hp" style={{ position: 'absolute' }} onClick={e => { e.preventDefault(); document.getElementById('contenu')?.focus(); }}>{t('Aller au contenu')}</a>
      <Header />
      <AnimatePresence mode="wait">
        <motion.main id="contenu" tabIndex={-1} key={path} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
          {isAdmin ? (session.admin ? <Suspense fallback={null}><Admin /></Suspense> : null) : Page && <Page />}
        </motion.main>
      </AnimatePresence>
      {!isAdmin && <Footer />}
      {!isAdmin && <Assistant />}
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SiteProvider><Shell /></SiteProvider>
    </MotionConfig>
  );
}
