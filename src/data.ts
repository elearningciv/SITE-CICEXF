import { DomainIntervention, Formation, Project, BlogPost, TeamMember, Testimonial, Partner } from './types';

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
        title: "1. Analyse et planification des dispositifs de formation",
        description: "Nous orchestrons l'évaluation stratégique de vos besoins opérationnels en capital humain. Cette composante s'attache à cartographier la structure de vos effectifs et à élaborer des plans de renforcement des compétences robustes, alignés sur les objectifs de croissance à long terme de votre organisation. Qu'il s'agisse de concevoir des plans nationaux ou d'accompagner des structures privées, nous identifions avec rigueur les écarts de performance pour y apporte des solutions ciblées et de haut niveau.",
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
        title: "2. Conception pédagogique et innovation éducative",
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
        title: "3. Mise en œuvre des formations",
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
        title: "4. Évaluation et développement professionnel",
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
        title: "5. Structuration et financement des projets",
        description: "Sécurisez l'ingénierie financière de vos investissements majeurs. Nous vous accompagnons dans la conception de schémas de financement complexes (fonds propres, dettes de premier rang, subventions), l'élaboration de dossiers de crédit conformes aux exigences strictes des banques de développement multilatérales et la négociation d'accords durables avec les bailleurs.",
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
        title: "6. Analyse financière et gestion des investissements",
        description: "Prenez des décisions éclairées d'allocation de capital avec une rigueur absolue. Nous concevons des outils d'aide à la décision stratégique, analysent les profils de risques de portefeuilles, calculons les ratios de rentabilité complexes et simulons divers scénarios macro-économiques pour maximiser et sécuriser vos rendements.",
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
        title: "7. Comptabilité, fiscalité, audit et contrôle financier",
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
        title: "8. Entrepreneuriat et développement des entreprises",
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
        title: "9. Architecture et infrastructures informatiques",
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
        title: "10. Développement de systèmes et applications",
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
        title: "11. Sécurité et audit des systèmes d'information",
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
        title: "12. Transformation digitale et support technique",
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
        title: "13. Diagnostic et analyse géo-spatiale des territoires",
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
        title: "14. Planification et aménagement du territoire",
        description: "Concevez des plans d'aménagement résilients face aux défis environnementaux contemporains. Nous élaborons des schémas directeurs d'urbanisme, analysons les plans de mobility et structurons la planification durable de vos communes et régions.",
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
        title: "15. Gouvernance et développement local",
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
        title: "16. Observation et projets territoriaux",
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
        title: "17. Systèmes de management QHSE",
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
        title: "18. Normes et certifications",
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
        title: "19. Gestion des risques et sécurité",
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
        title: "20. Gestion environnementale et formation",
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
        title: "21. Audit et diagnostic organisationnel",
        description: "Identifiez scientifiquement les goulots d'étranglement qui freinent la croissance de votre groupe. Nous évaluons l'adéquation postes-profils, analysons en profondeur vos processus décisionnels et redéfinissons vos organigrammes de manière stratégique.",
        imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Réalisation d'audits organisationnels et fonctionnels",
          "Diagnostic des processus internes et de la chaîne de valeur",
          "Évaluation de la culture organisationnelle et du climat social",
          "Analyse des structures, rôles, responsabilités et modes de fonctionnement",
          "Audit de conformité juridique et réglementaire",
          "Évaluation de la performance globale de l'organisation",
          "Identification des dysfonctionnements et formulation de recommandations"
        ],
        software: ["MindManager", "Lucidchart Enterprise", "MS Visio Pro", "Adonix"],
        expertiseLevel: "Consultant Senior en Diagnostic Organisationnel"
      },
      {
        title: "22. Planification stratégique et transformation",
        description: "Bâtissez des feuilles de route robustes à 5 ou 10 ans avec des indicateurs clés (KPI) précis. Nous structurons votre vision stratégique, conseillons des plans de transformation sectoriels et accompagnons le changement culturel auprès de vos managers.",
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
        title: "23. Gouvernance et gestion institutionnelle",
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
        title: "24. Performance et renforcement des capacités",
        description: "Mobilisez le plein potentiel humain pour en faire un levier d'excellence durable. Nous élaborons des plans d'intéressement, optimisons la gestion prévisionnelle des emplois et compétences (GPEC) et mettons en place des académies d'entreprise.",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Évaluation des capacités institutionnelles et définition des priorités",
          "Développement et mise en œuvre de plans de renforcement des capacités",
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
        title: "25. Études techniques et économiques",
        description: "Validez la faisabilité scientifique de vos futurs chantiers et lancements d'envergure. Nous menons des études de marché approfondies, des analyses d'opportunités juridiques, et des évaluations de viabilité technique complète.",
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
        title: "26. Études environnementales et sociales",
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
        title: "27. Conception et planification des projets",
        description: "Convertissez vos grandes idées en projets hautement structurés et durables. Nous développons vos Théories du Changement, concevons des cadres logiques irréprochables et planifions la gestion des risques afférents à vos activités.",
        imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Développement de propositions et de dossiers de projets",
          "Élaboration de cadres logiques et théories du changement",
          "Planification opérationnelle et calendrier de mise en œuvre",
          "Budgétisation et planification des ressources des projets",
          "Gestion des risques projet et mesures d'atténuation",
          "Élaboration de plans de passation des marchés",
          "Conception de systèmes de suivi-évaluation et de reporting"
        ],
        software: ["MS Project Professional", "Primavera P6", "Trello Enterprise", "Asana Business"],
        expertiseLevel: "Ingénieur Planificateur & Expert en Ingénierie de Projets"
      },
      {
        title: "28. Audit et suivi, évaluation et capitalisation de projets",
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
        title: "29. Assistance technique et appui institutionnel des organisations",
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
        title: "30. Appui à la rédaction et à l'application des politiques et procédures internes",
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
        title: "31. Gestion des programmes et partenariats",
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
        title: "32. Dialogue institutionnel et mobilisation de ressources",
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
        title: "33. Appui à la mise en place de stratégies de management et de gestion",
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
        title: "34. Appui à la mise en place de stratégies commerciales et de développement de marchés",
        description: "Conquérez des parts de marché majeures à l'échelle locale et sous-régionale. Nous élaborons vos stratégies d'expansion commerciale innovantes, formons vos forces de vente et structurons vos partenariats de distribution.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        keyPoints: [
          "Analyse des marchés cibles et des opportunités commerciales",
          "Élaboration de plans marketing et de stratégies de développement commercial",
          "Développement d'offres de services et positionnement concurrentiel",
          "Mise en place de systèmes de prospection et de gestion de la relation client (CRM)",
          "Développement de partenaires commerciaux et de réseaux de distribution",
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

export const FORMATIONS: Formation[] = [
  {
    id: 'da-master',
    slug: 'data-analyst',
    title: "Data Analyst : Maîtrise complète de la collecte, de la préparation et de la visualisation des données",
    domain: "Informatique & Intelligence Décisionnelle",
    level: "Intermédiaire",
    modality: "Hybride",
    duration: "6 semaines (120 heures de cours et pratique)",
    price: "450 000 FCFA",
    isFeatured: true,
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    shortDescription: "La formation phare de référence pour devenir expert de la donnée en entreprise : de la collecte mobile KoboCollect à l'automatisation IA et Python.",
    context: "Dans un monde de plus en plus numérisé, les organisations publiques et privées font face à une explosion des données. Savoir collecter proprement ces données, les structurer, les nettoyer et les traduire en tableaux de bord stratégiques est devenu la compétence la plus recherchée sur le marché du travail international. Le CICEXF propose ce parcours d'excellence unique combinant les meilleurs outils modernes du marché (KoboCollect, Power BI, Python, et IA générative) pour doter les professionnels d'une polyvalence technique immédiatement opérationnelle.",
    objectives: [
      "Concevoir et déployer des formulaires de collecte de données mobiles hautement complexes avec KoboCollect.",
      "Importer, nettoyer, restructurer et automatiser la préparation de jeux de données volumineux.",
      "Maîtriser la modélisation de données complexes (Power Pivot, DAX) et concevoir des indicateurs de performance avancés.",
      "Créer des tableaux de bord interactifs professionnels et esthétiques facilitant la prise de décision managériale.",
      "Utiliser Python et Google Colab pour automatiser les analyses statistiques de base.",
      "Tirer profit des modèles d'Intelligence Artificielle pour coder plus vite et rédiger des rapports automatisés de qualité."
    ],
    resultsExpected: [
      "Autonomie totale de l'étudiant pour mener un projet de Business Intelligence de A à Z.",
      "Obtention de la double Certification CICEXF internationale et attestation d'aptitude professionnelle.",
      "Production d'un portfolio personnel de 3 projets d'analyse de données réels, prêts à être présentés en entretien.",
      "95% de taux de placement ou d'évolution salariale sous 6 mois pour nos diplômés."
    ],
    targetPublic: [
      "Responsables Suivi-Évaluation de projets de développement",
      "Consultants et experts d'organisations internationales",
      "Responsables financiers, marketing, logistiques et RH souhaitant basculer sur un pilotage par la donnée",
      "Jeunes diplômés en informatique, statistiques, économie, gestion de projet ou géographie",
      "Chercheurs et analystes d'études sectorielles"
    ],
    prerequisites: [
      "Avoir une maîtrise de base des outils bureautiques (Word, bases d'Excel).",
      "Posséder un ordinateur portable fonctionnel (Minimum 8 Go RAM recommandé, système Windows conseillé pour Power BI).",
      "Curiosité, rigueur intellectuelle et esprit de synthèse."
    ],
    program: [
      {
        module: "Module 1 : Introduction générale à la culture de la donnée & Cycle BI",
        details: [
          "Comprendre les enjeux de la donnée en entreprise et dans les projets internationaux.",
          "Définition du processus ETL (Extract-Transform-Load).",
          "Présentation de la feuille de route de la formation et des livrables de fin d'étude."
        ]
      },
      {
        module: "Module 2 : Collecte de données mobiles professionnelle avec KoboCollect & KoboToolbox",
        details: [
          "Création de compte KoboToolbox de niveau institutionnel.",
          "Conception de formulaires interactifs (sauts conditionnels, contraintes de validation, géolocalisation, signatures).",
          "Déploiement des formulaires sur l'application KoboCollect mobile pour tablettes et smartphones.",
          "Administration des droits d'accès, gestion des collecteurs de données sur le terrain et exportation des fichiers de données brute."
        ]
      },
      {
        module: "Module 3 : Importation & Modélisation de données (ETL)",
        details: [
          "Initiation complète à Power Query pour connecter les sources de données multiples (Excel, CSV, SQL, Web).",
          "Transformation de données : typage, fusion, regroupement de lignes, transpositions de colonnes, jointures complexes.",
          "Création d'un dictionnaire de variables propre et gestion des valeurs manquantes et aberrantes."
        ]
      },
      {
        module: "Module 4 : Nettoyage & Préparation avancée",
        details: [
          "Mise en place d'une routine automatisée de nettoyage pour rafraîchir les rapports d'un simple clic.",
          "Techniques d'homogénéisation des textes, correction des doublons, et calcul de colonnes personnalisées.",
          "Méthodes pour auditer la qualité d'un fichier de données volumineux."
        ]
      },
      {
        module: "Module 5 : Power Pivot, Modélisation relationnelle & DAX",
        details: [
          "Comprendre les schémas de base de données (Schéma en Étoile, Schéma en Flocon).",
          "Création des relations clés entre tables de faits et tables de dimensions.",
          "Introduction au langage DAX (Data Analysis Expressions) : fonctions CALCULATE, RELATED, SUM, DIVIDE et fonctions temporelles (YTD, MTD)."
        ]
      },
      {
        module: "Module 6 : Création de Tableaux de bord interactifs (Visualisation)",
        details: [
          "Règles d'or du Design d'interface (Data Storytelling, choix des couleurs institutionnelles, disposition des cartes).",
          "Configuration des visualisations majeures : graphiques à barres empilées, courbes de tendance, indicateurs de jauge, arbres de décomposition.",
          "Mise en place de filtres interactifs dynamiques (Slicers) et exploration hiérarchique (Drill-down).",
          "Création de boutons de navigation entre les pages de rapports."
        ]
      },
      {
        module: "Module 7 : Automatisation avec l'Intelligence Artificielle & Prompt Engineering",
        details: [
          "Utiliser l'IA (ChatGPT, Gemini) pour générer des formules DAX complexes ou déboguer du code de nettoyage.",
          "Intégration d'outils d'IA pour formuler des résumés textuels automatisés des points d'attention d'un tableau de bord.",
          "Pratiques concrètes d'optimisation des temps de travail grâce au prompt engineering de données."
        ]
      },
      {
        module: "Module 8 : Google Colab & Python pour l'analyse des données",
        details: [
          "Introduction au notebook Google Colab et aux bases de la syntaxe Python.",
          "Manipulation de la bibliothèque Pandas pour l'importation de fichiers.",
          "Calculs statistiques de base et génération instantanée de visualisations graphiques de corrélations.",
          "Remise finale des diplômes, présentation des projets et retours du jury d'experts."
        ]
      }
    ],
    sessions: [
      { date: "15 Juillet 2026", location: "Siège CICEXF Cocody Palmeraie & Zoom", status: "Disponible" },
      { date: "10 Septembre 2026", location: "Siège CICEXF Cocody Palmeraie & Zoom", status: "Disponible" },
      { date: "01 Novembre 2026", location: "Siège CICEXF Cocody Palmeraie & Zoom", status: "Bientôt" }
    ],
    faq: [
      { question: "La formation est-elle accessible aux débutants ?", answer: "Oui, absolument ! Le programme commence par les concepts fondamentaux de la culture des données et du traitement de base sous Excel, avant de monter progressivement en puissance sur Power Query, DAX, KoboCollect et Python." },
      { question: "Comment se déroulent les sessions en mode hybride ?", answer: "Les cours théoriques et les TP fondamentaux sont dispensés en présentiel dans nos salles équipées à Cocody, et diffusés simultanément en direct via Zoom pour les participants distants. Tous les cours sont enregistrés et restent accessibles à vie sur notre plateforme." },
      { question: "Proposez-vous des facilités de paiement ?", answer: "Oui, le règlement des frais de formation de 450 000 FCFA peut s'effectuer en 2 ou 3 versements (50% à l'inscription, 25% à la 3ème semaine, 25% à la fin)." },
      { question: "Quel diplôme ou certificat obtient-on ?", answer: "À la fin de la formation et après validation de votre projet de soutenance devant le jury, vous recevez un Certificat professionnel d'Expert Data Analyst du CICEXF, largement reconnu par les agences de développement et les grands groupes." }
    ]
  },
  {
    id: 'f-qhse-lead',
    slug: 'auditeur-lead-qhse',
    title: "Auditeur Interne QHSE et Management de la Qualité ISO 9001, 14001, 45001",
    domain: "Ingénierie QHSE",
    level: "Avancé",
    modality: "Présentiel",
    duration: "40 heures (5 jours)",
    price: "350 000 FCFA",
    featuredImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Formez-vous aux techniques d'audit interne selon les normes ISO majeures pour garantir la sécurité et la conformité industrielle.",
    context: "L'intégration des normes ISO 9001 (Qualité), ISO 14001 (Environnement) et ISO 45001 (Santé et Sécurité au Travail) est devenue un pilier fondamental pour la compétitivité et la résilience des industries modernes. Les entreprises requièrent des auditeurs capables de piloter des systèmes de management intégrés (SMI), d'identifier les risques de non-conformité et de mener des audits rigoureux. Ce parcours intensif certifiant dote les professionnels d'une méthodologie d'audit éprouvée, conforme aux lignes directrices de la norme ISO 19011.",
    objectives: [
      "Maîtriser les exigences clés des normes ISO 9001, ISO 14001 et ISO 45001.",
      "Comprendre la structure de haut niveau (HLS) pour concevoir un Système de Management Intégré (SMI).",
      "Planifier, préparer et réaliser un audit interne QHSE selon la norme de référence ISO 19011.",
      "Rédiger des rapports d'audit percutants et formuler des fiches de non-conformité claires.",
      "Suivre l'efficacité des actions correctives mises en œuvre après l'audit."
    ],
    resultsExpected: [
      "Maîtrise complète de la méthodologie de l'audit interne multi-référentiel.",
      "Obtention du Certificat d'Auditeur Interne QHSE délivré par le CICEXF.",
      "Capacité opérationnelle immédiate pour structurer et auditer un SMI en entreprise.",
      "92% de réussite aux études de cas pratiques d'audit réel."
    ],
    targetPublic: [
      "Responsables et Ingénieurs QHSE",
      "Chefs de projets industriels et directeurs d'usine",
      "Membres des comités de direction engagés dans la certification ISO",
      "Consultants QHSE juniors et auditeurs en reconversion"
    ],
    prerequisites: [
      "Connaissance préalable de base de l'environnement industriel ou de la gestion d'entreprise.",
      "Diplôme de niveau Bac+3 minimum ou expérience professionnelle équivalente de 2 ans."
    ],
    program: [
      {
        module: "Module 1 : Introduction aux concepts QHSE et à la structure de haut niveau (HLS)",
        details: [
          "Principes fondamentaux de la Qualité, Hygiène, Sécurité et Environnement.",
          "Avantages d'une approche intégrée en entreprise.",
          "Compréhension de la structure HLS commune aux normes ISO modernes."
        ]
      },
      {
        module: "Module 2 : ISO 9001 v2015 : Exigences du Management de la Qualité",
        details: [
          "Orientation client et approche processus.",
          "Analyse des risques et opportunités opérationnelles.",
          "Revues de direction et amélioration continue."
        ]
      },
      {
        module: "Module 3 : ISO 14001 v2015 : Management Environnemental",
        details: [
          "Analyse environnementale : identification des aspects et impacts significatifs.",
          "Conformité réglementaire et veille juridique.",
          "Plan de réponse aux situations d'urgence environnementale."
        ]
      },
      {
        module: "Module 4 : ISO 45001 v2018 : Santé et Sécurité au Travail",
        details: [
          "Évaluation des risques professionnels (Document Unique / DUER).",
          "Participation et consultation des travailleurs.",
          "Prévention des accidents et gestion des incidents de travail."
        ]
      },
      {
        module: "Module 5 : Conception du Système de Management Intégré (SMI)",
        details: [
          "Méthodologie de mutualisation des processus communs (documentations, audits, revues).",
          "Gouvernance et leadership de la direction.",
          "Indicateurs clés de performance QHSE."
        ]
      },
      {
        module: "Module 6 : La Norme ISO 19011 et la préparation de l'audit",
        details: [
          "Principes fondamentaux de l'audit.",
          "Élaboration du programme annuel d'audit et de la feuille de route.",
          "Rédaction du plan d'audit et élaboration des guides d'entretien."
        ]
      },
      {
        module: "Module 7 : Techniques de conduite de l'audit QHSE sur le terrain",
        details: [
          "Réunion d'ouverture et communication avec les audités.",
          "Recherche de preuves tangibles par échantillonnage.",
          "Gestion des situations de conflit et recueil des observations d'audit."
        ]
      },
      {
        module: "Module 8 : Clôture, Rapport d'audit et Actions Correctives",
        details: [
          "Réunion de clôture et présentation des conclusions.",
          "Rédaction du rapport d'audit officiel du SMI.",
          "Suivi des plans d'action et validation de la levée des non-conformités.",
          "Examen final écrit et simulation d'audit devant jury."
        ]
      }
    ],
    sessions: [
      { date: "22 Juillet 2026", location: "Siège CICEXF Cocody Palmeraie", status: "Disponible" },
      { date: "05 Octobre 2026", location: "Siège CICEXF Cocody Palmeraie", status: "Disponible" }
    ],
    faq: [
      { question: "Cette formation délivre-t-elle une certification reconnue ?", answer: "Oui, la formation est sanctionnée par un Certificat d'Auditeur Interne QHSE CICEXF, attestant de vos compétences pour préparer et mener des audits internes complets conformément aux exigences de la norme ISO 19011." },
      { question: "Quels sont les supports de cours fournis ?", answer: "Vous recevez l'intégralité des diaporamas, des modèles de grilles d'audit, des listes de contrôle (checklists) pour les normes ISO 9001/14001/45001, ainsi que des trames types de rapports d'audit prêtes à l'emploi." }
    ]
  },
  {
    id: 'f-finance-invest',
    slug: 'finance-marche-invest',
    title: "Analyse Financière, Évaluation d'Entreprise et Modélisation sur Excel",
    domain: "Ingénierie Financière",
    level: "Intermédiaire",
    modality: "Hybride",
    duration: "48 heures (6 samedis)",
    price: "400 000 FCFA",
    featuredImage: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Apprenez à bâtir des modèles financiers robustes, calculer le coût moyen pondéré du capital (CMPC) et évaluer les flux de trésorerie (DCF).",
    context: "L'analyse financière et la modélisation sous Excel sont des outils indispensables pour évaluer la santé économique d'une entreprise, structurer un plan de financement, ou conseiller une opération d'acquisition ou d'investissement. Les professionnels de la finance doivent maîtriser des modèles quantitatifs structurés capables de simuler divers scénarios économiques de manière transparente et rigoureuse. Ce programme d'excellence forme les participants aux meilleures pratiques des banques d'affaires et des cabinets d'audit internationaux.",
    objectives: [
      "Maîtriser le diagnostic financier complet d'une entreprise (bilan, compte de résultat, soldes intermédiaires de gestion).",
      "Analyser la rentabilité, la solvabilité et la structure de la trésorerie historique.",
      "Construire un modèle de prévision financière (3-Statement Model) entièrement dynamique sur Excel.",
      "Estimer le Coût Moyen Pontéré du Capital (CMPC/WACC) et le taux d'actualisation requis.",
      "Évaluer la valeur d'une entreprise via la méthode des flux de trésorerie actualisés (DCF) et les multiples comparables."
    ],
    resultsExpected: [
      "Capacité à concevoir de manière autonome un modèle financier dynamique professionnel de A à Z.",
      "Obtention du Certificat professionnel en Modélisation et Évaluation Financière du CICEXF.",
      "Savoir rédiger une note d'analyse financière synthétique destinée à des investisseurs ou des banques partenaires.",
      "Connaissance opérationnelle des raccourcis Excel avancés appliqués à la finance d'entreprise."
    ],
    targetPublic: [
      "Analystes financiers, contrôleurs de gestion, directeurs financiers (DAF)",
      "Chargés d'affaires en banque d'investissement, capital-investissement et microfinance",
      "Consultants financiers et experts-comptables stagiaires",
      "Entrepreneurs et repreneurs d'entreprises souhaitant valoriser leur projet"
    ],
    prerequisites: [
      "Bonne connaissance des notions de base de la comptabilité générale (Débit/Crédit, Bilan, Compte de résultat).",
      "Maîtrise intermédiaire d'Excel (formules logiques simples, manipulation de tableaux)."
    ],
    program: [
      {
        module: "Module 1 : Diagnostic financier approfondi et analyse des Soldes Intermédiaires de Gestion (SIG)",
        details: [
          "Restructuration du bilan comptable en bilan fonctionnel.",
          "Calcul de la marge commerciale, valeur ajoutée, EBE, et résultat net.",
          "Analyse de la rentabilité économique (ROC/ROCE) et financière (ROE)."
        ]
      },
      {
        module: "Module 2 : Analyse des Flux de Trésorerie et BFR",
        details: [
          "Comprendre le Besoin en Fonds de Roulement (BFR) d'exploitation.",
          "Tableau des flux de trésorerie de l'OEC / IAS 7.",
          "Calcul de la Capacité d'Autofinancement (CAF) et du Free Cash Flow."
        ]
      },
      {
        module: "Module 3 : Bonnes pratiques de modélisation financière sous Excel",
        details: [
          "Règles d'or de la structuration d'un tableur financier (couleurs, onglets inputs/calculs/outputs).",
          "Raccourcis indispensables pour modéliser rapidement sans souris.",
          "Gestion des formules d'erreur (SIERREUR, RECHERCHEV/X, INDEX/MATCH)."
        ]
      },
      {
        module: "Module 4 : Construction du Modèle de prévision à 3 états (3-Statement Model)",
        details: [
          "Modélisation des hypothèses de croissance du chiffre d'affaires et des charges.",
          "Calcul de l'amortissement et des investissements futurs (CapEx).",
          "Liaison dynamique automatique entre le compte de résultat, le bilan et la trésorerie."
        ]
      },
      {
        module: "Module 5 : Estimation du Coût du Capital et du WACC (CMPC)",
        details: [
          "Détermination du coût de la dette après impôt.",
          "Calcul du coût des fonds propres via le modèle d'évaluation des actifs financiers (MEDAF).",
          "Calcul de la structure optimale du capital et du coût moyen pondéré."
        ]
      },
      {
        module: "Module 6 : Évaluation par la méthode des Flux de Trésorerie Actualisés (DCF)",
        details: [
          "Modélisation des flux de trésorerie disponibles pour l'entreprise (FCFF).",
          "Choix du taux de croissance à l'infini (g) et calcul de la valeur terminale.",
          "Actualisation des flux et détermination de la valeur d'entreprise et de la valeur des capitaux propres."
        ]
      },
      {
        module: "Module 7 : Évaluation par les Multiples de Marché et Comparables",
        details: [
          "Sélection d'un échantillon d'entreprises comparables cotées ou de transactions récentes.",
          "Calcul des multiples d'évaluation : VE/CA, VE/EBITDA, PER.",
          "Application des multiples au modèle de l'entreprise cible."
        ]
      },
      {
        module: "Module 8 : Analyses de sensibilité et présentation managériale",
        details: [
          "Conception de tables de sensibilité dynamiques sur deux variables sous Excel.",
          "Modélisation de scénarios (Optimiste, Central, Pessimiste).",
          "Rédaction du mémo de valorisation et soutenance finale du modèle financier."
        ]
      }
    ],
    sessions: [
      { date: "18 Juillet 2026", location: "Siège CICEXF Cocody & Zoom", status: "Disponible" },
      { date: "12 Septembre 2026", location: "Siège CICEXF Cocody & Zoom", status: "Disponible" }
    ],
    faq: [
      { question: "Excel pour Mac est-il accepté ?", answer: "Oui, mais certaines fonctionnalités avancées ou raccourcis spécifiques peuvent différer. Durant la formation, les formateurs privilégient Excel sous Windows, qui reste le standard des équipes de finance." },
      { question: "Obtient-on des modèles financiers réutilisables après le cours ?", answer: "Oui, vous recevez une bibliothèque de templates Excel professionnels entièrement déverrouillés de modèles de prévision à 3 états, de DCF, d'analyses de sensibilité et de valorisation sectorielle." }
    ]
  },
  {
    id: 'f-sig-qgis',
    slug: 'sig-qgis-gestion-commune',
    title: "Systèmes d'Information Géographique (SIG) appliqués au Développement Local avec QGIS",
    domain: "Développement Territorial & SIG",
    level: "Débutant",
    modality: "Présentiel",
    duration: "36 heures (4 samedis)",
    price: "300 000 FCFA",
    featuredImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Maîtrisez la cartographie numérique pour optimiser la prise de décision spatiale et la gestion cadastrale des communes.",
    context: "La gestion moderne des territoires exige une maîtrise parfaite des dimensions géospatiales. Qu'il s'agisse de planification urbaine, de gestion des réseaux de distribution, d'aménagement agricole ou de décentralisation fiscale locale, les Systèmes d'Information Géographique (SIG) se sont imposés comme des outils décisionnels fondamentaux. Ce programme d'excellence basé sur le logiciel libre de référence QGIS permet aux participants d'acquérir les bases de la cartographie, du géoréférencement et de l'analyse spatiale pour structurer des projets territoriaux concrets.",
    objectives: [
      "Comprendre les concepts de base de la géodésie, des systèmes de coordonnées et des projections.",
      "Prendre en main l'interface complète de QGIS et configurer des projets cartographiques professionnels.",
      "Importer, créer, modifier et structurer des données géospatiales vectorielles et raster.",
      "Réaliser des analyses thématiques, des requêtes spatiales et des analyses de superposition complexes.",
      "Concevoir des cartes de qualité professionnelle, prêtes à être publiées ou intégrées à des rapports d'études."
    ],
    resultsExpected: [
      "Autonomie complète pour créer un projet SIG complet de A à Z avec QGIS.",
      "Obtention du Certificat professionnel d'Expert SIG QGIS du CICEXF.",
      "Production de 2 cartes professionnelles personnalisées directement valorisables auprès de vos employeurs.",
      "Compréhension pratique des protocoles d'intégration des données GPS récoltées sur le terrain."
    ],
    targetPublic: [
      "Urbanistes, géographes, environnementalistes et aménagistes du territoire",
      "Ingénieurs du génie civil, géomètres et gestionnaires de réseaux",
      "Agents techniques des mairies, ministères et collectivités territoriales",
      "Chargés d'études d'ONG intervenant sur des projets de développement local"
    ],
    prerequisites: [
      "Aisance générale avec l'outil informatique (gestion de dossiers, fichiers ZIP, navigation internet).",
      "Aucune connaissance préalable en cartographie numérique ou SIG n'est requise."
    ],
    program: [
      {
        module: "Module 1 : Concepts fondamentaux de la cartographie et introduction aux SIG",
        details: [
          "Définition d'un SIG et domaines d'application concrets.",
          "Modèles de données géographiques : Vectoriel (points, lignes, polygones) versus Raster (images, grilles).",
          "Compréhension essentielle des Systèmes de Coordonnées de Référence (SCR) et des projections (WGS 84, UTM)."
        ]
      },
      {
        module: "Module 2 : Prise en main de l'interface de QGIS et structuration d'un projet",
        details: [
          "Installation et configuration optimale de QGIS.",
          "Exploration de l'interface : barre d'outils, panneau des couches, explorateur.",
          "Gestion des extensions (plugins) majeures de la communauté."
        ]
      },
      {
        module: "Module 3 : Acquisition de données et connexion aux serveurs de cartes",
        details: [
          "Téléchargement de données libres (OpenStreetMap, bases de données mondiales).",
          "Connexion à des flux web cartographiques (WMS, WFS, XYZ Tiles, Google Maps).",
          "Importation de fichiers de coordonnées GPS (fichiers GPX, Excel avec latitude/longitude)."
        ]
      },
      {
        module: "Module 4 : Numérisation et création de bases de données spatiales",
        details: [
          "Création de nouvelles couches vectorielles (Shapefile, GeoPackage).",
          "Techniques avancées de numérisation à l'écran (accrochage automatique, édition de nœuds).",
          "Structuration de la table d'attributs : types de champs, calcul de surfaces et de longueurs."
        ]
      },
      {
        module: "Module 5 : Géoréférencement d'images et de cartes anciennes",
        details: [
          "Principe du géoréférencement.",
          "Calage d'une carte image numérisée (JPEG, PNG) ou d'un plan cadastral papier.",
          "Saisie des points de contrôle terrain et choix du type de transformation (spline, polynomiale)."
        ]
      },
      {
        module: "Module 6 : Analyse de données, requêtes attributaires et spatiales",
        details: [
          "Sélection d'entités par attributs (ex: Communes ayant plus de 50 000 habitants).",
          "Sélection spatiale (ex: Écoles situées à moins de 500 mètres d'une route principale).",
          "Création de zones de tampon (Buffer) et intersection de couches."
        ]
      },
      {
        module: "Module 7 : Représentation thématique et symbolisation des données",
        details: [
          "Règles de sémiologie graphique en cartographie.",
          "Création de cartes thématiques de symboles gradués ou catégorisés.",
          "Mise en place d'étiquettes dynamiques lisibles et évitement des chevauchements."
        ]
      },
      {
        module: "Module 8 : Composition de carte professionnelle et mise en page finale",
        details: [
          "Utilisation du gestionnaire de mise en page de QGIS.",
          "Ajout des éléments indispensables : échelle graphique, flèche du nord, légende complète, grilles de coordonnées.",
          "Exportation de la carte finale en haute résolution (PDF, PNG) pour intégration dans des rapports."
        ]
      }
    ],
    sessions: [
      { date: "25 Juillet 2026", location: "Siège CICEXF Cocody Palmeraie", status: "Disponible" },
      { date: "17 Octobre 2026", location: "Siège CICEXF Cocody Palmeraie", status: "Disponible" }
    ],
    faq: [
      { question: "Le logiciel QGIS est-il payant ?", answer: "Non, QGIS est un logiciel libre de droits (Open Source) totalement gratuit. Vous l'installerez sans frais sur votre ordinateur pendant le premier module de formation et pourrez continuer à l'utiliser sans limites." },
      { question: "Peut-on intégrer des données récoltées avec des smartphones ?", answer: "Oui ! Le cours comprend un volet spécifique sur la liaison entre les applications de collecte terrain (type KoboCollect ou Input) et QGIS pour mettre à jour instantanément vos bases de données géographiques." }
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
    shortDescription: "Une préparation intensive basée sur le PMBOK 7ème édition pour réussir l'examen PMP du premier coup.",
    context: "La certification PMP® (Project Management Professional) du Project Management Institute (PMI)® est la distinction la plus reconnue et la plus recherchée au niveau mondial dans le domaine de la gestion de projets. Elle atteste de votre maîtrise des approches prédictives (cascade), agiles et hybrides, ainsi que de votre leadership pour conduire des équipes vers le succès. Le CICEXF propose un parcours de préparation d'élite, conçu par des formateurs seniors certifiés, combinant cours structurés, simulateurs d'examens d'envergure internationale et coaching individualisé.",
    objectives: [
      "Maîtriser l'ensemble des 3 domaines clés de l'examen PMP : les Personnes, les Processus et l'Environnement Commercial.",
      "Intégrer les 12 principes de la gestion de projet et les 8 domaines de performance du PMBOK® 7ème Édition.",
      "Comprendre les cycles de vie de projet : prédictif, adaptatif (Agile, Scrum, Kanban) et hybride.",
      "Acquérir les techniques de gestion d'équipe, de résolution de conflits et d'engagement des parties prenantes.",
      "S'entraîner de manière intensive aux conditions de l'examen grâce à un simulateur d'examens de 2 000 questions."
    ],
    resultsExpected: [
      "Obtention de l'attestation officielle de 35 heures de contact de gestion de projet requise pour s'inscrire à l'examen PMP.",
      "96% de taux de réussite à l'examen PMP sous 3 mois après notre programme d'accompagnement.",
      "Dépôt validé et réussi de votre dossier d'éligibilité PMI® avec l'appui individuel de nos conseillers.",
      "Maîtrise complète de la boîte à outils moderne du manager de projet opérationnel."
    ],
    targetPublic: [
      "Chefs de projets, directeurs de programmes, directeurs de PMO",
      "Responsables de départements opérationnels, directeurs techniques, ingénieurs d'études",
      "Consultants seniors, experts indépendants, cadres des administrations publiques",
      "Professionnels de tous secteurs (BTP, Télécoms, Banque, Énergie, Humanitaire) gérant des projets d'envergure"
    ],
    prerequisites: [
      "Justifier d'un diplôme de niveau Bac+3 minimum avec 3 ans d'expérience en gestion de projet OU d'un niveau Bac+2 avec 5 ans d'expérience (exigence d'éligibilité du PMI).",
      "Accès stable à internet et ordinateur pour suivre les classes virtuelles interactives."
    ],
    program: [
      {
        module: "Module 1 : Introduction, Cadre de référence et Éligibilité au PMI",
        details: [
          "Présentation des exigences de l'examen PMP® et processus d'inscription.",
          "Comprendre la déontologie du chef de projet et l'environnement organisationnel.",
          "Structure générale du PMBOK Guide 7ème édition."
        ]
      },
      {
        module: "Module 2 : Domaine 'Les Personnes' - Leadership et Dynamique d'Équipe",
        details: [
          "Gérer les conflits de manière constructive au sein de l'équipe.",
          "Développer le leadership situationnel, motiver et inspirer les collaborateurs.",
          "Soutenir la performance de l'équipe et promouvoir l'autonomisation."
        ]
      },
      {
        module: "Module 3 : Domaine 'Les Personnes' - Gestion des Parties Prenantes et Communication",
        details: [
          "Identifier, analyser et cartographier les parties prenantes du projet.",
          "Établir un plan d'engagement et négocier des accords de projet.",
          "Planifier et optimiser les flux d'informations et de communication."
        ]
      },
      {
        module: "Module 4 : Domaine 'Les Processus' - Démarrage et Planification Prédictive",
        details: [
          "Rédiger la charte de projet et définir le périmètre (WBS/OTP).",
          "Planifier le calendrier de projet (méthode du chemin critique, diagramme de Gantt).",
          "Estimer les coûts et structurer le budget de projet (techniques d'estimation)."
        ]
      },
      {
        module: "Module 5 : Domaine 'Les Processus' - Gestion de la Valeur Acquise, Qualité et Approvisionnements",
        details: [
          "Suivre l'avancement physique et financier via la Gestion de la Valeur Acquise (EVM).",
          "Planifier et auditer les exigences qualité du projet.",
          "Gérer la passation des marchés, contrats de sous-traitance et relations fournisseurs."
        ]
      },
      {
        module: "Module 6 : Approches Agiles, Scrum et Gestion Hybride",
        details: [
          "Comprendre le Manifeste Agile et ses valeurs clés.",
          "Mise en œuvre des rôles (Product Owner, Scrum Master, Équipe) et des cérémonies Scrum (Daily, Sprint Planning, Retrospective).",
          "Modélisation de projets hybrides combinant planification prédictive et exécution agile."
        ]
      },
      {
        module: "Module 7 : Domaine 'L'Environnement Commercial' et Gestion des Risques",
        details: [
          "Identifier, analyser (qualitative et quantitative) et atténuer les risques de projet.",
          "Assurer la conformité réglementaire et la livraison de valeur opérationnelle.",
          "Piloter le changement organisationnel induit par le projet."
        ]
      },
      {
        module: "Module 8 : Stratégies de réussite à l'examen, Rédaction du dossier et Examens Blancs",
        details: [
          "Techniques de gestion du temps de l'examen (180 questions en 230 minutes).",
          "Analyse des astuces et pièges typiques de l'examen PMP.",
          "Validation finale de votre dossier d'inscription PMI par notre équipe.",
          "Série d'examens blancs complets minutés avec corrigés détaillés."
        ]
      }
    ],
    sessions: [
      { date: "11 Juillet 2026", location: "Classe Virtuelle Zoom Direct (Samedis)", status: "Disponible" },
      { date: "05 Septembre 2026", location: "Classe Virtuelle Zoom Direct (Samedis)", status: "Disponible" }
    ],
    faq: [
      { question: "Le coût de l'examen du PMI est-il inclus dans le prix de la formation ?", answer: "Non, les frais d'adhésion au PMI et d'examen (environ 405 USD pour les membres PMI) doivent être réglés directement sur le site officiel du PMI. Nous vous accompagnons gratuitement dans la préparation et la validation de votre dossier de candidature." },
      { question: "Que se passe-t-il si je ne réussis pas l'examen du premier coup ?", answer: "Grâce à notre simulateur de pointe et notre méthode d'apprentissage, notre taux de réussite dépasse 96%. Cependant, en cas d'échec, nous vous offrons un accès prolongé au simulateur et un coaching personnalisé de révision sans frais supplémentaires." }
    ]
  }
];

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
      { value: "+10 000", label: "Ménages supplémentaires raccordés grâce à l'efficacité gagnée" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    description: "Ce projet consistait à réviser la structure interne d'une importante compagnie de distribution publique d'énergie électrique, confrontée à des pertes opérationnelles sévères. Les équipes du CICEXF ont réalisé un audit d'adéquation profils-postes de 80 cadres, redessiné les circuits de décision, et conçu un système d'information de gestion intégré (KPI tableau de bord).",
    challenges: [
      "Résistance culturelle interne forte liée aux traditions managériales historiques.",
      "Dispersion géographique extrême des infrastructures d'exploitation compliquant la centralisation des données.",
      "Nécessité de répondre à un calendrier serré pour débloquer la tranche de subvention suivante."
    ],
    solutions: [
      "Mise en place d'un comité mixte d'accompagnement du changement impliquant les syndicats dès la phase 1.",
      "Déploiement d'une plateforme de Business Intelligence connectée via satellite pour un reporting en temps réel.",
      "Animation de 12 ateliers intensifs de formation des hauts dirigeants aux méthodologies de gouvernance internationale."
    ],
    testimonial: {
      text: "L'intervention de CICEXF a redonné de la clarté à nos équipes de direction. Le plan de restructuration est aujourd'hui appliqué avec des résultats tangibles sur notre efficacité opérationnelle et le raccordement effectif des usagers.",
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
    description: "Le CICEXF a mené les études topographiques, socio-économiques et cartographiques nécessaires pour doter trois communes de croissance rapide de documents d'aménagement résilients aux dérèglements climatiques. L'équipe a numérisé l'intégralité du cadastre sur un outil SIG libre et ouvert pour stimuler les recettes fiscales locales.",
    challenges: [
      "Absence d'historique de cartes géoréférencées fiables.",
      "Zones de litiges fonciers sensibles exigeant une médiation sociale d'experts locaux.",
      "Faible niveau d'équipement informatique initial des équipes techniques municipales."
    ],
    solutions: [
      "Utilisation combinée de l'imagerie satellite radar haute résolution et de survols réguliers par drone professionnel.",
      "Organisation d'audiences de concertation publiques avec les chefs de quartiers et propriétaires terriens.",
      "Don de 6 stations de travail de haute performance et mise en œuvre d'une académie SIG intensive de 3 semaines."
    ]
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
      { value: "100%", label: "Des formulaires terrain convertis du papier au mobile" },
      { value: "+30%", label: "De gain de temps sur le reporting mensuel des projets" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    description: "Dans le cadre d'un vaste programme d'harmonisation de l'évaluation des impacts humanitaires, le CICEXF a dispensé un cycle de renforcement de capacités sur-mesure de 6 semaines centré sur le triptyque : KoboCollect pour la récolte, Power Query pour la consolidation de données, et Power BI pour le tableau de bord décisionnel.",
    challenges: [
      "Hétérogénéité extrême des profils initiaux (de l'informaticien au sociologue sans compétences techniques).",
      "Contrainte de connexion internet intermittente sur les différents terrains opérationnels."
    ],
    solutions: [
      "Création de binômes de travail et accès permanent à une plateforme d'E-learning dotée de tutoriels en mode hors-ligne.",
      "Utilisation des capacités déconnectées de l'application KoboCollect garantissant la synchronisation dès retour réseau."
    ],
    testimonial: {
      text: "Nos équipes d'évaluation passent maintenant moins de temps à saisir des fiches papier et se concentrent sur l'analyse stratégique des indicateurs d'accès à l'eau potable.",
      author: "Mme Sarah Dembélé",
      role: "Coordonnatrice Suivi-Évaluation du Consortium"
    }
  }
];

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
      role: "Directeur de l'Ingénierie Technologique CICEXF",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
    },
    excerpt: "Découvrez les 5 étapes clés indispensables pour concevoir des formulaires mobiles robustes, sécurisés et opérationnels en mode hors-ligne pour vos équipes de terrain.",
    content: "Dans le cadre des projets de développement et des enquêtes d'impact socio-économique, la collecte de données sur support papier présente de nombreux risques : perte de fiches, erreurs de transcription manuelle, délais d'analyse de plusieurs semaines, et coûts logistiques élevés. \n\nL'utilisation de solutions mobiles comme KoboCollect (basée sur le standard ODK - Open Data Kit) révolutionne cette pratique. Cependant, concevoir un outil de collecte fiable ne s'improvise pas. \n\n### 1. La conception rigoureuse de la structure de données\nAvant de coder le formulaire sur KoboToolbox, il est vital d'élaborer un dictionnaire de variables clair. Définissez précisément le type de chaque question (texte, nombre décimal, date, coordonnées géographiques, photo, code QR).\n\n### 2. L'implémentation de contrôles de cohérence rigoureux\nL'un des plus grands avantages de la collecte mobile est d'interdire les incohérences à la saisie. Par exemple, si vous demandez l'âge d'un répondant, configurez une contrainte empêchant d'entrer un nombre négatif ou supérieur à 120. Utilisez les sauts conditionnels (skip logic) pour ne montrer une question que si la précédente a été répondue d'une certaine manière.\n\n### 3. La préparation de l'équipe de terrain\nUne formation d'une journée minimum est nécessaire. Les agents doivent simuler des entretiens sur tablette ou smartphone, tester les situations sans réseau internet, et apprendre à calibrer le GPS du terminal.\n\n### 4. Le suivi en temps réel de la qualité via le serveur\nL'administrateur de données doit vérifier quotidiennement les fiches synchronisées sur KoboToolbox. Si un enquêteur réalise des entretiens de 3 minutes alors que la moyenne est de 25 minutes, une alerte peut être levée immédiatement pour corriger le tir.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    tags: ["KoboCollect", "Data Collection", "Digitalisation", "Suivi-Evaluation"],
    guidePdfUrl: "#download-guide-kobo"
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
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
    },
    excerpt: "Évitez les pièges classiques de la sur-documentation et engagez réellement votre direction générale pour obtenir votre certification sans stress.",
    content: "La certification ISO 9001 est un atout concurrentiel majeur à l'international, démontrant votre rigueur structurelle et votre orientation client. Pourtant, de nombreuses PME s'épuisent dans des démarches trop complexes.\n\nLe secret réside dans l'approche par les risques et la simplification des processus. Ne créez pas des procédures pour plaire à l'auditeur, mais des fiches de tâches utiles pour vos collaborateurs.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    tags: ["ISO 9001", "Qualite", "Audit Interne", "QHSE"],
    guidePdfUrl: "#download-guide-iso"
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
      role: "Consultant Urbaniste & Spécialiste QGIS",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
    },
    excerpt: "De la gestion des déchets à l'optimisation des taxes locales, découvrez comment l'analyse spatiale transforme la gouvernance municipale.",
    content: "Administrer une commune sans base de données géographique, c'est comme piloter un navire sans boussole. Les systèmes d'information géographique (SIG) permettent de superposer sur une même carte l'implantation des écoles, l'état du réseau de voirie, et la répartition de la population.\n\nCes données spatiales aident à planifier des investissements rationnels, à modéliser les zones inondables pour protéger les vies, et à optimiser la collecte des taxes foncières en identifiant les parcelles non déclarées.",
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
    tags: ["QGIS", "SIG", "Communes", "Urbanisme", "Decentralisation"]
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 't1',
    name: "M. Amadou Diallo",
    role: "Directeur Général & Co-fondateur",
    category: 'Dirigeant',
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Fort de plus de 18 ans d'expérience dans le conseil stratégique et la modélisation de politiques publiques pour de prestigieux cabinets internationaux et des bailleurs multilatéraux. Expert en structuration de partenariats public-privé (PPP) et conduite du changement dans les grandes organisations.",
    linkedinUrl: "https://linkedin.com/in/amadou-diallo-cicexf-example",
    emailUrl: "a.diallo@cicexf.org"
  },
  {
    id: 't2',
    name: "Dr. Marc Koffi",
    role: "Directeur Général Adjoint & Chef du Pôle Formation",
    category: 'Dirigeant',
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    bio: "Docteur en Sciences de l'Éducation et Ingénieur Informaticien de formation. Pionnier de l'approche par compétences en Afrique de l'Ouest. Concepteur de plusieurs plateformes E-learning nationales et formateur certifié sur les technologies d'intelligence d'affaires.",
    linkedinUrl: "https://linkedin.com/in/marc-koffi-cicexf-example",
    emailUrl: "m.koffi@cicexf.org"
  },
  {
    id: 't3',
    name: "Mme Fatou Sylla",
    role: "Conseillère Spéciale & Experte en Ingénierie Financière",
    category: 'Conseil',
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Ancienne directrice d'investissement au sein d'un fonds de capital-risque panafricain. Titulaire d'un master de la London School of Economics, elle conseille les promoteurs de projets d'envergure sur la structuration de dettes et les levées de fonds stratégiques.",
    linkedinUrl: "https://linkedin.com/in/fatou-sylla-cicexf-example"
  },
  {
    id: 't4',
    name: "M. Sylvain Gnahoré",
    role: "Spécialiste Principal Aménagement du Territoire & SIG",
    category: 'Expert',
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Ingénieur géographe expert des dynamiques de décentralisation et des outils d'aide à la décision territoriale. Il a piloté plus de 30 missions de cartographie communale et d'élaboration de schémas directeurs.",
    linkedinUrl: "https://linkedin.com/in/sylvain-gnahore-cicexf-example"
  },
  {
    id: 't5',
    name: "Mme Émilie Bamba",
    role: "Responsable du Pôle QHSE & RSE",
    category: 'Expert',
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    bio: "Experte certifiée IRCA ISO 9001, 14001, et 45001. Accompagne les industries agroalimentaires et minières de la sous-région dans leur mise en conformité réglementaire et l'audit de leurs processus de sécurité.",
    linkedinUrl: "https://linkedin.com/in/emilie-bamba-cicexf-example"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test1',
    name: "M. Jean-Baptiste Yao",
    role: "Responsable Suivi-Évaluation",
    organization: "ONG Action pour le Progrès",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
    text: "La formation 'Data Analyst' du CICEXF a changé ma façon de travailler. J'ai pu informatiser tout notre système de collecte d'informations terrain avec KoboCollect et Power BI. Notre comité de direction a été impressionné par la clarté de nos nouveaux rapports !",
    rating: 5
  },
  {
    id: 'test2',
    name: "Mme Alima Coulibaly",
    role: "Analyste Financier",
    organization: "Sipro-Agri Holding",
    avatarUrl: "https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=100&q=80",
    text: "Le pôle ingénierie financière de CICEXF nous a accompagnés dans l'élaboration de notre modèle financier pour l'implantation de notre nouvelle filiale. Leur rigueur, leur disponibilité et leur compréhension parfaite des contraintes locales de financement sont exceptionnelles.",
    rating: 5
  },
  {
    id: 'test3',
    name: "M. Christian Bini",
    role: "Secrétaire Technique",
    organization: "Mairie de Bouaké",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
    text: "Une collaboration remarquable dans le cadre de la refonte de notre SIG cadastral. Grâce aux experts du cabinet, nos équipes sont formées et notre service d'urbanisme dispose enfin d'un outil fiable pour contrôler l'évolution de la commune.",
    rating: 5
  }
];

export const PARTNERS: Partner[] = [
  { id: 'p1', name: "Banque Mondiale", logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&q=80", category: "Bailleur Multilatéral" },
  { id: 'p2', name: "Ministère de l'Économie", logoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=100&q=80", category: "Institution Publique" },
  { id: 'p3', name: "AFD (Agence Française de Développement)", logoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=100&q=80", category: "Coopération Bilatérale" },
  { id: 'p4', name: "PNUD", logoUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=100&q=80", category: "Organisation Internationale" },
  { id: 'p5', name: "ECOWAS / CEDEAO", logoUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=100&q=80", category: "Institution Régionale" }
];
