import { ProgrammeModule } from './formationPrograms';

/**
 * Accompagnement sheets: what the cabinet does with a client (a mission, not a course).
 * Organizations come first, individuals are also supported. Keys: see axisKey in domainContent.ts.
 */

export interface AccompanimentSheet {
  description: string;
  objectives: string[];
  resultatsAttendus: string[];
  publicOrganisations: string[];
  publicParticuliers: string[];
  /** What the client prepares to start the mission */
  admission: string[];
  programme: ProgrammeModule[];
}

const p = (module: string, ...details: string[]): ProgrammeModule => ({ module, details });

export const ACCOMPANIMENT_DOMAINS: Record<string, string> = {
  'ing-financiere': "Vos décisions d'investissement, vos comptes et vos dossiers de financement méritent un regard expert. Le CICEXF intervient à vos côtés pour structurer vos projets, sécuriser vos chiffres et préparer vos échanges avec les banques, les investisseurs et les bailleurs. Nous travaillons avec les directions, les PME et les institutions, ainsi qu'avec les entrepreneurs et les porteurs de projets individuels. Vous obtenez des livrables concrets, directement utilisables pour décider et avancer.",
  'ing-qhse': "Un accident, un audit raté ou une non-conformité environnementale peuvent coûter très cher. Le CICEXF vous aide à maîtriser ces risques : diagnostic de vos pratiques, mise en place de systèmes de management, préparation aux certifications et conformité aux exigences des bailleurs. Nous intervenons auprès des entreprises, des projets et des institutions, et conseillons aussi les consultants et responsables qui gèrent ces sujets. Vous gagnez en sécurité, en conformité et en crédibilité.",
  'ing-formation': "Vos formations produisent-elles réellement les résultats attendus ? Le CICEXF conçoit et pilote avec vous des dispositifs de développement des compétences alignés sur votre stratégie : diagnostic des besoins, plan de formation, ingénierie pédagogique et mesure des effets. Nous accompagnons les directions RH, les ministères, les ONG et les centres de formation, ainsi que les formateurs indépendants qui structurent leur offre. Votre investissement en formation devient lisible, mesuré et utile.",
  'ing-informatique': "Vos systèmes d'information doivent soutenir votre activité, sans la freiner ni l'exposer. Le CICEXF audite vos infrastructures, sécurise vos données, développe les applications dont vous avez besoin et conduit votre transformation numérique. Nous intervenons auprès des entreprises, des administrations et des institutions, et conseillons aussi les entrepreneurs et les porteurs de projets numériques. Vous disposez de solutions fiables, documentées et maîtrisées par vos équipes.",
  'ing-territoriale': "Planifier une ville, renforcer une mairie, structurer une filière ou fiabiliser un cadastre demande une expertise de terrain. Le CICEXF accompagne les ministères, les collectivités et les organisations de producteurs, ainsi que les leaders locaux et les promoteurs individuels, de l'analyse jusqu'aux outils de décision. Nos missions associent les acteurs concernés et produisent des documents réellement exploitables par ceux qui doivent agir.",
  'ing-gestion-projets': "Un programme se juge à ses résultats. Le CICEXF renforce vos projets à chaque étape : conception, dispositif de suivi, évaluation indépendante et digitalisation des données. Nous appuyons les unités de gestion, les ministères, les ONG et les organisations internationales, ainsi que les consultants et porteurs de projets qui ont besoin d'un appui ponctuel. Vous disposez d'informations fiables pour piloter, rendre compte et convaincre vos partenaires.",
  'etudes-recherches': "Besoin de données fiables pour décider ? Le CICEXF réalise pour vous enquêtes, études de marché, études socio-économiques et sectorielles ainsi qu'analyses statistiques avancées. Nous prenons en charge la méthodologie, le terrain, l'analyse et la restitution pour les institutions, les bailleurs, les entreprises et les ONG, et nous appuyons aussi les chercheurs et entrepreneurs dans leurs travaux. Vous recevez des résultats vérifiables, clairs et utiles à la décision.",
  'conseil-strategique': "Croissance, réorganisation, succession, crise de gouvernance : certains moments exigent un regard extérieur. Le CICEXF accompagne les dirigeants et leurs équipes pour définir une stratégie, simplifier l'organisation, structurer les ressources humaines et conduire le changement. Nous intervenons auprès des entreprises, des institutions et des ONG, et conseillons aussi les dirigeants et entrepreneurs à titre individuel. Vos décisions gagnent en clarté et vos équipes avancent dans la même direction."
};

export const ACCOMPANIMENT_SHEETS: Record<string, AccompanimentSheet> = {
  // Ingénierie financière et de l'investissement
  'structuration et financement des projets': {
    description: "Votre projet est prêt à grandir, mais le financement n'est pas encore acquis ? Nos experts construisent avec vous le montage financier, l'étude de faisabilité et le dossier destiné aux banques, aux investisseurs et aux bailleurs. Nous vous aidons aussi à préparer les échanges et à répondre aux questions des financeurs. Vous gagnez un dossier solide et un interlocuteur à vos côtés jusqu'à la présentation.",
    objectives: ["Sécuriser la viabilité de votre projet avant de solliciter des fonds.", "Définir le montage financier le plus adapté à votre situation.", "Produire un dossier complet, conforme aux attentes des financeurs.", "Vous préparer aux discussions avec vos partenaires financiers."],
    resultatsAttendus: ["Une étude de faisabilité et un plan d'affaires remis et commentés.", "Un plan de financement validé avec vos responsables.", "Un dossier prêt à être déposé.", "Une liste ciblée de financeurs à approcher."],
    publicOrganisations: ["Entreprises, PME et directions du développement.", "Collectivités, institutions et ONG porteuses d'investissements."],
    publicParticuliers: ["Promoteurs et entrepreneurs individuels."],
    admission: ["La présentation de votre projet, même provisoire.", "Vos premières estimations de coûts et de ressources.", "Vos états financiers récents, si vous en disposez."],
    programme: [p("Phase 1 : Cadrage et analyse du projet", "Entretien avec les porteurs et revue des documents", "Identification des besoins de financement"), p("Phase 2 : Étude de faisabilité", "Analyse du marché, des coûts et des risques", "Construction des prévisions financières"), p("Phase 3 : Montage financier", "Comparaison des options de financement", "Élaboration du plan de financement"), p("Phase 4 : Dossier et mise en relation", "Rédaction du dossier et du résumé exécutif", "Préparation des rendez-vous avec les financeurs")]
  },
  'analyse financiere et modelisation': {
    description: "Avant un investissement, une cession ou une levée de fonds, vous avez besoin de chiffres sûrs. Nous réalisons le diagnostic financier de votre structure et construisons un modèle prévisionnel sur mesure, avec des scénarios adaptés à vos décisions. Vos équipes reçoivent un outil documenté, qu'elles savent ensuite utiliser sans nous.",
    objectives: ["Établir un diagnostic objectif de votre situation financière.", "Mettre à votre disposition un modèle fiable et adapté à votre activité.", "Comparer vos options à l'aide de scénarios chiffrés.", "Rendre vos équipes autonomes dans l'utilisation du modèle."],
    resultatsAttendus: ["Un rapport de diagnostic avec des recommandations.", "Un modèle financier personnalisé et documenté.", "Une note d'aide à la décision pour votre direction.", "Une session de prise en main avec vos équipes."],
    publicOrganisations: ["Directions générales et financières.", "Banques, institutions financières et fonds d'investissement."],
    publicParticuliers: ["Entrepreneurs et investisseurs individuels."],
    admission: ["Vos états financiers des trois dernières années, si disponibles.", "Vos hypothèses d'activité et vos projets d'investissement.", "Le nom d'un référent pour le suivi."],
    programme: [p("Phase 1 : Collecte et compréhension", "Revue des comptes et des hypothèses", "Échange sur les décisions à éclairer"), p("Phase 2 : Diagnostic financier", "Analyse de la rentabilité, de la structure et de la trésorerie", "Restitution des constats"), p("Phase 3 : Construction du modèle", "Modélisation sur mesure", "Tests de cohérence et scénarios"), p("Phase 4 : Remise et transfert", "Note de recommandations", "Prise en main du modèle par vos équipes")]
  },
  'gestion comptable fiscale et audit': {
    description: "Retards comptables, risques de redressement, contrôle interne insuffisant : ces fragilités finissent par coûter cher. Nous remettons votre fonction comptable en ordre selon le SYSCOHADA, sécurisons vos obligations fiscales et réalisons des audits assortis de recommandations. Vous retrouvez des comptes fiables et la tranquillité face aux contrôles.",
    objectives: ["Mettre à niveau votre organisation comptable.", "Identifier et réduire vos risques fiscaux et sociaux.", "Renforcer vos procédures de contrôle interne.", "Vérifier la fiabilité de vos comptes par un audit."],
    resultatsAttendus: ["Une comptabilité à jour et mieux organisée.", "Une cartographie de vos risques fiscaux.", "Un manuel de procédures adapté.", "Un rapport d'audit et un plan d'actions correctives."],
    publicOrganisations: ["Directions administratives et financières, PME.", "ONG et projets soumis à l'exigence des bailleurs."],
    publicParticuliers: ["Commerçants, professions libérales et entrepreneurs individuels."],
    admission: ["Vos pièces et états comptables récents.", "Vos dernières déclarations fiscales et sociales.", "Vos procédures existantes, même informelles."],
    programme: [p("Phase 1 : État des lieux", "Revue de l'organisation et des comptes", "Identification des zones de risque"), p("Phase 2 : Remise à niveau", "Régularisations et réorganisation comptable", "Mise en place du calendrier fiscal"), p("Phase 3 : Contrôle interne", "Rédaction et mise en place des procédures", "Sensibilisation des équipes"), p("Phase 4 : Audit et recommandations", "Vérification des comptes", "Rapport et plan d'actions")]
  },
  'entrepreneuriat et developpement de pme': {
    description: "Votre entreprise a du potentiel, mais le quotidien absorbe toute votre énergie ? Nous vous accompagnons comme un partenaire : diagnostic de l'activité, plan de développement, outils de gestion, recherche de marchés et de financements. Nous suivons la mise en œuvre avec vous, pour que le plan devienne des résultats.",
    objectives: ["Identifier ce qui freine votre croissance.", "Définir un plan de développement réaliste.", "Installer des outils de gestion adaptés à votre taille.", "Préparer votre entreprise aux marchés et aux financements."],
    resultatsAttendus: ["Un diagnostic clair de votre entreprise.", "Un plan de développement priorisé.", "Des outils de gestion en place.", "Un suivi régulier des actions engagées."],
    publicOrganisations: ["PME, coopératives et groupements.", "Incubateurs et programmes d'appui aux entreprises."],
    publicParticuliers: ["Entrepreneurs, artisans et commerçants."],
    admission: ["La présentation de votre activité.", "Vos chiffres disponibles : ventes, charges, dettes.", "Vos priorités pour les prochains mois."],
    programme: [p("Phase 1 : Diagnostic d'entreprise", "Visite et entretien avec le dirigeant", "Analyse commerciale et financière"), p("Phase 2 : Plan de développement", "Choix des priorités", "Plan d'actions chiffré"), p("Phase 3 : Mise en place", "Outils de gestion et de vente", "Préparation du dossier de financement"), p("Phase 4 : Suivi", "Points réguliers avec le dirigeant", "Ajustements selon les résultats")]
  },

  // Ingénierie QHSE
  'systemes de management integre smi': {
    description: "Vous visez la certification ISO 9001, ISO 14001 ou ISO 45001, ou vous voulez un système qui fonctionne vraiment ? Nous évaluons vos écarts, construisons avec vos équipes un système simple et unique, réalisons un audit à blanc et vous accompagnons jusqu'à l'audit de certification. Le résultat : moins de paperasse et plus de maîtrise.",
    objectives: ["Mesurer votre écart par rapport aux normes visées.", "Construire un système intégré adapté à votre réalité.", "Impliquer vos équipes et vos pilotes de processus.", "Sécuriser votre passage devant l'organisme certificateur."],
    resultatsAttendus: ["Un rapport d'écarts et une feuille de route.", "Une documentation unique, simple et utilisée.", "Des auditeurs internes opérationnels.", "Un audit à blanc réalisé et ses écarts traités."],
    publicOrganisations: ["Industries, entreprises de services et de BTP.", "Directions générales et responsables QHSE."],
    publicParticuliers: ["Responsables et consultants QHSE ayant besoin d'un appui expert."],
    admission: ["Le périmètre et la norme visés.", "Vos procédures et certificats existants.", "Un responsable désigné pour la démarche."],
    programme: [p("Phase 1 : Diagnostic d'écarts", "Visite des sites et entretiens", "Rapport d'écarts"), p("Phase 2 : Conception du système", "Cartographie des processus", "Documentation et indicateurs"), p("Phase 3 : Déploiement", "Appui aux pilotes de processus", "Formation des auditeurs internes"), p("Phase 4 : Préparation à la certification", "Audit à blanc", "Traitement des écarts et revue de direction")]
  },
  'hygiene et securite au travail sst': {
    description: "Vos collaborateurs travaillent-ils en sécurité ? Nos experts se rendent sur vos sites pour évaluer les risques poste par poste, rédiger votre Document Unique et établir un plan de prévention réaliste. Nous aidons ensuite vos responsables à le faire appliquer. Vous protégez vos équipes et vous réduisez vos risques humains, juridiques et financiers.",
    objectives: ["Évaluer les risques réels sur vos postes et vos sites.", "Mettre votre organisation en conformité.", "Prioriser vos actions de prévention.", "Renforcer la culture de sécurité de vos équipes."],
    resultatsAttendus: ["Un Document Unique établi pour vos activités.", "Un plan de prévention chiffré et priorisé.", "Des consignes et une organisation d'urgence clarifiées.", "Des responsables sensibilisés et mobilisés."],
    publicOrganisations: ["Entreprises du BTP, de l'industrie, des mines et de la logistique.", "Responsables HSE et comités de santé et sécurité au travail."],
    publicParticuliers: ["Artisans, chefs de chantier et petits exploitants."],
    admission: ["La liste de vos sites, postes et effectifs.", "L'historique de vos accidents et incidents.", "L'accès à vos sites pour les visites."],
    programme: [p("Phase 1 : Visites de terrain", "Observation des postes", "Entretiens avec les travailleurs"), p("Phase 2 : Évaluation des risques", "Cotation et hiérarchisation", "Rédaction du Document Unique"), p("Phase 3 : Plan de prévention", "Mesures techniques et organisationnelles", "Budget et responsables"), p("Phase 4 : Mise en œuvre", "Sensibilisation sur site", "Suivi et indicateurs")]
  },
  'environnement et developpement durable': {
    description: "Autorités, financeurs et clients attendent de vous des preuves. Nous réalisons vos études d'impact environnemental et social, votre bilan carbone et vos plans de gestion, et structurons votre démarche RSE. Vous obtenez des documents solides pour avancer dans vos autorisations et vos financements, et des actions réellement applicables.",
    objectives: ["Évaluer les impacts de vos activités ou de vos projets.", "Répondre aux exigences réglementaires et à celles des bailleurs.", "Mesurer et réduire vos émissions.", "Bâtir une démarche RSE crédible."],
    resultatsAttendus: ["Une étude d'impact ou un diagnostic environnemental.", "Un plan de gestion environnementale et sociale.", "Un bilan carbone et un plan de réduction.", "Une stratégie RSE prête à être présentée."],
    publicOrganisations: ["Entreprises industrielles, énergétiques et minières.", "Promoteurs de projets, institutions et collectivités."],
    publicParticuliers: ["Promoteurs immobiliers et entrepreneurs individuels."],
    admission: ["La description de votre projet ou de votre activité.", "Vos plans, autorisations et études disponibles.", "La localisation des sites concernés."],
    programme: [p("Phase 1 : Cadrage", "Analyse du projet et de la réglementation", "Définition du périmètre"), p("Phase 2 : Études de terrain", "Collecte de données et consultations", "Évaluation des impacts"), p("Phase 3 : Mesures et plans", "Mesures d'atténuation", "Plan de gestion et bilan carbone"), p("Phase 4 : Validation", "Rapport final", "Appui lors des échanges avec les autorités")]
  },
  'securite sanitaire et agroalimentaire': {
    description: "Un seul incident sanitaire peut ruiner une réputation. Nous auditons vos pratiques, mettons en place votre plan HACCP et votre traçabilité, et vous préparons aux inspections comme aux exigences de vos clients et des marchés à l'export. Vos équipes appliquent des règles simples, et vous gagnez la confiance de vos acheteurs.",
    objectives: ["Évaluer vos pratiques d'hygiène et de fabrication.", "Mettre en place un plan HACCP adapté à vos produits.", "Organiser une traçabilité fiable.", "Vous préparer aux inspections et aux audits clients."],
    resultatsAttendus: ["Un rapport d'audit d'hygiène.", "Un plan HACCP documenté pour vos produits.", "Un système de traçabilité en place.", "Un personnel sensibilisé sur site."],
    publicOrganisations: ["Industries agroalimentaires, hôtels et restaurants.", "Coopératives et exportateurs."],
    publicParticuliers: ["Restaurateurs, traiteurs et petits transformateurs."],
    admission: ["La liste de vos produits et procédés.", "Le plan de vos locaux.", "Vos fiches et contrôles existants."],
    programme: [p("Phase 1 : Audit d'hygiène", "Visite des locaux", "Revue des pratiques"), p("Phase 2 : Analyse des dangers", "Diagramme de fabrication", "Points critiques de maîtrise"), p("Phase 3 : Mise en place", "Procédures et enregistrements", "Traçabilité et sensibilisation"), p("Phase 4 : Vérification", "Audit interne", "Préparation aux inspections")]
  },
  'sauvegarde environnementale et sociale ses': {
    description: "Votre projet est soumis aux exigences des bailleurs ? Nous élaborons et appliquons avec vous les instruments de sauvegarde, organisons la consultation des communautés et mettons en place le suivi. Vous réduisez les risques de blocage et vous démontrez la conformité de votre projet à chaque mission de supervision.",
    objectives: ["Analyser les risques de votre projet et ses obligations.", "Produire les instruments de sauvegarde requis.", "Organiser la consultation et la gestion des plaintes.", "Assurer le suivi de la conformité."],
    resultatsAttendus: ["Des instruments de sauvegarde élaborés.", "Un plan de mobilisation des parties prenantes.", "Un mécanisme de gestion des plaintes opérationnel.", "Des rapports de suivi réguliers."],
    publicOrganisations: ["Unités de gestion de projets, ministères et agences d'exécution.", "Entreprises et bureaux d'études sur des projets financés."],
    publicParticuliers: ["Spécialistes et consultants en sauvegarde qui recherchent un appui."],
    admission: ["Le document de projet et l'accord de financement.", "Les études déjà réalisées.", "Les sites et les communautés concernés."],
    programme: [p("Phase 1 : Revue du projet", "Analyse des exigences applicables", "Catégorisation des risques"), p("Phase 2 : Élaboration des instruments", "Études et consultations", "Rédaction et validation"), p("Phase 3 : Mise en œuvre", "Appui aux équipes et aux entreprises", "Gestion des plaintes"), p("Phase 4 : Suivi", "Visites de terrain", "Rapports de conformité")]
  },

  // Ingénierie de formation et de renforcement de capacités
  'analyse et planification des dispositifs de formation': {
    description: "Vous formez beaucoup, mais formez-vous juste ? Nos experts analysent vos métiers, identifient les écarts de compétences et élaborent avec vous un plan de formation pluriannuel, chiffré et priorisé. Votre budget de formation est ainsi orienté vers ce qui compte vraiment pour votre performance.",
    objectives: ["Identifier les besoins réels par service et par métier.", "Mettre en place un référentiel de compétences.", "Orienter le budget vers vos priorités.", "Doter vos RH d'un plan facile à piloter."],
    resultatsAttendus: ["Un rapport de diagnostic des besoins.", "Un référentiel de compétences.", "Un plan de formation pluriannuel chiffré.", "Des tableaux de suivi remis à vos équipes."],
    publicOrganisations: ["Directions des ressources humaines.", "Ministères, collectivités, entreprises et ONG."],
    publicParticuliers: ["Formateurs et consultants qui structurent leur offre."],
    admission: ["Votre organigramme et vos fiches de postes.", "Vos plans et bilans de formation précédents.", "Vos orientations stratégiques."],
    programme: [p("Phase 1 : Cadrage", "Échange avec la direction", "Choix de l'échantillon et des outils"), p("Phase 2 : Recueil des besoins", "Entretiens et questionnaires", "Analyse des écarts"), p("Phase 3 : Plan de formation", "Priorisation et chiffrage", "Calendrier"), p("Phase 4 : Validation et remise", "Restitution à la direction", "Prise en main par les RH")]
  },
  'conception pedagogique et innovation educative': {
    description: "Vous avez un savoir à transmettre à grande échelle ? Nous concevons pour vous des programmes, des supports et des modules e-learning sur mesure, à partir de vos contenus et de vos experts. Vous obtenez un dispositif attractif, prêt à déployer, et qui reste votre propriété à l'issue de la mission.",
    objectives: ["Transformer vos contenus en parcours d'apprentissage.", "Créer des supports attractifs à votre image.", "Numériser vos formations clés.", "Rendre vos équipes capables de mettre à jour les contenus."],
    resultatsAttendus: ["Un curriculum détaillé par compétences.", "Des supports formateur et apprenant.", "Des modules en ligne livrés.", "Un guide de mise à jour."],
    publicOrganisations: ["Centres de formation, écoles et universités.", "Entreprises, académies internes et projets de développement."],
    publicParticuliers: ["Experts et formateurs qui veulent créer leur propre formation."],
    admission: ["Vos contenus existants.", "Le profil des apprenants visés.", "Un expert métier disponible pour valider."],
    programme: [p("Phase 1 : Analyse", "Publics, objectifs et contraintes", "Choix des modalités"), p("Phase 2 : Scénarisation", "Curriculum et storyboards", "Validation par vos experts"), p("Phase 3 : Production", "Supports et modules numériques", "Tests auprès d'un groupe pilote"), p("Phase 4 : Livraison", "Mise en ligne", "Transfert à vos équipes")]
  },
  'mise en oeuvre des formations': {
    description: "Une session de formation mobilise du temps, des personnes et de la logistique : confiez-nous-en la gestion. Nous organisons et animons vos formations, coordonnons les intervenants et assurons le suivi complet, à Abidjan, à l'intérieur du pays ou à distance. Vous gardez la décision, nous nous occupons de l'exécution.",
    objectives: ["Décharger vos équipes de l'organisation des sessions.", "Mobiliser des intervenants adaptés à vos thèmes.", "Assurer la qualité de chaque session.", "Tracer chaque action pour vos rapports."],
    resultatsAttendus: ["Des sessions réalisées selon le calendrier convenu.", "Des listes de présence et des évaluations complètes.", "Un rapport de chaque session.", "Un bilan global avec des pistes d'amélioration."],
    publicOrganisations: ["Responsables de formation et chefs de projet.", "Projets de développement ayant un volet de renforcement de capacités."],
    publicParticuliers: ["Associations et groupes professionnels qui souhaitent organiser une session."],
    admission: ["Vos thèmes, vos effectifs et vos dates.", "Les lieux envisagés.", "Votre budget disponible."],
    programme: [p("Phase 1 : Planification", "Calendrier et logistique", "Choix des intervenants"), p("Phase 2 : Préparation", "Adaptation des contenus", "Convocations et supports"), p("Phase 3 : Déroulement", "Animation et coordination", "Évaluation de chaque session"), p("Phase 4 : Clôture", "Rapports", "Bilan avec vos responsables")]
  },
  'evaluation et developpement professionnel': {
    description: "Vos formations ont-elles changé les pratiques ? Nous évaluons objectivement l'effet de vos actions et de vos programmes, puis nous en tirons des recommandations claires et un dispositif d'évaluation réutilisable. Vous disposez enfin de preuves à présenter à votre direction ou à vos bailleurs.",
    objectives: ["Mesurer l'effet réel de vos formations.", "Identifier ce qui fonctionne et ce qui doit changer.", "Doter votre organisation d'outils d'évaluation durables.", "Mieux accompagner le développement de vos collaborateurs."],
    resultatsAttendus: ["Un rapport d'évaluation indépendant.", "Des recommandations priorisées.", "Une boîte à outils d'évaluation.", "Des parcours de développement proposés."],
    publicOrganisations: ["Directions RH et responsables de programmes.", "Bailleurs et organismes de formation."],
    publicParticuliers: ["Professionnels qui souhaitent un bilan et un plan de carrière."],
    admission: ["La liste des formations à évaluer.", "Les contacts des participants et de leurs responsables.", "Les rapports disponibles."],
    programme: [p("Phase 1 : Cadrage", "Questions d'évaluation", "Outils et échantillon"), p("Phase 2 : Collecte", "Questionnaires et entretiens", "Observation sur le terrain"), p("Phase 3 : Analyse", "Résultats par niveau d'évaluation", "Constats et recommandations"), p("Phase 4 : Restitution", "Présentation à la direction", "Remise des outils")]
  },

  // Ingénierie informatique et systèmes de réseaux
  'infrastructure et reseaux': {
    description: "Pannes à répétition, réseau lent, sauvegardes incertaines ? Nous auditons votre infrastructure, concevons l'architecture adaptée à vos sites et à vos contraintes, supervisons le déploiement et documentons l'ensemble. Vous gagnez en disponibilité, et vos équipes reprennent la main sur leur système.",
    objectives: ["Évaluer l'état réel de votre infrastructure.", "Concevoir une architecture adaptée à vos besoins.", "Assurer la continuité de vos services.", "Rendre vos équipes autonomes pour l'exploitation."],
    resultatsAttendus: ["Un rapport d'audit technique.", "Un schéma d'architecture et un budget.", "Un plan de sauvegarde et de reprise.", "Une documentation d'exploitation."],
    publicOrganisations: ["Directions des systèmes d'information.", "Entreprises multisites, administrations, écoles et hôpitaux."],
    publicParticuliers: ["Entrepreneurs et professions libérales qui équipent leur structure."],
    admission: ["La liste de vos sites et de vos équipements.", "Vos schémas et vos contrats existants.", "Vos incidents récents."],
    programme: [p("Phase 1 : Audit technique", "Inventaire et tests", "Identification des points faibles"), p("Phase 2 : Conception", "Architecture cible", "Budget et plan de migration"), p("Phase 3 : Déploiement", "Installation et supervision", "Tests de bascule"), p("Phase 4 : Transfert", "Documentation", "Formation de vos administrateurs")]
  },
  'developpement logiciel et solutions applicatives': {
    description: "Vous avez besoin d'un outil qui n'existe pas encore ou qui ne convient plus ? Nous recueillons vos besoins, concevons et développons votre application web ou métier, puis assurons sa mise en service et la formation de vos utilisateurs. Vous disposez d'une solution adaptée à vos processus, pas d'un compromis.",
    objectives: ["Traduire vos besoins en cahier des charges clair.", "Développer une application adaptée et sécurisée.", "Connecter la solution à vos outils existants.", "Garantir une bonne adoption par les utilisateurs."],
    resultatsAttendus: ["Un cahier des charges validé.", "Une application livrée et testée.", "Une documentation technique et un guide utilisateur.", "Des utilisateurs formés à la mise en service."],
    publicOrganisations: ["Directions métiers et informatiques.", "PME, institutions publiques et ONG."],
    publicParticuliers: ["Entrepreneurs qui veulent lancer une plateforme ou une application."],
    admission: ["La description de votre besoin.", "Des exemples de vos documents et processus actuels.", "Un référent disponible pour les validations."],
    programme: [p("Phase 1 : Expression des besoins", "Ateliers avec les utilisateurs", "Cahier des charges"), p("Phase 2 : Conception", "Maquettes et validation", "Architecture technique"), p("Phase 3 : Développement", "Livraisons par étapes", "Tests avec les utilisateurs"), p("Phase 4 : Mise en service", "Déploiement", "Formation et assistance au démarrage")]
  },
  'cybersecurite et gouvernance it': {
    description: "Savez-vous où vous êtes vulnérable avant qu'un attaquant ne le découvre ? Nous réalisons vos audits de sécurité et, avec votre autorisation écrite, vos tests d'intrusion. Nous établissons un plan de correction, formalisons votre politique de sécurité et vous accompagnons vers la conformité à l'ISO 27001.",
    objectives: ["Identifier vos vulnérabilités techniques et humaines.", "Prioriser les corrections selon les risques.", "Formaliser votre gouvernance de la sécurité.", "Préparer votre organisation à gérer un incident."],
    resultatsAttendus: ["Un rapport d'audit confidentiel.", "Un plan de correction priorisé.", "Une politique de sécurité adoptée.", "Un plan de réponse aux incidents."],
    publicOrganisations: ["Banques, assurances, télécoms et santé.", "Administrations et PME dépendantes du numérique."],
    publicParticuliers: ["Dirigeants et professions libérales qui protègent leurs données."],
    admission: ["Le périmètre à évaluer.", "Une autorisation écrite pour les tests techniques.", "Vos politiques et incidents connus."],
    programme: [p("Phase 1 : Cadrage et autorisation", "Définition du périmètre", "Accord de confidentialité"), p("Phase 2 : Audit", "Tests techniques autorisés", "Revue de l'organisation"), p("Phase 3 : Plan de sécurité", "Priorisation des corrections", "Rédaction des politiques"), p("Phase 4 : Accompagnement", "Sensibilisation du personnel", "Préparation à l'ISO 27001")]
  },
  'transformation numerique': {
    description: "Numériser sans méthode coûte cher et déçoit. Nous mesurons votre maturité numérique, identifions les chantiers les plus rentables, construisons votre feuille de route et accompagnons leur mise en œuvre, en veillant à l'adhésion de vos équipes. Chaque investissement numérique répond ainsi à un besoin réel.",
    objectives: ["Mesurer votre maturité numérique.", "Identifier les chantiers à plus forte valeur.", "Choisir les bons outils et les bons partenaires.", "Accompagner vos équipes dans le changement."],
    resultatsAttendus: ["Un diagnostic de maturité.", "Une feuille de route chiffrée.", "Des processus prioritaires dématérialisés.", "Des tableaux de bord pour la direction."],
    publicOrganisations: ["Directions générales et administrations.", "Entreprises de tous secteurs."],
    publicParticuliers: ["Dirigeants de petites structures et indépendants."],
    admission: ["La liste de vos outils actuels.", "Vos processus les plus lourds.", "Vos objectifs et votre budget."],
    programme: [p("Phase 1 : Diagnostic", "Entretiens et analyse des outils", "Mesure de la maturité"), p("Phase 2 : Feuille de route", "Priorisation des chantiers", "Budget et calendrier"), p("Phase 3 : Mise en œuvre", "Pilotage des projets", "Sélection des solutions"), p("Phase 4 : Adoption", "Accompagnement des utilisateurs", "Mesure des gains")]
  },

  // Ingénierie de développement territorial
  'amenagement du territoire et urbanisme': {
    description: "Votre territoire grandit vite : il faut anticiper plutôt que subir. Nos experts réalisent le diagnostic, élaborent avec vous les schémas directeurs et les plans d'urbanisme, organisent la concertation et programment les investissements. Vous disposez de documents solides pour décider et pour mobiliser vos partenaires.",
    objectives: ["Disposer d'un diagnostic fiable de votre territoire.", "Élaborer des documents de planification concertés.", "Associer les populations et les acteurs.", "Programmer les investissements prioritaires."],
    resultatsAttendus: ["Un rapport de diagnostic et des cartes.", "Un schéma ou un plan d'urbanisme.", "Des comptes rendus de concertation.", "Un programme d'investissements chiffré."],
    publicOrganisations: ["Ministères, districts, régions et communes.", "Agences d'aménagement et bailleurs."],
    publicParticuliers: ["Promoteurs et propriétaires fonciers porteurs de projets."],
    admission: ["Les limites de la zone concernée.", "Les plans et les études existants.", "Un référent au sein des services techniques."],
    programme: [p("Phase 1 : Diagnostic", "Collecte de données et visites", "Cartographie de l'existant"), p("Phase 2 : Concertation", "Ateliers avec les acteurs", "Partage des enjeux"), p("Phase 3 : Planification", "Scénarios d'aménagement", "Élaboration du document"), p("Phase 4 : Programmation", "Investissements prioritaires", "Restitution et validation")]
  },
  'decentralisation et gouvernance locale': {
    description: "Votre collectivité doit faire mieux avec des ressources limitées ? Nous appuyons vos élus et vos services : organisation, plan de développement local, recensement et mobilisation des recettes propres, transparence budgétaire. Nos solutions tiennent compte des réalités de votre commune ou de votre région, et produisent des résultats visibles pour les habitants.",
    objectives: ["Renforcer l'organisation de vos services.", "Élaborer un plan de développement partagé.", "Accroître et sécuriser vos recettes propres.", "Améliorer la transparence envers les citoyens."],
    resultatsAttendus: ["Un diagnostic institutionnel.", "Un plan de développement local adopté.", "Un fichier des contribuables et un plan de recouvrement.", "Des outils de suivi budgétaire."],
    publicOrganisations: ["Mairies, conseils régionaux et districts.", "Ministères et programmes d'appui à la décentralisation."],
    publicParticuliers: ["Élus et candidats qui souhaitent un appui personnalisé."],
    admission: ["Vos budgets et comptes administratifs récents.", "Votre organigramme.", "Vos plans existants."],
    programme: [p("Phase 1 : Diagnostic institutionnel", "Entretiens avec les élus et les services", "Analyse des finances locales"), p("Phase 2 : Planification participative", "Assemblées avec les habitants", "Plan de développement"), p("Phase 3 : Mobilisation des recettes", "Recensement", "Plan de recouvrement"), p("Phase 4 : Suivi", "Appui aux services", "Outils de redevabilité")]
  },
  'developpement rural et filieres agricoles': {
    description: "Une filière mieux organisée rapporte davantage à chacun de ses acteurs. Nous analysons votre chaîne de valeur, structurons vos coopératives, préparons vos projets d'infrastructures rurales et d'agro-pôles, et mettons en relation producteurs et acheteurs. Les résultats se voient au niveau des revenus, de la qualité et de l'accès aux marchés.",
    objectives: ["Comprendre les blocages de votre filière.", "Renforcer la gouvernance de vos coopératives.", "Améliorer l'accès aux marchés et au crédit.", "Préparer des projets ruraux finançables."],
    resultatsAttendus: ["Une étude de chaîne de valeur.", "Un plan de structuration de la coopérative.", "Des relations commerciales formalisées.", "Des projets documentés pour les financeurs."],
    publicOrganisations: ["Coopératives, faîtières et agro-industriels.", "Ministères, projets ruraux et bailleurs."],
    publicParticuliers: ["Exploitants et jeunes agripreneurs porteurs de projets."],
    admission: ["La filière et la zone concernées.", "Vos données de production et de vente.", "Les statuts de votre organisation, s'il y a lieu."],
    programme: [p("Phase 1 : Analyse de la filière", "Enquêtes auprès des acteurs", "Cartographie de la chaîne de valeur"), p("Phase 2 : Structuration", "Gouvernance des coopératives", "Outils de gestion"), p("Phase 3 : Marchés et financement", "Mise en relation commerciale", "Dossiers de crédit et de projet"), p("Phase 4 : Suivi", "Appui sur le terrain", "Mesure des résultats")]
  },
  'sig et observation territoriale': {
    description: "Vos décisions reposent-elles sur des cartes à jour ? Nous mettons en place votre système d'information géographique, numérisons votre cadastre, réalisons des levés par drone et exploitons des images satellites pour suivre l'évolution de votre territoire. Vous voyez clairement ce qui se passe, et vous décidez plus vite.",
    objectives: ["Centraliser vos données géographiques.", "Numériser vos plans et votre cadastre.", "Produire des cartes et des images à jour.", "Rendre vos équipes autonomes."],
    resultatsAttendus: ["Une base de données géographiques.", "Un cadastre ou un plan numérisé.", "Des cartes et des orthophotos livrées.", "Un portail ou des outils de consultation."],
    publicOrganisations: ["Services fonciers, cadastraux et techniques.", "Projets d'infrastructure, d'agriculture et d'environnement."],
    publicParticuliers: ["Propriétaires, exploitants et promoteurs qui ont besoin de cartes."],
    admission: ["Les limites de la zone à couvrir.", "Vos plans et données existants.", "Les autorisations de survol nécessaires, que nous vous aidons à identifier."],
    programme: [p("Phase 1 : Cadrage", "Besoins et sources de données", "Définition de la base"), p("Phase 2 : Acquisition", "Collecte de terrain et levés par drone", "Images satellites"), p("Phase 3 : Traitement", "Numérisation et contrôle", "Production cartographique"), p("Phase 4 : Déploiement", "Mise à disposition", "Formation des utilisateurs")]
  },

  // Gestion, suivi et évaluation des projets et programmes
  'conception et planification de projets': {
    description: "Un appel à propositions à préparer, un programme à lancer ? Nous animons vos ateliers de conception, construisons avec vous la théorie du changement et le cadre logique, chiffrons le budget et rédigeons le document de projet. Vous présentez un projet cohérent, solide et aligné sur les attentes de vos bailleurs.",
    objectives: ["Clarifier le problème et les résultats visés.", "Aligner votre projet sur les exigences du bailleur.", "Chiffrer un budget réaliste.", "Associer vos équipes et vos partenaires."],
    resultatsAttendus: ["Une théorie du changement et un cadre logique.", "Un budget et un chronogramme.", "Un document de projet ou une proposition complète.", "Une équipe alignée sur le projet."],
    publicOrganisations: ["ONG et organisations internationales.", "Ministères, collectivités et entreprises."],
    publicParticuliers: ["Porteurs d'initiatives et consultants qui répondent à un appel."],
    admission: ["L'appel à propositions ou le besoin à couvrir.", "Vos études et données disponibles.", "Vos contraintes de calendrier."],
    programme: [p("Phase 1 : Analyse", "Lecture de l'appel et du contexte", "Parties prenantes"), p("Phase 2 : Ateliers de conception", "Théorie du changement", "Cadre logique"), p("Phase 3 : Rédaction", "Budget et chronogramme", "Document de projet"), p("Phase 4 : Finalisation", "Relecture critique", "Préparation au dépôt")]
  },
  'suivi operationnel et financier': {
    description: "Vous manquez de visibilité sur l'avancement réel de vos projets ? Nous installons un dispositif de pilotage simple : indicateurs, tableaux de bord, suivi budgétaire et rapports. Nous pouvons aussi renforcer temporairement votre équipe. Vos responsables voient les écarts à temps, et vos rapports aux bailleurs deviennent plus fiables.",
    objectives: ["Rendre visible l'avancement physique et financier.", "Détecter tôt les retards et les dépassements.", "Fiabiliser vos rapports.", "Renforcer les routines de votre équipe."],
    resultatsAttendus: ["Un plan de suivi opérationnel.", "Des tableaux de bord en service.", "Des modèles de rapports.", "Une meilleure consommation des budgets."],
    publicOrganisations: ["Unités de gestion de projets et coordinations.", "ONG, ministères et entreprises."],
    publicParticuliers: ["Chefs de projet et consultants qui ont besoin d'un appui."],
    admission: ["Votre document de projet et votre budget.", "Vos rapports récents.", "Vos outils de suivi actuels."],
    programme: [p("Phase 1 : Diagnostic du pilotage", "Revue des outils", "Identification des écarts"), p("Phase 2 : Conception", "Indicateurs et circuits d'information", "Tableaux de bord"), p("Phase 3 : Mise en service", "Saisie des données", "Accompagnement de l'équipe"), p("Phase 4 : Stabilisation", "Comités de suivi", "Ajustements")]
  },
  'evaluation d impact': {
    description: "Vous devez démontrer les résultats de votre programme à vos bailleurs ou à vos autorités ? Nous réalisons des évaluations indépendantes à mi-parcours ou finales, selon les critères du CAD de l'OCDE, avec une méthode adaptée à vos données et à votre budget. Vous obtenez des constats crédibles et des recommandations exploitables.",
    objectives: ["Mesurer objectivement les résultats de votre programme.", "Apprécier sa pertinence, son efficacité et sa durabilité.", "Tirer des leçons pour la suite.", "Répondre aux exigences de vos partenaires."],
    resultatsAttendus: ["Un rapport initial et une matrice d'évaluation.", "Des données collectées et analysées.", "Un rapport d'évaluation final.", "Un atelier de restitution."],
    publicOrganisations: ["Bailleurs, organisations internationales et ONG.", "Ministères et agences d'exécution."],
    publicParticuliers: ["Chercheurs et consultants qui recherchent un appui méthodologique."],
    admission: ["Les termes de référence ou le besoin d'évaluation.", "Le document de programme et le cadre de résultats.", "Les données de suivi disponibles."],
    programme: [p("Phase 1 : Cadrage", "Questions d'évaluation", "Rapport initial"), p("Phase 2 : Collecte", "Enquêtes et entretiens", "Visites de terrain"), p("Phase 3 : Analyse", "Triangulation des données", "Constats et conclusions"), p("Phase 4 : Restitution", "Rapport final", "Atelier avec les parties prenantes")]
  },
  'systemes d information pour le suivi evaluation sise': {
    description: "Vos données de terrain arrivent tard, incomplètes ou dispersées ? Nous concevons et déployons votre système complet : formulaires KoboToolbox, base centralisée, contrôles de qualité et tableaux de bord Power BI. Vos décideurs consultent des chiffres à jour, et vos équipes passent moins de temps à compiler et plus de temps à agir.",
    objectives: ["Digitaliser votre collecte de terrain.", "Centraliser et fiabiliser vos données.", "Automatiser vos tableaux de bord.", "Rendre vos équipes autonomes."],
    resultatsAttendus: ["Des formulaires numériques déployés.", "Une base de données centralisée.", "Des tableaux de bord en service.", "Une documentation et une équipe formée."],
    publicOrganisations: ["Unités de gestion de projets et programmes.", "ONG, organisations internationales et directions statistiques."],
    publicParticuliers: ["Chargés de suivi-évaluation qui veulent un appui technique."],
    admission: ["Votre cadre de résultats et vos indicateurs.", "Vos formulaires actuels.", "La liste des zones et des collecteurs."],
    programme: [p("Phase 1 : Conception", "Cartographie des indicateurs", "Architecture du système"), p("Phase 2 : Développement", "Formulaires et base de données", "Tableaux de bord"), p("Phase 3 : Déploiement", "Tests sur le terrain", "Formation des collecteurs"), p("Phase 4 : Transfert", "Documentation", "Assistance au démarrage")]
  },

  // Études, enquêtes et recherches socio-économiques
  'enquetes statistiques et sondages': {
    description: "Confiez-nous votre enquête de bout en bout. Nous définissons la méthode et l'échantillon, recrutons et formons les enquêteurs, assurons la collecte mobile et le contrôle de qualité, puis livrons la base de données et le rapport d'analyse. Vous recevez des résultats fiables, et vous gardez du temps pour décider.",
    objectives: ["Obtenir des données représentatives et de qualité.", "Vous décharger de la logistique du terrain.", "Contrôler la qualité en temps réel.", "Livrer des résultats directement utilisables."],
    resultatsAttendus: ["Un protocole et des questionnaires validés.", "Une collecte supervisée.", "Une base de données apurée.", "Un rapport et une présentation des résultats."],
    publicOrganisations: ["Institutions, ministères et bailleurs.", "Entreprises et ONG."],
    publicParticuliers: ["Chercheurs et étudiants qui ont besoin d'un appui de terrain."],
    admission: ["Vos objectifs et vos questions clés.", "La population et la zone visées.", "Votre calendrier et votre budget."],
    programme: [p("Phase 1 : Conception", "Méthodologie et échantillon", "Questionnaires"), p("Phase 2 : Préparation du terrain", "Formation des enquêteurs", "Enquête pilote"), p("Phase 3 : Collecte", "Supervision", "Contrôle de qualité"), p("Phase 4 : Analyse", "Apurement et traitement", "Rapport et restitution")]
  },
  'etudes socio economiques': {
    description: "Avant de lancer un programme, un produit ou un investissement, il faut comprendre les réalités du terrain. Nous réalisons vos études de référence, analyses de vulnérabilité et études de marché, en combinant données statistiques et enquêtes qualitatives. Vous disposez d'une vision claire pour cibler vos actions et limiter vos risques.",
    objectives: ["Comprendre vos publics cibles et leurs besoins.", "Établir une situation de référence.", "Évaluer le potentiel de votre marché.", "Orienter vos décisions avec des recommandations."],
    resultatsAttendus: ["Un rapport d'étude complet.", "Une base de données et des annexes.", "Des profils des groupes cibles.", "Un atelier de présentation."],
    publicOrganisations: ["Agences de développement, ONG et ministères sociaux.", "Entreprises et collectivités."],
    publicParticuliers: ["Entrepreneurs qui ont besoin d'une étude de marché."],
    admission: ["La question à laquelle répondre.", "La zone et les publics concernés.", "Les données déjà disponibles."],
    programme: [p("Phase 1 : Cadrage", "Questions de recherche", "Revue documentaire"), p("Phase 2 : Terrain", "Enquêtes", "Entretiens et groupes de discussion"), p("Phase 3 : Analyse", "Croisement des données", "Constats"), p("Phase 4 : Livraison", "Rapport", "Présentation et recommandations")]
  },
  'econometrie et analyse de donnees': {
    description: "Vous disposez de données, mais pas encore de réponses ? Nos analystes construisent pour vous les modèles économétriques et statistiques adaptés à votre question : facteurs explicatifs, prévisions, risque, effets d'une politique. Nous livrons des résultats clairs et reproductibles, sous Stata, R ou Python.",
    objectives: ["Exploiter pleinement vos données.", "Identifier les facteurs qui expliquent vos résultats.", "Produire des prévisions argumentées.", "Rendre les conclusions compréhensibles pour vos décideurs."],
    resultatsAttendus: ["Une base de données préparée.", "Des modèles documentés et testés.", "Un rapport d'analyse clair.", "Des scripts reproductibles remis."],
    publicOrganisations: ["Banques et institutions financières.", "Ministères, instituts de recherche et grandes entreprises."],
    publicParticuliers: ["Doctorants et chercheurs qui ont besoin d'un appui statistique."],
    admission: ["Vos données, anonymisées si nécessaire.", "La question à traiter.", "Les délais attendus."],
    programme: [p("Phase 1 : Cadrage", "Question et hypothèses", "Revue des données"), p("Phase 2 : Préparation", "Nettoyage", "Analyses descriptives"), p("Phase 3 : Modélisation", "Estimation", "Tests de robustesse"), p("Phase 4 : Restitution", "Rapport", "Présentation aux décideurs")]
  },
  'etudes sectorielles specialisees': {
    description: "Entrer sur un marché, réformer un secteur, investir : ces décisions exigent une connaissance fine du terrain. Nous réalisons vos diagnostics sectoriels, notamment dans l'énergie et l'éducation : acteurs, réglementation, tendances, opportunités et risques. Vous recevez une analyse claire, assortie de recommandations prêtes à être discutées.",
    objectives: ["Comprendre le fonctionnement du secteur visé.", "Identifier les opportunités et les risques.", "Analyser le cadre réglementaire.", "Éclairer votre décision stratégique."],
    resultatsAttendus: ["Un diagnostic sectoriel complet.", "Une cartographie des acteurs.", "Des scénarios d'évolution.", "Des recommandations stratégiques."],
    publicOrganisations: ["Ministères et autorités de régulation.", "Investisseurs, entreprises et bailleurs."],
    publicParticuliers: ["Investisseurs et entrepreneurs individuels."],
    admission: ["Le secteur et la zone concernés.", "La décision à éclairer.", "Les documents déjà disponibles."],
    programme: [p("Phase 1 : Cadrage", "Périmètre et questions", "Revue documentaire"), p("Phase 2 : Enquête", "Entretiens avec les acteurs", "Collecte de données"), p("Phase 3 : Analyse", "Réglementation et marché", "Scénarios"), p("Phase 4 : Restitution", "Rapport", "Atelier de présentation")]
  },

  // Conseil stratégique et organisationnel
  'strategie d entreprise et vision': {
    description: "Votre organisation a besoin d'un cap clair ? Nous animons votre réflexion stratégique : diagnostic, vision, priorités, puis plan pluriannuel traduit en actions et en indicateurs. Notre regard extérieur facilite les arbitrages et l'adhésion de vos équipes. Vous repartez avec une stratégie partagée et prête à être exécutée.",
    objectives: ["Poser un diagnostic lucide de votre situation.", "Définir une vision et des priorités partagées.", "Faciliter les arbitrages au sein de la direction.", "Traduire la stratégie en actions suivies."],
    resultatsAttendus: ["Un rapport de diagnostic stratégique.", "Un plan stratégique pluriannuel.", "Un plan d'actions avec responsables.", "Un tableau de bord de suivi."],
    publicOrganisations: ["Conseils d'administration et comités de direction.", "Entreprises, institutions et ONG."],
    publicParticuliers: ["Dirigeants et entrepreneurs qui veulent un conseil personnalisé."],
    admission: ["Vos documents stratégiques existants.", "Vos résultats récents.", "La disponibilité de vos dirigeants pour les ateliers."],
    programme: [p("Phase 1 : Diagnostic", "Entretiens avec les dirigeants", "Analyses SWOT et PESTEL"), p("Phase 2 : Ateliers stratégiques", "Vision et mission", "Choix des priorités"), p("Phase 3 : Formalisation", "Plan stratégique", "Plan d'actions et budget"), p("Phase 4 : Déploiement", "Communication interne", "Suivi de la mise en œuvre")]
  },
  'organisation et processus': {
    description: "Doublons, lenteurs, responsabilités floues : ces dysfonctionnements coûtent cher au quotidien. Nous analysons votre organisation, cartographions vos processus, révisons vos organigrammes et rédigeons vos fiches de postes et manuels de procédures. Vos équipes savent qui fait quoi, et votre structure gagne en efficacité.",
    objectives: ["Identifier les dysfonctionnements de votre organisation.", "Simplifier vos processus clés.", "Clarifier les rôles et les responsabilités.", "Formaliser des procédures réellement appliquées."],
    resultatsAttendus: ["Une cartographie des processus.", "Un organigramme révisé.", "Des fiches de postes à jour.", "Un manuel de procédures validé."],
    publicOrganisations: ["Directions générales et RH.", "Entreprises, institutions publiques, projets et ONG."],
    publicParticuliers: ["Entrepreneurs qui structurent leur première équipe."],
    admission: ["Votre organigramme actuel.", "Vos procédures existantes.", "Un référent interne."],
    programme: [p("Phase 1 : Diagnostic", "Entretiens et observation", "Analyse de l'existant"), p("Phase 2 : Cartographie", "Processus actuels", "Points de blocage"), p("Phase 3 : Refonte", "Processus cibles", "Organigramme et fiches de postes"), p("Phase 4 : Déploiement", "Manuel de procédures", "Accompagnement des équipes")]
  },
  'gestion des ressources humaines et gpec': {
    description: "Attirer, évaluer, rémunérer et garder les bons profils demande des outils clairs. Nous structurons votre fonction RH : référentiels de métiers, grilles salariales, évaluation, plans de carrière et de succession. Vos décisions deviennent plus justes et plus lisibles, et vos collaborateurs voient mieux leur avenir chez vous.",
    objectives: ["Structurer votre fonction ressources humaines.", "Anticiper vos besoins en emplois et en compétences.", "Rendre la rémunération plus équitable.", "Sécuriser vos postes clés."],
    resultatsAttendus: ["Un référentiel de métiers et de compétences.", "Une grille salariale.", "Un dispositif d'évaluation.", "Un plan de succession."],
    publicOrganisations: ["Directions des ressources humaines et directions générales.", "Entreprises, établissements publics et ONG."],
    publicParticuliers: ["Dirigeants de petites structures et professionnels en transition de carrière."],
    admission: ["Vos effectifs et votre organigramme.", "Vos grilles et documents RH actuels.", "Vos projets d'évolution."],
    programme: [p("Phase 1 : Audit RH", "Revue des pratiques", "Entretiens"), p("Phase 2 : Référentiels", "Métiers et compétences", "Analyse des écarts"), p("Phase 3 : Outils", "Grille salariale", "Évaluation et carrières"), p("Phase 4 : Mise en œuvre", "Plan de succession", "Accompagnement des managers")]
  },
  'conduite du changement et culture': {
    description: "Fusion, réorganisation, nouveau logiciel : la réussite dépend d'abord des personnes. Nous analysons les impacts humains, préparons vos managers, construisons la communication et suivons l'adoption sur le terrain. Votre transformation avance avec vos équipes, et non contre elles.",
    objectives: ["Anticiper l'impact humain du changement.", "Préparer et mobiliser vos managers.", "Communiquer clairement à chaque étape.", "Mesurer et renforcer l'adoption."],
    resultatsAttendus: ["Une analyse d'impact.", "Un plan de changement et de communication.", "Des managers préparés.", "Un suivi de l'adoption."],
    publicOrganisations: ["Dirigeants et équipes de transformation.", "Organisations en fusion, restructuration ou digitalisation."],
    publicParticuliers: ["Dirigeants et managers qui souhaitent un accompagnement individuel."],
    admission: ["La description de la transformation prévue.", "Votre calendrier.", "La liste des équipes concernées."],
    programme: [p("Phase 1 : Analyse", "Impacts et parties prenantes", "Écoute des équipes"), p("Phase 2 : Plan de changement", "Communication", "Réseau de relais"), p("Phase 3 : Accompagnement", "Appui aux managers", "Ateliers d'équipe"), p("Phase 4 : Ancrage", "Mesure de l'adoption", "Actions correctives")]
  },
  'audit organisationnel': {
    description: "Vous sentez que quelque chose freine votre organisation, sans en identifier la cause ? Nous réalisons un audit indépendant de votre stratégie, de vos structures, de vos processus et de votre management. Vous recevez des constats francs, confidentiels, et un plan de redressement ou d'amélioration priorisé.",
    objectives: ["Porter un regard indépendant sur votre organisation.", "Identifier les causes réelles des difficultés.", "Évaluer la cohérence entre stratégie et moyens.", "Vous proposer un plan d'action réaliste."],
    resultatsAttendus: ["Un rapport d'audit confidentiel.", "Des constats hiérarchisés.", "Un plan d'action priorisé.", "Une restitution à la direction."],
    publicOrganisations: ["Conseils d'administration et directions générales.", "Établissements publics, entreprises et ONG."],
    publicParticuliers: ["Dirigeants et associés qui souhaitent un avis indépendant."],
    admission: ["Vos statuts et votre organigramme.", "Vos rapports d'activité et vos comptes.", "L'accord de la direction pour les entretiens."],
    programme: [p("Phase 1 : Cadrage", "Lettre de mission", "Revue documentaire"), p("Phase 2 : Investigation", "Entretiens", "Analyse des processus"), p("Phase 3 : Analyse", "Constats et causes", "Options d'amélioration"), p("Phase 4 : Restitution", "Rapport confidentiel", "Plan d'action")]
  },
  'gouvernance et ethique': {
    description: "Bailleurs, partenaires et clients attendent une gouvernance irréprochable. Nous évaluons votre conseil et vos pratiques, rédigeons vos chartes et vos règlements, et mettons en place des dispositifs de conformité et de lutte contre la corruption. Votre organisation gagne en transparence, et vous en retirez une confiance durable.",
    objectives: ["Évaluer vos pratiques de gouvernance.", "Clarifier les rôles et les décisions.", "Formaliser vos règles éthiques.", "Prévenir les risques de non-conformité."],
    resultatsAttendus: ["Une évaluation de la gouvernance.", "Une charte et un règlement intérieur du conseil.", "Un dispositif de conformité et d'alerte.", "Des administrateurs sensibilisés."],
    publicOrganisations: ["Conseils d'administration et directions générales.", "Entreprises, sociétés d'État, ONG et organisations faîtières."],
    publicParticuliers: ["Administrateurs et dirigeants qui souhaitent un conseil personnel."],
    admission: ["Vos statuts et règlements.", "Vos procès-verbaux récents.", "La composition de votre conseil."],
    programme: [p("Phase 1 : Évaluation", "Revue documentaire", "Entretiens avec les administrateurs"), p("Phase 2 : Recommandations", "Écarts par rapport aux bonnes pratiques", "Options"), p("Phase 3 : Formalisation", "Charte et règlements", "Dispositif de conformité"), p("Phase 4 : Mise en œuvre", "Sensibilisation", "Suivi")]
  }
};
