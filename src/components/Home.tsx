import { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Award, Users, FileText, CheckCircle2, Star, Quote, ChevronRight, Zap, Target, TrendingUp, Cpu } from 'lucide-react';
import { FORMATIONS, DOMAINS_INTERVENTION, TESTIMONIALS, PARTNERS, BLOG_POSTS } from '../data';
import { Formation, BlogPost, Partner } from '../types';
import Partners from './Partners';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  setSelectedDomainId: (id: string | null) => void;
  formations?: Formation[];
  blogPosts?: BlogPost[];
  partners?: Partner[];
}

export default function Home({ 
  setActiveTab, 
  setSelectedDomainId,
  formations = FORMATIONS,
  blogPosts = BLOG_POSTS,
  partners = PARTNERS
}: HomeProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Counter states to simulate count-up animation
  const [professionalsFormed, setProfessionalsFormed] = useState(0);
  const [missionsCompleted, setMissionsCompleted] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);
  const [satisfactionRate, setSatisfactionRate] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setProfessionalsFormed(Math.min(Math.floor((2000 / steps) * step), 2000));
      setMissionsCompleted(Math.min(Math.floor((150 / steps) * step), 150));
      setPartnersCount(Math.min(Math.floor((50 / steps) * step), 50));
      setSatisfactionRate(Math.min(Math.floor((95 / steps) * step), 95));

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

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
      {/* 1. Cinematic Hero Section */}
      <section id="hero-banner" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 bg-gradient-to-b from-[#020817] via-[#020817] to-[#020817]/90 text-white overflow-hidden">
        {/* Dynamic decorative vector backgrounds */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#009966 0.7px, transparent 0.7px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-blue/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-emerald/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 dark:bg-slate-800/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 mb-8 animate-in fade-in slide-in-from-top duration-700">
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-200">Cabinet Certifié &amp; International</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-5xl mx-auto text-white">
            Des solutions <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-brand-emerald">innovantes</span> pour renforcer les compétences, accompagner les organisations et accélérer le développement durable.
          </h1>

          <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto font-sans font-light leading-relaxed">
            Le <strong className="font-semibold text-white">CICEXF</strong> est le partenaire stratégique de référence internationale pour les institutions publiques, les entreprises privées et les professionnels exigeants en quête d'excellence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              id="hero-cta-formations"
              onClick={() => handleNavClick('formations')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wide transition-all text-white bg-gradient-to-r from-[#B84F3D] to-brand-emerald hover:shadow-lg hover:shadow-brand-emerald/20 hover:scale-[1.02] cursor-pointer"
            >
              Découvrir nos formations
            </button>
            <button
              id="hero-cta-accompagnement"
              onClick={() => handleNavClick('contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wide transition-all text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 cursor-pointer"
            >
              Demander un accompagnement
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Business Poles (3 Cards) */}
      <section id="business-poles" className="py-20 bg-slate-50 dark:bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Une Synergie de 3 Pôles d'Activités Majeurs
            </h2>
            <div className="w-16 h-1 bg-brand-emerald mx-auto mt-4 rounded-full"></div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">
              L'expertise globale au service de votre performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Pole 1: Consultance */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between items-center text-center group">
              <div className="flex-grow flex flex-col items-center justify-start w-full">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <Target className="w-6 h-6 text-[#7c2d12] dark:text-amber-500" />
                </div>
                <h3 className="text-brown-value font-display font-extrabold text-base sm:text-lg tracking-wider uppercase mb-2">
                  Pôle Consultance
                </h3>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed mb-4">
                  Nous accompagnons les gouvernements, communes, entreprises et ONG dans la formulation stratégique de politiques, l'analyse d'impact et la structuration organisationnelle agile.
                </p>
              </div>
              <button
                onClick={() => handleDomainClick('ingenierie-formation')}
                className="text-brand-blue dark:text-blue-400 font-bold text-xs flex items-center justify-center group-hover:translate-x-1 transition-transform border-t border-slate-100 dark:border-slate-800/60 w-full pt-3 mt-2"
              >
                Explorer la consultance <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Pole 2: Expertise */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between items-center text-center group">
              <div className="flex-grow flex flex-col items-center justify-start w-full">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <TrendingUp className="w-6 h-6 text-[#7c2d12] dark:text-amber-500" />
                </div>
                <h3 className="text-brown-value font-display font-extrabold text-base sm:text-lg tracking-wider uppercase mb-2">
                  Pôle Expertise Technique
                </h3>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed mb-4">
                  Audit financier de pointe, ingénierie de projets complexes, diagnostics d'impact environnemental QHSE et modélisation géospatiale (SIG) de territoires.
                </p>
              </div>
              <button
                onClick={() => handleDomainClick('ingenierie-financiere')}
                className="text-brand-emerald dark:text-brand-emerald-light font-bold text-xs flex items-center justify-center group-hover:translate-x-1 transition-transform border-t border-slate-100 dark:border-slate-800/60 w-full pt-3 mt-2"
              >
                Découvrir nos expertises <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Pole 3: Formation */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between items-center text-center group">
              <div className="flex-grow flex flex-col items-center justify-start w-full">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <BookOpen className="w-6 h-6 text-[#7c2d12] dark:text-amber-500" />
                </div>
                <h3 className="text-brown-value font-display font-extrabold text-base sm:text-lg tracking-wider uppercase mb-2">
                  Pôle Formation
                </h3>
                <p className="text-xs sm:text-[13px] text-black dark:text-slate-100 font-semibold leading-relaxed mb-4">
                  Des programmes de haut niveau, certifiants et axés sur les compétences pratiques. Formez vos collaborateurs à la data science, au QHSE et à la finance décisionnelle.
                </p>
              </div>
              <button
                onClick={() => handleNavClick('formations')}
                className="text-indigo-500 dark:text-indigo-400 font-bold text-xs flex items-center justify-center group-hover:translate-x-1 transition-transform border-t border-slate-100 dark:border-slate-800/60 w-full pt-3 mt-2"
              >
                Accéder au catalogue <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Simulated Count-Up Statistics Area */}
      <section id="counters-section" className="py-16 bg-slate-900 dark:bg-[#003B6F]/10 text-white relative border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-2">
              <h4 className="font-display text-4xl sm:text-5xl font-extrabold text-brand-emerald">
                +{professionalsFormed}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Professionnels formés de haut niveau
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-4xl sm:text-5xl font-extrabold text-[#38bdf8]">
                +{missionsCompleted}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Missions d'envergure réalisées
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-4xl sm:text-5xl font-extrabold text-brand-emerald">
                +{partnersCount}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Partenaires institutionnels et bailleurs
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-4xl sm:text-5xl font-extrabold text-amber-400">
                {satisfactionRate}%
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Taux de satisfaction des participants
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Flagship Training Spotlight: Data Analyst */}
      <section id="flagship-training-highlight" className="py-24 bg-white dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Media with Badges */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-brand-blue to-brand-emerald rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-slate-100 rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <img
                  src={formations[0]?.featuredImage || FORMATIONS[0].featuredImage}
                  alt="Formation Data Analyst d'Excellence CICEXF"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-brand-blue-dark text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  Formation Phare
                </div>
              </div>
            </div>

            {/* Information Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald dark:text-brand-emerald-light px-3 py-1 rounded-full text-xs font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>Nouveau parcours d'excellence</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Data Analyst : Maîtrise complète de la collecte, de la préparation et de la visualisation des données
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Devenez l'expert technique dont toutes les organisations modernes ont besoin. Ce parcours unique de 6 semaines vous propulse de l'ingénierie de collecte mobile de terrain avec <strong>KoboCollect</strong> à l'automatisation par l'<strong>Intelligence Artificielle</strong>, en passant par <strong>Power Pivot (DAX)</strong> et <strong>Python</strong>.
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Durée :</h4>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">6 semaines (120 heures)</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Modalité :</h4>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Hybride (Présentiel &amp; Zoom)</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Niveau :</h4>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Professionnel (Intermédiaire)</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tarif préférentiel :</h4>
                  <p className="text-xs font-bold text-brand-emerald mt-1">450 000 FCFA (Facilités)</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  id="spotlight-learn-more"
                  onClick={() => {
                    // Navigate to Data Analyst page
                    setSelectedDomainId('data-analyst'); // Handled specially as training ID in routing
                    setActiveTab('formations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Consulter le programme détaillé</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Pourquoi choisir CICEXF (6 cards) */}
      <section id="why-choose-us" className="py-24 bg-slate-50 dark:bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pourquoi Accorder Votre Confiance au CICEXF ?
            </h2>
            <div className="w-16 h-1 bg-brand-emerald mx-auto mt-4 rounded-full"></div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">
              L'engagement permanent pour l'excellence technique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Card 1: Expertise reconnue */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center group">
              <div className="flex-grow flex flex-col items-center justify-start w-full">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <Award className="w-6 h-6 text-[#7c2d12] dark:text-amber-500" />
                </div>
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
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <Users className="w-6 h-6 text-[#7c2d12] dark:text-amber-500" />
                </div>
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
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <Zap className="w-6 h-6 text-[#7c2d12] dark:text-amber-500" />
                </div>
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
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-[#7c2d12] dark:text-amber-500" />
                </div>
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
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <Cpu className="w-6 h-6 text-[#7c2d12] dark:text-amber-500" />
                </div>
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
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#7c2d12] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  <Award className="w-6 h-6 text-[#7c2d12] dark:text-amber-500" />
                </div>
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

      {/* 6. Partner Carousel Section */}
      <section id="partner-carousel" className="py-16 bg-white dark:bg-slate-950 border-t border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">
            Ils nous font confiance à l'échelle internationale
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center opacity-70">
            {partners.map(partner => (
              <div key={partner.id} className="flex flex-col items-center space-y-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center p-1.5">
                  <img src={partner.logoUrl} alt={partner.name} referrerPolicy="no-referrer" className="object-cover w-full h-full rounded" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials Slider */}
      <section id="testimonials-carousel" className="py-24 bg-slate-50 dark:bg-slate-900/40 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ce que Disent nos Participants et Clients
            </h2>
            <div className="w-16 h-1 bg-brand-emerald mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/50 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-6 right-6 text-brand-emerald/10 dark:text-brand-emerald/5">
              <Quote className="w-24 h-24 rotate-180" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="flex space-x-1 justify-center">
                {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm sm:text-base italic text-slate-600 dark:text-slate-300 font-serif leading-relaxed max-w-3xl">
                "{TESTIMONIALS[activeTestimonial].text}"
              </p>

              <div className="flex items-center space-x-4">
                <img
                  src={TESTIMONIALS[activeTestimonial].avatarUrl}
                  alt={TESTIMONIALS[activeTestimonial].name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-emerald"
                />
                <div className="text-left">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {TESTIMONIALS[activeTestimonial].name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {TESTIMONIALS[activeTestimonial].role} — {TESTIMONIALS[activeTestimonial].organization}
                  </p>
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex space-x-2 pt-4">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeTestimonial === index ? 'bg-brand-emerald w-6' : 'bg-slate-300 dark:bg-slate-700'}`}
                    aria-label={`Témoignage ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Recent News Highlight */}
      <section id="recent-news-preview" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Dernières Analyses et Actualités du Cabinet
              </h2>
              <div className="w-16 h-1 bg-brand-emerald mt-4 rounded-full"></div>
            </div>
            <button
              onClick={() => handleNavClick('news')}
              className="mt-4 md:mt-0 text-brand-emerald font-bold text-xs flex items-center hover:underline"
            >
              Consulter tout le blog <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map(post => (
              <article key={post.id} className="bg-slate-50 dark:bg-slate-900/60 rounded-xl overflow-hidden border border-slate-200/40 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full group">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-brand-emerald text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    {post.category}
                  </div>
                </div>
                <div className="p-4.5 flex flex-col flex-grow space-y-2">
                  <span className="text-[9px] font-bold text-slate-400">{post.date} • {post.readTime}</span>
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-blue-400 line-clamp-2 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 font-sans leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>
                  <button
                    onClick={() => {
                      // Spefically view this post
                      setActiveTab('news');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-brand-blue dark:text-brand-emerald-light font-bold text-xs flex items-center mt-2 group-hover:underline"
                  >
                    Lire la suite →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Social Proof Training Band with Real-looking Slides */}
      <section id="social-proof-band" className="py-16 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
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

      {/* Partners section integrated into Accueil page */}
      <div id="partners-section" className="border-t border-slate-100 dark:border-slate-900">
        <Partners />
      </div>

      {/* 10. Floating Prompt Footer Banner to Call Action */}
      <section className="bg-gradient-to-r from-brand-blue-dark via-slate-900 to-slate-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h3 className="font-display text-2xl font-extrabold text-white">
            Accélérez la Transformation de Votre Organisation Dès Aujourd'hui
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Que vous soyez une entité publique planifiant son aménagement territorial, une entreprise industrielle cherchant à auditer ses processus QHSE, ou un professionnel aspirant à maîtriser la Business Intelligence.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => handleNavClick('contact')}
              className="px-8 py-3.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-colors"
            >
              Prendre rendez-vous avec un de nos experts
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
