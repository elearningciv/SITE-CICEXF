/**
 * Training programme of each axis (Formations tab): what the learner does, module by module.
 * Keys: see axisKey in domainContent.ts. Each programme ends with a concrete personal deliverable.
 */

export interface ProgrammeModule {
  module: string;
  details: string[];
}

const m = (module: string, ...details: string[]): ProgrammeModule => ({ module, details });

export const FORMATION_PROGRAMS: Record<string, ProgrammeModule[]> = {
  // Ingénierie financière et de l'investissement
  'structuration et financement des projets': [
    m("Module 1 : Passer de l'idée au projet finançable", "Ce qu'une banque et un investisseur regardent vraiment", "Formuler le problème, la solution et le marché en une page", "Atelier : le test de solidité de votre projet"),
    m("Module 2 : Vérifier que le projet tient debout", "Étude de marché et étude technique simplifiées", "Coûts d'investissement et charges d'exploitation", "Analyse des risques et solutions de repli"),
    m("Module 3 : Construire le plan de financement", "Fonds propres, crédit bancaire, subventions, crédit-bail", "Capacité de remboursement et échéancier", "Exercice : équilibrer les ressources et les emplois"),
    m("Module 4 : Convaincre les financeurs", "Structure d'un dossier bancable et d'un résumé exécutif", "Identifier les bons guichets : banques, fonds, bailleurs", "Simulation d'entretien avec un financeur"),
    m("Projet final : votre dossier de financement", "Rédaction de la trame complète", "Présentation orale devant le groupe", "Retours personnalisés et plan d'action")
  ],
  'analyse financiere et modelisation': [
    m("Module 1 : Lire la santé d'une activité en quelques minutes", "Bilan, compte de résultat et tableau de flux", "Soldes de gestion et ratios essentiels", "Cas pratique : diagnostiquer une PME"),
    m("Module 2 : Excel au service du financier", "Structure d'un modèle : hypothèses, calculs, résultats", "Fonctions financières, recherche et scénarios", "Bonnes pratiques pour un fichier fiable et lisible"),
    m("Module 3 : Construire le modèle pas à pas", "Prévisions de ventes et de charges", "Investissements, amortissements et besoin en fonds de roulement", "Dette, capitaux propres et états financiers reliés entre eux"),
    m("Module 4 : Décider avec les chiffres", "VAN, TRI et délai de récupération", "Scénarios et analyse de sensibilité", "Tableau de bord pour la direction"),
    m("Projet final : votre modèle financier complet", "Modélisation d'un cas réel de bout en bout", "Contrôle de cohérence du modèle", "Présentation de la recommandation d'investissement")
  ],
  'gestion comptable fiscale et audit': [
    m("Module 1 : Les bases solides du SYSCOHADA révisé", "Plan comptable et logique des écritures", "Pièces justificatives et organisation des journaux", "Exercices : enregistrer les opérations courantes"),
    m("Module 2 : De la saisie aux états financiers", "Rapprochements bancaires et travaux d'inventaire", "Amortissements, provisions et régularisations", "Lecture des états financiers annuels"),
    m("Module 3 : Maîtriser ses obligations fiscales et sociales", "Panorama des principaux impôts et déclarations en Côte d'Ivoire", "Calendrier déclaratif et pièces à conserver", "Cas pratique : prévenir pénalités et redressements"),
    m("Module 4 : Contrôle interne et audit", "Séparation des tâches et procédures clés", "Déroulement d'une mission d'audit", "Exercice : repérer les anomalies dans un dossier"),
    m("Projet final : un cycle comptable complet", "Traitement d'un mois d'opérations d'une structure fictive", "Production des états de synthèse simplifiés", "Liste de contrôle personnelle à réutiliser")
  ],
  'entrepreneuriat et developpement de pme': [
    m("Module 1 : Trouver l'idée qui répond à un vrai besoin", "Observer son marché et ses futurs clients", "Formuler une offre qui se distingue", "Atelier : votre modèle économique sur une page"),
    m("Module 2 : Se lancer dans les règles", "Choisir une forme juridique adaptée", "Démarches de création et obligations de base", "Protéger son nom et son activité"),
    m("Module 3 : Vendre et fidéliser", "Fixer le bon prix", "Trouver ses premiers clients avec peu de moyens", "WhatsApp, réseaux sociaux et bouche-à-oreille"),
    m("Module 4 : Gérer son argent sans se perdre", "Séparer la caisse de l'entreprise et la sienne", "Suivi des ventes, des charges et de la trésorerie", "Calculer son seuil de rentabilité"),
    m("Projet final : votre plan d'affaires", "Rédaction et chiffrage du plan", "Pitch de cinq minutes devant le groupe", "Feuille de route pour vos 90 premiers jours")
  ],

  // Ingénierie QHSE
  'systemes de management integre smi': [
    m("Module 1 : Comprendre la logique commune des normes", "Structure commune de l'ISO 9001, de l'ISO 14001 et de l'ISO 45001", "Approche processus, risques et cycle PDCA", "Quiz et analyse d'une entreprise type"),
    m("Module 2 : Construire le système", "Contexte, parties intéressées et politique QSE", "Cartographie des processus et documentation utile", "Atelier : cartographier une organisation"),
    m("Module 3 : Auditer selon l'ISO 19011", "Programme et plan d'audit", "Techniques d'entretien et collecte de preuves", "Rédaction de constats et de non-conformités"),
    m("Module 4 : Faire vivre le système", "Indicateurs et revue de direction", "Actions correctives et amélioration continue", "Préparer l'audit de certification"),
    m("Projet final : un audit interne simulé", "Préparation du plan et de la liste de contrôle", "Jeu de rôle auditeur et audité", "Rapport d'audit et restitution")
  ],
  'hygiene et securite au travail sst': [
    m("Module 1 : Voir les dangers que les autres ne voient plus", "Danger, risque et prévention", "Accidents, maladies professionnelles et leurs coûts", "Exercice d'observation à partir de photos de postes"),
    m("Module 2 : Évaluer les risques", "Méthode d'analyse par unité de travail", "Cotation et hiérarchisation", "Rédaction du Document Unique"),
    m("Module 3 : Prévenir au quotidien", "Hiérarchie des mesures de prévention", "Équipements de protection et ergonomie", "Consignes, permis de travail et causeries sécurité"),
    m("Module 4 : Réagir et apprendre", "Situations d'urgence et incendie", "Analyse d'accident par l'arbre des causes", "Indicateurs et suivi des actions"),
    m("Projet final : votre plan de prévention", "Évaluation complète d'un poste ou d'un chantier", "Plan d'action chiffré", "Animation d'une causerie sécurité devant le groupe")
  ],
  'environnement et developpement durable': [
    m("Module 1 : Les grands enjeux, de la planète à votre activité", "Climat, ressources, déchets et biodiversité", "Cadre réglementaire et attentes des financeurs", "Atelier : vos impacts en un coup d'œil"),
    m("Module 2 : Évaluer les impacts", "Étapes d'une étude d'impact environnemental et social", "Identifier et coter les impacts", "Cas pratique sur un projet d'infrastructure"),
    m("Module 3 : Mesurer son empreinte carbone", "Principes d'un bilan carbone et périmètres", "Collecte des données et calculs simplifiés", "Bâtir un plan de réduction"),
    m("Module 4 : Agir et le faire savoir", "Plan de gestion environnementale et sociale", "Démarche RSE et parties prenantes", "Éviter l'écoblanchiment et communiquer avec justesse"),
    m("Projet final : un plan d'action environnemental", "Analyse d'une activité réelle", "Rédaction du plan d'action et des indicateurs", "Présentation devant le groupe")
  ],
  'securite sanitaire et agroalimentaire': [
    m("Module 1 : Comprendre ce qui rend un aliment dangereux", "Dangers biologiques, chimiques et physiques", "Toxi-infections alimentaires : causes et conséquences", "Étude de cas réels"),
    m("Module 2 : Installer les bonnes pratiques", "Méthode des 5M et hygiène du personnel", "Nettoyage, désinfection et chaîne du froid", "Audit d'hygiène à partir d'une grille"),
    m("Module 3 : Construire son plan HACCP", "Les sept principes et les douze étapes", "Diagramme de fabrication et points critiques", "Atelier sur un produit de votre choix"),
    m("Module 4 : Traçabilité et conformité", "Exigences essentielles de l'ISO 22000", "Traçabilité, rappel de produits et gestion de crise", "Préparer une inspection"),
    m("Projet final : le plan HACCP de votre produit", "Analyse complète des dangers", "Définition des limites et des contrôles", "Présentation et retours personnalisés")
  ],
  'sauvegarde environnementale et sociale ses': [
    m("Module 1 : Pourquoi les sauvegardes décident du financement", "Principes et enjeux de la sauvegarde environnementale et sociale", "Cadres des bailleurs et réglementation nationale", "Étude d'un projet stoppé faute de conformité"),
    m("Module 2 : Identifier et classer les risques", "Tri préliminaire et catégorisation des projets", "Impacts sur l'environnement et les communautés", "Atelier d'analyse de risques"),
    m("Module 3 : Élaborer les instruments", "CGES, EIES et PGES : rôle et contenu", "Réinstallation, genre et groupes vulnérables", "Exercice de rédaction d'un PGES simplifié"),
    m("Module 4 : Travailler avec les communautés", "Plan de mobilisation des parties prenantes", "Mécanisme de gestion des plaintes", "Jeu de rôle : consultation publique"),
    m("Projet final : un dossier de suivi", "Indicateurs et rapport de conformité", "Cas pratique complet sur un projet", "Restitution devant le groupe")
  ],

  // Ingénierie de formation et de renforcement de capacités
  'analyse et planification des dispositifs de formation': [
    m("Module 1 : Poser le bon diagnostic", "Besoin de formation ou autre problème ?", "Les niveaux de besoins : organisation, métier, individu", "Atelier à partir d'une demande réelle"),
    m("Module 2 : Recueillir les besoins", "Entretiens, questionnaires et observation", "Construire et administrer ses outils", "Exercice d'entretien en binôme"),
    m("Module 3 : Bâtir un référentiel de compétences", "Du métier aux activités, puis aux compétences", "Évaluer les écarts", "Cartographie d'un métier de votre choix"),
    m("Module 4 : Construire le plan de formation", "Prioriser selon les enjeux et les budgets", "Chiffrer et planifier les actions", "Choisir la bonne modalité et le bon prestataire"),
    m("Projet final : votre plan de formation", "Formalisation complète", "Argumentaire pour la direction", "Présentation et retours")
  ],
  'conception pedagogique et innovation educative': [
    m("Module 1 : Comment les adultes apprennent vraiment", "Motivation, attention et mémoire", "Les principes de la pédagogie active", "Analyse d'une séquence de formation"),
    m("Module 2 : Définir ce que l'apprenant saura faire", "Objectifs observables et taxonomie de Bloom", "Alignement entre objectifs, activités et évaluation", "Atelier de réécriture d'objectifs"),
    m("Module 3 : Scénariser un parcours captivant", "Structure d'une séquence et rythme", "Études de cas, jeux de rôle et ludification", "Storyboard de votre module"),
    m("Module 4 : Créer ses contenus numériques", "Supports attractifs et vidéos courtes", "Outils auteur et plateformes d'apprentissage", "Transformer un cours présentiel en parcours hybride"),
    m("Projet final : votre module de formation", "Production d'un module complet", "Test auprès du groupe", "Améliorations à partir des retours")
  ],
  'mise en oeuvre des formations': [
    m("Module 1 : Préparer pour réussir", "Analyser son public et ses attentes", "Déroulé pédagogique et logistique", "Liste de contrôle de la session idéale"),
    m("Module 2 : Prendre sa place devant un groupe", "Voix, posture et gestion du trac", "Bien démarrer et capter l'attention", "Passage filmé et retours"),
    m("Module 3 : Faire participer tout le monde", "Techniques d'animation actives", "Questions, travaux de groupe et mises en situation", "Atelier : animer une séquence de dix minutes"),
    m("Module 4 : Gérer les situations délicates", "Participants difficiles et conflits", "Animer à distance sans perdre son public", "Évaluer et clôturer une session"),
    m("Projet final : votre session animée", "Animation d'une séquence complète", "Évaluation par les pairs", "Votre plan de progression de formateur")
  ],
  'evaluation et developpement professionnel': [
    m("Module 1 : Pourquoi et quoi évaluer", "Les quatre niveaux de Kirkpatrick", "Évaluation à chaud et à froid", "Analyse de questionnaires existants"),
    m("Module 2 : Construire ses outils", "Questionnaires, tests et grilles d'observation", "Mesurer les acquis avant et après", "Atelier de création d'outils"),
    m("Module 3 : Mesurer le transfert sur le terrain", "Suivi après la formation et entretiens managers", "Indicateurs de résultats", "Lire et présenter les données"),
    m("Module 4 : Faire grandir les personnes", "Bilan de compétences simplifié", "Plan de développement individuel", "Exercice sur votre propre parcours"),
    m("Projet final : un dispositif d'évaluation", "Évaluation complète d'une formation", "Rapport et recommandations", "Présentation devant le groupe")
  ],

  // Ingénierie informatique et systèmes de réseaux
  'infrastructure et reseaux': [
    m("Module 1 : Comprendre comment circulent les données", "Modèles OSI et TCP/IP", "Adressage IPv4, sous-réseaux et notions d'IPv6", "Exercices d'adressage"),
    m("Module 2 : Construire un réseau local", "Commutateurs, VLAN et Wi-Fi", "Câblage et bonnes pratiques", "Laboratoire sur simulateur"),
    m("Module 3 : Relier les réseaux", "Routage, DHCP, DNS et NAT", "Pare-feu et accès à distance", "Laboratoire : interconnecter deux sites"),
    m("Module 4 : Administrer des serveurs", "Bases de l'administration Linux et Windows Server", "Virtualisation et introduction au cloud", "Sauvegardes et plan de reprise"),
    m("Projet final : le réseau complet d'une PME", "Conception de l'architecture", "Configuration et tests", "Dépannage de pannes simulées")
  ],
  'developpement logiciel et solutions applicatives': [
    m("Module 1 : Penser comme un développeur", "Logique, algorithmes et structure d'un programme", "Git et travail en version", "Premiers exercices de code"),
    m("Module 2 : Créer l'interface", "HTML, CSS et JavaScript", "Interfaces adaptées au téléphone", "Réaliser une page dynamique"),
    m("Module 3 : Construire le serveur et les données", "Bases de données SQL", "Conception d'une API REST", "Authentification et sécurité de base"),
    m("Module 4 : Livrer un produit fiable", "Tests et correction de bugs", "Mise en ligne de l'application", "Documentation et suivi des utilisateurs"),
    m("Projet final : votre application en ligne", "Du besoin au prototype fonctionnel", "Démonstration devant le groupe", "Un projet à ajouter à votre portfolio")
  ],
  'cybersecurite et gouvernance it': [
    m("Module 1 : Penser comme un attaquant", "Hameçonnage, rançongiciels et ingénierie sociale", "Confidentialité, intégrité, disponibilité", "Analyse d'attaques réelles"),
    m("Module 2 : Protéger postes, comptes et réseaux", "Mots de passe, double authentification et sauvegardes", "Pare-feu, mises à jour et segmentation", "Laboratoire de sécurisation"),
    m("Module 3 : Trouver les failles", "Principes d'un audit de vulnérabilités", "Outils d'analyse en environnement d'exercice", "Rédaction d'un rapport de vulnérabilités"),
    m("Module 4 : Gouverner la sécurité", "Système de management ISO 27001 et cycle PDCA", "Analyse de risques et mesures de l'annexe A", "Protection des données personnelles"),
    m("Projet final : un exercice de crise", "Scénario d'incident en temps réel", "Plan de réponse et communication", "Plan de sécurité personnel ou d'entreprise")
  ],
  'transformation numerique': [
    m("Module 1 : Où en êtes-vous avec le numérique ?", "Enjeux et exemples africains inspirants", "Autodiagnostic de maturité", "Repérer ses gisements de temps"),
    m("Module 2 : Travailler plus vite et mieux", "Outils collaboratifs et documents partagés", "Formulaires et classement intelligent", "Atelier de mise en place"),
    m("Module 3 : Automatiser sans coder", "Automatisations simples et assistants d'IA", "Utiliser l'IA avec prudence et esprit critique", "Automatiser une tâche réelle"),
    m("Module 4 : Décider avec les données", "Nettoyer et structurer ses données", "Créer un tableau de bord", "Présenter des chiffres clairement"),
    m("Projet final : votre feuille de route numérique", "Choix des priorités", "Plan d'action sur 90 jours", "Présentation devant le groupe")
  ],

  // Ingénierie de développement territorial
  'amenagement du territoire et urbanisme': [
    m("Module 1 : Lire une ville et un territoire", "Dynamiques urbaines et rurales", "Acteurs et cadre de l'urbanisme en Côte d'Ivoire", "Lecture de plans et de cartes"),
    m("Module 2 : Réaliser un diagnostic territorial", "Collecte de données et visite de terrain", "Population, foncier, équipements et mobilité", "Atelier : diagnostic d'un quartier"),
    m("Module 3 : Dessiner l'avenir", "Schéma directeur et plan d'urbanisme de détail", "Scénarios d'aménagement", "Risques, inondations et résilience"),
    m("Module 4 : Faire adhérer et programmer", "Techniques de concertation", "Programmation et coût des équipements", "Simulation de réunion publique"),
    m("Projet final : un projet de quartier", "Diagnostic et orientations", "Carte des actions prioritaires", "Présentation devant un jury simulé")
  ],
  'decentralisation et gouvernance locale': [
    m("Module 1 : Comprendre la collectivité", "Communes, régions et districts autonomes", "Rôles des élus et de l'administration", "Cartographie des compétences locales"),
    m("Module 2 : Planifier avec les citoyens", "Diagnostic participatif", "Plan de développement local", "Animer une assemblée de quartier"),
    m("Module 3 : Maîtriser les finances locales", "Budget, exécution et compte administratif", "Recensement et mobilisation des recettes propres", "Cas pratique à partir de données publiques"),
    m("Module 4 : Rendre des comptes et innover", "Redevabilité et budget participatif", "Coopération décentralisée et partenaires", "Services publics locaux et numérique"),
    m("Projet final : un plan d'action pour votre commune", "Identifier une priorité locale", "Chiffrer et planifier", "Plaidoyer devant le groupe")
  ],
  'developpement rural et filieres agricoles': [
    m("Module 1 : Comprendre une chaîne de valeur", "Du producteur au consommateur : cacao, anacarde, vivrier", "Acteurs, marges et points de blocage", "Cartographier sa propre filière"),
    m("Module 2 : Produire et gagner davantage", "Compte d'exploitation d'une parcelle", "Bonnes pratiques et réduction des pertes", "Agriculture durable et résilience climatique"),
    m("Module 3 : S'organiser pour peser", "Coopératives : règles et gouvernance", "Achats groupés et accès au crédit", "Exercice : le bilan de santé d'une coopérative"),
    m("Module 4 : Vendre et transformer", "Marchés, prix et contrats", "Transformation locale et valeur ajoutée", "Qualité, certification et traçabilité"),
    m("Projet final : votre projet agricole", "Étude de la filière choisie", "Plan d'affaires simplifié", "Présentation à un financeur simulé")
  ],
  'sig et observation territoriale': [
    m("Module 1 : Entrer dans le monde des cartes numériques", "Principes des SIG et systèmes de coordonnées", "Prise en main de QGIS", "Votre première carte en une séance"),
    m("Module 2 : Collecter et organiser les données", "GPS, smartphone et collecte de terrain", "Données ouvertes et bases géographiques", "Numériser des parcelles et des plans"),
    m("Module 3 : Lire la Terre depuis l'espace", "Principes de la télédétection et images Sentinel", "Indices de végétation et occupation du sol", "Détecter un changement entre deux dates"),
    m("Module 4 : Cartographier par drone et analyser", "Préparer une mission de vol et respecter les règles", "Orthophotos et modèles de terrain", "Analyse spatiale et requêtes"),
    m("Projet final : votre atlas thématique", "Répondre à une question de terrain", "Mise en page professionnelle des cartes", "Présentation des résultats")
  ],

  // Gestion, suivi et évaluation des projets et programmes
  'conception et planification de projets': [
    m("Module 1 : Trouver le vrai problème", "Analyse des parties prenantes", "Arbre à problèmes et arbre à objectifs", "Atelier sur un sujet de votre choix"),
    m("Module 2 : Tracer le chemin du changement", "Théorie du changement", "Cadre logique et indicateurs SMART", "Exercice : relire un cadre logique"),
    m("Module 3 : Planifier le temps et l'argent", "Découpage des activités et chronogramme", "Budget par activité et par résultat", "Gantt sur tableur"),
    m("Module 4 : Convaincre un bailleur", "Comprendre un appel à propositions", "Rédiger une note conceptuelle percutante", "Risques et plan de réponse"),
    m("Projet final : votre document de projet", "Rédaction complète", "Grille d'évaluation du bailleur", "Soutenance devant le groupe")
  ],
  'suivi operationnel et financier': [
    m("Module 1 : Installer les réflexes du pilote", "Résultats, activités et indicateurs", "Plan de suivi et responsabilités", "Diagnostic d'un projet en difficulté"),
    m("Module 2 : Suivre les délais et les coûts", "Mise à jour du chronogramme", "Suivi budgétaire et engagements", "Méthode de la valeur acquise"),
    m("Module 3 : Construire son tableau de bord", "Tableaux de suivi sous Excel", "Indicateurs visuels et alertes", "Atelier sur des données de projet"),
    m("Module 4 : Rapporter et corriger", "Rapports d'avancement et rapports financiers", "Réunions de suivi efficaces", "Décider des mesures correctives"),
    m("Projet final : un tableau de bord opérationnel", "Pilotage d'un projet simulé", "Rapport d'avancement complet", "Présentation au comité de pilotage simulé")
  ],
  'evaluation d impact': [
    m("Module 1 : Comprendre ce qu'évaluer veut dire", "Suivi, évaluation et audit", "Critères du CAD de l'OCDE", "Lecture critique d'un rapport"),
    m("Module 2 : Concevoir l'évaluation", "Termes de référence et questions évaluatives", "Matrice d'évaluation", "Atelier sur un programme réel"),
    m("Module 3 : Prouver le changement", "Situation de référence et groupe de comparaison", "Principes de l'évaluation contrefactuelle", "Méthodes qualitatives et triangulation"),
    m("Module 4 : Analyser et faire utiliser les résultats", "Traitement des données", "Conclusions et recommandations", "Communiquer des résultats sensibles"),
    m("Projet final : votre rapport d'évaluation", "Évaluation d'un cas fictif", "Résumé pour les décideurs", "Présentation orale")
  ],
  'systemes d information pour le suivi evaluation sise': [
    m("Module 1 : Penser le système avant les outils", "Du cadre logique au plan de données", "Qui collecte quoi, et à quel rythme ?", "Schéma de circulation des données"),
    m("Module 2 : Collecter sans papier", "Créer un formulaire avec KoboToolbox", "Sauts, validations et collecte hors ligne", "Test sur smartphone avec KoboCollect"),
    m("Module 3 : Fiabiliser les données", "Nettoyage et contrôle de qualité", "Power Query et structuration", "Confidentialité des données"),
    m("Module 4 : Faire parler les données", "Modélisation et mesures dans Power BI", "Tableaux de bord et cartes", "Partage et actualisation"),
    m("Projet final : une chaîne complète", "Du formulaire au tableau de bord", "Rapport automatique", "Démonstration devant le groupe")
  ],

  // Études, enquêtes et recherches socio-économiques
  'enquetes statistiques et sondages': [
    m("Module 1 : Poser les bonnes bases", "Objectifs et population cible", "Types d'enquêtes et de biais", "Lecture critique d'un sondage"),
    m("Module 2 : Choisir son échantillon", "Échantillonnage aléatoire et par grappes", "Calcul de la taille d'échantillon", "Exercices sur tableur"),
    m("Module 3 : Rédiger un questionnaire qui marche", "Formulation des questions et pièges à éviter", "Programmation sur tablette", "Test en conditions réelles"),
    m("Module 4 : Conduire le terrain", "Former et superviser les enquêteurs", "Contrôle de qualité en temps réel", "Éthique et consentement"),
    m("Projet final : votre mini-enquête", "Collecte réelle à petite échelle", "Apurement et analyse", "Rapport et présentation des résultats")
  ],
  'etudes socio economiques': [
    m("Module 1 : Comprendre une réalité sociale", "Ménages, revenus et vulnérabilités", "Indicateurs de pauvreté", "Exploiter les données publiques"),
    m("Module 2 : Écouter le terrain", "Entretiens individuels", "Groupes de discussion", "Exercice d'animation en binôme"),
    m("Module 3 : Étudier un marché", "Offre, demande et concurrence", "Estimer la taille d'un marché", "Cas : lancer un produit à Abidjan"),
    m("Module 4 : Analyser et conclure", "Situation de référence", "Croiser le qualitatif et le quantitatif", "Rédiger des recommandations utiles"),
    m("Projet final : votre rapport d'étude", "Étude sur un sujet de votre choix", "Résumé exécutif", "Présentation devant le groupe")
  ],
  'econometrie et analyse de donnees': [
    m("Module 1 : Préparer ses données", "Stata, R ou Python : bien démarrer", "Importation et nettoyage", "Statistiques descriptives et graphiques"),
    m("Module 2 : Expliquer un phénomène", "Régression linéaire multiple", "Interprétation des coefficients", "Tests d'hypothèses"),
    m("Module 3 : Aller plus loin", "Modèles logit et probit", "Données de panel", "Introduction aux séries temporelles"),
    m("Module 4 : Vérifier et prévoir", "Tests de robustesse et limites", "Prévisions", "Causalité et corrélation : ne pas se tromper"),
    m("Projet final : votre étude empirique", "Analyse complète sur données réelles", "Script reproductible", "Note de synthèse pour décideurs")
  ],
  'etudes sectorielles specialisees': [
    m("Module 1 : Cartographier un secteur", "Définir le périmètre", "Acteurs, chaînes de valeur et rapports de force", "Atelier sur votre secteur"),
    m("Module 2 : Trouver l'information qui compte", "Sources officielles et données ouvertes", "Entretiens avec des experts", "Vérifier et croiser les sources"),
    m("Module 3 : Analyser", "Cadre réglementaire et politiques publiques", "Modèle des cinq forces et PESTEL", "Tendances, risques et opportunités"),
    m("Module 4 : Recommander", "Scénarios d'évolution", "Pistes d'investissement ou de réforme", "Écrire pour convaincre un décideur"),
    m("Projet final : votre note sectorielle", "Énergie, éducation ou secteur de votre choix", "Note de quelques pages", "Présentation orale")
  ],

  // Conseil stratégique et organisationnel
  'strategie d entreprise et vision': [
    m("Module 1 : Penser en stratège", "Mission, vision et valeurs", "Études de réussites et d'échecs", "Atelier : votre cap à cinq ans"),
    m("Module 2 : Faire le diagnostic", "PESTEL, cinq forces et SWOT", "Analyser concurrents et clients", "Application à votre organisation"),
    m("Module 3 : Faire des choix", "Options stratégiques", "Dire non et prioriser", "Outil de décision et arbitrages"),
    m("Module 4 : Passer à l'action", "Objectifs et indicateurs", "Plan d'action et responsabilités", "Mobiliser ses équipes"),
    m("Projet final : votre plan stratégique", "Formalisation sur une page", "Plan d'action sur 12 mois", "Présentation devant un conseil simulé")
  ],
  'organisation et processus': [
    m("Module 1 : Voir l'organisation autrement", "Structure, rôles et processus", "Signes d'une organisation qui s'essouffle", "Autodiagnostic"),
    m("Module 2 : Cartographier", "Identifier et représenter les processus", "Notation simple et logigrammes", "Atelier sur un processus réel"),
    m("Module 3 : Simplifier", "Repérer les gaspillages et les doublons", "Méthodes d'amélioration continue", "Mesurer le gain de temps"),
    m("Module 4 : Clarifier et écrire", "Organigramme et matrice des responsabilités", "Fiches de postes", "Rédiger une procédure qui sera lue"),
    m("Projet final : un processus transformé", "Avant et après", "Procédure rédigée", "Présentation du gain obtenu")
  ],
  'gestion des ressources humaines et gpec': [
    m("Module 1 : Le rôle stratégique des RH", "Du personnel aux talents", "Cadre du droit du travail ivoirien", "Diagnostic RH rapide"),
    m("Module 2 : Recruter et intégrer", "Fiche de poste et sélection", "Entretien structuré", "Jeu de rôle d'entretien"),
    m("Module 3 : Anticiper avec la GPEC", "Référentiels de métiers et de compétences", "Analyse des écarts", "Plan de carrière et succession"),
    m("Module 4 : Évaluer et rémunérer", "Entretiens annuels", "Grille salariale et équité", "Fidéliser et motiver"),
    m("Projet final : votre boîte à outils RH", "Référentiel d'un métier", "Grille d'évaluation", "Plan d'action présenté devant le groupe")
  ],
  'conduite du changement et culture': [
    m("Module 1 : Comprendre le changement", "La courbe du changement et les réactions humaines", "Pourquoi tant de projets échouent", "Analyse d'un changement vécu"),
    m("Module 2 : Préparer le terrain", "Évaluer les impacts", "Carte des alliés et des opposants", "Modèles de référence comme ADKAR et Kotter"),
    m("Module 3 : Communiquer et embarquer", "Construire un message clair", "Écoute active et conversations difficiles", "Jeux de rôle"),
    m("Module 4 : Installer durablement", "Culture d'entreprise et rituels", "Petites victoires et reconnaissance", "Mesurer l'adoption"),
    m("Projet final : votre plan de changement", "Sur un cas réel", "Plan de communication", "Présentation et retours")
  ],
  'audit organisationnel': [
    m("Module 1 : La posture de l'auditeur", "Objectifs et éthique de l'audit", "Indépendance et écoute", "Étude d'un cas d'échec"),
    m("Module 2 : Préparer la mission", "Lettre de mission et périmètre", "Revue documentaire", "Grilles d'analyse"),
    m("Module 3 : Enquêter sur le terrain", "Conduire des entretiens", "Observer les pratiques", "Analyser structure, processus et management"),
    m("Module 4 : Conclure et convaincre", "Hiérarchiser les constats", "Recommandations réalistes", "Annoncer des vérités difficiles"),
    m("Projet final : un audit simulé", "Mission complète sur un cas", "Rapport d'audit", "Restitution devant une direction simulée")
  ],
  'gouvernance et ethique': [
    m("Module 1 : Les fondamentaux de la gouvernance", "Rôles du conseil, de la direction et des contrôleurs", "Principes et cadre OHADA", "Analyse de crises de gouvernance"),
    m("Module 2 : Faire fonctionner un conseil", "Composition et comités", "Préparer et conduire une séance", "Simulation de conseil d'administration"),
    m("Module 3 : Prévenir les risques", "Conflits d'intérêts et corruption", "Cartographie des risques de conformité", "Dispositifs d'alerte"),
    m("Module 4 : Faire vivre l'éthique", "Charte et code de conduite", "Dilemmes éthiques au quotidien", "Former et sensibiliser"),
    m("Projet final : votre charte de gouvernance", "Rédaction adaptée à une organisation", "Plan de mise en œuvre", "Présentation devant le groupe")
  ]
};
