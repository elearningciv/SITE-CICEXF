import { useEffect } from 'react';
import { X, Users, ListChecks, CheckCircle2, Info, ArrowRight, MapPin, Clock, CreditCard, FileText, Video, Building2, MessageCircle } from 'lucide-react';
import { CABINET_INFO } from '../../data';

export type TrainingModeId = 'presentiel' | 'hybride' | 'intra';

interface TrainingMode {
  id: TrainingModeId;
  title: string;
  tagline: string;
  intro: string;
  audience: string[];
  steps: { title: string; text: string }[];
  benefits: string[];
  practical: { icon: typeof MapPin; label: string; value: string }[];
  primary: { label: string; tab: string };
}

const c = CABINET_INFO;

export const TRAINING_MODES: Record<TrainingModeId, TrainingMode> = {
  presentiel: {
    id: 'presentiel',
    title: 'Formation en présentiel',
    tagline: 'Apprendre au contact direct des experts, au siège du cabinet à Abidjan.',
    intro: "Nos sessions en présentiel réunissent les participants dans les salles du siège du CICEXF. Animées par des consultants seniors en activité, elles alternent apports méthodologiques, ateliers pratiques et études de cas tirées d'organisations ouest-africaines, pour une montée en compétences rapide et directement applicable.",
    audience: [
      'Cadres et professionnels en poste souhaitant se perfectionner',
      'Jeunes diplômés et personnes en reconversion',
      'Agents des administrations, ONG et projets de développement',
      "Personnes qui apprennent mieux en groupe et en échange direct avec l'expert"
    ],
    steps: [
      { title: 'Entretien d\'orientation', text: 'Un conseiller vérifie avec vous l\'adéquation entre la formation, votre profil et vos objectifs.' },
      { title: 'Inscription', text: 'Vous recevez sous 24 h la fiche d\'inscription et la facture proforma ; votre place est confirmée au règlement de l\'acompte.' },
      { title: 'Sessions intensives', text: 'Cours, ateliers et travaux dirigés en petits groupes, encadrés par un consultant senior.' },
      { title: 'Évaluation & certificat', text: 'Projet ou évaluation finale, puis remise du certificat professionnel nominatif CICEXF.' }
    ],
    benefits: [
      'Interaction directe et réponses immédiates de l\'expert',
      'Travail sur des cas réels et des données d\'organisations ouest-africaines',
      'Émulation et réseau professionnel au sein de la promotion',
      'Certificat de formation délivré par le CICEXF'
    ],
    practical: [
      { icon: MapPin, label: 'Lieu', value: c.siegePrincipal.adresseComplete },
      { icon: Clock, label: 'Accueil', value: `${c.horairesOuverture.semaine} · ${c.horairesOuverture.samedi}` },
      { icon: CreditCard, label: 'Paiement', value: `${c.financementEtModalites.particuliers} Virement, chèque ou Mobile Money (Orange Money, Wave, MTN MoMo).` }
    ],
    primary: { label: 'Voir les formations', tab: 'formations' }
  },
  hybride: {
    id: 'hybride',
    title: 'Formation hybride & en ligne',
    tagline: 'La même exigence pédagogique, où que vous soyez.',
    intro: "Nos parcours hybrides et en ligne sont diffusés en direct interactif via Zoom. Vous suivez les cours depuis votre bureau ou votre domicile, échangez en temps réel avec le formateur et les autres participants, et gardez un accès illimité aux enregistrements et aux laboratoires pratiques pour réviser à votre rythme.",
    audience: [
      'Professionnels en poste ne pouvant pas se libérer en journée entière',
      'Participants résidant hors d\'Abidjan ou à l\'étranger',
      'Cadres en mission ou en déplacement fréquent',
      'Personnes souhaitant revoir les cours à leur rythme'
    ],
    steps: [
      { title: 'Inscription & accès', text: 'Après votre inscription, vous recevez le calendrier des séances et vos accès aux classes virtuelles.' },
      { title: 'Cours en direct', text: 'Séances interactives via Zoom : démonstrations, questions-réponses et exercices guidés en temps réel.' },
      { title: 'Pratique en autonomie', text: 'Laboratoires, exercices et enregistrements des séances accessibles en illimité pour consolider vos acquis.' },
      { title: 'Évaluation & certificat', text: 'Validation des acquis et remise du certificat professionnel nominatif CICEXF.' }
    ],
    benefits: [
      'Aucun déplacement : vous vous formez depuis n\'importe où',
      'Accès illimité aux enregistrements pour revoir chaque notion',
      'Formule hybride possible : séances en ligne et regroupements à Abidjan',
      'Mêmes formateurs et même certificat que le présentiel'
    ],
    practical: [
      { icon: Video, label: 'Plateforme', value: 'Cours en direct via Zoom, enregistrements et laboratoires accessibles en ligne' },
      { icon: Info, label: 'Prérequis technique', value: 'Un ordinateur et une connexion Internet stable' },
      { icon: CreditCard, label: 'Paiement', value: `${c.financementEtModalites.particuliers} Mobile Money accepté (Orange Money, Wave, MTN MoMo).` }
    ],
    primary: { label: 'Voir les formations', tab: 'formations' }
  },
  intra: {
    id: 'intra',
    title: 'Formation intra-entreprise',
    tagline: 'Un programme conçu pour vos équipes et vos enjeux.',
    intro: "La formation intra-entreprise répond aux besoins spécifiques d'une organisation : entreprise, administration, ONG ou projet. Nos ingénieurs pédagogiques analysent vos besoins, adaptent le programme à vos métiers et à vos outils, puis le déploient dans vos locaux ou dans les nôtres, au calendrier qui vous convient.",
    audience: [
      'Entreprises privées souhaitant former un service ou une équipe',
      'Administrations publiques et collectivités territoriales',
      'ONG, programmes et projets financés par des bailleurs',
      'Directions des ressources humaines pilotant un plan de formation'
    ],
    steps: [
      { title: 'Analyse des besoins', text: 'Échange avec vos responsables pour cerner les compétences à développer et les résultats attendus.' },
      { title: 'Proposition sur mesure', text: 'Programme, calendrier et budget adaptés ; convention et facture proforma transmises sous 24 h.' },
      { title: 'Déploiement', text: 'Animation dans vos locaux ou au siège du CICEXF, en présentiel ou en hybride, avec des cas issus de votre activité.' },
      { title: 'Évaluation de l\'impact', text: 'Évaluation des acquis, certificats nominatifs et bilan de la formation pour votre direction.' }
    ],
    benefits: [
      'Contenu adapté à vos métiers, vos processus et vos outils',
      'Calendrier et lieu choisis selon vos contraintes',
      'Tarif dégressif : -10 % dès 3 participants, -15 % dès 5',
      'Possibilité d\'inscrire la formation dans un plan de formation pluriannuel'
    ],
    practical: [
      { icon: Building2, label: 'Lieu', value: 'Dans vos locaux (sur site) ou au siège du CICEXF à Abidjan' },
      { icon: FileText, label: 'Documents', value: c.financementEtModalites.entreprises },
      { icon: CreditCard, label: 'Règlement', value: 'Virement bancaire, chèque certifié d\'entreprise ou Mobile Money' }
    ],
    primary: { label: 'Demander une proposition', tab: 'contact' }
  }
};

/** Detail sheet for a training mode, opened from the home page tiles. */
export function TrainingModeModal({ modeId, onClose, goTo }: { modeId: TrainingModeId | null; onClose: () => void; goTo: (tab: string) => void }) {
  useEffect(() => {
    if (!modeId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = previous; };
  }, [modeId, onClose]);

  if (!modeId) return null;
  const mode = TRAINING_MODES[modeId];
  const go = (tab: string) => { onClose(); goTo(tab); };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/60 sm:items-center sm:p-4 animate-[fadeIn_.25s_ease-out]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="training-mode-title"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-950 sm:rounded-3xl animate-[popIn_.3s_ease-out]"
      >
        <header className="relative bg-[#002447] px-6 py-7 text-white sm:px-8">
          <button onClick={onClose} aria-label="Fermer" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Notre approche de formation</p>
          <h2 id="training-mode-title" className="mt-2 pr-10 font-display text-2xl font-extrabold sm:text-3xl">{mode.title}</h2>
          <p className="mt-2 text-base text-slate-200">{mode.tagline}</p>
        </header>

        <div className="overflow-y-auto px-6 py-7 sm:px-8">
          <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">{mode.intro}</p>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <section>
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
                <Users className="w-5 h-5 text-brand-emerald dark:text-orange-300" /> Pour qui ?
              </h3>
              <ul className="mt-3 space-y-2">
                {mode.audience.map(item => (
                  <li key={item} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-emerald" />{item}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-5 h-5 text-brand-emerald dark:text-orange-300" /> Vos avantages
              </h3>
              <ul className="mt-3 space-y-2">
                {mode.benefits.map(item => (
                  <li key={item} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-emerald" />{item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-8">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
              <ListChecks className="w-5 h-5 text-brand-emerald dark:text-orange-300" /> Comment ça se passe ?
            </h3>
            <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {mode.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#002447] font-display text-sm font-bold text-white">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">{step.title}</span>
                    <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-8 rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-900">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
              <Info className="w-5 h-5 text-amber-700 dark:text-amber-300" /> Informations pratiques
            </h3>
            <dl className="mt-3 space-y-3">
              {mode.practical.map(p => (
                <div key={p.label} className="flex gap-3 text-sm">
                  <p.icon className="mt-0.5 w-4 h-4 shrink-0 text-amber-700 dark:text-amber-300" />
                  <div>
                    <dt className="font-bold text-slate-900 dark:text-white">{p.label}</dt>
                    <dd className="text-slate-700 dark:text-slate-300">{p.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:justify-end sm:px-8">
          <a
            href={`https://wa.me/${c.telephones.whatsappClean}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-900"
          >
            <MessageCircle className="w-4 h-4" /> Poser une question
          </a>
          <button
            onClick={() => go(mode.primary.tab)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-emerald px-6 py-3 text-sm font-bold text-white hover:bg-brand-emerald-dark cursor-pointer"
          >
            {mode.primary.label} <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      </div>
    </div>
  );
}
