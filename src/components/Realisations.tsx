import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, Building2, Calendar, CheckCircle2, ChevronRight, MapPin, Quote, Search, Star, Target, X,
  ClipboardCheck, PenTool, Rocket, LineChart, Camera
} from 'lucide-react';
import { PROJECTS } from '../data';
import { useTestimonials } from '../lib/testimonials';
import { Project } from '../types';
import Carousel from './home/Carousel';

interface RealisationsProps {
  selectedDomainId?: string | null;
  setSelectedDomainId?: (id: string | null) => void;
  projects?: Project[];
  setActiveTab?: (tab: string) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=75';

// Placeholder text typed while testing in the admin (e.g. "XXXX") must not be shown to visitors
const isPlaceholder = (text?: string) => !text || /(.)\1{7,}/i.test(text.replace(/\s/g, ''));

const initials = (name: string) =>
  name.replace(/^(M\.|Mme|Dr\.|Pr\.)\s*/i, '').split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();

/** Projects created in the admin may miss optional fields: normalise them once */
const normalise = (p: Project): Project => ({
  ...p,
  category: p.category || 'Mission',
  client: p.client || '',
  location: p.location || '',
  description: isPlaceholder(p.description) ? '' : p.description,
  imageUrl: p.imageUrl || FALLBACK_IMAGE,
  stats: Array.isArray(p.stats) ? p.stats.filter(s => s && s.value) : [],
  challenges: Array.isArray(p.challenges) ? p.challenges.filter(Boolean) : [],
  solutions: Array.isArray(p.solutions) ? p.solutions.filter(Boolean) : []
});

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); observer.disconnect(); } }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);
  return [ref, inView] as const;
}

function CountUp({ to, start, prefix = '', suffix = '' }: { to: number; start: boolean; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setV(to); return; }
    const t0 = performance.now();
    let f = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1600);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) f = requestAnimationFrame(tick);
    };
    f = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(f);
  }, [start, to]);
  return <>{prefix}{v.toLocaleString('fr-FR')}{suffix}</>;
}

const IMPACT = [
  { to: 150, prefix: '+', label: "Missions d'envergure réalisées" },
  { to: 2000, prefix: '+', label: 'Cadres et professionnels formés' },
  { to: 50, prefix: '+', label: 'Partenaires institutionnels et bailleurs' },
  { to: 5, label: "Pays d'intervention en Afrique de l'Ouest" }
];

const METHOD = [
  { icon: ClipboardCheck, title: 'Diagnostic', text: "Analyse de la situation, des besoins et des contraintes avec les équipes du client." },
  { icon: PenTool, title: 'Conception', text: 'Solution sur mesure : feuille de route, outils, programme de formation et plan de déploiement.' },
  { icon: Rocket, title: 'Déploiement', text: 'Mise en œuvre accompagnée sur le terrain, avec transfert de compétences aux équipes locales.' },
  { icon: LineChart, title: "Mesure d'impact", text: 'Indicateurs de résultats, rapport final et suivi pour pérenniser les acquis.' }
];

const GALLERY = [
  { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=75', title: 'Atelier de formation à Abidjan' },
  { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=75', title: 'Travaux pratiques en équipe' },
  { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=75', title: 'Soutenance de projets devant le jury' },
  { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=75', title: 'Remise des certificats' },
  { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=75', title: "Réunion d'assistance technique" },
  { url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=75', title: 'Mission SIG sur le terrain' }
];

export default function Realisations({ selectedDomainId, setSelectedDomainId, projects, setActiveTab }: RealisationsProps) {
  const allProjects = useMemo(
    () => (projects && projects.length > 0 ? projects : PROJECTS).map(normalise),
    [projects]
  );
  const categories = useMemo(() => ['Toutes', ...Array.from(new Set(allProjects.map(p => p.category)))], [allProjects]);
  const [filter, setFilter] = useState('Toutes');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [impactRef, impactVisible] = useInView<HTMLDivElement>();
  const testimonials = useTestimonials();

  // A project can be opened directly (e.g. from the site search)
  useEffect(() => {
    if (selectedDomainId && allProjects.some(p => p.id === selectedDomainId)) setOpenId(selectedDomainId);
  }, [selectedDomainId, allProjects]);

  const visibleProjects = allProjects.filter(p => {
    if (filter !== 'Toutes' && p.category !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [p.title, p.client, p.location, p.category, p.description].join(' ').toLowerCase().includes(q);
  });

  const openProject = allProjects.find(p => p.id === openId) || null;

  const closeProject = () => {
    setOpenId(null);
    if (setSelectedDomainId) setSelectedDomainId(null);
  };

  useEffect(() => {
    if (!openProject && lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setLightbox(null); closeProject(); }
      if (lightbox !== null && e.key === 'ArrowRight') setLightbox((lightbox + 1) % GALLERY.length);
      if (lightbox !== null && e.key === 'ArrowLeft') setLightbox((lightbox - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openProject, lightbox]);

  const goTo = (tab: string) => {
    closeProject();
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="realisations-view" className="min-h-screen bg-white font-sans dark:bg-slate-950">

      {/* 1. Page banner */}
      <section className="relative isolate overflow-hidden bg-[#002447] text-white">
        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=70" alt="" referrerPolicy="no-referrer" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20" />
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-slate-200">
            <button onClick={() => goTo('news')} className="hover:text-white hover:underline cursor-pointer">Actualités</button>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-white">Nos réalisations</span>
          </nav>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-5xl animate-[fadeUp_.6s_ease-out]">
            Nos réalisations
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg animate-[fadeUp_.8s_ease-out]">
            Missions de conseil, d'expertise et de formation menées pour des administrations, des entreprises,
            des projets de développement et des bailleurs internationaux.
          </p>
        </div>
      </section>

      {/* 2. Impact figures */}
      <section className="relative z-10 -mt-10 px-4 sm:px-6 lg:px-8">
        <div ref={impactRef} className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 lg:grid-cols-4">
          {IMPACT.map((item, i) => (
            <div key={item.label} className={`px-5 py-6 text-center ${i > 0 ? 'border-l border-slate-200 dark:border-slate-800' : ''} ${i === 2 ? 'border-l-0 lg:border-l' : ''} ${i >= 2 ? 'border-t border-slate-200 dark:border-slate-800 lg:border-t-0' : ''}`}>
              <p className="font-display text-3xl font-extrabold text-[#002447] dark:text-white">
                <CountUp to={item.to} start={impactVisible} prefix={item.prefix} />
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Filters + project grid */}
      <section id="case-studies" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-emerald dark:text-orange-300">Études de cas</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Projets de référence</h2>
          </div>
          <label className="relative w-full lg:w-80">
            <span className="sr-only">Rechercher une réalisation</span>
            <Search className="absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Client, pays, domaine…"
              className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-brand-emerald dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
        </div>

        <div role="tablist" aria-label="Filtrer par domaine" className="mt-6 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${filter === cat ? 'bg-[#002447] text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {visibleProjects.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-slate-50 p-8 text-center text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            Aucune réalisation ne correspond à votre recherche.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((p, i) => (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800 animate-[fadeUp_.5s_ease-out_both]"
                style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
              >
                <button onClick={() => setOpenId(p.id)} className="relative aspect-[16/10] overflow-hidden bg-slate-200 cursor-pointer" aria-label={`Voir l'étude de cas : ${p.title}`}>
                  <img src={p.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain bg-white dark:bg-slate-800 transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#002447] px-3 py-1 text-xs font-bold text-white">{p.category}</span>
                </button>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {p.year ? <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{p.year}</span> : null}
                    {p.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{p.location}</span>}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug text-slate-900 dark:text-white line-clamp-3">{p.title}</h3>
                  {p.client && (
                    <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <Building2 className="mt-0.5 w-4 h-4 shrink-0" /><span className="line-clamp-2">{p.client}</span>
                    </p>
                  )}
                  {p.stats && p.stats[0] && (
                    <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
                      <p className="font-display text-xl font-extrabold text-brand-emerald dark:text-orange-300">{p.stats[0].value}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{p.stats[0].label}</p>
                    </div>
                  )}
                  <button onClick={() => setOpenId(p.id)} className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-bold text-brand-emerald hover:underline dark:text-orange-300 cursor-pointer">
                    Lire l'étude de cas <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 4. Method */}
      <section className="bg-slate-50 py-16 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-emerald dark:text-orange-300">Notre méthode</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Une démarche éprouvée, de l'analyse à l'impact</h2>
          </div>
          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {METHOD.map((step, i) => (
              <li key={step.title} className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
                <span className="absolute right-5 top-4 font-display text-4xl font-extrabold text-slate-100 dark:text-slate-800">0{i + 1}</span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#002447] text-amber-300"><step.icon className="w-6 h-6" /></span>
                <h3 className="relative mt-4 font-display text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Testimonials (managed in the admin console) */}
      {testimonials.length > 0 && (
      <section className="relative isolate overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-[#002447]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl font-extrabold text-white sm:text-3xl">Ils témoignent</h2>
          <div className="mt-10 px-6">
            <Carousel label="Témoignages" perView={{ base: 1, sm: 2, lg: 3 }} autoplay={5500} tone="dark" loop>
              {testimonials.map(t => (
                <figure key={t.id} className="flex h-full flex-col rounded-xl bg-white p-7 shadow-xl">
                  <Quote className="w-8 h-8 text-amber-500" />
                  <div className="mt-3 flex gap-0.5 text-amber-500" aria-label={`${t.rating} étoiles sur 5`}>
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <blockquote className="mt-3 flex-1 text-sm italic leading-relaxed text-slate-700">« {t.text} »</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#002447] text-sm font-bold text-white">{initials(t.name)}</span>
                    <span>
                      <span className="block text-sm font-bold text-slate-900">{t.name}</span>
                      <span className="block text-xs text-slate-600">{t.role} · {t.organization}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </Carousel>
          </div>
        </div>
      </section>
      )}

      {/* 6. Gallery */}
      <section id="photo-gallery-section" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-emerald dark:text-orange-300">En images</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Sur le terrain et en salle</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {GALLERY.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setLightbox(i)}
              className={`group relative overflow-hidden rounded-2xl bg-slate-200 cursor-pointer ${i === 0 ? 'col-span-2 row-span-2 aspect-square lg:aspect-auto' : 'aspect-[4/3]'}`}
              aria-label={`Agrandir : ${img.title}`}
            >
              <img src={img.url} alt={img.title} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-black/65 p-3 text-left text-xs font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-sm">
                <Camera className="w-4 h-4 shrink-0" /> {img.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 7. Call to action */}
      <section className="bg-brand-emerald py-14 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-extrabold">Un projet similaire ?</h2>
            <p className="mt-2 text-white/90">Nos experts étudient votre besoin et vous proposent une intervention sur mesure.</p>
          </div>
          <button onClick={() => goTo('contact')} className="shrink-0 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#54150A] hover:bg-amber-100 cursor-pointer">
            Parlons de votre projet
          </button>
        </div>
      </section>

      {/* Case study sheet */}
      {openProject && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/60 sm:items-center sm:p-4 animate-[fadeIn_.25s_ease-out]" onClick={closeProject}>
          <article
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-950 sm:rounded-3xl animate-[popIn_.3s_ease-out]"
          >
            <div className="relative h-48 shrink-0 sm:h-64">
              <img src={openProject.imageUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-contain bg-white dark:bg-slate-800" />
              <button onClick={closeProject} aria-label="Fermer" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 hover:bg-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute inset-x-6 bottom-5 rounded-2xl bg-[#001a33]/85 p-4 text-white sm:inset-x-8">
                <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-[#001a33]">{openProject.category}</span>
                <h2 id="case-title" className="mt-3 font-display text-xl font-extrabold leading-snug sm:text-2xl">{openProject.title}</h2>
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-7 sm:px-8">
              <dl className="grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-5 text-sm dark:bg-slate-900 sm:grid-cols-3">
                <div><dt className="font-bold text-slate-900 dark:text-white">Client</dt><dd className="text-slate-700 dark:text-slate-300">{openProject.client || '—'}</dd></div>
                <div><dt className="font-bold text-slate-900 dark:text-white">Lieu</dt><dd className="text-slate-700 dark:text-slate-300">{openProject.location || '—'}</dd></div>
                <div><dt className="font-bold text-slate-900 dark:text-white">Année</dt><dd className="text-slate-700 dark:text-slate-300">{openProject.year || '—'}</dd></div>
              </dl>

              {openProject.description && (
                <section className="mt-7">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white"><Target className="w-5 h-5 text-brand-emerald dark:text-orange-300" /> Contexte et mission</h3>
                  <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-slate-700 dark:text-slate-300">{openProject.description}</p>
                </section>
              )}

              {(openProject.challenges.length > 0 || openProject.solutions.length > 0) && (
                <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {openProject.challenges.length > 0 && (
                    <section className="rounded-2xl p-5 ring-1 ring-slate-200 dark:ring-slate-800">
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Les enjeux</h3>
                      <ul className="mt-3 space-y-2">
                        {openProject.challenges.map(c => <li key={c} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />{c}</li>)}
                      </ul>
                    </section>
                  )}
                  {openProject.solutions.length > 0 && (
                    <section className="rounded-2xl p-5 ring-1 ring-slate-200 dark:ring-slate-800">
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Notre intervention</h3>
                      <ul className="mt-3 space-y-2">
                        {openProject.solutions.map(s => <li key={s} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300"><CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0 text-emerald-700 dark:text-emerald-400" />{s}</li>)}
                      </ul>
                    </section>
                  )}
                </div>
              )}

              {openProject.stats && openProject.stats.length > 0 && (
                <section className="mt-7">
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Résultats obtenus</h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {openProject.stats.map(s => (
                      <div key={s.label} className="rounded-2xl bg-[#002447] p-5 text-white">
                        <p className="font-display text-2xl font-extrabold text-amber-300">{s.value}</p>
                        <p className="mt-1 text-sm text-slate-200">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {openProject.testimonial && openProject.testimonial.text && (
                <figure className="mt-7 rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-900">
                  <Quote className="w-7 h-7 text-amber-600" />
                  <blockquote className="mt-2 text-base italic leading-relaxed text-slate-800 dark:text-slate-200">« {openProject.testimonial.text} »</blockquote>
                  <figcaption className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                    {openProject.testimonial.author}{openProject.testimonial.role && <span className="font-normal text-slate-600 dark:text-slate-400"> · {openProject.testimonial.role}</span>}
                  </figcaption>
                </figure>
              )}
            </div>

            <footer className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800 sm:flex-row sm:justify-end sm:px-8">
              <button onClick={closeProject} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-900 cursor-pointer">Fermer</button>
              <button onClick={() => goTo('contact')} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-emerald px-6 py-3 text-sm font-bold text-white hover:bg-brand-emerald-dark cursor-pointer">
                Un projet similaire ? Contactez-nous <ArrowRight className="w-4 h-4" />
              </button>
            </footer>
          </article>
        </div>
      )}

      {/* Gallery lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4 animate-[fadeIn_.2s_ease-out]" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} aria-label="Fermer" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"><X className="w-6 h-6" /></button>
          <figure className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={GALLERY[lightbox].url.replace('w=900', 'w=1600')} alt={GALLERY[lightbox].title} referrerPolicy="no-referrer" className="max-h-[80vh] rounded-xl object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white">{GALLERY[lightbox].title} · {lightbox + 1}/{GALLERY.length}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
