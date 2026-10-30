import { useState, useEffect, FormEvent } from 'react';
import {
  ArrowRight, Phone, Star, X, CheckCircle2, Clock, Presentation, Mail,
  GraduationCap, TrendingUp, Cpu, Compass, ShieldCheck, Target, BookOpen, Layers
} from 'lucide-react';
import { FORMATIONS, DOMAINS_INTERVENTION, PARTNERS, BLOG_POSTS, TESTIMONIALS, CABINET_INFO } from '../data';
import { Formation, BlogPost, Partner, DomainIntervention } from '../types';
import { trackSubscription } from '../lib/tracker';
import Carousel from './home/Carousel';
import AboutSection from './home/AboutSection';
import heroExecutiveImg from '../assets/images/african_executive_hero_1791597544124.webp';
import consultingTeamImg from '../assets/images/african_consulting_team_1791597559536.webp';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  setSelectedDomainId: (id: string | null) => void;
  formations?: Formation[];
  blogPosts?: BlogPost[];
  partners?: Partner[];
  accompagnements?: DomainIntervention[];
  onOpenAssistant?: () => void;
  onSearch?: (query: string) => void;
}

const unsplash = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

const DOMAIN_ICONS: Record<string, typeof GraduationCap> = {
  GraduationCap, TrendingUp, Cpu, Compass, ShieldCheck, Target, BookOpen, Layers
};

// Placeholder text typed while testing in the admin (e.g. "XXXX", "AAAA") must not be shown to visitors
const isPlaceholder = (text?: string) => !text || /(.)\1{7,}/i.test(text.replace(/\s/g, ''));

const initials = (name: string) =>
  name.replace(/^(M\.|Mme|Dr\.|Pr\.)\s*/i, '').split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();

const WELCOME_KEY = 'cicexf_welcome_popup_seen';

/** Section title with the decorative side rules */
function SectionTitle({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <span className={`h-px flex-1 ${light ? 'bg-white/40' : 'bg-brand-emerald/40'}`} />
      <h2 className={`text-center font-display text-2xl sm:text-3xl font-extrabold ${light ? 'text-white' : 'text-brand-emerald dark:text-orange-300'}`}>
        {children}
      </h2>
      <span className={`h-px flex-1 ${light ? 'bg-white/40' : 'bg-brand-emerald/40'}`} />
    </div>
  );
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
  const [showWelcome, setShowWelcome] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Welcome pop-up, shown once per visit after a short delay
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(WELCOME_KEY) === '1'; } catch {}
    if (seen) return;
    const timer = setTimeout(() => setShowWelcome(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    try { sessionStorage.setItem(WELCOME_KEY, '1'); } catch {}
  };

  useEffect(() => {
    if (!showWelcome) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeWelcome(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showWelcome]);

  const goTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openFormation = (id: string) => { setSelectedDomainId(id); goTo('formations'); };
  const openDomain = (id: string) => { setSelectedDomainId(id); goTo('accompagnements'); };

  const handleNewsletter = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(newsletterEmail.trim())) return;
    trackSubscription(newsletterEmail.trim(), true);
    setSubscribed(true);
    setNewsletterEmail('');
  };

  const nextSession = formations.find(f => f.sessions && f.sessions[0]?.date)?.sessions?.[0];

  const valueCards = [
    {
      title: 'Montez en compétences',
      text: 'Data, gestion de projet, finance, QHSE, SIG : des savoir-faire directement applicables à votre poste.',
      image: unsplash('photo-1522202176988-66273c2fd55f'),
      tab: 'formations'
    },
    {
      title: 'Certifiez votre expertise',
      text: 'Un certificat professionnel nominatif délivré par un cabinet agréé pour valoriser votre parcours.',
      image: unsplash('photo-1551836022-d5d88e9218df'),
      tab: 'formations'
    },
    {
      title: 'Transformez votre organisation',
      text: 'Formations sur mesure et missions de conseil pour les entreprises, administrations et projets.',
      image: unsplash('photo-1552664730-d307ca884978'),
      tab: 'accompagnements'
    }
  ];

  const approachTiles = [
    {
      title: 'Formation en présentiel',
      text: 'Nos experts vous accueillent dans nos salles du siège à Abidjan pour des sessions intensives et interactives.',
      image: unsplash('photo-1524178232363-1fb2b075b655'),
      tab: 'formations'
    },
    {
      title: 'Formation hybride & en ligne',
      text: 'Cours en direct via Zoom, accès aux enregistrements et aux laboratoires : formez-vous où que vous soyez.',
      image: unsplash('photo-1588196749597-9ff075ee6b5b'),
      tab: 'formations'
    },
    {
      title: 'Formation intra-entreprise',
      text: 'Un programme conçu pour vos équipes, dans vos locaux ou les nôtres, avec convention et proforma sous 24 h.',
      image: unsplash('photo-1517245386807-bb43f82c33c4'),
      tab: 'contact'
    }
  ];

  const gallery = [
    { image: unsplash('photo-1524178232363-1fb2b075b655', 700), caption: 'Auditoire & travaux dirigés' },
    { image: unsplash('photo-1517245386807-bb43f82c33c4', 700), caption: 'Atelier interactif par équipe' },
    { image: unsplash('photo-1531482615713-2afd69097998', 700), caption: 'Présentation de livrables Power BI' },
    { image: unsplash('photo-1551836022-d5d88e9218df', 700), caption: 'Remise officielle des certificats' },
    { image: consultingTeamImg, caption: 'Étude de cas en salle exécutive' }
  ];

  return (
    <div id="home-view" className="relative font-sans overflow-hidden bg-white dark:bg-slate-950">

      {/* Welcome pop-up */}
      {showWelcome && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 animate-[fadeIn_.3s_ease-out]" onClick={closeWelcome}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-[popIn_.35s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeWelcome} aria-label="Fermer" className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow hover:bg-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <img src={heroExecutiveImg} alt="" className="h-48 w-full object-cover object-top" />
            <div className="p-7 text-center">
              <h2 id="welcome-title" className="font-display text-xl font-extrabold text-slate-900">Bienvenue au CICEXF</h2>
              <p className="mt-2 text-sm text-slate-700">
                Découvrez nos formations certifiantes{nextSession ? <> · prochaine session : <strong>{nextSession.date}</strong></> : ''}.
                Paiement en 2 ou 3 fois sans frais.
              </p>
              <button
                onClick={() => { closeWelcome(); goTo('formations'); }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-emerald px-7 py-3 text-sm font-bold text-white hover:bg-brand-emerald-dark cursor-pointer"
              >
                Voir les formations <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Hero: photo + large brand circle */}
      <section id="hero-banner" className="relative overflow-hidden bg-white dark:bg-slate-950">
        <div className="relative mx-auto max-w-7xl lg:min-h-[600px]">
          <img
            src={consultingTeamImg}
            alt="Formation d'experts au siège du CICEXF à Abidjan"
            className="h-64 w-full object-cover sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[72%] lg:rounded-bl-[120px]"
          />
          <div className="relative px-4 sm:px-6 lg:absolute lg:inset-y-0 lg:left-8 lg:flex lg:items-center lg:px-0">
            <div className="-mt-20 mx-auto flex aspect-square w-[min(88vw,440px)] flex-col items-center justify-center rounded-full bg-[#002447] p-10 text-center text-white shadow-2xl ring-8 ring-white dark:ring-slate-950 sm:p-12 lg:mt-0 lg:w-[460px] animate-[popIn_.7s_ease-out]">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Cabinet agréé</p>
              <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                Bienvenue au<br />CICEXF
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-100 sm:text-base">
                Formation, expertise et conseil pour développer les compétences et la performance des organisations.
              </p>
              <button
                id="hero-cta-formations"
                onClick={() => goTo('formations')}
                className="mt-6 rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-[#001a33] hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Découvrir nos formations certifiantes
              </button>
              <a href={`tel:${CABINET_INFO.telephones.whatsappAdmissions.replace(/\s/g, '')}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-amber-300">
                <Phone className="w-4 h-4" /> {CABINET_INFO.telephones.whatsappAdmissions}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three value-proposition picture cards */}
      <section id="value-cards" className="py-14 sm:py-16 bg-white dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {valueCards.map(card => (
            <button key={card.title} onClick={() => goTo(card.tab)} className="group text-left cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <img src={card.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <h3 className="absolute bottom-4 left-4 right-4 font-display text-2xl font-extrabold leading-tight text-white">
                  <span className="bg-brand-emerald box-decoration-clone px-2 leading-[1.5]">{card.title}</span>
                </h3>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">{card.text}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Who we are */}
      <AboutSection goTo={goTo} />

      {/* 4. Partners carousel (hidden while no partner is published) */}
      {partners.length > 0 && (
      <section id="partners-section" className="py-14 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>Nos partenaires</SectionTitle>
          <div className="mt-10 px-6">
            <Carousel label="Nos partenaires" perView={{ base: 2, sm: 3, lg: 5 }} autoplay={2500} showDots={false} loop>
              {partners.map(p => (
                <div key={p.id} className="flex h-28 flex-col items-center justify-center rounded-xl bg-white px-4 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <span className="font-display text-sm font-extrabold text-[#002447] dark:text-white sm:text-base">{p.name}</span>
                  {p.category && <span className="mt-1 text-xs text-slate-600 dark:text-slate-400">{p.category}</span>}
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>
      )}

      {/* 5. Training approach tiles */}
      <section id="why-choose-us" className="py-16 sm:py-20 bg-slate-100 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>Notre approche de formation</SectionTitle>
          <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-xl md:grid-cols-3">
            {approachTiles.map(tile => (
              <div key={tile.title} className="group relative min-h-[380px] overflow-hidden">
                <img src={tile.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-slate-950/70 transition-colors duration-500 group-hover:bg-[#002447]/85" />
                <div className="relative flex h-full flex-col p-8 text-white">
                  <h3 className="font-display text-2xl font-extrabold">{tile.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-100">{tile.text}</p>
                  <button onClick={() => goTo(tile.tab)} className="mt-auto self-start rounded-full bg-amber-400 px-6 py-2.5 text-sm font-bold text-[#001a33] hover:bg-amber-300 transition-colors cursor-pointer">
                    En savoir plus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Course catalogue carousel (live content) */}
      <section id="recent-news-preview" className="py-16 sm:py-20 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>Nos formations certifiantes</SectionTitle>
          <div className="mt-10 px-6">
            <Carousel label="Nos formations certifiantes" perView={{ base: 1, sm: 2, lg: 3 }} autoplay={6000}>
              {formations.map(f => (
                <article key={f.id} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <button onClick={() => openFormation(f.id)} className="aspect-[16/9] overflow-hidden bg-slate-200 cursor-pointer" aria-label={`Voir la formation ${f.title}`}>
                    {f.featuredImage && <img src={f.featuredImage} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                  </button>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-emerald dark:text-orange-300">{f.domain}</p>
                    <h3 className="mt-2 font-display text-lg font-bold leading-snug text-slate-900 dark:text-white line-clamp-2">{f.title}</h3>
                    {!isPlaceholder(f.shortDescription) && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{f.shortDescription}</p>}
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-500" />{f.duration}</span>
                      <span className="inline-flex items-center gap-1.5"><Presentation className="w-4 h-4 text-slate-500" />{f.modality}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <span className="font-display font-extrabold text-slate-900 dark:text-white">{f.price}</span>
                      <button onClick={() => openFormation(f.id)} className="rounded-full bg-brand-emerald px-4 py-2 text-xs font-bold text-white hover:bg-brand-emerald-dark cursor-pointer">
                        Voir le programme
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* 7. Testimonials carousel on photo background */}
      <section id="testimonials-carousel" className="relative isolate overflow-hidden py-16 sm:py-20">
        <img src={unsplash('photo-1523580494863-6f3031224c94', 1600)} alt="" referrerPolicy="no-referrer" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[#001a33]/80" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl font-extrabold text-white sm:text-3xl">Ce que disent nos participants…</h2>
          <div className="mt-10 px-6">
            <Carousel label="Témoignages" perView={{ base: 1, sm: 2, lg: 3 }} autoplay={5000} tone="dark" loop>
              {TESTIMONIALS.map(t => (
                <figure key={t.id} className="flex h-full flex-col items-center rounded-xl bg-white p-7 text-center shadow-xl">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#002447] font-display text-lg font-bold text-white ring-4 ring-slate-100">{initials(t.name)}</span>
                  <div className="mt-4 flex gap-0.5 text-amber-500" aria-label={`${t.rating} étoiles sur 5`}>
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <figcaption className="mt-3">
                    <span className="block text-base font-bold text-slate-900">{t.role}</span>
                    <span className="block text-xs text-slate-600">{t.organization}</span>
                  </figcaption>
                  <blockquote className="mt-4 flex-1 text-sm italic leading-relaxed text-slate-700">« {t.text} »</blockquote>
                  <p className="mt-4 text-xs font-bold text-slate-900">{t.name}</p>
                </figure>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* 8. Expertise areas carousel */}
      <section id="business-poles" className="py-16 sm:py-20 bg-slate-100 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>Nos pôles d'expertise</SectionTitle>
          <div className="mt-10 px-6">
            <Carousel label="Nos pôles d'expertise" perView={{ base: 1, sm: 2, lg: 4 }} autoplay={4000} loop>
              {currentDomains.map(d => {
                const Icon = DOMAIN_ICONS[d.iconName] || Layers;
                return (
                  <button key={d.id} onClick={() => openDomain(d.id)} className="group flex h-full w-full flex-col rounded-xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-slate-950 dark:ring-slate-800 cursor-pointer">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#002447] text-amber-300 transition-colors group-hover:bg-brand-emerald group-hover:text-white">
                      <Icon className="w-6 h-6" />
                    </span>
                    <h3 className="mt-4 font-display text-base font-bold leading-snug text-slate-900 dark:text-white">{d.title}</h3>
                    {d.subDomains?.length > 0 && <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">{d.subDomains.length} domaines d'intervention</p>}
                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold text-brand-emerald dark:text-orange-300">Découvrir <ArrowRight className="w-4 h-4" /></span>
                  </button>
                );
              })}
            </Carousel>
          </div>
        </div>
      </section>

      {/* 9. Call to action band */}
      <section id="cta-band" className="bg-[#002447] py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-5 px-4 text-center sm:flex-row sm:text-left">
          <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
            Un projet de formation pour vos équipes ?
          </h2>
          <button onClick={() => goTo('contact')} className="shrink-0 rounded-full bg-amber-400 px-7 py-3 text-sm font-bold text-[#001a33] hover:bg-amber-300 transition-colors cursor-pointer">
            Parlons-en !
          </button>
        </div>
      </section>

      {/* 10. Photo gallery carousel */}
      <section id="social-proof-band" className="py-16 sm:py-20 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>Nos moments forts en images</SectionTitle>
        </div>
        <div className="mt-10 px-4 sm:px-6">
          <Carousel label="Galerie photo" perView={{ base: 1, sm: 2, lg: 3 }} autoplay={4000} showDots={false} loop>
            {gallery.map(g => (
              <figure key={g.caption} className="group relative aspect-[4/3] overflow-hidden rounded-xl">
                <img src={g.image} alt={g.caption} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm font-bold text-white">{g.caption}</figcaption>
              </figure>
            ))}
          </Carousel>
        </div>
      </section>

      {/* 12. Newsletter */}
      <section id="newsletter" className="py-16 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Mail className="mx-auto w-9 h-9 text-brand-emerald dark:text-orange-300" />
          <h2 className="mt-3 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Inscrivez-vous à notre lettre d'information</h2>
          <p className="mt-3 text-base text-slate-700 dark:text-slate-300">
            Recevez nos calendriers de sessions, nos analyses et nos offres en avant-première.
          </p>
          {subscribed ? (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              <CheckCircle2 className="w-5 h-5" /> Merci, votre inscription est enregistrée.
            </p>
          ) : (
            <form onSubmit={handleNewsletter} className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
              <label htmlFor="home-newsletter-email" className="sr-only">Adresse e-mail</label>
              <input
                id="home-newsletter-email"
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Votre adresse e-mail"
                className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm text-slate-900 outline-none focus:border-brand-emerald dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <button type="submit" className="rounded-full bg-brand-emerald px-7 py-3 text-sm font-bold text-white hover:bg-brand-emerald-dark transition-colors cursor-pointer">
                S'abonner
              </button>
            </form>
          )}
          {onOpenAssistant && (
            <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
              Une question ?{' '}
              <button onClick={onOpenAssistant} className="font-bold text-brand-emerald underline dark:text-orange-300 cursor-pointer">Demandez à ADILINE</button>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
