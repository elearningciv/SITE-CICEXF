import { DomainIntervention, Formation, Project, BlogPost, TeamMember, Testimonial, Partner } from './types';

// ============================================================================
// INFORMATIONS INSTITUTIONNELLES OFFICIELLES DU CABINET (SOURCE UNIQUE)
// ============================================================================
export const CABINET_INFO = {
  nom: "Cabinet International de Consultance, d'Expertise et de Formation",
  sigle: "CICEXF",
  statutLegal: "Société de droit ivoirien agréée pour la formation professionnelle continue et l'ingénierie de conseil",
  agrementOfficiel: "Récépissé N°25343/GTCA/RC/2025",
  numeroIDU: "CI-2025-0058238 N",
  directeurGeneral: {
    nom: "Dr. Kouassi Marc-Aurèle",
    titre: "Directeur Général & Associé Gérant",
    contactMail: "cabinetcicexf@gmail.com"
  },
  directionAssociee: {
    nom: "M. Amadou Diallo",
    titre: "Directeur Général & Co-fondateur",
    specialite: "Conseil stratégique, PPP et réformes institutionnelles",
    contactMail: "a.diallo@cicexf.org"
  },
  directionAcademique: {
    nom: "Dr. Marc Koffi",
    titre: "Directeur Général Adjoint & Chef du Pôle Formation",
    specialite: "Sciences de l'Éducation & Ingénierie Pédagogique",
    contactMail: "m.koffi@cicexf.org"
  },
  siegePrincipal: {
    pays: "Côte d'Ivoire",
    ville: "Abidjan",
    commune: "Cocody",
    quartier: "Angré 8ème Tranche / Cocody Palmeraie",
    adresseComplete: "Cocody Angré 8ème Tranche, Carrefour Duncan / Rue de la Clinique, Immeuble Prestige, 3ème étage, Abidjan, Côte d'Ivoire",
    repere: "À proximité du Carrefour Duncan et de la Clinique de la Palmeraie"
  },
  antennesRegionales: [
    { pays: "Bénin", ville: "Cotonou", statut: "Antenne opérationnelle" },
    { pays: "Togo", ville: "Lomé", statut: "Antenne opérationnelle" },
    { pays: "Mali", ville: "Bamako", statut: "Antenne opérationnelle" },
    { pays: "Burkina Faso", ville: "Ouagadougou", statut: "Antenne opérationnelle" }
  ],
  telephones: {
    whatsappAdmissions: "+225 07 01 97 00 65",
    whatsappClean: "2250701970065",
    secretariatTechnique: "+225 05 74 22 22 46"
  },
  emails: {
    admissions: "elearningciv@gmail.com",
    direction: "cabinetcicexf@gmail.com"
  },
  horairesOuverture: {
    semaine: "Lundi au Vendredi : 08h00 à 18h00 en continu",
    samedi: "Samedi : 09h00 à 13h00",
    dimanche: "Dimanche : Fermé (Permanence WhatsApp active pour urgences admissions)"
  },
  financementEtModalites: {
    particuliers: "Possibilité d'échelonnement en 2 ou 3 versements sans frais additionnels.",
    entreprises: "Délivrance de convention officielle de formation et facture proforma sous 24 heures.",
    moyensPaiement: ["Virement bancaire", "Chèque certifié d'entreprise", "Mobile Money (Orange Money, Wave, MTN MoMo)", "Paiement au secrétariat du siège"],
    remisesGroupe: [
      { seuil: "À partir de 3 participants d'une même structure", remise: "10% de réduction sur le total" },
      { seuil: "À partir de 5 participants d'une même structure", remise: "15% de réduction sur le total" },
      { seuil: "Formation intra-entreprise sur site ou dédiée", remise: "Tarif dégressif sur devis personnalisé" }
    ]
  },
  chiffresCles: {
    professionnelsFormes: "+2 000 cadres et professionnels certifiés",
    missionsRealisees: "+150 missions d'envergure internationale menées avec succès",
    partenairesInstitutionnels: "+50 partenaires (Banque Mondiale, AFD, ministères, institutions)",
    tauxSatisfaction: "95% de satisfaction globale audité"
  },
  valeurs: [
    { nom: "Excellence", description: "Refus systématique de l'approximation, double revue par des pairs experts." },
    { nom: "Rigueur", description: "Armature méthodologique scientifique et respect scrupuleux des délais." },
    { nom: "Transparence", description: "Clarté contractuelle et financière totale, sans coûts dissimulés." },
    { nom: "Redevabilité", description: "Mesure de l'impact réel et pérennité opérationnelle sur le terrain." },
    { nom: "Innovation", description: "Intégration continue de l'IA, des SIG, du Big Data et des outils modernes." }
  ]
};

// ============================================================================
// CATALOGUE COMPLET DES FORMATIONS CERTIFIANTES DU CABINET
// ============================================================================
export const FORMATIONS: Formation[] = [
  {
    id: 'f-data-analyst',
    slug: 'data-analyst-collecte-visualisation',
    title: "Data Analyst : Maîtrise complète de la collecte, de la préparation et de la visualisation des données",
    domain: "Ingénierie Informatique & Data",
    level: "Tous niveaux",
    modality: "Hybride",
    duration: "6 semaines (120 heures intensives)",
    price: "450 000 FCFA",
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Un parcours d'excellence opérationnelle pour transformer la donnée brute en indicateurs décisionnels avec Excel Avancé, SQL, Power BI, Python et KoboCollect.",
    context: "À l'ère de la transformation numérique, la capacité à collecter, nettoyer et interpréter la donnée constitue une compétence stratégique. Le CICEXF propose une formation immersive alliant rigueur méthodologique et projets réels d'entreprises pour doter les cadres des compétences les plus recherchées du marché.",
    objectives: [
      "Concevoir des formulaires de collecte mobiles avec KoboCollect / ODK",
      "Nettoyer et automatiser le traitement des données avec Excel et Power Query",
      "Interroger et manipuler des bases de données relationnelles avec SQL (PostgreSQL)",
      "Modéliser et concevoir des tableaux de bord interactifs percutants avec Microsoft Power BI et DAX",
      "S'initier à l'analyse exploratoire et l'automatisation avec Python (Pandas, Matplotlib)"
    ],
    resultsExpected: [
      "Autonomie complète sur la chaîne ETL (Extract, Transform, Load)",
      "Capacité à livrer des dashboards exécutifs professionnels",
      "Obtention du Certificat professionnel d'Expert Data Analyst délivré par le CICEXF"
    ],
    targetPublic: [
      "Contrôleurs de gestion, directeurs financiers, analystes d'affaires",
      "Responsables de suivi-évaluation de projets et programmes de développement",
      "Statisticiens, sociologues, chargés d'études marketing",
      "Ingénieurs, informaticiens et professionnels en reconversion"
    ],
    prerequisites: [
      "Connaissance basique de l'outil informatique et navigation web",
      "Pratique de base du tableur Microsoft Excel"
    ],
    program: [
      { module: "Module 1 : Culture data & cycle de vie de la donnée", details: ["Comprendre l'écosystème data", "Les phases ETL", "Bonnes pratiques de gouvernance"] },
      { module: "Module 2 : Collecte mobile avec XLSForm & KoboCollect", details: ["Syntaxe XLSForm", "Déploiement sur serveur", "Synchronisation hors-ligne"] },
      { module: "Module 3 : Nettoyage avancé sous Excel & requêtes SQL", details: ["Power Query", "Jointures", "Requêtes SELECT, GROUP BY, HAVING, subqueries"] },
      { module: "Module 4 : Modélisation décisionnelle & DAX sous Power BI", details: ["Schéma en étoile", "Relations", "Calculs temporels DAX avancés"] },
      { module: "Module 5 : Conception de dashboards décisionnels interactifs", details: ["Storytelling avec la donnée", "Ergonomie UX/UI", "Indicateurs KPI"] },
      { module: "Module 6 : Projet pratique réel de soutenance d'entreprise", details: ["Étude de cas complète", "Présentation devant jury d'experts"] }
    ],
    sessions: [
      { date: "04 Juillet 2026", location: "Siège CICEXF Abidjan Angré 8e & En ligne", status: "Disponible" },
      { date: "05 Septembre 2026", location: "Siège CICEXF Abidjan Angré 8e & En ligne", status: "Disponible" },
      { date: "07 Novembre 2026", location: "Siège CICEXF Abidjan Angré 8e & En ligne", status: "Disponible" }
    ],
    faq: [
      { question: "La formation est-elle accessible aux débutants en informatique ?", answer: "Absolument. Le premier module reprend les bases méthodologiques et le tableur avant d'aborder progressivement SQL et Power BI." },
      { question: "Le certificat est-il reconnu à l'international ?", answer: "Oui, le CICEXF est agréé sous le N°25343/GTCA/RC/2025 et le certificat valorise un portfolio concret de projets réels validés par des consultants seniors." }
    ]
  },
  {
    id: 'f-management-equipe',
    slug: 'formation-gestion-des-equipes-leadership',
    title: "GESTION DES EQUIPES (Leadership, Cohésion & Performance collective)",
    domain: "Management & Ressources Humaines",
    level: "Tous niveaux",
    modality: "Présentiel",
    duration: "Sessions modulaires intensives (24h à 40h)",
    price: "Sur devis / 350 000 FCFA par participant (Dégressif en groupe)",
    featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Développez un leadership mobilisateur, renforcez la cohésion de vos collaborateurs et maîtrisez les techniques de résolution constructive des conflits.",
    context: "Face aux réorganisations permanentes et aux objectifs exigeants, la capacité d'un encadrant à fédérer, motiver et déléguer conditionne directement la réussite de l'organisation. Cette formation d'excellence CICEXF allie psychologie managériale, mises en situation concrètes et outils pratiques de gouvernance collective.",
    objectives: [
      "Identifier son style de leadership dominant et développer sa flexibilité managériale",
      "Instaurer une communication claire, bienveillante et orientée résultats",
      "Déléguer de façon sécurisée et responsabiliser ses collaborateurs",
      "Gérer les tensions, désamorcer les conflits et recréer la cohésion",
      "Piloter la performance collective par des objectifs SMART partagés"
    ],
    resultsExpected: [
      "Amélioration mesurable du climat social et de l'engagement des équipes",
      "Maîtrise des entretiens de cadrage et de feedback constructif",
      "Certificat d'Excellence en Management d'Équipe CICEXF"
    ],
    targetPublic: [
      "Directeurs de départements, directeurs des ressources humaines (DRH)",
      "Chefs d'équipe, superviseurs opérationnels, chefs de projet",
      "Cadres nouvellement promus à des fonctions d'encadrement"
    ],
    prerequisites: ["Avoir une expérience d'encadrement ou être appelé à animer une équipe."],
    program: [
      { module: "Module 1 : Posture et styles de leadership situationnel", details: ["Auto-diagnostic", "Les 4 styles de Hersey et Blanchard", "Adapter son management à la maturité des collaborateurs"] },
      { module: "Module 2 : Communication managériale & écoute active", details: ["Les principes de l'assertivité", "Donner un feedback constructif selon la méthode DESC", "Mener des réunions courtes et productives"] },
      { module: "Module 3 : Délégation efficace et responsabilisation", details: ["Les 5 niveaux de délégation", "Fixer des indicateurs de progrès", "Accompagner sans micro-manager"] },
      { module: "Module 4 : Prévention et résolution des conflits", details: ["Détecter les signaux faibles de tension", "Techniques de médiation interne", "Transformer les désaccords en opportunités d'amélioration"] },
      { module: "Module 5 : Motivation et cohésion d'équipe", details: ["Leviers de motivation intrinsèque", "Rituels d'équipe et célébration des victoires", "Plan d'action managérial personnel"] }
    ],
    sessions: [
      { date: "15 Juillet 2026", location: "Siège CICEXF Abidjan & Intra-entreprise", status: "Disponible" },
      { date: "19 Août 2026", location: "Siège CICEXF Abidjan & En ligne", status: "Disponible" },
      { date: "23 Septembre 2026", location: "Siège CICEXF Abidjan & Intra-entreprise", status: "Disponible" }
    ],
    faq: [
      { question: "La formation peut-elle être organisée directement au sein de notre entreprise ?", answer: "Oui, nous concevons des sessions intra-entreprises adaptées sur-mesure aux défis de vos équipes avec déplacement de nos consultants formateurs sur site." }
    ]
  },
  {
    id: 'f-qhse-audit',
    slug: 'auditeur-interne-qhse-iso-9001-14001-45001',
    title: "Auditeur Interne QHSE et Management de la Qualité ISO 9001, 14001, 45001",
    domain: "Ingénierie QHSE",
    level: "Intermédiaire",
    modality: "Présentiel",
    duration: "40 heures (5 jours intensifs)",
    price: "350 000 FCFA",
    featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Acquérez la méthodologie complète pour planifier, réaliser et rapporter des audits internes selon la norme ISO 19011 sur les référentiels Qualité, Sécurité et Environnement.",
    context: "La conformité aux normes internationales est devenue une exigence d'accès aux marchés pour les entreprises compétitives. Ce programme forme des auditeurs internes rigoureux capables de piloter l'amélioration continue.",
    objectives: [
      "Comprendre la structure universelle de haut niveau (HLS) des normes ISO",
      "Maîtriser les exigences clés des normes ISO 9001:2015, ISO 14001:2015 et ISO 45001:2018",
      "Planifier un programme d'audit interne selon l'ISO 19011:2018",
      "Rédiger des constats d'audit sans ambiguïté et suivre les plans d'actions correctives"
    ],
    resultsExpected: [
      "Capacité à mener des audits internes de première et deuxième partie",
      "Délivrance du Certificat d'Auditeur Interne QHSE CICEXF"
    ],
    targetPublic: [
      "Responsables Qualité, Sécurité et Environnement (QHSE)",
      "Directeurs techniques, auditeurs internes, ingénieurs de production"
    ],
    prerequisites: ["Connaissance basique du fonctionnement des organisations."],
    program: [
      { module: "Module 1 : Structure HLS et panorama des normes ISO 9001, 14001, 45001", details: ["Contexte de l'organisme", "Leadership", "Approche par les risques"] },
      { module: "Module 2 : Méthodologie d'audit interne selon ISO 19011", details: ["Définition et principes", "Gestion d'un programme d'audit"] },
      { module: "Module 3 : Préparation de l'audit et élaboration du guide d'entretien", details: ["Revue documentaire", "Plan d'audit", "Check-lists d'audit"] },
      { module: "Module 4 : Conduite de l'audit sur site et techniques d'investigation", details: ["Réunion d'ouverture", "Questionnement", "Recueil des preuves d'audit"] },
      { module: "Module 5 : Formulation des écarts, rapport d'audit et clôture", details: ["Fiches de non-conformité", "Réunion de clôture", "Suivi des actions correctives"] }
    ],
    sessions: [
      { date: "10 Août 2026", location: "Siège CICEXF Abidjan Angré 8e", status: "Disponible" },
      { date: "12 Octobre 2026", location: "Siège CICEXF Abidjan Angré 8e", status: "Disponible" }
    ],
    faq: [
      { question: "Cette formation permet-elle d'auditer des sous-traitants ?", answer: "Oui, la méthodologie ISO 19011 transmise s'applique aux audits internes (1ère partie) et aux audits de fournisseurs/prestataires (2nde partie)." }
    ]
  },
  {
    id: 'f-finance-modeling',
    slug: 'analyse-financiere-evaluation-modelisation-excel',
    title: "Analyse Financière, Évaluation d'Entreprise et Modélisation sur Excel",
    domain: "Ingénierie Financière & Investissement",
    level: "Avancé",
    modality: "Hybride",
    duration: "48 heures (6 samedis)",
    price: "400 000 FCFA",
    featuredImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Construisez des modèles financiers dynamiques à 3 états, maîtrisez la valorisation par les flux DCF et préparez vos dossiers de financement bancaire.",
    context: "Pour lever des fonds ou piloter des investissements stratégiques, la maîtrise des modèles prévisionnels est indispensable. Ce cours allie théorie financière avancée et pratique intensive sur tableur.",
    objectives: [
      "Réaliser un diagnostic financier rétrospectif approfondi (SIG, BFR, CAF)",
      "Bâtir un modèle prévisionnel dynamique à 3 états (Compte de résultat, Bilan, Tableau de flux)",
      "Calculer le coût moyen pondéré du capital (CMPC / WACC)",
      "Valoriser une entreprise par la méthode DCF (Discounted Cash Flows) et les multiples boursiers"
    ],
    resultsExpected: [
      "Autonomie pour modéliser des business plans bancables",
      "Attestation d'Expert en Modélisation Financière CICEXF"
    ],
    targetPublic: [
      "Directeurs Administratifs et Financiers (DAF), contrôleurs de gestion",
      "Analystes financiers, chargés d'affaires bancaires, experts-comptables mémorialistes"
    ],
    prerequisites: ["Bonne maîtrise des principes comptables généraux et d'Excel."],
    program: [
      { module: "Module 1 : Diagnostic financier et analyse de performance", details: ["Retraitements des états financiers", "Ratios de rentabilité et solvabilité"] },
      { module: "Module 2 : Mécanique de modélisation prévisionnelle sur Excel", details: ["Hypothèses opérationnelles", "Structure d'un modèle 3-Statement sans références circulaires"] },
      { module: "Module 3 : Modélisation du BFR et du calendrier de dette", details: ["Tableaux d'amortissement d'emprunts", "Optimisation de la trésorerie"] },
      { module: "Module 4 : Coût du capital et valorisation DCF", details: ["Modèle MEDAF/CAPM", "Flux de trésorerie disponibles (FCFF)", "Valeur terminale"] },
      { module: "Module 5 : Analyse de sensibilité et stress-tests", details: ["Tables de données à double entrée", "Gestionnaire de scénarios", "Recommandation d'investissement"] }
    ],
    sessions: [
      { date: "18 Juillet 2026", location: "Siège CICEXF Abidjan & Zoom", status: "Disponible" },
      { date: "12 Septembre 2026", location: "Siège CICEXF Abidjan & Zoom", status: "Disponible" }
    ],
    faq: [
      { question: "Reçoit-on les matrices Excel après la formation ?", answer: "Oui, vous recevez une bibliothèque complète de templates de modélisation entièrement déverrouillés et réutilisables." }
    ]
  },
  {
    id: 'f-sig-qgis',
    slug: 'sig-qgis-gestion-commune',
    title: "Systèmes d'Information Géographique (SIG) appliqués au Développement Local avec QGIS",
    domain: "Ingénierie de Développement Territorial",
    level: "Débutant",
    modality: "Présentiel",
    duration: "36 heures (4 samedis)",
    price: "300 000 FCFA",
    featuredImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Maîtrisez la cartographie numérique pour optimiser la prise de décision spatiale et la gestion cadastrale des communes.",
    context: "La gestion moderne des territoires exige une maîtrise parfaite des dimensions géospatiales. Ce programme forme à l'utilisation professionnelle du logiciel libre de référence QGIS.",
    objectives: [
      "Comprendre les bases des systèmes de coordonnées de référence (SCR) et des projections",
      "Importer, créer et géoréférencer des données vectorielles et rasters",
      "Effectuer des requêtes spatiales et attributaires avancées",
      "Composer des cartes thématiques prêtes à être publiées"
    ],
    resultsExpected: [
      "Autonomie pour réaliser des projets SIG complets sous QGIS",
      "Certificat de Spécialiste SIG QGIS CICEXF"
    ],
    targetPublic: [
      "Urbanistes, géographes, aménagistes, environnementalistes",
      "Ingénieurs du génie civil, géomètres, agents techniques municipaux",
      "Chargés d'études en ONG de développement local"
    ],
    prerequisites: ["Aisance générale avec l'outil informatique. Aucune connaissance préalable en SIG."],
    program: [
      { module: "Module 1 : Fondamentaux de la cartographie & QGIS", details: ["Concepts SIG", "Modèles vectoriels vs rasters", "Systèmes WGS 84 et UTM"] },
      { module: "Module 2 : Acquisition et connexion aux serveurs de cartes", details: ["OpenStreetMap", "Flux WMS/WFS", "Import de données GPS de terrain"] },
      { module: "Module 3 : Numérisation et tables d'attributs", details: ["Création de couches Shapefile et GeoPackage", "Calcul de surfaces et linéaires"] },
      { module: "Module 4 : Géoréférencement & analyses spatiales", details: ["Calage de plans scannés", "Zones de tampon (buffer)", "Intersections"] },
      { module: "Module 5 : Cartes thématiques et mise en page finale", details: ["Sémiologie graphique", "Gestionnaire de composition", "Exportation haute résolution"] }
    ],
    sessions: [
      { date: "25 Juillet 2026", location: "Siège CICEXF Abidjan Angré 8e", status: "Disponible" },
      { date: "17 Octobre 2026", location: "Siège CICEXF Abidjan Angré 8e", status: "Disponible" }
    ],
    faq: [
      { question: "Le logiciel QGIS est-il gratuit ?", answer: "Oui, QGIS est un logiciel libre et open source gratuit, sans frais de licence récurrents." }
    ]
  },
  {
    id: 'f-management-project',
    slug: 'pmp-certif-preparation',
    title: "Gestion de Projets et Préparation à la Certification PMP (Project Management Professional)",
    domain: "Audit & Stratégie",
    level: "Avancé",
    modality: "En ligne",
    duration: "60 heures",
    price: "500 000 FCFA",
    featuredImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Une préparation intensive basée sur le PMBOK 7ème édition pour réussir l'examen PMP du PMI du premier coup.",
    context: "La certification PMP® du Project Management Institute est le standard mondial le plus reconnu en management de projet. Le CICEXF propose une formation structurée garantissant les 35 heures officielles requises.",
    objectives: [
      "Maîtriser les 3 domaines clés de l'examen : Personnes, Processus, Environnement Commercial",
      "Intégrer les cycles de vie prédictifs, agiles (Scrum, Kanban) et hybrides",
      "Valider les 35 heures de contact obligatoires pour l'éligibilité PMI",
      "S'entraîner sur simulateur d'examen de plus de 2 000 questions avec corrigés"
    ],
    resultsExpected: [
      "Attestation officielle de 35 heures PDU délivrée",
      "Taux de réussite historique supérieur à 96% sous 3 mois",
      "Validation du dossier d'inscription PMI par nos experts"
    ],
    targetPublic: [
      "Chefs de projets, directeurs de programmes, consultants seniors",
      "Ingénieurs, directeurs techniques, cadres de ministères et d'ONG"
    ],
    prerequisites: ["Bac+3 avec 3 ans d'expérience en projet OU Bac+2 avec 5 ans d'expérience."],
    program: [
      { module: "Module 1 : Cadre PMI et déontologie du chef de projet", details: ["Structure du PMBOK 7e", "Dossier d'éligibilité"] },
      { module: "Module 2 : Domaine 'Personnes' - Leadership & Équipe", details: ["Gestion des conflits", "Motivation", "Accompagnement du changement"] },
      { module: "Module 3 : Domaine 'Processus' - Planification prédictive", details: ["Charte de projet", "WBS", "Chemin critique", "Budgétisation"] },
      { module: "Module 4 : Approches Agiles, Scrum et Hybrides", details: ["Manifeste Agile", "Cérémonies Scrum", "Gestion de la valeur acquise (EVM)"] },
      { module: "Module 5 : Gestion des Risques et Environnement Commercial", details: ["Analyse qualitative et quantitative", "Stratégies de réponse", "Gouvernance"] },
      { module: "Module 6 : Stratégies d'examen & Examens blancs minutés", details: ["Analyse des pièges", "Simulateur 180 questions", "Plan de révision"] }
    ],
    sessions: [
      { date: "11 Juillet 2026", location: "Classe Virtuelle Zoom Direct (Samedis)", status: "Disponible" },
      { date: "05 Septembre 2026", location: "Classe Virtuelle Zoom Direct (Samedis)", status: "Disponible" }
    ],
    faq: [
      { question: "Les frais d'examen PMI sont-ils inclus ?", answer: "Non, les frais d'examen PMI (environ 405 USD pour les membres PMI) se règlent directement sur pmi.org. L'accompagnement à l'inscription est offert par le CICEXF." }
    ]
  }
];

// ============================================================================
// LES 8 PÔLES MAJEURS D'ACCOMPAGNEMENT ET LEURS 34 SOUS-DOMAINES
// ============================================================================
export const DOMAINS_INTERVENTION: DomainIntervention[] = [
  {
    id: 'ing-formation',
    slug: 'ingenierie-formation',
    title: "Ingénierie de formation et de renforcement de capacités",
    shortDescription: "Analyse des besoins, conception de programmes sur-mesure et transfert de compétences de haut niveau.",
    description: "Le CICEXF accompagne les organisations publiques, privées et non gouvernementales dans le développement stratégique de leur capital humain.",
    iconName: 'GraduationCap',
    subDomains: [
      { title: "1. Analyse et planification des dispositifs de formation", description: "Diagnostics des besoins, plans de formation stratégiques et cartographie des compétences.", keyPoints: ["Diagnostics individuels et collectifs", "Veille réglementaire"] },
      { title: "2. Conception pédagogique et innovation éducative", description: "Curricula par compétences, ingénierie e-learning et multimodalités.", keyPoints: ["Approche par compétences (APC)", "Outils LMS interactifs"] },
      { title: "3. Mise en œuvre des formations", description: "Animation présentielle et virtuelle, ateliers pratiques et coordination logistique.", keyPoints: ["Master facilitateurs certifiés", "Suivi individuel"] },
      { title: "4. Évaluation et développement professionnel", description: "Mesure de l'impact selon le modèle de Kirkpatrick et certification des compétences.", keyPoints: ["Évaluation de niveau 4", "Bilan de compétences"] }
    ],
    examples: ["Plan triennal de formation pour 450 cadres de l'administration publique.", "Digitalisation des modules sécurité pour un groupe industriel."]
  },
  {
    id: 'ing-financiere',
    slug: 'ingenierie-financiere',
    title: "Ingénierie financière et de l'investissement",
    shortDescription: "Modélisation financière complexe, structuration de levées de fonds et appui à l'investissement privé.",
    description: "Nous offrons une expertise pointue pour optimiser la structure financière des entreprises et structurer les projets d'investissement majeurs.",
    iconName: 'TrendingUp',
    subDomains: [
      { title: "5. Structuration et financement des projets", description: "Montage financier, PPP, dossiers de crédit bancaire multilatéral.", keyPoints: ["Dossiers de financement", "PPP", "Fonds verts"] },
      { title: "6. Analyse financière et modélisation", description: "Modèles 3-Statement dynamiques, analyse de rentabilité (VAN, TRI) et valorisation DCF.", keyPoints: ["Valorisation d'entreprises", "Modélisation prévisionnelle"] },
      { title: "7. Gestion comptable, fiscale et audit", description: "Mise en conformité SYSCOHADA Révisé, audit fiscal et reporting de conformité.", keyPoints: ["Audit SYSCOHADA", "Optimisation fiscale légale"] },
      { title: "8. Entrepreneuriat et développement de PME", description: "Accompagnement de startups et PME, plans d'affaires et mentorat exécutif.", keyPoints: ["Incubation", "Pitch investisseurs"] }
    ],
    examples: ["Structuration d'une levée de fonds de 15 millions USD pour un pôle agro-industriel régional.", "Modélisation financière d'une concession portuaire."]
  },
  {
    id: 'ing-informatique',
    slug: 'ingenierie-informatique',
    title: "Ingénierie informatique et systèmes de réseaux",
    shortDescription: "Architecture logicielle, cloud, transformation digitale et cybersécurité des organisations.",
    description: "Nous concevons et déployons des architectures numériques robustes pour accélérer la digitalisation des services.",
    iconName: 'Cpu',
    subDomains: [
      { title: "9. Infrastructure et réseaux", description: "Conception de réseaux d'entreprise, serveurs cloud et haute disponibilité.", keyPoints: ["SD-WAN", "Virtualisation", "Cloud AWS/Azure"] },
      { title: "10. Développement logiciel et solutions applicatives", description: "Portails web d'entreprise, ERP sur-mesure et API sécurisées.", keyPoints: ["Architectures microservices", "Applications mobiles"] },
      { title: "11. Cybersécurité et gouvernance IT", description: "Audits de sécurité, tests d'intrusion (pentest) et mise en conformité ISO 27001.", keyPoints: ["Sécurisation des données", "Gestion des incidents"] },
      { title: "12. Transformation numérique", description: "Audit de maturité digitale, automatisation des processus et Big Data.", keyPoints: ["Dématérialisation zéro papier", "Business Intelligence"] }
    ],
    examples: ["Déploiement d'une plateforme de gestion intégrée pour un réseau d'agences financières.", "Audit de cybersécurité pour un opérateur de télécommunications."]
  },
  {
    id: 'ing-territoriale',
    slug: 'ingenierie-developpement-territorial',
    title: "Ingénierie de développement territorial",
    shortDescription: "Planification urbaine, cadastre moderne, SIG communaux et gouvernance locale.",
    description: "Accompagnement des ministères et collectivités pour l'aménagement harmonieux et durable des territoires.",
    iconName: 'Compass',
    subDomains: [
      { title: "13. Aménagement du territoire et urbanisme", description: "Schémas directeurs d'aménagement (SDAU), plans d'urbanisme de détail.", keyPoints: ["Planification urbaine", "Zonage réglementaire"] },
      { title: "14. Décentralisation et gouvernance locale", description: "Appui aux mairies, optimisation du recouvrement fiscal communal.", keyPoints: ["Fiscalité locale", "Budgets participatifs"] },
      { title: "15. Développement rural et filières agricoles", description: "Valorisation des chaînes de valeur agricoles, pistes rurales et agropoles.", keyPoints: ["Agrobusiness", "Infrastructures de désenclavement"] },
      { title: "16. SIG et observation territoriale", description: "Numérisation du cadastre, cartographie par drone et bases de données spatiales.", keyPoints: ["QGIS", "Télédétection", "Cadastre numérique"] }
    ],
    examples: ["Cadastre fiscal numérisé et formation des agents de trois communes secondaires.", "Plan d'Aménagement Urbain résilient au changement climatique."]
  },
  {
    id: 'ing-qhse',
    slug: 'ingenierie-qhse',
    title: "Ingénierie QHSE (Qualité, Hygiène, Sécurité, Environnement)",
    shortDescription: "Systèmes de management intégré, certifications ISO 9001, 14001, 45001 et maîtrise des risques industriels.",
    description: "Protection du capital humain, respect de l'environnement et conformité aux standards internationaux les plus stricts.",
    iconName: 'ShieldCheck',
    subDomains: [
      { title: "17. Systèmes de management intégré (SMI)", description: "Conception et déploiement de démarches intégrées ISO 9001/14001/45001.", keyPoints: ["Processus certifiables", "Manuels de management"] },
      { title: "18. Hygiène et sécurité au travail (SST)", description: "Document Unique d'évaluation des risques, ergonomie et plans de prévention.", keyPoints: ["Sécurité de chantier", "Réduction des accidents"] },
      { title: "19. Environnement et développement durable", description: "Études d'impact environnemental et social (EIES), bilan carbone et RSE.", keyPoints: ["Audits environnementaux", "Gestion des déchets"] },
      { title: "20. Sécurité sanitaire et agroalimentaire", description: "Normes HACCP, ISO 22000 et traçabilité des denrées.", keyPoints: ["Hygiène alimentaire", "Contrôles microbiologiques"] }
    ],
    examples: ["Accompagnement d'un complexe industriel minier vers la triple certification QSE.", "Élaboration du plan de sécurité pour un chantier d'infrastructure."]
  },
  {
    id: 'ing-gestion-projets',
    slug: 'gestion-de-projets',
    title: "Gestion, suivi et évaluation des projets et programmes",
    shortDescription: "Cadres logiques, gestion de la valeur acquise, collecte digitale et revues d'impact de bailleurs.",
    description: "Garantir le respect des budgets, délais et objectifs de performance pour les projets publics et humanitaires.",
    iconName: 'Target',
    subDomains: [
      { title: "21. Conception et planification de projets", description: "Théorie du changement, cadre logique et budget par objectifs.", keyPoints: ["Modélisation logique", "Gestion prédictive et agile"] },
      { title: "22. Suivi opérationnel et financier", description: "Mise en place de tableaux de bord de pilotage et suivi budgétaire en temps réel.", keyPoints: ["Indicateurs clés (KPI)", "Earned Value Management"] },
      { title: "23. Évaluation d'impact", description: "Évaluations à mi-parcours et finales selon les critères du CAD de l'OCDE.", keyPoints: ["Mesure d'efficacité", "Rapports pour bailleurs"] },
      { title: "24. Systèmes d'information pour le suivi-évaluation (SISE)", description: "Digitalisation de la collecte terrain avec KoboCollect, Power BI et bases SQL.", keyPoints: ["Collecte mobile", "Tableaux de bord automatisés"] }
    ],
    examples: ["Mise en place du SISE national d'un projet de nutrition communautaire financé par la Banque Mondiale.", "Évaluation finale d'un programme d'accès à l'eau potable."]
  },
  {
    id: 'etudes-recherches',
    slug: 'etudes-et-recherches',
    title: "Études, enquêtes et recherches socio-économiques",
    shortDescription: "Enquêtes quantitatives et qualitatives de grande envergure, analyses économétriques et publications.",
    description: "Apporter des données scientifiques solides pour éclairer la décision publique et orienter les investissements.",
    iconName: 'BookOpen',
    subDomains: [
      { title: "25. Enquêtes statistiques et sondages", description: "Échantillonnage probabiliste, formation des enquêteurs et collecte mobile.", keyPoints: ["Échantillonnage représentatif", "Contrôle qualité en temps réel"] },
      { title: "26. Études socio-économiques", description: "Analyses de vulnérabilité, études de marché et profils de pauvreté.", keyPoints: ["Diagnostic participatif", "Analyse sociologique"] },
      { title: "27. Économétrie et analyse de données", description: "Modélisation économétrique avancée sous Stata, R et Python.", keyPoints: ["Analyses de régression", "Inférence causale"] },
      { title: "28. Études sectorielles spécialisées", description: "Diagnostics approfondis des secteurs de l'énergie, de l'éducation et de la santé.", keyPoints: ["Perspectives de marché", "Notes d'orientation politique"] }
    ],
    examples: ["Enquête auprès de 5 000 ménages sur les dépenses énergétiques en milieu rural.", "Étude de faisabilité socio-économique d'une zone franche."]
  },
  {
    id: 'conseil-strategique',
    slug: 'conseil-strategique-organisation',
    title: "Conseil stratégique et organisationnel",
    shortDescription: "Gouvernance d'entreprise, plans stratégiques pluriannuels et conduite du changement.",
    description: "Aligner les structures, les processus et les équipes sur les ambitions de croissance à long terme.",
    iconName: 'Layers',
    subDomains: [
      { title: "29. Stratégie d'entreprise et vision", description: "Diagnostics stratégiques SWOT/PESTEL, élaboration de plans à 5 ans.", keyPoints: ["Feuille de route", "Avantage concurrentiel"] },
      { title: "30. Organisation et processus", description: "Cartographie des processus métiers, fiches de postes et manuels de procédures.", keyPoints: ["Élimination des gaspillages", "Réingénierie des processus"] },
      { title: "31. Gestion des ressources humaines et GPEC", description: "Référentiels de métiers, grilles salariales et plans de succession.", keyPoints: ["GPEC", "Attraction des talents"] },
      { title: "32. Conduite du changement et culture", description: "Accompagnement humain lors des fusions, acquisitions et digitalisations.", keyPoints: ["Communication interne", "Adhésion des collaborateurs"] },
      { title: "33. Audit organisationnel", description: "Évaluation de la performance globale et de la cohérence managériale.", keyPoints: ["Rapports d'audit", "Plans de redressement"] },
      { title: "34. Gouvernance et éthique", description: "Conseils d'administration, chartes déontologiques et conformité anticorruption.", keyPoints: ["Standards de gouvernance", "Transparence"] }
    ],
    examples: ["Réorganisation managériale d'une société nationale d'énergie.", "Audit d'adéquation profils-postes de 80 cadres dirigeants."]
  }
];

// ============================================================================
// ÉQUIPE DIRIGEANTE ET CONSULTANTS EXPERTS DU CABINET
// ============================================================================
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 't-dg-kouassi',
    name: "Dr. Kouassi Marc-Aurèle",
    role: "Directeur Général & Associé Gérant",
    category: 'Dirigeant',
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Docteur et expert international en ingénierie de conseil et gestion des organisations. Il pilote le développement stratégique et les relations institutionnelles du CICEXF.",
    emailUrl: "cabinetcicexf@gmail.com"
  },
  {
    id: 't1',
    name: "M. Amadou Diallo",
    role: "Directeur Général & Co-fondateur",
    category: 'Dirigeant',
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Fort de plus de 18 ans d'expérience dans le conseil stratégique et la modélisation de politiques publiques pour de prestigieux cabinets internationaux et bailleurs multilatéraux. Expert en structuration de PPP.",
    linkedinUrl: "https://linkedin.com/in/amadou-diallo-cicexf-example",
    emailUrl: "a.diallo@cicexf.org"
  },
  {
    id: 't2',
    name: "Dr. Marc Koffi",
    role: "Directeur Général Adjoint & Chef du Pôle Formation",
    category: 'Dirigeant',
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    bio: "Docteur en Sciences de l'Éducation et Ingénieur Informaticien. Pionnier de l'approche par compétences en Afrique de l'Ouest. Concepteur de plusieurs plateformes E-learning nationales.",
    linkedinUrl: "https://linkedin.com/in/marc-koffi-cicexf-example",
    emailUrl: "m.koffi@cicexf.org"
  },
  {
    id: 't3',
    name: "Mme Fatou Sylla",
    role: "Conseillère Spéciale & Experte en Ingénierie Financière",
    category: 'Conseil',
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Ancienne directrice d'investissement au sein d'un fonds de capital-risque panafricain. Titulaire d'un master de la London School of Economics, elle conseille les promoteurs sur les montages financiers et les levées de fonds.",
    linkedinUrl: "https://linkedin.com/in/fatou-sylla-cicexf-example",
    emailUrl: "f.sylla@cicexf.org"
  },
  {
    id: 't4',
    name: "M. Sylvain Gnahoré",
    role: "Spécialiste Principal Aménagement du Territoire & SIG",
    category: 'Expert',
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Ingénieur géographe expert des dynamiques de décentralisation et des outils d'aide à la décision territoriale. Il a piloté plus de 30 missions de cartographie communale et d'élaboration de schémas directeurs.",
    linkedinUrl: "https://linkedin.com/in/sylvain-gnahore-cicexf-example",
    emailUrl: "s.gnahore@cicexf.org"
  },
  {
    id: 't5',
    name: "Mme Émilie Bamba",
    role: "Responsable du Pôle QHSE & RSE",
    category: 'Expert',
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    bio: "Experte certifiée IRCA ISO 9001, 14001, et 45001. Accompagne les industries agroalimentaires et minières de la sous-région dans leur mise en conformité réglementaire et l'audit de leurs processus.",
    linkedinUrl: "https://linkedin.com/in/emilie-bamba-cicexf-example",
    emailUrl: "e.bamba@cicexf.org"
  }
];

// ============================================================================
// GRANDS PROJETS RÉALISÉS ET ÉTUDES DE CAS
// ============================================================================
export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: "Restructuration organisationnelle et audit stratégique d'un pôle d'énergie régional",
    category: "Audit & Stratégie",
    client: "Ministère de l'Énergie / Banque Multilatérale de Développement",
    location: "Afrique de l'Ouest",
    year: 2025,
    stats: [
      { value: "45%", label: "De réduction des goulots d'étranglement administratifs" },
      { value: "5 ans", label: "De feuille de route de transformation certifiée" },
      { value: "+10 000", label: "Ménages raccordés grâce à l'efficacité gagnée" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    description: "Révision de la structure interne d'une importante compagnie publique d'énergie, audit d'adéquation profils-postes de 80 cadres, et mise en place d'un système d'information de gestion intégré.",
    challenges: ["Résistance culturelle interne", "Dispersion géographique", "Calendrier serré de bailleur"],
    solutions: ["Comité mixte d'accompagnement du changement", "Reporting Business Intelligence en temps réel", "12 ateliers intensifs de formation des dirigeants"],
    testimonial: {
      text: "L'intervention de CICEXF a redonné de la clarté à nos équipes. Le plan de restructuration est appliqué avec des résultats tangibles.",
      author: "M. Traoré A.",
      role: "Directeur de la Modernisation Institutionnelle"
    }
  },
  {
    id: 'p2',
    title: "Conception du SIG cadastral et Plan d'Aménagement Urbain de trois métropoles secondaires",
    category: "Développement Territorial",
    client: "Secrétariat Général à l'Aménagement du Territoire et à la Décentralisation",
    location: "Côte d'Ivoire",
    year: 2025,
    stats: [
      { value: "120 000 ha", label: "Cartographiés avec précision centimétrique par drone" },
      { value: "15 agents", label: "Municipaux formés en autonomie sur QGIS" },
      { value: "3", label: "Documents d'urbanisme réglementaires livrés et approuvés" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
    description: "Numérisation complète du cadastre sur QGIS et formation des agents pour sécuriser les recettes fiscales locales.",
    challenges: ["Absence de cartes géoréférencées", "Zones de litiges fonciers sensibles"],
    solutions: ["Imagerie satellite combinée à des survols drone", "Audiences de concertation publique", "Don de stations de travail et académie SIG de 3 semaines"]
  },
  {
    id: 'p3',
    title: "Formation d'Excellence 'Data Analyst' pour 150 responsables Suivi-Évaluation des ONG",
    category: "Ingénierie de Formation",
    client: "Consortium International pour le Développement d'Infrastructures Communautaires",
    location: "Afrique de l'Ouest",
    year: 2024,
    stats: [
      { value: "150", label: "Cadres humanitaires certifiés autonomes" },
      { value: "100%", label: "Formulaires terrain convertis du papier au mobile" },
      { value: "+30%", label: "Gain de temps sur le reporting mensuel" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    description: "Cycle de renforcement de capacités sur-mesure de 6 semaines centré sur KoboCollect, Power Query et Power BI.",
    challenges: ["Hétérogénéité des profils", "Connexion internet intermittente sur le terrain"],
    solutions: ["Plateforme e-learning avec vidéos hors-ligne", "KoboCollect en mode déconnecté"],
    testimonial: {
      text: "Nos équipes passent moins de temps sur la saisie papier et se concentrent sur l'analyse stratégique des indicateurs.",
      author: "Mme Sarah Dembélé",
      role: "Coordonnatrice Suivi-Évaluation du Consortium"
    }
  }
];

// ============================================================================
// PUBLICATIONS DU BLOG / ARTICLES TECHNIQUES
// ============================================================================
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog1',
    slug: 'comment-reussir-collecte-kobo-collect',
    title: "Comment réussir sa transition digitale de la collecte de données papier vers KoboCollect ?",
    category: "Formation",
    readTime: "6 min de lecture",
    date: "14 Juin 2026",
    author: {
      name: "Dr. Marc Koffi",
      role: "Directeur Général Adjoint & Chef du Pôle Formation",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80"
    },
    excerpt: "Les 5 étapes indispensables pour concevoir des formulaires mobiles robustes et opérationnels hors-ligne.",
    content: "Guide méthodologique sur la conception XLSForm, les contrôles de cohérence, la formation terrain et la supervision.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    tags: ["KoboCollect", "Data", "ODK", "Power BI"]
  },
  {
    id: 'blog2',
    slug: 'les-cles-de-la-certification-iso-9001',
    title: "Les clés du succès pour implémenter un Système de Management de la Qualité ISO 9001 v2015",
    category: "QHSE",
    readTime: "8 min de lecture",
    date: "10 Mai 2026",
    author: {
      name: "Mme Émilie Bamba",
      role: "Experte QHSE Senior & Auditeur de Certification",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"
    },
    excerpt: "Évitez la sur-documentation et engagez la direction générale pour réussir l'audit de certification.",
    content: "L'approche par les risques, l'implication des parties prenantes et la simplification des processus d'audit.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    tags: ["ISO 9001", "Qualite", "Audit Interne"]
  },
  {
    id: 'blog3',
    slug: 'importance-du-sig-amenagement-territoire',
    title: "Pourquoi le SIG est-il l'outil incontournable du maire moderne ?",
    category: "Développement Territorial",
    readTime: "5 min de lecture",
    date: "28 Avril 2026",
    author: {
      name: "M. Sylvain Gnahoré",
      role: "Spécialiste Principal Aménagement du Territoire & SIG",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
    },
    excerpt: "De la gestion cadastrale à l'optimisation des taxes locales, comment l'analyse spatiale aide les communes.",
    content: "Superposition des données de voirie, d'écoles et de cadastre pour une fiscalité locale modernisée.",
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
    tags: ["QGIS", "SIG", "Communes", "Urbanisme"]
  }
];

// ============================================================================
// TÉMOIGNAGES DE CONFIANCE
// ============================================================================
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test1',
    name: "M. Jean-Baptiste Yao",
    role: "Responsable Suivi-Évaluation",
    organization: "ONG Action pour le Progrès",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
    text: "La formation 'Data Analyst' du CICEXF a changé ma façon de travailler. J'ai pu informatiser tout notre système de collecte d'informations terrain avec KoboCollect et Power BI. Notre comité de direction a été impressionné !",
    rating: 5
  },
  {
    id: 'test2',
    name: "Mme Alima Coulibaly",
    role: "Analyste Financier",
    organization: "Sipro-Agri Holding",
    avatarUrl: "https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=100&q=80",
    text: "Le pôle ingénierie financière de CICEXF nous a accompagnés dans l'élaboration de notre modèle financier pour l'implantation d'une nouvelle filiale. Rigueur, disponibilité et compréhension parfaite.",
    rating: 5
  },
  {
    id: 'test3',
    name: "M. Christian Bini",
    role: "Secrétaire Technique",
    organization: "Mairie de Bouaké",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
    text: "Une collaboration remarquable dans le cadre de la refonte de notre SIG cadastral. Grâce aux experts du cabinet, notre service d'urbanisme dispose enfin d'un outil fiable pour contrôler l'évolution communale.",
    rating: 5
  }
];

// ============================================================================
// PARTENAIRES INSTITUTIONNELS
// ============================================================================
export const PARTNERS: Partner[] = [
  { id: 'p1', name: "Banque Mondiale", logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&q=80", category: "Bailleur Multilatéral" },
  { id: 'p2', name: "Ministère de l'Économie", logoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=100&q=80", category: "Institution Publique" },
  { id: 'p3', name: "AFD (Agence Française de Développement)", logoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=100&q=80", category: "Coopération Bilatérale" },
  { id: 'p4', name: "PNUD", logoUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=100&q=80", category: "Organisation Internationale" },
  { id: 'p5', name: "ECOWAS / CEDEAO", logoUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=100&q=80", category: "Institution Régionale" }
];

// ============================================================================
// FOIRE AUX QUESTIONS GLOBALE (FAQ CONSOLIDÉE)
// ============================================================================
export const GLOBAL_FAQ = [
  {
    question: "Comment s'inscrire à une formation du CICEXF ?",
    answer: "L'inscription s'effectue en 3 étapes simples : 1. Choisissez votre formation et remplissez le formulaire d'admission en ligne ou envoyez un message WhatsApp au +225 07 01 97 00 65. 2. Vous recevez sous 24h la fiche d'inscription officielle et la facture proforma. 3. Réglez votre acompte ou déposez le bon de commande de votre entreprise pour confirmer votre place."
  },
  {
    question: "Quelles sont les modalités de paiement et facilités accordées ?",
    answer: "Pour les particuliers, le règlement peut être échelonné en 2 ou 3 versements sans aucun frais additionnel. Pour les entreprises et institutions, une facture proforma et une convention sont transmises sous 24h ouvrées. Règlement accepté par virement, chèque ou Mobile Money (Orange Money, Wave, MTN MoMo)."
  },
  {
    question: "Existe-t-il des remises pour les inscriptions en groupe ?",
    answer: "Oui : 10% de réduction à partir de 3 participants d'une même organisation, 15% de réduction à partir de 5 participants, et tarification dégressive sur devis sur-mesure pour les formations intra-entreprise sur site client."
  },
  {
    question: "Où se déroulent les cours en présentiel ?",
    answer: "Au siège principal du CICEXF à Abidjan : Cocody Angré 8ème Tranche, Carrefour Duncan / Rue de la Clinique, Immeuble Prestige, 3ème étage. Pour les formations hybrides ou en ligne, les cours sont diffusés en direct interactif via Zoom avec accès illimité aux enregistrements et laboratoires."
  },
  {
    question: "Les formations donnent-elles lieu à des certificats officiels ?",
    answer: "Oui, tous nos cycles certifiants délivrent un certificat professionnel nominatif officiel du cabinet CICEXF (agréé sous le N°25343/GTCA/RC/2025). Pour le PMP, nous délivrons l'attestation officielle de 35 heures de contact de gestion de projet requise pour l'examen mondial du PMI."
  },
  {
    question: "Comment demander une mission de consultance ou un devis d'expertise ?",
    answer: "Contactez notre secrétariat par WhatsApp au +225 07 01 97 00 65 ou par e-mail à elearningciv@gmail.com / cabinetcicexf@gmail.com en décrivant votre besoin. Nos directeurs de pôles organisent une réunion de cadrage sous 48h."
  }
];

// ============================================================================
// GÉNÉRATEUR AUTOMATIQUE DE LA BASE DE CONNAISSANCES TEXTUELLE POUR ADILINE
// ============================================================================
export function generateAdilineKnowledgeText(): string {
  const c = CABINET_INFO;
  return `
# BASE DE CONNAISSANCES OFFICIELLE DU CABINET ${c.sigle}
(Cabinet International de Consultance, d'Expertise et de Formation)

## 1. IDENTITÉ, COORDONNÉES ET GOUVERNANCE
- **Nom officiel :** ${c.nom} (${c.sigle})
- **Agrément ministériel :** ${c.agrementOfficiel}
- **Directeur Général & Associé Gérant :** ${c.directeurGeneral.nom} (${c.directeurGeneral.contactMail})
- **Directeur Général & Co-fondateur :** ${c.directionAssociee.nom} (${c.directionAssociee.contactMail})
- **DGA & Chef du Pôle Formation :** ${c.directionAcademique.nom} (${c.directionAcademique.contactMail})
- **Siège physique :** ${c.siegePrincipal.adresseComplete} (Repère : ${c.siegePrincipal.repere})
- **Antennes régionales :** ${c.antennesRegionales.map(a => `${a.pays} (${a.ville})`).join(', ')}
- **Téléphone WhatsApp Direct / Admissions :** ${c.telephones.whatsappAdmissions} (Lien : https://wa.me/${c.telephones.whatsappClean})
- **Téléphone Secrétariat Technique :** ${c.telephones.secretariatTechnique}
- **E-mails officiels :** ${c.emails.admissions} | ${c.emails.direction}
- **Horaires d'ouverture :** ${c.horairesOuverture.semaine} ; ${c.horairesOuverture.samedi}
- **Chiffres clés :** ${c.chiffresCles.professionnelsFormes}, ${c.chiffresCles.missionsRealisees}, ${c.chiffresCles.partenairesInstitutionnels}, ${c.chiffresCles.tauxSatisfaction} de satisfaction.

## 2. MODALITÉS FINANCIÈRES, DEVIS ET FACILITÉS DE PAIEMENT
- **Particuliers :** ${c.financementEtModalites.particuliers}
- **Entreprises :** ${c.financementEtModalites.entreprises}
- **Modes de paiement :** ${c.financementEtModalites.moyensPaiement.join(', ')}
- **Règles de remises tarifaires :**
${c.financementEtModalites.remisesGroupe.map(r => `  * ${r.seuil} : **${r.remise}**`).join('\n')}

## 3. CATALOGUE COMPLET DES FORMATIONS DU CABINET
${FORMATIONS.map((f, i) => `
### Formation ${i + 1} : ${f.title} (ID: ${f.id})
- **Domaine :** ${f.domain}
- **Niveau :** ${f.level}
- **Format / Modalité :** ${f.modality}
- **Durée :** ${f.duration}
- **Tarif officiel :** ${f.price}
- **Description :** ${f.shortDescription}
- **Public cible :** ${f.targetPublic.join(', ')}
- **Prérequis :** ${f.prerequisites.join(', ')}
- **Modules du programme :**
${f.program.map(p => `  * ${p.module} : ${p.details.join('; ')}`).join('\n')}
- **Prochaines sessions au calendrier :**
${f.sessions.map(s => `  * Date : ${s.date} | Lieu : ${s.location} | Statut : ${s.status}`).join('\n')}
- **FAQ spécifique :**
${f.faq.map(q => `  * Q : ${q.question} -> R : ${q.answer}`).join('\n')}
`).join('\n')}

## 4. LES 8 PÔLES MAJEURS D'ACCOMPAGNEMENT ET DE CONSULTANCE (34 SOUS-DOMAINES)
${DOMAINS_INTERVENTION.map(d => `
- **${d.title} (Pôle : ${d.id}) :**
  ${d.shortDescription}
  Sous-domaines d'intervention :
${d.subDomains.map(s => `    * ${s.title} : ${s.description}`).join('\n')}
  Exemples de réalisations : ${d.examples?.join(' ; ') || 'Interventions sur-mesure'}
`).join('\n')}

## 5. EXPERTS DU CABINET ET CONTACTS
${TEAM_MEMBERS.map(t => `- **${t.name}** : ${t.role} (${t.category}) - ${t.bio} | Contact : ${t.emailUrl || c.emails.admissions}`).join('\n')}

## 6. FOIRE AUX QUESTIONS CONSOLIDÉE
${GLOBAL_FAQ.map(faq => `- **Q : ${faq.question}**\n  R : ${faq.answer}`).join('\n')}
`;
}
