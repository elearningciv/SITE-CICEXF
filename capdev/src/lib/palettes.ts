import type { PaletteId } from '../types';

// Colour structure: every palette defines the same 15 roles, in a light and a dark version.
//   bg / surface / surface2 / line ...... grounds and separators (neutrals tinted toward the palette)
//   text / muted ........................ reading colours
//   primary / primarySoft / onPrimary ... the institution's colour (links, buttons, key figures)
//   accent / accentSoft / onAccent ...... the highlight (calls to action, dates, the assistant)
//   deep / deep2 / onDeep ............... dark bands (top bar, agenda, footer)

export type Tokens = Record<
  'bg' | 'surface' | 'surface2' | 'line' | 'text' | 'muted' | 'primary' | 'primarySoft' | 'onPrimary' |
  'accent' | 'accentSoft' | 'onAccent' | 'deep' | 'deep2' | 'onDeep', string>;

export interface Palette { id: PaletteId; name: string; story: string; light: Tokens; dark: Tokens }

export const PALETTES: Palette[] = [
  {
    id: 'lagune',
    name: 'Lagune et Soleil',
    story: "Bleu nuit de l'encre scientifique, turquoise de la lagune, or du soleil. Sérieux, lumineux, ancré. Palette recommandée.",
    light: { bg: '#F4F7F9', surface: '#FFFFFF', surface2: '#E9F0F3', line: '#D2DFE5', text: '#0B1D2E', muted: '#4C6273', primary: '#0B7A84', primarySoft: '#DDF0F1', onPrimary: '#FFFFFF', accent: '#F0A030', accentSoft: '#FCE9CC', onAccent: '#2A1A02', deep: '#0A2236', deep2: '#0F3350', onDeep: '#EAF3F7' },
    dark: { bg: '#06121C', surface: '#0C1D2B', surface2: '#112738', line: '#1E3A4F', text: '#E5EFF4', muted: '#92AABB', primary: '#35B9C2', primarySoft: '#0F3640', onPrimary: '#04222A', accent: '#F5B04A', accentSoft: '#3B2A10', onAccent: '#2A1A02', deep: '#04101A', deep2: '#0A2134', onDeep: '#E5EFF4' }
  },
  {
    id: 'foret',
    name: 'Forêt et Ambre',
    story: "Vert profond des forêts, vert feuille et ambre. Évoque l'environnement, l'agriculture et la durabilité.",
    light: { bg: '#F4F6F1', surface: '#FFFFFF', surface2: '#E8EEE4', line: '#D3DDCC', text: '#13231A', muted: '#536455', primary: '#1E7A4E', primarySoft: '#DCEFE3', onPrimary: '#FFFFFF', accent: '#D9A030', accentSoft: '#F7EACB', onAccent: '#2A1B00', deep: '#0F2A1E', deep2: '#17402C', onDeep: '#ECF4EE' },
    dark: { bg: '#0A130E', surface: '#111E17', surface2: '#172A1F', line: '#24392C', text: '#E4EEE6', muted: '#97AE9D', primary: '#4CC08A', primarySoft: '#133523', onPrimary: '#062014', accent: '#E8B54C', accentSoft: '#3A2D10', onAccent: '#2A1B00', deep: '#07100B', deep2: '#0F2218', onDeep: '#E4EEE6' }
  },
  {
    id: 'nuit',
    name: 'Nuit et Corail',
    story: 'Indigo profond et corail chaleureux. Plus contemporain, plus énergique, adapté au numérique et à la jeunesse.',
    light: { bg: '#F5F5FA', surface: '#FFFFFF', surface2: '#ECEDF6', line: '#D8DAEA', text: '#141633', muted: '#555A7A', primary: '#3B4CC0', primarySoft: '#E3E6FA', onPrimary: '#FFFFFF', accent: '#E9623F', accentSoft: '#FDE3DB', onAccent: '#FFFFFF', deep: '#151A3F', deep2: '#20285C', onDeep: '#EDEEFA' },
    dark: { bg: '#0B0D1F', surface: '#12152D', surface2: '#191D3B', line: '#2A2F55', text: '#E8E9F6', muted: '#9EA2C4', primary: '#8A97FF', primarySoft: '#232A5C', onPrimary: '#0B0D1F', accent: '#FF8C6B', accentSoft: '#43231B', onAccent: '#2A0E05', deep: '#080A18', deep2: '#12163A', onDeep: '#E8E9F6' }
  },
  {
    id: 'petrole',
    name: 'Pétrole et Safran',
    story: 'La palette de la première maquette : bleu pétrole et safran, sobre et académique.',
    light: { bg: '#EEF3F3', surface: '#FFFFFF', surface2: '#E3ECEC', line: '#C9D7D8', text: '#0F2A30', muted: '#4F6A70', primary: '#12434B', primarySoft: '#DCE9EA', onPrimary: '#FFFFFF', accent: '#D9961A', accentSoft: '#F6E3BD', onAccent: '#1B1404', deep: '#0B2E34', deep2: '#12434B', onDeep: '#EAF4F3' },
    dark: { bg: '#0B1719', surface: '#122326', surface2: '#18302F', line: '#29413F', text: '#E3EEEE', muted: '#93ACAE', primary: '#4FA3AE', primarySoft: '#173A3E', onPrimary: '#08201F', accent: '#F0B440', accentSoft: '#3E3216', onAccent: '#1B1404', deep: '#081416', deep2: '#0E2C31', onDeep: '#E3EEEE' }
  }
];

export const paletteById = (id: string) => PALETTES.find(p => p.id === id) || PALETTES[0];

const kebab = (k: string) => k.replace(/[A-Z]/g, m => '-' + m.toLowerCase());

export function applyPalette(id: string, dark: boolean) {
  const tokens = paletteById(id)[dark ? 'dark' : 'light'];
  const root = document.documentElement;
  for (const [k, v] of Object.entries(tokens)) root.style.setProperty(`--${kebab(k)}`, v);
  root.style.colorScheme = dark ? 'dark' : 'light';
  root.dataset.mode = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tokens.deep);
}
