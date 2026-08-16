import { useState } from 'react';
import { Target, Eye, Compass, Shield, Award, Users, Linkedin, MapPin, Phone, Mail, Building, FileText, ChevronRight, CheckCircle2, GraduationCap, TrendingUp, Zap, Map, Sparkles, BookOpen } from 'lucide-react';
import { TEAM_MEMBERS } from '../data';

export default function About() {
  const [selectedNode, setSelectedNode] = useState<string>('DG');
  const [activeTab, setActiveTab] = useState<'map' | 'satellite'>('map');

  const organigrammeData: Record<string, { title: string; desc: string; role: string }> = {
    AG: {
      title: "Assemblée Générale",
      role: "Actionnaires & Fondateurs",
      desc: "Organe souverain définissant la politique générale du cabinet, validant les comptes annuels et élisant les membres du Conseil d'Administration."
    },
    CA: {
      title: "Conseil d'Administration",
      role: "Gouvernance Stratégique",
      desc: "Supervise la gestion opérationnelle de la Direction Générale, valide les investissements majeurs et garantit le respect de la charte éthique et des valeurs."
    },
    DG: {
      title: "Direction Générale",
      role: "M. Amadou Diallo",
      desc: "Pilote le développement commercial à l'international, définit les priorités opérationnelles et dirige la mise en œuvre des plans stratégiques pluriannuels."
    },
    DGA: {
      title: "Direction Générale Adjointe",
      role: "Dr. Marc Koffi",
      desc: "Coordonne l'exécution technique des chantiers d'ingénierie, supervise le contrôle de qualité interne et assure la transition numérique des offres."
    },
    Consultance: {
      title: "Pôle Consultance & Expertise",
      role: "Ingénierie de solutions",
      desc: "Regroupe les experts thématiques par domaine (Finance, Informatique, QHSE, Aménagement du territoire) pour mener les missions d'audit et de stratégie."
    },
    Formation: {
      title: "Pôle Académie & Formation",
      role: "Renforcement des capacités",
      desc: "Gère l'ingénierie pédagogique, l'accréditation des programmes d'excellence, le recrutement de formateurs agréés et le suivi-évaluation post-formation."
    }
  };

  return (
    <div id="about-view" className="py-8 bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb Banner */}
        <div className="mb-6">
          <nav className="flex text-xs font-semibold text-slate-400 mb-2">
            <span>CICEXF</span>
            <span className="mx-2">/</span>
            <span className="text-brand-emerald">Qui sommes-nous</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Identité et Gouvernance de notre Cabinet
          </h1>
          <div className="w-16 h-1.5 bg-brand-emerald mt-4 rounded-full"></div>
        </div>

        {/* 1. Vision, Mission & Goals */}
        <div className="space-y-10 mb-12">
          {/* Row 1: Vision, Mission & Objectif (3 high-contrast columns matching values layout) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Card Left: Notre Vision */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-brand-blue/30 relative overflow-hidden group min-h-[220px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <Compass className="w-6 h-6 text-[#7c2d12] dark:text-amber-500 animate-spin-slow" />
                </div>
                <span className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">ORIENTATION</span>
                <h4 className="text-brown-value font-display font-extrabold text-base sm:text-lg tracking-wider uppercase mb-4">
                  Notre Vision d'Excellence
                </h4>
              </div>

              <div className="flex-grow flex flex-col justify-center my-4 text-center">
                <p className="font-display text-base sm:text-lg font-black text-black dark:text-white leading-relaxed italic">
                  « Devenir une référence internationale incontournable en expertise et ingénierie de solutions innovantes »
                </p>
              </div>
              
              <div className="pt-3 mt-4 flex items-center justify-center text-[11px] font-bold text-slate-500 dark:text-slate-400 gap-1.5 border-t border-slate-100 dark:border-slate-800/60">
                <Sparkles className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Modernité, Innovation &amp; Standard Global</span>
              </div>
            </div>
 
            {/* Card Middle: Notre Mission */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-brand-emerald/30 relative overflow-hidden group min-h-[220px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-emerald/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <Target className="w-6 h-6 text-[#7c2d12] dark:text-amber-500" />
                </div>
                <span className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">IMPACT DE TERRAIN</span>
                <h4 className="text-brown-value font-display font-extrabold text-base sm:text-lg tracking-wider uppercase mb-4">
                  Notre Mission Opérationnelle
                </h4>
              </div>

              <div className="flex-grow flex flex-col justify-center my-4 text-center">
                <p className="font-display text-base sm:text-lg font-black text-black dark:text-white leading-relaxed italic">
                  « Accompagner les organisations et les professionnels dans l'optimisation de leurs performances et leur succès »
                </p>
              </div>
              
              <div className="pt-3 mt-4 flex items-center justify-center text-[11px] font-bold text-slate-500 dark:text-slate-400 gap-1.5 border-t border-slate-100 dark:border-slate-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" />
                <span>Rigueur technique &amp; Résultats mesurables</span>
              </div>
            </div>
 
            {/* Card Right: Notre Objectif */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-violet-500/30 relative overflow-hidden group min-h-[220px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <TrendingUp className="w-6 h-6 text-[#7c2d12] dark:text-amber-500" />
                </div>
                <span className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">VALEUR ET CAPACITÉS</span>
                <h4 className="text-brown-value font-display font-extrabold text-base sm:text-lg tracking-wider uppercase mb-4">
                  Notre Objectif Majeur
                </h4>
              </div>

              <div className="flex-grow flex flex-col justify-center my-4 text-center">
                <p className="font-display text-base sm:text-lg font-black text-black dark:text-white leading-relaxed italic">
                  « Renforcer les capacités des organisations et les individus en proposant des solutions intégrées en formation en ingénierie et en consultance afin d’améliorer leur performance et de soutenir un développement durable »
                </p>
              </div>
              
              <div className="pt-3 mt-4 flex items-center justify-center text-[11px] font-bold text-slate-500 dark:text-slate-400 gap-1.5 border-t border-slate-100 dark:border-slate-800/60">
                <BookOpen className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Performance &amp; Développement Durable</span>
              </div>
            </div>
            
          </section>
 
          {/* Row 2: Strategic Objectives (Beautiful 4 columns grid, perfectly redistributing space with interesting illustrative icons) */}
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] uppercase font-extrabold text-brand-emerald bg-brand-emerald/10 px-3 py-1 rounded-full tracking-widest">
                PLAN D'ACTION DIRECTE
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black text-slate-955 dark:text-white tracking-tight">
                Les 4 Objectifs Stratégiques de Notre Institution
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 max-w-lg mx-auto font-sans">
                Découvrez les quatre piliers fondamentaux guidant l'ensemble de nos interventions pour transformer durablement les écosystèmes professionnels.
              </p>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              
              {/* Objective 1 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center group">
                <div className="flex-grow flex flex-col items-center justify-start space-y-3 w-full">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-1 shrink-0 shadow-sm">
                    <GraduationCap className="w-6 h-6 text-[#7c2d12]" />
                  </div>
                  <h4 className="text-brown-value font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase">
                    PROGRAMMES DE FORMATION INNOVANTS
                  </h4>
                  <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                    Concevoir des curriculums de formation d'excellence en adéquation étroite et continue avec les besoins opérationnels immédiats des entreprises et des gouvernements.
                  </p>
                </div>
                <div className="w-full text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                  Axe Pédagogique
                </div>
              </div>
  
              {/* Objective 2 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center group">
                <div className="flex-grow flex flex-col items-center justify-start space-y-3 w-full">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-1 shrink-0 shadow-sm">
                    <TrendingUp className="w-6 h-6 text-[#7c2d12]" />
                  </div>
                  <h4 className="text-brown-value font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase">
                    COMPÉTITIVITÉ &amp; PERFORMANCE
                  </h4>
                  <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                    Analyser, auditer, optimiser et informatiser les processus managériaux et opérationnels pour accroître drastiquement la valeur ajoutée métier des organisations.
                  </p>
                </div>
                <div className="w-full text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                  Performance Métier
                </div>
              </div>
  
              {/* Objective 3 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center group">
                <div className="flex-grow flex flex-col items-center justify-start space-y-3 w-full">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-1 shrink-0 shadow-sm">
                    <Zap className="w-6 h-6 text-[#7c2d12]" />
                  </div>
                  <h4 className="text-brown-value font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase">
                    DÉVELOPPEMENT DURABLE
                  </h4>
                  <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                    Intégrer les méthodologies de transition écologique, de management QHSE rigoureux et de responsabilité sociétale (RSE) dans les schémas stratégiques d'activité.
                  </p>
                </div>
                <div className="w-full text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                  Solutions Durables
                </div>
              </div>
  
              {/* Objective 4 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center group">
                <div className="flex-grow flex flex-col items-center justify-start space-y-3 w-full">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-1 shrink-0 shadow-sm">
                    <Map className="w-6 h-6 text-[#7c2d12]" />
                  </div>
                  <h4 className="text-brown-value font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase">
                    INGÉNIERIE DES TERRITOIRES
                  </h4>
                  <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                    Planifier l'aménagement spatial intelligent, administrer les systèmes SIG complexes et outiller les collectivités décentralisées pour un développement endogène fort.
                  </p>
                </div>
                <div className="w-full text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                  Développement Local
                </div>
              </div>
 
            </div>
          </section>
        </div>

        {/* 2. Brand Core Values */}
        <section id="values-grid" className="py-6 mb-10">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
              Les 5 Valeurs Cardinales du CICEXF
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 font-semibold">
              Les fondements de notre éthique de travail
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center font-sans">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between min-h-[220px]">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                <Award className="w-6 h-6 text-brand-emerald" />
              </div>
              <div className="flex-grow flex flex-col justify-start space-y-2 w-full">
                <h4 className="text-brown-value font-display font-extrabold text-base sm:text-lg tracking-wider uppercase">Excellence</h4>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                  Dépasser continuellement les objectifs fixés avec un soin ultime du détail.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between min-h-[220px]">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                <Shield className="w-6 h-6 text-brand-blue" />
              </div>
              <div className="flex-grow flex flex-col justify-start space-y-2 w-full">
                <h4 className="text-brown-value font-display font-extrabold text-base sm:text-lg tracking-wider uppercase">Rigueur</h4>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                  Précision méthodologique rigide et scientificité de chaque instant.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between min-h-[220px]">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                <Users className="w-6 h-6 text-brand-emerald" />
              </div>
              <div className="flex-grow flex flex-col justify-start space-y-2 w-full">
                <h4 className="text-brown-value font-display font-extrabold text-base sm:text-lg tracking-wider uppercase">Transparence</h4>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                  Clarté contractuelle totale et communication honnête sur les enjeux.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between min-h-[220px]">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                <Building className="w-6 h-6 text-brand-blue" />
              </div>
              <div className="flex-grow flex flex-col justify-start space-y-2 w-full">
                <h4 className="text-brown-value font-display font-extrabold text-base sm:text-lg tracking-wider uppercase">Redevabilité</h4>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                  Responsabilité entière des résultats et de la pérennité de nos appuis.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col col-span-1 sm:col-span-2 lg:col-span-1 items-center justify-between min-h-[220px]">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-grow flex flex-col justify-start space-y-2 w-full">
                <h4 className="text-brown-value font-display font-extrabold text-base sm:text-lg tracking-wider uppercase">Innovation</h4>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                  Créativité disruptive et adoption précoce des meilleures technologies.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Interactive Organigramme flow */}
        <section id="interactive-flowchart" className="py-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800 p-5 sm:p-6 shadow-sm mb-10">
          <div className="max-w-3xl mx-auto text-center mb-5">
            <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
              Gouvernance &amp; Organigramme Interactif
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-sans">
              Le CICEXF est structuré selon les standards d'indépendance de gouvernance des grands cabinets internationaux. Cliquez sur les structures pour explorer leurs prérogatives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* flowchart map visualization */}
            <div className="lg:col-span-7 flex flex-col items-center space-y-3">
              
              {/* Assembly General */}
              <button
                id="node-ag"
                onClick={() => setSelectedNode('AG')}
                className={`w-64 py-2 rounded-xl border font-bold text-[11px] tracking-wider uppercase text-center transition-all ${selectedNode === 'AG' ? 'bg-brand-blue-dark text-white ring-4 ring-brand-emerald/30 border-transparent shadow-md' : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}`}
              >
                Assemblée Générale (AG)
              </button>

              <div className="w-0.5 h-3.5 bg-slate-300 dark:bg-slate-800"></div>

              {/* Board */}
              <button
                id="node-ca"
                onClick={() => setSelectedNode('CA')}
                className={`w-64 py-2 rounded-xl border font-bold text-[11px] tracking-wider uppercase text-center transition-all ${selectedNode === 'CA' ? 'bg-brand-blue-dark text-white ring-4 ring-brand-emerald/30 border-transparent shadow-md' : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}`}
              >
                Conseil d'Administration (CA)
              </button>

              <div className="w-0.5 h-3.5 bg-slate-300 dark:bg-slate-800"></div>

              {/* DG */}
              <button
                id="node-dg"
                onClick={() => setSelectedNode('DG')}
                className={`w-64 py-2.5 rounded-xl border font-bold text-xs uppercase text-center transition-all ${selectedNode === 'DG' ? 'bg-brand-blue text-white ring-4 ring-brand-emerald/30 border-transparent shadow-md' : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}`}
              >
                Direction Générale (DG)
              </button>

              <div className="w-0.5 h-3.5 bg-slate-300 dark:bg-slate-800"></div>

              {/* DGA */}
              <button
                id="node-dga"
                onClick={() => setSelectedNode('DGA')}
                className={`w-64 py-2 rounded-xl border font-bold text-[11px] uppercase text-center transition-all ${selectedNode === 'DGA' ? 'bg-brand-emerald text-white ring-4 ring-brand-blue/30 border-transparent shadow-md' : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}`}
              >
                Direction Générale Adjointe (DGA)
              </button>

              <div className="w-0.5 h-3.5 bg-slate-300 dark:bg-slate-800"></div>

              {/* Split Row for operational Poles */}
              <div className="flex space-x-3">
                <button
                  id="node-pole-consultance"
                  onClick={() => setSelectedNode('Consultance')}
                  className={`w-36 py-2.5 rounded-xl border font-bold text-[9px] tracking-wider uppercase text-center transition-all ${selectedNode === 'Consultance' ? 'bg-slate-900 text-white border-transparent ring-2 ring-brand-emerald' : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}`}
                >
                  Pôle Consultance
                </button>
                <button
                  id="node-pole-formation"
                  onClick={() => setSelectedNode('Formation')}
                  className={`w-36 py-2.5 rounded-xl border font-bold text-[9px] tracking-wider uppercase text-center transition-all ${selectedNode === 'Formation' ? 'bg-slate-900 text-white border-transparent ring-2 ring-brand-emerald' : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}`}
                >
                  Pôle Formation
                </button>
              </div>

            </div>

            {/* Selected Node explanations Card */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-850 p-4.5 rounded-xl border border-slate-200/50 dark:border-slate-800 space-y-3 shadow-inner">
              <span className="text-[9px] uppercase font-bold text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded">
                Détails de l'Organigramme
              </span>
              <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {organigrammeData[selectedNode].title}
              </h4>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Responsable : {organigrammeData[selectedNode].role}
              </p>
              <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
                {organigrammeData[selectedNode].desc}
              </p>
              <div className="pt-1.5 flex items-center space-x-1 text-xs font-bold text-brand-blue dark:text-brand-emerald-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Rôle audité et conforme ISO 9001</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. Leadership & Executive Dirigeants team */}
        <section id="leadership-team" className="py-6 mb-10">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
              Une Direction d'Excellence &amp; d'Expérience
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 font-semibold">
              Des leaders pluridisciplinaires chevronnés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map(member => (
              <div key={member.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {member.category}
                  </div>
                </div>
                <div className="p-4.5 flex flex-col flex-grow space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">{member.name}</h4>
                      <p className="text-[10px] font-bold text-brand-emerald mt-0.5">{member.role}</p>
                    </div>
                    {member.linkedinUrl && (
                      <a href={member.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-blue transition-colors">
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed flex-grow text-justify">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Head Office Location in Cocody Palmeraie */}
        <section id="office-location" className="py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Map explanation info block */}
            <div className="lg:col-span-4 space-y-6">
              <span className="text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 px-3 py-1 rounded-full uppercase tracking-wider">
                Siège Social International
              </span>
              <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                Nous rencontrer à Abidjan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Le siège principal du cabinet est implanté au cœur de la zone résidentielle prestigieuse de <strong>Cocody Palmeraie</strong>. Nos locaux modernes disposent de 4 salles de classe climatisées et connectées, d'un laboratoire de Business Intelligence, et d'une salle de conseil privée.
              </p>

              <div className="space-y-3.5 text-xs font-medium">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-brand-emerald mr-3 shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Cocody Palmeraie, Rue de la Clinique, Immeuble Prestige, 3ème étage, Abidjan</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-brand-emerald mr-3 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">+225 05 74 22 22 46 / +225 07 01 97 00 65</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-brand-emerald mr-3 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">elearningciv@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Custom Premium High-Contrast Map representation */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800 overflow-hidden shadow-lg h-[340px] flex flex-col">
              
              {/* Map header control bar */}
              <div className="bg-slate-50 dark:bg-slate-850 px-4 py-3 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">Interactive Location Terminal (Cocody)</span>
                <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-0.5">
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold ${activeTab === 'map' ? 'bg-white dark:bg-slate-900 text-brand-emerald' : 'text-slate-500'}`}
                  >
                    Carte Vectorielle
                  </button>
                  <button
                    onClick={() => setActiveTab('satellite')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold ${activeTab === 'satellite' ? 'bg-white dark:bg-slate-900 text-brand-emerald' : 'text-slate-500'}`}
                  >
                    Satellite
                  </button>
                </div>
              </div>

              {/* Map rendering canvas frame */}
              <div className="relative flex-grow bg-slate-100 dark:bg-slate-950 overflow-hidden">
                {activeTab === 'map' ? (
                  // Vector map simulation styled with premium colors
                  <div className="absolute inset-0 grid-pattern flex items-center justify-center">
                    
                    {/* Simulated streets lines */}
                    <div className="absolute inset-x-0 top-1/3 h-8 bg-slate-200/40 dark:bg-slate-900/40 transform -rotate-12"></div>
                    <div className="absolute inset-y-0 left-1/3 w-8 bg-slate-200/40 dark:bg-slate-900/40 transform rotate-12"></div>
                    <div className="absolute inset-x-0 bottom-1/4 h-10 bg-slate-200/30 dark:bg-slate-900/30"></div>
                    
                    {/* Cocody neighborhoods indicators */}
                    <span className="absolute top-8 left-12 text-[10px] font-bold text-slate-450 dark:text-slate-600 uppercase">Riviéra 3</span>
                    <span className="absolute bottom-8 right-12 text-[10px] font-bold text-slate-450 dark:text-slate-600 uppercase">Carrefour Palmeraie</span>

                    {/* Central pointer anchor */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-5 h-5 bg-brand-emerald rounded-full animate-ping absolute top-0"></div>
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-emerald rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-xl relative z-10 border-2 border-white dark:border-slate-900">
                        CX
                      </div>
                      <div className="bg-slate-950 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-xl mt-2 select-none">
                        Siège CICEXF - Cocody Palmeraie
                      </div>
                    </div>
                    
                  </div>
                ) : (
                  // Satellite imagery simulation
                  <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                      alt="Satellite imagery simulation of Cocody Palmeraie"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
                    />
                    <div className="absolute z-10 flex flex-col items-center">
                      <div className="w-10 h-10 bg-brand-emerald rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xl border-2 border-white animate-bounce">
                        CX
                      </div>
                      <div className="bg-slate-950 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-xl mt-2">
                        Coordonnées : 5.3475° N, 3.9782° W
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Visual compass badge on map corner */}
                <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-2 rounded-lg text-[9px] font-bold text-slate-500 dark:text-slate-400">
                  N 05° 21' 11'' / W 03° 58' 42''
                </div>
              </div>

            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
