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
    assistantGreeting: "Bonjour, je suis Docteur, l'assistant virtuel de CapDev. CapDev est une institution de recherche qui conduit des études appliquées, accompagne les institutions dans le renforcement de leurs capacités et publie ses travaux en accès libre. Comment puis-je vous aider ?",
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
    directorName: 'Le Responsable de CapDev',
    directorPhoto: '',
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
    { id: 'pub-1', zone: "Côte d'Ivoire, district d'Abidjan", type: 'Policy brief', title: "Rendre les dispositifs d'insertion plus efficaces : cinq recommandations", authors: 'Équipe Économie et emploi', description: "Un guide court destiné aux décideurs pour améliorer les programmes d'insertion professionnelle des jeunes, à partir des résultats d'une évaluation menée auprès de 3 000 bénéficiaires.", summary: "Les programmes d'insertion améliorent l'accès au premier emploi lorsqu'ils associent formation pratique, stage en entreprise et accompagnement personnalisé. Ce policy brief présente cinq recommandations opérationnelles : cibler les jeunes les plus éloignés de l'emploi, allonger la durée des stages, impliquer les employeurs dès la conception, suivre les bénéficiaires douze mois après la sortie et publier les résultats.", researchYear: '2025', publicationYear: '2026', reference: 'CapDev-PB-2026-12', link: '' },
    { id: 'pub-2', zone: "Côte d'Ivoire, échelle nationale", type: 'Document de travail', title: 'Formation professionnelle et insertion des jeunes diplômés : une analyse par appariement', authors: 'Chercheurs associés', description: "Estimation rigoureuse de l'effet de la formation professionnelle sur l'accès des jeunes diplômés à un premier emploi stable.", summary: "À partir d'une enquête auprès de jeunes diplômés, nous comparons, par appariement sur score de propension, ceux qui ont suivi une formation professionnelle complémentaire à des jeunes aux profils similaires. La formation augmente la probabilité d'occuper un emploi stable dix-huit mois après le diplôme, avec des effets plus marqués pour les jeunes femmes.", researchYear: '2025', publicationYear: '2026', reference: 'CapDev-WP-2026-07', link: '' },
    { id: 'pub-3', zone: "Collectivités territoriales, 12 communes", type: 'Rapport', title: 'État des capacités statistiques des collectivités territoriales', authors: 'Équipe Gouvernance', description: "Diagnostic des systèmes d'information des collectivités locales et plan de renforcement des capacités statistiques.", summary: "Ce rapport évalue la production, la qualité et l'usage des données dans les collectivités territoriales. Il identifie les principaux freins (personnel, outils, financement) et propose un plan de renforcement en trois ans, accompagné d'un tableau de bord de suivi.", researchYear: '2026', publicationYear: '2026', reference: 'CapDev-RR-2026-03', link: '' },
    { id: 'pub-4', zone: "Zones rurales du Centre et du Nord", type: 'Article', title: 'Inclusion financière des femmes rurales et résilience des ménages', authors: 'Équipe Genre et inclusion', description: "Article publié dans une revue à comité de lecture sur les effets de l'accès au crédit pour les femmes en milieu rural.", summary: "L'accès au microcrédit des femmes rurales réduit la vulnérabilité des ménages face aux chocs de revenus, notamment lors des mauvaises récoltes. L'effet passe par la diversification des activités et l'épargne de précaution.", researchYear: '2024', publicationYear: '2026', reference: 'DOI à renseigner', link: '' },
    { id: 'pub-5', zone: "Bassin cotonnier et zone de savane", type: 'Policy brief', title: 'Adapter le conseil agricole aux chocs climatiques', authors: 'Équipe Agriculture et climat', description: "Ce que révèle une enquête de panel sur 1 200 exploitations familiales face aux sécheresses et aux inondations.", summary: "Les exploitations qui ont reçu un conseil agricole adapté au climat ont mieux maintenu leurs rendements lors des chocs. Le brief recommande d'intégrer l'information météorologique au conseil et de former les conseillers aux pratiques d'adaptation.", researchYear: '2024', publicationYear: '2026', reference: 'CapDev-PB-2026-08', link: '' }
  ],
  researchers: [
    { id: 'r-1', name: 'Nom et prénoms à renseigner', grade: 'Professeur titulaire', specialty: 'Économie du développement' },
    { id: 'r-2', name: 'Nom et prénoms à renseigner', grade: 'Maître de conférences', specialty: 'Évaluation des politiques publiques' },
    { id: 'r-3', name: 'Nom et prénoms à renseigner', grade: 'Maître de conférences', specialty: 'Économie du travail' },
    { id: 'r-4', name: 'Nom et prénoms à renseigner', grade: 'Maître-assistant', specialty: 'Économie agricole et climat' },
    { id: 'r-5', name: 'Nom et prénoms à renseigner', grade: 'Docteur', specialty: 'Sociologie, méthodes qualitatives' },
    { id: 'r-6', name: 'Nom et prénoms à renseigner', grade: 'Docteur', specialty: 'Statistique et science des données' }
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
