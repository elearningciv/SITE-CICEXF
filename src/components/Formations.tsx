import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, SlidersHorizontal, BookOpen, Clock, BarChart, GraduationCap, 
  MapPin, CheckCircle, Calendar, Send, HelpCircle, ArrowLeft, Terminal, 
  AlertCircle, TrendingUp, Cpu, Map, ShieldAlert, FileSpreadsheet, Layers, 
  Users, CheckSquare, CornerDownRight, ChevronRight, Briefcase, Building2,
  FileText, MessageSquare, Compass, Sparkles, Filter, X, ChevronDown, Check,
  UserCheck, ShieldCheck
} from 'lucide-react';
import { FORMATIONS, DOMAINS_INTERVENTION } from '../data';
import { Formation, DomainIntervention, SubDomain } from '../types';
import { saveProspect } from '../lib/prospects';
import InteractiveSectionTabs from './InteractiveSectionTabs';
import { buildFormationTabSections, buildAccompanimentTabSections } from '../lib/interactiveTabsHelper';

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

function generateUniformDescription(sub: any) {
  const title = sub.title || "";
  
  const p1 = `Dans un contexte de transformation accélérée, la maîtrise opérationnelle de la spécialité "${title}" représente un levier majeur de compétitivité. Les organisations publiques et privées font face à des défis d'agilité et de conformité qui imposent de moderniser leurs processus opérationnels. Ce module apporte les réponses stratégiques indispensables pour anticiper les mutations sectorielles et sécuriser l'alignement des ressources sur les priorités de développement de votre entité.`;
  
  const p2 = `Ce parcours d'excellence permet d'atteindre des standards de performance élevés grâce à des objectifs d'apprentissage concrets et directement opérationnels. Les participants acquièrent la capacité de concevoir des cadres méthodologiques structurés, de piloter des indicateurs de réussite précis et de modéliser des solutions innovantes. L'accent est mis sur l'aide à la décision stratégique pour garantir des résultats à fort impact.`;
  
  let keySkills = "";
  if (sub.keyPoints && sub.keyPoints.length > 0) {
    const cleanedPoints = sub.keyPoints.slice(0, 2).map((kp: string) => {
      let text = kp.replace(/^\s*-\s*/, '').trim();
      if (text.length > 0) {
        text = text.charAt(0).toLowerCase() + text.slice(1);
      }
      return text;
    });
    keySkills = ` l'acquisition de compétences clés telles que ${cleanedPoints.join(', ')}`;
  } else {
    keySkills = " l'acquisition de compétences clés indispensables au management de projets d'envergure";
  }
  
  const softwareLabel = sub.software && sub.software.length > 0
    ? `, ainsi que la prise en main d'outils spécialisés comme ${sub.software.slice(0, 2).join(' et ')}`
    : "";
  
  const p3 = `La formation met l'accent sur${keySkills}${softwareLabel}. Notre démarche andragogique s'appuie sur une pédagogie active et participative, combinant de manière équilibrée des exposés interactifs, des ateliers de simulation pratiques de haut niveau et des résolutions de cas d'études sectoriels.`;
  
  const expertiseText = sub.expertiseLevel 
    ? ` Ce parcours est conçu pour valider un niveau de qualification de type : ${sub.expertiseLevel}.` 
    : "";
  
  const p4 = `L'accompagnement du CICEXF garantit un transfert de compétences optimal avec un retour sur investissement mesurable pour l'organisation.${expertiseText} À l'issue du cursus, les diplômés disposent de tous les atouts nécessaires pour occuper des postes à haute responsabilité stratégique, piloter des réformes structurelles d'envergure ou agir en qualité d'experts référents.`;

  return [
    { title: "Contexte et Défis", text: p1 },
    { title: "Objectifs de Performance", text: p2 },
    { title: "Compétences et Méthodologies", text: p3 },
    { title: "Valeur Ajoutée et Débouchés", text: p4 }
  ];
}

function SubDomainCard({ sub, sIdx, setCorpInterest, renderIcon, onClickCard, isLarge, onSelectDomain, currentDomainId }: any) {
  const [activeCardTab, setActiveCardTab] = useState<'info' | 'objectives' | 'results' | 'opportunities' | 'plus'>('info');
  const [cardTabId, setCardTabId] = useState<string>('description');
  const data = getTailoredDataForAxis(sub.title, sub);

  if (isLarge) {
    return (
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-full animate-in fade-in duration-300"
      >
        {/* Immersive Banner Image */}
        {sub.imageUrl && (
          <div className="relative h-52 sm:h-64 lg:h-72 w-full overflow-hidden bg-slate-950 shrink-0">
            <img
              src={sub.imageUrl}
              alt={sub.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="absolute bottom-5 left-6 right-6 flex flex-col space-y-2 z-10">
              <span className="self-start font-mono font-bold text-[9.5px] sm:text-[10px] text-white bg-[#8A1A24] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                Spécialité 0{sIdx + 1} &bull; Formations CICEXF
              </span>
              <h1 className="font-display font-extrabold text-lg sm:text-2xl lg:text-3xl text-white leading-tight drop-shadow-md max-w-4xl">
                {sub.title}
              </h1>
            </div>
          </div>
        )}

        <div className="p-0 border-t border-slate-100 dark:border-slate-800">
          <InteractiveSectionTabs
            description={sub.presentationService || sub.description}
            sections={buildAccompanimentTabSections(sub, DOMAINS_INTERVENTION.find(d => d.id === currentDomainId) || DOMAINS_INTERVENTION[0])}
            defaultTabId="description"
            activeTabId={cardTabId}
            onTabChange={setCardTabId}
            onActionClick={() => setCardTabId('sinscrire')}
            actionLabel="S'inscrire / Devis"
          />
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
              <p className="text-sm text-slate-950 dark:text-slate-50 leading-relaxed font-sans text-justify font-medium">
                {getDeepPresentation(sub).contexte}
              </p>
            </div>



            {/* Added Plus-Value block */}
            <div className="p-4 rounded-2xl bg-brand-blue/5 dark:bg-blue-950/20 border border-brand-blue/10 space-y-1">
              <span className="text-[9px] font-extrabold text-brand-blue dark:text-blue-450 uppercase tracking-widest block">Valeur Ajoutée CICEXF</span>
              <p className="text-[13px] text-slate-950 dark:text-slate-50 leading-relaxed text-justify italic font-semibold">
                "{getDeepPresentation(sub).plusValue}"
              </p>
            </div>

            {/* Original elements, kept intact but visually polished */}
            {sub.keyPoints && sub.keyPoints.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Compétences d'Excellence Enseignées :</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {sub.keyPoints.map((kp, kpIdx) => (
                    <div key={kpIdx} className="flex items-start text-black dark:text-white">
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
            <p className="text-xs sm:text-sm text-slate-950 dark:text-slate-50 font-bold leading-relaxed font-sans">
              Ces objectifs opérationnels garantissent un transfert de compétences d'impact immédiat en entreprise :
            </p>
            <div className="space-y-3 pt-1">
              {data.objectives.map((obj, oIdx) => (
                <div key={oIdx} className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center text-[10px] font-bold mr-3 shrink-0 mt-0.5">
                    {oIdx + 1}
                  </div>
                  <span className="text-[13px] font-semibold text-slate-950 dark:text-slate-50 leading-relaxed text-left">
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
            <p className="text-xs sm:text-sm text-slate-950 dark:text-slate-50 font-bold leading-relaxed font-sans">
              Le cabinet d'élite CICEXF s'engage sur l'excellence andragogique. Les résultats tangibles incluent :
            </p>
            <div className="space-y-3 pt-1">
              {data.results.map((res, rIdx) => (
                <div key={rIdx} className="flex items-start">
                  <CheckSquare className="w-4 h-4 text-brand-emerald mr-3 shrink-0 mt-0.5" />
                  <span className="text-[13px] font-semibold text-slate-950 dark:text-slate-50 leading-relaxed text-left">
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
            <p className="text-xs sm:text-sm text-slate-950 dark:text-slate-50 font-bold leading-relaxed font-sans">
              Cette spécialité de pointe ouvre des perspectives de carrière immédiates au plan national et international :
            </p>
            <div className="space-y-2 pt-1">
              {data.opportunities.map((opp, opIdx) => (
                <div key={opIdx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-start space-x-2 hover:border-brand-emerald/30 transition-all">
                  <Briefcase className="w-3.5 h-3.5 text-brand-emerald shrink-0 mt-0.5" />
                  <span className="text-[11.5px] font-extrabold text-slate-950 dark:text-slate-50 text-left leading-snug">
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
                  <p className="text-[11px] text-slate-950 dark:text-slate-50 font-semibold leading-relaxed text-justify">
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
              setCardTabId('sinscrire');
              setTimeout(() => {
                const el = document.getElementById('interactive-tab-custom-content');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            }}
            className="px-4 py-2 bg-[#8A1A24] hover:bg-[#6D141C] text-white rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
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
  formations?: Formation[];
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
];

export const COUNTRIES_LIST = [
  { code: 'CI', name: 'Côte d’Ivoire', dial: '+225', flag: '🇨🇮' },
  { code: 'SN', name: 'Sénégal', dial: '+221', flag: '🇸🇳' },
  { code: 'CM', name: 'Cameroun', dial: '+237', flag: '🇨🇲' },
  { code: 'BF', name: 'Burkina Faso', dial: '+226', flag: '🇧🇫' },
  { code: 'ML', name: 'Mali', dial: '+223', flag: '🇲🇱' },
  { code: 'GN', name: 'Guinée', dial: '+224', flag: '🇬🇳' },
  { code: 'BJ', name: 'Bénin', dial: '+229', flag: '🇧🇯' },
  { code: 'TG', name: 'Togo', dial: '+228', flag: '🇹🇬' },
  { code: 'GA', name: 'Gabon', dial: '+241', flag: '🇬🇦' },
  { code: 'CG', name: 'Congo-Brazzaville', dial: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'RD Congo', dial: '+243', flag: '🇨🇩' },
  { code: 'NE', name: 'Niger', dial: '+227', flag: '🇳🇪' },
  { code: 'TD', name: 'Tchad', dial: '+235', flag: '🇹🇩' },
  { code: 'MR', name: 'Mauritanie', dial: '+222', flag: '🇲🇷' },
  { code: 'MA', name: 'Maroc', dial: '+212', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisie', dial: '+216', flag: '🇹🇳' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgique', dial: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', dial: '+41', flag: '🇨🇭' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'US', name: 'États-Unis', dial: '+1', flag: '🇺🇸' },
  { code: 'AUTRE', name: 'Autre pays', dial: '+', flag: '🌐' },
];

export default function Formations({ selectedDomainId, setSelectedDomainId, setActiveTab, defaultSubTab, formations = FORMATIONS }: FormationsProps) {
  // Determine if outer routing requires a specific tab or selection
  const matchedFormation = selectedDomainId
    ? formations.find(f => f.id === selectedDomainId || f.slug === selectedDomainId || (selectedDomainId === 'data-analyst' && f.id === 'da-master'))
    : null;
  const isOuterCert = !!matchedFormation;
  const matchedOuterDomain = selectedDomainId && !matchedFormation
    ? DOMAINS_INTERVENTION.find(d => d.id === selectedDomainId)
    : null;

  // Active sub-tab state: 'domains', 'axes', or 'certifications'
  const [activeSubTab, setActiveSubTab] = useState<'domains' | 'axes' | 'certifications'>(
    defaultSubTab || 'certifications'
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
        ? formations.find(f => f.id === selectedDomainId || f.slug === selectedDomainId || (selectedDomainId === 'data-analyst' && f.id === 'da-master'))
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

  // Handle specialty selection from the header's brown sub-navigation band
  useEffect(() => {
    const handleSelectSpecialty = (e: Event) => {
      const customEvent = e as CustomEvent<{ domainId: string; index: number }>;
      if (customEvent && customEvent.detail) {
        const { domainId, index } = customEvent.detail;
        const found = DOMAINS_INTERVENTION.find(d => d.id === domainId);
        if (found) {
          setActiveSubTab('domains');
          setSelectedDomainObj(found);
          setActiveSubIdx(index);
          
          setTimeout(() => {
            const el = document.getElementById('domain-specialties-header');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 150);
        }
      }
    };

    window.addEventListener('select-specialty', handleSelectSpecialty);
    return () => window.removeEventListener('select-specialty', handleSelectSpecialty);
  }, []);

  // Filters state for catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Tous');
  const [selectedLevel, setSelectedLevel] = useState('Tous');
  const [selectedModality, setSelectedModality] = useState('Tous');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Timeline Module expansion index
  const [expandedModule, setExpandedModule] = useState<number>(0);

  // Core Certified Course Registration Form States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCountry, setFormCountry] = useState('CI');
  const [formPhone, setFormPhone] = useState('');
  const [formAccountType, setFormAccountType] = useState<'individuel' | 'entreprise'>('individuel');
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formSession, setFormSession] = useState('');
  const [formModality, setFormModality] = useState('Hybride');
  const [formTerms, setFormTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formationActiveTab, setFormationActiveTab] = useState<string>('description');

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
    setFormationActiveTab('description');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedFormation(null);
    setSelectedDomainId(null);
    setSubmitSuccess(false);
    setFormationActiveTab('description');
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

    if (formAccountType === 'entreprise' && (!formCompany.trim() || formCompany.trim().length < 2)) {
      newErrors.company = "Veuillez préciser le nom de votre entreprise ou organisation.";
    }

    if (!formName.trim() || formName.trim().length < 3) {
      newErrors.name = "Le nom complet doit comporter au moins 3 caractères.";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formEmail || !emailRegex.test(formEmail)) {
      newErrors.email = "Veuillez saisir une adresse email valide.";
    }

    if (!formPhone || formPhone.trim().length < 6) {
      newErrors.phone = "Le numéro de téléphone WhatsApp doit comporter au moins 6 chiffres.";
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

      const selectedCountryObj = COUNTRIES_LIST.find(c => c.code === formCountry) || COUNTRIES_LIST[0];
      const cleanPhone = formPhone.trim();
      const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `${selectedCountryObj.dial} ${cleanPhone}`;

      // Enregistrement automatique du prospect en base de données pour export Excel
      saveProspect({
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formattedPhone,
        type: formAccountType === 'entreprise' ? 'Demande Entreprise' : 'Candidature Formation',
        target: selectedFormation?.title || 'Formation Certifiante',
        session: formSession,
        modality: formModality || selectedFormation?.modality || 'Présentiel',
        company: formAccountType === 'entreprise' ? (formCompany.trim() || 'Entreprise') : '',
        notes: `Pays: ${selectedCountryObj.name} (${selectedCountryObj.dial}) | Type: ${formAccountType === 'entreprise' ? 'Compte Entreprise' : 'Compte Individuel'}${formRole.trim() ? ` | Poste: ${formRole.trim()}` : ''}`,
        channel: 'En ligne'
      });

      setTimeout(() => {
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormCompany('');
        setFormRole('');
        setFormSession('');
      }, 4000);
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

      // Enregistrement automatique du prospect entreprise en base de données
      saveProspect({
        name: corpName,
        email: corpEmail,
        phone: corpPhone,
        company: corpCompany || 'Non spécifiée',
        participants: 'Intra-entreprise',
        type: 'Demande Entreprise',
        target: corpInterest || 'Demande Intra-Entreprise',
        modality: 'Sur-mesure',
        channel: 'En ligne'
      });

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

      // Enregistrement automatique du prospect en base de données pour export Excel
      saveProspect({
        name: formName,
        email: formEmail,
        phone: formPhone,
        type: 'Inscription Individuelle',
        target: currentSpecialty,
        session: formSession,
        modality: formModality,
        channel: 'WhatsApp'
      });

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

      // Enregistrement automatique du prospect entreprise en base de données pour export Excel
      saveProspect({
        name: corpName,
        email: corpEmail,
        phone: corpPhone,
        company: corpCompany,
        participants: String(corpParticipants),
        type: 'Demande Entreprise',
        target: currentSpecialty,
        session: 'Sur-mesure',
        modality: corpModality,
        channel: 'WhatsApp'
      });

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

      // Enregistrement automatique du prospect en base de données pour export Excel
      saveProspect({
        name: formName,
        email: formEmail,
        phone: formPhone,
        type: 'Inscription Individuelle',
        target: currentSpecialty,
        session: formSession,
        modality: formModality,
        channel: 'Email'
      });

      const subject = `Inscription Individuelle - ${currentSpecialty}`;
      const body = `Bonjour CICEXF,\n\nJe souhaite m'inscrire à la spécialité suivante :\n${currentSpecialty}\n\nVoici mes coordonnées d'inscription :\n- Nom & Prénom : ${formName}\n- Email : ${formEmail}\n- Téléphone (WhatsApp) : ${formPhone}\n- Session souhaitée : ${formSession}\n- Modalité : ${formModality}`;
      window.location.href = `mailto:cabinetcicexf@gmail.com?cc=elearningciv@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

      // Enregistrement automatique du prospect entreprise en base de données pour export Excel
      saveProspect({
        name: corpName,
        email: corpEmail,
        phone: corpPhone,
        company: corpCompany,
        participants: String(corpParticipants),
        type: 'Demande Entreprise',
        target: currentSpecialty,
        session: 'Sur-mesure',
        modality: corpModality,
        channel: 'Email'
      });

      const subject = `Demande de Devis - ${currentSpecialty}`;
      const body = `Bonjour CICEXF,\n\nNous souhaitons obtenir un devis pour la spécialité suivante :\n${currentSpecialty}\n\nVoici les informations de notre organisation :\n- Entreprise / Organisme : ${corpCompany}\n- Nom du contact : ${corpName}\n- Email professionnel : ${corpEmail}\n- Téléphone : ${corpPhone}\n- Nombre de participants : ${corpParticipants}\n- Modalité souhaitée : ${corpModality}`;
      window.location.href = `mailto:cabinetcicexf@gmail.com?cc=elearningciv@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setCorpSuccess(true);
    }
  };

  // Unique domains dynamically extracted from available formations that have courses
  const availableDomains = [
    'Tous',
    ...Array.from(
      new Set(
        formations
          .map(f => f.domain || f.thematic)
          .filter((d): d is string => Boolean(d && d.trim()))
      )
    )
  ];

  // Filter certified courses
  const filteredFormations = formations.filter(f => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
                          f.title?.toLowerCase().includes(q) || 
                          f.shortDescription?.toLowerCase().includes(q) ||
                          f.domain?.toLowerCase().includes(q) ||
                          (f.specialty && f.specialty.toLowerCase().includes(q));
    
    const matchesDomain = selectedDomain === 'Tous' || 
      (f.domain && f.domain.toLowerCase().includes(selectedDomain.toLowerCase())) ||
      (selectedDomain && f.domain && selectedDomain.toLowerCase().includes(f.domain.toLowerCase())) ||
      (f.thematic && f.thematic.toLowerCase().includes(selectedDomain.toLowerCase()));

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
    <div id="formations-view" className="pt-4 pb-8 bg-slate-50 dark:bg-slate-950 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* -------------------- UNIFIED TOP TOOLBAR: DROPDOWN FILTER + SEARCH + FORMATIONS COUNT -------------------- */}
        {!selectedFormation && !selectedDomainObj && (
          <div className="mb-5 w-full animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              
              {/* 1. Bouton de filtre en liste déroulante (placé avant le bouton de recherche) */}
              <div className="relative shrink-0" ref={filterDropdownRef}>
                <button
                  type="button"
                  id="formations-filter-dropdown-btn"
                  onClick={() => setIsFilterDropdownOpen(prev => !prev)}
                  className={`w-full md:w-auto flex items-center justify-between space-x-2.5 px-4 py-2.5 sm:py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    selectedDomain !== 'Tous'
                      ? 'bg-brand-emerald text-white border-brand-emerald shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-brand-emerald/50 hover:text-brand-emerald'
                  }`}
                  title="Filtrer les formations par thématique"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Filter className={`w-4 h-4 shrink-0 ${selectedDomain !== 'Tous' ? 'text-white' : 'text-brand-emerald'}`} />
                    <span className="truncate max-w-[150px] sm:max-w-[200px] xl:max-w-[240px]">
                      {selectedDomain === 'Tous' ? 'Filtrer par thématique' : selectedDomain}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isFilterDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 sm:w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        Thématiques de formation
                      </span>
                      {selectedDomain !== 'Tous' && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDomain('Tous');
                            setIsFilterDropdownOpen(false);
                          }}
                          className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          Réinitialiser
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto p-1.5 space-y-1">
                      {availableDomains.map((theme) => {
                        const isSelected = selectedDomain === theme;
                        const count = theme === 'Tous'
                          ? formations.length
                          : formations.filter(f => 
                              f.domain === theme || 
                              f.thematic === theme || 
                              (f.domain && f.domain.toLowerCase().includes(theme.toLowerCase()))
                            ).length;

                        return (
                          <button
                            key={theme}
                            type="button"
                            onClick={() => {
                              setSelectedDomain(theme);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group ${
                              isSelected
                                ? 'bg-brand-emerald text-white font-bold shadow-sm'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate pr-2">
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 shrink-0 text-white" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0 group-hover:bg-brand-emerald" />
                              )}
                              <span className="truncate">{theme === 'Tous' ? 'Toutes les thématiques' : theme}</span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-brand-emerald/10 group-hover:text-brand-emerald'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Champ et Bouton de recherche */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex items-center gap-2 flex-1 min-w-[200px]"
              >
                <div className="relative flex-1 flex items-center pl-2">
                  <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                  <input
                    id="formations-main-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une formation, compétence..."
                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:ring-0"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white px-2 py-1 mr-1 cursor-pointer transition-colors"
                      title="Effacer la recherche"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  id="formations-search-btn"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shadow-md hover:scale-105 active:scale-95 shrink-0"
                >
                  <Search className="w-3.5 h-3.5 shrink-0" />
                  <span>Rechercher</span>
                </button>
              </form>

              {/* 3. Mention "X formations disponibles" sur la même ligne en haut */}
              <div className="flex items-center justify-center space-x-2 px-3.5 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-2xl shrink-0">
                <BookOpen className="w-4 h-4 text-brand-emerald shrink-0" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  <strong className="text-brand-emerald font-mono text-sm mr-1">{filteredFormations.length}</strong>
                  formation{filteredFormations.length > 1 ? 's' : ''} disponible{filteredFormations.length > 1 ? 's' : ''}
                </span>
                {(selectedDomain !== 'Tous' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDomain('Tous');
                      setSearchQuery('');
                    }}
                    className="text-slate-400 hover:text-red-500 ml-1 cursor-pointer transition-colors"
                    title="Réinitialiser"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------- */}
        {/*                           SUB-TAB 1: DOMAINS VIEW                          */}
        {/* -------------------------------------------------------------------------- */}
        {activeSubTab === 'domains' && (
          <div className="space-y-8">
            
            {/* 1.1 List of Training Domains (If none selected) */}
            {!selectedDomainObj ? (
              <div className="space-y-8 animate-in fade-in duration-300">
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
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={domain.subDomains[0]?.imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"}
                            alt={domain.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent"></div>
                          
                          {/* Title and Badge on image */}
                          <div className="absolute bottom-3 left-4 right-4 flex flex-col space-y-1 z-10">
                            <span className="self-start font-mono font-bold text-[9px] text-white bg-brand-emerald/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              Domaine {displayNum}
                            </span>
                            <h3 className="font-display font-extrabold text-[12px] sm:text-[13.5px] text-white leading-tight drop-shadow-md">
                              {domain.title}
                            </h3>
                          </div>

                          {/* Floating Icon */}
                          <div className="absolute top-4 left-4 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white shadow-sm">
                            {renderIcon(domain.iconName, "w-4 h-4")}
                          </div>
                        </div>

                        <div className="p-6 flex-grow flex flex-col justify-between">
                          <div className="space-y-2">
                            <p className="text-[11px] text-black dark:text-white font-sans font-medium leading-relaxed line-clamp-3 text-justify">
                              {domain.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="px-6 pb-6 pt-4 border-t border-slate-50 dark:border-slate-800/60 flex justify-between items-center text-xs">
                          <span className="font-bold text-black dark:text-white flex items-center">
                            <Layers className="w-3.5 h-3.5 mr-1 text-black dark:text-white" />
                            {domain.subDomains.length} spécialités clés
                          </span>
                          <span className="font-extrabold text-black dark:text-white flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                            <span>Découvrir</span>
                            <ChevronRight className="w-4 h-4 text-black dark:text-white" />
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
              <div className="space-y-6 animate-in fade-in duration-300 font-sans">
                
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
                    <p className="text-xs sm:text-sm text-black dark:text-white font-sans font-medium leading-relaxed text-justify">
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
                    /* Initial Grid of Specialties (Miniatures avec images et courtes descriptions) */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                      {selectedDomainObj.subDomains.map((sub, sIdx) => {
                        const shortDesc = sub.presentationService || sub.description || selectedDomainObj.shortDescription;
                        return (
                          <div
                            key={sIdx}
                            id={`sub-point-card-${selectedDomainObj.id}-${sIdx}`}
                            onClick={() => {
                              setActiveSubIdx(sIdx);
                              const el = document.getElementById('domain-specialties-header');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-brand-emerald/45 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                          >
                            <div>
                              {/* Background Image */}
                              {sub.imageUrl && (
                                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                                  <img
                                    src={sub.imageUrl}
                                    alt={sub.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                                  <div className="absolute bottom-3 left-4 right-4 flex flex-col space-y-1 z-10">
                                    <span className="self-start font-mono font-bold text-[8.5px] text-white bg-[#8A1A24] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                      Spécialité 0{sIdx + 1} &bull; CICEXF
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Content */}
                              <div className="p-5 space-y-2.5">
                                <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight group-hover:text-brand-emerald transition-colors duration-300">
                                  {sub.title}
                                </h3>
                                
                                {/* Petite description de la spécialité */}
                                <p className="text-xs text-slate-600 dark:text-slate-355 line-clamp-3 leading-relaxed">
                                  {shortDesc}
                                </p>
                              </div>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <span className="text-[10px] text-brand-emerald font-extrabold uppercase tracking-wider flex items-center space-x-1 group-hover:translate-x-1 transition-transform duration-300">
                                <span>Consulter la spécialité</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                              {sub.expertiseLevel && (
                                <span className="text-[8.5px] bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md uppercase">
                                  {sub.expertiseLevel}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Active Full Width View - No other specialty on the side */
                    <div className="w-full max-w-7xl mx-auto space-y-4 px-2 sm:px-4 lg:px-6 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between pb-1">
                        <button
                          onClick={() => setActiveSubIdx(null)}
                          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-brand-emerald hover:bg-slate-100 dark:hover:bg-slate-800 transition-all py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm cursor-pointer active:scale-95"
                        >
                          <ArrowLeft className="w-4 h-4 text-brand-emerald" />
                          <span>← Revenir aux miniatures des spécialités</span>
                        </button>
                        <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                          Spécialité 0{(activeSubIdx ?? 0) + 1} sur {selectedDomainObj.subDomains.length}
                        </span>
                      </div>

                      <SubDomainCard
                        sub={selectedDomainObj.subDomains[activeSubIdx]}
                        sIdx={activeSubIdx}
                        setCorpInterest={setCorpInterest}
                        renderIcon={renderIcon}
                        isLarge={true}
                        onSelectDomain={(domain: any) => {
                          setSelectedDomainObj(domain);
                          setActiveSubIdx(0);
                        }}
                        currentDomainId={selectedDomainObj.id}
                      />
                    </div>
                  )}
                </div>

                {/* Related Certified Formations in this Domain */}
                {(() => {
                  const relatedFormations = formations.filter(f => 
                    (f.domain && (
                      f.domain.toLowerCase().includes(selectedDomainObj.title.toLowerCase()) ||
                      selectedDomainObj.title.toLowerCase().includes(f.domain.toLowerCase())
                    )) ||
                    (f.thematic && (
                      f.thematic.toLowerCase().includes(selectedDomainObj.title.toLowerCase()) ||
                      selectedDomainObj.title.toLowerCase().includes(f.thematic.toLowerCase())
                    ))
                  );

                  if (relatedFormations.length === 0) return null;

                  return (
                    <div className="pt-10 border-t border-slate-200/60 dark:border-slate-800/60 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-emerald">
                            Programmes Certifiants Rattachés
                          </span>
                          <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 dark:text-white">
                            Formations d'Excellence dans ce Pôle ({relatedFormations.length})
                          </h3>
                        </div>
                        <button
                          onClick={() => {
                            setActiveSubTab('certifications');
                            setSelectedDomainObj(null);
                          }}
                          className="text-xs font-bold text-brand-emerald hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Voir tout le catalogue</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedFormations.map(rf => (
                          <div
                            key={rf.id}
                            onClick={() => {
                              setActiveSubTab('certifications');
                              setSelectedFormation(rf);
                              setSelectedDomainObj(null);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-brand-emerald/40 transition-all flex flex-col justify-between p-5 space-y-4 cursor-pointer group"
                          >
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-brand-emerald" /> {rf.duration}</span>
                                <span className="text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded font-bold">{rf.modality}</span>
                              </div>
                              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-emerald transition-colors">
                                {rf.title}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                {rf.shortDescription}
                              </p>
                            </div>
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                              <span className="font-bold text-xs text-brand-emerald font-mono">{rf.price}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSubTab('certifications');
                                  setSelectedFormation(rf);
                                  setSelectedDomainObj(null);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-3 py-1.5 bg-brand-emerald text-white text-xs font-bold rounded-xl hover:bg-brand-emerald-light transition-all flex items-center space-x-1 cursor-pointer"
                              >
                                <span>Voir le cursus</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
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
                                    <p className="text-xs sm:text-sm text-black dark:text-white font-bold font-sans line-clamp-1">
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
                              return (
                                <div className="px-4 pb-6 sm:px-6 sm:pb-8 pt-2 animate-in slide-in-from-top-2 duration-200 space-y-4 border-l-4 border-[#8A1A24] ml-6 sm:ml-9 text-left">
                                  <InteractiveSectionTabs
                                    description={sub.presentationService || sub.description}
                                    sections={buildAccompanimentTabSections(sub, domain)}
                                    defaultTabId="objectifs"
                                    onActionClick={() => handleRequestQuoteForAxis(domain, sub.title)}
                                    actionLabel="S'inscrire / Devis pour cet axe"
                                  />

                                  {/* Action Buttons */}
                                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3">
                                    <button
                                      onClick={() => handleSelectDomainObj(domain)}
                                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>Consulter la fiche complète du Pôle</span>
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
              <div className="space-y-6 animate-in fade-in duration-300">
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
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 items-center">
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
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                        <span className="flex items-center text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                          <Clock className="w-4 h-4 text-brand-emerald mr-1.5 shrink-0" />
                          {selectedFormation.duration}
                        </span>
                        <span className="flex items-center text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                          <GraduationCap className="w-4 h-4 text-brand-emerald mr-1.5 shrink-0" />
                          Niveau {selectedFormation.level}
                        </span>
                        <span className="flex items-center text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                          <MapPin className="w-4 h-4 text-brand-emerald mr-1.5 shrink-0" />
                          Mode {selectedFormation.modality}
                        </span>
                        <span className="flex items-center font-mono font-bold text-white bg-[#8A1A24]/70 px-3 py-1.5 rounded-lg border border-[#8A1A24]">
                          {selectedFormation.price || "450 000 FCFA"}
                        </span>
                      </div>

                      {/* Compact "S'inscrire" button in header */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setFormationActiveTab('sinscrire');
                            setTimeout(() => {
                              const el = document.getElementById('registration-form-card');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }, 80);
                          }}
                          className="px-6 py-2.5 bg-[#8A1A24] hover:bg-[#6D141C] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>S'inscrire</span>
                        </button>
                        <span className="text-[11px] text-slate-400">
                          Agrément N°25343/GTCA/RC/2025 &bull; Traitement sous 24h
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

                {/* Core Syllabus - Full Width for Maximum Space */}
                <div className="w-full space-y-6">
                  <InteractiveSectionTabs
                    title={selectedFormation.title}
                    description={selectedFormation.context || selectedFormation.shortDescription}
                    sections={buildFormationTabSections(
                      selectedFormation,
                      undefined,
                      (() => {
                        const selectedCountryObj = COUNTRIES_LIST.find(c => c.code === formCountry) || COUNTRIES_LIST[0];
                        return (
                          <div id="registration-form-card" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-[#8A1A24]/30 dark:border-[#8A1A24]/50 shadow-xl space-y-6">
                            
                            {/* Header of Grand Plan Form */}
                            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <span className="inline-flex items-center space-x-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#8A1A24] dark:text-red-400">
                                  <UserCheck className="w-4 h-4" />
                                  <span>Dossier d'Admission &amp; Inscription Directe</span>
                                </span>
                                <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 dark:text-white">
                                  Formulaire Officiel de Candidature — {selectedFormation.title}
                                </h3>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-mono text-sm sm:text-base font-extrabold text-[#8A1A24] dark:text-red-400 block">
                                  {selectedFormation.price || "450 000 FCFA"}
                                </span>
                                <span className="text-[10.5px] text-slate-400 block">Éligible conventions FDFP</span>
                              </div>
                            </div>

                            {submitSuccess ? (
                              <div id="registration-success-banner" className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-700 p-6 rounded-2xl space-y-3 text-emerald-900 dark:text-emerald-100 animate-in fade-in">
                                <div className="flex items-center space-x-3">
                                  <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  <div>
                                    <h4 className="font-extrabold text-base sm:text-lg">Candidature Enregistrée avec Succès !</h4>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300">Votre numéro de dossier a été généré et transmis à nos directeurs pédagogiques.</p>
                                  </div>
                                </div>
                                <p className="font-sans leading-relaxed text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-10">
                                  Un accusé de réception a été envoyé à <strong>{formEmail}</strong>. Un conseiller d'admission vous contactera très rapidement sur votre numéro WhatsApp pour valider vos prérequis et finaliser votre convention.
                                </p>
                                <div className="pl-10 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => setSubmitSuccess(false)}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
                                  >
                                    ← Soumettre une autre inscription
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <form onSubmit={handleRegisterSubmit} className="space-y-6 font-sans">
                                
                                {/* 1. ACCOUNT TYPE SELECTION (Individuel vs Entreprise) */}
                                <div className="space-y-2">
                                  <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                    Type d'inscription * :
                                  </label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                      type="button"
                                      onClick={() => setFormAccountType('individuel')}
                                      className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center space-x-3.5 ${
                                        formAccountType === 'individuel'
                                          ? 'border-[#8A1A24] bg-[#8A1A24]/5 dark:bg-[#8A1A24]/15 shadow-sm'
                                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                                      }`}
                                    >
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                        formAccountType === 'individuel' ? 'bg-[#8A1A24] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                      }`}>
                                        <Users className="w-5 h-5" />
                                      </div>
                                      <div>
                                        <span className={`block font-extrabold text-xs sm:text-sm ${
                                          formAccountType === 'individuel' ? 'text-[#8A1A24] dark:text-red-400' : 'text-slate-900 dark:text-white'
                                        }`}>
                                          Compte Individuel
                                        </span>
                                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                                          Candidature personnelle / Financement propre
                                        </span>
                                      </div>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setFormAccountType('entreprise')}
                                      className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center space-x-3.5 ${
                                        formAccountType === 'entreprise'
                                          ? 'border-[#8A1A24] bg-[#8A1A24]/5 dark:bg-[#8A1A24]/15 shadow-sm'
                                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                                      }`}
                                    >
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                        formAccountType === 'entreprise' ? 'bg-[#8A1A24] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                      }`}>
                                        <Building2 className="w-5 h-5" />
                                      </div>
                                      <div>
                                        <span className={`block font-extrabold text-xs sm:text-sm ${
                                          formAccountType === 'entreprise' ? 'text-[#8A1A24] dark:text-red-400' : 'text-slate-900 dark:text-white'
                                        }`}>
                                          Compte Entreprise
                                        </span>
                                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                                          Prise en charge entreprise, FDFP ou bon de commande
                                        </span>
                                      </div>
                                    </button>
                                  </div>
                                </div>

                                {/* Conditional Enterprise Fields */}
                                {formAccountType === 'entreprise' && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
                                    <div className="space-y-1.5">
                                      <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                        Nom de l'Entreprise / Organisation * :
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="Ex: Orange, Ministère, Sodeci, Cabinet..."
                                        value={formCompany}
                                        onChange={(e) => setFormCompany(e.target.value)}
                                        className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-all ${
                                          errors.company ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20'
                                        }`}
                                      />
                                      {errors.company && <span className="text-xs text-red-500 font-semibold block">{errors.company}</span>}
                                    </div>

                                    <div className="space-y-1.5">
                                      <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                        Fonction / Poste au sein de l'entreprise :
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="Ex: Responsable RH, DAF, Chef de Projet..."
                                        value={formRole}
                                        onChange={(e) => setFormRole(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20"
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* 2. PERSONAL DETAILS (Nom & Email) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                      Nom Complet * :
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Ex: KOUASSI Jean-Philippe"
                                      value={formName}
                                      onChange={(e) => setFormName(e.target.value)}
                                      className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-all shadow-sm ${
                                        errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20'
                                      }`}
                                    />
                                    {errors.name && <span className="text-xs text-red-500 font-semibold block">{errors.name}</span>}
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                      Adresse Email * :
                                    </label>
                                    <input
                                      type="email"
                                      placeholder="votre.email@domaine.com"
                                      value={formEmail}
                                      onChange={(e) => setFormEmail(e.target.value)}
                                      className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-all shadow-sm ${
                                        errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20'
                                      }`}
                                    />
                                    {errors.email && <span className="text-xs text-red-500 font-semibold block">{errors.email}</span>}
                                  </div>
                                </div>

                                {/* 3. COUNTRY SELECTOR & AUTO DIAL CODE PHONE */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Country Dropdown */}
                                  <div className="space-y-1.5">
                                    <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                      Pays de Résidence * :
                                    </label>
                                    <select
                                      value={formCountry}
                                      onChange={(e) => setFormCountry(e.target.value)}
                                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20 font-medium shadow-sm cursor-pointer"
                                    >
                                      {COUNTRIES_LIST.map((c) => (
                                        <option key={c.code} value={c.code}>
                                          {c.flag} {c.name} ({c.dial})
                                        </option>
                                      ))}
                                    </select>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                                      L'indicatif international s'ajuste automatiquement ci-contre.
                                    </span>
                                  </div>

                                  {/* WhatsApp / Phone with auto dial badge */}
                                  <div className="space-y-1.5">
                                    <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                      Numéro WhatsApp * :
                                    </label>
                                    <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-[#8A1A24] focus-within:ring-2 focus-within:ring-[#8A1A24]/20 shadow-sm transition-all">
                                      <div className="px-3.5 py-3 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold font-mono text-xs sm:text-sm flex items-center space-x-1.5 shrink-0 select-none">
                                        <span>{selectedCountryObj.flag}</span>
                                        <span>{selectedCountryObj.dial}</span>
                                      </div>
                                      <input
                                        type="tel"
                                        placeholder="Ex: 07 01 02 03 04"
                                        value={formPhone}
                                        onChange={(e) => setFormPhone(e.target.value)}
                                        className="w-full px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white bg-transparent outline-none font-medium placeholder-slate-400"
                                      />
                                    </div>
                                    {errors.phone ? (
                                      <span className="text-xs text-red-500 font-semibold block">{errors.phone}</span>
                                    ) : (
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                                        Indiquez votre numéro sans répéter l'indicatif.
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* 4. SESSION SOUHAITÉE & MODALITÉ */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                      Session Souhaitée * :
                                    </label>
                                    <select
                                      value={formSession}
                                      onChange={(e) => setFormSession(e.target.value)}
                                      className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-all shadow-sm cursor-pointer ${
                                        errors.session ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20'
                                      }`}
                                    >
                                      <option value="">-- Choisir une date de session --</option>
                                      {(selectedFormation.sessions && selectedFormation.sessions.length > 0) ? (
                                        selectedFormation.sessions.map((s, idx) => (
                                          <option key={idx} value={s.date}>{s.date} ({s.location})</option>
                                        ))
                                      ) : (
                                        <>
                                          <option value="Session en cours - Inscriptions ouvertes">Session en cours (Inscriptions ouvertes - Abidjan &amp; En ligne)</option>
                                          <option value="Prochaine cohorte certifiante">Prochaine cohorte certifiante (Mois prochain)</option>
                                          <option value="Session sur-mesure / Intra-entreprise">Session sur-mesure / Intra-entreprise (Sur site ou Hybride)</option>
                                        </>
                                      )}
                                    </select>
                                    {errors.session && <span className="text-xs text-red-500 font-semibold block">{errors.session}</span>}
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                      Modalité Préférée :
                                    </label>
                                    <div className="grid grid-cols-3 gap-2 pt-1">
                                      {(['Présentiel', 'En ligne', 'Hybride'] as const).map((m) => (
                                        <button
                                          key={m}
                                          type="button"
                                          onClick={() => setFormModality(m)}
                                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                                            formModality === m
                                              ? 'border-[#8A1A24] bg-[#8A1A24] text-white shadow-sm'
                                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                                          }`}
                                        >
                                          {m}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* 5. TERMS / CONSENT */}
                                <div className="space-y-1 pt-2">
                                  <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formTerms}
                                      onChange={(e) => setFormTerms(e.target.checked)}
                                      className="mt-1 shrink-0 accent-[#8A1A24] w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                                      J'autorise le Cabinet CICEXF à enregistrer mes informations de contact pour le traitement réglementaire de mon dossier de candidature et l'établissement des conventions de formation.
                                    </span>
                                  </label>
                                  {errors.terms && <span className="text-xs text-red-500 font-semibold block">{errors.terms}</span>}
                                </div>

                                {/* 6. SUBMIT BUTTON */}
                                <button
                                  type="submit"
                                  className="w-full py-4 bg-[#8A1A24] hover:bg-[#6D141C] text-white rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all flex items-center justify-center space-x-2.5 shadow-lg hover:shadow-xl cursor-pointer active:scale-98"
                                >
                                  <Send className="w-4 h-4" />
                                  <span>VALIDER MON INSCRIPTION</span>
                                </button>

                                <div className="pt-2 text-center">
                                  <span className="text-[11px] text-slate-400 inline-flex items-center space-x-1.5">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span>Traitement garanti sous 24h ouvrées &bull; Agrément officiel N°25343/GTCA/RC/2025</span>
                                  </span>
                                </div>

                              </form>
                            )}

                          </div>
                        );
                      })()
                    )}
                    defaultTabId="description"
                    activeTabId={formationActiveTab}
                    onTabChange={setFormationActiveTab}
                    onActionClick={() => {
                      setFormationActiveTab('sinscrire');
                      setTimeout(() => {
                        const el = document.getElementById('registration-form-card');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 80);
                    }}
                    actionLabel="S'inscrire à cette certification"
                  />

                  {/* FAQ if available */}
                  {selectedFormation.faq && selectedFormation.faq.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                      <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                        Foire Aux Questions (FAQ)
                      </h3>
                      <div className="space-y-3 text-xs font-sans">
                        {selectedFormation.faq.map((item, fIdx) => (
                          <div key={fIdx} className="space-y-1">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center">
                              <HelpCircle className="w-3.5 h-3.5 text-brand-emerald mr-2 shrink-0" />
                              <span>{item.question}</span>
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed pl-5 font-normal text-[11.5px]">
                              {item.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              // 2.2 Certified Course Catalog Grid (Full Width)
              <div className="animate-in fade-in duration-300">
                {/* Formation Cards Grid */}
                {filteredFormations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredFormations.map(formation => (
                      <div
                        key={formation.id}
                        id={`formation-card-${formation.id}`}
                        className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-brand-emerald/40 transition-all flex flex-col h-full group cursor-pointer"
                        onClick={() => handleSelectFormation(formation)}
                      >
                        {/* Clickable Image */}
                        <div 
                          className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFormation(formation);
                          }}
                          title={`Cliquer pour afficher les détails de la formation : ${formation.title}`}
                        >
                          <img
                            src={formation.featuredImage}
                            alt={formation.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[8.5px] font-bold px-2.5 py-1 rounded-full uppercase">
                            {formation.domain}
                          </div>
                          <div className="absolute top-3 right-3 flex items-center space-x-1">
                            {(formation.id.startsWith('f-') || formation.createdAt) && (
                              <div className="bg-amber-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center space-x-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Nouveau</span>
                              </div>
                            )}
                            {formation.isFeatured && (
                              <div className="bg-brand-emerald text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                                ★ Phare
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Clickable Text under the image */}
                        <div 
                          className="p-5 sm:p-6 flex flex-col flex-grow space-y-3 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFormation(formation);
                          }}
                          title={`Cliquer pour afficher les détails de la formation : ${formation.title}`}
                        >
                          <div className="flex justify-between text-[9.5px] font-bold text-slate-400 uppercase">
                            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-brand-emerald" /> {formation.duration}</span>
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">{formation.modality}</span>
                          </div>

                          <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-emerald transition-colors">
                            {formation.title}
                          </h3>

                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans line-clamp-3 flex-grow">
                            {formation.shortDescription}
                          </p>

                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <span className="font-bold text-xs sm:text-sm text-brand-emerald font-mono">{formation.price}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectFormation(formation);
                              }}
                              className="px-3.5 py-1.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                            >
                              <span>Voir le programme</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/50 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4 animate-in fade-in">
                    <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-display text-base font-bold text-slate-800 dark:text-slate-200">Aucune formation trouvée</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Aucun cursus ne correspond exactement à vos critères de recherche actuels. Veuillez essayer en réinitialisant les critères.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDomain('Tous');
                      }}
                      className="px-5 py-2.5 bg-brand-emerald text-white text-xs font-bold rounded-xl cursor-pointer shadow-md hover:bg-brand-emerald-dark transition-all"
                    >
                      Réinitialiser les critères
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
