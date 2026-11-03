/**
 * Offer of each training axis: price per participant (90 000 to 150 000 FCFA, set from market
 * demand and technicality) and hours. Every axis is delivered in hybrid mode. Keys: see axisKey in domainContent.ts.
 */

export type FormationModality = 'Hybride';

/** Delivery mode of every axis, on both the Formations and Accompagnement tabs */
export const MODALITY_LABEL = 'Hybride (Présentiel et en ligne)';

export interface FormationOffer {
  title: string;
  domain: string;
  price: number;
  hours: number;
  modality: FormationModality;
}

const FIN = "Ingénierie financière et de l'investissement";
const QHSE = 'Ingénierie QHSE (Qualité, Hygiène, Sécurité, Environnement)';
const FORM = 'Ingénierie de formation et de renforcement de capacités';
const INFO = 'Ingénierie informatique et systèmes de réseaux';
const TERR = 'Ingénierie de développement territorial';
const PROJ = 'Gestion, suivi et évaluation des projets et programmes';
const ETUD = 'Études, enquêtes et recherches socio-économiques';
const CONS = 'Conseil stratégique et organisationnel';

export const FORMATION_OFFERS: Record<string, FormationOffer> = {
  'structuration et financement des projets': { title: 'Structuration et financement des projets', domain: FIN, price: 140000, hours: 24, modality: 'Hybride' },
  'analyse financiere et modelisation': { title: 'Analyse financière et modélisation', domain: FIN, price: 150000, hours: 30, modality: 'Hybride' },
  'gestion comptable fiscale et audit': { title: 'Gestion comptable, fiscale et audit', domain: FIN, price: 130000, hours: 30, modality: 'Hybride' },
  'entrepreneuriat et developpement de pme': { title: 'Entrepreneuriat et développement de PME', domain: FIN, price: 90000, hours: 18, modality: 'Hybride' },

  'systemes de management integre smi': { title: 'Systèmes de management intégré (SMI)', domain: QHSE, price: 150000, hours: 30, modality: 'Hybride' },
  'hygiene et securite au travail sst': { title: 'Hygiène et sécurité au travail (SST)', domain: QHSE, price: 120000, hours: 21, modality: 'Hybride' },
  'environnement et developpement durable': { title: 'Environnement et développement durable', domain: QHSE, price: 110000, hours: 24, modality: 'Hybride' },
  'securite sanitaire et agroalimentaire': { title: 'Sécurité sanitaire et agroalimentaire', domain: QHSE, price: 120000, hours: 21, modality: 'Hybride' },
  'sauvegarde environnementale et sociale ses': { title: 'Sauvegarde environnementale et sociale (SES)', domain: QHSE, price: 120000, hours: 18, modality: 'Hybride' },

  'analyse et planification des dispositifs de formation': { title: 'Analyse et planification des dispositifs de formation', domain: FORM, price: 100000, hours: 18, modality: 'Hybride' },
  'conception pedagogique et innovation educative': { title: 'Conception pédagogique et innovation éducative', domain: FORM, price: 110000, hours: 24, modality: 'Hybride' },
  'mise en oeuvre des formations': { title: 'Mise en œuvre des formations', domain: FORM, price: 100000, hours: 18, modality: 'Hybride' },
  'evaluation et developpement professionnel': { title: 'Évaluation et développement professionnel', domain: FORM, price: 90000, hours: 15, modality: 'Hybride' },

  'infrastructure et reseaux': { title: 'Infrastructure et réseaux', domain: INFO, price: 140000, hours: 36, modality: 'Hybride' },
  'developpement logiciel et solutions applicatives': { title: 'Développement logiciel et solutions applicatives', domain: INFO, price: 150000, hours: 40, modality: 'Hybride' },
  'cybersecurite et gouvernance it': { title: 'Cybersécurité et gouvernance IT', domain: INFO, price: 150000, hours: 30, modality: 'Hybride' },
  'transformation numerique': { title: 'Transformation numérique', domain: INFO, price: 110000, hours: 18, modality: 'Hybride' },

  'amenagement du territoire et urbanisme': { title: 'Aménagement du territoire et urbanisme', domain: TERR, price: 120000, hours: 24, modality: 'Hybride' },
  'decentralisation et gouvernance locale': { title: 'Décentralisation et gouvernance locale', domain: TERR, price: 90000, hours: 18, modality: 'Hybride' },
  'developpement rural et filieres agricoles': { title: 'Développement rural et filières agricoles', domain: TERR, price: 90000, hours: 21, modality: 'Hybride' },
  'sig et observation territoriale': { title: 'SIG, télédétection et observation territoriale', domain: TERR, price: 130000, hours: 30, modality: 'Hybride' },

  'conception et planification de projets': { title: 'Conception et planification de projets', domain: PROJ, price: 110000, hours: 21, modality: 'Hybride' },
  'suivi operationnel et financier': { title: 'Suivi opérationnel et financier', domain: PROJ, price: 120000, hours: 21, modality: 'Hybride' },
  'evaluation d impact': { title: "Évaluation d'impact", domain: PROJ, price: 130000, hours: 24, modality: 'Hybride' },
  'systemes d information pour le suivi evaluation sise': { title: "Systèmes d'information pour le suivi-évaluation (SISE)", domain: PROJ, price: 140000, hours: 24, modality: 'Hybride' },

  'enquetes statistiques et sondages': { title: 'Enquêtes statistiques et sondages', domain: ETUD, price: 110000, hours: 21, modality: 'Hybride' },
  'etudes socio economiques': { title: 'Études socio-économiques', domain: ETUD, price: 100000, hours: 18, modality: 'Hybride' },
  'econometrie et analyse de donnees': { title: 'Économétrie et analyse de données', domain: ETUD, price: 150000, hours: 30, modality: 'Hybride' },
  'etudes sectorielles specialisees': { title: 'Études sectorielles spécialisées', domain: ETUD, price: 100000, hours: 15, modality: 'Hybride' },

  'strategie d entreprise et vision': { title: "Stratégie d'entreprise et vision", domain: CONS, price: 130000, hours: 18, modality: 'Hybride' },
  'organisation et processus': { title: 'Organisation et processus', domain: CONS, price: 100000, hours: 18, modality: 'Hybride' },
  'gestion des ressources humaines et gpec': { title: 'Gestion des ressources humaines et GPEC', domain: CONS, price: 120000, hours: 24, modality: 'Hybride' },
  'conduite du changement et culture': { title: 'Conduite du changement et culture', domain: CONS, price: 110000, hours: 15, modality: 'Hybride' },
  'audit organisationnel': { title: 'Audit organisationnel', domain: CONS, price: 120000, hours: 21, modality: 'Hybride' },
  'gouvernance et ethique': { title: 'Gouvernance et éthique', domain: CONS, price: 130000, hours: 15, modality: 'Hybride' }
};

export const formatOfferPrice = (price: number) => `${price.toLocaleString('fr-FR').replace(/\s/g, ' ')} FCFA`;
