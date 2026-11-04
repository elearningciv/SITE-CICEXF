// Shared data model (site + server)

export type PaletteId = 'lagune' | 'foret' | 'nuit' | 'petrole';

export interface Stat { value: string; label: string }

export interface Settings {
  siteName: string;
  fullName: string;
  tagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroLead: string;
  assistantName: string;
  assistantGreeting: string;
  palette: PaletteId;
  /** Languages offered to visitors; French is the source language and is always first */
  languages: string[];
  address: string;
  phone: string;
  email: string;
  hours: string;
  stats: Stat[];
  mission: string;
  vision: string;
  directorWord: string;
  directorName: string;
  history: string;
  governance: string;
  newsletterText: string;
}

export interface Axe { id: string; code: string; title: string; summary: string; description: string; image?: string }
export interface Project { id: string; title: string; axe: string; status: string; period: string; summary: string; partners: string }
export interface Publication { id: string; type: string; title: string; authors: string; description: string; summary: string; image?: string; researchYear: string; publicationYear: string; reference: string; link: string }
/** A doctor of the institution, shown in the Expertise tab */
export interface Researcher { id: string; name: string; grade: string; specialty: string; photo?: string }
export interface Formation { id: string; title: string; summary: string; duration: string; mode: string; date: string; price: string; status: string }
export interface Service { id: string; title: string; summary: string }
export interface NewsItem { id: string; date: string; category: string; title: string; summary: string; body: string; image?: string }
export interface EventItem { id: string; date: string; title: string; place: string; kind: string }
export interface Opportunity { id: string; kind: string; title: string; deadline: string; summary: string }
export interface Partner { id: string; name: string; kind: string; url: string; logo?: string }

export interface Content {
  settings: Settings;
  axes: Axe[];
  projects: Project[];
  publications: Publication[];
  researchers: Researcher[];
  formations: Formation[];
  services: Service[];
  news: NewsItem[];
  events: EventItem[];
  opportunities: Opportunity[];
  partners: Partner[];
  /** translations[lang][french source text] = translated text */
  translations: Record<string, Record<string, string>>;
  updatedAt: string;
}

export type CollectionName =
  'axes' | 'projects' | 'publications' | 'researchers' | 'formations' |
  'services' | 'news' | 'events' | 'opportunities' | 'partners';

export const COLLECTIONS: CollectionName[] = [
  'axes', 'projects', 'publications', 'researchers', 'formations',
  'services', 'news', 'events', 'opportunities', 'partners'
];

export interface InboxMessage {
  id: string;
  at: string;
  kind: 'contact' | 'inscription' | 'etude' | 'partenariat' | 'assistant';
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
}

export interface ChatTurn { role: 'user' | 'assistant'; text: string }

export interface Conversation {
  id: string;
  visitor: string;
  startedAt: string;
  updatedAt: string;
  lang: string;
  turns: ChatTurn[];
}

export interface Session { admin: boolean; email?: string }
