import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, BookOpen, Clock, BarChart, GraduationCap, 
  MapPin, CheckCircle, Calendar, Send, HelpCircle, ArrowLeft, Terminal, 
  AlertCircle, TrendingUp, Cpu, Map, ShieldAlert, FileSpreadsheet, Layers, 
  Users, CheckSquare, CornerDownRight, ChevronRight, Briefcase, Building2,
  FileText, MessageSquare
} from 'lucide-react';
import { FORMATIONS, DOMAINS_INTERVENTION } from '../data';
import { Formation, DomainIntervention, SubDomain } from '../types';

export function getTailoredDataForAxis(title: string, sub: any) {
  const t = title.toLowerCase();
  
  let objectives = sub.objectives || [
    `Maîtriser les méthodologies d'excellence appliquées à : ${title}.`,
    "Acquérir les techniques de conception, de structuration et de pilotage opérationnel.",
    "Développer une expertise technique autonome conforme aux standards internationaux.",
    "Savoir manager des projets complexes de bout en bout et diriger les équipes d'exécution."
  ];
  
  let results = [
    "Obtention de la Certification professionnelle officielle délivrée par le Cabinet CICEXF.",
    "Validation de vos acquis techniques via une étude de cas pratique d'envergure réelle.",
    "Capacité opérationnelle immédiate de niveau exécutif sur votre poste de travail.",
    "Accès privilégié au réseau d'alumni, d'experts et d'opportunités d'affaires du CICEXF."
  ];
  
  let opportunities = [
    "Consultant sénior / Expert métier indépendant auprès de cabinets internationaux",
    `Directeur / Responsable de pôle dédié : ${title}`,
    "Chef de projet ou conseiller technique auprès d'institutions publiques et ONG internationales",
    "Auditeur de conformité ou expert en optimisation des processus organisationnels"
  ];

  let extraAxes = [
    {
      label: "Projet Pratique Réel",
      value: "Développement d'un projet de fin d'études basé sur un cas réel d'organisation (étude d'impact, modèle financier ou audit complet)."
    },
    {
      label: "Accompagnement Post-Formation",
      value: "3 mois d'assistance technique post-formation avec nos experts pour faciliter l'intégration des acquis sur vos dossiers."
    }
  ];

  if (t.includes('financ') || t.includes('invest') || t.includes('compta')) {
    objectives = [
      "Structurer des modèles de prévision financière dynamiques de haut niveau sous Microsoft Excel.",
      "Maîtriser l'évaluation d'entreprise (méthodes DCF, Multiples) et l'ingénierie financière des projets.",
      "Piloter le contrôle de gestion stratégique et concevoir des tableaux de bord financiers décisionnels.",
      "Garantir la conformité comptable, fiscale et optimiser la structure financière des organisations."
    ];
    results = [
      "Capacité autonome à bâtir un modèle financier complet à 3 états de niveau banque d'affaires.",
      "Maîtrise de la méthodologie d'audit financier et fiscal et rédaction de notes de synthèse destinées au Conseil.",
      "Certificat d'Expert en Ingénierie Financière et Modélisation délivré par le CICEXF.",
      "92% d'amélioration de la productivité sur Excel grâce à la maîtrise des raccourcis avancés de modélisation."
    ];
    opportunities = [
      "Directeur Financier (DAF) / Contrôleur de Gestion stratégique",
      "Analyste Financier / Chargé d'affaires en banque d'affaires, Private Equity ou fonds d'investissement",
      "Consultant en Restructuration Financière / Auditeur senior en cabinet d'audit",
      "Expert en financement de projets d'infrastructure auprès de bailleurs internationaux (Banque Mondiale, BAD, etc.)"
    ];
  } else if (t.includes('informatique') || t.includes('système') || t.includes('développement') || t.includes('sécurité') || t.includes('digital')) {
    objectives = [
      "Concevoir et auditer des infrastructures réseau hautement sécurisées et résilientes.",
      "Maîtriser l'architecture des systèmes d'information modernes et la gouvernance IT.",
      "Piloter des projets complexes de transformation digitale au sein d'organisations de grande envergure.",
      "Détecter et corriger les vulnérabilités de sécurité selon les standards ISO 27001."
    ];
    results = [
      "Maîtrise opérationnelle des architectures systèmes d'information d'entreprise et des protocoles de sécurité.",
      "Capacité à réaliser un audit de sécurité complet et à concevoir un plan de reprise d'activité (PRA).",
      "Certificat d'Expert en Architecture SI et Sécurité Digitale délivré par le CICEXF.",
      "Savoir coder et automatiser des flux opérationnels à l'aide d'outils modernes et d'IA."
    ];
    opportunities = [
      "Architecte de Systèmes d'Information / Directeur des Systèmes d'Information (DSI)",
      "Responsable de la Sécurité des Systèmes d'Information (RSSI)",
      "Chef de Projet Digital / Consultant en Transformation Numérique des Entreprises",
      "Auditeur IT / Consultant en cybersécurité pour de grandes organisations"
    ];
  } else if (t.includes('qhse') || t.includes('norme') || t.includes('risque') || t.includes('environnement')) {
    objectives = [
      "Maîtriser les exigences clés des normes de management intégrées ISO 9001 (Qualité), ISO 14001 (Environnement), ISO 45001 (SST).",
      "Concevoir, implémenter et piloter un Système de Management Intégré (SMI) de A à Z.",
      "Planifier et réaliser des audits internes QHSE rigoureux conformément à la norme ISO 19011.",
      "Identifier, évaluer et atténuer les risques industriels et professionnels d'une entreprise."
    ];
    results = [
      "Maîtrise complète de la méthodologie de l'audit interne multi-référentiel ISO.",
      "Aptitude à rédiger un rapport d'audit officiel conforme à l'ISO 19011 et à formuler des plans d'actions correctives.",
      "Obtention du Certificat d'Auditeur Interne QHSE de niveau international délivré par le CICEXF.",
      "Capacité immédiate à structurer un SMI et à accompagner l'entreprise vers la certification."
    ];
    opportunities = [
      "Responsable ou Ingénieur QHSE au sein d'entreprises industrielles, pétrolières, minières ou de services",
      "Auditeur interne / externe QHSE pour des organismes de certification ou cabinets conseils",
      "Consultant en Systèmes de Management de la Qualité et Environnemental",
      "Directeur de la Prévention et de la Sécurité au Travail"
    ];
  } else if (t.includes('projet') || t.includes('étude') || t.includes('planification') || t.includes('suivi')) {
    objectives = [
      "Maîtriser le cycle complet de gestion de projet (conception, planification, exécution, suivi-évaluation, clôture).",
      "Savoir concevoir des cadres logiques et des systèmes de suivi-évaluation de niveau international.",
      "Maîtriser les techniques d'estimations des coûts, d'ordonnancement (Gantt, chemin critique) et de gestion des risques.",
      "Piloter l'avancement physique et financier d'un projet à l'aide de la méthode de la valeur acquise (EVM)."
    ];
    results = [
      "Autonomie totale pour élaborer une proposition de projet complète et convaincante pour des bailleurs de fonds.",
      "Aptitude à concevoir un plan d'action opérationnel et un tableau de bord de suivi-évaluation dynamique.",
      "Certificat de Spécialiste en Suivi-Évaluation et Gestion de Projets du CICEXF.",
      "Mise en place d'un système de gestion de projet collaboratif en ligne opérationnel."
    ];
    opportunities = [
      "Chef de Projet / Directeur de Programme au sein d'ONG nationales et internationales",
      "Responsable du Suivi-Évaluation de projets de développement ou de programmes publics",
      "Consultant sénior en évaluation d'impacts de projets et capitalisation des acquis",
      "Chargé d'études socio-économiques ou analyste de projets au sein de banques de développement"
    ];
  } else if (t.includes('territoire') || t.includes('carto') || t.includes('sig') || t.includes('gouvernance') || t.includes('commune') || t.includes('local')) {
    objectives = [
      "Maîtriser l'outil de référence QGIS pour le traitement, l'analyse et la représentation de données géospatiales.",
      "Concevoir des plans locaux d'aménagement, d'urbanisme et de développement local concertés.",
      "Structurer des bases de données cartographiques et cadastrales pour optimiser la fiscalité locale.",
      "Piloter les dynamiques de décentralisation, de développement territorial et de gouvernance locale."
    ];
    results = [
      "Autonomie complète pour réaliser des cartes thématiques, des analyses spatiales et des requêtes cadastrales complexes.",
      "Aptitude à concevoir un diagnostic territorial multidimensionnel intégrant cartographie numérique et participation locale.",
      "Certificat d'Expert en SIG appliqué au Développement Local délivré par le CICEXF.",
      "Conception de 2 cartes professionnelles réelles à intégrer directement dans votre portfolio professionnel."
    ];
    opportunities = [
      "Expert en SIG / Cartographe au sein de collectivités territoriales, mairies ou ministères",
      "Urbaniste / Planificateur de territoires / Aménagiste au sein de bureaux d'études spécialisés",
      "Chargé de programmes de développement local auprès d'ONG internationales",
      "Conseiller technique en décentralisation et gouvernance locale auprès des communes"
    ];
  } else if (t.includes('formation') || t.includes('pédagogique') || t.includes('facil') || t.includes('andragogie')) {
    objectives = [
      "Maîtriser l'ingénierie pédagogique moderne basée sur l'Approche Par Compétences (APC).",
      "Savoir concevoir des curricula de formation et des livrets didactiques interactifs de haut niveau.",
      "Acquérir les techniques de facilitation et d'animation andragogique d'excellence pour adultes.",
      "Concevoir et évaluer l'impact et le retour sur investissement (ROI) des dispositifs de formation."
    ];
    results = [
      "Capacité autonome à mener un diagnostic des besoins de formation de niveau stratégique.",
      "Production d'un kit de formation complet (support animateur, livret apprenant, grilles d'évaluation) validé devant jury.",
      "Certificat de Master Formateur Certifié CICEXF.",
      "Intégration du pool d'experts formateurs agréés pour les missions nationales et internationales du CICEXF."
    ];
    opportunities = [
      "Directeur de la Formation / Responsable du Développement des Compétences RH en entreprise",
      "Ingénieur Pédagogique / Concepteur de curricula d'enseignement",
      "Formateur de formateurs / Consultant sénior en renforcement de capacités",
      "Responsable de pôle E-learning / Technopédagogue au sein d'instituts de formation ou universités"
    ];
  } else if (t.includes('accompagnement') || t.includes('assistance') || t.includes('politique') || t.includes('procédure')) {
    objectives = [
      "Concevoir et déployer des cadres d'assistance technique de haut niveau adaptés aux réformes publiques.",
      "Rédiger des manuels de politiques et procédures internes rigoureux conformes aux exigences internationales.",
      "Gérer les programmes de partenariats stratégiques et mobiliser les ressources financières faiblement.",
      "Mettre en place des modèles de management stratégique et optimiser les flux commerciaux des marchés."
    ];
    results = [
      "Aptitude à structurer un plan de réforme institutionnelle et de dialogue multipartite d'excellence.",
      "Conception d'un manuel de procédures administratives, financières ou commerciales de niveau exécutif.",
      "Certificat d'Expert en Accompagnement Institutionnel délivré par le CICEXF.",
      "Savoir négocier avec les bailleurs de fonds de premier plan et rédiger des appels d'offres internationaux."
    ];
    opportunities = [
      "Conseiller Technique d'Institutions Publiques, Cabinets Ministériels ou Organisations Internationales",
      "Directeur des Opérations / Responsable des Partenariats stratégiques",
      "Consultant en Organisation et Conduite du Changement",
      "Expert en procédures d'achat et passation de marchés publics"
    ];
  }

  return { objectives, results, opportunities, extraAxes };
}

function getDeepPresentation(sub: any) {
  const title = sub.title;
  const t = title.toLowerCase();
  
  let contexte = `Dans un environnement économique caractérisé par de profondes mutations et une exigence accrue de performance, la maîtrise de "${title}" est devenue un impératif de premier ordre. Les organisations modernes font face à des défis d'agilité, de conformité et de compétitivité qui nécessitent de restructurer scientifiquement leurs pratiques d'ingénierie et d'organisation opérationnelle.`;
  
  let argumentsSolides = [
    {
      titre: "Évaluation Scientifique et Systémique",
      description: `Nous dépassons les simples observations superficielles en réalisant des analyses basées sur des modèles académiques et pratiques éprouvés, permettant de cartographier avec exactitude les forces, les goulots d'étranglement et les opportunités d'amélioration.`
    },
    {
      titre: "Alignement Opérationnel Direct",
      description: `Chaque composante de cet axe est conçue pour correspondre directement aux réalités de terrain. Nous combinons les apports conceptuels avec le déploiement immédiat d'outils de pointe indispensables pour accélérer les prises de décisions.`
    },
    {
      titre: "Pérennisation des Compétences",
      description: `Notre démarche vise un transfert de compétences intégral de haut niveau. Les collaborateurs acquièrent non seulement les méthodologies d'exécution, mais également la capacité de piloter de manière autonome les futurs chantiers de transformation.`
    }
  ];

  let plusValue = "Cette expertise de pointe repose sur l'expérience cumulée de nos experts de niveau international et sur l'utilisation intensive des technologies digitales et des référentiels de conformité les plus exigeants.";

  if (t.includes('audit') || t.includes('diagnostic')) {
    contexte = "L'audit et le diagnostic organisationnel constituent la pierre angulaire de toute démarche de transformation réussie. Face à des structures parfois rigides ou à des processus obsolètes, cette démarche permet d'apporter une vision factuelle, objective et mesurable du fonctionnement interne de l'entreprise. C'est l'outil indispensable pour aligner les ressources humaines et techniques sur la stratégie globale de la direction générale.";
    argumentsSolides = [
      {
        titre: "Cadrage Analytique de Haute Précision",
        description: "Nous réalisons un diagnostic complet des flux informationnels, des processus décisionnels et de l'adéquation postes-profils, garantissant une identification objective des dysfonctionnements majeurs et des goulots d'étranglement."
      },
      {
        titre: "Optimisation Rentable des Processus",
        description: "À travers la restructuration des organigrammes et la clarification des rôles, nous visons l'augmentation immédiate de la productivité collective, la réduction des doublons et la fluidification des circuits de validation."
      },
      {
        titre: "Accompagnement Rigoureux au Changement",
        description: "Nous fournissons une feuille de route claire avec des recommandations hiérarchisées par priorité d'impact, tout en mobilisant l'ensemble des parties prenantes pour assurer une transition harmonieuse et acceptée."
      }
    ];
    plusValue = "Un audit réussi avec le CICEXF garantit une réduction des coûts opérationnels et une élévation significative de la maturité organisationnelle globale de votre entité.";
  } else if (t.includes('financ') || t.includes('compt') || t.includes('fiscal') || t.includes('modélisation')) {
    contexte = "La pérennité et l'expansion d'une entreprise reposent fondamentalement sur la rigueur de sa gestion financière et sur sa capacité à optimiser ses ressources de manière stratégique. Cet axe d'ingénierie financière combine une modélisation mathématique robuste avec des analyses prévisionnelles avancées, offrant aux dirigeants des outils d'aide à la décision incontestables face aux marchés et aux investisseurs.";
    argumentsSolides = [
      {
        titre: "Modélisation Financière Rigoureuse",
        description: "Maîtrisez la construction de modèles financiers d'entreprise complexes sous Excel, intégrant des analyses de sensibilité, des simulations de scénarios et la projection dynamique des états financiers (Bilan, Compte de Résultat, Flux de Trésorerie)."
      },
      {
        titre: "Ingénierie du Choix d'Investissement",
        description: "Apprenez à évaluer scientifiquement la rentabilité de vos projets d'investissement à l'aide des indicateurs financiers de référence (VAN, TRI, DR, ROCE) et à structurer des montages de financement complexes conformes aux standards internationaux."
      },
      {
        titre: "Maîtrise Interne du Risque Fiscal",
        description: "Sécurisez l'ensemble de vos transactions et optimisez la charge fiscale de l'entreprise dans le respect strict des réglementations en vigueur, tout en préparant efficacement les équipes aux contrôles de l'administration."
      }
    ];
    plusValue = "Bénéficiez d'une double expertise technique et stratégique pour piloter la croissance financière de votre organisation de manière saine et pérenne.";
  } else if (t.includes('planification') || t.includes('stratég')) {
    contexte = "Naviguer dans l'incertitude exige plus qu'une simple vision : il faut une feuille de route stratégique claire, robuste et déclinable de façon opérationnelle. La planification stratégique selon le standard du cabinet CICEXF structure vos ambitions à moyen et long terme à travers des indicateurs clés de performance et des jalons de réussite précis.";
    argumentsSolides = [
      {
        titre: "Diagnostic Stratégique Holistique",
        description: "Nous étudions en profondeur vos environnements internes et externes à l'aide de matrices d'analyse stratégique croisées (SWOT, PESTEL, Forces de Porter) pour cerner vos avantages concurrentiels réels."
      },
      {
        titre: "Cocréation de la Vision Stratégique",
        description: "Nous facilitons vos retraites stratégiques et séminaires de direction pour formuler une vision claire, partagée et déclinée en plans d'actions sectoriels chiffrés et réalistes."
      },
      {
        titre: "Gouvernance et Pilotage des Écarts",
        description: "Nous mettons en place des tableaux de bord prospectifs (Balanced Scorecards) et formons vos équipes à mesurer l'exécution pour opérer des ajustements stratégiques agiles en temps réel."
      }
    ];
    plusValue = "Assurez l'alignement total de vos équipes opérationnelles avec la vision à long terme portée par le Conseil d'Administration.";
  } else if (t.includes('formation') || t.includes('pédagog') || t.includes('capacit') || t.includes('compétence')) {
    contexte = "Le capital humain est la ressource la plus précieuse d'une organisation performante. L'ingénierie de la formation permet de concevoir des programmes d'apprentissage à fort impact, directement corrélés aux besoins de performance identifiés sur les postes de travail. Nous transformons le savoir en levier de croissance mesurable.";
    argumentsSolides = [
      {
        titre: "Ingénierie de Cadrage Pédagogique",
        description: "De l'analyse fine des écarts de compétences à la rédaction de référentiels d'évaluation rigoureux, nous structurons vos cursus selon les meilleures normes internationales d'andragogie."
      },
      {
        titre: "Animation d'Ateliers Pratiques",
        description: "Nos sessions privilégient les simulations réelles, les cas d'études d'entreprise et l'utilisation de logiciels professionnels pour ancrer durablement la maîtrise opérationnelle."
      },
      {
        titre: "Évaluation et Retour sur Investissement",
        description: "Nous mesurons l'efficacité des apprentissages à travers des indicateurs de transfert opérationnel en situation réelle de travail, garantissant la rentabilité de votre investissement."
      }
    ];
    plusValue = "Des collaborateurs immédiatement opérationnels, autonomes et hautement qualifiés pour mener à bien leurs missions stratégiques.";
  } else if (t.includes('informatique') || t.includes('système') || t.includes('gouvernance it') || t.includes('digital') || t.includes('technologique')) {
    contexte = "La transformation numérique n'est plus une option, mais un vecteur essentiel de compétitivité et de continuité de service. L'architecture de vos systèmes d'information doit être à la fois agile, robuste, interconnectée et hautement sécurisée pour soutenir efficacement vos processus métiers critiques.";
    argumentsSolides = [
      {
        titre: "Urbanisation du Système d'Information",
        description: "Nous vous apprenons à cartographier et réorganiser vos applications et infrastructures technologiques pour éliminer les silos de données et garantir une interopérabilité sans faille."
      },
      {
        titre: "Gouvernance IT de Standard Mondial",
        description: "Alignez la gestion de vos services technologiques sur les meilleurs référentiels du marché (COBIT, ITIL) afin de maximiser la création de valeur et d'optimiser la gestion des budgets IT."
      },
      {
        titre: "Cahier des Charges et Pilotage de Projets",
        description: "Rédigez des spécifications techniques irréprochables et pilotez vos intégrateurs de logiciels complexes pour éliminer tout risque de dérive budgétaire ou temporelle."
      }
    ];
    plusValue = "Un système d'information performant, sécurisé et totalement orienté vers la réussite de vos objectifs métiers.";
  } else if (t.includes('qhse') || t.includes('norme') || t.includes('sécurité') || t.includes('qualité') || t.includes('environnement') || t.includes('risques')) {
    contexte = "L'excellence opérationnelle et la responsabilité sociétale exigent un engagement sans faille envers les normes QHSE (Qualité, Hygiène, Sécurité, Environnement). L'instauration d'une culture de conformité et de prévention des risques protège non seulement vos collaborateurs et l'environnement, mais valorise également l'image de marque de votre entité auprès de vos partenaires d'affaires mondiaux.";
    argumentsSolides = [
      {
        titre: "Déploiement de SMI Normatifs",
        description: "Maîtrisez les méthodologies d'implémentation de Systèmes de Management Intégrés selon les référentiels ISO 9001 (Qualité), ISO 14001 (Environnement) et ISO 45001 (Santé et Sécurité au Travail)."
      },
      {
        titre: "Analyse Avancée des Risques",
        description: "Mettez en place des analyses de risques rigoureuses (Document Unique, AMDEC, HAZOP) pour anticiper les accidents industriels et préserver l'outil de production."
      },
      {
        titre: "Audits de Conformité Internes",
        description: "Formez vos cadres à mener des audits internes rigoureux et constructifs selon la norme ISO 19011 pour identifier de manière proactive les axes d'amélioration continue."
      }
    ];
    plusValue = "Un environnement de travail sûr, hautement productif, et une conformité réglementaire absolue pour sécuriser vos contrats.";
  } else if (t.includes('projet') || t.includes('suivi') || t.includes('évaluation') || t.includes('programmes')) {
    contexte = "Un projet bien conçu n'a de valeur que s'il est exécuté de manière chirurgicale et suivi rigoureusement. La gestion de projets complexes requiert une maîtrise parfaite des budgets, des plannings, des risques et des livrables, associée à des outils d'évaluation de l'impact réel pour garantir la satisfaction des commanditaires.";
    argumentsSolides = [
      {
        titre: "Planification Opérationnelle Avancée",
        description: "Maîtrisez les outils modernes d'ordonnancement de projets (diagramme de Gantt, PERT) et l'affectation optimale des ressources critiques avec des logiciels leaders de l'industrie."
      },
      {
        titre: "Système de Suivi-Évaluation d'Impact",
        description: "Concevez des cadres logiques robustes et des indicateurs de performance clés (SMART) pour suivre l'avancement physique et financier des activités en temps réel."
      },
      {
        titre: "Management Agile des Risques Projet",
        description: "Identifiez de manière proactive les dérives potentielles de coûts ou de délais et mettez en œuvre des stratégies d'atténuation efficaces pour sécuriser vos livrables."
      }
    ];
    plusValue = "Une exécution de projet fluide et performante, totalement transparente pour les investisseurs et bailleurs de fonds.";
  } else if (t.includes('territoire') || t.includes('public') || t.includes('décentralis') || t.includes('communal') || t.includes('local')) {
    contexte = "Le développement local et l'administration des collectivités territoriales requièrent des compétences d'ingénierie publique très spécifiques. Face aux enjeux de la décentralisation, de l'aménagement durable et du financement local, nos programmes renforcent l'efficacité des agents publics pour délivrer des services de qualité aux populations.";
    argumentsSolides = [
      {
        titre: "Ingénierie des Financements Locaux",
        description: "Optimisez la mobilisation des ressources financières endogènes (fiscalité locale, redevances) et maîtrisez l'accès aux financements extérieurs et partenariats public-privé (PPP)."
      },
      {
        titre: "Planification Territoriale Durable",
        description: "Concevez des Schémas Directeurs d'Aménagement et des Plans de Développement Communaux (PDC) intégrant les contraintes de durabilité environnementale et d'urbanisme."
      },
      {
        titre: "Modernisation des Services Publics",
        description: "Améliorez la performance globale de l'administration locale par l'optimisation de l'accueil, la dématérialisation des procédures et le management d'excellence des équipes communales."
      }
    ];
    plusValue = "Une gouvernance locale performante et structurée pour faire de votre collectivité un pôle de développement attractif et dynamique.";
  }

  return { contexte, argumentsSolides, plusValue };
}

function SubDomainCard({ sub, sIdx, setCorpInterest, renderIcon, onClickCard, isLarge }: any) {
  const [activeCardTab, setActiveCardTab] = useState<'info' | 'objectives' | 'results' | 'opportunities' | 'plus'>('info');
  const data = getTailoredDataForAxis(sub.title, sub);

  if (isLarge) {
    return (
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col h-full animate-in fade-in duration-300"
      >
        {/* Immersive Banner Image */}
        {sub.imageUrl && (
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100 shrink-0">
            <img
              src={sub.imageUrl}
              alt={sub.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-1">
              <span className="self-start font-mono font-bold text-[9px] text-white bg-brand-emerald/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Spécialité 0{sIdx + 1}
              </span>
              <h1 className="font-display font-extrabold text-base sm:text-lg lg:text-xl text-white leading-tight drop-shadow-md">
                {sub.title}
              </h1>
            </div>
          </div>
        )}

        <div className="px-6 sm:px-8 pb-4 space-y-6 lg:overflow-y-auto lg:flex-grow lg:flex-1 scrollbar-thin pr-2 pt-4">
          {/* Section 1: Presentation & Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Contexte & Enjeux */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 space-y-2">
              <span className="text-[9px] font-extrabold text-brand-emerald uppercase tracking-widest block">
                Contexte &amp; Enjeux Stratégiques
              </span>
              <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-justify">
                {getDeepPresentation(sub).contexte}
              </p>
            </div>

            {/* Valeur Ajoutée */}
            <div className="p-4 rounded-2xl bg-brand-blue/5 dark:bg-blue-950/20 border border-brand-blue/10 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-extrabold text-brand-blue dark:text-blue-450 uppercase tracking-widest block">
                  Valeur Ajoutée CICEXF
                </span>
                <p className="text-[11.5px] text-slate-700 dark:text-slate-355 leading-relaxed text-justify italic font-medium mt-1">
                  "{getDeepPresentation(sub).plusValue}"
                </p>
              </div>
              
              {sub.expertiseLevel && (
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">Niveau Visé :</span>
                  <span className="bg-brand-emerald/15 text-brand-emerald text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {sub.expertiseLevel}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Objectives & Key Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Objectives */}
            <div className="space-y-3 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
              <span className="block text-[9.5px] font-bold text-brand-emerald uppercase tracking-widest">
                Objectifs d'Apprentissage Clés
              </span>
              <div className="space-y-2">
                {data.objectives.map((obj, oIdx) => (
                  <div key={oIdx} className="flex items-start text-[11px]">
                    <div className="w-4 h-4 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center text-[9px] font-bold mr-2 shrink-0 mt-0.5 shadow-sm">
                      {oIdx + 1}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium leading-normal text-left">
                      {obj}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Skills & Tools */}
            <div className="space-y-3 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-widest">
                  Compétences d'Excellence Enseignées
                </span>
                {sub.keyPoints && sub.keyPoints.length > 0 ? (
                  <div className="space-y-2 text-[10.5px]">
                    {sub.keyPoints.map((kp, kpIdx) => (
                      <div key={kpIdx} className="flex items-start text-slate-600 dark:text-slate-400">
                        <CheckCircle className="w-3.5 h-3.5 text-brand-emerald mr-2 shrink-0 mt-0.5" />
                        <span className="leading-snug font-medium">{kp}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10.5px] text-slate-400 italic">Méthodologies professionnelles de pointe adaptées au continent africain.</p>
                )}
              </div>

              {sub.software && sub.software.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">Logiciels &amp; Outils de Pointe :</span>
                  <div className="flex flex-wrap gap-1 font-mono">
                    {sub.software.map((sw, swIdx) => (
                      <span
                        key={swIdx}
                        className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-750"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Deliverables / Results & Opportunities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Results / Deliverables */}
            <div className="space-y-3 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
              <span className="block text-[9.5px] font-bold text-brand-blue dark:text-blue-400 uppercase tracking-widest">
                Résultats de Fin de Cursus &amp; Livrables
              </span>
              <div className="space-y-2">
                {data.results.map((res, rIdx) => (
                  <div key={rIdx} className="flex items-start text-[11px]">
                    <CheckSquare className="w-3.5 h-3.5 text-brand-emerald mr-2.5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-350 font-semibold leading-normal text-left">
                      {res}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="space-y-3 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
              <span className="block text-[9.5px] font-bold text-purple-500 uppercase tracking-widest">
                Débouchés &amp; Carrières Visés
              </span>
              <div className="space-y-2">
                {data.opportunities.slice(0, 3).map((opp, opIdx) => (
                  <div key={opIdx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 flex items-start space-x-2.5 hover:border-brand-emerald/20 transition-all text-[11px]">
                    <Briefcase className="w-3.5 h-3.5 text-brand-emerald shrink-0 mt-0.5" />
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-left leading-tight">
                      {opp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Extra Axes (Projet & Accompagnement) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850">
            <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              Piliers de Réussite CICEXF
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.extraAxes.map((axe, axIdx) => (
                <div key={axIdx} className="space-y-0.5">
                  <span className="block text-[10px] font-extrabold text-brand-emerald uppercase tracking-wider flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mr-2" />
                    {axe.label}
                  </span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                    {axe.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick scroll-to-form button */}
        <div 
          className="p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between mt-auto"
        >
          <span className="text-[10px] text-slate-400 font-sans uppercase">CICEXF Certifié</span>
          <button
            onClick={() => {
              const el = document.getElementById('domain-quote-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setCorpInterest(sub.title);
            }}
            className="px-4 py-2 bg-brand-emerald text-white hover:bg-brand-emerald/90 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <span>S'inscrire / Devis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      key={sIdx}
      onClick={() => {
        if (!isLarge && onClickCard) {
          onClickCard();
        }
      }}
      className={`bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800 shadow-sm flex flex-col justify-between group h-full transition-all duration-300 ${
        !isLarge 
          ? 'hover:shadow-xl hover:-translate-y-1 hover:border-brand-emerald/30 cursor-pointer active:scale-[0.995]' 
          : ''
      }`}
    >
      {/* Cover illustration with hover effects and permanent specialty title */}
      {sub.imageUrl && (
        <div className="relative aspect-[16/8] w-full overflow-hidden bg-slate-100">
          <img
            src={sub.imageUrl}
            alt={sub.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3 flex flex-col space-y-1">
            <span className="self-start font-mono font-bold text-[9px] text-white bg-brand-emerald/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Spécialité 0{sIdx + 1}
            </span>
            <span className="font-display font-extrabold text-[12px] sm:text-[13.5px] text-white leading-tight drop-shadow-md">
              {sub.title}
            </span>
          </div>
        </div>
      )}

      {/* Interactive Tab Headers with Dynamic Moving Backgrounds */}
      <div 
        className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 overflow-x-auto gap-1"
        onClick={(e) => {
          if (!isLarge) {
            e.stopPropagation();
          }
        }}
      >
        <button
          onClick={() => setActiveCardTab('info')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
            activeCardTab === 'info'
              ? 'active-moving-tab text-white'
              : 'text-slate-500 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-[1.01]'
          }`}
        >
          Présentation
        </button>
        <button
          onClick={() => setActiveCardTab('objectives')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
            activeCardTab === 'objectives'
              ? 'active-moving-tab text-white'
              : 'text-slate-500 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-[1.01]'
          }`}
        >
          Objectifs
        </button>
        <button
          onClick={() => setActiveCardTab('results')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
            activeCardTab === 'results'
              ? 'active-moving-tab text-white'
              : 'text-slate-500 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-[1.01]'
          }`}
        >
          Résultats
        </button>
        <button
          onClick={() => setActiveCardTab('opportunities')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
            activeCardTab === 'opportunities'
              ? 'active-moving-tab text-white'
              : 'text-slate-500 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-[1.01]'
          }`}
        >
          Débouchés
        </button>
        <button
          onClick={() => setActiveCardTab('plus')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
            activeCardTab === 'plus'
              ? 'active-moving-tab text-white'
              : 'text-slate-500 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-[1.01]'
          }`}
        >
          + Axes
        </button>
      </div>

      {/* Card Content according to activeTab */}
      <div 
        className="p-6 sm:p-8 flex-grow space-y-4"
        onClick={(e) => {
          if (!isLarge) {
            e.stopPropagation();
          }
        }}
      >
        {activeCardTab === 'info' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="font-display font-extrabold text-base text-slate-950 dark:text-white leading-snug">
              {sub.title}
            </h3>
            
            {/* Structured developed context */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[9px] font-extrabold text-brand-emerald uppercase tracking-widest block">Contexte &amp; Enjeux Stratégiques</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-justify">
                {getDeepPresentation(sub).contexte}
              </p>
            </div>



            {/* Added Plus-Value block */}
            <div className="p-4 rounded-2xl bg-brand-blue/5 dark:bg-blue-950/20 border border-brand-blue/10 space-y-1">
              <span className="text-[9px] font-extrabold text-brand-blue dark:text-blue-450 uppercase tracking-widest block">Valeur Ajoutée CICEXF</span>
              <p className="text-[11.5px] text-slate-700 dark:text-slate-355 leading-relaxed text-justify italic font-medium">
                "{getDeepPresentation(sub).plusValue}"
              </p>
            </div>

            {/* Original elements, kept intact but visually polished */}
            {sub.keyPoints && sub.keyPoints.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Compétences d'Excellence Enseignées :</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {sub.keyPoints.map((kp, kpIdx) => (
                    <div key={kpIdx} className="flex items-start text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-emerald mr-2 shrink-0 mt-0.5" />
                      <span className="leading-snug text-[10.5px] font-medium">{kp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sub.expertiseLevel && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Niveau d'Expertise Visé :</span>
                <span className="bg-brand-emerald/10 text-brand-emerald text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {sub.expertiseLevel}
                </span>
              </div>
            )}

            {sub.software && sub.software.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Logiciels &amp; Outils de Pointe :</span>
                <div className="flex flex-wrap gap-1 font-mono">
                  {sub.software.map((sw, swIdx) => (
                    <span
                      key={swIdx}
                      className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeCardTab === 'objectives' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="block text-[10px] font-bold text-brand-emerald uppercase tracking-widest mb-1">Objectifs d'apprentissage</span>
              <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                Qu'allez-vous maîtriser durant cette formation ?
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Ces objectifs opérationnels garantissent un transfert de compétences d'impact immédiat en entreprise :
            </p>
            <div className="space-y-3 pt-1">
              {data.objectives.map((obj, oIdx) => (
                <div key={oIdx} className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center text-[10px] font-bold mr-3 shrink-0 mt-0.5">
                    {oIdx + 1}
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed text-left">
                    {obj}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeCardTab === 'results' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="block text-[10px] font-bold text-brand-blue dark:text-blue-400 uppercase tracking-widest mb-1">Résultats de fin de formation</span>
              <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                Ce avec quoi vous repartez concrètement :
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Le cabinet d'élite CICEXF s'engage sur l'excellence andragogique. Les résultats tangibles incluent :
            </p>
            <div className="space-y-3 pt-1">
              {data.results.map((res, rIdx) => (
                <div key={rIdx} className="flex items-start">
                  <CheckSquare className="w-4 h-4 text-brand-emerald mr-3 shrink-0 mt-0.5" />
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-relaxed text-left">
                    {res}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeCardTab === 'opportunities' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="block text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1">Débouchés professionnels</span>
              <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                Perspectives et débouchés de carrière :
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Cette spécialité de pointe ouvre des perspectives de carrière immédiates au plan national et international :
            </p>
            <div className="space-y-2 pt-1">
              {data.opportunities.map((opp, opIdx) => (
                <div key={opIdx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-start space-x-2 hover:border-brand-emerald/30 transition-all">
                  <Briefcase className="w-3.5 h-3.5 text-brand-emerald shrink-0 mt-0.5" />
                  <span className="text-[10.5px] font-bold text-slate-800 dark:text-slate-200 text-left leading-snug">
                    {opp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeCardTab === 'plus' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="block text-[10px] font-bold text-brand-emerald uppercase tracking-widest mb-1">Autres axes importants</span>
              <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                Piliers de réussite de nos cursus :
              </h4>
            </div>
            <div className="space-y-3 pt-1">
              {data.extraAxes.map((axe, axIdx) => (
                <div key={axIdx} className="space-y-1 p-2.5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] font-extrabold text-brand-emerald uppercase tracking-wider flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mr-2" />
                    {axe.label}
                  </span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                    {axe.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick scroll-to-form button */}
      <div 
        className="p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between mt-auto"
        onClick={(e) => {
          if (!isLarge) {
            e.stopPropagation();
          }
        }}
      >
        <span className="text-[10px] text-slate-400 font-sans uppercase">CICEXF Certifié</span>
        {isLarge ? (
          <button
            onClick={() => {
              const el = document.getElementById('domain-quote-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setCorpInterest(sub.title);
            }}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-brand-emerald hover:text-white dark:hover:bg-brand-emerald text-slate-700 dark:text-slate-300 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>S'inscrire / Devis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onClickCard) onClickCard();
            }}
            className="px-4 py-2 bg-brand-emerald text-white hover:bg-brand-emerald/90 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <span>Voir la vue large</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

interface FormationsProps {
  selectedDomainId: string | null;
  setSelectedDomainId: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
  defaultSubTab?: 'domains' | 'axes' | 'certifications';
}

const domainIllustrations: Record<string, string> = {
  'ing-formation': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
  'ing-financiere': 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=1200&q=80',
  'ing-informatique': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'ing-territoriale': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
  'ing-qhse': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  'ing-audit': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  'ing-projets': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'ing-accompagnement': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
};

const ROMAN_THEMATICS = [
  "I. INGÉNIERIE DE FORMATION ET DE RENFORCEMENT DE CAPACITÉS",
  "II. INGÉNIERIE FINANCIÈRE ET DE L'INVESTISSEMENT",
  "III. INGÉNIERIE INFORMATIQUE ET SYSTÈMES DE RÉSEAUX",
  "IV. INGÉNIERIE DE DÉVELOPPEMENT TERRITORIAL",
  "V. INGÉNIERIE QHSE (QUALITÉ – HYGIÈNE – SÉCURITÉ – ENVIRONNEMENT)",
  "VI. AUDIT, CONSULTANCE ET STRATÉGIE DE DÉVELOPPEMENT DES ORGANISATIONS",
  "VII. ÉTUDES SPÉCIALISÉES ET INGÉNIERIE DE PROJETS",
  "VIII. ACCOMPAGNEMENT TECHNIQUE ET INSTITUTIONNEL"
];

export default function Formations({ selectedDomainId, setSelectedDomainId, setActiveTab, defaultSubTab }: FormationsProps) {
  // Determine if outer routing requires a specific tab or selection
  const matchedFormation = selectedDomainId
    ? FORMATIONS.find(f => f.id === selectedDomainId || f.slug === selectedDomainId || (selectedDomainId === 'data-analyst' && f.id === 'da-master'))
    : null;
  const isOuterCert = !!matchedFormation;
  const matchedOuterDomain = selectedDomainId && !matchedFormation
    ? DOMAINS_INTERVENTION.find(d => d.id === selectedDomainId)
    : null;

  // Active sub-tab state: 'domains', 'axes', or 'certifications'
  const [activeSubTab, setActiveSubTab] = useState<'domains' | 'axes' | 'certifications'>(
    defaultSubTab || (isOuterCert ? 'certifications' : 'domains')
  );

  // Sync with prop if it changes externally
  useEffect(() => {
    if (defaultSubTab) {
      setActiveSubTab(defaultSubTab);
    }
  }, [defaultSubTab]);

  // Expanded axes for the Cartography directory view
  const [expandedAxes, setExpandedAxes] = useState<Record<string, boolean>>({});
  // Search query specifically for training axes
  const [axesSearchQuery, setAxesSearchQuery] = useState('');

  // Selected specific certified course
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(
    matchedFormation
  );

  // Selected general training domain
  const [selectedDomainObj, setSelectedDomainObj] = useState<DomainIntervention | null>(
    matchedOuterDomain || null
  );

  const [activeSubIdx, setActiveSubIdx] = useState<number | null>(null);

  // Synchronize internal views if selectedDomainId updates externally (e.g., search, home routing)
  useEffect(() => {
    setActiveSubIdx(null);
    if (selectedDomainId === 'subtab-domains') {
      setActiveSubTab('domains');
      setSelectedDomainObj(null);
      setSelectedFormation(null);
    } else if (selectedDomainId === 'subtab-axes') {
      setActiveSubTab('axes');
      setSelectedDomainObj(null);
      setSelectedFormation(null);
    } else if (selectedDomainId === 'subtab-certifications') {
      setActiveSubTab('certifications');
      setSelectedDomainObj(null);
      setSelectedFormation(null);
    } else {
      const foundFormation = selectedDomainId
        ? FORMATIONS.find(f => f.id === selectedDomainId || f.slug === selectedDomainId || (selectedDomainId === 'data-analyst' && f.id === 'da-master'))
        : null;

      if (foundFormation) {
        setActiveSubTab('certifications');
        setSelectedFormation(foundFormation);
        setSelectedDomainObj(null);
      } else if (selectedDomainId) {
        const found = DOMAINS_INTERVENTION.find(d => d.id === selectedDomainId);
        if (found) {
          setActiveSubTab('domains');
          setSelectedDomainObj(found);
          setSelectedFormation(null);
        }
      }
    }
  }, [selectedDomainId]);

  // Filters state for catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Tous');
  const [selectedLevel, setSelectedLevel] = useState('Tous');
  const [selectedModality, setSelectedModality] = useState('Tous');

  // Timeline Module expansion index
  const [expandedModule, setExpandedModule] = useState<number>(0);

  // Core Certified Course Registration Form States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSession, setFormSession] = useState('');
  const [formModality, setFormModality] = useState('Hybride');
  const [formTerms, setFormTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Corporate Domain Quote Form States
  const [corpCompany, setCorpCompany] = useState('');
  const [corpName, setCorpName] = useState('');
  const [corpEmail, setCorpEmail] = useState('');
  const [corpPhone, setCorpPhone] = useState('');
  const [corpInterest, setCorpInterest] = useState('');
  const [corpModality, setCorpModality] = useState('Intra-entreprise');
  const [corpParticipants, setCorpParticipants] = useState('5-10');
  const [corpTerms, setCorpTerms] = useState(false);
  const [corpErrors, setCorpErrors] = useState<Record<string, string>>({});
  const [corpSuccess, setCorpSuccess] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'individual' | 'corporate'>('individual');

  // Handle Certified Course selection
  const handleSelectFormation = (formation: Formation) => {
    setSelectedFormation(formation);
    setSelectedDomainId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedFormation(null);
    setSelectedDomainId(null);
    setSubmitSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDomains = () => {
    setSelectedDomainObj(null);
    setSelectedDomainId(null);
    setActiveSubIdx(null);
    setCorpSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDomainObj = (domain: DomainIntervention) => {
    setSelectedDomainObj(domain);
    setSelectedDomainId(null);
    setActiveSubIdx(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAxis = (axisTitle: string) => {
    setExpandedAxes(prev => ({
      ...prev,
      [axisTitle]: !prev[axisTitle]
    }));
  };

  const expandAllAxes = (titles: string[]) => {
    const nextExpanded: Record<string, boolean> = {};
    titles.forEach(title => {
      nextExpanded[title] = true;
    });
    setExpandedAxes(nextExpanded);
  };

  const collapseAllAxes = () => {
    setExpandedAxes({});
  };

  const handleRequestQuoteForAxis = (parentDomain: DomainIntervention, axisTitle: string) => {
    setActiveSubTab('domains');
    setSelectedDomainObj(parentDomain);
    setCorpInterest(axisTitle);
    window.scrollTo({ top: 0 });
    setTimeout(() => {
      const el = document.getElementById('domain-quote-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Submit Handler for Certified Course
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formName.trim() || formName.trim().length < 3) {
      newErrors.name = "Le nom complet doit comporter au moins 3 caractères.";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formEmail || !emailRegex.test(formEmail)) {
      newErrors.email = "Veuillez saisir une adresse email valide.";
    }

    if (!formPhone || formPhone.trim().length < 8) {
      newErrors.phone = "Le numéro de téléphone WhatsApp doit comporter au moins 8 caractères.";
    }

    if (!formSession) {
      newErrors.session = "Veuillez sélectionner la date de session.";
    }

    if (!formTerms) {
      newErrors.terms = "Vous devez accepter les conditions de traitement des données.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitSuccess(false);
    } else {
      setErrors({});
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormSession('');
      }, 3000);
    }
  };

  // Submit Handler for Corporate Inquiry
  const handleCorpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!corpName.trim() || corpName.trim().length < 3) {
      newErrors.name = "Le nom complet du contact doit comporter au moins 3 caractères.";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!corpEmail || !emailRegex.test(corpEmail)) {
      newErrors.email = "Veuillez saisir une adresse email professionnelle valide.";
    }

    if (!corpPhone || corpPhone.trim().length < 8) {
      newErrors.phone = "Le numéro de téléphone professionnel doit comporter au moins 8 caractères.";
    }

    if (!corpInterest) {
      newErrors.interest = "Veuillez sélectionner le domaine ou la spécialité d'intérêt.";
    }

    if (!corpTerms) {
      newErrors.terms = "Vous devez valider le traitement réglementaire de votre demande.";
    }

    if (Object.keys(newErrors).length > 0) {
      setCorpErrors(newErrors);
      setCorpSuccess(false);
    } else {
      setCorpErrors({});
      setCorpSuccess(true);
      setTimeout(() => {
        setCorpCompany('');
        setCorpName('');
        setCorpEmail('');
        setCorpPhone('');
        setCorpInterest('');
      }, 3000);
    }
  };

  // Submit Handler for Sidebar WhatsApp
  const handleSidebarWhatsAppSubmit = (type: 'individual' | 'corporate') => {
    const currentSpecialty = selectedDomainObj?.subDomains[activeSubIdx ?? 0]?.title || "Spécialité";
    
    if (type === 'individual') {
      const newErrors: Record<string, string> = {};
      if (!formName.trim() || formName.trim().length < 3) {
        newErrors.name = "Le nom complet doit comporter au moins 3 caractères.";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formEmail || !emailRegex.test(formEmail)) {
        newErrors.email = "Veuillez saisir une adresse email valide.";
      }
      if (!formPhone || formPhone.trim().length < 8) {
        newErrors.phone = "Le numéro de téléphone doit comporter au moins 8 caractères.";
      }
      if (!formSession) {
        newErrors.session = "Veuillez sélectionner une session.";
      }
      if (!formTerms) {
        newErrors.terms = "Veuillez accepter les conditions.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      const message = `Bonjour CICEXF,\n\nJe souhaite m'inscrire à la spécialité suivante :\n*${currentSpecialty}*\n\nVoici mes coordonnées d'inscription :\n- *Nom & Prénom :* ${formName}\n- *Email :* ${formEmail}\n- *Téléphone (WhatsApp) :* ${formPhone}\n- *Session souhaitée :* ${formSession}\n- *Modalité :* ${formModality}`;
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/2250701970065?text=${encoded}`, '_blank');
      setSubmitSuccess(true);
    } else {
      const newErrors: Record<string, string> = {};
      if (!corpCompany.trim()) {
        newErrors.company = "Le nom de l'entreprise est requis.";
      }
      if (!corpName.trim() || corpName.trim().length < 3) {
        newErrors.name = "Le nom du contact doit comporter au moins 3 caractères.";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!corpEmail || !emailRegex.test(corpEmail)) {
        newErrors.email = "Veuillez saisir une adresse email professionnelle valide.";
      }
      if (!corpPhone || corpPhone.trim().length < 8) {
        newErrors.phone = "Le numéro de téléphone doit comporter au moins 8 caractères.";
      }
      if (!corpTerms) {
        newErrors.terms = "Veuillez accepter les conditions.";
      }

      if (Object.keys(newErrors).length > 0) {
        setCorpErrors(newErrors);
        return;
      }

      setCorpErrors({});
      const message = `Bonjour CICEXF,\n\nNous souhaitons obtenir un devis pour la spécialité suivante :\n*${currentSpecialty}*\n\nVoici les informations de notre organisation :\n- *Entreprise / Organisme :* ${corpCompany}\n- *Nom du contact :* ${corpName}\n- *Email professionnel :* ${corpEmail}\n- *Téléphone :* ${corpPhone}\n- *Nombre de participants :* ${corpParticipants}\n- *Modalité souhaitée :* ${corpModality}`;
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/2250701970065?text=${encoded}`, '_blank');
      setCorpSuccess(true);
    }
  };

  // Submit Handler for Sidebar Email (mailto)
  const handleSidebarEmailSubmit = (e: React.FormEvent, type: 'individual' | 'corporate') => {
    e.preventDefault();
    const currentSpecialty = selectedDomainObj?.subDomains[activeSubIdx ?? 0]?.title || "Spécialité";

    if (type === 'individual') {
      const newErrors: Record<string, string> = {};
      if (!formName.trim() || formName.trim().length < 3) {
        newErrors.name = "Le nom complet doit comporter au moins 3 caractères.";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formEmail || !emailRegex.test(formEmail)) {
        newErrors.email = "Veuillez saisir une adresse email valide.";
      }
      if (!formPhone || formPhone.trim().length < 8) {
        newErrors.phone = "Le numéro de téléphone doit comporter au moins 8 caractères.";
      }
      if (!formSession) {
        newErrors.session = "Veuillez sélectionner une session.";
      }
      if (!formTerms) {
        newErrors.terms = "Veuillez accepter les conditions.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      const subject = `Inscription Individuelle - ${currentSpecialty}`;
      const body = `Bonjour CICEXF,\n\nJe souhaite m'inscrire à la spécialité suivante :\n${currentSpecialty}\n\nVoici mes coordonnées d'inscription :\n- Nom & Prénom : ${formName}\n- Email : ${formEmail}\n- Téléphone (WhatsApp) : ${formPhone}\n- Session souhaitée : ${formSession}\n- Modalité : ${formModality}`;
      window.location.href = `mailto:elearningciv@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setSubmitSuccess(true);
    } else {
      const newErrors: Record<string, string> = {};
      if (!corpCompany.trim()) {
        newErrors.company = "Le nom de l'entreprise est requis.";
      }
      if (!corpName.trim() || corpName.trim().length < 3) {
        newErrors.name = "Le nom du contact doit comporter au moins 3 caractères.";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!corpEmail || !emailRegex.test(corpEmail)) {
        newErrors.email = "Veuillez saisir une adresse email professionnelle valide.";
      }
      if (!corpPhone || corpPhone.trim().length < 8) {
        newErrors.phone = "Le numéro de téléphone doit comporter au moins 8 caractères.";
      }
      if (!corpTerms) {
        newErrors.terms = "Veuillez accepter les conditions.";
      }

      if (Object.keys(newErrors).length > 0) {
        setCorpErrors(newErrors);
        return;
      }

      setCorpErrors({});
      const subject = `Demande de Devis - ${currentSpecialty}`;
      const body = `Bonjour CICEXF,\n\nNous souhaitons obtenir un devis pour la spécialité suivante :\n${currentSpecialty}\n\nVoici les informations de notre organisation :\n- Entreprise / Organisme : ${corpCompany}\n- Nom du contact : ${corpName}\n- Email professionnel : ${corpEmail}\n- Téléphone : ${corpPhone}\n- Nombre de participants : ${corpParticipants}\n- Modalité souhaitée : ${corpModality}`;
      window.location.href = `mailto:elearningciv@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setCorpSuccess(true);
    }
  };

  // Filter certified courses
  const filteredFormations = FORMATIONS.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDomain = selectedDomain === 'Tous' || f.domain.includes(selectedDomain);
    const matchesLevel = selectedLevel === 'Tous' || f.level === selectedLevel;
    const matchesModality = selectedModality === 'Tous' || f.modality === selectedModality;

    return matchesSearch && matchesDomain && matchesLevel && matchesModality;
  });

  // Dynamic Lucide Icons helper mapping
  const renderIcon = (name: string, className: string = "w-5 h-5") => {
    switch (name) {
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Map': return <Map className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'FileSpreadsheet': return <FileSpreadsheet className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Users': return <Users className={className} />;
      default: return <GraduationCap className={className} />;
    }
  };

  return (
    <div id="formations-view" className="py-16 bg-slate-50 dark:bg-slate-950 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs Navigation */}
        <div className="mb-6">
          <nav className="flex text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>CICEXF</span>
            <span className="mx-2">/</span>
            <span className="text-brand-emerald">Académie &amp; Ingénierie de Formation</span>
          </nav>
        </div>

        {/* -------------------- DUAL TAB NAVIGATION -------------------- */}
        {!selectedFormation && !selectedDomainObj && (
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
              Académie d'Excellence CICEXF
            </h1>
            <div className="w-16 h-1 bg-brand-emerald rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 font-sans leading-relaxed max-w-2xl">
              Développez vos compétences stratégiques à travers nos grands pôles d'ingénierie thématiques ou certifiez vos équipes avec nos cursus professionnels de haut niveau.
            </p>


          </div>
        )}

        {/* -------------------------------------------------------------------------- */}
        {/*                           SUB-TAB 1: DOMAINS VIEW                          */}
        {/* -------------------------------------------------------------------------- */}
        {activeSubTab === 'domains' && (
          <div className="space-y-12">
            
            {/* 1.1 List of Training Domains (If none selected) */}
            {!selectedDomainObj ? (
              <div className="space-y-10 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {DOMAINS_INTERVENTION.map((domain, index) => {
                    // Skip or include all based on index
                    const displayNum = `0${index + 1}`;
                    return (
                      <div
                        key={domain.id}
                        id={`domain-card-${domain.id}`}
                        onClick={() => handleSelectDomainObj(domain)}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-brand-emerald/40 transition-all flex flex-col justify-between cursor-pointer group h-full relative overflow-hidden"
                      >
                        {/* Domain Cover Image */}
                        <div className="relative h-44 w-full overflow-hidden">
                          <img
                            src={domain.subDomains[0]?.imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"}
                            alt={domain.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
                          
                          {/* Elegant corner index number */}
                          <div className="absolute top-4 right-4 font-mono font-bold text-xs text-white bg-slate-900/65 backdrop-blur-md px-2.5 py-1 rounded-lg">
                            {displayNum}
                          </div>
                          
                          {/* Floating Icon */}
                          <div className="absolute -bottom-5 left-6 p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 text-brand-emerald group-hover:bg-brand-emerald group-hover:text-white transition-all shadow-md">
                            {renderIcon(domain.iconName, "w-6 h-6")}
                          </div>
                        </div>

                        <div className="p-6 pt-8 space-y-4 flex-grow flex flex-col justify-between">
                          <div className="space-y-2">
                            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-brand-emerald transition-colors line-clamp-2">
                              {domain.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed line-clamp-3 text-justify">
                              {domain.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="px-6 pb-6 pt-4 border-t border-slate-50 dark:border-slate-800/60 flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-400 flex items-center">
                            <Layers className="w-3.5 h-3.5 mr-1 text-brand-emerald" />
                            {domain.subDomains.length} spécialités clés
                          </span>
                          <span className="font-bold text-brand-emerald flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                            <span>Découvrir</span>
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Info Frame banner for Custom Formations */}
                <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-md border border-slate-800">
                  <div className="space-y-1.5 text-center md:text-left">
                    <h4 className="font-display font-bold text-base text-white">Vous souhaitez déployer ces modules au sein de votre entreprise ?</h4>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">Le cabinet CICEXF conçoit des curriculums exclusifs sur-mesure et des ateliers pratiques adaptés à vos contraintes sectorielles.</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold rounded-xl text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-lg hover:shadow-brand-emerald/20"
                  >
                    Demander un séminaire privé
                  </button>
                </div>
              </div>
            ) : (
              // 1.2 Detailed view for selected General Training Domain
              <div className="space-y-12 animate-in fade-in duration-300 font-sans">
                {/* Back Link & Direct Dropdown Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm">
                  <button
                    onClick={handleBackToDomains}
                    id="btn-back-to-domains"
                    className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-350 hover:text-brand-emerald transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retourner aux Domaines de Formation</span>
                  </button>

                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider shrink-0">Passer au domaine :</span>
                    <select
                      value={selectedDomainObj.id}
                      onChange={(e) => {
                        const found = DOMAINS_INTERVENTION.find(d => d.id === e.target.value);
                        if (found) handleSelectDomainObj(found);
                      }}
                      className="w-full md:w-64 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 focus:border-brand-emerald outline-none cursor-pointer"
                    >
                      {DOMAINS_INTERVENTION.map((domain) => (
                        <option key={domain.id} value={domain.id}>{domain.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Beautiful Modern Domain Hero Header with top image banner */}
                <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-800">
                  <img
                    src={domainIllustrations[selectedDomainObj.id] || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'}
                    alt={selectedDomainObj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent flex flex-col justify-end p-6 sm:p-10 space-y-3">
                    <div className="inline-flex items-center space-x-2 bg-brand-emerald/25 text-brand-emerald-light border border-brand-emerald/35 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest self-start">
                      {renderIcon(selectedDomainObj.iconName, "w-3.5 h-3.5 mr-1")}
                      <span>Ingénierie CICEXF &bull; Pôle Académique</span>
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white max-w-4xl">
                      {selectedDomainObj.title}
                    </h1>
                  </div>
                </div>

                {/* Description & KPI Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-brand-emerald mb-2">Présentation générale</h3>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans font-medium leading-relaxed text-justify">
                      {selectedDomainObj.description}
                    </p>
                  </div>

                  <div className="lg:col-span-4 bg-slate-900 text-white border border-slate-800 p-8 rounded-3xl flex flex-col justify-center space-y-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Indicateurs de Performance</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-l-2 border-brand-emerald pl-3">
                        <span className="block text-xl font-bold font-mono text-white">100%</span>
                        <span className="block text-[9px] text-slate-400 uppercase">Pratique</span>
                      </div>
                      <div className="border-l-2 border-brand-blue pl-3">
                        <span className="block text-xl font-bold font-mono text-white">4.8/5</span>
                        <span className="block text-[9px] text-slate-400 uppercase">Avis Experts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUB-ELEMENTS GRID (The 4 specialized trainings) */}
                <div id="domain-specialties-header" className="space-y-8 scroll-mt-20">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Axes d'intervention &amp; Livrables clés
                    </h2>
                    <p className="text-[10px] uppercase font-bold text-brand-emerald tracking-widest">
                      Structure d'enseignement certifiante &amp; d'expertise
                    </p>
                  </div>

                  {activeSubIdx === null ? (
                    /* Initial Grid of Specialties (Petite taille avec images) */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                      {selectedDomainObj.subDomains.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          onClick={() => {
                            setActiveSubIdx(sIdx);
                            const el = document.getElementById('domain-specialties-header');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="group relative h-64 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-brand-emerald/45 transition-all duration-500 cursor-pointer flex flex-col justify-end p-6"
                        >
                          {/* Background Image */}
                          {sub.imageUrl && (
                            <div className="absolute inset-0 z-0 overflow-hidden">
                              <img
                                src={sub.imageUrl}
                                alt={sub.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                              />
                              {/* Overlay for readable text */}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/20 group-hover:via-slate-900/50 transition-all duration-500"></div>
                            </div>
                          )}

                          {/* Content */}
                          <div className="relative z-10 space-y-2.5">
                            <span className="inline-block font-mono font-bold text-[9px] text-white bg-brand-emerald px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              Spécialité 0{sIdx + 1}
                            </span>
                            
                            <h3 className="font-display font-extrabold text-sm sm:text-base text-white leading-tight drop-shadow-md group-hover:text-brand-emerald transition-colors duration-300">
                              {sub.title}
                            </h3>

                            <p className="text-[11px] text-slate-350 line-clamp-2 leading-relaxed font-sans font-medium text-justify">
                              {sub.description}
                            </p>

                            <div className="pt-2.5 flex items-center justify-between border-t border-white/10 mt-1">
                              <span className="text-[9.5px] text-brand-emerald font-bold uppercase tracking-wider flex items-center space-x-1 group-hover:translate-x-1 transition-transform duration-300">
                                <span>Découvrir la spécialité</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                              {sub.expertiseLevel && (
                                <span className="text-[8px] bg-white/10 backdrop-blur-sm text-slate-200 font-bold px-2 py-0.5 rounded uppercase">
                                  {sub.expertiseLevel}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Active Split Screen View */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-stretch animate-in fade-in duration-300 lg:h-[880px]">
                      {/* Left side: Wide View of the Selected Specialty */}
                      <div className="lg:col-span-8 flex flex-col h-full min-h-0">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                          <button
                            onClick={() => setActiveSubIdx(null)}
                            className="inline-flex items-center space-x-2 text-[11px] font-bold text-slate-600 dark:text-slate-355 hover:text-brand-emerald hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-all py-1.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm cursor-pointer active:scale-95"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>← Revenir aux autres spécialités</span>
                          </button>
                        </div>

                        <div className="flex-grow flex-1 min-h-0">
                          <SubDomainCard
                            sub={selectedDomainObj.subDomains[activeSubIdx]}
                            sIdx={activeSubIdx}
                            setCorpInterest={setCorpInterest}
                            renderIcon={renderIcon}
                            isLarge={true}
                          />
                        </div>
                      </div>

                      {/* Right side: specialties list and form in a unified height-matched column */}
                      <div className="lg:col-span-4 flex flex-col h-full min-h-0 gap-4 lg:overflow-y-auto pr-1.5 scrollbar-thin">
                        
                        {/* Spécialités list card */}
                        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-3 shrink-0">
                          <div className="pb-1.5 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10.5px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-0.5">
                              Spécialités de ce pôle
                            </h3>
                            <p className="text-[8.5px] text-brand-emerald uppercase font-bold tracking-widest">
                              Cliquez pour changer la sélection
                            </p>
                          </div>

                          <div className="space-y-2 lg:max-h-[220px] lg:overflow-y-auto scrollbar-thin pr-0.5">
                            {selectedDomainObj.subDomains.map((sub, sIdx) => {
                              const isCurrent = sIdx === activeSubIdx;
                              return (
                                <div
                                  key={sIdx}
                                  onClick={() => {
                                    setActiveSubIdx(sIdx);
                                    const el = document.getElementById('domain-specialties-header');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className={`p-2.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center space-x-3 group ${
                                    isCurrent
                                      ? 'bg-white dark:bg-slate-950 border-brand-emerald shadow-sm ring-1 ring-brand-emerald/30'
                                      : 'bg-white/70 dark:bg-slate-900/70 border-slate-200/60 dark:border-slate-800/60'
                                  } hover:bg-[#5C3D2E] dark:hover:bg-[#5C3D2E] hover:text-white hover:scale-105 hover:shadow-lg hover:border-transparent`}
                                >
                                  {sub.imageUrl && (
                                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
                                      <img
                                        src={sub.imageUrl}
                                        alt={sub.title}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-slate-950/25"></div>
                                    </div>
                                  )}
                                  
                                  <div className="flex-grow min-w-0 space-y-0.5">
                                    <span className={`text-[7px] font-mono font-extrabold uppercase tracking-widest block transition-colors duration-300 ${isCurrent ? 'text-brand-emerald group-hover:text-amber-200' : 'text-slate-400 group-hover:text-amber-200/80'}`}>
                                      Spécialité 0{sIdx + 1} {isCurrent && '• Actuelle'}
                                    </span>
                                    <h4 className={`text-[10px] font-bold leading-tight line-clamp-2 transition-colors duration-300 ${isCurrent ? 'text-slate-950 dark:text-white font-extrabold group-hover:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-white'}`}>
                                      {sub.title}
                                    </h4>
                                  </div>
                                  
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${isCurrent ? 'bg-brand-emerald text-white group-hover:bg-white group-hover:text-[#5C3D2E]' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-white group-hover:text-[#5C3D2E]'}`}>
                                    <ChevronRight className="w-3 h-3" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interactive Form Card (Right Sidebar) - Inscription ou Demande de Devis */}
                        <div id="domain-quote-anchor" className="bg-slate-900 dark:bg-slate-950 text-white p-5 rounded-3xl border border-slate-800/80 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500 relative overflow-hidden shrink-0">
                          <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none"></div>
                          
                          <div className="relative z-10">
                            <span className="text-[8px] font-mono font-extrabold uppercase tracking-widest text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-2.5 py-1 rounded-full">
                              Formulaire de contact Direct
                            </span>
                            <h3 className="font-display font-extrabold text-sm text-white mt-3 leading-snug">
                              Inscription &amp; Devis Instantané
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                              Pour : <span className="text-brand-emerald font-bold">{selectedDomainObj.subDomains[activeSubIdx ?? 0]?.title}</span>
                            </p>
                          </div>

                          {/* Dual section selectors */}
                          <div className="relative z-10 grid grid-cols-2 gap-1.5 bg-slate-850 p-1 rounded-xl text-center text-[10px] font-bold border border-slate-800">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveFormTab('individual');
                                setSubmitSuccess(false);
                                setCorpSuccess(false);
                              }}
                              className={`py-2 px-1 rounded-lg transition-all duration-300 cursor-pointer ${
                                activeFormTab === 'individual'
                                  ? 'bg-brand-emerald text-white shadow-md'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                              }`}
                            >
                              👤 S'inscrire (Candidat)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveFormTab('corporate');
                                setSubmitSuccess(false);
                                setCorpSuccess(false);
                              }}
                              className={`py-2 px-1 rounded-lg transition-all duration-300 cursor-pointer ${
                                activeFormTab === 'corporate'
                                  ? 'bg-brand-emerald text-white shadow-md'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                              }`}
                            >
                              🏢 Devis (Entreprise / Groupe)
                            </button>
                          </div>

                          {activeFormTab === 'individual' ? (
                            submitSuccess ? (
                              <div className="relative z-10 bg-emerald-950/40 border border-brand-emerald/30 p-4 rounded-2xl space-y-2.5 text-brand-emerald-light text-[11px] animate-in zoom-in-95 duration-200">
                                <div className="flex items-center space-x-2 text-brand-emerald font-bold">
                                  <CheckCircle className="w-4 h-4 shrink-0 text-brand-emerald" />
                                  <span className="text-xs">Inscription validée !</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed text-[10px]">
                                  Votre inscription pour la spécialité <strong>{selectedDomainObj.subDomains[activeSubIdx ?? 0]?.title}</strong> a bien été enregistrée. Notre équipe pédagogique va vous recontacter par email et par téléphone très rapidement.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setSubmitSuccess(false)}
                                  className="text-[10px] text-brand-emerald hover:underline font-bold block pt-1 cursor-pointer"
                                >
                                  ← Remplir une nouvelle inscription
                                </button>
                              </div>
                            ) : (
                              <form onSubmit={(e) => handleSidebarEmailSubmit(e, 'individual')} className="relative z-10 space-y-3 font-sans text-[11px]">
                                <div className="space-y-1">
                                  <label className="block text-slate-400 font-bold tracking-wide uppercase text-[8.5px]">Nom &amp; Prénom complet * :</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: Koffi Konan Olivier..."
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white outline-none focus:border-brand-emerald transition-all text-xs ${
                                      errors.name ? 'border-red-500' : 'border-slate-700/70 focus:ring-1 focus:ring-brand-emerald/20'
                                    }`}
                                  />
                                  {errors.name && <span className="text-[9px] text-red-400 block font-medium">{errors.name}</span>}
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-slate-400 font-bold tracking-wide uppercase text-[8.5px]">Adresse Email * :</label>
                                  <input
                                    type="email"
                                    placeholder="Ex: olivier@gmail.com..."
                                    value={formEmail}
                                    onChange={(e) => setFormEmail(e.target.value)}
                                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white outline-none focus:border-brand-emerald transition-all text-xs ${
                                      errors.email ? 'border-red-500' : 'border-slate-700/70 focus:ring-1 focus:ring-brand-emerald/20'
                                    }`}
                                  />
                                  {errors.email && <span className="text-[9px] text-red-400 block font-medium">{errors.email}</span>}
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-slate-400 font-bold tracking-wide uppercase text-[8.5px]">Téléphone (WhatsApp de préférence) * :</label>
                                  <input
                                    type="tel"
                                    placeholder="Ex: +225 07 01 02 03 04..."
                                    value={formPhone}
                                    onChange={(e) => setFormPhone(e.target.value)}
                                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white outline-none focus:border-brand-emerald transition-all text-xs ${
                                      errors.phone ? 'border-red-500' : 'border-slate-700/70 focus:ring-1 focus:ring-brand-emerald/20'
                                    }`}
                                  />
                                  {errors.phone && <span className="text-[9px] text-red-400 block font-medium">{errors.phone}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="block text-slate-400 font-bold tracking-wide uppercase text-[8.5px]">Session * :</label>
                                    <select
                                      value={formSession}
                                      onChange={(e) => setFormSession(e.target.value)}
                                      className={`w-full bg-slate-800/50 border rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-brand-emerald transition-all text-[11px] ${
                                        errors.session ? 'border-red-500' : 'border-slate-700/70'
                                      }`}
                                    >
                                      <option value="" className="bg-slate-900">-- Choisir --</option>
                                      <option value="Juillet 2026" className="bg-slate-900">Juillet 2026</option>
                                      <option value="Août 2026" className="bg-slate-900">Août 2026</option>
                                      <option value="Septembre 2026" className="bg-slate-900">Septembre 2026</option>
                                    </select>
                                    {errors.session && <span className="text-[9px] text-red-400 block font-medium">{errors.session}</span>}
                                  </div>

                                  <div className="space-y-1">
                                    <label className="block text-slate-400 font-bold tracking-wide uppercase text-[8.5px]">Format :</label>
                                    <select
                                      value={formModality}
                                      onChange={(e) => setFormModality(e.target.value)}
                                      className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-brand-emerald transition-all text-[11px]"
                                    >
                                      <option value="Hybride" className="bg-slate-900">Hybride</option>
                                      <option value="Présentiel" className="bg-slate-900">Présentiel</option>
                                      <option value="Distanciel" className="bg-slate-900">E-Learning</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1.5 pt-1">
                                  <label className="flex items-start space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formTerms}
                                      onChange={(e) => setFormTerms(e.target.checked)}
                                      className="mt-0.5 shrink-0 accent-brand-emerald rounded border-slate-700 bg-slate-800"
                                    />
                                    <span className="text-[9.5px] text-slate-400 leading-tight">
                                      J'autorise CICEXF à utiliser mes coordonnées pour valider mon inscription pédagogique.
                                    </span>
                                  </label>
                                  {errors.terms && <span className="text-[9px] text-red-400 block font-medium">{errors.terms}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-2">
                                  <button
                                    type="submit"
                                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl text-[10px] tracking-wide uppercase transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95 shadow-md"
                                  >
                                    <Send className="w-3 h-3 text-brand-emerald" />
                                    <span>Par Email</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSidebarWhatsAppSubmit('individual')}
                                    className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-[10px] tracking-wide uppercase transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95 shadow-md"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>Via WhatsApp</span>
                                  </button>
                                </div>
                              </form>
                            )
                          ) : (
                            corpSuccess ? (
                              <div className="relative z-10 bg-emerald-950/40 border border-brand-emerald/30 p-4 rounded-2xl space-y-2.5 text-brand-emerald-light text-[11px] animate-in zoom-in-95 duration-200">
                                <div className="flex items-center space-x-2 text-brand-emerald font-bold">
                                  <CheckCircle className="w-4 h-4 shrink-0 text-brand-emerald" />
                                  <span className="text-xs">Devis Demandé !</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed text-[10px]">
                                  La demande de devis pour l'organisation <strong>{corpCompany}</strong> concernant la spécialité <strong>{selectedDomainObj.subDomains[activeSubIdx ?? 0]?.title}</strong> a bien été transmise. Un ingénieur pédagogique CICEXF vous recontactera sous 24h ouvrables.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setCorpSuccess(false)}
                                  className="text-[10px] text-brand-emerald hover:underline font-bold block pt-1 cursor-pointer"
                                >
                                  ← Remplir un nouveau devis
                                </button>
                              </div>
                            ) : (
                              <form onSubmit={(e) => handleSidebarEmailSubmit(e, 'corporate')} className="relative z-10 space-y-3 font-sans text-[11px]">
                                <div className="space-y-1">
                                  <label className="block text-slate-400 font-bold tracking-wide uppercase text-[8.5px]">Entreprise / Organisme * :</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: Ministère, Cabinet, PME..."
                                    value={corpCompany}
                                    onChange={(e) => setCorpCompany(e.target.value)}
                                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white outline-none focus:border-brand-emerald transition-all text-xs ${
                                      corpErrors.company ? 'border-red-500' : 'border-slate-700/70 focus:ring-1 focus:ring-brand-emerald/20'
                                    }`}
                                  />
                                  {corpErrors.company && <span className="text-[9px] text-red-400 block font-medium">{corpErrors.company}</span>}
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-slate-400 font-bold tracking-wide uppercase text-[8.5px]">Nom du Contact Responsable * :</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: Mme Yao Christine (DRH)..."
                                    value={corpName}
                                    onChange={(e) => setCorpName(e.target.value)}
                                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white outline-none focus:border-brand-emerald transition-all text-xs ${
                                      corpErrors.name ? 'border-red-500' : 'border-slate-700/70 focus:ring-1 focus:ring-brand-emerald/20'
                                    }`}
                                  />
                                  {corpErrors.name && <span className="text-[9px] text-red-400 block font-medium">{corpErrors.name}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="block text-slate-400 font-bold tracking-wide uppercase text-[8.5px]">Email Pro * :</label>
                                    <input
                                      type="email"
                                      placeholder="drh@entreprise.ci"
                                      value={corpEmail}
                                      onChange={(e) => setCorpEmail(e.target.value)}
                                      className={`w-full bg-slate-800/50 border rounded-lg px-2 text-white outline-none focus:border-brand-emerald transition-all text-xs ${
                                        corpErrors.email ? 'border-red-500' : 'border-slate-700/70'
                                      }`}
                                    />
                                    {corpErrors.email && <span className="text-[9px] text-red-400 block font-medium">{corpErrors.email}</span>}
                                  </div>

                                  <div className="space-y-1">
                                    <label className="block text-slate-400 font-bold tracking-wide uppercase text-[8.5px]">Téléphone * :</label>
                                    <input
                                      type="tel"
                                      placeholder="+225 07 00 00..."
                                      value={corpPhone}
                                      onChange={(e) => setCorpPhone(e.target.value)}
                                      className={`w-full bg-slate-800/50 border rounded-lg px-2 text-white outline-none focus:border-brand-emerald transition-all text-xs ${
                                        corpErrors.phone ? 'border-red-500' : 'border-slate-700/70'
                                      }`}
                                    />
                                    {corpErrors.phone && <span className="text-[9px] text-red-400 block font-medium">{corpErrors.phone}</span>}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="block text-slate-400 font-bold tracking-wide uppercase text-[8.5px]">Participants * :</label>
                                    <select
                                      value={corpParticipants}
                                      onChange={(e) => setCorpParticipants(e.target.value)}
                                      className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-brand-emerald transition-all text-[11px]"
                                    >
                                      <option value="1 à 5 personnes" className="bg-slate-900">1 à 5 pers.</option>
                                      <option value="5 à 10 personnes" className="bg-slate-900">5 à 10 pers.</option>
                                      <option value="10 à 20 personnes" className="bg-slate-900">10 à 20 pers.</option>
                                      <option value="Plus de 20 personnes" className="bg-slate-900">Plus de 20 pers.</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <label className="block text-slate-400 font-bold tracking-wide uppercase text-[8.5px]">Format :</label>
                                    <select
                                      value={corpModality}
                                      onChange={(e) => setCorpModality(e.target.value)}
                                      className="w-full bg-slate-800/50 border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-brand-emerald transition-all text-[11px]"
                                    >
                                      <option value="Intra-entreprise" className="bg-slate-900">Intra-Entr.</option>
                                      <option value="Inter-entreprise" className="bg-slate-900">Inter-Entr.</option>
                                      <option value="Sur-mesure" className="bg-slate-900">Sur-mesure</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1.5 pt-1">
                                  <label className="flex items-start space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={corpTerms}
                                      onChange={(e) => setCorpTerms(e.target.checked)}
                                      className="mt-0.5 shrink-0 accent-brand-emerald rounded border-slate-700 bg-slate-800"
                                    />
                                    <span className="text-[9.5px] text-slate-400 leading-tight">
                                      Nous autorisons le CICEXF à nous envoyer la brochure d'ingénierie et le devis requis.
                                    </span>
                                  </label>
                                  {corpErrors.terms && <span className="text-[9px] text-red-400 block font-medium">{corpErrors.terms}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-2">
                                  <button
                                    type="submit"
                                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl text-[10px] tracking-wide uppercase transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95 shadow-md"
                                  >
                                    <Send className="w-3 h-3 text-brand-emerald" />
                                    <span>Par Email</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSidebarWhatsAppSubmit('corporate')}
                                    className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-[10px] tracking-wide uppercase transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95 shadow-md"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>Via WhatsApp</span>
                                  </button>
                                </div>
                              </form>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>





              </div>
            )}

          </div>
        )}

        {/* -------------------------------------------------------------------------- */}
        {/*                       SUB-TAB 2: CARTOGRAPHY OF AXES                       */}
        {/* -------------------------------------------------------------------------- */}
        {activeSubTab === 'axes' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Introductory panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl text-left">
                <span className="text-[10px] font-extrabold text-brand-emerald uppercase tracking-widest block">Nomenclature Officielle</span>
                <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  Répertoire des 8 Thématiques et 34 Axes de Formation du Cabinet
                </h2>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-sans leading-relaxed">
                  Découvrez l'ensemble de notre offre de formation structurée par expertises clés. Cliquez sur un axe pour consulter le détail de ses modules, compétences enseignées, outils logiciels associés et niveau visé, puis effectuez une demande de devis en un clic.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => {
                    const titles: string[] = [];
                    DOMAINS_INTERVENTION.forEach(d => {
                      d.subDomains.forEach(sub => titles.push(sub.title));
                    });
                    expandAllAxes(titles);
                  }}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                >
                  Tout Déplier
                </button>
                <button
                  onClick={collapseAllAxes}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                >
                  Tout Replier
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200/50 dark:border-slate-800 shadow-sm text-left">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Recherche Intelligente</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2.5">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher par thématique, axe ou mot-clé (ex: QGIS, audit, comptabilité, SYSCOHADA, ISO...)"
                  value={axesSearchQuery}
                  onChange={(e) => setAxesSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-0"
                />
                {axesSearchQuery && (
                  <button
                    onClick={() => setAxesSearchQuery('')}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white px-2 cursor-pointer"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>

            {/* Directory Grid/List of Thematics */}
            <div className="space-y-10">
              {DOMAINS_INTERVENTION.map((domain, domainIdx) => {
                const romanTitle = ROMAN_THEMATICS[domainIdx] || domain.title;
                
                // Filter sub-domains (axes) based on search query
                const matchingAxes = domain.subDomains.filter(sub => {
                  if (!axesSearchQuery) return true;
                  const query = axesSearchQuery.toLowerCase();
                  return (
                    sub.title.toLowerCase().includes(query) ||
                    sub.description.toLowerCase().includes(query) ||
                    (sub.keyPoints && sub.keyPoints.some(kp => kp.toLowerCase().includes(query))) ||
                    (sub.software && sub.software.some(sw => sw.toLowerCase().includes(query))) ||
                    (sub.expertiseLevel && sub.expertiseLevel.toLowerCase().includes(query))
                  );
                });

                // If nothing matches this domain's axes, skip rendering it for clean results
                if (matchingAxes.length === 0) return null;

                return (
                  <div
                    key={domain.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-300"
                  >
                    {/* Thematic Header block */}
                    <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden border-b border-slate-800">
                      <div className="absolute inset-0 grid-pattern opacity-5"></div>
                      <div className="space-y-3 relative z-10 text-left">
                        <div className="inline-flex items-center space-x-2 bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          Pôle Thématique 0{domainIdx + 1}
                        </div>
                        <h3 className="font-display text-base sm:text-lg lg:text-xl font-extrabold tracking-tight leading-snug text-white">
                          {romanTitle}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-sans font-light leading-relaxed max-w-4xl">
                          {domain.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Axes List under this thematic */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {matchingAxes.map((sub, sIdx) => {
                        const isExpanded = !!expandedAxes[sub.title];
                        
                        return (
                          <div
                            key={sIdx}
                            className={`transition-all duration-200 ${isExpanded ? 'bg-slate-50/40 dark:bg-slate-950/20' : 'hover:bg-slate-50/20 dark:hover:bg-slate-900/10'}`}
                          >
                            {/* Axis Header (Clickable) */}
                            <button
                              onClick={() => toggleAxis(sub.title)}
                              className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 transition-all cursor-pointer"
                            >
                              <div className="flex items-start gap-4">
                                {/* Axis number block */}
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-all ${
                                  isExpanded
                                    ? 'bg-brand-emerald text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                  {sub.title.match(/^\d+/) ? sub.title.match(/^\d+/)?.[0] : sIdx + 1}
                                </div>
                                
                                <div className="space-y-1 text-left">
                                  <h4 className="font-sans font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                                    {sub.title.replace(/^\d+\.\s*/, '')}
                                  </h4>
                                  {!isExpanded && (
                                    <p className="text-xs text-slate-550 dark:text-slate-400 font-sans line-clamp-1">
                                      {sub.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="shrink-0 pt-1 text-slate-400 dark:text-slate-600 hover:text-brand-emerald dark:hover:text-brand-emerald transition-colors">
                                {isExpanded ? (
                                  <span className="text-[10px] font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1">
                                    Fermer
                                    <ChevronRight className="w-4 h-4 rotate-90 transition-transform duration-200" />
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400 hover:text-brand-emerald uppercase tracking-wider flex items-center gap-1">
                                    Détails
                                    <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                                  </span>
                                )}
                              </div>
                            </button>

                            {/* Expanded Details Panel */}
                            {isExpanded && (() => {
                              const axisData = getTailoredDataForAxis(sub.title, sub);
                              return (
                                <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 animate-in slide-in-from-top-2 duration-200 space-y-6 border-l-4 border-brand-emerald ml-9 text-left">
                                  
                                  {/* Two-column comprehensive layout */}
                                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
                                    
                                    {/* Left Column: Description & Program Objectives (7 cols) */}
                                    <div className="lg:col-span-7 space-y-5">
                                      <div className="space-y-2">
                                        <span className="block text-[10px] font-extrabold text-brand-emerald uppercase tracking-wider">
                                          Présentation Générale de l'Axe :
                                        </span>
                                        <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-350 leading-relaxed font-sans text-justify">
                                          {sub.description}
                                        </p>
                                      </div>

                                      <div className="space-y-2.5">
                                        <span className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                          Objectifs d'Apprentissage &amp; Compétences Visés :
                                        </span>
                                        <ul className="space-y-1.5 font-sans text-xs">
                                          {axisData.objectives.map((obj: string, oIdx: number) => (
                                            <li key={oIdx} className="flex items-start text-slate-600 dark:text-slate-400">
                                              <span className="text-brand-emerald mr-2 mt-0.5">•</span>
                                              <span className="leading-relaxed text-[11.5px]">{obj}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      <div className="space-y-2.5">
                                        <span className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                          Résultats &amp; Impact Professionnel :
                                        </span>
                                        <ul className="space-y-1.5 font-sans text-xs">
                                          {axisData.results.map((res: string, rIdx: number) => (
                                            <li key={rIdx} className="flex items-start text-slate-600 dark:text-slate-400">
                                              <span className="text-brand-blue mr-2 mt-0.5">✓</span>
                                              <span className="leading-relaxed text-[11.5px]">{res}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Right Column: Key Points & Market Metadata (5 cols) */}
                                    <div className="lg:col-span-5 space-y-5 lg:pl-4 lg:border-l border-slate-100 dark:border-slate-800">
                                      {sub.keyPoints && sub.keyPoints.length > 0 && (
                                        <div className="space-y-2.5">
                                          <span className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                            Compétences Pratiques Enseignées :
                                          </span>
                                          <div className="space-y-1.5 text-xs">
                                            {sub.keyPoints.map((kp: string, kpIdx: number) => (
                                              <div key={kpIdx} className="flex items-start text-slate-700 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100/50 dark:border-slate-800 p-2 rounded-xl">
                                                <CheckSquare className="w-3.5 h-3.5 text-brand-emerald mr-2 shrink-0 mt-0.5" />
                                                <span className="leading-snug text-[11px] font-semibold">{kp}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      <div className="space-y-2.5">
                                        <span className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                          Perspectives &amp; Débouchés Carrière :
                                        </span>
                                        <ul className="space-y-1.5 font-sans text-xs">
                                          {axisData.opportunities.map((opp: string, pIdx: number) => (
                                            <li key={pIdx} className="flex items-start text-slate-600 dark:text-slate-400">
                                              <span className="text-slate-400 mr-2 mt-0.5">»</span>
                                              <span className="leading-relaxed text-[11px]">{opp}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      {/* Metadata widgets */}
                                      <div className="grid grid-cols-1 gap-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        {/* Level */}
                                        {sub.expertiseLevel && (
                                          <div className="space-y-1">
                                            <span className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                              Niveau d'Expertise :
                                            </span>
                                            <span className="inline-block bg-brand-blue/10 text-brand-blue dark:bg-blue-500/10 dark:text-blue-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                              {sub.expertiseLevel}
                                            </span>
                                          </div>
                                        )}

                                        {/* Software */}
                                        {sub.software && sub.software.length > 0 && (
                                          <div className="space-y-1">
                                            <span className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                              Logiciels &amp; Outils Utilisés :
                                            </span>
                                            <div className="flex flex-wrap gap-1 font-mono">
                                              {sub.software.map((sw: string, swIdx: number) => (
                                                <span
                                                  key={swIdx}
                                                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-750"
                                                >
                                                  {sw}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3">
                                    <button
                                      onClick={() => handleSelectDomainObj(domain)}
                                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>Consulter la fiche complète du Pôle</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleRequestQuoteForAxis(domain, sub.title)}
                                      className="px-4 py-2 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:shadow-brand-emerald/10"
                                    >
                                      <span>S'inscrire / Devis pour cet axe</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Zero matching axes state */}
            {DOMAINS_INTERVENTION.every(domain => 
              domain.subDomains.filter(sub => {
                if (!axesSearchQuery) return true;
                const query = axesSearchQuery.toLowerCase();
                return (
                  sub.title.toLowerCase().includes(query) ||
                  sub.description.toLowerCase().includes(query) ||
                  (sub.keyPoints && sub.keyPoints.some(kp => kp.toLowerCase().includes(query))) ||
                  (sub.software && sub.software.some(sw => sw.toLowerCase().includes(query))) ||
                  (sub.expertiseLevel && sub.expertiseLevel.toLowerCase().includes(query))
                );
              }).length === 0
            ) && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/50 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4 animate-in fade-in">
                <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-display text-base font-bold text-slate-800 dark:text-slate-200">Aucun axe trouvé</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                  Aucun des 34 axes ne correspond à vos critères de recherche actuels. Veuillez essayer en réinitialisant ou modifiant le mot-clé.
                </p>
                <button
                  onClick={() => setAxesSearchQuery('')}
                  className="px-5 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Réinitialiser la recherche
                </button>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------------- */}
        {/*                       SUB-TAB 3: CERTIFICATIONS CATALOG                    */}
        {/* -------------------------------------------------------------------------- */}
        {activeSubTab === 'certifications' && (
          <div>
            
            {/* 2.1 Course Details View */}
            {selectedFormation ? (
              <div className="space-y-12 animate-in fade-in duration-300">
                {/* Back Link */}
                <button
                  onClick={handleBackToCatalog}
                  id="btn-back-to-catalog"
                  className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-brand-emerald transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retourner au Catalogue des Certifications</span>
                </button>

                {/* Course Header */}
                <div className="bg-slate-900 text-white rounded-3xl overflow-hidden relative shadow-lg">
                  <div className="absolute inset-0 grid-pattern opacity-10"></div>
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-emerald/10 rounded-full blur-3xl"></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-12 items-center">
                    <div className="lg:col-span-7 space-y-5">
                      <span className="bg-brand-emerald text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Certifications d'Excellence CICEXF
                      </span>
                      <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
                        {selectedFormation.title}
                      </h1>
                      <p className="text-xs text-slate-300 font-sans font-light leading-relaxed">
                        {selectedFormation.shortDescription}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-xs">
                        <span className="flex items-center text-slate-300">
                          <Clock className="w-4 h-4 text-brand-emerald mr-1.5 shrink-0" />
                          {selectedFormation.duration}
                        </span>
                        <span className="flex items-center text-slate-300">
                          <GraduationCap className="w-4 h-4 text-brand-emerald mr-1.5 shrink-0" />
                          Niveau {selectedFormation.level}
                        </span>
                        <span className="flex items-center text-slate-300">
                          <MapPin className="w-4 h-4 text-brand-emerald mr-1.5 shrink-0" />
                          Mode {selectedFormation.modality}
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                      <img
                        src={selectedFormation.featuredImage}
                        alt={selectedFormation.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Core Syllabus Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left elements */}
                  <div className="lg:col-span-8 space-y-8">
                    
                    {/* Contexte & Enjeux */}
                    {selectedFormation.context && (
                      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                          Contexte et Enjeux de la Formation
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-normal">
                          {selectedFormation.context}
                        </p>
                      </div>
                    )}

                    {/* Objectifs & Resultats Attendus */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {selectedFormation.objectives && (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                          <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">Objectifs d'Apprentissage :</h4>
                          <ul className="space-y-2 text-xs font-sans">
                            {selectedFormation.objectives.map((obj, oIdx) => (
                              <li key={oIdx} className="flex items-start text-slate-600 dark:text-slate-450">
                                <CheckCircle className="w-4.5 h-4.5 text-brand-emerald mr-2.5 shrink-0 mt-0.5" />
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedFormation.resultsExpected && (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                          <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">Résultats Attendus :</h4>
                          <ul className="space-y-2 text-xs font-sans">
                            {selectedFormation.resultsExpected.map((res, rIdx) => (
                              <li key={rIdx} className="flex items-start text-slate-600 dark:text-slate-450">
                                <CheckCircle className="w-4.5 h-4.5 text-brand-blue mr-2.5 shrink-0 mt-0.5" />
                                <span>{res}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Interactive timeline program */}
                    {selectedFormation.program && (
                      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-6">
                        <div>
                          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                            Programme du Parcours (Syllabus Académique)
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Syllabus interactif. Cliquez sur chaque module pour déplier le contenu détaillé de la formation.
                          </p>
                        </div>

                        <div className="space-y-4 relative pl-6 border-l border-slate-100 dark:border-slate-800 font-sans">
                          {selectedFormation.program.map((prog, pIdx) => (
                            <div key={pIdx} className="relative space-y-2" id={`timeline-module-${pIdx}`}>
                              <div className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 transition-all duration-300 ${expandedModule === pIdx ? 'bg-brand-emerald border-brand-emerald' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'}`}></div>

                              <button
                                onClick={() => setExpandedModule(pIdx)}
                                className={`w-full text-left font-bold text-xs flex justify-between items-center py-1 transition-colors ${expandedModule === pIdx ? 'text-brand-emerald font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}
                              >
                                <span>{prog.module}</span>
                              </button>

                              {expandedModule === pIdx && (
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-150/40 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 animate-in fade-in duration-150">
                                  <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">Détail des notions étudiées :</span>
                                  {prog.details.map((det, dIdx) => (
                                    <div key={dIdx} className="flex items-center space-x-2">
                                      <Terminal className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                                      <span>{det}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FAQ */}
                    {selectedFormation.faq && (
                      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                          Foire Aux Questions (FAQ)
                        </h3>
                        <div className="space-y-4 text-xs font-sans">
                          {selectedFormation.faq.map((item, fIdx) => (
                            <div key={fIdx} className="space-y-1.5">
                              <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center">
                                <HelpCircle className="w-4 h-4 text-brand-emerald mr-2" />
                                <span>{item.question}</span>
                              </h4>
                              <p className="text-slate-500 dark:text-slate-400 leading-relaxed pl-6 font-light">
                                {item.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right elements */}
                  <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
                    
                    {/* Public targets */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                      <h4 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                        Profils Admissibles
                      </h4>
                      <div className="space-y-3 font-sans text-xs">
                        {selectedFormation.targetPublic && (
                          <div>
                            <h5 className="font-bold text-slate-800 dark:text-white">Public Cible :</h5>
                            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400 mt-1 leading-relaxed text-[11px]">
                              {selectedFormation.targetPublic.map((t, idx) => <li key={idx}>{t}</li>)}
                            </ul>
                          </div>
                        )}
                        {selectedFormation.prerequisites && (
                          <div className="pt-2">
                            <h5 className="font-bold text-slate-800 dark:text-white">Prérequis Académiques :</h5>
                            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400 mt-1 leading-relaxed text-[11px]">
                              {selectedFormation.prerequisites.map((p, idx) => <li key={idx}>{p}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sessions Calendar */}
                    {selectedFormation.sessions && (
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                        <h4 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                          Calendrier des Sessions
                        </h4>
                        <div className="space-y-3 font-sans text-xs">
                          {selectedFormation.sessions.map((session, sIdx) => (
                            <div key={sIdx} className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                              <div className="flex items-center space-x-2.5">
                                <Calendar className="w-4 h-4 text-brand-emerald" />
                                <div>
                                  <span className="block font-bold text-slate-800 dark:text-slate-200">{session.date}</span>
                                  <span className="block text-[10px] text-slate-400">{session.location}</span>
                                </div>
                              </div>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                session.status === 'Disponible' ? 'bg-emerald-100 text-brand-emerald dark:bg-brand-emerald/10' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {session.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Registration Form */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-lg space-y-4">
                      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                          Inscription en Ligne Directe
                        </h4>
                        <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                          Remplissez ce formulaire pour soumettre votre dossier de candidature. Nos services d'admission traiteront votre demande sous 24h.
                        </p>
                      </div>

                      {submitSuccess ? (
                        <div id="registration-success-banner" className="bg-emerald-50 dark:bg-emerald-950/20 border border-brand-emerald/30 p-4 rounded-xl text-xs space-y-2 text-brand-emerald-dark dark:text-brand-emerald-light">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-brand-emerald" />
                            <span className="font-bold">Candidature Enregistrée !</span>
                          </div>
                          <p className="font-sans leading-relaxed text-[11px] text-slate-550 dark:text-slate-400">
                            Un email officiel vous a été adressé à <strong>{formEmail}</strong>. Un conseiller pédagogique va prendre contact par WhatsApp pour finaliser vos modalités d'inscription.
                          </p>
                          <button
                            onClick={() => setSubmitSuccess(false)}
                            className="text-[10px] font-bold text-brand-emerald hover:underline block pt-2"
                          >
                            Soumettre un autre dossier
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4 font-sans text-xs">
                          
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-600 dark:text-slate-350">Nom Complet * :</label>
                            <input
                              type="text"
                              placeholder="Nom Prénom"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-lg px-3 py-2 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-850 focus:border-brand-emerald'}`}
                            />
                            {errors.name && <span className="text-[10px] text-red-500">{errors.name}</span>}
                          </div>

                          <div className="space-y-1">
                            <label className="block font-bold text-slate-600 dark:text-slate-350">Adresse Email * :</label>
                            <input
                              type="email"
                              placeholder="votre.email@gmail.com"
                              value={formEmail}
                              onChange={(e) => setFormEmail(e.target.value)}
                              className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-lg px-3 py-2 outline-none ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-850 focus:border-brand-emerald'}`}
                            />
                            {errors.email && <span className="text-[10px] text-red-500">{errors.email}</span>}
                          </div>

                          <div className="space-y-1">
                            <label className="block font-bold text-slate-600 dark:text-slate-350">WhatsApp * :</label>
                            <input
                              type="tel"
                              placeholder="Ex: +225 07 01 02 03..."
                              value={formPhone}
                              onChange={(e) => setFormPhone(e.target.value)}
                              className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-lg px-3 py-2 outline-none ${errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-850 focus:border-brand-emerald'}`}
                            />
                            {errors.phone && <span className="text-[10px] text-red-500">{errors.phone}</span>}
                          </div>

                          <div className="space-y-1">
                            <label className="block font-bold text-slate-600 dark:text-slate-350">Session souhaitée * :</label>
                            <select
                              value={formSession}
                              onChange={(e) => setFormSession(e.target.value)}
                              className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-lg px-3 py-2 outline-none ${errors.session ? 'border-red-500' : 'border-slate-200 dark:border-slate-850'}`}
                            >
                              <option value="">-- Choisir une date --</option>
                              {selectedFormation.sessions?.map((s, idx) => (
                                <option key={idx} value={s.date}>{s.date} ({s.location})</option>
                              ))}
                            </select>
                            {errors.session && <span className="text-[10px] text-red-500">{errors.session}</span>}
                          </div>

                          <div className="space-y-1">
                            <label className="block font-bold text-slate-600 dark:text-slate-350">Modalité Préférée :</label>
                            <div className="flex space-x-4 pt-1 text-xs">
                              <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="radio" name="cert-modal" checked={formModality === 'Présentiel'} onChange={() => setFormModality('Présentiel')} />
                                <span>Présentiel</span>
                              </label>
                              <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="radio" name="cert-modal" checked={formModality === 'En ligne'} onChange={() => setFormModality('En ligne')} />
                                <span>En ligne</span>
                              </label>
                              <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="radio" name="cert-modal" checked={formModality === 'Hybride'} onChange={() => setFormModality('Hybride')} />
                                <span>Hybride</span>
                              </label>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-2">
                            <label className="flex items-start space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formTerms}
                                onChange={(e) => setFormTerms(e.target.checked)}
                                className="mt-0.5 shrink-0"
                              />
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                                J'autorise le cabinet CICEXF à enregistrer mes informations de contact pour le traitement réglementaire de mon dossier.
                              </span>
                            </label>
                            {errors.terms && <span className="text-[10px] text-red-500 block">{errors.terms}</span>}
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold rounded-lg text-xs tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 mt-4 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Valider mon Inscription</span>
                          </button>

                        </form>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              // 2.2 Filterable Certified Course Catalog Grid
              <div className="space-y-12 animate-in fade-in duration-300">
                
                {/* Advanced Filtering Options Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                  
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full md:flex-grow bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg px-3 py-2.5 flex items-center">
                      <Search className="w-4 h-4 text-slate-400 mr-2" />
                      <input
                        id="catalog-search-input"
                        type="text"
                        placeholder="Rechercher une certification d'excellence..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-450"
                      />
                    </div>
                    
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDomain('Tous');
                        setSelectedLevel('Tous');
                        setSelectedModality('Tous');
                      }}
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                    >
                      Réinitialiser
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {/* Domain Select */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Filtrer par Thème :</label>
                      <select
                        id="filter-domain-select"
                        value={selectedDomain}
                        onChange={(e) => setSelectedDomain(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg px-3 py-2 outline-none"
                      >
                        <option value="Tous">Tous les thèmes</option>
                        <option value="Informatique">Informatique &amp; BI</option>
                        <option value="QHSE">Ingénierie QHSE</option>
                        <option value="Finance">Ingénierie Financière</option>
                        <option value="SIG">Développement Territorial / SIG</option>
                        <option value="Audit">Audit &amp; Stratégie</option>
                      </select>
                    </div>

                    {/* Level Select */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Niveau requis :</label>
                      <select
                        id="filter-level-select"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg px-3 py-2 outline-none"
                      >
                        <option value="Tous">Tous les niveaux</option>
                        <option value="Débutant">Débutant</option>
                        <option value="Intermédiaire">Intermédiaire</option>
                        <option value="Avancé">Avancé</option>
                        <option value="Tous niveaux">Tous niveaux</option>
                      </select>
                    </div>

                    {/* Modality Select */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Modalité de cours :</label>
                      <select
                        id="filter-modality-select"
                        value={selectedModality}
                        onChange={(e) => setSelectedModality(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg px-3 py-2 outline-none"
                      >
                        <option value="Tous">Toutes les modalités</option>
                        <option value="Présentiel">Présentiel</option>
                        <option value="En ligne">En ligne</option>
                        <option value="Hybride">Hybride</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Course Cards Catalog Grid */}
                {filteredFormations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredFormations.map(formation => (
                      <div
                        key={formation.id}
                        id={`formation-card-${formation.id}`}
                        className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col h-full group"
                      >
                        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                          <img
                            src={formation.featuredImage}
                            alt={formation.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                          />
                          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase">
                            {formation.domain}
                          </div>
                          {formation.isFeatured && (
                            <div className="absolute top-4 right-4 bg-brand-emerald text-white text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                              Sélection Phare
                            </div>
                          )}
                        </div>

                        <div className="p-6 flex flex-col flex-grow space-y-4">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-brand-emerald" /> {formation.duration}</span>
                            <span>{formation.modality}</span>
                          </div>

                          <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-emerald transition-colors">
                            {formation.title}
                          </h3>

                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans line-clamp-3 flex-grow">
                            {formation.shortDescription}
                          </p>

                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <span className="font-bold text-sm text-brand-emerald font-mono">{formation.price}</span>
                            <button
                              onClick={() => handleSelectFormation(formation)}
                              className="px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-brand-emerald hover:text-white dark:hover:bg-brand-emerald text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                            >
                              <span>Voir le programme</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/50 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4 animate-in fade-in">
                    <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto animate-bounce" />
                    <h3 className="font-display text-base font-bold text-slate-800 dark:text-slate-200">Aucune formation trouvée</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Aucun cursus ne correspond exactement à vos critères de recherche actuels. Veuillez essayer en réinitialisant les filtres de recherche.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDomain('Tous');
                        setSelectedLevel('Tous');
                        setSelectedModality('Tous');
                      }}
                      className="px-5 py-2 bg-brand-emerald text-white text-xs font-bold rounded-xl"
                    >
                      Réinitialiser tous les filtres
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
