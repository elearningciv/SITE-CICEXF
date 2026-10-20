import { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, BookOpen, Award, Users, CheckCircle2, 
  ChevronRight, Zap, Target, TrendingUp, Cpu, MapPin, Building2, 
  Compass, ShieldCheck, Layers, Calendar, Clock, Sparkles, AlertCircle
} from 'lucide-react';
import { FORMATIONS, DOMAINS_INTERVENTION, PARTNERS, BLOG_POSTS } from '../data';
import { Formation, BlogPost, Partner, DomainIntervention } from '../types';
import heroExecutiveImg from '../assets/images/african_executive_hero_1791597544124.jpg';
import consultingTeamImg from '../assets/images/african_consulting_team_1791597559536.jpg';
import adilineAvatar from '../assets/images/adiline_avatar_1792359280949.jpg';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  setSelectedDomainId: (id: string | null) => void;
  formations?: Formation[];
  blogPosts?: BlogPost[];
  partners?: Partner[];
  accompagnements?: DomainIntervention[];
  onOpenAssistant?: () => void;
}

export default function Home({ 
  setActiveTab, 
  setSelectedDomainId,
  formations = FORMATIONS,
  blogPosts = BLOG_POSTS,
  partners = PARTNERS,
  accompagnements = DOMAINS_INTERVENTION,
  onOpenAssistant
}: HomeProps) {
  const currentDomains = accompagnements && accompagnements.length > 0 ? accompagnements : DOMAINS_INTERVENTION;
  // Counter states to simulate count-up animation
  const [professionalsFormed, setProfessionalsFormed] = useState(2000);
  const [missionsCompleted, setMissionsCompleted] = useState(150);
  const [partnersCount, setPartnersCount] = useState(50);
  const [satisfactionRate, setSatisfactionRate] = useState(95);
  const [hasCounted, setHasCounted] = useState(false);
  const countersSectionRef = useRef<HTMLDivElement>(null);

  // Trigger smooth count-up animation when user scrolls into the counters section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasCounted) {
          setHasCounted(true);
          const duration = 2000;
          const steps = 60;
          const stepTime = duration / steps;
          let step = 0;

          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            // Ease-out cubic animation for realistic acceleration and soft stop
            const ease = 1 - Math.pow(1 - progress, 3);
            setProfessionalsFormed(Math.round(2000 * ease));
            setMissionsCompleted(Math.round(150 * ease));
            setPartnersCount(Math.round(50 * ease));
            setSatisfactionRate(Math.round(95 * ease));

            if (step >= steps) {
              setProfessionalsFormed(2000);
              setMissionsCompleted(150);
              setPartnersCount(50);
              setSatisfactionRate(95);
              clearInterval(timer);
            }
          }, stepTime);
        }
      },
      { threshold: 0.15 }
    );

    if (countersSectionRef.current) {
      observer.observe(countersSectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasCounted]);

  const handleDomainClick = (id: string) => {
    setSelectedDomainId(id);
    setActiveTab('accompagnements');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="home-view" className="relative font-sans overflow-hidden">
      {/* 1. Humanized Executive Hero Section */}
      <section id="hero-banner" className="relative flex items-center pt-8 pb-7 sm:pt-10 sm:pb-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        {/* Subtle executive architectural backdrop */}
        <div className="absolute inset-0 opacity-40 dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 0.7px, transparent 0.7px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/5 dark:bg-brand-blue/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-emerald/5 dark:bg-brand-emerald/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-2 sm:py-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column: Human Editorial Value Proposition */}
            <div className="lg:col-span-7 space-y-4 text-left">
              {/* Institutional Official Kicker */}
              <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                <span className="text-[10px] sm:text-[10.5px] font-bold tracking-wider uppercase text-black dark:text-white">
                  Cabinet International d'Expertise &middot; Agrément N°25343/GTCA/RC/2025
                </span>
              </div>

              {/* Authentic Human-Centered Headline */}
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold tracking-tight leading-[1.15] text-black dark:text-white">
                Développer le potentiel humain, structurer la gouvernance et accélérer la réussite de vos organisations.
              </h1>

              {/* Subtitle with Real Mission Proximity */}
              <p className="text-xs sm:text-sm text-black dark:text-white max-w-2xl font-sans font-medium leading-relaxed">
                Le <strong className="font-bold text-black dark:text-white">CICEXF</strong> réunit des experts de haut rang, des universitaires et des praticiens chevronnés pour accompagner les institutions publiques, les grandes entreprises et les bailleurs internationaux en Afrique de l'Ouest.
              </p>

              {/* CTAs */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center space-y-2.5 sm:space-y-0 sm:space-x-3">
                <button
                  id="hero-cta-formations"
                  onClick={() => handleNavClick('formations')}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold tracking-wide transition-all text-white bg-brand-emerald hover:bg-brand-emerald-dark hover:shadow-lg hover:shadow-brand-emerald/25 hover:scale-[1.02] cursor-pointer flex items-center justify-center space-x-2 shadow-md"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Découvrir nos formations certifiantes</span>
                </button>
                <button
                  id="hero-cta-accompagnement"
                  onClick={() => handleNavClick('contact')}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold tracking-wide transition-all text-white bg-brand-emerald hover:bg-brand-emerald-dark hover:shadow-lg hover:shadow-brand-emerald/25 hover:scale-[1.02] cursor-pointer flex items-center justify-center space-x-2 shadow-md"
                >
                  <Users className="w-4 h-4 text-white" />
                  <span>Échanger avec un conseiller expert</span>
                </button>
              </div>

              {/* Human Impact Badges Row */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-3 gap-3 text-black dark:text-white max-w-xl">
                <div>
                  <div className="font-display text-lg sm:text-xl font-extrabold text-black dark:text-white">+2000</div>
                  <div className="text-[10px] sm:text-[11px] text-black dark:text-slate-300 font-semibold">Cadres formés</div>
                </div>
                <div>
                  <div className="font-display text-lg sm:text-xl font-extrabold text-brand-emerald dark:text-brand-emerald-light">+150</div>
                  <div className="text-[10px] sm:text-[11px] text-black dark:text-slate-300 font-semibold">Missions réussies</div>
                </div>
                <div>
                  <div className="font-display text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-400">95%</div>
                  <div className="text-[10px] sm:text-[11px] text-black dark:text-slate-300 font-semibold">Satisfaction client</div>
                </div>
              </div>
            </div>

            {/* Right Column: Authentic Human Portrait Anchor */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                {/* Subtle warm glow frame */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-brand-emerald/15 to-brand-blue/15 rounded-3xl blur-xl opacity-70 pointer-events-none"></div>
                
                {/* Main Portrait Card */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200/80 dark:border-white/15 bg-slate-900 shadow-xl group">
                  <img
                    src={heroExecutiveImg}
                    alt="Dr. Kouassi Marc-Aurèle - Directeur Général CICEXF"
                    className="w-full h-[280px] sm:h-[320px] md:h-[340px] object-cover object-top group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021324] via-[#021324]/30 to-transparent"></div>
                  
                  {/* Executive Credential Overlay Box */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 shadow-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-brand-emerald"></span>
                      <span className="text-[9.5px] uppercase font-bold tracking-wider text-brand-emerald-light font-mono">
                        Direction Générale &middot; Siège Abidjan
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-xs sm:text-sm text-white leading-tight">
                      Dr. Kouassi Marc-Aurèle
                    </h3>
                    <p className="text-[10.5px] text-slate-300 font-medium">
                      Directeur Général &amp; Associé Gérant
                    </p>
                    <p className="text-[9.5px] italic text-slate-400 mt-1.5 border-t border-white/10 pt-1.5 leading-relaxed">
                      &laquo; L'excellence technique n'a de valeur que si elle transforme durablement la trajectoire des hommes et des organisations. &raquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Count-Up Statistics Area matching Image 2 with reduced height */}
      <section 
        id="counters-section" 
        ref={countersSectionRef}
        className="py-3.5 sm:py-4 lg:py-4.5 bg-brand-emerald dark:bg-[#54150A] text-white relative border-y border-[#B84F3D]/30 dark:border-[#380D06] shadow-md overflow-hidden transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 text-center items-start">
            
            <div className="space-y-0.5 flex flex-col items-center justify-center">
              <h4 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-black text-white tracking-tight drop-shadow-sm leading-none">
                +{professionalsFormed}
              </h4>
              <p className="text-[11px] sm:text-xs text-white font-medium max-w-[210px] leading-snug">
                Professionnels formés de haut niveau
              </p>
            </div>

            <div className="space-y-0.5 flex flex-col items-center justify-center">
              <h4 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-black text-white tracking-tight drop-shadow-sm leading-none">
                +{missionsCompleted}
              </h4>
              <p className="text-[11px] sm:text-xs text-white font-medium max-w-[210px] leading-snug">
                Missions d’envergure réalisées
              </p>
            </div>

            <div className="space-y-0.5 flex flex-col items-center justify-center">
              <h4 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-black text-white tracking-tight drop-shadow-sm leading-none">
                +{partnersCount}
              </h4>
              <p className="text-[11px] sm:text-xs text-white font-medium max-w-[210px] leading-snug">
                Partenaires institutionnels et bailleurs
              </p>
            </div>

            <div className="space-y-0.5 flex flex-col items-center justify-center">
              <h4 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-black text-white tracking-tight drop-shadow-sm leading-none">
                {satisfactionRate}%
              </h4>
              <p className="text-[11px] sm:text-xs text-white font-medium max-w-[210px] leading-snug">
                Taux de satisfaction des participants
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ADILINE Virtual Assistant Presentation & Orientation Section */}
      <section id="adiline-assistant-showcase" className="py-8 sm:py-10 bg-gradient-to-br from-slate-900 via-slate-950 to-[#021324] text-white relative overflow-hidden border-y border-slate-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-emerald/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center gap-8 justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-brand-emerald/50 shadow-xl ring-4 ring-brand-emerald/20">
                  <img src={adilineAvatar} alt="ADILINE - Assistante Virtuelle d'Accueil" className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-white/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  En ligne
                </span>
              </div>

              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/30 border border-brand-blue/40 text-[11px] font-semibold text-blue-200">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Assistante d'Accueil &amp; Conseillère d'Orientation</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Bonjour, je m'appelle <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300">ADILINE</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Ma raison d'être : vous orienter vers la formation certifiante adaptée à votre carrière, vous renseigner sur nos tarifs officiels en FCFA, calculer vos devis proforma avec remises et vous mettre en relation directe avec les experts du <strong>CICEXF</strong>.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-400 justify-center sm:justify-start">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-white/5">🎯 Orientation personnalisée</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-white/5">📊 Devis instantané</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-white/5">🎙️ Échange vocal &amp; écrit</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={onOpenAssistant}
                id="home-open-adiline-btn"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-blue to-teal-600 hover:from-blue-600 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-blue/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Poser une question à ADILINE</span>
              </button>
              <a
                href="https://wa.me/2250701970065?text=Bonjour%20ADILINE%20et%20CICEXF,%20je%20souhaite%20des%20renseignements"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-white/10 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>WhatsApp Direct (+225 07 01 97 00 65)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Flagship Training Spotlight: Data Analyst (Immersion Humaine & Pratique) */}
      <section id="flagship-training-highlight" className="py-10 bg-white dark:bg-slate-950 relative border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Visual Media with Boardroom Consulting Team Photo */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-brand-blue/20 to-brand-emerald/20 rounded-2xl opacity-40 blur-lg group-hover:opacity-60 transition-opacity"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10] sm:aspect-[4/3] bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <img
                  src={consultingTeamImg}
                  alt="Équipe d'experts et apprenants en session d'analyse de données - CICEXF Abidjan"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-[#002447] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Formation Phare &middot; Mentoring Direct
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-[11px] font-bold text-white drop-shadow-sm">
                    Atelier interactif en salle exécutive &middot; Siège CICEXF Abidjan
                  </p>
                  <p className="text-[9.5px] text-slate-300">
                    Étude de cas sur des données réelles d'organisations ouest-africaines
                  </p>
                </div>
              </div>
            </div>

            {/* Information Column */}
            <div className="lg:col-span-7 space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Data Analyst : Maîtrise complète de la collecte, de la préparation et de la visualisation des données
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Devenez l'expert technique incontournable dont toutes les organisations modernes ont besoin. Ce parcours de 6 semaines est dispensé par des <strong>consultants seniors en activité</strong>. Vous passez de l'ingénierie de collecte mobile sur le terrain avec <strong>KoboCollect</strong> à l'automatisation décisionnelle par l'<strong>Intelligence Artificielle</strong>, <strong>Power BI (DAX)</strong> et <strong>Python</strong>.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Durée</h4>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">6 semaines (120 h)</p>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modalité</h4>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Hybride (Abidjan &amp; Zoom)</p>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Encadrement</h4>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Consultant Senior dédié</p>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tarif</h4>
                  <p className="text-xs font-bold text-brand-emerald mt-0.5">450 000 FCFA (Facilités)</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  id="spotlight-learn-more"
                  onClick={() => {
                    setSelectedDomainId('data-analyst');
                    setActiveTab('formations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm hover:scale-[1.02]"
                >
                  <span>Consulter le syllabus &amp; Candidater</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center"
                >
                  <span>Demander un entretien d'orientation</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Pourquoi choisir CICEXF (6 cards) */}
      <section id="why-choose-us" className="py-10 bg-white dark:bg-slate-950 relative border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pourquoi Accorder Votre Confiance au CICEXF ?
            </h2>
            <div className="w-16 h-1 bg-brand-emerald mx-auto mt-3 rounded-full"></div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">
              L'engagement permanent pour l'excellence technique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Card 1: Expertise reconnue */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center group">
              <div className="flex-grow flex flex-col items-center justify-start w-full">
                <h3 className="text-brown-value font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase mb-2">
                  Expertise internationale reconnue
                </h3>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                  Une équipe pluridisciplinaire d'universitaires et d'experts de haut niveau rompus aux exigences des institutions multilatérales.
                </p>
              </div>
            </div>

            {/* Card 2: Consultants certifiés */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center group">
              <div className="flex-grow flex flex-col items-center justify-start w-full">
                <h3 className="text-brown-value font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase mb-2">
                  Consultants certifiés de l'industrie
                </h3>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                  Tous nos formateurs et experts métiers détiennent des certifications de niveau mondial (ISO, PMP, AWS, Microsoft, ITIL).
                </p>
              </div>
            </div>

            {/* Card 3: Approche pratique */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center group">
              <div className="flex-grow flex flex-col items-center justify-start w-full">
                <h3 className="text-brown-value font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase mb-2">
                  Approche pratique orientée résultats
                </h3>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                  Pas de cours magistraux stériles. Notre pédagogie repose sur l'apprentissage par résolution de cas d'entreprise concrets.
                </p>
              </div>
            </div>

            {/* Card 4: Accompagnement personnalisé */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center group">
              <div className="flex-grow flex flex-col items-center justify-start w-full">
                <h3 className="text-brown-value font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase mb-2">
                  Accompagnement personnalisé permanent
                </h3>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                  Nous suivons chaque auditeur et chaque organisation étape par étape, y compris dans le cadre du support post-intervention.
                </p>
              </div>
            </div>

            {/* Card 5: Innovation */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center group">
              <div className="flex-grow flex flex-col items-center justify-start w-full">
                <h3 className="text-brown-value font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase mb-2">
                  Innovation technologique continue
                </h3>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                  Nous intégrons en continu l'intelligence artificielle générative et les derniers outils numériques d'analyse.
                </p>
              </div>
            </div>

            {/* Card 6: Excellence */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center group">
              <div className="flex-grow flex flex-col items-center justify-start w-full">
                <h3 className="text-brown-value font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase mb-2">
                  Culture de l'Excellence absolue
                </h3>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed">
                  Inspiré par les standards des plus grands cabinets mondiaux, nous appliquons une rigueur et une redevabilité totales.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Formations en Cours & Prochaines Sessions (Actualités des Formations) */}
      <section id="recent-news-preview" className="py-12 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-550/10 text-red-650 dark:text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span>Actualités des Formations &amp; Sessions</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Formations en cours et sessions démarrant bientôt
              </h2>
              <div className="w-16 h-1 bg-brand-emerald mt-3 rounded-full"></div>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
                Retrouvez les programmes actifs et les prochaines cohortes ouvertes aux inscriptions pour accélérer votre trajectoire professionnelle.
              </p>
            </div>
            <button
              onClick={() => handleNavClick('formations')}
              className="mt-4 md:mt-0 px-4 py-2 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-xl font-bold text-xs flex items-center shadow-sm hover:scale-102 transition-all"
            >
              Voir toutes les formations ({formations.length}) <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formations.slice(0, 3).map((f, idx) => {
              // Status label depending on index
              const isOngoing = idx === 0;
              const isStartingSoon = idx === 1;
              const statusBadge = isOngoing 
                ? { label: "Session en cours &middot; Inscriptions clôturées", bg: "bg-amber-500 text-white" }
                : isStartingSoon
                  ? { label: "Démarrage imminent &middot; Dernières places", bg: "bg-red-600 text-white animate-pulse" }
                  : { label: "Nouvelle cohorte ouverte &middot; Candidatures", bg: "bg-brand-emerald text-white" };

              return (
                <article key={f.id} className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group hover:-translate-y-1">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={f.featuredImage}
                      alt={f.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    <div className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-md ${statusBadge.bg}`}>
                      <span dangerouslySetInnerHTML={{ __html: statusBadge.label }} />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                      <span className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
                        {f.modality}
                      </span>
                      <span className="text-brand-emerald-light drop-shadow-md">
                        {f.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow space-y-3">
                    <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-brand-emerald" />
                      <span>{f.duration}</span>
                      <span>&bull;</span>
                      <span className="text-brand-blue dark:text-blue-400 font-bold">{f.level}</span>
                    </div>

                    <h3 className="font-display text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-blue-400 line-clamp-2 transition-colors">
                      {f.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 font-sans leading-relaxed flex-grow">
                      {f.shortDescription}
                    </p>

                    {/* Next sessions preview */}
                    {f.sessions && f.sessions.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                        <div className="flex items-center font-bold text-slate-800 dark:text-slate-200">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-brand-emerald" />
                          <span>Prochaine session :</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium pl-5">
                          {f.sessions[0].date} ({f.sessions[0].location})
                        </p>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedDomainId(f.id);
                          setActiveTab('formations');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-brand-blue dark:text-brand-emerald-light font-bold text-xs flex items-center hover:underline cursor-pointer"
                      >
                        Voir le programme détaillé &rarr;
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('contact');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Postuler
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Social Proof Training Band with Real-looking Slides */}
      <section id="social-proof-band" className="py-8 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="font-display text-lg font-bold text-slate-800 dark:text-slate-200">
              Immersion au cœur de nos sessions de formation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Des promotions dynamiques de professionnels d'Afrique de l'Ouest partageant rigueur, savoir-faire et émulation collective.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm group">
              <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=500&q=80" alt="Auditoire de formation CICEXF" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-white">Auditoire &amp; Travaux dirigés</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm group">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80" alt="Session d'études de cas" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-white">Atelier interactif par équipe</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm group">
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80" alt="Présentation de tableaux de bord" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-white">Présentation de livrable Power BI</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm group">
              <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=80" alt="Remise des certificats" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-white">Remise officielle des certificats</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
