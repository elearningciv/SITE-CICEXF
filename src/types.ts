export interface SoftwareTool {
  name: string;
  iconUrl?: string; // URL personnalisée de l'icône/logo du logiciel
  category?: string;
}

export interface SubDomain {
  title: string;
  description: string;
  presentationService?: string; // 1. Présentation du service
  objectives?: string[]; // 2. Objectifs opérationnels
  demarcheAccompagnement?: string[]; // 3. Démarche d'accompagnement
  resultatsAttendus?: string[]; // 4. Résultats attendus
  impactEntite?: string; // 5. Impact pour l'entité
  methodeEvaluation?: string[]; // 6. Méthode d'évaluation
  softwareTools?: SoftwareTool[]; // 7. Logiciels impliqués avec icônes
  software?: string[];
  imageUrl?: string;
  keyPoints?: string[];
  expertiseLevel?: string;
  expectedChanges?: string;
  iconName?: string;
}

export interface DomainIntervention {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  presentationService?: string; // 1. Présentation du service
  objectives?: string[]; // 2. Objectifs opérationnels
  demarcheAccompagnement?: string[]; // 3. Démarche d'accompagnement
  resultatsAttendus?: string[]; // 4. Résultats attendus
  impactEntite?: string; // 5. Impact pour l'entité
  methodeEvaluation?: string[]; // 6. Méthode d'évaluation
  softwareTools?: SoftwareTool[]; // 7. Logiciels impliqués avec icônes
  software?: string[];
  iconName: string;
  imageUrl?: string;
  subDomains: SubDomain[];
  examples: string[];
  createdAt?: any;
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
  createdAt?: any;
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
