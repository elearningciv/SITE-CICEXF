import { useState, useEffect } from 'react';
import { Camera, Layers, Award, Users, CheckCircle, ChevronRight, X, Play, Quote, Star, MessageSquare } from 'lucide-react';
import { PROJECTS, TESTIMONIALS } from '../data';

interface RealisationsProps {
  selectedDomainId?: string | null;
  setSelectedDomainId?: (id: string | null) => void;
}

export default function Realisations({ selectedDomainId, setSelectedDomainId }: RealisationsProps) {
  const [activeCaseStudy, setActiveCaseStudy] = useState<string>('p1');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDomainId) {
      if (selectedDomainId === 'ing-formation' || selectedDomainId === 'data-gouvernance') {
        setActiveCaseStudy('p3');
      } else if (selectedDomainId === 'ing-territoriale' || selectedDomainId === 'ing-informatique') {
        setActiveCaseStudy('p2');
      } else {
        setActiveCaseStudy('p1');
      }
    }
  }, [selectedDomainId]);

  const selectedProject = PROJECTS.find(p => p.id === activeCaseStudy) || PROJECTS[0];

  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80", title: "Atelier de formation Data Analyst à Abidjan" },
    { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80", title: "Travaux pratiques sur le module KoboCollect" },
    { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80", title: "Soutenance de projets devant le jury d'experts" },
    { url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80", title: "Remise officielle des attestations professionnelles" },
    { url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", title: "Réunion d'assistance technique ministérielle" },
    { url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80", title: "Mission d'enquête SIG et d'aménagement sur le terrain" }
  ];

  return (
    <div id="realisations-view" className="py-16 bg-slate-50 dark:bg-slate-950 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb Banner */}
        <div className="mb-12">
          <nav className="flex text-xs font-semibold text-slate-400 mb-2">
            <span>CICEXF</span>
            <span className="mx-2">/</span>
            <span className="text-brand-emerald">Nos réalisations</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Un tour en arrière : Impact &amp; Réalisations
          </h1>
          <div className="w-16 h-1.5 bg-brand-emerald mt-4 rounded-full"></div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 max-w-2xl font-semibold uppercase tracking-widest">
            Mesure scientifique de notre empreinte et revues de nos grands chantiers accomplis
          </p>
        </div>

        {/* 1. Global Impact Stats Panels */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-slate-800 text-brand-emerald flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-bold text-2xl text-slate-900 dark:text-white">+2 000</span>
              <span className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Cadres formés certifiés</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-800 text-brand-blue flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 text-brand-emerald" />
            </div>
            <div>
              <span className="block font-bold text-2xl text-slate-900 dark:text-white">+150</span>
              <span className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Missions d'envergure menées</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-500 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-bold text-2xl text-slate-900 dark:text-white">+50</span>
              <span className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Partenariats institutionnels</span>
            </div>
          </div>
        </section>

        {/* 2. Advanced Case Studies Explorer (Études de cas) */}
        <section id="case-studies" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm p-8 mb-16">
          <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
              Analyses de Cas d'École &amp; Projets de Référence
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sélectionnez une étude de cas pour observer notre démarche de résolution de problèmes complexes.
            </p>
          </div>

          {/* horizontal selector tabs */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {PROJECTS.map(proj => (
              <button
                key={proj.id}
                onClick={() => {
                  setActiveCaseStudy(proj.id);
                  if (setSelectedDomainId) {
                    if (proj.id === 'p1') setSelectedDomainId('ing-financiere');
                    else if (proj.id === 'p2') setSelectedDomainId('ing-territoriale');
                    else if (proj.id === 'p3') setSelectedDomainId('ing-formation');
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCaseStudy === proj.id
                    ? 'bg-brand-blue text-white shadow dark:bg-brand-emerald dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {proj.title.split(':')[0]} {/* Shorten name for tab button */}
              </button>
            ))}
          </div>

          {/* Selected Case Study Details block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-150">
            
            {/* case info column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] uppercase font-bold text-brand-emerald bg-brand-emerald/10 px-3 py-1 rounded-full">
                {selectedProject.category}
              </span>
              <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {selectedProject.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-light">
                {selectedProject.description}
              </p>

              {/* Challenge / Solution split list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <h5 className="font-bold text-xs text-red-500 uppercase tracking-wider">Les Défis Clés :</h5>
                  <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-sans">
                    {selectedProject.challenges.map((c, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-red-500 mr-2 font-bold shrink-0">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-bold text-xs text-brand-emerald uppercase tracking-wider">Solutions Apportées :</h5>
                  <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-sans">
                    {selectedProject.solutions.map((s, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-brand-emerald mr-2 font-bold shrink-0">✔</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Optional Case testimonial */}
              {selectedProject.testimonial && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-2">
                  <p className="text-xs italic text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
                    "{selectedProject.testimonial.text}"
                  </p>
                  <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    — {selectedProject.testimonial.author}, {selectedProject.testimonial.role}
                  </span>
                </div>
              )}
            </div>

            {/* case stats & image sidebar column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* stats display box */}
              <div className="bg-slate-50 dark:bg-slate-850 p-6 rounded-2xl border border-slate-150/40 dark:border-slate-800 space-y-4">
                <h5 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/40 pb-2">
                  Indicateurs de Performance (KPIs)
                </h5>
                <div className="space-y-3 font-sans text-xs">
                  {selectedProject.stats?.map((stat, sIdx) => (
                    <div key={sIdx} className="space-y-0.5">
                      <span className="block font-bold text-base text-brand-emerald">{stat.value}</span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">{stat.label}</span>
                    </div>
                  ))}
                  <div className="pt-2">
                    <span className="block text-[10px] text-slate-400">Client : {selectedProject.client}</span>
                    <span className="block text-[10px] text-slate-400 mt-1">Lieu : {selectedProject.location} • Année : {selectedProject.year}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Immersive Photo Gallery with Lightbox */}
        <section id="photo-gallery-section" className="py-12 mb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
              Galerie d'Images de nos Récents Travaux
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 font-semibold">
              Des moments forts capturés en salle et sur le terrain
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                id={`gallery-item-${idx}`}
                onClick={() => setLightboxImage(img.url)}
                className="relative group rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                {/* Hover overlay with Title */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-5 transition-opacity duration-200">
                  <div className="w-8 h-8 rounded-full bg-brand-emerald text-white flex items-center justify-center mb-2">
                    <Camera className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white font-sans">{img.title}</h4>
                  <span className="text-[9px] text-slate-350 mt-0.5 uppercase tracking-wider">Agrandir la photo</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Alumni Testimonials Segment (Témoignages d'anciens participants) */}
        <section id="alumni-testimonials" className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center space-x-1.5 bg-brand-emerald/10 text-brand-emerald px-3 py-1 rounded-full text-xs font-bold mb-3">
              <MessageSquare className="w-4 h-4" />
              <span>La voix de nos diplômés</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold">
              Que Deviennent nos Anciens Auditeurs ?
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Le retour d'expérience de hauts cadres ayant suivi nos parcours de certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(test => (
              <div key={test.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <p className="text-xs italic text-slate-300 font-serif leading-relaxed">
                  "{test.text}"
                </p>
                <div className="flex items-center space-x-3.5 pt-3 border-t border-slate-900">
                  <img
                    src={test.avatarUrl}
                    alt={test.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-brand-emerald"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-white">{test.name}</h5>
                    <p className="text-[9px] text-slate-400">{test.role} • {test.organization}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Executive video presentations option segment */}
        <section id="video-introduction-spot" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-8 shadow-sm text-center max-w-4xl mx-auto space-y-6">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Présentation Institutionnelle en Vidéo (Enregistrements Académiques)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans max-w-2xl mx-auto font-light">
            Découvrez en moins de 3 minutes les coulisses de notre pôle académique, l'équipement de nos salles de classes d'Abidjan, et les témoignages vidéos de nos promotions d'anciens apprenants.
          </p>

          <div className="relative aspect-video max-w-xl mx-auto rounded-2xl overflow-hidden bg-slate-950 shadow-md group border border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
              alt="Video Preview Presentation CICEXF"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-55"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                id="btn-play-simulated-video"
                onClick={() => alert("Lancement de la vidéo de présentation institutionnelle du Cabinet CICEXF (Démonstration d'ambiance académique).")}
                className="w-16 h-16 rounded-full bg-brand-emerald text-white flex items-center justify-center shadow-2xl hover:scale-108 transition-transform cursor-pointer"
                aria-label="Lire la vidéo"
              >
                <Play className="w-6 h-6 fill-white" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-left bg-slate-950/80 backdrop-blur-md p-3 rounded-lg text-[10px] text-white">
              <span className="block font-bold">CICEXF Academy : Tour de Table des Promotions</span>
              <span className="block text-[8px] text-slate-400 mt-0.5">Durée : 02m 45s • Abidjan, Côte d'Ivoire</span>
            </div>
          </div>
        </section>

      </div>

      {/* 6. Interactive Lightbox Modal overlay */}
      {lightboxImage && (
        <div
          id="gallery-lightbox-modal"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors bg-white/10 rounded-full"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="Agrandissement de la réalisation du cabinet CICEXF"
              referrerPolicy="no-referrer"
              className="max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            <p className="text-white text-xs mt-4 font-sans text-center">
              Cliquez n'importe où en dehors pour fermer l'affichage grand écran.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
