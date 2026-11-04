// Site tabs. Labels are wrapped in t() so the extractor lists them for translation;
// this t() only marks the text, the real translation happens when the menu is drawn.
const t = (s: string) => s;

export interface NavSub { label: string; to: string }
export interface NavTab { id: string; label: string; path: string; subs?: NavSub[] }

export const NAV: NavTab[] = [
  { id: 'institut', label: t("L'Institut"), path: '/institut' },
  { id: 'galerie', label: t('Galerie'), path: '/galerie' },
  { id: 'publications', label: t('Publications'), path: '/publications' },
  { id: 'expertise', label: t('Expertise'), path: '/expertise', subs: [
    { label: t('Expertise'), to: '/expertise' },
    { label: t('Chercheurs'), to: '/expertise#chercheurs' }
  ] },
  { id: 'accompagnement', label: t('Accompagnement'), path: '/accompagnement' },
  { id: 'actualites', label: t('Actualités'), path: '/actualites', subs: [
    { label: t('Actualités'), to: '/actualites' },
    { label: t('Opportunités'), to: '/actualites#opportunites' }
  ] },
  { id: 'contact', label: t('Contact'), path: '/contact' }
];

/** Former addresses, kept working after tabs were merged */
export const ALIASES: Record<string, string> = {
  '/chercheurs': '/expertise#chercheurs',
  '/formations': '/accompagnement',
  '/recherche': '/#axes',
  '/opportunites': '/actualites#opportunites'
};

export const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
