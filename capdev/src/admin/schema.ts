import type { CollectionName } from '../types';

export type FieldType = 'text' | 'textarea' | 'date' | 'year' | 'select' | 'axe' | 'image' | 'url';
export interface Field { key: string; label: string; type: FieldType; options?: string[]; required?: boolean; help?: string }
export interface CollectionDef { name: CollectionName; label: string; singular: string; tab: string; titleKey: string; subtitle: (it: Record<string, string>) => string; fields: Field[]; sortKey?: string }

export const COLLECTION_DEFS: CollectionDef[] = [
  {
    name: 'news', label: 'Actualités', singular: 'actualité', tab: 'Actualités', titleKey: 'title', sortKey: 'date', subtitle: it => `${it.date || ''} · ${it.category || ''}`,
    fields: [
      { key: 'title', label: 'Titre', type: 'text', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'category', label: 'Catégorie', type: 'select', options: ["Vie de l'institut", 'Recherche', 'Formation', 'Partenariat', 'Presse'] },
      { key: 'summary', label: 'Résumé', type: 'textarea', required: true },
      { key: 'body', label: 'Texte complet', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' }
    ]
  },
  {
    name: 'events', label: 'Agenda', singular: 'événement', tab: 'Actualités', titleKey: 'title', sortKey: 'date', subtitle: it => `${it.date || ''} · ${it.kind || ''}`,
    fields: [
      { key: 'title', label: 'Intitulé', type: 'text', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'kind', label: 'Type', type: 'select', options: ['Séminaire', 'Colloque', 'Atelier', 'Conférence', 'Appel', 'Bourse', 'Soutenance'] },
      { key: 'place', label: 'Lieu ou modalité', type: 'text' }
    ]
  },
  {
    name: 'publications', label: 'Publications', singular: 'publication', tab: 'Publications', titleKey: 'title', sortKey: 'publicationYear', subtitle: it => `${it.type || ''} · publiée en ${it.publicationYear || '—'}`,
    fields: [
      { key: 'title', label: 'Titre', type: 'text', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['Article', 'Document de travail', 'Policy brief', 'Rapport', 'Ouvrage', 'Chapitre'] },
      { key: 'image', label: 'Image', type: 'image', help: 'Sans image, une couverture aux couleurs du site est créée automatiquement.' },
      { key: 'description', label: 'Description (texte court affiché sur la carte)', type: 'textarea', required: true },
      { key: 'summary', label: 'Résumé', type: 'textarea', required: true },
      { key: 'researchYear', label: 'Année de recherche', type: 'year', required: true },
      { key: 'publicationYear', label: 'Année de publication', type: 'year', required: true },
      { key: 'authors', label: 'Auteurs', type: 'text' },
      { key: 'reference', label: 'Référence (DOI, numéro…)', type: 'text' },
      { key: 'link', label: 'Lien vers le document (PDF)', type: 'url', help: 'Adresse du fichier en ligne (Google Drive, site, dépôt…).' }
    ]
  },
  {
    name: 'axes', label: 'Axes de recherche', singular: 'axe', tab: 'Recherche', titleKey: 'title', subtitle: it => it.code || '',
    fields: [
      { key: 'code', label: 'Code', type: 'text', help: 'Par exemple : AXE 7' },
      { key: 'title', label: 'Intitulé', type: 'text', required: true },
      { key: 'summary', label: 'Résumé (cartes)', type: 'textarea' },
      { key: 'description', label: 'Description complète', type: 'textarea' }
    ]
  },
  {
    name: 'projects', label: 'Projets', singular: 'projet', tab: 'Recherche', titleKey: 'title', subtitle: it => `${it.status || ''} · ${it.period || ''}`,
    fields: [
      { key: 'title', label: 'Titre', type: 'text', required: true },
      { key: 'axe', label: 'Axe de recherche', type: 'axe' },
      { key: 'status', label: 'Statut', type: 'select', options: ['En cours', 'Terminé'] },
      { key: 'period', label: 'Période', type: 'text', help: 'Par exemple : 2025 – 2027' },
      { key: 'summary', label: 'Résumé', type: 'textarea' },
      { key: 'partners', label: 'Partenaires', type: 'text' }
    ]
  },
  {
    name: 'researchers', label: 'Docteurs', singular: 'docteur', tab: 'Expertise', titleKey: 'name', subtitle: it => `${it.grade || ''} · ${it.specialty || ''}`,
    fields: [
      { key: 'name', label: 'Nom et prénoms', type: 'text', required: true },
      { key: 'grade', label: 'Grade', type: 'select', options: ['Professeur titulaire', 'Maître de conférences', 'Maître-assistant', 'Directeur de recherche', 'Maître de recherche', 'Chargé de recherche', 'Docteur'] },
      { key: 'specialty', label: 'Spécialité', type: 'text', required: true },
      { key: 'photo', label: 'Photo', type: 'image', help: 'Affichée sur le site sans possibilité de téléchargement par clic droit ou glisser-déposer.' }
    ]
  },
  {
    name: 'formations', label: 'Formations', singular: 'formation', tab: 'Formations', titleKey: 'title', sortKey: 'date', subtitle: it => `${it.status || ''} · ${it.date || 'sur demande'}`,
    fields: [
      { key: 'title', label: 'Intitulé', type: 'text', required: true },
      { key: 'summary', label: 'Résumé', type: 'textarea' },
      { key: 'duration', label: 'Durée', type: 'text' },
      { key: 'mode', label: 'Modalité', type: 'select', options: ['Présentiel', 'En ligne', 'Hybride'] },
      { key: 'date', label: 'Date de la prochaine session', type: 'date' },
      { key: 'price', label: 'Tarif', type: 'text' },
      { key: 'status', label: 'Statut', type: 'select', options: ['Inscriptions ouvertes', 'Bientôt', 'Complet', 'Sur demande'] }
    ]
  },
  {
    name: 'services', label: 'Services d\'expertise', singular: 'service', tab: 'Expertise', titleKey: 'title', subtitle: () => '',
    fields: [
      { key: 'title', label: 'Intitulé', type: 'text', required: true },
      { key: 'summary', label: 'Description', type: 'textarea' }
    ]
  },
  {
    name: 'opportunities', label: 'Opportunités', singular: 'opportunité', tab: 'Actualités', titleKey: 'title', sortKey: 'deadline', subtitle: it => `${it.kind || ''} · limite ${it.deadline || '—'}`,
    fields: [
      { key: 'title', label: 'Intitulé', type: 'text', required: true },
      { key: 'kind', label: 'Type', type: 'select', options: ['Appel à projets', 'Appel à communications', 'Bourse', 'Stage', 'Recrutement'] },
      { key: 'deadline', label: 'Date limite', type: 'date' },
      { key: 'summary', label: 'Description', type: 'textarea' }
    ]
  },
  {
    name: 'partners', label: 'Partenaires', singular: 'partenaire', tab: 'Contact', titleKey: 'name', subtitle: it => it.kind || '',
    fields: [
      { key: 'name', label: 'Nom', type: 'text', required: true },
      { key: 'kind', label: 'Type', type: 'text' },
      { key: 'url', label: 'Site web', type: 'url' },
      { key: 'logo', label: 'Logo', type: 'image' }
    ]
  }
];

/** Keys whose values are never translated (identifiers, dates, links, images) */
export const UNTRANSLATED = new Set(['id', 'date', 'deadline', 'link', 'url', 'image', 'photo', 'logo', 'axe', 'reference', 'email', 'palette', 'period', 'value', 'researchYear', 'publicationYear']);
