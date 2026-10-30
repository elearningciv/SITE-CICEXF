import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Target, Eye, Gem, CheckCircle2, Facebook } from 'lucide-react';
import { CABINET_INFO } from '../../data';
import { DomainIntervention } from '../../types';
import { getDomainImage } from '../../lib/domainImages';

/** True once the element has scrolled into view (never resets). */
function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold, rootMargin: '0px 0px -10% 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold]);
  return [ref, inView] as const;
}

/** Number that counts up from 0 once `start` becomes true. */
function CountUp({ to, start, suffix = '', prefix = '' }: { to: number; start: boolean; suffix?: string; prefix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setValue(to); return; }
    const duration = 1800;
    const t0 = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, to]);
  return <>{prefix}{value.toLocaleString('fr-FR')}{suffix}</>;
}

const TABS = [
  {
    id: 'mission',
    label: 'Notre mission',
    icon: Target,
    quote: "Accompagner les organisations et les professionnels dans l'optimisation durable de leurs performances.",
    text: "Nous combinons diagnostics de haute précision, feuilles de route sur mesure et outils de pilotage immédiatement exploitables, avec un devoir d'accompagnement qui se poursuit bien au-delà de chaque mission."
  },
  {
    id: 'vision',
    label: 'Notre vision',
    icon: Eye,
    quote: "Devenir une référence internationale incontournable en expertise et ingénierie de solutions innovantes.",
    text: "À l'horizon 2030, nous anticipons les mutations économiques, écologiques et technologiques pour proposer des modèles d'intervention alignés sur les standards de gouvernance les plus exigeants, à l'échelle panafricaine et mondiale."
  },
  {
    id: 'valeurs',
    label: 'Nos valeurs',
    icon: Gem,
    quote: "L'éthique, la rigueur et l'excellence au cœur de chaque action et de chaque décision.",
    text: ''
  }
] as const;

const STATS = [
  { to: 2000, prefix: '+', label: 'Cadres et professionnels formés' },
  { to: 150, prefix: '+', label: "Missions d'envergure réalisées" },
  { to: 50, prefix: '+', label: 'Partenaires institutionnels' },
  { to: 95, suffix: ' %', label: 'Taux de satisfaction' }
];

/** Animation helper: hidden + shifted until `on`, then fades/slides in after `delay` ms */
const reveal = (on: boolean, delay = 0, from = 'translate-y-8') =>
  ({
    className: `transition-all duration-700 ease-out ${on ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${from}`}`,
    style: { transitionDelay: `${on ? delay : 0}ms` }
  });

export default function AboutSection({ goTo, poles, onOpenDomain }: { goTo: (tab: string) => void; poles: DomainIntervention[]; onOpenDomain: (id: string) => void }) {
  const [sectionRef, visible] = useInView<HTMLElement>(0.05);
  const [statsRef, statsVisible] = useInView<HTMLDivElement>(0.3);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('mission');
  const tab = TABS.find(t => t.id === activeTab)!;
  const tabIndex = TABS.findIndex(t => t.id === activeTab);

  return (
    <section id="about-preview" ref={sectionRef} className="relative overflow-hidden bg-slate-50 py-10 dark:bg-slate-900 sm:py-14">

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">

        {/* Text column */}
        <div>
          <div {...reveal(visible, 100)} className={`${reveal(visible, 100).className} flex items-center gap-3`}>
            <span className={`h-0.5 bg-brand-emerald transition-all duration-1000 ease-out ${visible ? 'w-12' : 'w-0'}`} />
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-emerald dark:text-orange-300">Qui sommes-nous ?</p>
          </div>

          <h2 {...reveal(visible, 200)} className={`${reveal(visible, 200).className} mt-4 font-display text-3xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-4xl`}>
            Un cabinet d'experts au service de la performance des organisations africaines
          </h2>

          <p {...reveal(visible, 300)} className={`${reveal(visible, 300).className} mt-5 text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg`}>
            Né de la volonté d'experts chevronnés, d'universitaires et de praticiens de haut niveau, le <strong className="text-slate-900 dark:text-white">CICEXF</strong> met
            une ingénierie de conseil indépendante et la formation certifiante au service des administrations, des grands
            projets de développement et des entreprises, depuis Abidjan et ses antennes du Bénin, du Togo, du Mali et du Burkina Faso.
          </p>

          {/* Mission / Vision / Values tabs */}
          <div {...reveal(visible, 450)} className={`${reveal(visible, 450).className} mt-8`}>
            <div role="tablist" aria-label="Mission, vision et valeurs" className="relative grid grid-cols-3 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
              <span
                aria-hidden="true"
                className="absolute inset-y-1 left-1 rounded-xl bg-[#002447] transition-transform duration-500 ease-[cubic-bezier(.77,0,.18,1)]"
                style={{ width: 'calc((100% - 0.5rem) / 3)', transform: `translateX(${tabIndex * 100}%)` }}
              />
              {TABS.map(t => (
                <button
                  key={t.id}
                  role="tab"
                  id={`about-tab-${t.id}`}
                  aria-selected={activeTab === t.id}
                  aria-controls="about-tabpanel"
                  onClick={() => setActiveTab(t.id)}
                  className={`relative z-10 flex items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-bold transition-colors duration-300 sm:text-sm cursor-pointer ${activeTab === t.id ? 'text-white' : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                >
                  <t.icon className="hidden w-4 h-4 sm:block" />
                  {t.label}
                </button>
              ))}
            </div>

            <div
              key={tab.id}
              id="about-tabpanel"
              role="tabpanel"
              aria-labelledby={`about-tab-${tab.id}`}
              className="mt-6 min-h-[150px] animate-[fadeUp_.5s_ease-out]"
            >
              <blockquote className="border-l-4 border-brand-emerald pl-4 font-display text-lg font-bold italic leading-snug text-slate-900 dark:text-white">
                « {tab.quote} »
              </blockquote>
              {tab.id === 'valeurs' ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {CABINET_INFO.valeurs.map((v, i) => (
                    <li
                      key={v.nom}
                      title={v.description}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 animate-[fadeUp_.5s_ease-out_both] dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      {v.nom}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">{tab.text}</p>
              )}
            </div>
          </div>

          <div {...reveal(visible, 600)} className={`${reveal(visible, 600).className} mt-8 flex flex-wrap items-center gap-4`}>
            <button
              onClick={() => goTo('about')}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-emerald px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand-emerald/20 transition-all hover:bg-brand-emerald-dark hover:shadow-xl cursor-pointer"
            >
              Découvrir le cabinet
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="https://www.facebook.com/CabinetCICEXF"
              target="_blank"
              rel="noreferrer"
              aria-label="CICEXF sur Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#002447] shadow ring-1 ring-slate-200 transition-colors hover:bg-[#002447] hover:text-white dark:bg-slate-800 dark:text-white dark:ring-slate-700"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Visual: mosaic of our expertise poles, each opening its domain */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {poles.slice(0, 6).map((d, i) => (
            <button
              key={d.id}
              onClick={() => onOpenDomain(d.id)}
              style={reveal(visible, 150 + i * 120, 'translate-y-6 scale-95').style}
              className={`${reveal(visible, 150 + i * 120, 'translate-y-6 scale-95').className} group relative overflow-hidden rounded-2xl bg-slate-200 shadow-md cursor-pointer ${i === 0 ? 'col-span-2 row-span-2 aspect-square sm:aspect-auto' : 'aspect-square'}`}
              aria-label={`Voir le domaine : ${d.title}`}
            >
              <img src={getDomainImage(d)} alt="" loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 bg-[#001a33]/40 transition-colors group-hover:bg-[#001a33]/25" />
              <span className={`absolute inset-x-2 bottom-2 rounded-lg bg-white/95 px-2.5 py-1.5 text-left font-bold leading-snug text-[#002447] shadow ${i === 0 ? 'text-sm sm:text-base' : 'text-[11px] sm:text-xs line-clamp-2'}`}>
                {d.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Key figures with count-up */}
      <div className="relative mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={statsRef} className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-slate-200 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-800 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className="relative bg-white px-6 py-8 text-center dark:bg-slate-950">
              <p className="font-display text-3xl font-extrabold text-[#002447] dark:text-white sm:text-4xl">
                <CountUp to={s.to} start={statsVisible} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 bg-brand-emerald transition-all duration-[1600ms] ease-out"
                style={{ width: statsVisible ? '100%' : '0%', transitionDelay: `${i * 150}ms` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
