// Site tabs. Labels are wrapped in t() so the extractor lists them for translation;
// this t() only marks the text, the real translation happens when the menu is drawn.
const t = (s: string) => s;

export interface NavItem { label: string; to: string }
export interface NavTab { id: string; label: string; path: string; intro: string; items: NavItem[] }

export const NAV: NavTab[] = [
  { id: 'institut', label: t("L'Institut"), path: '/institut', intro: t("Qui nous sommes et comment l'institution est organisée."), items: [
    { label: t('Présentation et mission'), to: '/institut#mission' },
    { label: t('Mot du Directeur'), to: '/institut#mot' },
    { label: t('Historique'), to: '/institut#historique' },
    { label: t('Gouvernance'), to: '/institut#gouvernance' },
    { label: t('Chiffres clés'), to: '/institut#chiffres' }
  ] },
  { id: 'recherche', label: t('Recherche'), path: '/recherche', intro: t('Les axes, les programmes et les projets en cours ou terminés.'), items: [
    { label: t('Axes et programmes'), to: '/recherche#axes' },
    { label: t('Projets en cours'), to: '/recherche#projets' },
    { label: t('Projets terminés'), to: '/recherche#termines' }
  ] },
  { id: 'publications', label: t('Publications'), path: '/publications', intro: t('La bibliothèque numérique, avec recherche et téléchargement.'), items: [
    { label: t('Toutes les publications'), to: '/publications' },
    { label: t('Articles scientifiques'), to: '/publications#article' },
    { label: t('Documents de travail'), to: '/publications#document-de-travail' },
    { label: t('Policy briefs'), to: '/publications#policy-brief' },
    { label: t('Rapports de recherche'), to: '/publications#rapport' }
  ] },
  { id: 'chercheurs', label: t('Chercheurs'), path: '/chercheurs', intro: t("L'annuaire de l'équipe scientifique et de ses associés."), items: [
    { label: t('Équipe de direction'), to: '/chercheurs#equipe-de-direction' },
    { label: t('Chercheurs permanents'), to: '/chercheurs#chercheurs-permanents' },
    { label: t('Chercheurs associés'), to: '/chercheurs#chercheurs-associes' },
    { label: t('Doctorants'), to: '/chercheurs#doctorants' }
  ] },
  { id: 'formations', label: t('Formations'), path: '/formations', intro: t('Le renforcement des capacités : séminaires, ateliers, encadrement.'), items: [
    { label: t('Catalogue des formations'), to: '/formations#catalogue' },
    { label: t('Calendrier des sessions'), to: '/formations#calendrier' },
    { label: t('Inscription en ligne'), to: '/formations#inscription' }
  ] },
  { id: 'expertise', label: t('Expertise'), path: '/expertise', intro: t('Études commanditées, évaluations et appui aux institutions.'), items: [
    { label: t('Nos services'), to: '/expertise#services' },
    { label: t('Demander une étude'), to: '/expertise#demande' }
  ] },
  { id: 'actualites', label: t('Actualités'), path: '/actualites', intro: t("La vie de l'institut et l'agenda scientifique."), items: [
    { label: t('Actualités'), to: '/actualites#actualites' },
    { label: t('Agenda des événements'), to: '/actualites#agenda' }
  ] },
  { id: 'opportunites', label: t('Opportunités'), path: '/opportunites', intro: t('Pour les chercheurs, étudiants et partenaires.'), items: [
    { label: t('Appels à projets et à communications'), to: '/opportunites#liste' },
    { label: t('Bourses et stages'), to: '/opportunites#liste' },
    { label: t('Candidater'), to: '/opportunites#candidater' }
  ] },
  { id: 'contact', label: t('Contact'), path: '/contact', intro: t('Nous écrire et devenir partenaire.'), items: [
    { label: t('Formulaire de contact'), to: '/contact#formulaire' },
    { label: t('Nos partenaires'), to: '/contact#partenaires' }
  ] }
];

export const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
