import { DomainIntervention, SubDomain } from '../types';

/**
 * Reference sheets of the domains and axes shown on the "Accompagnement" and "Formations" tabs:
 * description, objectives, target audience, expected results and an illustrating image.
 * Filled in only where the admin left a field empty or generic (see enrichDomains):
 * what is entered in the admin always takes precedence.
 */

export interface ContentSheet {
  description: string;
  objectives: string[];
  publicCible: string[];
  resultatsAttendus: string[];
  imageUrl: string;
}

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=750&q=80`;

export const DOMAIN_SHEETS: Record<string, ContentSheet> = {
  'ing-financiere': {
    imageUrl: photo('1554224155-6726b3ff858f'),
    description: "La performance financière conditionne la capacité d'une organisation à investir, à se développer et à inspirer confiance à ses partenaires. Le CICEXF intervient de la structuration des projets jusqu'à la fiabilisation des comptes : montage financier, modélisation, comptabilité, fiscalité, audit et appui au développement des PME.",
    objectives: [
      "Éclairer les décisions d'investissement par des analyses et des modèles financiers fiables.",
      "Structurer des projets et des dossiers de financement crédibles auprès des bailleurs et des banques.",
      "Fiabiliser la comptabilité, le respect des obligations fiscales et le contrôle interne.",
      "Renforcer les compétences financières des dirigeants et des équipes."
    ],
    publicCible: [
      "Directions générales, directions financières et comptables.",
      "PME, entrepreneurs et porteurs de projets.",
      "Institutions publiques, collectivités et unités de gestion de projets.",
      "Institutions financières, investisseurs et organisations de la société civile."
    ],
    resultatsAttendus: [
      "Des décisions d'investissement fondées sur des chiffres vérifiables.",
      "Des dossiers de financement complets et mieux défendus.",
      "Des comptes fiables et des obligations fiscales maîtrisées.",
      "Des équipes capables de piloter durablement la performance financière."
    ]
  },
  'ing-qhse': {
    imageUrl: photo('1622612023350-b15f063eabe6'),
    description: "Qualité, santé, sécurité et environnement sont devenus des exigences de compétitivité et des conditions d'accès aux marchés et aux financements. Le CICEXF aide les organisations à prévenir les risques, à se conformer aux normes et aux réglementations, et à ancrer une culture durable de la maîtrise et de l'amélioration continue.",
    objectives: [
      "Identifier et maîtriser les risques pour les personnes, les activités et l'environnement.",
      "Mettre en place des systèmes de management conformes aux normes internationales.",
      "Intégrer les exigences environnementales et sociales dans les projets et les opérations.",
      "Développer une culture QHSE partagée à tous les niveaux de l'organisation."
    ],
    publicCible: [
      "Directions générales, responsables QHSE et responsables de production.",
      "Industries, BTP, mines, énergie, agro-industrie et logistique.",
      "Projets de développement et unités de gestion soumis aux sauvegardes.",
      "Institutions publiques et organismes de contrôle."
    ],
    resultatsAttendus: [
      "Des risques identifiés, hiérarchisés et suivis par des plans d'action.",
      "Des organisations mieux préparées aux audits et aux certifications.",
      "Une conformité réglementaire et contractuelle renforcée.",
      "Des pratiques de prévention adoptées durablement par les équipes."
    ]
  },
  'ing-formation': {
    imageUrl: photo('1524178232363-1fb2b075b655'),
    description: "Former n'a de valeur que si les compétences acquises changent les pratiques. Le CICEXF accompagne les organisations sur tout le cycle de l'ingénierie de formation : analyse des besoins, conception pédagogique, animation et évaluation, afin que chaque action réponde à un enjeu concret de performance.",
    objectives: [
      "Identifier les besoins réels en compétences au regard de la stratégie de l'organisation.",
      "Concevoir des dispositifs pédagogiques adaptés aux publics et aux contextes.",
      "Déployer des formations actives, en présentiel, à distance ou en mode hybride.",
      "Mesurer les acquis et leur application en situation de travail."
    ],
    publicCible: [
      "Directions des ressources humaines et responsables de formation.",
      "Ministères, agences publiques et collectivités.",
      "Entreprises, ONG et projets de développement.",
      "Centres de formation, écoles et instituts."
    ],
    resultatsAttendus: [
      "Un plan de formation aligné sur les priorités de l'organisation.",
      "Des programmes et supports réutilisables par vos équipes.",
      "Des compétences directement applicables au poste de travail.",
      "Des résultats de formation mesurés et documentés."
    ]
  },
  'ing-informatique': {
    imageUrl: photo('1680992044138-ce4864c2b962'),
    description: "La continuité des activités, la qualité des services et la protection des données reposent aujourd'hui sur des systèmes d'information solides. Le CICEXF conçoit et sécurise les infrastructures, développe des solutions applicatives et accompagne la transformation numérique des organisations.",
    objectives: [
      "Doter l'organisation d'infrastructures fiables, évolutives et disponibles.",
      "Développer des applications adaptées aux processus métiers.",
      "Protéger les systèmes et les données contre les cybermenaces.",
      "Conduire la transformation numérique avec une feuille de route réaliste."
    ],
    publicCible: [
      "Directions générales et directions des systèmes d'information.",
      "Administrations et établissements publics.",
      "Banques, assurances, télécoms et entreprises de services.",
      "PME et organisations engagées dans leur digitalisation."
    ],
    resultatsAttendus: [
      "Des systèmes plus disponibles et mieux documentés.",
      "Des processus métiers automatisés et mieux suivis.",
      "Un niveau de sécurité évalué et renforcé.",
      "Des équipes autonomes dans l'exploitation des outils."
    ]
  },
  'ing-territoriale': {
    imageUrl: photo('1783260606376-046b461ba2bc'),
    description: "Un territoire se développe lorsque sa planification, sa gouvernance et ses données servent des choix concertés. Le CICEXF appuie les ministères, les collectivités et les acteurs locaux dans l'aménagement, la décentralisation, le développement rural et l'information géographique.",
    objectives: [
      "Planifier un aménagement cohérent et durable des territoires.",
      "Renforcer les capacités de gestion et les ressources des collectivités.",
      "Valoriser les potentiels économiques locaux, notamment agricoles.",
      "Fonder les décisions sur des données géographiques à jour."
    ],
    publicCible: [
      "Ministères techniques et agences d'aménagement.",
      "Conseils régionaux, mairies et districts.",
      "Coopératives, organisations de producteurs et acteurs des filières.",
      "Bailleurs et projets de développement local."
    ],
    resultatsAttendus: [
      "Des documents de planification concertés et exploitables.",
      "Des collectivités mieux organisées et mieux outillées.",
      "Des filières locales mieux structurées.",
      "Des bases de données territoriales utiles à la décision."
    ]
  },
  'ing-gestion-projets': {
    imageUrl: photo('1590402494587-44b71d7772f6'),
    description: "Un projet réussi est un projet bien conçu, piloté avec rigueur et évalué honnêtement. Le CICEXF accompagne les porteurs de projets et de programmes de la conception à l'évaluation, avec des outils de planification, de suivi et de gestion axée sur les résultats.",
    objectives: [
      "Concevoir des projets logiques, réalistes et finançables.",
      "Suivre en continu l'avancement physique et financier.",
      "Mesurer les effets et les impacts sur les bénéficiaires.",
      "Digitaliser la collecte et la valorisation des données de suivi-évaluation."
    ],
    publicCible: [
      "Unités de gestion de projets et coordinations de programmes.",
      "Ministères, agences d'exécution et collectivités.",
      "ONG, associations et organisations internationales.",
      "Responsables de suivi-évaluation et chefs de projets."
    ],
    resultatsAttendus: [
      "Des projets conçus avec des objectifs et des indicateurs clairs.",
      "Des écarts détectés tôt et corrigés à temps.",
      "Des rapports fiables pour les décideurs et les bailleurs.",
      "Des enseignements capitalisés pour les prochaines interventions."
    ]
  },
  'etudes-recherches': {
    imageUrl: photo('1650499311129-5dc75c1038e6'),
    description: "Une décision solide repose sur des données fiables et bien analysées. Le CICEXF conçoit et réalise des enquêtes, des études socio-économiques et sectorielles ainsi que des analyses statistiques pour éclairer les politiques publiques, les investissements et les stratégies d'entreprise.",
    objectives: [
      "Produire des données de terrain représentatives et de qualité.",
      "Comprendre les réalités économiques et sociales des populations et des marchés.",
      "Analyser les données avec des méthodes statistiques rigoureuses.",
      "Traduire les résultats en recommandations opérationnelles."
    ],
    publicCible: [
      "Ministères, institutions statistiques et agences publiques.",
      "Bailleurs de fonds, organisations internationales et ONG.",
      "Entreprises et investisseurs à la recherche d'informations de marché.",
      "Centres de recherche et universités."
    ],
    resultatsAttendus: [
      "Des bases de données propres et documentées.",
      "Des rapports d'étude clairs et argumentés.",
      "Des décisions appuyées sur des preuves.",
      "Des recommandations hiérarchisées et applicables."
    ]
  },
  'conseil-strategique': {
    imageUrl: photo('1542744173-8e7e53415bb0'),
    description: "Une ambition n'a d'effet que si l'organisation, les équipes et la gouvernance sont alignées pour la porter. Le CICEXF accompagne les dirigeants dans la définition de leur stratégie, l'organisation du travail, la gestion des talents, la conduite du changement et la bonne gouvernance.",
    objectives: [
      "Clarifier la vision et les priorités stratégiques.",
      "Rendre l'organisation et les processus plus efficaces.",
      "Anticiper les besoins en emplois et en compétences.",
      "Consolider la gouvernance et accompagner les transformations."
    ],
    publicCible: [
      "Dirigeants, conseils d'administration et comités de direction.",
      "Directions des ressources humaines et de l'organisation.",
      "Entreprises, institutions publiques et organisations faîtières.",
      "ONG et structures en croissance ou en restructuration."
    ],
    resultatsAttendus: [
      "Un plan stratégique partagé et traduit en actions.",
      "Des rôles, des processus et des procédures clarifiés.",
      "Une gestion des compétences mieux anticipée.",
      "Une gouvernance plus transparente et plus efficace."
    ]
  }
};

/** Keys: axis title without its number, in lower case and without accents (see axisKey) */
export const AXIS_SHEETS: Record<string, ContentSheet> = {
  // Ingénierie financière et de l'investissement
  'structuration et financement des projets': {
    imageUrl: photo('1628348068343-c6a848d2b6dd'),
    description: "Un bon projet n'obtient un financement que s'il est structuré et démontré. Nous accompagnons les porteurs de projets dans l'étude de faisabilité, le montage financier, le choix des sources de financement et la préparation des dossiers présentés aux banques, aux investisseurs et aux bailleurs.",
    objectives: [
      "Évaluer la faisabilité technique, financière et économique du projet.",
      "Construire un plan de financement équilibré entre fonds propres, dette et subventions.",
      "Préparer un dossier de financement complet et convaincant.",
      "Identifier les partenaires financiers adaptés et préparer les échanges avec eux."
    ],
    publicCible: [
      "Porteurs de projets, promoteurs et entrepreneurs.",
      "Directions financières et directions du développement.",
      "Collectivités et institutions publiques porteuses d'investissements.",
      "ONG et organisations à la recherche de financements."
    ],
    resultatsAttendus: [
      "Une étude de faisabilité et un plan d'affaires documentés.",
      "Un plan de financement chiffré et cohérent.",
      "Un dossier prêt à être présenté aux financeurs.",
      "Une meilleure maîtrise des exigences des partenaires financiers."
    ]
  },
  'analyse financiere et modelisation': {
    imageUrl: photo('1560221328-12fe60f83ab8'),
    description: "Comprendre la santé financière d'une organisation et simuler l'avenir permet de décider en connaissance de cause. Nous réalisons des diagnostics financiers et construisons des modèles prévisionnels, avec des scénarios et des indicateurs de rentabilité utilisables par vos équipes.",
    objectives: [
      "Diagnostiquer la rentabilité, la solvabilité et la trésorerie de l'organisation.",
      "Construire des modèles financiers prévisionnels clairs et modifiables.",
      "Calculer les indicateurs de décision tels que la VAN, le TRI et le délai de récupération.",
      "Tester plusieurs scénarios et mesurer leur sensibilité."
    ],
    publicCible: [
      "Directeurs financiers, contrôleurs de gestion et analystes.",
      "Dirigeants et investisseurs.",
      "Banques et institutions financières.",
      "Responsables de projets d'investissement."
    ],
    resultatsAttendus: [
      "Un diagnostic financier assorti de recommandations.",
      "Un modèle financier documenté et remis à vos équipes.",
      "Des scénarios comparés pour éclairer les arbitrages.",
      "Des équipes capables de mettre à jour et d'utiliser le modèle."
    ]
  },
  'gestion comptable fiscale et audit': {
    imageUrl: photo('1642043175009-5997b3a078d8'),
    description: "Des comptes fiables et une fiscalité maîtrisée protègent l'organisation et renforcent sa crédibilité. Nous intervenons sur l'organisation comptable selon le référentiel SYSCOHADA, le respect des obligations fiscales, le contrôle interne et l'audit.",
    objectives: [
      "Organiser une comptabilité fiable et conforme au SYSCOHADA.",
      "Sécuriser le respect des obligations fiscales et sociales.",
      "Renforcer les procédures et le contrôle interne.",
      "Préparer et réaliser des missions d'audit."
    ],
    publicCible: [
      "Directions administratives, financières et comptables.",
      "PME et entreprises en croissance.",
      "Associations, ONG et projets financés par des bailleurs.",
      "Institutions publiques et établissements parapublics."
    ],
    resultatsAttendus: [
      "Des états financiers plus fiables et produits dans les délais.",
      "Des risques fiscaux identifiés et mieux maîtrisés.",
      "Des procédures comptables écrites et appliquées.",
      "Un rapport d'audit avec un plan d'actions correctives."
    ]
  },
  'entrepreneuriat et developpement de pme': {
    imageUrl: photo('1687422808191-93810cd07ab0'),
    description: "Les PME et les entrepreneurs ont besoin d'un appui concret pour passer de l'idée à une activité rentable et durable. Nous les accompagnons sur le modèle économique, le plan d'affaires, la gestion quotidienne, l'accès au marché et la recherche de financement.",
    objectives: [
      "Clarifier le modèle économique et l'offre de valeur.",
      "Élaborer un plan d'affaires réaliste.",
      "Installer des outils simples de gestion et de suivi.",
      "Préparer l'entreprise à accéder aux marchés et aux financements."
    ],
    publicCible: [
      "Créateurs d'entreprise et jeunes entrepreneurs.",
      "Dirigeants de PME et de TPE.",
      "Femmes entrepreneures, coopératives et groupements.",
      "Incubateurs et programmes d'appui à l'entrepreneuriat."
    ],
    resultatsAttendus: [
      "Un plan d'affaires complet et chiffré.",
      "Des outils de gestion utilisés au quotidien.",
      "Une entreprise mieux préparée à convaincre clients et financeurs.",
      "Un plan de développement avec des priorités claires."
    ]
  },

  // Ingénierie QHSE
  'systemes de management integre smi': {
    imageUrl: photo('1589793463357-5fb813435467'),
    description: "Regrouper qualité, environnement et santé-sécurité dans un même système évite les doublons et simplifie le pilotage. Nous concevons et déployons des systèmes de management intégrés fondés sur les normes ISO 9001, ISO 14001 et ISO 45001, jusqu'à la préparation à la certification.",
    objectives: [
      "Évaluer les écarts entre vos pratiques et les exigences des normes.",
      "Cartographier les processus et bâtir une documentation unique.",
      "Former les équipes et les auditeurs internes.",
      "Préparer l'organisation à l'audit de certification."
    ],
    publicCible: [
      "Directions générales et responsables QHSE.",
      "Responsables de processus et pilotes qualité.",
      "Industries, entreprises de services et de BTP.",
      "Organisations visant ou renouvelant une certification."
    ],
    resultatsAttendus: [
      "Un système documenté, simple et réellement appliqué.",
      "Des auditeurs internes capables de faire vivre le système.",
      "Des non-conformités traitées et suivies.",
      "Une organisation prête à se présenter à l'audit de certification."
    ]
  },
  'hygiene et securite au travail sst': {
    imageUrl: photo('1662309376159-b95fb193d96b'),
    description: "Protéger la santé et la sécurité des travailleurs est une obligation et un levier de performance. Nous évaluons les risques professionnels, élaborons le Document Unique et les plans de prévention, et formons les équipes aux bons réflexes.",
    objectives: [
      "Identifier et évaluer les risques professionnels à chaque poste.",
      "Élaborer le Document Unique et les plans de prévention.",
      "Améliorer l'ergonomie et les conditions de travail.",
      "Préparer les équipes aux situations d'urgence."
    ],
    publicCible: [
      "Chefs d'entreprise, responsables HSE et ressources humaines.",
      "Membres des comités de santé et de sécurité au travail.",
      "Chefs de chantier et encadrement de production.",
      "Entreprises du BTP, de l'industrie, des mines et de la logistique."
    ],
    resultatsAttendus: [
      "Un Document Unique complet et à jour.",
      "Un plan de prévention hiérarchisé et suivi.",
      "Un personnel formé et des consignes mieux respectées.",
      "Une meilleure maîtrise des accidents et incidents."
    ]
  },
  'environnement et developpement durable': {
    imageUrl: photo('1509391366360-2e959784a276'),
    description: "Maîtriser son empreinte environnementale répond aux attentes des autorités, des investisseurs et des citoyens. Nous réalisons des études d'impact environnemental et social, des bilans carbone et accompagnons les démarches de responsabilité sociétale.",
    objectives: [
      "Évaluer les impacts environnementaux et sociaux des activités et des projets.",
      "Mesurer les émissions et définir des actions de réduction.",
      "Élaborer des plans de gestion environnementale et sociale.",
      "Structurer une démarche RSE adaptée à l'organisation."
    ],
    publicCible: [
      "Entreprises industrielles, énergétiques et minières.",
      "Promoteurs de projets d'infrastructure.",
      "Institutions publiques et collectivités.",
      "Responsables environnement, RSE et développement durable."
    ],
    resultatsAttendus: [
      "Des études et des rapports conformes aux exigences applicables.",
      "Des mesures d'atténuation chiffrées et planifiées.",
      "Un bilan carbone et une trajectoire de réduction.",
      "Une démarche RSE lisible pour les parties prenantes."
    ]
  },
  'securite sanitaire et agroalimentaire': {
    imageUrl: photo('1551884170-09fb70a3a2ed'),
    description: "La sécurité des aliments protège les consommateurs et ouvre l'accès aux marchés exigeants. Nous accompagnons les acteurs de la chaîne alimentaire dans la mise en place de la méthode HACCP, de la norme ISO 22000 et de systèmes de traçabilité.",
    objectives: [
      "Analyser les dangers et déterminer les points critiques de maîtrise.",
      "Mettre en place les bonnes pratiques d'hygiène et de fabrication.",
      "Organiser la traçabilité, du fournisseur au client.",
      "Préparer l'organisation aux contrôles et aux certifications."
    ],
    publicCible: [
      "Industries agroalimentaires et unités de transformation.",
      "Restaurants, hôtels et traiteurs.",
      "Coopératives et exportateurs de produits agricoles.",
      "Responsables qualité et services de contrôle sanitaire."
    ],
    resultatsAttendus: [
      "Un plan HACCP documenté et appliqué.",
      "Un personnel formé aux règles d'hygiène.",
      "Des lots identifiables grâce à une traçabilité organisée.",
      "Une organisation mieux préparée aux inspections et aux audits."
    ]
  },
  'sauvegarde environnementale et sociale ses': {
    imageUrl: photo('1509391366360-2e959784a276'),
    description: "Les bailleurs et les autorités exigent que les projets préviennent et gèrent leurs risques pour l'environnement et les populations. Nous accompagnons les équipes de projet dans l'application des normes de sauvegarde, de l'évaluation des risques à la mise en œuvre et au suivi des mesures.",
    objectives: [
      "Identifier les risques et les impacts environnementaux et sociaux.",
      "Élaborer et mettre en œuvre les instruments de sauvegarde requis.",
      "Organiser la consultation des parties prenantes et la gestion des plaintes.",
      "Suivre et rapporter la conformité du projet."
    ],
    publicCible: [
      "Unités de gestion de projets et spécialistes en sauvegarde.",
      "Ministères et agences d'exécution.",
      "Entreprises et bureaux d'études intervenant sur des projets financés.",
      "ONG et collectivités partenaires de projets."
    ],
    resultatsAttendus: [
      "Des instruments de sauvegarde élaborés et appliqués.",
      "Des risques suivis tout au long du projet.",
      "Des parties prenantes informées et un mécanisme de plaintes actif.",
      "Des rapports de suivi conformes aux attentes des bailleurs."
    ]
  },

  // Ingénierie de formation et de renforcement de capacités
  'analyse et planification des dispositifs de formation': {
    imageUrl: photo('1623652554515-91c833e3080e'),
    description: "Une formation utile commence par un diagnostic juste. Nous analysons les écarts entre les compétences disponibles et celles que requiert votre stratégie, puis nous construisons un plan de formation réaliste, chiffré et priorisé.",
    objectives: [
      "Recueillir et analyser les besoins en compétences par métier.",
      "Élaborer ou actualiser les référentiels de compétences.",
      "Prioriser les actions selon les enjeux et les budgets.",
      "Formaliser un plan de formation pluriannuel."
    ],
    publicCible: [
      "Directions des ressources humaines et responsables de formation.",
      "Directions générales et chefs de service.",
      "Ministères, collectivités et établissements publics.",
      "Entreprises, ONG et projets de développement."
    ],
    resultatsAttendus: [
      "Une cartographie des besoins en compétences.",
      "Un référentiel utilisable par les équipes RH.",
      "Un plan de formation priorisé et budgétisé.",
      "Des choix de formation justifiés par les enjeux de l'organisation."
    ]
  },
  'conception pedagogique et innovation educative': {
    imageUrl: photo('1758873272955-3b066dd11c6b'),
    description: "Les adultes apprennent mieux lorsque le contenu parle de leur réalité. Nous concevons des parcours par compétences, des supports et des modules en ligne, en combinant les modalités pour faciliter l'apprentissage et son application.",
    objectives: [
      "Définir des objectifs pédagogiques mesurables.",
      "Concevoir des curricula structurés par compétences.",
      "Produire des supports et des contenus e-learning attractifs.",
      "Combiner présentiel, distanciel et mises en situation."
    ],
    publicCible: [
      "Responsables pédagogiques et concepteurs de formation.",
      "Centres de formation, écoles et universités.",
      "Directions RH disposant d'une académie interne.",
      "Formateurs et experts métiers."
    ],
    resultatsAttendus: [
      "Des programmes détaillés et cohérents.",
      "Des supports pédagogiques prêts à l'emploi.",
      "Des modules numériques accessibles aux apprenants.",
      "Des formateurs à l'aise avec les nouvelles modalités."
    ]
  },
  'mise en oeuvre des formations': {
    imageUrl: photo('1664382953481-141e97ad9825'),
    description: "La réussite d'une formation se joue aussi dans son organisation et son animation. Nous assurons la logistique, l'animation en présentiel ou à distance et la coordination des sessions, avec des méthodes actives centrées sur la pratique.",
    objectives: [
      "Planifier et coordonner les sessions de formation.",
      "Animer des séquences actives avec des cas pratiques.",
      "Adapter le rythme et les exemples au profil des participants.",
      "Assurer le suivi administratif et la traçabilité des sessions."
    ],
    publicCible: [
      "Responsables de formation et chefs de projets.",
      "Agents et cadres d'organisations publiques et privées.",
      "Projets de développement ayant un volet de renforcement de capacités.",
      "Groupes professionnels et organisations de la société civile."
    ],
    resultatsAttendus: [
      "Des sessions organisées et animées conformément au plan.",
      "Des participants engagés et mis en pratique.",
      "Une documentation complète des sessions réalisées.",
      "Des compétences transférables au poste de travail."
    ]
  },
  'evaluation et developpement professionnel': {
    imageUrl: photo('1627556704290-2b1f5853ff78'),
    description: "Mesurer les effets d'une formation permet de l'améliorer et de justifier l'investissement. Nous appliquons le modèle de Kirkpatrick pour évaluer la satisfaction, les acquis, les comportements et les résultats, et nous accompagnons la progression professionnelle des personnes.",
    objectives: [
      "Évaluer la satisfaction et les connaissances acquises.",
      "Mesurer l'application des acquis en situation de travail.",
      "Apprécier les effets sur la performance de l'organisation.",
      "Organiser la reconnaissance et le suivi des compétences."
    ],
    publicCible: [
      "Directions RH et responsables de formation.",
      "Bailleurs et responsables de programmes de formation.",
      "Centres de formation et organismes certificateurs.",
      "Managers responsables du développement de leurs équipes."
    ],
    resultatsAttendus: [
      "Des outils d'évaluation prêts à l'emploi.",
      "Un rapport sur les effets réels des formations.",
      "Des pistes d'amélioration pour les prochaines actions.",
      "Des parcours de progression mieux suivis."
    ]
  },

  // Ingénierie informatique et systèmes de réseaux
  'infrastructure et reseaux': {
    imageUrl: photo('1698668975271-2ba9a323be6b'),
    description: "Une infrastructure bien conçue garantit la continuité des services. Nous concevons et modernisons les réseaux d'entreprise, les serveurs et les environnements cloud, en tenant compte de vos contraintes de disponibilité, de sécurité et de budget.",
    objectives: [
      "Évaluer l'existant et les besoins en capacité.",
      "Concevoir une architecture réseau et serveur adaptée.",
      "Assurer la haute disponibilité et la sauvegarde des données.",
      "Documenter et transférer l'exploitation aux équipes."
    ],
    publicCible: [
      "Directions des systèmes d'information et administrateurs.",
      "Administrations et établissements publics.",
      "Entreprises multisites et PME en croissance.",
      "Banques, assurances, hôpitaux et écoles."
    ],
    resultatsAttendus: [
      "Une architecture documentée et évolutive.",
      "Des interruptions de service mieux maîtrisées.",
      "Un plan de sauvegarde et de reprise opérationnel.",
      "Des équipes techniques autonomes dans l'exploitation."
    ]
  },
  'developpement logiciel et solutions applicatives': {
    imageUrl: photo('1515879218367-8466d910aaa4'),
    description: "Un logiciel doit épouser vos processus et non l'inverse. Nous développons des portails web, des applications métiers et des interfaces sécurisées, depuis l'expression des besoins jusqu'au déploiement et à la formation des utilisateurs.",
    objectives: [
      "Recueillir et formaliser les besoins fonctionnels.",
      "Concevoir des applications simples et sécurisées.",
      "Interconnecter les outils existants grâce à des API.",
      "Tester, déployer et former les utilisateurs."
    ],
    publicCible: [
      "Directions métiers et directions informatiques.",
      "PME et entreprises de services.",
      "Institutions publiques engagées dans la dématérialisation.",
      "ONG et projets nécessitant des outils spécifiques."
    ],
    resultatsAttendus: [
      "Une application conforme au cahier des charges.",
      "Des tâches manuelles réduites et des données centralisées.",
      "Une documentation technique et un guide utilisateur.",
      "Des utilisateurs formés dès la mise en service."
    ]
  },
  'cybersecurite et gouvernance it': {
    imageUrl: photo('1614064641938-3bbee52942c7'),
    description: "Une seule faille peut interrompre l'activité et compromettre des données sensibles. Nous réalisons des audits de sécurité et des tests d'intrusion, nous accompagnons la conformité à la norme ISO 27001 et nous sensibilisons les équipes.",
    objectives: [
      "Évaluer le niveau de sécurité et identifier les vulnérabilités.",
      "Définir une politique de sécurité et des règles de gouvernance.",
      "Accompagner la mise en conformité à l'ISO 27001.",
      "Sensibiliser le personnel aux bons réflexes numériques."
    ],
    publicCible: [
      "Directions générales et responsables de la sécurité informatique.",
      "Banques, assurances, télécoms et santé.",
      "Administrations détenant des données sensibles.",
      "PME dépendant de leurs outils numériques."
    ],
    resultatsAttendus: [
      "Un rapport de vulnérabilités avec un plan de correction.",
      "Une politique de sécurité formalisée.",
      "Un personnel plus vigilant face aux attaques.",
      "Une organisation mieux préparée à gérer un incident."
    ]
  },
  'transformation numerique': {
    imageUrl: photo('1542751110-97427bbecf20'),
    description: "Se digitaliser, c'est d'abord repenser ses façons de travailler. Nous évaluons votre maturité numérique, définissons une feuille de route et accompagnons l'automatisation des processus et l'exploitation des données.",
    objectives: [
      "Mesurer la maturité numérique de l'organisation.",
      "Définir une feuille de route priorisée.",
      "Automatiser les processus à plus forte valeur.",
      "Valoriser les données et accompagner les utilisateurs."
    ],
    publicCible: [
      "Directions générales et directions de la transformation.",
      "Administrations engagées dans la dématérialisation.",
      "Entreprises de tous secteurs et PME.",
      "Chefs de projets numériques."
    ],
    resultatsAttendus: [
      "Un diagnostic de maturité et une feuille de route.",
      "Des processus clés dématérialisés.",
      "Des tableaux de bord utiles à la décision.",
      "Des équipes qui adoptent les nouveaux outils."
    ]
  },

  // Ingénierie de développement territorial
  'amenagement du territoire et urbanisme': {
    imageUrl: photo('1717700299588-ee73dc7de1fa'),
    description: "Anticiper la croissance urbaine évite des coûts sociaux et économiques importants. Nous accompagnons l'élaboration de schémas directeurs d'aménagement et de plans d'urbanisme de détail, en concertation avec les populations et les autorités.",
    objectives: [
      "Établir le diagnostic du territoire et de ses dynamiques.",
      "Élaborer des schémas directeurs et des plans d'urbanisme.",
      "Organiser la concertation avec les acteurs locaux.",
      "Programmer les équipements et les investissements prioritaires."
    ],
    publicCible: [
      "Ministères chargés de la construction et de l'urbanisme.",
      "Districts, régions et communes.",
      "Agences d'aménagement et services techniques.",
      "Promoteurs et bailleurs de projets urbains."
    ],
    resultatsAttendus: [
      "Un diagnostic territorial partagé.",
      "Des documents d'urbanisme concertés et exploitables.",
      "Un programme d'investissements priorisé.",
      "Des services techniques mieux outillés pour le suivi."
    ]
  },
  'decentralisation et gouvernance locale': {
    imageUrl: photo('1780396269429-e20eaa1a1cd2'),
    description: "Les collectivités doivent offrir de meilleurs services avec des ressources souvent limitées. Nous appuyons les mairies et les régions dans leur organisation, la planification du développement local et la mobilisation des ressources, notamment le recouvrement fiscal.",
    objectives: [
      "Renforcer l'organisation et les compétences des services locaux.",
      "Élaborer des plans de développement participatifs.",
      "Améliorer la mobilisation et le recouvrement des recettes locales.",
      "Promouvoir la transparence et la participation citoyenne."
    ],
    publicCible: [
      "Maires, conseils municipaux et conseils régionaux.",
      "Secrétaires généraux et services financiers des collectivités.",
      "Ministères chargés de la décentralisation.",
      "Organisations de la société civile et programmes d'appui."
    ],
    resultatsAttendus: [
      "Un plan de développement local adopté par les acteurs.",
      "Un meilleur recensement des contribuables et des recettes mieux suivies.",
      "Des procédures administratives et financières clarifiées.",
      "Un dialogue renforcé avec les citoyens."
    ]
  },
  'developpement rural et filieres agricoles': {
    imageUrl: photo('1564491683755-fb07a55a5299'),
    description: "L'agriculture reste un moteur d'emplois et de revenus. Nous analysons les chaînes de valeur, appuyons la structuration des producteurs et accompagnons les projets d'infrastructures rurales et d'agro-pôles.",
    objectives: [
      "Analyser les chaînes de valeur et leurs points de blocage.",
      "Renforcer les coopératives et les organisations de producteurs.",
      "Améliorer l'accès au marché et la valorisation des produits.",
      "Préparer des projets d'infrastructures rurales et d'agro-pôles."
    ],
    publicCible: [
      "Ministères chargés de l'agriculture et du développement rural.",
      "Coopératives, faîtières et organisations de producteurs.",
      "Agro-industriels et exportateurs.",
      "Projets de développement rural et bailleurs."
    ],
    resultatsAttendus: [
      "Une analyse de filière avec des actions prioritaires.",
      "Des organisations de producteurs mieux gérées.",
      "Des liens plus solides entre producteurs et acheteurs.",
      "Des projets ruraux documentés et prêts à être financés."
    ]
  },
  'sig et observation territoriale': {
    imageUrl: photo('1473968512647-3e447244af8f'),
    description: "Savoir où se situent les biens, les populations et les équipements change la qualité des décisions. Nous mettons en place des systèmes d'information géographique, numérisons le cadastre et produisons des cartes, notamment par drone.",
    objectives: [
      "Collecter et structurer les données géographiques du territoire.",
      "Numériser le cadastre et les plans existants.",
      "Produire des cartes thématiques, notamment par drone.",
      "Former les équipes à l'utilisation des outils SIG."
    ],
    publicCible: [
      "Services techniques des collectivités et des ministères.",
      "Services fonciers, cadastraux et d'urbanisme.",
      "Projets d'infrastructure, d'agriculture et d'environnement.",
      "Géomaticiens et responsables de données."
    ],
    resultatsAttendus: [
      "Une base de données géographiques à jour.",
      "Des cartes utiles à la planification et au suivi.",
      "Un cadastre numérisé et mieux exploitable.",
      "Des équipes autonomes sur les outils SIG."
    ]
  },

  // Gestion, suivi et évaluation des projets et programmes
  'conception et planification de projets': {
    imageUrl: photo('1532622785990-d2c36a76f5a6'),
    description: "La qualité d'un projet se décide dès sa conception. Nous aidons les équipes à clarifier le problème à résoudre, à formuler la théorie du changement et le cadre logique, puis à bâtir le chronogramme et le budget par objectifs.",
    objectives: [
      "Analyser le contexte, les problèmes et les parties prenantes.",
      "Formuler la théorie du changement et le cadre logique.",
      "Élaborer le chronogramme et le budget par objectifs.",
      "Identifier les risques et les mesures de réponse."
    ],
    publicCible: [
      "Chefs de projets et équipes de conception.",
      "ONG, associations et organisations internationales.",
      "Ministères et collectivités.",
      "Porteurs de projets répondant à des appels à propositions."
    ],
    resultatsAttendus: [
      "Un document de projet cohérent et finançable.",
      "Un cadre logique avec des indicateurs mesurables.",
      "Un budget et un calendrier réalistes.",
      "Une matrice des risques partagée par l'équipe."
    ]
  },
  'suivi operationnel et financier': {
    imageUrl: photo('1686061594225-3e92c0cd51b0'),
    description: "Suivre un projet, c'est voir les écarts à temps pour agir. Nous mettons en place des tableaux de bord de pilotage et des outils de suivi budgétaire reliant l'avancement physique aux dépenses, notamment grâce à la méthode de la valeur acquise.",
    objectives: [
      "Définir les indicateurs et les routines de suivi.",
      "Mettre en place des tableaux de bord de pilotage.",
      "Relier l'avancement physique à l'exécution financière.",
      "Produire des rapports réguliers pour les décideurs et les bailleurs."
    ],
    publicCible: [
      "Coordonnateurs et unités de gestion de projets.",
      "Responsables administratifs, financiers et de suivi-évaluation.",
      "Directions des études et de la planification.",
      "ONG et entreprises gérant des portefeuilles de projets."
    ],
    resultatsAttendus: [
      "Des tableaux de bord utilisés en réunion de pilotage.",
      "Des écarts de délais et de coûts détectés tôt.",
      "Des rapports fiables produits à échéance.",
      "Une meilleure consommation des budgets."
    ]
  },
  'evaluation d impact': {
    imageUrl: photo('1553775927-a071d5a6a39a'),
    description: "Qu'a réellement changé le projet pour les bénéficiaires ? Nous réalisons des évaluations à mi-parcours et finales selon les critères du CAD de l'OCDE : pertinence, cohérence, efficacité, efficience, impact et durabilité.",
    objectives: [
      "Définir les questions et la méthodologie d'évaluation.",
      "Collecter des données quantitatives et qualitatives.",
      "Apprécier les résultats selon les critères du CAD de l'OCDE.",
      "Formuler des leçons apprises et des recommandations."
    ],
    publicCible: [
      "Bailleurs de fonds et organisations internationales.",
      "Ministères et agences d'exécution.",
      "ONG et unités de gestion de projets.",
      "Responsables de suivi-évaluation et d'apprentissage."
    ],
    resultatsAttendus: [
      "Un rapport d'évaluation indépendant et argumenté.",
      "Des effets et des impacts documentés.",
      "Des recommandations applicables et priorisées.",
      "Des enseignements utiles aux prochains programmes."
    ]
  },
  'systemes d information pour le suivi evaluation sise': {
    imageUrl: photo('1599591520443-e5045e52d4e6'),
    description: "Des données saisies une seule fois, vérifiées et disponibles rapidement changent le pilotage d'un programme. Nous digitalisons la collecte sur le terrain avec KoboCollect et construisons des bases de données et des tableaux de bord sous Power BI.",
    objectives: [
      "Concevoir le système d'information et ses indicateurs.",
      "Digitaliser les formulaires de collecte sur le terrain.",
      "Centraliser et contrôler la qualité des données.",
      "Automatiser les tableaux de bord et les rapports."
    ],
    publicCible: [
      "Responsables de suivi-évaluation et gestionnaires de données.",
      "Unités de gestion de projets et programmes.",
      "ONG et organisations internationales.",
      "Directions de la planification et de la statistique."
    ],
    resultatsAttendus: [
      "Une collecte numérique opérationnelle sur le terrain.",
      "Une base de données centralisée et contrôlée.",
      "Des tableaux de bord mis à jour plus facilement.",
      "Des équipes formées à l'administration du système."
    ]
  },

  // Études, enquêtes et recherches socio-économiques
  'enquetes statistiques et sondages': {
    imageUrl: photo('1631540702177-d2b28aa09fb0'),
    description: "La valeur d'une enquête dépend de sa méthode et de la qualité du terrain. Nous concevons l'échantillonnage et les questionnaires, formons les enquêteurs, assurons la collecte mobile et contrôlons la qualité jusqu'à l'analyse.",
    objectives: [
      "Définir la méthodologie et un échantillon représentatif.",
      "Concevoir et tester les questionnaires.",
      "Former et superviser les équipes d'enquêteurs.",
      "Collecter, apurer et analyser les données."
    ],
    publicCible: [
      "Institutions statistiques et ministères.",
      "Bailleurs, organisations internationales et ONG.",
      "Entreprises réalisant des études de satisfaction ou de marché.",
      "Chercheurs et centres d'études."
    ],
    resultatsAttendus: [
      "Un protocole d'enquête documenté.",
      "Une base de données apurée et exploitable.",
      "Un rapport d'analyse avec tableaux et graphiques.",
      "Des résultats présentés aux parties prenantes."
    ]
  },
  'etudes socio economiques': {
    imageUrl: photo('1687422808565-929533931584'),
    description: "Connaître les conditions de vie et les comportements économiques permet de mieux cibler les interventions. Nous réalisons des analyses de vulnérabilité, des profils de pauvreté, des études de marché et des études de référence.",
    objectives: [
      "Caractériser les ménages, les communautés et les acteurs économiques.",
      "Analyser les vulnérabilités et les dynamiques de pauvreté.",
      "Évaluer la demande et le potentiel des marchés.",
      "Établir des situations de référence pour les projets."
    ],
    publicCible: [
      "Ministères sociaux et programmes de protection sociale.",
      "ONG et agences de développement.",
      "Entreprises préparant une implantation ou un lancement.",
      "Collectivités territoriales."
    ],
    resultatsAttendus: [
      "Un rapport d'étude riche en données de terrain.",
      "Des groupes cibles mieux identifiés.",
      "Une situation de référence pour mesurer les évolutions.",
      "Des recommandations adaptées au contexte local."
    ]
  },
  'econometrie et analyse de donnees': {
    imageUrl: photo('1551288049-bebda4e38f71'),
    description: "Derrière les chiffres se trouvent des relations à expliquer et à prévoir. Nous réalisons des modélisations économétriques et des analyses de données avancées sous Stata, R et Python, et nous en restituons clairement les résultats.",
    objectives: [
      "Préparer et structurer les jeux de données.",
      "Choisir et estimer les modèles adaptés à la question posée.",
      "Tester la robustesse des résultats.",
      "Traduire les résultats en messages compréhensibles par les décideurs."
    ],
    publicCible: [
      "Économistes, statisticiens et analystes.",
      "Institutions financières et banques.",
      "Ministères de l'économie et instituts de recherche.",
      "Entreprises exploitant de grands volumes de données."
    ],
    resultatsAttendus: [
      "Des modèles documentés et reproductibles.",
      "Des prévisions et des analyses d'effets argumentées.",
      "Un rapport lisible, avec des graphiques clairs.",
      "Des scripts remis pour poursuivre les analyses."
    ]
  },
  'etudes sectorielles specialisees': {
    imageUrl: photo('1508514177221-188b1cf16e9d'),
    description: "Chaque secteur a ses acteurs, ses règles et ses tendances. Nous réalisons des diagnostics approfondis, notamment dans l'énergie, l'éducation et d'autres secteurs clés, pour éclairer les politiques publiques et les décisions d'investissement.",
    objectives: [
      "Dresser l'état des lieux du secteur et de ses acteurs.",
      "Analyser le cadre réglementaire et institutionnel.",
      "Identifier les contraintes et les opportunités.",
      "Proposer des orientations stratégiques et des pistes d'investissement."
    ],
    publicCible: [
      "Ministères sectoriels et autorités de régulation.",
      "Investisseurs et entreprises du secteur étudié.",
      "Bailleurs et banques de développement.",
      "Organisations professionnelles."
    ],
    resultatsAttendus: [
      "Un diagnostic sectoriel complet.",
      "Une cartographie des acteurs et des enjeux.",
      "Des opportunités et des risques clairement identifiés.",
      "Des recommandations utilisables pour décider."
    ]
  },

  // Conseil stratégique et organisationnel
  'strategie d entreprise et vision': {
    imageUrl: photo('1528819622765-d6bcf132f793'),
    description: "Une stratégie claire donne un cap et aide à dire non. Nous conduisons des diagnostics SWOT et PESTEL, animons la réflexion des dirigeants et formalisons des plans stratégiques pluriannuels traduits en actions et en indicateurs.",
    objectives: [
      "Analyser l'environnement, les forces et les faiblesses de l'organisation.",
      "Formuler la vision, la mission et les axes stratégiques.",
      "Élaborer un plan stratégique pluriannuel.",
      "Traduire la stratégie en plan d'actions et en indicateurs."
    ],
    publicCible: [
      "Dirigeants et comités de direction.",
      "Conseils d'administration.",
      "Entreprises, institutions publiques et ONG.",
      "Organisations en phase de croissance ou de repositionnement."
    ],
    resultatsAttendus: [
      "Un diagnostic stratégique partagé.",
      "Un plan stratégique validé par la direction.",
      "Un plan d'actions avec responsables et échéances.",
      "Des indicateurs pour suivre la mise en œuvre."
    ]
  },
  'organisation et processus': {
    imageUrl: photo('1769738360873-3ba6cac0b308'),
    description: "Des responsabilités floues et des procédures absentes coûtent du temps et de l'argent. Nous cartographions les processus métiers, révisons les organigrammes, rédigeons les fiches de postes et les manuels de procédures.",
    objectives: [
      "Cartographier et analyser les processus existants.",
      "Simplifier les circuits de décision et de traitement.",
      "Clarifier les organigrammes et les fiches de postes.",
      "Rédiger des manuels de procédures applicables."
    ],
    publicCible: [
      "Directions générales et directions de l'organisation.",
      "Responsables RH, qualité et contrôle interne.",
      "Entreprises en croissance et institutions publiques.",
      "Projets et ONG soumis à des exigences de bailleurs."
    ],
    resultatsAttendus: [
      "Une cartographie claire des processus.",
      "Un organigramme et des fiches de postes à jour.",
      "Des manuels de procédures validés.",
      "Des délais de traitement mieux maîtrisés."
    ]
  },
  'gestion des ressources humaines et gpec': {
    imageUrl: photo('1573497491208-6b1acb260507'),
    description: "Anticiper les compétences de demain est un avantage décisif. Nous accompagnons la gestion prévisionnelle des emplois et des compétences, avec des référentiels de métiers, des grilles salariales, des systèmes d'évaluation et des plans de succession.",
    objectives: [
      "Élaborer les référentiels de métiers et de compétences.",
      "Analyser les écarts entre besoins et ressources.",
      "Structurer les grilles salariales et les systèmes d'évaluation.",
      "Préparer les plans de carrière et de succession."
    ],
    publicCible: [
      "Directions des ressources humaines.",
      "Directions générales et managers.",
      "Entreprises, établissements publics et parapublics.",
      "ONG et organisations en croissance."
    ],
    resultatsAttendus: [
      "Un référentiel de métiers et de compétences.",
      "Une politique salariale plus lisible et plus équitable.",
      "Un dispositif d'évaluation appliqué.",
      "Des postes clés couverts par un plan de succession."
    ]
  },
  'conduite du changement et culture': {
    imageUrl: photo('1600880292089-90a7e086ee0c'),
    description: "Une transformation réussit lorsque les personnes y adhèrent. Nous accompagnons les fusions, les réorganisations et les projets de digitalisation par l'analyse des résistances, la communication, l'implication des managers et le suivi de l'adoption.",
    objectives: [
      "Évaluer l'impact du changement sur les équipes.",
      "Identifier les freins et les relais de changement.",
      "Élaborer un plan de communication et d'accompagnement.",
      "Préparer les managers à porter la transformation."
    ],
    publicCible: [
      "Dirigeants et chefs de projets de transformation.",
      "Directions des ressources humaines et de la communication.",
      "Managers et équipes concernés.",
      "Organisations en fusion, restructuration ou digitalisation."
    ],
    resultatsAttendus: [
      "Un plan d'accompagnement du changement.",
      "Des managers mobilisés et mieux outillés.",
      "Des inquiétudes prises en compte et une communication claire.",
      "Une adoption des nouvelles pratiques suivie dans le temps."
    ]
  },
  'audit organisationnel': {
    imageUrl: photo('1635859890085-ec8cb5466806'),
    description: "Un regard extérieur et structuré révèle ce qui freine la performance. Nous évaluons la stratégie, les structures, les processus, les ressources et le management, et nous proposons un plan de redressement ou d'amélioration priorisé.",
    objectives: [
      "Évaluer la cohérence entre stratégie, structure et moyens.",
      "Analyser le fonctionnement des services et des processus.",
      "Identifier les dysfonctionnements et leurs causes.",
      "Proposer un plan d'amélioration priorisé."
    ],
    publicCible: [
      "Conseils d'administration et directions générales.",
      "Ministères de tutelle et établissements publics.",
      "Entreprises et ONG en réorganisation.",
      "Bailleurs souhaitant évaluer des structures partenaires."
    ],
    resultatsAttendus: [
      "Un rapport d'audit objectif et argumenté.",
      "Des dysfonctionnements identifiés et hiérarchisés.",
      "Un plan d'actions réaliste et chiffré lorsque nécessaire.",
      "Une base claire pour décider de la réorganisation."
    ]
  },
  'gouvernance et ethique': {
    imageUrl: photo('1573167507387-6b4b98cb7c13'),
    description: "Une bonne gouvernance protège l'organisation et inspire confiance. Nous accompagnons les conseils d'administration, la rédaction de chartes déontologiques et la mise en place de dispositifs de conformité et de lutte contre la corruption.",
    objectives: [
      "Clarifier les rôles du conseil et de la direction.",
      "Élaborer les chartes, codes et règlements intérieurs.",
      "Mettre en place des dispositifs de conformité et d'alerte.",
      "Former les administrateurs et les dirigeants."
    ],
    publicCible: [
      "Administrateurs et présidents de conseils.",
      "Directions générales, juridiques et de la conformité.",
      "Entreprises, établissements publics et sociétés d'État.",
      "ONG, associations et organisations faîtières."
    ],
    resultatsAttendus: [
      "Des organes de gouvernance mieux organisés.",
      "Une charte déontologique adoptée et diffusée.",
      "Des risques de non-conformité mieux maîtrisés.",
      "Une transparence accrue vis-à-vis des partenaires."
    ]
  }
};

export const axisKey = (title: string) => title
  .replace(/^\s*\d+\s*[.)-]\s*/, '')
  .replace(/œ/gi, 'oe')
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

// Below these lengths a text is a one-line summary or a generic placeholder, not a real description
const MIN_DESCRIPTION = 120;
const isThinList = (list?: string[]) => !list || list.length < 2 || list.every(item => item.length < 40);

function enrichAxis(sub: SubDomain): SubDomain {
  const sheet = AXIS_SHEETS[axisKey(sub.title)];
  if (!sheet) return sub;
  return {
    ...sub,
    presentationService: (sub.presentationService || '').length >= MIN_DESCRIPTION ? sub.presentationService : sheet.description,
    objectives: isThinList(sub.objectives) ? sheet.objectives : sub.objectives,
    publicCible: sub.publicCible?.length ? sub.publicCible : sheet.publicCible,
    resultatsAttendus: sub.resultatsAttendus?.length ? sub.resultatsAttendus : sheet.resultatsAttendus,
    imageUrl: sub.imageUrl || sheet.imageUrl
  };
}

/** The domains as displayed: what the admin entered, completed by the reference sheets */
export function enrichDomains<T extends DomainIntervention>(domains: T[]): T[] {
  return domains.map(domain => {
    const sheet = DOMAIN_SHEETS[domain.id];
    return {
      ...domain,
      subDomains: (domain.subDomains || []).map(enrichAxis),
      ...(sheet ? {
        description: (domain.description || '').length >= 200 ? domain.description : sheet.description,
        objectives: isThinList(domain.objectives) ? sheet.objectives : domain.objectives,
        publicCible: domain.publicCible?.length ? domain.publicCible : sheet.publicCible,
        resultatsAttendus: domain.resultatsAttendus?.length ? domain.resultatsAttendus : sheet.resultatsAttendus,
        imageUrl: domain.imageUrl || sheet.imageUrl
      } : {})
    };
  });
}
