import type { CollectionName } from '../types';

export type FieldType = 'text' | 'textarea' | 'date' | 'select' | 'axe' | 'image' | 'url';
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
    name: 'publications', label: 'Publications', singular: 'publication', tab: 'Publications', titleKey: 'title', sortKey: 'date', subtitle: it => `${it.type || ''} · ${it.reference || ''}`,
    fields: [
      { key: 'title', label: 'Titre', type: 'text', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['Article', 'Document de travail', 'Policy brief', 'Rapport', 'Ouvrage', 'Chapitre'] },
      { key: 'authors', label: 'Auteurs', type: 'text' },
      { key: 'date', label: 'Date de publication', type: 'date' },
      { key: 'reference', label: 'Référence (DOI, numéro…)', type: 'text' },
      { key: 'axe', label: 'Axe de recherche', type: 'axe' },
      { key: 'summary', label: 'Résumé', type: 'textarea' },
      { key: 'link', label: 'Lien vers le PDF', type: 'url', help: 'Adresse du fichier en ligne (Google Drive, site, dépôt…).' }
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
    name: 'researchers', label: 'Chercheurs', singular: 'chercheur', tab: 'Chercheurs', titleKey: 'name', subtitle: it => `${it.category || ''} · ${it.title || ''}`,
    fields: [
      { key: 'name', label: 'Nom et prénom', type: 'text', required: true },
      { key: 'title', label: 'Fonction', type: 'text' },
      { key: 'category', label: 'Catégorie', type: 'select', options: ['Équipe de direction', 'Chercheurs permanents', 'Chercheurs associés', 'Doctorants', 'Personnel d\'appui'] },
      { key: 'axe', label: 'Axe de rattachement', type: 'axe' },
      { key: 'bio', label: 'Présentation', type: 'textarea' },
      { key: 'photo', label: 'Photo', type: 'image' }
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
    name: 'opportunities', label: 'Opportunités', singular: 'opportunité', tab: 'Opportunités', titleKey: 'title', sortKey: 'deadline', subtitle: it => `${it.kind || ''} · limite ${it.deadline || '—'}`,
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
export const UNTRANSLATED = new Set(['id', 'date', 'deadline', 'link', 'url', 'image', 'photo', 'logo', 'axe', 'reference', 'email', 'palette', 'period', 'value']);
