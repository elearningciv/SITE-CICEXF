import { DomainIntervention } from './types';

export const DOMAINS_INTERVENTION: DomainIntervention[] = [
  {
    id: 'ing-formation',
    slug: 'ingenierie-formation',
    title: "Ingénierie de formation et de renforcement de capacités",
    shortDescription: "Analyse des besoins, conception de programmes sur-mesure et transfert de compétences de haut niveau.",
    description: "Le CICEXF accompagne les organisations publiques, privées et non gouvernementales dans le développement stratégique de leur capital humain. Notre démarche repose sur une ingénierie pédagogique moderne, axée sur les compétences pratiques, les technologies innovantes et des méthodes d'apprentissage adaptées aux exigences du marché mondial.",
    iconName: 'GraduationCap',
    subDomains: [
      {
        title: "Analyse et planification des dispositifs de formation",
        description: "Nous orchestrons l'évaluation stratégique de vos besoins opérationnels en capital humain. Cette composante s'attache à cartographier la structure de vos effectifs et à élaborer des plans de renforcement des compétences robustes, alignés sur les objectifs de croissance à long terme de votre organisation. Qu'il s'agisse de concevoir des plans nationaux ou d'accompagner des structures privées, nous identifions avec rigueur les écarts de performance pour y apporter des solutions ciblées et de haut niveau.",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Réalisation de diagnostics des besoins en formation (individuel, collectif, organisationnel)",
          "Analyse des contextes professionnels et des référentiels de compétences",
          "Élaboration de plans de formation stratégiques et opérationnels",
          "Définition des objectifs pédagogiques et des indicateurs de résultats",
          "Cartographie des compétences existantes et identification des écarts",
          "Veille sur les évolutions réglementaires et sectorielles en matière de formation"
        ],
        software: ["Microsoft Excel Advanced", "Power BI", "LMS Canvas", "Trello Enterprise"],
        expertiseLevel: "Niveau Senior - Direction de l'Ingénierie de Formation"
      },
      {
        title: "Conception pédagogique et innovation éducative",
        description: "Développez des parcours d'apprentissage de haut niveau centrés sur l'impact en entreprise. Nous combinons l'Approche Par Compétences (APC) avec des outils multimédias immersifs et interactifs pour moderniser la transmission du savoir de vos formateurs internes.",
        imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Ingénierie des curricula et des programmes de formation",
          "Conception de modules, séquences et supports pédagogiques adaptés",
          "Développement de formations en présentiel, distanciel et hybride (blended learning)",
          "Intégration des approches par compétences et apprentissage expérientiel",
          "Conception d'outils d'évaluation formative et sommative",
          "Développement de ressources pédagogiques numériques (e-learning, MOOC, vidéos)",
          "Approches innovantes : gamification, simulation, classes inversées, micro-learning"
        ],
        software: ["Articulate Storyline 360", "Moodle LMS", "Adobe Captivate", "Canva Pro", "Kahoot!"],
        expertiseLevel: "Direction d'Ingénierie Pédagogique et Technopédagogie"
      },
      {
        title: "Mise en œuvre des formations",
        description: "Garantissez une exécution logistique et andragogique d'excellence. Nos méthodes intègrent des techniques de facilitation actives, des ateliers pratiques de haut niveau et des formats d'apprentissage hybrides hautement engageants.",
        imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Animation de sessions de formation en présentiel et en ligne",
          "Facilitation d'ateliers participatifs et de groupes de travail",
          "Coordination logistique et administrative des formations",
          "Gestion des formateurs internes et externes (sélection, briefing, suivi)",
          "Accompagnement des apprenants tout au long du parcours de formation",
          "Mise en place de dispositifs de tutorat, mentorat et coaching pédagogique",
          "Déploiement de plateformes LMS (Learning Management System)"
        ],
        software: ["Zoom Enterprise", "Microsoft Teams", "Mural", "Google Workspace"],
        expertiseLevel: "Master Facilitateur & Consultants Certifiés"
      },
      {
        title: "Évaluation et développement professionnel",
        description: "Mesurez l'efficience réelle et pérennisez la montée en compétences de vos équipes. Grâce à des indicateurs scientifiques rigoureux inspirés des meilleurs modèles d'évaluation, nous vous aidons à valider le transfert effectif des acquis sur le terrain.",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Évaluation des acquis et de la progression des apprenants",
          "Mesure de l'impact des formations sur la performance professionnelle",
          "Élaboration de bilans de compétences et de parcours de certification",
          "Accompagnement à la validation des acquis de l'expérience (VAE)",
          "Suivi et capitalisation des bonnes pratiques en ingénierie de formation",
          "Développement de systèmes de reconnaissance et de valorisation des compétences",
          "Appui à la mise en place de dispositifs d'apprentissage continu"
        ],
        software: ["SPSS Statistics", "Typeform Professional", "Google Forms", "SurveyMonkey Enterprise"],
        expertiseLevel: "Expertise Senior en Évaluation d'Impact (Kirkpatrick L4)"
      }
    ],
    examples: [
      "Mise en œuvre du plan triennal de renforcement des capacités pour 450 cadres de l'administration publique.",
      "Accompagnement d'un groupe industriel dans la digitalisation de ses modules d'intégration de sécurité de chantier.",
      "Conception et animation de curriculums d'insertion professionnelle pour des projets financés par la Banque Mondiale."
    ]
  },
  {
    id: 'ing-financiere',
    slug: 'ingenierie-financiere',
    title: "Ingénierie financière et de l'investissement",
    shortDescription: "Modélisation financière complexe, structuration de levées de fonds et appui à l'investissement privé.",
    description: "Nous offrons une expertise pointue pour optimiser la structure financière des entreprises et structurer les projets d'investissement. Nos services s'adressent aux promoteurs de projets d'envergure, aux investisseurs ainsi qu'aux institutions financières recherchant des analyses rigoureuses et des solutions d'ingénierie financière fiables.",
    iconName: 'TrendingUp',
    subDomains: [
      {
        title: "Structuration et financement des projets",
        description: "Sécurisez l'ingénierie financière de vos investissements majeurs. Nous vous accompagnons dans la conception de schémas de financement complexes (fonds propres, dettes de premier rang, subventions), l'élaboration de dossiers de financement et de plans d'affaires (business plans) et la négociation d'accords durables avec les bailleurs.",
        imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Montage financier et structuration de projets d'investissement",
          "Recherche et mobilisation de financements (bailleurs, investisseurs, partenaires)",
          "Élaboration de dossiers de financement et de plans d'affaires (business plans)",
          "Accès aux financements publics, subventions et fonds structurels",
          "Négociation et structuration de partenariats public-privé (PPP)",
          "Mise en place de mécanismes de financement innovants (crowdfunding, obligations vertes)",
          "Accompagnement dans les appels d'offres et procédures d'appels à projets"
        ],
        software: ["MS Excel Advanced (Financial Modeling)", "F1F9 Modeling Standards", "Primavera P6", "Odoo ERP"],
        expertiseLevel: "Senior Investment Specialist & PPP Adviser"
      },
      {
        title: "Analyse financière et gestion des investissements",
        description: "Prenez des décisions éclairées d'allocation de capital avec une rigueur absolue. Nous concevons des outils d'aide à la décision stratégique, analysons les profils de risques de portefeuilles, calculons les ratios de rentabilité complexes et simulons divers scénarios macro-économiques pour maximiser et sécuriser vos rendements.",
        imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Analyse de la viabilité et rentabilité des projets d'investissement",
          "Élaboration de modèles financiers et de projections économiques",
          "Évaluation des risques financiers et analyse de sensibilité",
          "Gestion de portefeuilles d'investissement et suivi de la performance",
          "Analyse des marchés financiers et identification des opportunités",
          "Conseil en stratégie d'investissement et allocation d'actifs",
          "Accompagnement à la levée de fonds et à la gestion de la trésorerie"
        ],
        software: ["Microsoft Excel Solver", "Power BI Finance", "Crystal Ball", "Python (Quant Libraries)"],
        expertiseLevel: "Analyste Financier Certifié CFA / Directeur de Portefeuilles"
      },
      {
        title: "Comptabilité, fiscalité, audit et contrôle financier",
        description: "Pilotez vos flux de trésorerie de manière optimale et assurez une transparence irréprochable face aux autorités réglementaires. Cette composante englobe la mise en place de contrôles de gestion analytiques, l'audit de processus comptables internes et l'optimisation légale de votre fiscalité sous la réglementation SYSCOHADA révisée.",
        imageUrl: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Tenue de comptabilité générale et analytique",
          "Établissement des états financiers et reporting financier",
          "Conseil en optimisation fiscale et gestion des obligations fiscales",
          "Audit financier et comptable des organisations",
          "Contrôle interne et mise en place de procédures financières",
          "Accompagnement à la conformité réglementaire et aux normes comptables (SYSCOHADA, IFRS)",
          "Mise en place d'outils de contrôle de gestion et tableaux de bord financiers"
        ],
        software: ["Sage 100 Cloud", "SAP ERP Finance", "QuickBooks Enterprise", "SAGE Saari"],
        expertiseLevel: "Expert-Comptable Diplômé & Spécialiste SYSCOHADA"
      },
      {
        title: "Entrepreneuriat et développement des entreprises",
        description: "Propulsez les initiatives privées et accompagnez les start-up et PME vers la viabilité commerciale de long terme. Nous structurons des business plans bancables complets, formons à la gestion agile des risques entrepreneuriaux et perfectionnons l'art du pitch d'affaires face aux investisseurs internationaux.",
        imageUrl: "https://images.unsplash.com/photo-1556761175-49b3dcbc2c16?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Accompagnement à la création et au démarrage d'entreprises",
          "Développement de plans d'affaires et stratégies de croissance",
          "Conseil en développement commercial et accès aux marchés",
          "Appui à la formalisation et structuration juridique des entreprises",
          "Formation en gestion entrepreneuriale et compétences de direction",
          "Mise en réseau des entrepreneurs et accès aux écosystèmes d'affaires",
          "Accompagnement à la transformation digitale des PME"
        ],
        software: ["LivePlan", "Miro Canvas", "Pitchbook", "Canva Enterprise"],
        expertiseLevel: "Consultant Stratégique en Capital-Investissement & Mentor Startups"
      }
    ],
    examples: [
      "Levée de fonds de 15 millions d'euros pour une centrale de transformation agro-industrielle en Afrique de l'Ouest.",
      "Modélisation financière et due diligence pour un projet de centrale solaire de 30 MW.",
      "Optimisation de la trésorerie et restructuration de dettes pour une holding de logistique régionale."
    ]
  },
  {
    id: 'ing-informatique',
    slug: 'ingenierie-informatique',
    title: "Ingénierie informatique et systèmes de réseaux",
    shortDescription: "Transformation digitale, déploiement d'architectures Cloud hautement sécurisées et audit SI.",
    description: "Le pôle technologique du CICEXF conçoit, audite et modernise les infrastructures informatiques pour assurer la continuité d'activité, la sécurité des données et l'efficacité des processus collaboratifs. Nous aidons les leaders à faire des technologies un accélérateur de croissance.",
    iconName: 'Cpu',
    subDomains: [
      {
        title: "Architecture et infrastructures informatiques",
        description: "Concevez et déployez des parcs serveurs et des réseaux d'entreprise performants, agiles et évolutifs. Nous vous accompagnons dans l'ingénierie d'architectures hybrides et de solutions de stockage Cloud d'une haute disponibilité pour soutenir la croissance de vos opérations.",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Conception et déploiement d'architectures informatiques (on-premise, cloud, hybride)",
          "Installation et configuration de serveurs, réseaux LAN/WAN/Wi-Fi",
          "Virtualisation des infrastructures (VMware, Hyper-V, Proxmox)",
          "Gestion des centres de données (datacenter) et salles serveurs",
          "Planification de la capacité et évolutivité des systèmes",
          "Mise en place de solutions de sauvegarde et de continuité d'activité (PRA/PCA)",
          "Administration et maintenance des infrastructures télécoms"
        ],
        software: ["Cisco Packet Tracer", "VMware ESXi", "Windows Server 2022", "Linux RedHat"],
        expertiseLevel: "Architecte Réseaux & Systèmes Senior"
      },
      {
        title: "Développement de systèmes et applications",
        description: "Développez des solutions logicielles métiers sur-mesure pour automatiser vos processus les plus critiques. De l'analyse fonctionnelle au déploiement continu, nous concevons des portails web, applications mobiles et API robustes qui simplifient le quotidien de vos équipes et de vos clients.",
        imageUrl: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Développement d'applications web, mobiles et desktop sur mesure",
          "Conception de bases de données et systèmes d'information (ERP, CRM, SIRH)",
          "Intégration de systèmes et développement d'API/microservices",
          "Développement de solutions d'intelligence artificielle et machine learning",
          "Maintenance évolutive et corrective des applications existantes",
          "Tests, recette et assurance qualité logicielle",
          "Développement de plateformes collaboratives et de gestion documentaire"
        ],
        software: ["Visual Studio Code", "Docker", "Kubernetes", "PostgreSQL", "GitHub Enterprise"],
        expertiseLevel: "Directeur Technique / Ingénieur Logiciel Senior"
      },
      {
        title: "Sécurité et audit des systèmes d’information",
        description: "Sécurisez vos données stratégiques et confidentielles contre les cybermenaces émergentes. Nous réalisons des audits de vulnérabilité complets, mettons en place des protocoles d'authentification avancés et élaborons des Plans de Reprise d'Activité (PRA) résilients face aux incidents.",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Audit de sécurité informatique et tests d'intrusion (pentest)",
          "Mise en place de politiques et chartes de sécurité des SI",
          "Gestion des identités et des accès (IAM)",
          "Protection contre les cybermenaces et gestion des incidents de sécurité",
          "Conformité aux référentiels de sécurité (ISO 27001, RGPD, NIST)",
          "Formation et sensibilisation à la cybersécurité",
          "Mise en place de SOC (Security Operations Center) et SIEM"
        ],
        software: ["Kali Linux", "Wireshark", "Metasploit", "Nessus Professional", "pfSense"],
        expertiseLevel: "Expert en Cybersécurité Certifié CEH / CISSP"
      },
      {
        title: "Transformation digitale et support technique",
        description: "Accélérez la dématérialisation de vos processus administratifs lourds et favorisez l'adoption d'outils collaboratifs innovants. Nous mettons en œuvre des workflows automatisés (RPA) et concevons des plateformes d'assistance informatique (helpdesk) d'une efficacité sans faille.",
        imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Conduite du changement et stratégies de transformation numérique",
          "Diagnostic maturité digitale et feuille de route de transformation",
          "Déploiement d'outils collaboratifs et de communication digitale",
          "Formation des utilisateurs aux nouveaux outils et pratiques numériques",
          "Support technique de proximité et helpdesk",
          "Gestion du parc informatique et des licences logicielles",
          "Mise en place de systèmes de monitoring et de supervision"
        ],
        software: ["Jira Service Management", "Microsoft Power Automate", "Zapier Enterprise", "GLPI"],
        expertiseLevel: "Directeur de la Transformation Digitale & Manager Helpdesk"
      }
    ],
    examples: [
      "Audit de sécurité global et déploiement d'un Plan de Reprise d'Activité pour une institution de microfinance.",
      "Migration vers un Cloud hybride et refonte de l'infrastructure réseau de 12 agences interconnectées.",
      "Conception d'une plateforme de Business Intelligence centralisée pour le suivi des KPI d'un grand opérateur logistique."
    ]
  },
  {
    id: 'ing-territoriale',
    slug: 'ingenierie-developpement-territorial',
    title: "Ingénierie de développement territorial",
    shortDescription: "Aménagement stratégique, plans de développement locaux et appui aux collectivités territoriales.",
    description: "L'aménagement du territoire et le développement des collectivités locales nécessitent une approche inclusive, scientifique et transversale. Nous intervenons aux côtés des gouvernements et des municipalités pour planifier, valoriser et piloter les projets de développement durable et d'infrastructures collectives.",
    iconName: 'Map',
    subDomains: [
      {
        title: "Diagnostic et analyse géo spatiale des territoires",
        description: "Intégrez les outils cartographiques de référence mondiale pour piloter l'espace public de manière intelligente. Nous vous accompagnons dans le déploiement de Systèmes d'Information Géographique (SIG) pour analyser avec précision les dynamiques urbaines, rurales et environnementales.",
        imageUrl: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Réalisation de diagnostics territoriaux multidimensionnels",
          "Cartographie et analyse SIG (Systèmes d'Information Géographique)",
          "Études socioéconomiques et démographiques des territoires",
          "Analyse des dynamiques urbaines, rurales et périurbaines",
          "Collecte et traitement de données territoriales et statistiques",
          "Elaboration de bases de données géospatiales et d'atlas territoriaux",
          "Analyse des potentiels de développement et identification des contraintes territoriales"
        ],
        software: ["QGIS", "ArcGIS Pro", "Google Earth Engine", "PostGIS", "KoboCollect"],
        expertiseLevel: "Expert Principal en Géomatique et SIG"
      },
      {
        title: "Planification et aménagement du territoire",
        description: "Concevez des plans d'aménagement résilients face aux défis environnementaux contemporains. Nous élaborons des schémas directeurs d'urbanisme, analysons les plans de mobilité et structurons la planification durable de vos communes et régions.",
        imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Élaboration de schémas directeurs d'aménagement et d'urbanisme (SDAU, PDU)",
          "Plans d'occupation des sols et plans locaux d'urbanisme",
          "Planification stratégique du développement territorial",
          "Études d'impact territorial et d'évaluation environnementale stratégique",
          "Conception de plans de mobilité et d'accessibilité territoriale",
          "Planification des infrastructures et des équipements collectifs",
          "Aménagement de zones économiques, zones industrielles et parcs d'activités"
        ],
        software: ["AutoCAD Map 3D", "UrbanSim", "Google Earth Pro", "Adobe Illustrator"],
        expertiseLevel: "Urbaniste Conseil & Expert en Aménagement du Territoire"
      },
      {
        title: "Gouvernance et développement local",
        description: "Renforcez l'autonomie financière et le dynamisme budgétaire des collectivités locales. Nous formons les élus et cadres communaux à la décentralisation financière, à la gestion participative et à la levée de taxes locales de manière éthique et optimisée.",
        imageUrl: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Appui à la décentralisation et au renforcement des collectivités locales",
          "Mise en place de mécanismes de participation citoyenne et de démocratie locale",
          "Développement de stratégies de coopération décentralisée et intercommunalité",
          "Renforcement des capacités des élus et agents territoriaux",
          "Conseil en gouvernance locale et gestion des affaires publiques",
          "Appui à la mobilisation des ressources financières locales",
          "Développement des partenariats public-privé au niveau territorial"
        ],
        software: ["MS Excel Advanced", "GisCollect", "ODK (Open Data Kit)", "SAGE Local Gov"],
        expertiseLevel: "Spécialiste Senior en Décentralisation & Finances Locales"
      },
      {
        title: "Observation et projets territoriaux",
        description: "Structurez des projets de territoire à fort impact social. Nous développons des outils d'aide à la décision territoriale, mettons en place des observatoires d'indicateurs de développement et favorisons l'économie circulaire au sein des communautés.",
        imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Mise en place d'observatoires territoriaux et de systèmes de veille",
          "Conception et suivi d'indicateurs de développement territorial",
          "Développement de projets de développement local intégré",
          "Accompagnement de contrats de territoire et d'agendas locaux",
          "Capitalisation des expériences et bonnes pratiques territoriales",
          "Évaluation de politiques et programmes de développement territorial",
          "Accompagnement à l'émergence et la mise en œuvre de projets innovants de territoire"
        ],
        software: ["Power BI Desktop", "QGIS", "R Studio", "KoboToolbox"],
        expertiseLevel: "Directeur d'Observatoire Territorial & Conduite de Projets"
      }
    ],
    examples: [
      "Élaboration du Plan Communal de Développement de 3 régions pilotes face aux défis climatiques.",
      "Mise en place d'un SIG partagé pour le suivi des infrastructures routières et des réseaux d'eau d'une métropole.",
      "Étude d'impact socio-économique pour l'implantation d'une zone économique exclusive de libre-échange."
    ]
  },
  {
    id: 'ing-qhse',
    slug: 'ingenierie-qhse',
    title: "Ingénierie QHSE (Qualité, Hygiène, Sécurité, Environnement)",
    shortDescription: "Certifications ISO, audits d'impact environnemental et gestion globale des risques industriels.",
    description: "La conformité environnementale et la sécurité au travail sont désormais au cœur de la performance globale d'une organisation moderne. CICEXF apporte un appui technique pour implémenter des systèmes de management conformes aux standards internationaux (ISO 9001, 14001, 45001) et minimiser les risques.",
    iconName: 'ShieldAlert',
    subDomains: [
      {
        title: "Systèmes de management QHSE",
        description: "Structurez une culture de prévention et d'amélioration continue au sein de vos activités industrielles. Nous vous accompagnons dans la conception, la documentation, le suivi des indicateurs clés (TF, TG) et l'animation de politiques intégrées unifiées.",
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Conception et mise en place de systèmes de management intégrés (QSE)",
          "Élaboration de politiques, manuels et procédures QHSE",
          "Déploiement de plans d'action QHSE et suivi des indicateurs",
          "Conduite d'audits internes QHSE et revues de direction",
          "Accompagnement à la mise en conformité réglementaire",
          "Animation de comités QHSE et de groupes de travail",
          "Reporting QHSE et tableaux de bord de performance"
        ],
        software: ["HSE Soft", "Tafsquare", "Enablon", "MS Excel (HSE Dashboards)"],
        expertiseLevel: "Ingénieur Conseil en Systèmes de Management Intégrés QHSE"
      },
      {
        title: "Normes et certifications",
        description: "Guidez votre organisation vers la certification internationale (ISO 9001, 14001, 45001, 22000). Nous structurons des audits à blanc rigoureux et conseillons des processus fluides pour garantir le succès total de vos audits officiels.",
        imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Accompagnement aux certifications ISO 9001, 14001, 45001, 50001",
          "Préparation et suivi des audits de certification tierce partie",
          "Veille normative et réglementaire QHSE",
          "Mise en conformité avec les standards sectoriels et réglementations nationales",
          "Maintien et amélioration des certifications obtenues",
          "Accompagnement aux labellisations et éco-certifications",
          "Formation des équipes internes aux exigences normatives"
        ],
        software: ["SmarterPlay", "Qualio", "MS SharePoint", "AuditBoard"],
        expertiseLevel: "Auditeur Certifié IRCA ISO 9001 / 14001 / 45001"
      },
      {
        title: "Gestion des risques et sécurité",
        description: "Minimisez l'occurrence des accidents professionnels et protégez vos collaborateurs. Nous réalisons des cartographies de risques industriels détaillées, des plans d'urgence et mettons en œuvre des protocoles d'hygiène et de sécurité stricts.",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Identification, évaluation et hiérarchisation des risques professionnels",
          "Élaboration du Document Unique d'Évaluation des Risques (DUER)",
          "Mise en place de plans de prévention et de gestion des accidents du travail",
          "Développement de plans d'urgence et de gestion de crise",
          "Formation aux gestes et postures, premiers secours et évacuation",
          "Analyse des accidents et incidents : méthode des 5 pourquoi, arbre des causes",
          "Mise en place de systèmes de permis de travail et de consignation"
        ],
        software: ["BowTieXP", "ALOHA (SARA)", "PHA-Pro", "MS Project"],
        expertiseLevel: "Directeur HSE & Spécialiste de la Gestion des Risques Industriels"
      },
      {
        title: "Gestion environnementale et formation",
        description: "Incarnez la transition écologique industrielle. Nous concevons des plans de gestion des déchets, mesurons vos émissions carbone et dispensons des parcours éducatifs engageants pour mobiliser l'ensemble de vos équipes vers la neutralité carbone.",
        imageUrl: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Réalisation de bilans carbone et d'études d'empreinte environnementale",
          "Développement de plans de gestion des déchets et d'économie circulaire",
          "Évaluation des impacts environnementaux des activités",
          "Accompagnement à la transition écologique et au développement durable",
          "Formation à l'éco-responsabilité et aux pratiques environnementales",
          "Mise en place de systèmes de management environnemental",
          "Veille environnementale et accompagnement aux conformités réglementaires"
        ],
        software: ["SimaPro (ACV)", "Bilan Carbone ADEME", "OpenLCA", "KoboCollect"],
        expertiseLevel: "Spécialiste de l'Analyse d'Impact Environnemental & RSE"
      }
    ],
    examples: [
      "Accompagnement d'une compagnie minière vers la certification ISO 14001 (Management de l'Environnement).",
      "Réalisation de l'Étude d'Impact Social et Environnemental pour la construction d'un terminal portuaire.",
      "Mise en conformité QHSE complète et formation des équipes opérationnelles pour une usine de transformation chimique."
    ]
  },
  {
    id: 'ing-audit',
    slug: 'audit-consultance-strategie',
    title: "Audit, consultance et stratégie de développement des organisations",
    shortDescription: "Réorganisation institutionnelle, plans stratégiques à 5 ans et gouvernance d'excellence.",
    description: "Nous aidons les directions générales à formuler des visions ambitieuses et à les transformer en résultats concrets. Nos experts analysent les goulots d'étranglement organisationnels et conçoivent des structures agiles pour optimiser l'efficacité de vos équipes.",
    iconName: 'FileSpreadsheet',
    subDomains: [
      {
        title: "Audit et diagnostic organisationnel",
        description: "Identifiez scientifiquement les goulots d'étranglement qui freinent la croissance de votre groupe. Nous évaluons l'adéquation postes-profils, analysons en profondeur vos processus décisionnels et redéfinissons vos organigrammes de manière stratégique.",
        imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Réalisation d'audits organisationnels et fonctionnels",
          "Diagnostic des processus internes et de la chaîne de valeur",
          "Évaluation de la culture organisationnelle et du climat social",
          "Analyse des structures, rôles, responsabilités et modes de fonctionnement",
          "Audit de conformité juridique et réglementaire",
          "Évaluation de la performance globale de l'organisation",
          "Identification des dysfonctionnements et formulation des recommandations"
        ],
        software: ["MindManager", "Lucidchart Enterprise", "MS Visio Pro", "Adonix"],
        expertiseLevel: "Consultant Senior en Diagnostic Organisationnel"
      },
      {
        title: "Planification stratégique et transformation",
        description: "Bâtissez des feuilles de route de transformation stratégique. Nous structurons vos objectifs et accompagnons le changement stratégique et opérationnel des entreprises pour libérer leur plein potentiel.",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Accompagnement à l'élaboration de plans stratégiques pluriannuels",
          "Conduite de processus de réflexion et vision stratégique (retraites, séminaires)",
          "Développement de feuilles de route de transformation organisationnelle",
          "Analyse de l'environnement interne et externe (SWOT, PESTEL, Porter)",
          "Définition d'objectifs stratégiques et d'indicateurs de performance (BSC, OKR)",
          "Accompagnement à la gestion du changement et à la conduite de projets de transformation",
          "Révision et actualisation des stratégies en contexte de crise"
        ],
        software: ["StrategyBlocks", "Cascade Strategy", "Power BI", "Smartsheet"],
        expertiseLevel: "Expert en Planification Stratégique et Conduite du Changement"
      },
      {
        title: "Gouvernance et gestion institutionnelle",
        description: "Instaurez des structures de décision saines, hautement éthiques et performantes. Nous rédigeons des chartes de gouvernance vertueuses, conseillons sur la structuration de comités exécutifs et fiabilisons l'audit interne.",
        imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Appui à la mise en place de structures de gouvernance adaptées",
          "Révision des textes statutaires et réglementaires internes",
          "Clarification des rôles du conseil d'administration, de la direction et des parties prenantes",
          "Mise en place de systèmes de redevabilité et de transparence",
          "Accompagnement à la conformité aux exigences des partenaires et bailleurs",
          "Développement de politiques de gestion des conflits d'intérêts",
          "Formation des organes de gouvernance aux bonnes pratiques"
        ],
        software: ["Diligent Boards", "Boardable", "Governor", "MS Teams Enterprise"],
        expertiseLevel: "Conseiller de CODIR & Spécialiste en Gouvernance Institutionnelle"
      },
      {
        title: "Performance et renforcement des capacités",
        description: "Mobilisez le plein potentiel humain pour en faire un levier d'excellence durable. Nous élaborons des plans d'intéressement, optimisons la gestion prévisionnelle des emplois et compétences (GPEC) et mettons en place des académies d'entreprise.",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Évaluation des capacités institutionnelles et définition des priorités",
          "Développement et mise en oeuvre de plans de renforcement des capacités",
          "Mise en place de systèmes de gestion de la performance individuelle et collective",
          "Accompagnement au développement du leadership et des compétences managériales",
          "Mise en place de processus d'amélioration continue (Lean, Kaizen, PDCA)",
          "Développement de systèmes de knowledge management et de gestion des savoirs",
          "Benchmarking organisationnel et veille stratégique"
        ],
        software: ["Workday", "Talentsoft", "360 Feedback Tool", "LMS Moodle"],
        expertiseLevel: "Directeur Capital Humain & Expert GPEC"
      }
    ],
    examples: [
      "Définition du plan stratégique national de développement institutionnel pour un organisme inter-étatique.",
      "Restructuration complète des processus internes pour un leader régional du secteur de la distribution de gaz.",
      "Audit organisationnel et refonte de la grille de salaires et de performance pour une grande compagnie d'assurance."
    ]
  },
  {
    id: 'ing-projets',
    slug: 'etudes-specialisees-projets',
    title: "Études spécialisées et ingénierie de projets",
    shortDescription: "Formulation de projets de développement, études de marché et évaluation à mi-parcours.",
    description: "Une excellente idée n'aboutit que si elle est scientifiquement préparée et rigoureusement évaluée. Le CICEXF propose une palette complète d'études scientifiques, socio-économiques et techniques pour guider la prise de décision de haut niveau.",
    iconName: 'Layers',
    subDomains: [
      {
        title: "Études techniques et économiques",
        description: "Validez la faisabilité scientifique de vos futurs chantiers et lancements d'envergure. Nous menons des études de marché approfondies, des analyses d'opportunités juridiques et des évaluations de viabilité technique complète.",
        imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Réalisation d'études de faisabilité technique et économique",
          "Analyses coût-bénéfice et études de rentabilité socio-économique",
          "Études de marché et analyses sectorielles",
          "Élaboration d'études de préfaisabilité et de cadre logique",
          "Modélisation économique et projections d'impact",
          "Études techniques de dimensionnement et d'ingénierie",
          "Rédaction de termes de référence et de cahiers des charges techniques"
        ],
        software: ["Stata", "SPSS Statistics", "MS Excel Advanced", "EViews"],
        expertiseLevel: "Économiste de Projet & Analyste de Faisabilité"
      },
      {
        title: "Études environnementales et sociales",
        description: "Garantissez des projets socialement justes et durables. Nous réalisons des enquêtes d'impact environnemental fouillées, des plans d'action de réinstallation (PAR) et assurons la conformité avec les exigences ESG strictes des grands bailleurs.",
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Réalisation d'études d'impact environnemental et social (EIES)",
          "Plans de gestion environnementale et sociale (PGES)",
          "Études de sauvegarde sociale : déplacements, réinstallation, genre",
          "Consultations publiques et gestion des parties prenantes",
          "Évaluation environnementale stratégique (EES)",
          "Études de la biodiversité et des écosystèmes",
          "Accompagnement à la conformité aux standards environnementaux des bailleurs (BM, BAD, etc.)"
        ],
        software: ["SimaPro", "QGIS", "SocioSurvey", "ArcGIS"],
        expertiseLevel: "Sociologue & Expert en Études d'Impact Environnemental"
      },
      {
        title: "Conception et planification des projets",
        description: "Convertissez vos grandes idées en projets hautement structurés et durables. Nous développons vos Théories du Changement, concevons des cadres logiques irréprochables et planifions la gestion des risques afférents à vos activités.",
        imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Développement de propositions et de dossiers de projets",
          "Élaboration de cadres logiques et théories du changement",
          "Planification opérationnelle et calendrier de mise en oeuvre",
          "Budgétisation et planification des ressources des projets",
          "Gestion des risques projet et mesures d'atténuation",
          "Élaboration de plans de passation des marchés",
          "Conception de systèmes de suivi-évaluation et de reporting"
        ],
        software: ["MS Project Professional", "Primavera P6", "Trello Enterprise", "Asana Business"],
        expertiseLevel: "Ingénieur Planificateur & Expert en Planification de Projets"
      },
      {
        title: "Audit et suivi, évaluation et capitalisation de projets",
        description: "Maîtrisez le pilotage en temps réel de vos programmes de développement. Nous concevons vos plans de Suivi-Évaluation complets, automatisons la collecte de données sur le terrain via KoboCollect et créons des tableaux de bord Power BI hautement interactifs.",
        imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Conduite d'évaluations à mi-parcours et finales de projets",
          "Audit de gestion et de performance des projets",
          "Évaluations d'impact et mesure des effets durables",
          "Capitalisation et documentation des leçons apprises",
          "Rapportage aux bailleurs et partenaires financiers",
          "Évaluation de la durabilité et des conditions de pérennisation",
          "Revues de qualité des livrables et assurance qualité des projets"
        ],
        software: ["KoboToolbox / KoboCollect", "Power BI Desktop", "ODK", "Excel VBA"],
        expertiseLevel: "Spécialiste Suivi & Évaluation (M&E Specialist)"
      }
    ],
    examples: [
      "Étude de faisabilité socio-économique pour le raccordement électrique de 120 localités rurales isolées.",
      "Évaluation à mi-parcours d'un programme d'appui à la santé maternelle financé par la coopération multilatérale.",
      "Enquête nationale sur les compétences d'employabilité des jeunes diplômés intégrant la technologie KoboCollect."
    ]
  },
  {
    id: 'ing-accompagnement',
    slug: 'accompagnement-technique',
    title: "Accompagnement technique et institutionnel",
    shortDescription: "Assistance technique permanente auprès des ministères, agences publiques et bailleurs.",
    description: "Nous offrons une présence technique de long terme pour garantir le succès de la mise en œuvre de politiques publiques et de réformes structurelles. Nos experts résidents travaillent côte à côte avec vos équipes pour un transfert de compétences de chaque instant.",
    iconName: 'Users',
    subDomains: [
      {
        title: "Assistance technique et appui institutionnel des organisations",
        description: "Améliorez l'exécution quotidienne de vos programmes de développement et ministères sectoriels. Nos experts résidents s'intègrent à vos équipes pour transférer les meilleures pratiques de gestion opérationnelle internationale.",
        imageUrl: "https://images.unsplash.com/photo-1556761175-49b3dcbc2c16?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Mise à disposition d'experts et de conseillers techniques résidents ou ponctuels",
          "Appui à la prise en main de nouvelles fonctions managériales",
          "Soutien à la mise en oeuvre de réformes institutionnelles",
          "Accompagnement des organisations en situation de transition ou de crise",
          "Intégration des systèmes de gestion et des outils opérationnels",
          "Facilitation de processus participatifs et de co-construction",
          "Évaluation et suivi des performances institutionnelles"
        ],
        software: ["MS Project", "Trello Enterprise", "Slack Business", "SharePoint"],
        expertiseLevel: "Conseiller Technique Résident & Analyste Institutionnel"
      },
      {
        title: "Appui à la rédaction et à l’application des politiques et procédures internes",
        description: "Sécurisez vos opérations de passation de marchés et d'administration générale. Nous concevons des manuels de procédures de gestion clairs, hautement éthiques et parfaitement conformes aux critères des bailleurs internationaux.",
        imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Diagnostic des politiques et procédures existantes",
          "Rédaction de manuels de procédures administratives, financières et opérationnelles",
          "Élaboration de politiques RH, d'achats, de communication et de gestion des actifs",
          "Mise en conformité des procédures avec les exigences des bailleurs",
          "Formation du personnel à l'application des nouvelles politiques",
          "Révision périodique et mise à jour des procédures",
          "Développement de systèmes de contrôle de l'application des procédures"
        ],
        software: ["Qualio", "Process Street", "Adobe Acrobat Pro", "Loom"],
        expertiseLevel: "Spécialiste Senior en Passation de Marchés & Audit Financier"
      },
      {
        title: "Gestion des programmes et partenariats",
        description: "Orchestrez avec succès des coalitions multi-acteurs de grande envergure. Nous structurons des consortia de développement solides, assurons l'alignement stratégique des bailleurs et facilitons la coordination opérationnelle de terrain.",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Coordination de programmes multi-acteurs et multi-sites",
          "Gestion des relations avec les partenaires opérationnels et financiers",
          "Mise en place de cadres de coordination et de concertation",
          "Suivi de la conformité contractuelle et des engagements partenariaux",
          "Développement d'accords de partenariat et de conventions",
          "Animation de réseaux de partenaires et de coalitions",
          "Rédaction de rapports de programme et de synthèses de capitalisation"
        ],
        software: ["Smartsheet", "Podio", "Microsoft Teams Enterprise", "Power BI"],
        expertiseLevel: "Directeur de Programmes de Développement & Coordonnateur de Partenariats"
      },
      {
        title: "Dialogue institutionnel et mobilisation de ressources",
        description: "Incitez le changement réglementaire et financier par le plaidoyer constructif de haut niveau. Nous préparons vos dossiers de négociation lors de sommets multilatéraux et structurons des tables rondes de levées de fonds.",
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Accompagnement au dialogue avec les pouvoirs publics et institutions",
          "Représentation et plaidoyer auprès des partenaires stratégiques",
          "Développement de stratégies de communication institutionnelle",
          "Appui à la prospection et mobilisation de financements",
          "Accompagnement à la négociation de conventions et d'accords institutionnels",
          "Organisation de forums, tables rondes et événements de plaidoyer",
          "Développement d'outils de communication et de visibilité institutionnelle"
        ],
        software: ["Salesforce CRM", "HubSpot Pro", "Zoom Webinar", "MS PowerPoint (Advanced Presenting)"],
        expertiseLevel: "Expert en Plaidoyer Politique & Mobilisation des Ressources Bailleurs"
      },
      {
        title: "Appui à la mise en place de stratégies de management et de gestion",
        description: "Guidez la restructuration d'entreprises pour en libérer la performance humaine et économique. Nous conseillons les comités de direction sur le leadership moderne, la structuration d'objectifs OKR et la réorganisation agile.",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Diagnostic des pratiques managériales et de gouvernance",
          "Développement de systèmes de management par objectifs (MBO)",
          "Mise en place d'outils de pilotage et de tableaux de bord de direction",
          "Accompagnement à la structuration des fonctions support (RH, finance, logistique)",
          "Développement de politiques de gestion des ressources humaines",
          "Mise en place de systèmes d'évaluation de la performance du personnel",
          "Coaching et accompagnement des équipes dirigeantes"
        ],
        software: ["Weekdone (OKR)", "Asana Business", "Lattice", "Miro Board"],
        expertiseLevel: "Coach de Dirigeants Certifié & Consultant en Management Stratégique"
      },
      {
        title: "Appui à la mise en place de stratégies commerciales et de développement de marchés",
        description: "Conquérez des parts de marché majeures à l'échelle locale et sous-régionale. Nous élaborons vos stratégies d'expansion commerciale innovantes, formons vos forces de vente et structurons vos partenariats de distribution.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Analyse des marchés cibles et des opportunités commerciales",
          "Élaboration de plans marketing et de stratégies de développement commercial",
          "Développement d'offres de services et positionnement concurrentiel",
          "Mise en place de systèmes de prospection et de gestion de la relation client (CRM)",
          "Développement de partenariats commerciaux et de réseaux de distribution",
          "Accompagnement à la réponse aux appels d'offres et à la soumission de propositions",
          "Formation des équipes commerciales et développement des compétences de vente",
          "Stratégies de communication commerciale et de promotion des services"
        ],
        software: ["Pipedrive", "Tableau Desktop", "LinkedIn Sales Navigator", "Canva Enterprise"],
        expertiseLevel: "Directeur du Développement Commercial & Conseil en Marchés d'Afrique de l'Ouest"
      }
    ],
    examples: [
      "Assistance technique de 2 ans auprès du Ministère de l'Énergie pour l'implémentation de la politique de transition.",
      "Accompagnement de l'Unité de Gestion du Projet d'Urgence de Lutte contre les Inondations.",
      "Appui à la passation de marché pour un projet d'infrastructure routière nationale de 80 km."
    ]
  }
];
