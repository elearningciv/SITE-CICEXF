import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Interventions from './components/Interventions';
import Formations from './components/Formations';
import Realisations from './components/Realisations';
import News from './components/News';
import Contact from './components/Contact';
import Partners from './components/Partners';
import AdminPanel, { isAuthorizedAdminEmail } from './components/AdminPanel';
import { trackVisit } from './lib/tracker';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { MessageSquare, ArrowUp, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { FORMATIONS, DOMAINS_INTERVENTION, BLOG_POSTS, PARTNERS, PROJECTS } from './data';
import { Formation, DomainIntervention, Project, BlogPost } from './types';

const NAVIGATION_ORDER = [
  'home',
  'about',
  'accompagnements',
  'formations',
  'realisations',
  'news',
  'contact'
];

const TAB_LABELS: Record<string, string> = {
  home: 'Accueil',
  about: 'Qui sommes-nous',
  accompagnements: 'Accompagnement',
  formations: 'Formations',
  realisations: 'Réalisations',
  news: 'Actualités',
  contact: 'Contact'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [preselectedDomain, setPreselectedDomain] = useState<string>('Consultance');
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  
  // Real-time synced content states
  const [formations, setFormations] = useState<any[]>(FORMATIONS);
  const [accompagnements, setAccompagnements] = useState<any[]>(DOMAINS_INTERVENTION);
  const [realisations, setRealisations] = useState<any[]>(PROJECTS);
  const [blogPosts, setBlogPosts] = useState<any[]>(BLOG_POSTS);
  const [partners, setPartners] = useState<any[]>(PARTNERS);

  // Sync content with Firestore in real-time
  useEffect(() => {
    let deletedMap = {
      formations: [] as string[],
      accompagnements: [] as string[],
      realisations: [] as string[],
      blog_posts: [] as string[]
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
      setPartners(mergedPart);
    };

    // Listen to deleted items
    const unsubDeleted = onSnapshot(doc(db, 'app_settings', 'deleted_items'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        deletedMap = {
          formations: data.deletedFormationIds || [],
          accompagnements: data.deletedAccompagnementIds || [],
          realisations: data.deletedRealisationIds || [],
          blog_posts: data.deletedBlogPostIds || []
        };
      }
      recomputeAll();
    }, (err) => {
      console.warn("Deleted items config init:", err);
    });

    const unsubFormations = onSnapshot(collection(db, 'formations'), (snapshot) => {
      latestDbFormations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      snapshot.docs.forEach(async (d) => {
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
      snapshot.docs.forEach(async (d) => {
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

  // Track Admin log state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAuthorizedAdminEmail(user.email)) {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
      }
    });
    return unsubscribe;
  }, []);

  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [brandTheme, setBrandTheme] = useState<'classic' | 'emerald' | 'tech'>('classic');

  // Back to top scroll state
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  
  // WhatsApp bubble prompt expand state
  const [showWaPrompt, setShowWaPrompt] = useState<boolean>(true);

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
        return <Formations selectedDomainId={selectedDomainId} setSelectedDomainId={setSelectedDomainId} setActiveTab={setActiveTab} formations={formations} />;
      case 'realisations':
        return <Realisations selectedDomainId={selectedDomainId} setSelectedDomainId={setSelectedDomainId} projects={realisations} />;
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
          />
        );
    }
  };

  return (
    <div id="app-root" className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020817] transition-colors duration-300">
      
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
      />

      {/* Main content viewport */}
      <main className="flex-grow flex flex-col justify-between">
        <div>
          {renderActivePage()}
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
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                    Page précédente
                  </span>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-blue dark:group-hover:text-brand-emerald-light transition-colors">
                    {TAB_LABELS[prevTab]}
                  </span>
                </div>
              </button>

              {/* Middle decorative text/indicator */}
              <div className="flex flex-col items-center justify-center text-center py-1">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
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
                className="group w-full sm:w-auto flex items-center justify-between sm:justify-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-blue-light dark:from-brand-emerald dark:to-brand-emerald-light text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-right cursor-pointer active:scale-98"
              >
                <div className="order-2 sm:order-none sm:mr-3 text-left">
                  <span className="block text-[9px] font-bold text-white/75 uppercase tracking-widest font-sans">
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
      <Footer setActiveTab={setActiveTab} setSelectedDomainId={setSelectedDomainId} />

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

      {/* Floating WhatsApp chat bubble */}
      <div id="whatsapp-bubble-group" className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2 font-sans text-xs">
        
        {/* Animated prompt helper */}
        {showWaPrompt && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl max-w-[210px] relative animate-pulse flex flex-col space-y-1">
            <button
              onClick={() => setShowWaPrompt(false)}
              className="absolute top-1 right-1 text-slate-400 hover:text-slate-600"
              aria-label="Fermer la suggestion"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-center space-x-1.5 text-brand-emerald font-bold text-[10px] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assistance en ligne</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-350 leading-tight">
              Des questions sur les tarifs ou inscriptions ? Discutez en direct !
            </p>
          </div>
        )}

        {/* Core WhatsApp Button linking directly */}
        <a
          href="https://wa.me/2250701970065"
          target="_blank"
          rel="noreferrer"
          id="floating-whatsapp-btn"
          className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-108 active:scale-95 transition-all group"
          aria-label="Ouvrir le chat WhatsApp"
          title="Assistance WhatsApp directe"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-bold text-[11px] whitespace-nowrap">
            WhatsApp Direct
          </span>
        </a>
      </div>

    </div>
  );
}
