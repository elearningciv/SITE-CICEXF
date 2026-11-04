// Site tabs. Labels are wrapped in t() so the extractor lists them for translation;
// this t() only marks the text, the real translation happens when the menu is drawn.
const t = (s: string) => s;

export interface NavTab { id: string; label: string; path: string }

export const NAV: NavTab[] = [
  { id: 'institut', label: t("L'Institut"), path: '/institut' },
  { id: 'recherche', label: t('Recherche'), path: '/recherche' },
  { id: 'publications', label: t('Publications'), path: '/publications' },
  { id: 'formations', label: t('Formations'), path: '/formations' },
  { id: 'expertise', label: t('Expertise'), path: '/expertise' },
  { id: 'actualites', label: t('Actualités'), path: '/actualites' },
  { id: 'contact', label: t('Contact'), path: '/contact' }
];

/** Former addresses, kept working after tabs were merged */
export const ALIASES: Record<string, string> = {
  '/chercheurs': '/expertise#docteurs',
  '/opportunites': '/actualites#opportunites'
};

export const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
