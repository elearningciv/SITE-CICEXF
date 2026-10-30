import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import { isAuthorizedAdminEmail } from './lib/adminAuth';
import AdminLoginModal from './components/AdminLoginModal';
import adilineAvatar from './assets/images/adiline_avatar_1792359280949.webp';
import { trackVisit } from './lib/tracker';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { MessageSquare, ArrowUp, X, Sparkles, ChevronLeft, ChevronRight, Bot } from 'lucide-react';
import { FORMATIONS, DOMAINS_INTERVENTION, BLOG_POSTS, PARTNERS, PROJECTS } from './data';
import { Formation, DomainIntervention, Project, BlogPost } from './types';

const NAVIGATION_ORDER = [
  'home',
  'accompagnements',
  'formations',
  'news',
  'catalogue',
  'realisations',
  'contact'
];

const TAB_LABELS: Record<string, string> = {
  home: 'Accueil',
  about: 'Qui sommes-nous',
  accompagnements: 'Accompagnement',
  formations: 'Formations',
  realisations: 'Réalisations',
  news: 'Actualités',
  catalogue: 'Catalogue',
  contact: 'Contact'
};

// Each tab gets its own URL so pages can be shared, bookmarked and indexed
const TAB_PATHS: Record<string, string> = {
  home: '/',
  about: '/qui-sommes-nous',
  accompagnements: '/accompagnement',
  formations: '/formations',
  realisations: '/realisations',
  news: '/actualites',
  catalogue: '/catalogue',
  partners: '/partenaires',
  contact: '/contact',
  admin: '/admin'
};

const getTabFromPath = (pathname: string): string => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return Object.keys(TAB_PATHS).find(tab => TAB_PATHS[tab] === clean) || 'home';
};

// Secondary pages, the chatbot and the admin console are downloaded on demand
const About = lazy(() => import('./components/About'));
const Interventions = lazy(() => import('./components/Interventions'));
const Formations = lazy(() => import('./components/Formations'));
const Realisations = lazy(() => import('./components/Realisations'));
const Catalogue = lazy(() => import('./components/Catalogue'));
const News = lazy(() => import('./components/News'));
const Contact = lazy(() => import('./components/Contact'));
const Partners = lazy(() => import('./components/Partners'));
const AdilineChatbot = lazy(() => import('./components/AdilineChatbot'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

const PageLoader = ({ label = 'Chargement…' }: { label?: string }) => (
  <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-500">{label}</div>
);

// Remove legacy client-side admin sessions (admin access now relies on Firebase Auth only)
try {
  localStorage.removeItem('cicexf_admin_session');
  localStorage.removeItem('cicexf_admin_explicit_logout');
  sessionStorage.removeItem('cicexf_admin_session');
} catch (e) {}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(() => getTabFromPath(window.location.pathname));
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [preselectedDomain, setPreselectedDomain] = useState<string>('Consultance');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [hasOpenedAssistant, setHasOpenedAssistant] = useState<boolean>(false);
  useEffect(() => {
    if (isAiModalOpen) setHasOpenedAssistant(true);
  }, [isAiModalOpen]);

  // Any part of the site can open the conversation with ADILINE
  useEffect(() => {
    const open = () => setIsAiModalOpen(true);
    window.addEventListener('cicexf:open-adiline', open);
    return () => window.removeEventListener('cicexf:open-adiline', open);
  }, []);
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  
  // Helper to read cached deleted items instantly (prevents flicker of deleted static items)
  const getInitialDeletedMap = () => {
    try {
      const raw = localStorage.getItem('cicexf_deleted_items');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { formations: [], accompagnements: [], realisations: [], blog_posts: [], partners: [] };
  };

  const initialDeletedMap = getInitialDeletedMap();

  // Real-time synced content states
  const [formations, setFormations] = useState<any[]>(() => FORMATIONS.filter(f => !initialDeletedMap.formations.includes(f.id)));
  const [accompagnements, setAccompagnements] = useState<any[]>(() => DOMAINS_INTERVENTION.filter(d => !initialDeletedMap.accompagnements.includes(d.id)));
  const [realisations, setRealisations] = useState<any[]>(() => PROJECTS.filter(p => !initialDeletedMap.realisations.includes(p.id)));
  const [blogPosts, setBlogPosts] = useState<any[]>(() => BLOG_POSTS.filter(p => !initialDeletedMap.blog_posts.includes(p.id)));
  const [partners, setPartners] = useState<any[]>(() => PARTNERS.filter(p => !initialDeletedMap.partners.includes(p.id)));

  // Sync content with Firestore in real-time
  useEffect(() => {
    let deletedMap = {
      formations: initialDeletedMap.formations || [] as string[],
      accompagnements: initialDeletedMap.accompagnements || [] as string[],
      realisations: initialDeletedMap.realisations || [] as string[],
      blog_posts: initialDeletedMap.blog_posts || [] as string[],
      partners: initialDeletedMap.partners || [] as string[]
    };

    let latestDbFormations: any[] = [];
    let latestDbAccompagnements: any[] = [];
    let latestDbRealisations: any[] = [];
    let latestDbBlog: any[] = [];
    let latestDbPartners: any[] = [];

    const cleanEntityTitle = (title: string) => {
      if (!title) return '';
      return title
        .replace(/^Nouvelle\s+Formation\s+d['’]Excellence\s*[:\-–—]?\s*/i, '')
        .replace(/Nouvelle\s+Formation\s+d['’]Excellence\s*[:\-–—]?\s*/gi, '')
        .trim();
    };

    const recomputeAll = () => {
      // 1. Formations
      const getFormationTime = (item: any) => {
        if (item.createdAt) {
          if (typeof item.createdAt.toDate === 'function') return item.createdAt.toDate().getTime();
          if (item.createdAt.seconds) return item.createdAt.seconds * 1000;
          return new Date(item.createdAt).getTime();
        }
        return 0;
      };
      const sortedDbFormations = [...latestDbFormations].sort((a, b) => getFormationTime(b) - getFormationTime(a));
      const mergedFormations = [...sortedDbFormations, ...FORMATIONS.filter(f => !sortedDbFormations.some(df => df.id === f.id))].map(f => ({
        ...f,
        title: cleanEntityTitle(f.title)
      }));
      setFormations(mergedFormations.filter(f => !deletedMap.formations.includes(f.id)));

      // 2. Accompagnements
      const mergedAccomp = [...latestDbAccompagnements, ...DOMAINS_INTERVENTION.filter(d => !latestDbAccompagnements.some(da => da.id === d.id))];
      setAccompagnements(mergedAccomp.filter(d => !deletedMap.accompagnements.includes(d.id)));

      // 3. Realisations
      const mergedReal = [...latestDbRealisations, ...PROJECTS.filter(p => !latestDbRealisations.some(dr => dr.id === p.id))];
      setRealisations(mergedReal.filter(p => !deletedMap.realisations.includes(p.id)));

      // 4. Blog Posts
      const getPostTime = (post: any) => {
        if (post.createdAt) {
          if (typeof post.createdAt.toDate === 'function') return post.createdAt.toDate().getTime();
          if (post.createdAt.seconds) return post.createdAt.seconds * 1000;
          return new Date(post.createdAt).getTime();
        }
        return 0;
      };
      const sortedDbBlog = [...latestDbBlog].sort((a, b) => getPostTime(b) - getPostTime(a));
      const mergedBlog = [...sortedDbBlog, ...BLOG_POSTS.filter(p => !sortedDbBlog.some(dp => dp.id === p.id))].map(p => ({
        ...p,
        title: cleanEntityTitle(p.title)
      }));
      setBlogPosts(mergedBlog.filter(p => !deletedMap.blog_posts.includes(p.id)));

      // 5. Partners
      const mergedPart = [...latestDbPartners, ...PARTNERS.filter(p => !latestDbPartners.some(dp => dp.id === p.id))];
      setPartners(mergedPart.filter(p => !deletedMap.partners.includes(p.id)));
    };

    // Listen to deleted items
    const unsubDeleted = onSnapshot(doc(db, 'app_settings', 'deleted_items'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        deletedMap = {
          formations: data.deletedFormationIds || [],
          accompagnements: data.deletedAccompagnementIds || [],
          realisations: data.deletedRealisationIds || [],
          blog_posts: data.deletedBlogPostIds || [],
          partners: data.deletedPartnerIds || []
        };
        try {
          localStorage.setItem('cicexf_deleted_items', JSON.stringify(deletedMap));
        } catch (e) {}
      }
      recomputeAll();
    }, (err) => {
      console.warn("Deleted items config init:", err);
    });

    const unsubFormations = onSnapshot(collection(db, 'formations'), (snapshot) => {
      latestDbFormations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Persisting cleaned titles requires admin write access
      if (isAuthorizedAdminEmail(auth.currentUser?.email)) snapshot.docs.forEach(async (d) => {
        const data = d.data();
        if (data.title && /Nouvelle\s+Formation\s+d['’]Excellence/i.test(data.title)) {
          const cleaned = cleanEntityTitle(data.title);
          try {
            await updateDoc(doc(db, 'formations', d.id), { title: cleaned });
          } catch (e) {
            console.warn("Auto-clean formation title in DB:", e);
          }
        }
      });
      recomputeAll();
    }, (err) => {
      console.error("Error syncing formations:", err);
    });

    const unsubAccomp = onSnapshot(collection(db, 'accompagnements'), (snapshot) => {
      latestDbAccompagnements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      recomputeAll();
    }, (err) => {
      console.error("Error syncing accompagnements:", err);
    });

    const unsubReal = onSnapshot(collection(db, 'realisations'), (snapshot) => {
      latestDbRealisations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      recomputeAll();
    }, (err) => {
      console.error("Error syncing realisations:", err);
    });

    const unsubBlog = onSnapshot(collection(db, 'blog_posts'), (snapshot) => {
      latestDbBlog = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (isAuthorizedAdminEmail(auth.currentUser?.email)) snapshot.docs.forEach(async (d) => {
        const data = d.data();
        if (data.title && /Nouvelle\s+Formation\s+d['’]Excellence/i.test(data.title)) {
          const cleaned = cleanEntityTitle(data.title);
          try {
            await updateDoc(doc(db, 'blog_posts', d.id), { title: cleaned });
          } catch (e) {
            console.warn("Auto-clean blog title in DB:", e);
          }
        }
      });
      recomputeAll();
    }, (err) => {
      console.error("Error syncing blog posts:", err);
    });

    const unsubPartners = onSnapshot(collection(db, 'partners'), (snapshot) => {
      latestDbPartners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      recomputeAll();
    }, (err) => {
      console.error("Error syncing partners:", err);
    });

    return () => {
      unsubDeleted();
      unsubFormations();
      unsubAccomp();
      unsubReal();
      unsubBlog();
      unsubPartners();
    };
  }, []);

  // Admin status is derived only from the verified Firebase Auth user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isAdmin = !!user && isAuthorizedAdminEmail(user.email);
      setIsAdminLoggedIn(isAdmin);
    });
    return () => unsubscribe();
  }, []);

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setIsAdminLoggedIn(false);
    if (activeTab === 'admin') {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [brandTheme, setBrandTheme] = useState<'classic' | 'emerald' | 'tech'>('classic');

  // Back to top scroll state
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Dynamically update primary brand colors when switching themes
  useEffect(() => {
    const root = document.documentElement;
    if (brandTheme === 'classic') {
      root.style.setProperty('--color-brand-blue', '#003B6F');
      root.style.setProperty('--color-brand-blue-dark', '#002447');
      root.style.setProperty('--color-brand-blue-light', '#0d5ea6');
      root.style.setProperty('--color-brand-emerald', '#8A2E1C');
      root.style.setProperty('--color-brand-emerald-dark', '#54150A');
      root.style.setProperty('--color-brand-emerald-light', '#B84F3D');
    } else if (brandTheme === 'emerald') {
      root.style.setProperty('--color-brand-blue', '#004d40');
      root.style.setProperty('--color-brand-blue-dark', '#002d24');
      root.style.setProperty('--color-brand-blue-light', '#00796b');
      root.style.setProperty('--color-brand-emerald', '#10b981');
      root.style.setProperty('--color-brand-emerald-dark', '#047857');
      root.style.setProperty('--color-brand-emerald-light', '#34d399');
    } else if (brandTheme === 'tech') {
      root.style.setProperty('--color-brand-blue', '#1e293b');
      root.style.setProperty('--color-brand-blue-dark', '#0f172a');
      root.style.setProperty('--color-brand-blue-light', '#334155');
      root.style.setProperty('--color-brand-emerald', '#06b6d4');
      root.style.setProperty('--color-brand-emerald-dark', '#0891b2');
      root.style.setProperty('--color-brand-emerald-light', '#22d3ee');
    }
  }, [brandTheme]);

  // Track page scroll to display back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page and tab visits automatically in Firebase Firestore
  useEffect(() => {
    trackVisit(activeTab);
  }, [activeTab]);

  // Keep the URL and document title in sync with the active tab
  useEffect(() => {
    const path = TAB_PATHS[activeTab] || '/';
    if (window.location.pathname !== path) {
      window.history.pushState({ tab: activeTab }, '', path);
    }
    const label = activeTab === 'admin' ? 'Administration' : activeTab === 'partners' ? 'Partenaires' : TAB_LABELS[activeTab];
    document.title = activeTab === 'home' || !label
      ? "CICEXF - Cabinet International de Consultance, d'Expertise et de Formation"
      : `${label} | CICEXF`;
  }, [activeTab]);

  // Browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromPath(window.location.pathname));
      setSelectedDomainId(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Smart global search handler which routes users dynamically to matched formations, domains, or pages
  const handleGlobalSearch = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return;

    // 1. Check partner query first
    if (q.includes('parten') || q.includes('expert') || q.includes('cv')) {
      setActiveTab('home');
      setSelectedDomainId(null);
      setTimeout(() => {
        const el = document.getElementById('partners-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }

    // 2. Look for matching formation
    const matchedF = formations.find(f => 
      f.title.toLowerCase().includes(q) || 
      (f.shortDescription && f.shortDescription.toLowerCase().includes(q)) ||
      (f.domain && f.domain.toLowerCase().includes(q))
    );
    if (matchedF) {
      setActiveTab('formations');
      setSelectedDomainId(matchedF.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 3. Look for matching domain or subdomain
    const matchedD = DOMAINS_INTERVENTION.find(d => 
      d.title.toLowerCase().includes(q) || 
      (d.shortDescription && d.shortDescription.toLowerCase().includes(q)) ||
      (d.subDomains && d.subDomains.some(sub => sub.title.toLowerCase().includes(q)))
    );
    if (matchedD) {
      setActiveTab('accompagnements');
      setSelectedDomainId(matchedD.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 4. Default keyword match routing
    if (q.includes('actu') || q.includes('blog') || q.includes('publi') || q.includes('guide')) {
      setActiveTab('news');
    } else {
      setActiveTab('contact');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentIdx = NAVIGATION_ORDER.indexOf(activeTab);
  const prevTab = currentIdx > 0 ? NAVIGATION_ORDER[currentIdx - 1] : NAVIGATION_ORDER[NAVIGATION_ORDER.length - 1];
  const nextTab = currentIdx < NAVIGATION_ORDER.length - 1 ? NAVIGATION_ORDER[currentIdx + 1] : NAVIGATION_ORDER[0];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedDomainId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render proper sub-page component depending on state router
  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            setActiveTab={setActiveTab}
            setSelectedDomainId={setSelectedDomainId}
            formations={formations}
            blogPosts={blogPosts}
            partners={partners}
            accompagnements={accompagnements}
            onOpenAssistant={() => setIsAiModalOpen(true)}
            onSearch={handleGlobalSearch}
          />
        );
      case 'about':
        return <About />;
      case 'accompagnements':
        return (
          <Interventions
            selectedDomainId={selectedDomainId}
            setSelectedDomainId={setSelectedDomainId}
            setActiveTab={setActiveTab}
            setPreselectedDomain={setPreselectedDomain}
            domains={accompagnements}
          />
        );
      case 'formations':
        return <Formations selectedDomainId={selectedDomainId} setSelectedDomainId={setSelectedDomainId} setActiveTab={setActiveTab} formations={formations} domains={accompagnements} />;
      case 'catalogue':
        return <Catalogue setActiveTab={setActiveTab} />;
      case 'realisations':
        return <Realisations selectedDomainId={selectedDomainId} setSelectedDomainId={setSelectedDomainId} setActiveTab={setActiveTab} projects={realisations} />;
      case 'news':
        return <News blogPosts={blogPosts} />;
      case 'partners':
        return <Partners partners={partners} />;
      case 'contact':
        return <Contact preselectedDomain={preselectedDomain} setPreselectedDomain={setPreselectedDomain} />;
      case 'admin':
        return (
          <AdminPanel
            formations={formations}
            accompagnements={accompagnements}
            realisations={realisations}
            blogPosts={blogPosts}
            partners={partners}
          />
        );
      default:
        return (
          <Home
            setActiveTab={setActiveTab}
            setSelectedDomainId={setSelectedDomainId}
            formations={formations}
            blogPosts={blogPosts}
            partners={partners}
            accompagnements={accompagnements}
            onOpenAssistant={() => setIsAiModalOpen(true)}
            onSearch={handleGlobalSearch}
          />
        );
    }
  };

  return (
    <div id="app-root" className="min-h-screen flex flex-col bg-white text-slate-900 transition-colors duration-300">
      
      {/* Primary header navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDomainId={selectedDomainId}
        setSelectedDomainId={setSelectedDomainId}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        brandTheme={brandTheme}
        setBrandTheme={setBrandTheme}
        onSearch={handleGlobalSearch}
        isAdminLoggedIn={isAdminLoggedIn}
        formations={formations}
        domains={accompagnements}
        blogPosts={blogPosts}
        aiModalOpen={isAiModalOpen}
        setAiModalOpen={setIsAiModalOpen}
      />

      {/* Main content viewport */}
      <main className="flex-grow flex flex-col justify-between">
        <div>
          <Suspense fallback={<PageLoader />}>
            {renderActivePage()}
          </Suspense>
        </div>

        {/* Smart Page Navigation Switcher */}
        <div id="smart-page-navigator" className="border-t border-slate-200/60 dark:border-slate-850 bg-slate-100/30 dark:bg-slate-950/10 py-4 mt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Left Button - Previous Page */}
              <button
                onClick={() => handleTabChange(prevTab)}
                className="group w-full sm:w-auto flex items-center space-x-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-blue/30 dark:hover:border-brand-emerald/30 transition-all duration-300 text-left cursor-pointer active:scale-98"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-brand-blue dark:group-hover:text-brand-emerald-light transition-colors shrink-0">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest font-sans">
                    Page précédente
                  </span>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-blue dark:group-hover:text-brand-emerald-light transition-colors">
                    {TAB_LABELS[prevTab]}
                  </span>
                </div>
              </button>

              {/* Middle decorative text/indicator */}
              <div className="flex flex-col items-center justify-center text-center py-1">
                <span className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                  Navigation
                </span>
                <div className="flex items-center space-x-1.5 mt-1">
                  {NAVIGATION_ORDER.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        activeTab === tab
                          ? 'w-6 bg-brand-blue dark:bg-brand-emerald'
                          : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                      }`}
                      title={`Aller à ${TAB_LABELS[tab]}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Button - Next Page */}
              <button
                onClick={() => handleTabChange(nextTab)}
                className="group w-full sm:w-auto flex items-center justify-between sm:justify-start space-x-3 p-3 rounded-xl bg-brand-blue dark:bg-brand-emerald text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-right cursor-pointer active:scale-98"
              >
                <div className="order-2 sm:order-none sm:mr-3 text-left">
                  <span className="block text-[11px] font-bold text-white uppercase tracking-widest font-sans">
                    Page suivante
                  </span>
                  <span className="block text-xs font-bold text-white group-hover:underline">
                    {TAB_LABELS[nextTab]}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

            </div>
          </div>
        </div>
      </main>

      {/* Standard corporate corporate footer */}
      <Footer 
        setActiveTab={setActiveTab} 
        setSelectedDomainId={setSelectedDomainId}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* FLOATING CHANNELS & CTA WIDGETS */}
      
      {/* Back to Top floating button */}
      {showScrollTop && (
        <button
          id="btn-scroll-top"
          onClick={handleScrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3.5 bg-brand-blue dark:bg-brand-emerald text-white dark:text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all animate-bounce"
          aria-label="Retourner en haut de page"
          title="Retourner en haut"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating Channels & Chatbot Widgets */}
      <div id="floating-actions-group" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 font-sans">
        
        {/* Core WhatsApp Button linking directly */}
        <a
          href="https://wa.me/2250701970065"
          target="_blank"
          rel="noreferrer"
          id="floating-whatsapp-btn"
          className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-2 border-white dark:border-slate-800"
          aria-label="Ouvrir le chat WhatsApp direct"
          title="WhatsApp Direct (+225 07 01 97 00 65)"
        >
          <MessageSquare className="w-5 h-5 text-white" />
          <span className="sr-only">WhatsApp Direct</span>
        </a>

        {/* Floating ADILINE Virtual Assistant - Point WhatsApp Style */}
        <div className="flex items-center gap-2 group">
          {/* WhatsApp-style Speech Bubble callout */}
          <div 
            onClick={() => setIsAiModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 text-xs font-semibold whitespace-nowrap cursor-pointer hover:border-emerald-500/50 hover:shadow-2xl transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Discuter avec ADILINE</span>
            <span className="text-emerald-500">💬</span>
          </div>

          <button
            type="button"
            id="floating-adiline-btn"
            onClick={() => setIsAiModalOpen(true)}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] p-0.5 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer ring-4 ring-emerald-500/20 hover:ring-emerald-500/40"
            aria-label="Discuter avec ADILINE - Assistante virtuelle"
            title="Discuter avec ADILINE, assistante d'accueil du cabinet"
          >
            <img 
              src={adilineAvatar} 
              alt="ADILINE" 
              className="w-full h-full rounded-full object-cover border-2 border-white shadow-inner"
            />
            
            {/* Green Online radar pulse */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full animate-ping" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            
            {/* WhatsApp Mini Badge Icon */}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
              <MessageSquare className="w-2.5 h-2.5 text-white" />
            </span>
          </button>
        </div>
      </div>

      {/* ADILINE Virtual Assistant Component (mounted on first opening, then kept to preserve the conversation) */}
      {hasOpenedAssistant && (
        <Suspense fallback={null}>
          <AdilineChatbot
            isOpen={isAiModalOpen}
            onClose={() => setIsAiModalOpen(false)}
            onNavigateTab={(tab, itemId) => {
              handleTabChange(tab);
              if (itemId && tab === 'formations') {
                setSelectedDomainId(itemId);
              }
            }}
          />
        </Suspense>
      )}

      {/* Admin Login Modal for Authorized Cabinet Access */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={(_adminEmail) => {
          setIsAdminLoggedIn(true);
          setActiveTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
