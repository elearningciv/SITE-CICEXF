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

  const selectedDomainObj = allDomains.find(d => d.id === selectedDomainId) || null;

  return (
    <div id="accompagnements-view" className="pt-4 pb-8 bg-white dark:bg-slate-950 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
                        <p className="text-[11px] text-black dark:text-white font-sans font-medium leading-relaxed line-clamp-3 text-justify">
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
            
            {/* Back Button to list of domains */}
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
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-black dark:text-brand-emerald-light mb-1">Présentation du pôle d'excellence</h3>
                <p className="text-xs sm:text-[13px] text-black dark:text-white font-sans font-medium leading-relaxed text-justify">
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
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-black dark:text-white tracking-tight">
                  Axes d'Accompagnement Technique &amp; Composantes
                </h2>
                <p className="text-[9px] uppercase font-bold text-black dark:text-brand-emerald-light tracking-widest">
                  Découvrez la structure opérationnelle et les compétences clés associées :
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedDomainObj.subDomains.map((sub, sIdx) => {
                  const enrichments = ACCOMPANIMENT_ENRICHMENTS[selectedDomainObj.id];
                  const enrichment = enrichments && enrichments[sIdx];
                  const finalIconName = enrichment ? enrichment.iconName : (sub.iconName || 'CheckSquare');
                  const finalImageUrl = enrichment ? enrichment.imageUrl : sub.imageUrl;

                  // 1. Présentation du service
                  const presentationService = sub.presentationService || enrichment?.presentationService || sub.description || enrichment?.diversifiedDescription || selectedDomainObj.shortDescription;

                  // 2. Objectifs opérationnels
                  const objectives = (sub.objectives && sub.objectives.length > 0)
                    ? sub.objectives
                    : (enrichment?.objectives && enrichment.objectives.length > 0
                        ? enrichment.objectives
                        : [
                            'Réaliser un diagnostic de maturité et cartographier 100% des flux critiques',
                            'Déployer des solutions opérationnelles personnalisées et conformes aux normes',
                            'Transférer les compétences aux équipes locales pour garantir la souveraineté métier'
                          ]);

                  // 3. Démarche d’accompagnement
                  const demarche = (sub.demarcheAccompagnement && sub.demarcheAccompagnement.length > 0)
                    ? sub.demarcheAccompagnement
                    : (enrichment?.demarcheAccompagnement && enrichment.demarcheAccompagnement.length > 0
                        ? enrichment.demarcheAccompagnement
                        : [
                            '1. Immersion diagnostique & cadrage des exigences',
                            '2. Analyse approfondie, co-conception & modélisation',
                            '3. Déploiement opérationnel sur le terrain et outillage',
                            '4. Validation finale, capitalisation et transfert d\'autonomie'
                          ]);

                  // 4. Résultats attendus
                  const resultatsAttendus = (sub.resultatsAttendus && sub.resultatsAttendus.length > 0)
                    ? sub.resultatsAttendus
                    : (enrichment?.resultatsAttendus && enrichment.resultatsAttendus.length > 0
                        ? enrichment.resultatsAttendus
                        : [
                            'Livrables techniques complets et validés par le comité de direction',
                            'Processus internes optimisés et sécurisés contre les dysfonctionnements',
                            'Cadres opérationnels formés et autonomes sur les nouveaux outils'
                          ]);

                  // 5. Impact pour l’entité
                  const impactEntite = sub.impactEntite || enrichment?.expectedChanges || sub.expectedChanges || 'Gain significatif de productivité, fiabilisation des processus stratégiques et autonomie d\'action durable pour l\'organisation.';

                  // 6. Méthode d'évaluation
                  const methodeEvaluation = (sub.methodeEvaluation && sub.methodeEvaluation.length > 0)
                    ? sub.methodeEvaluation
                    : (enrichment?.methodeEvaluation && enrichment.methodeEvaluation.length > 0
                        ? enrichment.methodeEvaluation
                        : [
                            'Points d\'avancement hebdomadaires et comité de pilotage dédié',
                            'Grille d\'audit de conformité des livrables selon les standards de la branche',
                            'Enquête de satisfaction des parties prenantes et mesure d\'impact à J+60'
                          ]);

                  // 7. Logiciels impliqués (avec icônes personnalisées)
                  const softwareTools: SoftwareTool[] = (sub.softwareTools && sub.softwareTools.length > 0)
                    ? sub.softwareTools
                    : (sub.software && sub.software.length > 0
                        ? sub.software.map(name => {
                            const found = PRESET_SOFTWARE_TOOLS.find(p => p.name.toLowerCase() === name.toLowerCase());
                            return { name, iconUrl: found?.iconUrl || '' };
                          })
                        : (enrichment?.softwareTools && enrichment.softwareTools.length > 0
                            ? enrichment.softwareTools
                            : (selectedDomainObj.softwareTools && selectedDomainObj.softwareTools.length > 0
                                ? selectedDomainObj.softwareTools
                                : (selectedDomainObj.software && selectedDomainObj.software.length > 0
                                    ? selectedDomainObj.software.map(name => {
                                        const found = PRESET_SOFTWARE_TOOLS.find(p => p.name.toLowerCase() === name.toLowerCase());
                                        return { name, iconUrl: found?.iconUrl || '' };
                                      })
                                    : [
                                        { name: 'Outils Métiers CICEXF', iconUrl: 'https://raw.githubusercontent.com/microsoft/PowerBI-Icons/main/PNG/Power-BI.png' },
                                        { name: 'Suite Bureautique Avancée', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg' }
                                      ]
                                  )
                              )
                          ));

                  return (
                    <div
                      key={sIdx}
                      id={`sub-point-card-${selectedDomainObj.id}-${sIdx}`}
                      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group h-full transition-all duration-300 hover:shadow-xl"
                    >
                      <div>
                        {/* Sub-element/Minor line image */}
                        {finalImageUrl && (
                          <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                              src={finalImageUrl}
                              alt={sub.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent"></div>
                            
                            {/* Title and Badge on image */}
                            <div className="absolute bottom-3 left-4 right-4 flex flex-col space-y-1 z-10">
                              <span className="self-start font-mono font-bold text-[8px] text-white bg-brand-emerald/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                Axe #0{sIdx + 1}
                              </span>
                              <h4 className="font-display font-extrabold text-[12px] sm:text-[13.5px] text-white leading-tight drop-shadow-md">
                                {sub.title}
                              </h4>
                            </div>

                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-sm">
                              {renderIcon(finalIconName, "w-4 h-4 text-brand-emerald-light")}
                            </div>
                          </div>
                        )}

                        <div className="p-4 sm:p-5 space-y-4">
                          
                          {/* 1. Présentation du service */}
                          <div className="space-y-1.5">
                            <span className="text-[9.5px] font-extrabold text-brand-emerald dark:text-brand-emerald-light uppercase tracking-widest flex items-center">
                              <span className="w-4 h-4 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-mono mr-1.5 text-[9px] font-bold">1</span>
                              Présentation du service
                            </span>
                            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium text-justify">
                              {presentationService}
                            </p>
                          </div>

                          {/* 2. Objectifs opérationnels */}
                          {objectives && objectives.length > 0 && (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                              <span className="text-[9.5px] font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center">
                                <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono mr-1.5 text-[9px] font-bold">2</span>
                                <Target className="w-3.5 h-3.5 mr-1 text-brand-emerald shrink-0" />
                                Objectifs opérationnels
                              </span>
                              <div className="space-y-1 pl-1">
                                {objectives.map((obj, oIdx) => (
                                  <div key={oIdx} className="flex items-start text-slate-700 dark:text-slate-300">
                                    <CheckCircle className="w-3 h-3 text-brand-emerald mr-2 shrink-0 mt-0.5" />
                                    <span className="leading-snug text-[10.5px] font-medium font-sans">{obj}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3. Démarche d’accompagnement */}
                          {demarche && demarche.length > 0 && (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                              <span className="text-[9.5px] font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center">
                                <span className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono mr-1.5 text-[9px] font-bold">3</span>
                                <Layers className="w-3.5 h-3.5 mr-1 text-blue-500 shrink-0" />
                                Démarche d’accompagnement
                              </span>
                              <div className="grid grid-cols-1 gap-1.5">
                                {demarche.map((step, stIdx) => (
                                  <div key={stIdx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start space-x-2 text-[10.5px]">
                                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-mono font-bold text-[8.5px] flex items-center justify-center shrink-0 mt-0.5">
                                      {stIdx + 1}
                                    </span>
                                    <span className="text-slate-800 dark:text-slate-200 font-medium leading-snug">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. Résultats attendus */}
                          {resultatsAttendus && resultatsAttendus.length > 0 && (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                              <span className="text-[9.5px] font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center">
                                <span className="w-4 h-4 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-mono mr-1.5 text-[9px] font-bold">4</span>
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400 shrink-0" />
                                Résultats attendus
                              </span>
                              <div className="space-y-1 pl-1">
                                {resultatsAttendus.map((res, rIdx) => (
                                  <div key={rIdx} className="flex items-start text-slate-700 dark:text-slate-300">
                                    <CheckCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mr-2 shrink-0 mt-0.5" />
                                    <span className="leading-snug text-[10.5px] font-medium font-sans">{res}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 5. Impact pour l’entité */}
                          {impactEntite && (
                            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 space-y-1">
                              <span className="text-[9.5px] font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-widest flex items-center">
                                <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center font-mono mr-1.5 text-[8.5px] font-bold">5</span>
                                <Award className="w-3.5 h-3.5 mr-1 text-amber-600 shrink-0" />
                                Impact pour l’entité
                              </span>
                              <p className="text-[10.5px] text-amber-950 dark:text-amber-200 leading-relaxed font-sans font-semibold text-justify">
                                {impactEntite}
                              </p>
                            </div>
                          )}

                          {/* 6. Méthode d'évaluation */}
                          {methodeEvaluation && methodeEvaluation.length > 0 && (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                              <span className="text-[9.5px] font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center">
                                <span className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono mr-1.5 text-[9px] font-bold">6</span>
                                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                Méthode d'évaluation
                              </span>
                              <div className="space-y-1 pl-1">
                                {methodeEvaluation.map((m, mIdx) => (
                                  <div key={mIdx} className="flex items-start text-slate-700 dark:text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 shrink-0 mt-1.5"></div>
                                    <span className="leading-snug text-[10.5px] font-medium font-sans">{m}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 7. Logiciels impliqués (avec icônes personnalisées) */}
                          {softwareTools && softwareTools.length > 0 && (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                              <span className="text-[9.5px] font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center">
                                <span className="w-4 h-4 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-mono mr-1.5 text-[9px] font-bold">7</span>
                                <Cpu className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400 shrink-0" />
                                Logiciels impliqués &amp; Outils
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {softwareTools.map((tool, tIdx) => (
                                  <div
                                    key={tIdx}
                                    className="inline-flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs"
                                  >
                                    {tool.iconUrl ? (
                                      <img
                                        src={tool.iconUrl}
                                        alt={tool.name}
                                        className="w-3.5 h-3.5 object-contain shrink-0"
                                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                      />
                                    ) : (
                                      <Cpu className="w-3 h-3 text-slate-400" />
                                    )}
                                    <span>{tool.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[9px] text-slate-700 dark:text-slate-300 font-bold font-sans uppercase">Expertise CICEXF</span>
                        <button
                          onClick={() => handleRequestAssistance(`${selectedDomainObj.title} - ${sub.title}`)}
                          className="px-3.5 py-1.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-lg text-[9.5px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95"
                        >
                          <span>Demander cet accompagnement</span>
                          <ChevronRight className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Concrete examples of recent accompaniments */}
            {selectedDomainObj.examples && selectedDomainObj.examples.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-black dark:text-white flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-brand-emerald" />
                  Exemples d'accompagnements récents réalisés
                </h3>
                <ul className="space-y-2 text-xs leading-relaxed">
                  {selectedDomainObj.examples.map((ex, exIdx) => (
                    <li key={exIdx} className="flex items-start text-black dark:text-white font-sans font-semibold">
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
