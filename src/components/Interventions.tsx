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
  Sparkles
} from 'lucide-react';
import { DOMAINS_INTERVENTION } from '../data';
import { ACCOMPANIMENT_ENRICHMENTS } from '../data/accompanimentEnrichments';

interface InterventionsProps {
  selectedDomainId: string | null;
  setSelectedDomainId: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
  setPreselectedDomain: (domain: string) => void;
}

export default function Interventions({
  selectedDomainId,
  setSelectedDomainId,
  setActiveTab,
  setPreselectedDomain
}: InterventionsProps) {

  // Handle specialty selection from the header's brown sub-navigation band
  useEffect(() => {
    const handleSelectSpecialty = (e: Event) => {
      const customEvent = e as CustomEvent<{ domainId: string; index: number }>;
      if (customEvent && customEvent.detail) {
        const { domainId, index } = customEvent.detail;
        
        // Ensure the domain is selected
        setSelectedDomainId(domainId);

        // Wait for state to render, then scroll to the specific sub-domain card
        setTimeout(() => {
          const cardId = `sub-point-card-${domainId}-${index}`;
          const element = document.getElementById(cardId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
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

  const selectedDomainObj = DOMAINS_INTERVENTION.find(d => d.id === selectedDomainId) || null;

  return (
    <div id="accompagnements-view" className="pt-6 pb-16 bg-slate-50 dark:bg-slate-50 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. List of Accompanying Domains (If none selected) */}
        {!selectedDomainObj ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header section matching Formations layout */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-900 tracking-tight leading-none">
                Offres d'Ingénierie &amp; d'Accompagnement Technique
              </h1>
              <div className="w-16 h-1 bg-brand-emerald rounded-full"></div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-900 font-sans font-medium leading-relaxed max-w-2xl">
                Accompagnez la transformation de votre organisation grâce à l'expertise de pointe du CICEXF à travers nos grands pôles de conseil stratégique et technique.
              </p>
            </div>

            {/* Grid display of all major domains simultaneously */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DOMAINS_INTERVENTION.map((domain, index) => {
                const displayNum = `0${index + 1}`;
                return (
                  <div
                    key={domain.id}
                    id={`domain-card-accomp-${domain.id}`}
                    onClick={() => {
                      setSelectedDomainId(domain.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white dark:bg-white rounded-xl border border-slate-250 dark:border-slate-300 shadow-sm hover:shadow-xl hover:border-brand-emerald/40 transition-all flex flex-col justify-between cursor-pointer group h-full relative overflow-hidden"
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
                        <span className="self-start font-mono font-bold text-[9px] text-white bg-brand-emerald/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
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
                        <p className="text-[11px] text-black dark:text-black font-sans font-medium leading-relaxed line-clamp-3 text-justify">
                          {domain.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-3 border-t border-slate-100 dark:border-slate-200 flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-900 dark:text-slate-900 flex items-center">
                        <Layers className="w-3.5 h-3.5 mr-1 text-brand-emerald" />
                        {domain.subDomains.length} axes
                      </span>
                      <span className="font-bold text-brand-emerald flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                        <span>Découvrir</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* General Contact banner under grid */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-md border border-slate-800">
              <div className="space-y-1.5 text-center md:text-left">
                <h4 className="font-display font-bold text-base text-white">Vous souhaitez obtenir un accompagnement sur-mesure ?</h4>
                <p className="text-xs text-slate-300 dark:text-slate-300 font-sans leading-relaxed">Le cabinet CICEXF déploie ses experts pour auditer vos structures et conseiller vos directions techniques.</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold rounded-xl text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-lg hover:shadow-brand-emerald/20"
              >
                Prendre contact
              </button>
            </div>
          </div>
        ) : (
          // 2. Detailed view for selected General Accompanying Domain
          <div className="space-y-12 animate-in fade-in duration-300 font-sans">
            
            {/* Back Button to list of domains */}
            <div>
              <button
                onClick={() => {
                  setSelectedDomainId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 text-[11px] font-bold text-slate-900 dark:text-slate-900 hover:text-brand-emerald hover:bg-slate-100 dark:hover:bg-slate-100 transition-all py-1.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-white dark:bg-white shadow-sm cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-900" />
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
                <div className="inline-flex items-center space-x-2 bg-brand-emerald/25 text-brand-emerald-light border border-brand-emerald/35 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest self-start">
                  {renderIcon(selectedDomainObj.iconName, "w-3.5 h-3.5 mr-1")}
                  <span>Ingénierie CICEXF &bull; Accompagnement</span>
                </div>
                <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight text-white max-w-4xl">
                  {selectedDomainObj.title}
                </h1>
              </div>
            </div>

            {/* Description & KPI Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 bg-white dark:bg-white rounded-xl p-5 border border-slate-200/50 dark:border-slate-300 shadow-sm flex flex-col justify-center">
                <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-brand-emerald mb-1">Présentation du pôle d'excellence</h3>
                <p className="text-xs text-black dark:text-black font-sans font-semibold leading-relaxed text-justify">
                  {selectedDomainObj.description}
                </p>
              </div>

              <div className="lg:col-span-4 bg-slate-900 text-white border border-slate-800 p-5 rounded-xl flex flex-col justify-center space-y-3 font-sans">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Indicateurs d'Impact</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-l-2 border-brand-emerald pl-3">
                    <span className="block text-lg font-bold font-mono text-white">100%</span>
                    <span className="block text-[8px] text-slate-400 uppercase">Pratique</span>
                  </div>
                  <div className="border-l-2 border-brand-blue pl-3">
                    <span className="block text-lg font-bold font-mono text-white">Sur-mesure</span>
                    <span className="block text-[8px] text-slate-400 uppercase">Approche</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-domains (axes) grid representation */}
            <div className="space-y-6">
              <div className="space-y-1 text-center max-w-xl mx-auto">
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-900 tracking-tight">
                  Axes d'Accompagnement Technique &amp; Composantes
                </h2>
                <p className="text-[9px] uppercase font-bold text-brand-emerald tracking-widest">
                  Découvrez la structure opérationnelle et les compétences clés associées :
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {selectedDomainObj.subDomains.map((sub, sIdx) => {
                  const enrichments = ACCOMPANIMENT_ENRICHMENTS[selectedDomainObj.id];
                  const enrichment = enrichments && enrichments[sIdx];
                  const finalDescription = enrichment ? enrichment.diversifiedDescription : sub.description;
                  const finalIconName = enrichment ? enrichment.iconName : 'CheckSquare';
                  const finalImageUrl = enrichment ? enrichment.imageUrl : sub.imageUrl;
                  const objectives = enrichment ? enrichment.objectives : [];
                  const expectedChanges = enrichment ? enrichment.expectedChanges : null;

                  return (
                    <div
                      key={sIdx}
                      id={`sub-point-card-${selectedDomainObj.id}-${sIdx}`}
                      className="bg-white dark:bg-white rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-300 shadow-sm flex flex-col justify-between group h-full transition-all duration-300 hover:shadow-lg"
                    >
                      <div>
                        {/* Sub-element/Minor line image */}
                        {finalImageUrl && (
                          <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-100">
                            <img
                              src={finalImageUrl}
                              alt={sub.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent"></div>
                            
                            {/* Title and Badge on image - ensuring text is white */}
                            <div className="absolute bottom-3 left-4 right-4 flex flex-col space-y-1 z-10">
                              <span className="self-start font-mono font-bold text-[8px] text-white bg-brand-emerald/90 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                Axe #0{sIdx + 1}
                              </span>
                              <h4 className="font-display font-extrabold text-[11.5px] sm:text-[12.5px] text-white leading-tight drop-shadow-md">
                                {sub.title}
                              </h4>
                            </div>

                            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/25 text-white flex items-center justify-center">
                              {renderIcon(finalIconName, "w-3.5 h-3.5 text-brand-emerald-light")}
                            </div>
                          </div>
                        )}

                        <div className="p-4 sm:p-5 space-y-3">
                          <p className="text-xs text-black dark:text-black leading-relaxed font-sans font-medium text-justify">
                            {finalDescription}
                          </p>

                          {/* Operational Objectives */}
                          {objectives && objectives.length > 0 && (
                            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-200 space-y-1.5">
                              <span className="text-[9px] font-extrabold text-brand-emerald dark:text-brand-emerald uppercase tracking-widest flex items-center">
                                <Target className="w-3 h-3 mr-1 shrink-0" />
                                Objectifs opérationnels
                              </span>
                              <div className="grid grid-cols-1 gap-1">
                                {objectives.map((obj, oIdx) => (
                                  <div key={oIdx} className="flex items-start text-black dark:text-black">
                                    <CheckCircle className="w-3 h-3 text-brand-emerald mr-2 shrink-0 mt-0.5" />
                                    <span className="leading-snug text-[10.5px] font-semibold font-sans">{obj}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Expected Changes and Transformation */}
                          {expectedChanges && (
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-100 border border-slate-200 dark:border-slate-300 space-y-0.5">
                              <span className="text-[9px] font-extrabold text-brand-blue dark:text-brand-blue uppercase tracking-widest flex items-center">
                                <Award className="w-3 h-3 mr-1 shrink-0" />
                                Impact pour l'entité
                              </span>
                              <p className="text-[10.5px] text-black dark:text-black leading-relaxed font-sans font-bold text-justify">
                                {expectedChanges}
                              </p>
                            </div>
                          )}

                          {/* Associated Key Skills (original keyPoints) */}
                          {sub.keyPoints && sub.keyPoints.length > 0 && (
                            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-200 space-y-1">
                              <span className="block text-[8.5px] font-extrabold text-slate-900 dark:text-slate-900 uppercase tracking-widest">
                                Savoir-faire clé associés :
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {sub.keyPoints.slice(0, 3).map((point, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className="bg-slate-100 dark:bg-slate-100 text-slate-900 dark:text-slate-900 text-[8.5px] font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-300"
                                  >
                                    {point}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-50 border-t border-slate-100 dark:border-slate-200 flex items-center justify-between">
                        <span className="text-[9px] text-slate-800 dark:text-slate-800 font-bold font-sans uppercase">Expert CICEXF</span>
                        <button
                          onClick={() => handleRequestAssistance(`${selectedDomainObj.title} - ${sub.title}`)}
                          className="px-3 py-1.5 bg-white dark:bg-white border border-slate-200 dark:border-slate-300 hover:bg-brand-emerald hover:text-white dark:hover:bg-brand-emerald text-slate-900 dark:text-slate-900 rounded-lg text-[9px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Demander</span>
                          <ChevronRight className="w-3 h-3 text-slate-900" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Concrete examples of recent accompaniments */}
            {selectedDomainObj.examples && selectedDomainObj.examples.length > 0 && (
              <div className="bg-white dark:bg-white rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-300 shadow-sm space-y-3">
                <h3 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-900 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-brand-emerald" />
                  Exemples d'accompagnements récents réalisés
                </h3>
                <ul className="space-y-2 text-xs leading-relaxed">
                  {selectedDomainObj.examples.map((ex, exIdx) => (
                    <li key={exIdx} className="flex items-start text-black dark:text-black font-sans font-medium">
                      <CornerDownRight className="w-3.5 h-3.5 text-brand-emerald mr-2.5 shrink-0 mt-0.5" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Action Call Grid block */}
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

          </div>
        )}

      </div>
    </div>
  );
}
