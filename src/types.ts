export interface SubDomain {
  title: string;
  description: string;
  imageUrl?: string;
  keyPoints?: string[];
  software?: string[];
  expertiseLevel?: string;
  objectives?: string[]; // Operational objectives
  expectedChanges?: string; // Changes brought by this coaching to the entity
  iconName?: string; // Dynamic icon representing the subdomain
}

export interface DomainIntervention {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  iconName: string; // Dynamic rendering from Lucide
  subDomains: SubDomain[];
  examples: string[];
}

export interface TrainingSession {
  date: string;
  location: string;
  status: 'Disponible' | 'Complet' | 'Bientôt';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Formation {
  id: string;
  slug: string;
  title: string;
  domain: string;
  thematic?: string;
  specialty?: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux';
  modality: 'Présentiel' | 'En ligne' | 'Hybride';
  duration: string;
  price: string;
  isFeatured?: boolean;
  featuredImage: string;
  shortDescription: string;
  context?: string;
  objectives?: string[];
  resultsExpected?: string[];
  targetPublic?: string[];
  prerequisites?: string[];
  program?: { module: string; details: string[] }[];
  sessions?: TrainingSession[];
  faq?: FAQItem[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  client: string;
  location: string;
  year: number;
  stats?: { value: string; label: string }[];
  imageUrl: string;
  description: string;
  challenges: string[];
  solutions: string[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  excerpt: string;
  content: string;
  imageUrl: string;
  isFeatured?: boolean;
  tags: string[];
  guidePdfUrl?: string; // Optional downloadable PDF
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: 'Dirigeant' | 'Conseil' | 'Expert';
  photoUrl: string;
  bio: string;
  linkedinUrl?: string;
  emailUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatarUrl: string;
  text: string;
  rating: number;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  category?: string;
}
