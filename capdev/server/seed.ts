import type { Content } from '../src/types.ts';

// Starting content. Everything here is editable from the Administration tab.
// Figures, references and names are examples to be replaced with CapDev's real data.
export const SEED: Content = {
  settings: {
    siteName: 'CapDev',
    fullName: 'Institution de recherche pour le renforcement des capacités et le développement',
    tagline: 'Recherche · Capacités · Développement',
    heroEyebrow: 'Institution de recherche',
    heroTitle: 'Des données probantes pour',
    heroHighlight: 'renforcer les capacités',
    heroLead: "CapDev conduit des recherches appliquées, forme les chercheurs et les cadres, et met ses résultats à la disposition des décideurs publics, des partenaires et des citoyens.",
    assistantName: 'Docteur',
    assistantGreeting: "Bonjour, je suis Docteur, l'assistant virtuel de CapDev. Posez-moi vos questions sur nos recherches, nos publications, nos formations et nos opportunités.",
    palette: 'lagune',
    languages: ['fr', 'en'],
    address: 'Adresse du siège à renseigner',
    phone: 'Téléphone à renseigner',
    email: 'contact@capdev.org',
    hours: 'Du lundi au vendredi, de 8 h à 17 h',
    stats: [
      { value: '6', label: 'axes de recherche' },
      { value: '48', label: 'chercheurs et associés' },
      { value: '210', label: 'publications en accès libre' },
      { value: '1350', label: 'personnes formées' }
    ],
    mission: "Produire des connaissances rigoureuses et utiles, renforcer les compétences des chercheurs, des cadres et des institutions, et éclairer les décisions publiques par des données probantes.",
    vision: "Devenir une référence en recherche appliquée et en renforcement des capacités au service du développement.",
    directorWord: "Bienvenue sur le site de CapDev. Notre institution réunit des chercheurs engagés autour d'une conviction : la recherche n'a de valeur que si elle renforce la capacité des sociétés à décider et à agir. Vous trouverez ici nos travaux, nos formations et les moyens de collaborer avec nous.",
    directorName: 'Le Directeur général',
    history: "Historique de l'institution à renseigner : date de création, étapes marquantes, reconnaissances obtenues.",
    governance: "CapDev est dirigé par une Direction générale, appuyée par un Conseil scientifique qui valide les orientations de recherche et veille à la qualité des travaux, et par un Conseil d'administration.",
    newsletterText: 'Recevez nos publications et nos appels une fois par mois.'
  },
  axes: [
    { id: 'axe-1', code: 'AXE 1', title: 'Gouvernance et politiques publiques', summary: 'Évaluation des politiques, décentralisation, redevabilité et performance des administrations.', description: "Cet axe analyse la conception, la mise en œuvre et les effets des politiques publiques. Il accompagne les administrations centrales et locales dans le suivi-évaluation et l'usage des données pour décider." },
    { id: 'axe-2', code: 'AXE 2', title: 'Économie, emploi et entrepreneuriat', summary: 'Insertion des jeunes, secteur informel, financement des PME et chaînes de valeur.', description: "Cet axe étudie les marchés du travail, l'entrepreneuriat et le financement des entreprises, avec une attention particulière à l'emploi des jeunes et des femmes." },
    { id: 'axe-3', code: 'AXE 3', title: 'Éducation, compétences et numérique', summary: "Qualité de l'enseignement, formation professionnelle, transformation numérique.", description: "Cet axe porte sur les systèmes éducatifs, l'adéquation formation-emploi et les usages du numérique dans l'apprentissage et l'administration." },
    { id: 'axe-4', code: 'AXE 4', title: 'Santé et protection sociale', summary: 'Couverture maladie, systèmes de santé, vulnérabilité des ménages.', description: "Cet axe évalue l'accès aux soins, le financement de la santé et les dispositifs de protection sociale." },
    { id: 'axe-5', code: 'AXE 5', title: 'Agriculture, environnement et climat', summary: 'Résilience des exploitations, gestion des ressources, adaptation climatique.', description: "Cet axe étudie la productivité agricole, la gestion durable des ressources naturelles et l'adaptation des communautés au changement climatique." },
    { id: 'axe-6', code: 'AXE 6', title: 'Genre, inclusion et cohésion sociale', summary: 'Autonomisation des femmes, inclusion financière, dynamiques communautaires.', description: "Cet axe analyse les inégalités de genre, l'inclusion des groupes vulnérables et les conditions de la cohésion sociale." }
  ],
  projects: [
    { id: 'p-1', title: "Évaluation d'un programme national d'insertion des jeunes", axe: 'axe-2', status: 'En cours', period: '2025 – 2027', summary: "Mesure des effets du programme sur l'emploi et les revenus de 3 000 bénéficiaires.", partners: 'Partenaire institutionnel (à renseigner)' },
    { id: 'p-2', title: 'Capacités statistiques des collectivités territoriales', axe: 'axe-1', status: 'En cours', period: '2026', summary: "Diagnostic des systèmes d'information locaux et plan de renforcement.", partners: 'Collectivités partenaires' },
    { id: 'p-3', title: 'Résilience climatique des exploitations familiales', axe: 'axe-5', status: 'En cours', period: '2024 – 2026', summary: "Enquête de panel sur les stratégies d'adaptation de 1 200 exploitations.", partners: 'Réseau de recherche agricole' },
    { id: 'p-4', title: 'Inclusion financière des femmes rurales', axe: 'axe-6', status: 'Terminé', period: '2023 – 2025', summary: "Analyse de l'accès au crédit et de ses effets sur la résilience des ménages.", partners: 'Institution de microfinance' }
  ],
  publications: [
    { id: 'pub-1', type: 'Policy brief', title: "Rendre les dispositifs d'insertion plus efficaces : cinq recommandations", authors: 'Équipe Axe 2', date: '2026-10-15', reference: 'CapDev-PB-2026-12', summary: "Cinq recommandations tirées de l'évaluation des programmes d'insertion des jeunes.", link: '', axe: 'axe-2' },
    { id: 'pub-2', type: 'Document de travail', title: 'Formation professionnelle et insertion des jeunes diplômés : une analyse par appariement', authors: 'Chercheurs associés', date: '2026-09-02', reference: 'CapDev-WP-2026-07', summary: "Estimation de l'effet de la formation professionnelle sur l'accès à un premier emploi.", link: '', axe: 'axe-2' },
    { id: 'pub-3', type: 'Rapport', title: 'État des capacités statistiques des collectivités territoriales', authors: 'Axe 1', date: '2026-07-20', reference: 'CapDev-RR-2026-03', summary: "Diagnostic détaillé, données jointes et plan d'action.", link: '', axe: 'axe-1' },
    { id: 'pub-4', type: 'Article', title: 'Inclusion financière des femmes rurales et résilience des ménages', authors: 'Axe 6', date: '2026-06-10', reference: 'DOI à renseigner', summary: 'Article publié dans une revue à comité de lecture.', link: '', axe: 'axe-6' },
    { id: 'pub-5', type: 'Policy brief', title: "Adapter le conseil agricole aux chocs climatiques", authors: 'Axe 5', date: '2026-04-28', reference: 'CapDev-PB-2026-08', summary: "Ce que révèle l'enquête de panel sur 1 200 exploitations.", link: '', axe: 'axe-5' }
  ],
  researchers: [
    { id: 'r-1', name: 'Directeur·rice général·e', title: 'Direction générale', category: 'Équipe de direction', axe: '', bio: 'Profil à compléter depuis l\'Administration.' },
    { id: 'r-2', name: 'Directeur·rice scientifique', title: 'Direction scientifique', category: 'Équipe de direction', axe: '', bio: 'Profil à compléter depuis l\'Administration.' },
    { id: 'r-3', name: 'Chercheur·e principal·e', title: 'Responsable de l\'Axe 2', category: 'Chercheurs permanents', axe: 'axe-2', bio: 'Économie du travail, évaluation d\'impact.' },
    { id: 'r-4', name: 'Chercheur·e principal·e', title: 'Responsable de l\'Axe 5', category: 'Chercheurs permanents', axe: 'axe-5', bio: 'Économie agricole, climat.' },
    { id: 'r-5', name: 'Chercheur·e associé·e', title: 'Sociologie', category: 'Chercheurs associés', axe: 'axe-6', bio: 'Méthodes qualitatives, genre.' },
    { id: 'r-6', name: 'Doctorant·e', title: 'Thèse en économie publique', category: 'Doctorants', axe: 'axe-1', bio: 'Décentralisation et finances locales.' }
  ],
  formations: [
    { id: 'f-1', title: 'Analyse de données avec R et Stata', summary: 'Nettoyage, économétrie appliquée, reproductibilité des résultats.', duration: '5 jours', mode: 'Hybride', date: '2026-11-24', price: 'Tarif à renseigner', status: 'Inscriptions ouvertes' },
    { id: 'f-2', title: "Évaluation d'impact des programmes", summary: 'Cadre logique, méthodes expérimentales et quasi expérimentales.', duration: '4 jours', mode: 'Présentiel', date: '2027-01-19', price: 'Tarif à renseigner', status: 'Bientôt' },
    { id: 'f-3', title: 'Recherche qualitative avec NVivo', summary: 'Entretiens, codage, analyse thématique et restitution.', duration: '3 jours', mode: 'En ligne', date: '2027-02-09', price: 'Tarif à renseigner', status: 'Bientôt' },
    { id: 'f-4', title: 'Rédaction scientifique et publication', summary: "De la question de recherche à l'article soumis à une revue.", duration: '3 jours', mode: 'Hybride', date: '', price: 'Sur demande', status: 'Sur demande' }
  ],
  services: [
    { id: 's-1', title: 'Études et enquêtes', summary: 'Conception de questionnaires, collecte sur tablette, apurement et analyse des données.' },
    { id: 's-2', title: 'Évaluation de programmes', summary: "Évaluations à mi-parcours, finales et d'impact, selon des protocoles rigoureux." },
    { id: 's-3', title: 'Appui aux politiques publiques', summary: 'Notes de politique, revues de dépenses, dispositifs de suivi-évaluation.' },
    { id: 's-4', title: 'Renforcement institutionnel', summary: 'Diagnostic organisationnel et plans de formation sur mesure pour les institutions.' }
  ],
  news: [
    { id: 'n-1', date: '2026-10-28', category: 'Vie de l\'institut', title: 'Lancement du nouveau site de CapDev', summary: 'Publications, formations et opportunités sont désormais accessibles en un clic, avec un assistant virtuel.', body: '' },
    { id: 'n-2', date: '2026-10-10', category: 'Recherche', title: "Restitution de l'enquête sur la résilience climatique", summary: 'Les premiers résultats ont été présentés aux partenaires et aux organisations paysannes.', body: '' },
    { id: 'n-3', date: '2026-09-18', category: 'Formation', title: '42 cadres formés à l\'évaluation d\'impact', summary: 'La session de septembre a réuni des cadres de ministères et d\'organisations partenaires.', body: '' }
  ],
  events: [
    { id: 'e-1', date: '2026-11-18', title: "Séminaire mensuel : méthodes d'évaluation d'impact", place: 'Hybride · salle de conférence et en ligne', kind: 'Séminaire' },
    { id: 'e-2', date: '2026-12-05', title: 'Date limite : appel à communications du colloque annuel', place: 'Résumés de 500 mots', kind: 'Appel' },
    { id: 'e-3', date: '2027-01-22', title: 'Atelier de restitution : capacités statistiques locales', place: 'Présentiel · partenaires institutionnels', kind: 'Atelier' },
    { id: 'e-4', date: '2027-02-10', title: 'Ouverture des candidatures : bourses de recherche doctorale', place: 'Dossier en ligne', kind: 'Bourse' }
  ],
  opportunities: [
    { id: 'o-1', kind: 'Appel à communications', title: 'Colloque annuel CapDev 2027', deadline: '2026-12-05', summary: 'Résumés de 500 mots sur les six axes de recherche.' },
    { id: 'o-2', kind: 'Bourse', title: 'Bourses de recherche doctorale', deadline: '2027-03-15', summary: 'Accompagnement et financement de travaux de terrain pour doctorants.' },
    { id: 'o-3', kind: 'Stage', title: 'Stage d\'assistant·e de recherche (6 mois)', deadline: '2026-12-20', summary: 'Appui à la collecte et à l\'analyse de données, Axe 2.' }
  ],
  partners: [
    { id: 'pa-1', name: 'Partenaire universitaire', kind: 'Université', url: '' },
    { id: 'pa-2', name: 'Ministère partenaire', kind: 'Institution publique', url: '' },
    { id: 'pa-3', name: 'Bailleur de fonds', kind: 'Financement', url: '' },
    { id: 'pa-4', name: 'Réseau de recherche', kind: 'Réseau', url: '' },
    { id: 'pa-5', name: 'Organisation de la société civile', kind: 'ONG', url: '' },
    { id: 'pa-6', name: 'Entreprise partenaire', kind: 'Secteur privé', url: '' }
  ],
  translations: {
    en: {}
  },
  updatedAt: new Date(0).toISOString()
};
