import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Search, Sun, Moon, Sparkles, BookOpen, MapPin, Globe, Phone, GraduationCap, Layers, Award, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { DOMAINS_INTERVENTION, FORMATIONS } from '../data';
import { Formation } from '../types';

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
}

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
  formations = FORMATIONS
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [formationsMenuOpen, setFormationsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

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
    DOMAINS_INTERVENTION.forEach(d => {
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
        className="sticky top-0 z-40 transition-all duration-300 bg-white lg:bg-transparent dark:bg-[#020817] lg:dark:bg-transparent shadow-lg lg:shadow-none border-b border-slate-200 lg:border-b-0 dark:border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:hidden">
          <div className="flex justify-between items-center py-3 sm:py-3.5">
            {/* Logo */}
            <div
              id="header-logo"
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleNavClick('home')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-emerald rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                CX
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-display font-extrabold text-xl tracking-tight text-brand-blue dark:text-blue-400">
                    CIC
                  </span>
                  <span className="font-display font-extrabold text-xl tracking-tight text-brand-emerald dark:text-brand-emerald-light">
                    EXF
                  </span>
                </div>
                <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold font-sans">
                  Expertise &amp; Consultance
                </p>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center space-x-3">
              {/* Utility Icons & Custom Themes Controls */}
              <div id="header-controls" className="hidden lg:flex items-center space-x-3">
                {/* Search Toggle */}
                <button
                  id="search-btn-toggle"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-lg text-slate-500 hover:text-brand-blue dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  title="Rechercher sur le site"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Theme Customizer Switcher */}
                <div className="relative group/theme">
                  <button
                    id="theme-btn-customizer"
                    className="p-2 rounded-lg text-slate-500 hover:text-brand-blue dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-0.5 cursor-pointer"
                    title="Thème de la marque"
                  >
                    <Sparkles className="w-4 h-4 text-brand-emerald" />
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#020817] rounded-xl shadow-xl border border-slate-100 dark:border-white/10 p-2.5 hidden group-hover/theme:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
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

              {/* Mobile Hamburger Button */}
              <div className="flex items-center space-x-2 lg:hidden">
                <button
                  id="search-mobile-btn"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  id="mobile-hamburger-btn"
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Blue Bar Navigation (Bande bleue statique de haute visibilité) */}
        <div className="hidden lg:block bg-brand-blue-dark py-2 border-t border-b border-[#001830] shadow-md relative z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Logo and Agrément sur la même bande */}
              <div
                id="bar-logo-container"
                className="flex items-center space-x-3 cursor-pointer group shrink-0 mr-10 xl:mr-16"
                onClick={() => handleNavClick('home')}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-inner group-hover:scale-105 transition-transform duration-300 border border-white/10">
                  CX
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-display font-black text-sm tracking-wider text-white">
                      CIC
                    </span>
                    <span className="font-display font-black text-sm tracking-wider text-brand-emerald-light">
                      EXF
                    </span>
                  </div>
                  <p className="text-[8.5px] font-bold text-slate-300 dark:text-slate-300 font-mono leading-none mt-0.5">
                    Agrément N°25343/GTCA/RC/2025
                  </p>
                </div>
              </div>

              {/* Navigation principal de la bande */}
              <nav id="desktop-nav" className="flex items-center justify-end space-x-1 lg:space-x-0.5 xl:space-x-1.5 flex-grow ml-auto pl-8 lg:pl-12">
                <button
                  id="nav-home"
                  onClick={() => handleNavClick('home')}
                  className={`lg:px-2.5 xl:px-4 py-2 rounded-xl text-[12px] lg:text-[11px] xl:text-[12.5px] font-black uppercase tracking-wider transition-all duration-200 transform-gpu cursor-pointer shrink-0 ${
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
                  className={`lg:px-2.5 xl:px-4 py-2 rounded-xl text-[12px] lg:text-[11px] xl:text-[12.5px] font-black uppercase tracking-wider transition-all duration-200 transform-gpu cursor-pointer shrink-0 ${
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
                  className={`lg:px-2.5 xl:px-4 py-2 rounded-xl text-[12px] lg:text-[11px] xl:text-[12.5px] font-black uppercase tracking-wider transition-all duration-200 transform-gpu cursor-pointer shrink-0 ${
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
                  className={`lg:px-2.5 xl:px-4 py-2 rounded-xl text-[12px] lg:text-[11px] xl:text-[12.5px] font-black uppercase tracking-wider transition-all duration-200 transform-gpu cursor-pointer shrink-0 ${
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
                  className={`lg:px-2.5 xl:px-4 py-2 rounded-xl text-[12px] lg:text-[11px] xl:text-[12.5px] font-black uppercase tracking-wider transition-all duration-200 transform-gpu cursor-pointer shrink-0 ${
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
                  className={`lg:px-2.5 xl:px-4 py-2 rounded-xl text-[12px] lg:text-[11px] xl:text-[12.5px] font-black uppercase tracking-wider transition-all duration-200 transform-gpu cursor-pointer shrink-0 flex items-center space-x-1.5 ${
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
                  className={`lg:px-3 xl:px-4.5 py-2 rounded-xl text-[12px] lg:text-[11px] xl:text-[12.5px] font-black uppercase tracking-wider transition-all duration-200 transform-gpu cursor-pointer shrink-0 ${
                    activeTab === 'contact'
                      ? 'bg-white text-brand-blue-dark shadow-md scale-105 font-black'
                      : 'bg-brand-emerald text-white hover:bg-brand-emerald-light hover:scale-105 active:scale-95'
                  }`}
                >
                  Contact
                </button>

                <button
                  id="nav-admin"
                  onClick={() => handleNavClick('admin')}
                  className={`lg:px-2.5 xl:px-4 py-2 rounded-xl text-[12px] lg:text-[11px] xl:text-[12.5px] font-black uppercase tracking-wider transition-all duration-200 transform-gpu cursor-pointer shrink-0 flex items-center space-x-1.5 ${
                    activeTab === 'admin'
                      ? 'bg-white text-emerald-600 shadow-md scale-105 font-black'
                      : isAdminLoggedIn
                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/25 hover:text-white hover:scale-105 active:scale-95'
                        : 'text-white/75 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Admin</span>
                </button>
              </nav>

              {/* Controls on the blue bar */}
              <div id="bar-controls" className="flex items-center space-x-2 ml-5 pl-5 border-l border-white/20 shrink-0">
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

        {/* Persistent Immobile Sub-navigation for Themes/Thématiques */}
        {(activeTab === 'formations' || activeTab === 'accompagnements' || activeTab === 'realisations') && (
          <div className="border-t border-b border-[#5C3725] dark:border-[#2F1A10] bg-[#45281A] dark:bg-[#21110A] py-1 sm:py-1.5 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-1.5 py-0.5">
                {/* Short intro label */}
                <span className="text-[10px] sm:text-[11px] uppercase font-black text-white tracking-wider shrink-0 mr-1.5 flex items-center space-x-1 sm:space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse shrink-0"></span>
                  <span>{selectedDomainId ? 'Spécialités :' : 'Thématiques :'}</span>
                </span>

                {/* Previous (Left) button */}
                <button
                  onClick={scrollLeft}
                  className="p-1 rounded-lg bg-[#5C3725] hover:bg-[#724630] text-white hover:scale-110 active:scale-90 border border-[#6F442E] shadow-sm cursor-pointer shrink-0 transition-all duration-200"
                  title="Précédent"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                
                {/* Scrollable Container */}
                <div 
                  ref={scrollContainerRef}
                  className="flex-grow flex items-center space-x-1.5 py-0.5 overflow-x-auto scrollbar-none scroll-smooth"
                >
                  {/* Back to Thématiques button if a domain is selected */}
                  {selectedDomainId && (
                    <button
                      onClick={() => {
                        setSelectedDomainId(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 sm:py-1.5 rounded-lg text-[10.5px] sm:text-[11px] font-bold tracking-wide transition-all duration-200 shrink-0 border border-brand-emerald/45 bg-brand-emerald/15 hover:bg-brand-emerald/25 text-brand-emerald-light flex items-center space-x-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span>← Thématiques</span>
                    </button>
                  )}

                  {!selectedDomainId ? (
                    // Default state: List 8 Thématiques
                    DOMAINS_INTERVENTION.map((domain, index) => {
                      const isSelected = selectedDomainId === domain.id;
                      
                      // Clean up or shorten title slightly if needed for better fit
                      let shortTitle = domain.title;
                      if (domain.title.toLowerCase().startsWith("ingénierie de ")) {
                        shortTitle = domain.title.substring(14).trim();
                      } else if (domain.title.toLowerCase().startsWith("ingénierie ")) {
                        shortTitle = domain.title.substring(11).trim();
                      }
                      // Capitalize first letter
                      shortTitle = shortTitle.charAt(0).toUpperCase() + shortTitle.slice(1);

                      return (
                        <button
                          key={domain.id}
                          onClick={() => {
                            setSelectedDomainId(domain.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                          className={`px-3 py-1 sm:py-1.5 rounded-lg text-[10.5px] sm:text-[11px] font-bold tracking-wide transition-all duration-200 shrink-0 border flex items-center space-x-1.5 cursor-pointer transform-gpu will-change-transform ${
                            isSelected
                              ? 'bg-white text-[#45281A] border-transparent shadow-md scale-105 font-extrabold'
                              : 'bg-white/10 text-white border-white/15 hover:bg-white/20 hover:scale-105 active:scale-95'
                          }`}
                        >
                          <span className={`font-mono text-[8px] sm:text-[8.5px] px-1 py-0.2 rounded font-bold shrink-0 ${isSelected ? 'bg-brand-emerald text-white' : 'bg-white/15 text-white'}`}>
                            0{index + 1}
                          </span>
                          <span className="whitespace-nowrap font-semibold">{shortTitle}</span>
                        </button>
                      );
                    })
                  ) : (
                    // Selected state: List Specialties (subDomains) of active domain
                    (() => {
                      const activeDomain = DOMAINS_INTERVENTION.find(d => d.id === selectedDomainId);
                      if (!activeDomain) return null;

                      return activeDomain.subDomains.map((sub, sIdx) => {
                        const cleanTitle = sub.title.replace(/^\d+\.\s*/, '');
                        return (
                          <button
                            key={sIdx}
                            onClick={() => {
                              // Scroll to or activate the specialty via event
                              const event = new CustomEvent('select-specialty', {
                                detail: { domainId: activeDomain.id, index: sIdx }
                              });
                              window.dispatchEvent(event);
                            }}
                            className="px-3 py-1 sm:py-1.5 rounded-lg text-[10.5px] sm:text-[11px] font-bold tracking-wide transition-all duration-200 shrink-0 border bg-white text-[#45281A] border-transparent hover:bg-white/95 hover:scale-105 active:scale-95 cursor-pointer flex items-center space-x-1.5 shadow-sm"
                          >
                            <span className="font-mono text-[8px] sm:text-[8.5px] px-1 py-0.2 bg-brand-emerald text-white rounded font-bold shrink-0">
                              0{sIdx + 1}
                            </span>
                            <span className="whitespace-nowrap font-semibold">{cleanTitle}</span>
                          </button>
                        );
                      });
                    })()
                  )}
                </div>

                {/* Next (Right) button */}
                <button
                  onClick={scrollRight}
                  className="p-1 rounded-lg bg-[#5C3725] hover:bg-[#724630] text-white hover:scale-110 active:scale-90 border border-[#6F442E] shadow-sm cursor-pointer shrink-0 transition-all duration-200"
                  title="Suivant"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Slide-out Menu */}
        {isOpen && (
          <div id="mobile-menu" className="lg:hidden bg-white dark:bg-[#020817] border-t border-slate-100 dark:border-white/10 shadow-xl py-4 px-4 space-y-2 max-h-[calc(100vh-100px)] overflow-y-auto">
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
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-between border-2 border-dashed border-red-500 animate-pulse bg-red-500/10 dark:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.4)] ${activeTab === 'news' ? 'text-white bg-red-600 dark:bg-red-600 border-solid animate-none' : 'text-red-600 dark:text-red-400'}`}
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

            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isAdminLoggedIn
                  ? 'text-white bg-emerald-650 hover:bg-emerald-700 shadow-md'
                  : 'text-slate-700 dark:text-slate-350 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-850'
              }`}
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>{isAdminLoggedIn ? "Administration (Console)" : "Espace Admin"}</span>
            </button>

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
                className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-base"
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
                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
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
                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
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
