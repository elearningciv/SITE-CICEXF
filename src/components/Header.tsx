import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, Sun, Moon, Sparkles, BookOpen, MapPin, Globe, Phone, GraduationCap, Layers, Award } from 'lucide-react';
import { DOMAINS_INTERVENTION, FORMATIONS } from '../data';

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
  onSearch
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [formationsMenuOpen, setFormationsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

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
    setActiveTab(tab);
    setSelectedDomainId(null);
    setIsOpen(false);
    setMegaMenuOpen(false);
    setFormationsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div id="top-bar" className="hidden lg:flex bg-brand-blue-dark text-slate-100 py-2.5 px-6 justify-between items-center text-xs font-medium border-b border-white/10 relative z-50">
        <div className="flex items-center space-x-6">
          <span className="flex items-center text-slate-300">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-brand-emerald" />
            Cocody Palmeraie, Abidjan, Côte d'Ivoire
          </span>
          <a href="tel:+2250574222246" className="flex items-center text-slate-300 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5 mr-1.5 text-brand-emerald" />
            +225 05 74 22 22 46 / +225 07 01 97 00 65
          </a>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-slate-400 font-normal">Agrément N°25343/GTCA/RC/2025</span>
          <div className="flex items-center space-x-2 border-l border-slate-700 pl-4">
            <Globe className="w-3.5 h-3.5 text-brand-emerald mr-1" />
            <span className="text-slate-200">FR</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#020817]/90 shadow-lg backdrop-blur-md py-3 border-b border-slate-200/50 dark:border-white/10'
            : 'bg-white dark:bg-[#020817] py-5 border-b border-slate-100 dark:border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
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

            {/* Desktop Navigation */}
            <nav id="desktop-nav" className="hidden lg:flex items-center space-x-1.5">
              <button
                id="nav-home"
                onClick={() => handleNavClick('home')}
                className={`px-4 py-2 rounded-lg text-[14px] font-bold tracking-wide transition-all ${
                  activeTab === 'home'
                    ? 'text-white bg-brand-blue dark:bg-brand-emerald shadow-md scale-[1.03]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-emerald-light hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                }`}
              >
                Accueil
              </button>

              <button
                id="nav-about"
                onClick={() => handleNavClick('about')}
                className={`px-4 py-2 rounded-lg text-[14px] font-bold tracking-wide transition-all ${
                  activeTab === 'about'
                    ? 'text-white bg-brand-blue dark:bg-brand-emerald shadow-md scale-[1.03]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-emerald-light hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                }`}
              >
                Qui sommes-nous
              </button>

              {/* Mega Menu Trigger */}
              <div
                id="mega-menu-trigger-container"
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button
                  id="nav-accompagnements"
                  onClick={() => handleNavClick('accompagnements')}
                  className={`px-4 py-2 rounded-lg text-[14px] font-bold tracking-wide transition-all flex items-center space-x-1 ${
                    activeTab === 'accompagnements'
                      ? 'text-white bg-brand-blue dark:bg-brand-emerald shadow-md scale-[1.03]'
                      : 'text-slate-700 dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-emerald-light hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <span>Accompagnement</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Panel */}
                {megaMenuOpen && (
                  <div id="mega-menu-panel" className="absolute left-1/2 -translate-x-1/2 mt-1 w-[800px] bg-white dark:bg-[#020817] shadow-2xl rounded-2xl border border-slate-100 dark:border-white/10 p-6 z-50 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="col-span-2 border-b border-slate-100 dark:border-white/10 pb-3 mb-1">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-brand-emerald dark:text-brand-emerald-light">
                        8 Domaines d'Accompagnement Technique
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Expertise de pointe et accompagnement des organisations
                      </p>
                    </div>
                    {DOMAINS_INTERVENTION.map((domain, index) => (
                      <div
                        key={domain.id}
                        id={`mega-item-${domain.id}`}
                        onClick={() => handleDomainClick(domain.id)}
                        className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 flex items-start space-x-3 group"
                      >
                        <span className="text-xs font-mono font-bold text-slate-300 dark:text-slate-700 mt-1 group-hover:text-brand-emerald">
                          0{index + 1}
                        </span>
                        <div>
                          <h5 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-blue dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
                            {domain.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {domain.shortDescription}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="col-span-2 bg-slate-50 dark:bg-white/5 p-3 rounded-xl flex justify-between items-center text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Besoin d'un accompagnement technique spécifique ?</span>
                      <button
                        onClick={() => handleNavClick('contact')}
                        className="text-brand-blue dark:text-brand-emerald-light font-bold hover:underline"
                      >
                        Nous contacter →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Formations Nav Button */}
              <button
                id="nav-formations"
                onClick={() => handleNavClick('formations')}
                className={`px-4 py-2 rounded-lg text-[14px] font-bold tracking-wide transition-all ${
                  activeTab === 'formations'
                    ? 'text-white bg-brand-blue dark:bg-brand-emerald shadow-md scale-[1.03]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-emerald-light hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                }`}
              >
                Formations
              </button>
              
              <button
                id="nav-realisations"
                onClick={() => handleNavClick('realisations')}
                className={`px-4 py-2 rounded-lg text-[14px] font-bold tracking-wide transition-all ${
                  activeTab === 'realisations'
                    ? 'text-white bg-brand-blue dark:bg-brand-emerald shadow-md scale-[1.03]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-emerald-light hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                }`}
              >
                Réalisations
              </button>

              <button
                id="nav-news"
                onClick={() => handleNavClick('news')}
                className={`px-4 py-2 rounded-lg text-[14px] font-bold tracking-wide transition-all flex items-center space-x-2 border-2 border-dashed border-red-500 animate-pulse bg-red-500/10 dark:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.4)] ${
                  activeTab === 'news'
                    ? 'text-white bg-red-600 dark:bg-red-600 border-solid animate-none shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-[1.03]'
                    : 'text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white'
                }`}
              >
                <span>Actualités</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
              </button>

              <button
                id="nav-partners"
                onClick={() => handleNavClick('partners')}
                className={`px-4 py-2 rounded-lg text-[14px] font-bold tracking-wide transition-all ${
                  activeTab === 'partners'
                    ? 'text-white bg-brand-blue dark:bg-brand-emerald shadow-md scale-[1.03]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-emerald-light hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                }`}
              >
                Partenaires
              </button>

              <button
                id="nav-contact"
                onClick={() => handleNavClick('contact')}
                className={`ml-2 px-4 py-2 rounded-lg text-[14px] font-bold tracking-wide transition-all text-white bg-gradient-to-r from-brand-blue to-brand-emerald hover:shadow-md hover:scale-[1.05] ${
                  activeTab === 'contact' ? 'ring-4 ring-brand-emerald/50 dark:ring-brand-emerald-light/50 scale-[1.05]' : ''
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Utility Icons & Custom Themes Controls */}
            <div id="header-controls" className="hidden lg:flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              {/* Search Toggle */}
              <button
                id="search-btn-toggle"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-slate-500 hover:text-brand-blue dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Rechercher sur le site"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Customizer Switcher */}
              <div className="relative group/theme">
                <button
                  id="theme-btn-customizer"
                  className="p-2 rounded-lg text-slate-500 hover:text-brand-blue dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-0.5"
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

              {/* Light/Dark Toggle */}
              <button
                id="dark-mode-btn-toggle"
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-slate-500 hover:text-brand-blue dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title={darkMode ? 'Passer au mode clair' : 'Passer au mode sombre'}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>
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
                id="dark-mode-mobile-btn"
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
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

            {/* Mobile Accompagnements Expandable list */}
            <div className="space-y-1">
              <span className="block px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Domaines d'Accompagnement
              </span>
              {DOMAINS_INTERVENTION.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => handleDomainClick(domain.id)}
                  className="block w-full text-left pl-6 pr-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-blue"
                >
                  • {domain.title}
                </button>
              ))}
            </div>

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
              onClick={() => handleNavClick('partners')}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold ${activeTab === 'partners' ? 'bg-slate-100 dark:bg-slate-800 text-brand-blue' : 'text-slate-700 dark:text-slate-300'}`}
            >
              Espace Partenaires
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="block w-full text-center py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-brand-blue to-brand-emerald"
            >
              Contactez-nous
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
            <div className="p-4 text-xs text-slate-500 dark:text-slate-400">
              <span>Suggestions rapides : </span>
              <button type="button" onClick={() => { setSearchQuery('Data Analyst'); }} className="mx-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-white/10 hover:bg-brand-emerald hover:text-white transition-colors">Data Analyst</button>
              <button type="button" onClick={() => { setSearchQuery('QHSE'); }} className="mx-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-white/10 hover:bg-brand-emerald hover:text-white transition-colors">QHSE</button>
              <button type="button" onClick={() => { setSearchQuery('KoboCollect'); }} className="mx-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-white/10 hover:bg-brand-emerald hover:text-white transition-colors">KoboCollect</button>
              <button type="button" onClick={() => { setSearchQuery('Audit'); }} className="mx-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-white/10 hover:bg-brand-emerald hover:text-white transition-colors">Audit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
