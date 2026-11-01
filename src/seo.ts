// Search engine information for each page: used by the app (title, description, canonical
// while browsing) and at build time (one static HTML per page, sitemap.xml, robots.txt).
// Keep titles under ~60 characters and descriptions under ~160.

export const SITE_URL = 'https://cicexf.com';

export interface SeoPage {
  path: string;
  title: string;
  description: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

export const SEO_PAGES: Record<string, SeoPage> = {
  home: {
    path: '/',
    title: 'CICEXF | Formation, conseil et expertise à Abidjan',
    description: "Cabinet international de consultance, d'expertise et de formation à Abidjan : formations certifiantes, accompagnement des organisations et expertise technique en Afrique de l'Ouest.",
    priority: 1.0,
    changefreq: 'weekly'
  },
  formations: {
    path: '/formations',
    title: 'Formations certifiantes à Abidjan | CICEXF',
    description: 'Formations certifiantes en présentiel, hybride et en ligne : gestion de projet, data, QHSE, finance, SIG, management. Inscriptions ouvertes, paiement en 2 ou 3 tranches.',
    priority: 0.9,
    changefreq: 'weekly'
  },
  accompagnements: {
    path: '/accompagnement',
    title: 'Accompagnement et conseil aux organisations | CICEXF',
    description: "Conseil stratégique, ingénierie financière, QHSE, informatique, développement territorial, suivi-évaluation : le CICEXF accompagne entreprises, administrations et ONG.",
    priority: 0.9,
    changefreq: 'monthly'
  },
  catalogue: {
    path: '/catalogue',
    title: 'Catalogue des formations (PDF) | CICEXF',
    description: 'Consultez ou téléchargez le catalogue des formations du CICEXF : programmes, durées et tarifs des formations certifiantes à Abidjan et en ligne.',
    priority: 0.8,
    changefreq: 'monthly'
  },
  news: {
    path: '/actualites',
    title: 'Actualités et nouvelles formations | CICEXF',
    description: 'Lancements de formations, sessions ouvertes, annonces et publications du cabinet CICEXF à Abidjan.',
    priority: 0.7,
    changefreq: 'weekly'
  },
  realisations: {
    path: '/realisations',
    title: 'Nos réalisations et références | CICEXF',
    description: "Missions de conseil, d'expertise et de formation menées par le CICEXF pour des administrations, des entreprises et des projets de développement.",
    priority: 0.7,
    changefreq: 'monthly'
  },
  about: {
    path: '/qui-sommes-nous',
    title: 'Qui sommes-nous | CICEXF Abidjan',
    description: "Le CICEXF, cabinet d'experts, d'universitaires et de praticiens basé à Abidjan : mission, vision, valeurs et équipe de direction.",
    priority: 0.6,
    changefreq: 'monthly'
  },
  contact: {
    path: '/contact',
    title: 'Contact et demande de devis | CICEXF Abidjan',
    description: "Contactez le CICEXF à Abidjan (Cocody Palmeraie) pour une inscription, une demande d'accompagnement ou un devis. Téléphone et WhatsApp : +225 07 01 97 00 65.",
    priority: 0.8,
    changefreq: 'monthly'
  },
  confidentialite: {
    path: '/confidentialite',
    title: 'Politique de confidentialité | CICEXF',
    description: "Les informations collectées par le CICEXF, leur utilisation pour vos candidatures et demandes, et la sécurité de vos données.",
    priority: 0.3,
    changefreq: 'monthly'
  },
  partners: {
    path: '/partenaires',
    title: 'Partenaires | CICEXF',
    description: 'Partenaires institutionnels et techniques du CICEXF, et espace pour devenir formateur ou expert associé.',
    priority: 0.4,
    changefreq: 'monthly'
  }
};
