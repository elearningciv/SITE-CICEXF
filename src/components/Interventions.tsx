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
  // We manage which domains are expanded as a dictionary
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>(() => {
    // If there's a selectedDomainId from navigation, start with that one expanded!
    if (selectedDomainId) {
      return { [selectedDomainId]: true };
    }
    // Otherwise, expand the first domain by default to show some immediate content, but keep all major lines visible!
    return { [DOMAINS_INTERVENTION[0].id]: true };
  });

  // Keep expandedDomains synchronized with selectedDomainId updates (like if clicking from mega-menu)
  useEffect(() => {
    if (selectedDomainId) {
      setExpandedDomains(prev => ({
        ...prev,
        [selectedDomainId]: true
      }));
      
      // Smooth scroll to the expanded domain card
      setTimeout(() => {
        const element = document.getElementById(`major-line-card-${selectedDomainId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [selectedDomainId]);

  const toggleDomain = (domainId: string) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domainId]: !prev[domainId]
    }));
  };

  const handleExpandAll = () => {
    const allExpanded = DOMAINS_INTERVENTION.reduce((acc, domain) => {
      acc[domain.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedDomains(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedDomains({});
  };

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

  return (
    <div id="accompagnements-view" className="py-16 bg-slate-50 dark:bg-slate-950 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-12">
          <nav className="flex text-xs font-semibold text-slate-400 mb-2">
            <span>CICEXF</span>
            <span className="mx-2">/</span>
            <span className="text-brand-emerald">Nos domaines d'accompagnement</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Offres d'Ingénierie &amp; d'Accompagnement Technique
              </h1>
              <div className="w-16 h-1.5 bg-brand-emerald mt-4 rounded-full"></div>
            </div>
            
            {/* Quick Expand/Collapse Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleExpandAll}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold shadow-sm hover:border-brand-emerald hover:text-brand-emerald transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Tout étendre</span>
              </button>
              <button
                onClick={handleCollapseAll}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold shadow-sm hover:border-red-500/30 hover:text-red-500 transition-all cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
                <span>Tout réduire</span>
              </button>
            </div>
          </div>
        </div>

        {/* Major Lines List Container */}
        <div className="flex flex-col gap-8 w-full">
          {DOMAINS_INTERVENTION.map((domain, idx) => {
            const isExpanded = !!expandedDomains[domain.id];
            
            return (
              <div 
                key={domain.id}
                id={`major-line-card-${domain.id}`}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Clickable Header Trigger Area */}
                <div 
                  onClick={() => toggleDomain(domain.id)}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 group"
                  title="Cliquez pour afficher ou masquer les composantes de ce domaine"
                >
                  {/* Image of the major line */}
                  <div className="lg:col-span-4 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-48 rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-850">
                    <img
                      src={domainIllustrations[domain.id] || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80'}
                      alt={domain.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent"></div>
                    <span className="absolute bottom-3 left-3 font-mono font-bold text-[10px] text-white bg-brand-emerald/90 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Pôle #0{idx + 1}
                    </span>
                  </div>

                  {/* Description and titles */}
                  <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-brand-emerald dark:text-brand-emerald-light text-xs font-bold uppercase tracking-wider">
                        {renderIcon(domain.iconName, "w-4.5 h-4.5")}
                        <span>Ingénierie CICEXF</span>
                      </div>
                      <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-955 dark:text-white group-hover:text-brand-blue dark:group-hover:text-blue-400 transition-colors">
                        {domain.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium text-justify">
                        {domain.shortDescription}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400 dark:text-slate-500 font-bold">
                        <Layers className="w-4 h-4 text-brand-emerald" />
                        <span>{domain.subDomains.length} Axes d'accompagnement</span>
                      </div>

                      <div className="flex items-center text-xs font-bold text-brand-blue dark:text-blue-400 gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>{isExpanded ? "Masquer les composantes" : "Afficher les composantes"}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Sub-elements Area (the minor lines) */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 p-6 sm:p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    
                    {/* General presentation of this Pole */}
                    <div className="space-y-2">
                      <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-brand-emerald dark:text-brand-emerald-light flex items-center">
                        <span className="w-1.5 h-3 bg-brand-emerald mr-2 rounded-sm inline-block"></span>
                        Présentation du pôle d'excellence
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium text-justify bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
                        {domain.description}
                      </p>
                    </div>

                    {/* Sub-domains (axes) representation */}
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center">
                          <span className="w-1.5 h-3 bg-brand-emerald mr-2 rounded-sm inline-block"></span>
                          Axes d'Accompagnement Technique &amp; Composantes
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                          Découvrez la structure opérationnelle et les compétences clés associées :
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {domain.subDomains.map((sub, sIdx) => {
                          const enrichments = ACCOMPANIMENT_ENRICHMENTS[domain.id];
                          const enrichment = enrichments && enrichments[sIdx];
                          const finalDescription = enrichment ? enrichment.diversifiedDescription : sub.description;
                          const finalIconName = enrichment ? enrichment.iconName : 'CheckSquare';
                          const finalImageUrl = enrichment ? enrichment.imageUrl : sub.imageUrl;
                          const objectives = enrichment ? enrichment.objectives : [];
                          const expectedChanges = enrichment ? enrichment.expectedChanges : null;

                          return (
                            <div
                              key={sIdx}
                              id={`sub-point-card-${domain.id}-${sIdx}`}
                              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800 shadow-sm flex flex-col justify-between group h-full transition-all duration-300 hover:shadow-lg"
                            >
                              <div>
                                {/* Sub-element/Minor line image */}
                                {finalImageUrl && (
                                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-850">
                                    <img
                                      src={finalImageUrl}
                                      alt={sub.title}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
                                    <span className="absolute bottom-4 left-4 font-mono font-bold text-[10px] text-white bg-brand-emerald/90 backdrop-blur-sm px-3 py-1 rounded-full uppercase">
                                      Axe #0{sIdx + 1}
                                    </span>
                                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/25 text-white flex items-center justify-center">
                                      {renderIcon(finalIconName, "w-4 h-4 text-brand-emerald-light")}
                                    </div>
                                  </div>
                                )}

                                <div className="p-6 sm:p-7 space-y-4">
                                  <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-955 dark:text-white leading-snug">
                                    {sub.title}
                                  </h4>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans text-justify">
                                    {finalDescription}
                                  </p>

                                  {/* Operational Objectives */}
                                  {objectives && objectives.length > 0 && (
                                    <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/65 space-y-2">
                                      <span className="text-[10px] font-extrabold text-brand-emerald dark:text-brand-emerald-light uppercase tracking-widest flex items-center">
                                        <Target className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                        Objectifs opérationnels
                                      </span>
                                      <div className="grid grid-cols-1 gap-1.5">
                                        {objectives.map((obj, oIdx) => (
                                          <div key={oIdx} className="flex items-start text-slate-600 dark:text-slate-400">
                                            <CheckCircle className="w-3.5 h-3.5 text-brand-emerald mr-2 shrink-0 mt-0.5" />
                                            <span className="leading-snug text-[11px] font-medium font-sans">{obj}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Expected Changes and Transformation */}
                                  {expectedChanges && (
                                    <div className="p-3.5 rounded-2xl bg-emerald-50/20 dark:bg-brand-emerald/5 border border-brand-emerald/10 space-y-1">
                                      <span className="text-[10px] font-extrabold text-brand-blue dark:text-blue-450 uppercase tracking-widest flex items-center">
                                        <Award className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                        Impact pour l'entité
                                      </span>
                                      <p className="text-[11px] text-slate-700 dark:text-slate-350 leading-relaxed font-sans font-semibold text-justify">
                                        {expectedChanges}
                                      </p>
                                    </div>
                                  )}

                                  {/* Associated Key Skills (original keyPoints) */}
                                  {sub.keyPoints && sub.keyPoints.length > 0 && (
                                    <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/65 space-y-1.5">
                                      <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                        Savoir-faire clé associés :
                                      </span>
                                      <div className="flex flex-wrap gap-1">
                                        {sub.keyPoints.slice(0, 3).map((point, pIdx) => (
                                          <span
                                            key={pIdx}
                                            className="bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-[9px] font-bold px-2.5 py-1 rounded-lg border border-slate-150 dark:border-slate-750/30"
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
                              <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850/60 flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 font-sans uppercase">Expert CICEXF</span>
                                <button
                                  onClick={() => handleRequestAssistance(`${domain.title} - ${sub.title}`)}
                                  className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-brand-emerald hover:text-white dark:hover:bg-brand-emerald text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
                                >
                                  <span>Demander</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Concrete examples of recent accompaniments */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-inner space-y-3.5">
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-brand-emerald" />
                        Exemples d'accompagnements récents réalisés
                      </h3>
                      <ul className="space-y-2.5 text-xs leading-relaxed">
                        {domain.examples.map((ex, exIdx) => (
                          <li key={exIdx} className="flex items-start text-slate-800 dark:text-slate-200 font-sans font-normal">
                            <CornerDownRight className="w-3.5 h-3.5 text-brand-emerald mr-2.5 shrink-0 mt-0.5" />
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Main Action Call Grid block */}
                    <div className="bg-gradient-to-r from-brand-blue to-brand-emerald rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-md">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base">Vous souhaitez faire auditer vos processus ou former vos équipes ?</h4>
                        <p className="text-xs text-white/80 font-sans">Prenez contact pour obtenir une proposition technique et commerciale sur-mesure.</p>
                      </div>
                      <button
                        onClick={() => handleRequestAssistance(domain.title)}
                        className="px-5 py-3 bg-slate-950 hover:bg-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider text-white shrink-0 transition-colors cursor-pointer"
                      >
                        Demander un accompagnement
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
