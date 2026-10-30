import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Search, Sun, Moon, Sparkles, BookOpen, MapPin, Globe, Phone, Mail, GraduationCap, Layers, Award, ChevronLeft, ChevronRight, Lock, Play, Pause, ArrowRight, Bot } from 'lucide-react';
import { DOMAINS_INTERVENTION, FORMATIONS, BLOG_POSTS } from '../data';
import { Formation, DomainIntervention, BlogPost } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDomainId: string | null;
  setSelectedDomainId: (id: string | null) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  brandTheme: 'classic' | 'emerald' | 'tech';
  setBrandTheme: (theme: 'classic' | 'emerald' | 'tech') => void;
  onSearch: (query: string) => void;
  isAdminLoggedIn?: boolean;
  formations?: Formation[];
  domains?: DomainIntervention[];
  blogPosts?: BlogPost[];
  aiModalOpen?: boolean;
  setAiModalOpen?: (open: boolean) => void;
}

const MOBILE_TABS = [
  { id: 'home', label: 'Accueil' },
  { id: 'about', label: 'À propos' },
  { id: 'accompagnements', label: 'Accompagnements' },
  { id: 'formations', label: 'Formations' },
  { id: 'realisations', label: 'Réalisations' },
  { id: 'news', label: 'Actualités' },
  { id: 'partners', label: 'Partenaires' },
  { id: 'contact', label: 'Contact' },
];

export default function Header({
  activeTab,
  setActiveTab,
  selectedDomainId,
  setSelectedDomainId,
  darkMode,
  setDarkMode,
  brandTheme,
  setBrandTheme,
  onSearch,
  isAdminLoggedIn,
  formations = FORMATIONS,
  domains = DOMAINS_INTERVENTION,
  blogPosts = BLOG_POSTS,
  aiModalOpen: externalAiModalOpen,
  setAiModalOpen: externalSetAiModalOpen
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [formationsMenuOpen, setFormationsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [internalAiModalOpen, setInternalAiModalOpen] = useState(false);
  const aiModalOpen = externalAiModalOpen !== undefined ? externalAiModalOpen : internalAiModalOpen;
  const setAiModalOpen = externalSetAiModalOpen || setInternalAiModalOpen;
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const manualPauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
    // Pause auto-scroll briefly during manual click so it does not conflict
    if (manualPauseTimerRef.current) clearTimeout(manualPauseTimerRef.current);
    manualPauseTimerRef.current = setTimeout(() => {
      // resume if still active
    }, 2500);
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
    if (manualPauseTimerRef.current) clearTimeout(manualPauseTimerRef.current);
    manualPauseTimerRef.current = setTimeout(() => {
      // resume if still active
    }, 2500);
  };

  // Ultra-fluid, zero-jank, crash-proof continuous auto-scrolling ticker
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isAutoScrolling || isHovered) return;

    let animationFrameId: number;
    let lastTimestamp = performance.now();
    // Brisk, readable speed (65 pixels per second) - no snail crawling, no lagging
    const SPEED_PPS = 65;

    const step = (now: number) => {
      // Cap elapsed to avoid jumps if browser tab was backgrounded/inactive
      const elapsed = Math.min(now - lastTimestamp, 100);
      lastTimestamp = now;

      if (container && container.scrollWidth > container.clientWidth) {
        const delta = (SPEED_PPS * elapsed) / 1000;
        container.scrollLeft += delta;

        // Tripled list loop: seamless reset by subtracting 1/3 when past the threshold
        const oneThird = container.scrollWidth / 3;
        if (oneThird > 50 && container.scrollLeft >= oneThird * 2) {
          container.scrollLeft -= oneThird;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoScrolling, isHovered, blogPosts, activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDomainClick = (id: string) => {
    setSelectedDomainId(id);
    setActiveTab('accompagnements');
    setMegaMenuOpen(false);
    setFormationsMenuOpen(false);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormationClick = (slug: string) => {
    setSelectedDomainId(slug);
    setActiveTab('formations');
    setMegaMenuOpen(false);
    setFormationsMenuOpen(false);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tab: string) => {
    if (tab === 'partners') {
      setActiveTab('home');
      setSelectedDomainId(null);
      setIsOpen(false);
      setMegaMenuOpen(false);
      setFormationsMenuOpen(false);
      setTimeout(() => {
        const el = document.getElementById('partners-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setActiveTab(tab);
      setSelectedDomainId(null);
      setIsOpen(false);
      setMegaMenuOpen(false);
      setFormationsMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectResult = (tab: string, domainId: string | null) => {
    setActiveTab(tab);
    setSelectedDomainId(domainId);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchOpen(false);
    }
  };

  const queryNormalized = searchQuery.toLowerCase().trim();
  const matchedFormations = queryNormalized.length >= 2 
    ? formations.filter(f => 
        f.title.toLowerCase().includes(queryNormalized) ||
        f.shortDescription?.toLowerCase().includes(queryNormalized) ||
        f.domain?.toLowerCase().includes(queryNormalized)
      )
    : [];

  const matchedDomains: Array<{
    id: string;
    title: string;
    parentTitle?: string;
    description: string;
    type: 'domain' | 'subdomain';
  }> = [];

  if (queryNormalized.length >= 2) {
    domains.forEach(d => {
      const dTitleMatch = d.title.toLowerCase().includes(queryNormalized);
      const dDescMatch = d.description.toLowerCase().includes(queryNormalized);
      const dShortMatch = d.shortDescription?.toLowerCase().includes(queryNormalized);
      
      if (dTitleMatch || dDescMatch || dShortMatch) {
        matchedDomains.push({
          id: d.id,
          title: d.title,
          description: d.shortDescription || d.description.substring(0, 100) + '...',
          type: 'domain'
        });
      }

      if (d.subDomains) {
        d.subDomains.forEach(sub => {
          const sTitleMatch = sub.title.toLowerCase().includes(queryNormalized);
          const sDescMatch = sub.description?.toLowerCase().includes(queryNormalized);
          const sKeyPointsMatch = sub.keyPoints?.some(kp => kp.toLowerCase().includes(queryNormalized));

          if (sTitleMatch || sDescMatch || sKeyPointsMatch) {
            matchedDomains.push({
              id: d.id,
              title: sub.title,
              parentTitle: d.title,
              description: sub.description ? (sub.description.length > 100 ? sub.description.substring(0, 100) + '...' : sub.description) : '',
              type: 'subdomain'
            });
          }
        });
      }
    });
  }

  const showSearchResults = queryNormalized.length >= 2;
  const hasAnyResults = matchedFormations.length > 0 || matchedDomains.length > 0;

  return (
    <>
      {/* Top Utility Bar removed as requested */}

      {/* Main Sticky Header */}
      <header
        id="main-header"
        className="sticky top-0 z-40 transition-all duration-300 bg-white shadow-sm border-b border-slate-200"
      >
        {/* Mobile Top Bar */}
        <div className="w-full px-3 py-2.5 xl:hidden bg-white border-b border-slate-100">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              id="header-logo"
              className="flex items-center space-x-2 cursor-pointer group shrink-0"
              onClick={() => handleNavClick('home')}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-brand-blue to-brand-emerald rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform shrink-0">
                CX
              </div>
              <div className="shrink-0 flex items-center leading-none">
                <span className="font-display font-extrabold text-lg tracking-tight text-brand-blue">
                  CIC
                </span>
                <span className="font-display font-extrabold text-lg tracking-tight text-brand-emerald">
                  EXF
                </span>
              </div>
            </div>

            {/* Mobile Controls in exact order: 1. Recherche, 2. IA, 3. Menu */}
            <div id="header-mobile-actions" className="flex items-center space-x-2 shrink-0">
              {/* 1. Bouton de recherche */}
              <button
                id="search-mobile-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/90 shadow-xs flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                aria-label="Rechercher"
                title="Rechercher sur le site"
              >
                <Search className="w-4.5 h-4.5 text-red-600 stroke-[2.4]" />
              </button>

              {/* 2. Bouton IA Conseiller */}
              <button
                id="ai-mobile-btn"
                onClick={() => setAiModalOpen(true)}
                className="h-9 px-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 text-white shadow-xs flex items-center space-x-1 border border-amber-300/40 active:scale-95 cursor-pointer"
                aria-label="Conseiller Intelligent"
                title="Conseiller Intelligent CICEXF - Posez une question"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-current animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider text-white">IA</span>
              </button>

              {/* 3. Bouton Menu des onglets */}
              <button
                id="mobile-hamburger-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="h-9 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black shadow-sm transition-all flex items-center space-x-1.5 border border-red-500 active:scale-95 cursor-pointer shrink-0"
                aria-label="Menu des onglets"
                title="Ouvrir le menu des onglets"
              >
                {isOpen ? (
                  <X className="w-4.5 h-4.5 text-white stroke-[3]" />
                ) : (
                  <Menu className="w-4.5 h-4.5 text-white stroke-[3]" />
                )}
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  {isOpen ? 'FERMER' : 'MENU'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Blue Bar Navigation (Bande bleue statique de haute visibilité) */}
        <div className="hidden xl:block bg-brand-blue-dark py-2 border-t border-b border-[#001830] shadow-md relative z-30">
          <div className="w-full px-2 sm:px-4 lg:px-5 xl:px-8">
            <div className="flex items-center justify-between">
              {/* Logo and Agrément sur la même bande - Calé tout à gauche pour libérer l'espace nav */}
              <div
                id="bar-logo-container"
                className="flex items-center space-x-2 xl:space-x-2.5 cursor-pointer group shrink-0 mr-2 lg:mr-3"
                onClick={() => handleNavClick('home')}
              >
                <div className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center text-white font-bold text-xs lg:text-sm xl:text-base shadow-inner group-hover:scale-105 transition-transform duration-300 border border-white/10 shrink-0">
                  CX
                </div>
                <div className="shrink-0">
                  <div className="flex items-center">
                    <span className="font-display font-black text-xs xl:text-sm tracking-wider text-white">
                      CIC
                    </span>
                    <span className="font-display font-black text-xs xl:text-sm tracking-wider text-orange-300">
                      EXF
                    </span>
                  </div>
                  <p className="text-[9px] xl:text-[10px] font-semibold text-slate-300 dark:text-slate-300 font-mono leading-none mt-0.5 whitespace-nowrap">
                    Agrément N°25343/GTCA/RC/2025
                  </p>
                </div>
              </div>

              {/* Boutons WhatsApp et Mail directs du CICEXF placés devant Agrément N°25343/GTCA/RC/2025 pour nous contacter directement */}
              <div id="direct-header-contacts" className="flex items-center space-x-1.5 lg:space-x-2 shrink-0 mr-auto">
                <a
                  href="https://wa.me/2250701970065"
                  target="_blank"
                  rel="noreferrer"
                  id="direct-header-whatsapp-btn"
                  className="inline-flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-2 lg:px-2.5 py-1 xl:py-1.5 rounded-lg text-[10px] xl:text-[11px] font-black tracking-wide shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  title="Contacter directement le CICEXF par WhatsApp (+225 07 01 97 00 65)"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.18-.553-1.895-.783-3.117-2.73-3.212-2.856-.095-.127-.77-1.026-.77-1.956 0-.931.488-1.388.662-1.579.174-.191.381-.239.508-.239.127 0 .254.001.365.006.117.005.275-.044.43.328.159.381.54 1.319.587 1.415.048.095.079.206.016.333-.063.127-.095.206-.191.317-.095.111-.202.249-.289.334-.095.095-.195.199-.084.39.111.191.494.814 1.059 1.318.729.649 1.343.85 1.534.945.191.095.302.079.413-.048.111-.127.476-.556.603-.746.127-.19.254-.159.429-.095.174.063 1.111.524 1.302.619.191.095.317.143.365.222.048.079.048.46-.096.865z" />
                  </svg>
                  <span className="hidden 2xl:inline">WhatsApp</span>
                </a>

                <a
                  href="mailto:elearningciv@gmail.com"
                  id="direct-header-mail-btn"
                  className="inline-flex items-center space-x-1.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 px-2 lg:px-2.5 py-1 xl:py-1.5 rounded-lg text-[10px] xl:text-[11px] font-black tracking-wide shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  title="Écrire par email à elearningciv@gmail.com"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0 text-cyan-300" />
                  <span className="hidden 2xl:inline">Mail</span>
                </a>
              </div>

              {/* Navigation principale de la bande - Sans overflow-hidden pour que Accueil et Qui sommes-nous restent toujours 100% visibles */}
              <nav id="desktop-nav" className="flex items-center space-x-1 lg:space-x-1.5 xl:space-x-1 shrink-0 ml-auto">
                <button
                  id="nav-home"
                  onClick={() => handleNavClick('home')}
                  className={`px-2 lg:px-2.5 xl:px-2 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-[10.5px] lg:text-[11px] xl:text-[11px] font-black uppercase tracking-normal transition-all duration-200 transform-gpu cursor-pointer shrink-0 whitespace-nowrap ${
                    activeTab === 'home'
                      ? 'bg-white text-brand-blue-dark shadow-md scale-105 font-black'
                      : 'text-white/90 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  Accueil
                </button>

                <button
                  id="nav-about"
                  onClick={() => handleNavClick('about')}
                  className={`px-2 lg:px-2.5 xl:px-2 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-[10.5px] lg:text-[11px] xl:text-[11px] font-black uppercase tracking-normal transition-all duration-200 transform-gpu cursor-pointer shrink-0 whitespace-nowrap ${
                    activeTab === 'about'
                      ? 'bg-white text-brand-blue-dark shadow-md scale-105 font-black'
                      : 'text-white/90 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  Qui sommes-nous
                </button>

                <button
                  id="nav-accompagnements"
                  onClick={() => handleNavClick('accompagnements')}
                  className={`px-1.5 lg:px-2 xl:px-2 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-[10px] lg:text-[10.5px] xl:text-[11px] font-black uppercase tracking-normal transition-all duration-200 transform-gpu cursor-pointer shrink-0 ${
                    activeTab === 'accompagnements'
                      ? 'bg-white text-brand-blue-dark shadow-md scale-105 font-black'
                      : 'text-white/90 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  Accompagnement
                </button>

                {/* Formations Nav Button */}
                <button
                  id="nav-formations"
                  onClick={() => handleNavClick('formations')}
                  className={`px-1.5 lg:px-2 xl:px-2 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-[10px] lg:text-[10.5px] xl:text-[11px] font-black uppercase tracking-normal transition-all duration-200 transform-gpu cursor-pointer shrink-0 ${
                    activeTab === 'formations'
                      ? 'bg-white text-brand-blue-dark shadow-md scale-105 font-black'
                      : 'text-white/90 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  Formations
                </button>

                <button
                  id="nav-realisations"
                  onClick={() => handleNavClick('realisations')}
                  className={`px-1.5 lg:px-2 xl:px-2 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-[10px] lg:text-[10.5px] xl:text-[11px] font-black uppercase tracking-normal transition-all duration-200 transform-gpu cursor-pointer shrink-0 ${
                    activeTab === 'realisations'
                      ? 'bg-white text-brand-blue-dark shadow-md scale-105 font-black'
                      : 'text-white/90 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  Réalisations
                </button>
                
                <button
                  id="nav-news"
                  onClick={() => handleNavClick('news')}
                  className={`px-1.5 lg:px-2 xl:px-2 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-[10px] lg:text-[10.5px] xl:text-[11px] font-black uppercase tracking-normal transition-all duration-200 transform-gpu cursor-pointer shrink-0 flex items-center space-x-1 ${
                    activeTab === 'news'
                      ? 'bg-red-600 text-white shadow-md scale-105'
                      : 'bg-red-500/10 text-red-200 border border-red-500/30 hover:bg-red-500/25 hover:text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  <span>Actualités</span>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
                  </span>
                </button>

                <button
                  id="nav-contact"
                  onClick={() => handleNavClick('contact')}
                  className={`px-2 lg:px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl text-[10px] lg:text-[10.5px] xl:text-[11px] font-black uppercase tracking-normal transition-all duration-200 transform-gpu cursor-pointer shrink-0 ${
                    activeTab === 'contact'
                      ? 'bg-white text-brand-blue-dark shadow-md scale-105 font-black'
                      : 'bg-brand-emerald text-white hover:bg-brand-emerald-light hover:scale-105 active:scale-95'
                  }`}
                >
                  Contact
                </button>

                {/* Admin Tab - Visible uniquement pour les administrateurs connectés (elearningciv@gmail.com et cabinetcicexf@gmail.com) */}
                {isAdminLoggedIn && (
                  <button
                    id="nav-admin"
                    onClick={() => handleNavClick('admin')}
                    className={`px-1.5 lg:px-2 xl:px-2 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-[10px] lg:text-[10.5px] xl:text-[11px] font-black uppercase tracking-normal transition-all duration-200 transform-gpu cursor-pointer shrink-0 flex items-center space-x-1 ${
                      activeTab === 'admin'
                        ? 'bg-white text-emerald-600 shadow-md scale-105 font-black'
                        : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/25 hover:text-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    <Lock className="w-3 h-3 xl:w-3.5 xl:h-3.5 shrink-0" />
                    <span>Admin</span>
                  </button>
                )}
              </nav>

              {/* Controls on the blue bar */}
              <div id="bar-controls" className="flex items-center space-x-1.5 ml-2 pl-2 xl:ml-4 xl:pl-4 border-l border-white/20 shrink-0">
                {/* Bouton Intelligent CICEXF - Posez vos questions */}
                <button
                  id="bar-ai-btn"
                  onClick={() => setAiModalOpen(true)}
                  className="px-2 lg:px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-[10.5px] lg:text-[11px] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center space-x-1 border border-amber-300/40"
                  title="Conseiller Intelligent CICEXF - Posez vos questions sur les formations et expertises"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-current animate-pulse" />
                  <span className="hidden 2xl:inline tracking-wide font-black">Conseiller IA</span>
                  <span className="2xl:hidden font-black">IA</span>
                </button>

                {/* Search Toggle */}
                <button
                  id="bar-search-btn-toggle"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  title="Rechercher sur le site"
                >
                  <Search className="w-4.5 h-4.5" />
                </button>

                {/* Theme Customizer Switcher */}
                <div className="relative group/theme-bar">
                  <button
                    id="bar-theme-btn-customizer"
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-0.5 cursor-pointer"
                    title="Thème de la marque"
                  >
                    <Sparkles className="w-4 h-4 text-brand-emerald-light" />
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#020817] rounded-xl shadow-xl border border-slate-100 dark:border-white/10 p-2.5 hidden group-hover/theme-bar:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Palette de Marque</span>
                    
                    <button
                      onClick={() => setBrandTheme('classic')}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 ${brandTheme === 'classic' ? 'bg-slate-100 dark:bg-white/10 text-brand-blue dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                    >
                      <span className="w-3 h-3 rounded-full bg-[#003B6F]"></span>
                      <span className="w-3 h-3 rounded-full bg-[#8A2E1C] -ml-1"></span>
                      <span>Bleu & Marron</span>
                    </button>

                    <button
                      onClick={() => setBrandTheme('emerald')}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 ${brandTheme === 'emerald' ? 'bg-slate-100 dark:bg-white/10 text-brand-emerald dark:text-brand-emerald-light' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                    >
                      <span className="w-3 h-3 rounded-full bg-[#009966]"></span>
                      <span>Vert Émeraude</span>
                    </button>

                    <button
                      onClick={() => setBrandTheme('tech')}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 ${brandTheme === 'tech' ? 'bg-slate-100 dark:bg-white/10 text-cyan-500 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                    >
                      <span className="w-3 h-3 rounded-full bg-cyan-600"></span>
                      <span>Deep Tech Slate</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Persistent Auto-scrolling News Ticker (Titres uniquement en défilement continu) */}
        {activeTab !== 'admin' && (
          <div className="border-t border-b border-[#B84F3D]/40 dark:border-[#380D06] bg-brand-emerald dark:bg-[#54150A] py-1 shadow-md transition-colors overflow-hidden">
            <div className="w-full px-2 sm:px-4 lg:px-6">
              <div 
                ref={scrollContainerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(true)}
                onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
                className="flex items-center space-x-4 py-0.5 overflow-x-auto scrollbar-none"
              >
                {[...blogPosts, ...blogPosts, ...blogPosts].map((post, index) => (
                  <button
                    key={`${post.id}-${index}`}
                    onClick={() => {
                      setActiveTab('news');
                      const event = new CustomEvent('select-article', { detail: { postId: post.id } });
                      window.dispatchEvent(event);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                    className="flex items-center space-x-3 text-[11px] sm:text-xs font-semibold text-white hover:text-yellow-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    title={`Lire : ${post.title}`}
                  >
                    <span>{post.title}</span>
                    <span className="text-yellow-400 font-bold select-none">•</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Slide-out Menu */}
        {isOpen && (
          <div id="mobile-menu" className="xl:hiddenbg-white dark:bg-[#020817] border-t border-slate-100 dark:border-white/10 shadow-xl py-4 px-4 space-y-2 max-h-[calc(100vh-100px)] overflow-y-auto">
            {/* Quick Contact Buttons inside Mobile Menu */}
            <div className="grid grid-cols-2 gap-2 pb-2.5 mb-2 border-b border-slate-100 dark:border-slate-800">
              <a
                href="https://wa.me/2250701970065"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                title="WhatsApp direct (+225 07 01 97 00 65)"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.18-.553-1.895-.783-3.117-2.73-3.212-2.856-.095-.127-.77-1.026-.77-1.956 0-.931.488-1.388.662-1.579.174-.191.381-.239.508-.239.127 0 .254.001.365.006.117.005.275-.044.43.328.159.381.54 1.319.587 1.415.048.095.079.206.016.333-.063.127-.095.206-.191.317-.095.111-.202.249-.289.334-.095.095-.195.199-.084.39.111.191.494.814 1.059 1.318.729.649 1.343.85 1.534.945.191.095.302.079.413-.048.111-.127.476-.556.603-.746.127-.19.254-.159.429-.095.174.063 1.111.524 1.302.619.191.095.317.143.365.222.048.079.048.46-.096.865z" />
                </svg>
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:elearningciv@gmail.com"
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm active:scale-95 transition-all"
                title="Email direct (elearningciv@gmail.com)"
              >
                <Mail className="w-4 h-4 text-brand-blue dark:text-cyan-400 shrink-0" />
                <span>Email</span>
              </a>
            </div>
            <button
              onClick={() => handleNavClick('home')}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold ${activeTab === 'home' ? 'bg-slate-100 dark:bg-slate-800 text-brand-blue' : 'text-slate-700 dark:text-slate-300'}`}
            >
              Accueil
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold ${activeTab === 'about' ? 'bg-slate-100 dark:bg-slate-800 text-brand-blue' : 'text-slate-700 dark:text-slate-300'}`}
            >
              Qui sommes-nous
            </button>

            <button
              onClick={() => handleNavClick('accompagnements')}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold ${activeTab === 'accompagnements' ? 'bg-slate-100 dark:bg-slate-800 text-brand-blue' : 'text-slate-700 dark:text-slate-300'}`}
            >
              Accompagnement
            </button>

            <button
              onClick={() => handleNavClick('formations')}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold ${activeTab === 'formations' ? 'bg-slate-100 dark:bg-slate-800 text-brand-blue' : 'text-slate-700 dark:text-slate-300'}`}
            >
              Formations
            </button>

            <button
              onClick={() => handleNavClick('realisations')}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold ${activeTab === 'realisations' ? 'bg-slate-100 dark:bg-slate-800 text-brand-blue' : 'text-slate-700 dark:text-slate-300'}`}
            >
              Réalisations
            </button>
            <button
              onClick={() => handleNavClick('news')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-between border-2 border-dashed border-red-500 animate-pulse bg-red-500/10 dark:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.4)] ${activeTab === 'news' ? 'text-white bg-red-600 dark:bg-red-600 border-solid animate-none' : 'text-red-700 dark:text-red-300'}`}
            >
              <span>Actualités</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="block w-full text-center py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-brand-blue to-brand-emerald"
            >
              Contactez-nous
            </button>

            {/* Mobile Admin Nav Button - Visible uniquement pour les administrateurs connectés (elearningciv@gmail.com et cabinetcicexf@gmail.com) */}
            {isAdminLoggedIn && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-bold transition-all text-white bg-emerald-600 hover:bg-emerald-700 shadow-md cursor-pointer"
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>Administration (Console)</span>
              </button>
            )}

            {/* Mobile Theme Switcher */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between px-4 text-xs font-semibold text-slate-500">
              <span>Palette de marque :</span>
              <div className="flex space-x-2">
                <button onClick={() => setBrandTheme('classic')} className={`w-5 h-5 rounded-full bg-[#003B6F] ${brandTheme === 'classic' ? 'ring-2 ring-brand-emerald' : ''}`}></button>
                <button onClick={() => setBrandTheme('emerald')} className={`w-5 h-5 rounded-full bg-[#009966] ${brandTheme === 'emerald' ? 'ring-2 ring-brand-blue' : ''}`}></button>
                <button onClick={() => setBrandTheme('tech')} className={`w-5 h-5 rounded-full bg-cyan-600 ${brandTheme === 'tech' ? 'ring-2 ring-brand-emerald' : ''}`}></button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Interactive Search Overlay Modal */}
      {searchOpen && (
        <div id="search-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="bg-white dark:bg-[#020817] rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <form onSubmit={handleSearchSubmit} className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-white/10">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                id="search-input-field"
                type="text"
                placeholder="Rechercher des formations, domaines d'accompagnement, actualités..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-base"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {/* Bannière Conseiller Intelligent dans la recherche */}
            <div className="bg-gradient-to-r from-amber-500/15 via-brand-emerald/10 to-brand-blue/15 px-4 py-3 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                    Une question précise ? Posez-la au Conseiller Intelligent
                  </p>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                    Réponses détaillées et ciblées sur chaque information de tous les onglets (Formations, Accompagnement, Réalisations, Tarifs...)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setAiModalOpen(true); }}
                className="px-3 py-1.5 rounded-xl bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
              >
                <span>Poser une question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-50 dark:border-white/5">
              <span>Suggestions rapides : </span>
              <button type="button" onClick={() => { setSearchQuery('Data Analyst'); }} className="mx-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-white/10 hover:bg-brand-emerald hover:text-white transition-colors">Data Analyst</button>
              <button type="button" onClick={() => { setSearchQuery('QHSE'); }} className="mx-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-white/10 hover:bg-brand-emerald hover:text-white transition-colors">QHSE</button>
              <button type="button" onClick={() => { setSearchQuery('KoboCollect'); }} className="mx-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-white/10 hover:bg-brand-emerald hover:text-white transition-colors">KoboCollect</button>
              <button type="button" onClick={() => { setSearchQuery('Audit'); }} className="mx-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-white/10 hover:bg-brand-emerald hover:text-white transition-colors">Audit</button>
            </div>

            {showSearchResults && (
              <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/10">
                {hasAnyResults ? (
                  <div className="p-4 space-y-4">
                    {/* Formations list */}
                    {matchedFormations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider px-2">
                          Spécialisations & Formations Certifiantes ({matchedFormations.length})
                        </h4>
                        <div className="space-y-1">
                          {matchedFormations.map(f => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => handleSelectResult('formations', f.id)}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-start space-x-3 group cursor-pointer"
                            >
                              <div className="p-2 rounded-lg bg-brand-emerald/10 text-brand-emerald dark:text-brand-emerald-light shrink-0">
                                <GraduationCap className="w-4 h-4" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-emerald transition-colors">
                                  {f.title}
                                </p>
                                <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                                  <span className="font-medium bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                    {f.domain}
                                  </span>
                                  <span>•</span>
                                  <span>{f.duration}</span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Domains / Subdomains list */}
                    {matchedDomains.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider px-2">
                          Domaines d'Intervention & Axes Thématiques ({matchedDomains.length})
                        </h4>
                        <div className="space-y-1">
                          {matchedDomains.map((d, index) => (
                            <button
                              key={`${d.id}-${index}`}
                              type="button"
                              onClick={() => handleSelectResult('accompagnements', d.id)}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-start space-x-3 group cursor-pointer"
                            >
                              <div className="p-2 rounded-lg bg-brand-blue/10 text-brand-blue dark:text-brand-blue-light shrink-0">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-blue transition-colors">
                                  {d.title}
                                </p>
                                <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                                  {d.parentTitle && (
                                    <>
                                      <span className="text-slate-400 font-medium">
                                        Dans : {d.parentTitle}
                                      </span>
                                      <span>•</span>
                                    </>
                                  )}
                                  <span className="bg-brand-blue/5 dark:bg-brand-blue-dark/20 text-brand-blue dark:text-brand-blue-light px-1.5 py-0.5 rounded font-medium">
                                    Accompagnement
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Aucun résultat trouvé pour « <span className="font-semibold text-slate-800 dark:text-slate-200">{searchQuery}</span> »
                    </p>
                    <p className="text-xs text-slate-400">
                      Essayez d'autres mots clés comme "Data Analyst", "QHSE", "Audit" ou "KoboCollect".
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </>
  );
}
