import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  TrendingUp, 
  Cpu, 
  Map, 
  ShieldAlert, 
  FileSpreadsheet, 
  Layers, 
  Users, 
  CheckSquare, 
  ArrowRight, 
  ArrowLeft,
  CornerDownRight,
  Compass,
  Landmark,
  BarChart2,
  Network,
  Shield,
  Zap,
  Settings,
  Award,
  CheckCircle2,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Target,
  Eye,
  EyeOff,
  Briefcase,
  Sparkles,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import { DOMAINS_INTERVENTION } from '../data';
import { DomainIntervention, SoftwareTool } from '../types';
import { ACCOMPANIMENT_ENRICHMENTS } from '../data/accompanimentEnrichments';
import { PRESET_SOFTWARE_TOOLS } from '../data/softwarePresets';
import InteractiveSectionTabs from './InteractiveSectionTabs';
import { buildAccompanimentTabSections } from '../lib/interactiveTabsHelper';

interface InterventionsProps {
  selectedDomainId: string | null;
  setSelectedDomainId: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
  setPreselectedDomain: (domain: string) => void;
  domains?: DomainIntervention[];
}

export default function Interventions({
  selectedDomainId,
  setSelectedDomainId,
  setActiveTab,
  setPreselectedDomain,
  domains
}: InterventionsProps) {
  const allDomains = domains && domains.length > 0 ? domains : DOMAINS_INTERVENTION;
  const [subTabMap, setSubTabMap] = useState<Record<number, string>>({});
  const [activeSubIdx, setActiveSubIdx] = useState<number | null>(null);

  // Reset active sub-domain when switching domains
  useEffect(() => {
    setActiveSubIdx(null);
  }, [selectedDomainId]);

  // Handle specialty selection from the header's brown sub-navigation band
  useEffect(() => {
    const handleSelectSpecialty = (e: Event) => {
      const customEvent = e as CustomEvent<{ domainId: string; index: number }>;
      if (customEvent && customEvent.detail) {
        const { domainId, index } = customEvent.detail;
        
        // Ensure the domain is selected and show this specialty exclusively
        setSelectedDomainId(domainId);
        setActiveSubIdx(index);

        // Wait for state to render, then scroll to the specific sub-domain card
        setTimeout(() => {
          const cardId = `sub-point-card-${domainId}-${index}`;
          const element = document.getElementById(cardId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Momentary premium border/shadow highlight effect for visual confirmation
            element.classList.add('ring-2', 'ring-brand-emerald', 'scale-101', 'shadow-md');
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-brand-emerald', 'scale-101', 'shadow-md');
            }, 1800);
          }
        }, 300);
      }
    };

    window.addEventListener('select-specialty', handleSelectSpecialty);
    return () => window.removeEventListener('select-specialty', handleSelectSpecialty);
  }, [setSelectedDomainId]);

  const handleRequestAssistance = (title: string) => {
    // Map full domain title to simpler category name for contact form select
    let category = 'Consultance';
    if (title.toLowerCase().includes('formation')) category = 'Formation';
    else if (title.toLowerCase().includes('expert')) category = 'Expertise';
    
    setPreselectedDomain(category);
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to render lucide icon dynamically based on string name
  const renderIcon = (name: string, className: string = "w-5 h-5") => {
    switch (name) {
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Map': return <Map className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'FileSpreadsheet': return <FileSpreadsheet className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'Landmark': return <Landmark className={className} />;
      case 'BarChart2': return <BarChart2 className={className} />;
      case 'Network': return <Network className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Settings': return <Settings className={className} />;
      case 'Award': return <Award className={className} />;
      case 'CheckCircle2': return <CheckCircle2 className={className} />;
      case 'Target': return <Target className={className} />;
      default: return <Cpu className={className} />;
    }
  };

  const domainIllustrations: Record<string, string> = {
    'ing-formation': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    'ing-financiere': 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=1200&q=80',
    'ing-informatique': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'ing-territoriale': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
    'ing-qhse': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    'ing-audit': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    'ing-projets': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    'ing-accompagnement': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  };

  const selectedDomainObj = allDomains.find(d => d.id === selectedDomainId) || null;

  return (
    <div id="accompagnements-view" className="pt-4 pb-8 bg-white dark:bg-slate-950 font-sans min-h-screen">
      <div className={`${activeSubIdx !== null ? 'w-full max-w-[1850px] px-3 sm:px-6 lg:px-10' : 'max-w-7xl px-4 sm:px-6 lg:px-8'} mx-auto`}>
        
        {/* 1. List of Accompanying Domains (If none selected) */}
        {!selectedDomainObj ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Grid display of all major domains simultaneously */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {allDomains.map((domain, index) => {
                const displayNum = `0${index + 1}`;
                return (
                  <div
                    key={domain.id}
                    id={`domain-card-accomp-${domain.id}`}
                    onClick={() => {
                      setSelectedDomainId(domain.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-black/30 dark:hover:border-white/30 transition-all flex flex-col justify-between cursor-pointer group h-full relative overflow-hidden"
                  >
                    {/* Domain Cover Image with text overlay in white */}
                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        src={domainIllustrations[domain.id] || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"}
                        alt={domain.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent"></div>
                      
                      {/* Title and Badge on image - ensuring text is white */}
                      <div className="absolute bottom-3 left-4 right-4 flex flex-col space-y-1 z-10">
                        <span className="self-start font-mono font-bold text-[11px] text-white bg-brand-emerald/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          Domaine {displayNum}
                        </span>
                        <h3 className="font-display font-extrabold text-[12px] sm:text-[13px] text-white leading-tight drop-shadow-md">
                          {domain.title}
                        </h3>
                      </div>

                      {/* Floating Icon */}
                      <div className="absolute top-3 left-3 p-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white shadow-sm">
                        {renderIcon(domain.iconName, "w-3.5 h-3.5")}
                      </div>
                    </div>

                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <p className="text-[11px] text-black dark:text-white font-sans font-medium leading-relaxed line-clamp-3">
                          {domain.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                      <span className="font-bold text-black dark:text-white flex items-center">
                        <Layers className="w-3.5 h-3.5 mr-1 text-black dark:text-white" />
                        {domain.subDomains?.length || 0} axes
                      </span>
                      <span className="font-extrabold text-black dark:text-white flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                        <span>Découvrir</span>
                        <ChevronRight className="w-3.5 h-3.5 text-black dark:text-white" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* General Contact banner under grid */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-md border border-slate-800">
              <div className="space-y-1.5 text-center md:text-left">
                <h4 className="font-display font-bold text-base text-white">Vous souhaitez obtenir un accompagnement sur-mesure ?</h4>
                <p className="text-xs text-slate-300 dark:text-slate-300 font-sans leading-relaxed">Le cabinet CICEXF déploie ses experts pour auditer vos structures et conseiller vos directions techniques.</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold rounded-xl text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-lg hover:shadow-brand-emerald/20"
              >
                Prendre contact
              </button>
            </div>
          </div>
        ) : (
          // 2. Detailed view for selected General Accompanying Domain
          <div className="space-y-6 animate-in fade-in duration-300 font-sans">
            
            {/* Back Button and Domain Hero Header (Masked when a specialty is selected) */}
            {activeSubIdx === null && (
              <>
                <div>
                  <button
                    onClick={() => {
                      setSelectedDomainId(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center space-x-2 text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:text-brand-emerald dark:hover:text-brand-emerald-light hover:bg-slate-100 dark:hover:bg-slate-800 transition-all py-1.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                    <span>Retourner aux domaines d'accompagnement</span>
                  </button>
                </div>

                {/* Beautiful Modern Domain Hero Header with top image banner */}
                <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-300">
                  <img
                    src={domainIllustrations[selectedDomainObj.id] || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'}
                    alt={selectedDomainObj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent flex flex-col justify-end p-4 sm:p-6 space-y-2">
                    <div className="inline-flex items-center space-x-2 bg-brand-emerald/25 text-brand-emerald-light border border-brand-emerald/35 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest self-start">
                      {renderIcon(selectedDomainObj.iconName, "w-3.5 h-3.5 mr-1")}
                      <span>Ingénierie CICEXF &bull; Accompagnement</span>
                    </div>
                    <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight text-white max-w-4xl">
                      {selectedDomainObj.title}
                    </h1>
                  </div>
                </div>
              </>
            )}

            {/* Sub-domains (axes) representation */}
            <div className="space-y-6">

              {activeSubIdx === null ? (
                /* MINIATURES GRID - ALL SPECIALTIES WITH SHORT DESCRIPTION */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedDomainObj.subDomains.map((sub, sIdx) => {
                    const enrichments = ACCOMPANIMENT_ENRICHMENTS[selectedDomainObj.id];
                    const enrichment = enrichments && enrichments[sIdx];
                    const finalIconName = enrichment ? enrichment.iconName : (sub.iconName || 'CheckSquare');
                    const finalImageUrl = enrichment ? enrichment.imageUrl : sub.imageUrl;
                    const presentationService = sub.presentationService || enrichment?.presentationService || sub.description || enrichment?.diversifiedDescription || selectedDomainObj.shortDescription;

                    return (
                      <div
                        key={sIdx}
                        onClick={() => {
                          setActiveSubIdx(sIdx);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#8A1A24]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          {/* Miniature top image with badge */}
                          {finalImageUrl && (
                            <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                              <img
                                src={finalImageUrl}
                                alt={sub.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
                              <div className="absolute bottom-3 left-4 right-4 flex flex-col space-y-1 z-10">
                                <span className="self-start font-mono font-bold text-[11px] text-white bg-[#8A1A24] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                  Axe #0{sIdx + 1} &bull; CICEXF
                                </span>
                              </div>
                              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-sm">
                                {renderIcon(finalIconName, "w-4 h-4 text-[#F25C05]")}
                              </div>
                            </div>
                          )}

                          {/* Content: Title & Short Description */}
                          <div className="p-5 space-y-3">
                            <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight group-hover:text-[#8A1A24] dark:group-hover:text-red-400 transition-colors">
                              {sub.title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-355 line-clamp-3 leading-relaxed">
                              {presentationService}
                            </p>
                          </div>
                        </div>

                        {/* Action link */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-xs text-[#8A1A24] dark:text-red-400 font-extrabold uppercase tracking-wider flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                            <span>Consulter la spécialité</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-[11px] bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md uppercase">
                            Détails &amp; Inscription
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* SINGLE SELECTED SPECIALTY IN FULL SCREEN WIDTH - UNSELECTED SPECIALTIES HIDDEN */
                (() => {
                  const sIdx = activeSubIdx;
                  const sub = selectedDomainObj.subDomains[sIdx];
                  if (!sub) return null;

                  const enrichments = ACCOMPANIMENT_ENRICHMENTS[selectedDomainObj.id];
                  const enrichment = enrichments && enrichments[sIdx];
                  const finalIconName = enrichment ? enrichment.iconName : (sub.iconName || 'CheckSquare');
                  const finalImageUrl = enrichment ? enrichment.imageUrl : sub.imageUrl;
                  const presentationService = sub.presentationService || enrichment?.presentationService || sub.description || enrichment?.diversifiedDescription || selectedDomainObj.shortDescription;
                  const sections = buildAccompanimentTabSections(sub, selectedDomainObj);

                  return (
                    <div className="w-full space-y-4 animate-in fade-in duration-300">
                      {/* Back button to return to all miniatures */}
                      <div className="flex items-center justify-between pb-1">
                        <button
                          onClick={() => setActiveSubIdx(null)}
                          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#8A1A24] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm cursor-pointer active:scale-95"
                        >
                          <ArrowLeft className="w-4 h-4 text-[#8A1A24]" />
                          <span>← Revenir aux miniatures des spécialités</span>
                        </button>
                        <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                          Spécialité 0{sIdx + 1} sur {selectedDomainObj.subDomains.length}
                        </span>
                      </div>

                      {/* Selected specialty full-width card */}
                      <div
                        id={`sub-point-card-${selectedDomainObj.id}-${sIdx}`}
                        className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-2xl space-y-0"
                      >
                        {/* Immersive Full Header Banner */}
                        {finalImageUrl && (
                          <div className="relative h-52 sm:h-64 lg:h-72 w-full overflow-hidden bg-slate-950">
                            <img
                              src={finalImageUrl}
                              alt={sub.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                            
                            <div className="absolute bottom-5 left-6 right-6 flex flex-col space-y-2 z-10">
                              <span className="self-start font-mono font-bold text-[11px] sm:text-xs text-white bg-[#8A1A24] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                                Axe #0{sIdx + 1} &bull; Accompagnement CICEXF
                              </span>
                              <h2 className="font-display font-extrabold text-lg sm:text-2xl lg:text-3xl text-white leading-tight drop-shadow-md max-w-4xl">
                                {sub.title}
                              </h2>
                            </div>

                            <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-md">
                              {renderIcon(finalIconName, "w-5 h-5 text-[#F25C05]")}
                            </div>
                          </div>
                        )}

                        {/* Interactive Section Tabs with Details on Left and Vertical Burgundy Menu on Right */}
                        <div className="p-0 border-t border-slate-100 dark:border-slate-800">
                          <InteractiveSectionTabs
                            description={presentationService}
                            sections={sections}
                            defaultTabId="description"
                            activeTabId={subTabMap[sIdx] || 'description'}
                            onTabChange={(tabId) => setSubTabMap(prev => ({ ...prev, [sIdx]: tabId }))}
                            onActionClick={() => {
                              setSubTabMap(prev => ({ ...prev, [sIdx]: 'sinscrire' }));
                            }}
                            actionLabel="S'inscrire / Demander un devis"
                            borderless={true}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Main Action Call Grid block (Only on miniatures view) */}
            {activeSubIdx === null && (
              <div className="bg-gradient-to-r from-brand-blue to-brand-emerald rounded-2xl p-5 sm:p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-sm sm:text-base text-white">Vous souhaitez faire auditer vos processus ou former vos équipes ?</h4>
                  <p className="text-xs text-white/80 font-sans">Prenez contact pour obtenir une proposition technique et commerciale sur-mesure.</p>
                </div>
                <button
                  onClick={() => handleRequestAssistance(selectedDomainObj.title)}
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider text-white shrink-0 transition-colors cursor-pointer"
                >
                  Demander un accompagnement
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
