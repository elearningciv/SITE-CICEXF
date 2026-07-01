export interface SubDomainEnrichment {
  diversifiedDescription: string;
  objectives: string[];
  expectedChanges: string;
  iconName: string;
  imageUrl: string;
}

export const ACCOMPANIMENT_ENRICHMENTS: Record<string, SubDomainEnrichment[]> = {
  'ing-formation': [
    {
      diversifiedDescription: "Plutôt que d'appliquer des méthodologies standards, notre démarche s'aligne rigoureusement sur vos processus internes pour cartographier de manière scientifique vos besoins de compétences. Nous diagnostiquons les écarts entre les compétences installées et celles requises par vos orientations stratégiques, assurant ainsi que chaque investissement en formation réponde directement à un impératif de performance opérationnelle.",
      objectives: [
        "Réaliser un diagnostic de compétences exhaustif et cartographier 100% des postes clés.",
        "Établir un référentiel de compétences opérationnel et directement actionnable par les RH.",
        "Concevoir un plan de formation pluriannuel optimisé budgétairement et fiscalement."
      ],
      expectedChanges: "L'entité dispose d'une visibilité souveraine sur ses ressources, élimine les actions de formation non productives (gain budgétaire moyen de 25%) et sécurise l'évolution de ses effectifs face aux mutations de son secteur.",
      iconName: "Compass",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Nous fusionnons l'andragogie moderne et la technopédagogie pour concevoir des curricula innovants adaptés au rythme et aux exigences opérationnelles des entreprises. En s'appuyant sur l'Approche Par Compétences (APC), notre pôle d'ingénierie crée des architectures de formation hybrides et des supports interactifs qui facilitent un ancrage mémoriel fort et durable.",
      objectives: [
        "Structurer des programmes de formation modulaires basés sur l'andragogie active et l'APC.",
        "Développer des boîtes à outils pédagogiques standardisées (guides, simulateurs, supports digitaux).",
        "Modéliser et scénariser des parcours e-learning interactifs pour une diffusion à grande échelle."
      ],
      expectedChanges: "Pour l'entité concernée, cela permet l'internalisation d'un patrimoine pédagogique propre, une réduction de 40% du temps d'intégration (onboarding) et une autonomisation des formateurs internes.",
      iconName: "Cpu",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Notre excellence opérationnelle garantit une animation andragogique d'impact menée exclusivement par des praticiens-experts de haut niveau. Nous déployons des ateliers de codéveloppement, des mises en situation réelles et des méthodes d'apprentissage collaboratives qui suscitent un haut niveau d'engagement de la part des participants.",
      objectives: [
        "Assurer des sessions animées par des experts qualifiés avec un taux de satisfaction supérieur à 95%.",
        "Mettre en œuvre des ateliers de résolution de problèmes réels rencontrés au quotidien par l'entité.",
        "Piloter le déploiement logistique multi-sites de manière fluide et transparente pour l'organisation."
      ],
      expectedChanges: "Les collaborateurs acquièrent des réflexes professionnels immédiats, renforcent la synergie de groupe et appliquent les meilleures pratiques dès le retour à leur poste de travail.",
      iconName: "Users",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "En refusant les bilans de fin de formation purement formels, nous centrons notre démarche sur l'évaluation scientifique de l'impact réel de l'apprentissage sur vos indicateurs de productivité. Nous mettons en œuvre des protocoles d'évaluation multicritères pour mesurer le transfert effectif des compétences et analyser le retour sur investissement (ROI).",
      objectives: [
        "Déployer des évaluations rigoureuses d'impact sur poste à J+30 et J+90 (Kirkpatrick Niveaux 3 & 4).",
        "Quantifier l'évolution des performances opérationnelles directement corrélée à la formation.",
        "Rédiger un rapport de capitalisation pour la Direction Générale justifiant les gains financiers."
      ],
      expectedChanges: "L'entité objective scientifiquement la rentabilité de ses investissements de formation, valorise ses talents internes de manière équitable et adapte en continu sa politique de formation.",
      iconName: "Target",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
    }
  ],
  'ing-financiere': [
    {
      diversifiedDescription: "Sécuriser les bases de vos grands projets nécessite une maîtrise absolue de l'ingénierie financière et du dialogue avec les bailleurs. Notre cabinet conçoit des schémas d'optimisation financière complexes (fonds propres, endettement syndiqué, subventions d'appui) et structure des dossiers d'investissement conformes aux critères de bancabilité les plus stricts.",
      objectives: [
        "Établir des modèles de projection financière auditables selon les standards bancaires de premier rang.",
        "Optimiser la structure de capital afin de réduire le coût moyen pondéré du capital (CMPC).",
        "Négocier des conditions de financement préférentielles auprès de bailleurs nationaux et multilatéraux."
      ],
      expectedChanges: "L'entité garantit le bouclage financier rapide de ses projets à fort impact, réduit son exposition aux risques de liquidité et assure une gouvernance financière solide.",
      iconName: "Landmark",
      imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Nous dotons les comités de direction d'outils analytiques robustes pour rationaliser chaque arbitrage d'investissement et sécuriser les allocations de ressources. En combinant modélisations de scénarios et analyses de sensibilité poussées, nous protégeons vos placements et maximisons vos retours de capitaux.",
      objectives: [
        "Réaliser des simulations Monte Carlo pour évaluer la sensibilité des projets aux risques de marché.",
        "Calculer avec précision les indicateurs clés de rendement (VAN, TRI, Indice de Profitabilité, payback).",
        "Établir des stratégies de couverture efficaces contre les fluctuations de taux et de change."
      ],
      expectedChanges: "Pour l'entité en question, le risque d'erreur d'investissement est réduit de 85%, et le rendement global du portefeuille d'actifs est significativement maximisé.",
      iconName: "BarChart2",
      imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Nous structurons vos fonctions comptables et fiscales pour en faire de véritables leviers de conformité, de transparence et d'optimisation budgétaire. En intégrant les impératifs des référentiels comptables régionaux et internationaux, nous auditons et sécurisons vos flux financiers.",
      objectives: [
        "Implémenter des procédures de contrôle interne rigoureuses selon le référentiel SYSCOHADA révisé.",
        "Optimiser l'assiette et la charge fiscale d'exploitation dans le strict respect de la réglementation.",
        "Mettre en place des tableaux de bord budgétaires consolidés facilitant l'aide à la décision."
      ],
      expectedChanges: "L'organisation élimine les risques de redressement fiscal ou comptable, fluidifie ses relations avec ses commissaires aux comptes et optimise son besoin en fonds de roulement.",
      iconName: "FileSpreadsheet",
      imageUrl: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Propulser l'initiative privée exige un encadrement stratégique pragmatique alliant structuration d'affaires et mentorat entrepreneurial de haut niveau. Nous collaborons avec les start-up et PME d'envergure pour formuler des plans d'affaires bancables et accroître leur maturité managériale face aux investisseurs.",
      objectives: [
        "Structurer et valider le modèle d'affaires (Business Model Canvas) au regard des réalités du marché.",
        "Concevoir des dossiers de levée de fonds complets et percutants (pitch deck, mémorandum d'information).",
        "Former les repreneurs et dirigeants à la gestion de la croissance et à la résilience entrepreneuriale."
      ],
      expectedChanges: "L'entité accélère sa courbe de croissance, réussit l'intégration de capitaux extérieurs de premier tour et s'établit durablement sur ses marchés cibles.",
      iconName: "TrendingUp",
      imageUrl: "https://images.unsplash.com/photo-1556761175-49b3dcbc2c16?auto=format&fit=crop&w=600&q=80"
    }
  ],
  'ing-informatique': [
    {
      diversifiedDescription: "Nous concevons et déployons des parcs informatiques résilients, agiles et alignés sur les exigences de haute disponibilité indispensables aux grandes entités modernes. De l'audit réseau à la migration Cloud, notre pôle technologique garantit l'évolution sécurisée de vos infrastructures.",
      objectives: [
        "Concevoir des parcs serveurs et des réseaux locaux hautement sécurisés et redondés à 99.99%.",
        "Piloter l'architecture et la migration hybride vers les plateformes Cloud leaders (AWS, Google Cloud, Azure).",
        "Assurer la virtualisation optimale de vos serveurs pour réduire la consommation d'énergie et de matériel."
      ],
      expectedChanges: "L'entité supprime les goulots d'étranglement de bande passante, réduit de 35% ses coûts de maintenance matérielle et assure un service continu et performant.",
      iconName: "Network",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Notre ingénierie logicielle conçoit des solutions d'affaires sur-mesure visant à automatiser l'intégralité de vos processus opérationnels les plus critiques. À travers une méthodologie agile rigoureuse, nous créons des outils intuitifs de gestion intégrée, des portails métiers sécurisés et des API de haute performance.",
      objectives: [
        "Développer des solutions applicatives robustes adaptées aux spécificités de votre secteur.",
        "Concevoir des API unifiées facilitant l'interconnexion sécurisée entre vos progiciels.",
        "Déployer des usines logicielles modernes (CI/CD) pour un déploiement continu et sans faille."
      ],
      expectedChanges: "Pour l'entité concernée, l'automatisation des flux élimine le risque d'erreur humaine de saisie, divise par deux le délai de traitement des tâches et accroît l'efficacité globale.",
      iconName: "Cpu",
      imageUrl: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Protéger l'intégrité de vos flux de données stratégiques face aux cybermenaces émergentes est au cœur de nos audits de cybersécurité de haut niveau. Nous réalisons des cartographies de risques informatiques, mettons en conformité vos traitements et élaborons des plans de résilience d'urgence.",
      objectives: [
        "Réaliser des tests d'intrusion (PenTest) et des audits de vulnérabilité de l'infrastructure.",
        "Élaborer et tester de manière pratique des Plans de Reprise d'Activité (PRA) face aux rançongiciels.",
        "Assurer la conformité réglementaire de traitement de vos données sensibles."
      ],
      expectedChanges: "L'organisation minimise drastiquement sa surface d'attaque, prévient les fuites de données confidentielles et garantit une résilience immédiate en cas de sinistre.",
      iconName: "Shield",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Nous transformons vos flux documentaires et accélérons la dématérialisation de vos processus les plus chronophages pour libérer la productivité humaine. À travers la mise en place d'automates logiciels (RPA) et de plateformes de support, nous orchestrons la conduite du changement digital.",
      objectives: [
        "Mettre en place des plateformes collaboratives intégrées simplifiant la gestion de l'information.",
        "Déployer un centre de support technique (Helpdesk) performant de niveau 1-2-3.",
        "Conduire des ateliers d'appropriation technologique pour éliminer la résistance au changement."
      ],
      expectedChanges: "L'entité bascule vers un fonctionnement 'sans papier' (paperless), améliore la traçabilité des dossiers de 95% et réduit de moitié le temps moyen de résolution des incidents internes.",
      iconName: "Zap",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80"
    }
  ],
  'ing-territoriale': [
    {
      diversifiedDescription: "L'intégration fine de la cartographie numérique et de l'analyse spatiale constitue le point de départ de toute politique de développement territorial moderne et éclairée. Nous dotons les collectivités territoriales de Systèmes d'Information Géographique (SIG) performants pour piloter les infrastructures et évaluer les dynamiques géographiques.",
      objectives: [
        "Structurer une base de données SIG moderne et actualisable (QGIS / PostGIS).",
        "Traiter par télédétection les images satellites et de drones pour l'analyse des sols.",
        "Modéliser des cartes thématiques stratégiques pour l'aide à la décision publique."
      ],
      expectedChanges: "L'entité publique ou municipale dispose d'une maîtrise cartographique rigoureuse de son territoire, facilitant le ciblage des investissements publics de 30% d'efficacité supplémentaire.",
      iconName: "Map",
      imageUrl: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Nous concevons des schémas d'urbanisme résilients face aux défis d'expansion démographique et de dérèglement climatique. Nos urbanistes et planificateurs structurent vos politiques d'aménagement urbain, de mobilité durable et d'implantation de zones d'activités.",
      objectives: [
        "Concevoir et rédiger les Schémas Directeurs d'Aménagement Urbain (SDAU).",
        "Analyser et planifier des maillages de transport et de mobilité intermodale fluide.",
        "Intégrer les variables climatiques dans la planification spatiale locale."
      ],
      expectedChanges: "La collectivité territoriale régule sainement son expansion urbaine, anticipe et réduit l'impact des inondations et valorise de nouvelles zones d'activités économiques.",
      iconName: "Compass",
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Le renforcement du dynamisme fiscal et de l'autonomie financière des communes est la clé de voûte de toute décentralisation réussie. Nous dispensons des appuis méthodologiques pointus aux équipes municipales pour optimiser la levée des ressources locales et piloter les budgets participatifs.",
      objectives: [
        "Moderniser les méthodes d'assiette et de recouvrement de la fiscalité locale de manière éthique.",
        "Former les élus et équipes communales à la maîtrise d'ouvrage et à la passation de marchés locaux.",
        "Mettre en place des mécanismes transparents de budgets participatifs impliquant les citoyens."
      ],
      expectedChanges: "L'entité locale augmente de 40% ses recettes fiscales propres, finance de manière autonome ses services de proximité et renforce la confiance citoyenne.",
      iconName: "Landmark",
      imageUrl: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Suivre en temps réel l'impact socio-économique des projets territoriaux d'envergure nécessite la mise en place d'observatoires pluridisciplinaires structurés. Nous développons des grilles d'indicateurs géolocalisés et outillons vos services pour piloter l'économie circulaire de proximité.",
      objectives: [
        "Concevoir et animer un observatoire territorial d'indicateurs de développement durable.",
        "Assurer le suivi spatialisé en temps réel des chantiers et infrastructures communales.",
        "Modéliser et valoriser les chaînes de valeur agricoles ou artisanales locales."
      ],
      expectedChanges: "L'entité régule ses plans de développement à l'aide de données scientifiques fiables et géolocalisées, améliorant de 20% l'efficience d'allocation des fonds de développement.",
      iconName: "Target",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    }
  ],
  'ing-qhse': [
    {
      diversifiedDescription: "Intégrer la prévention, l'excellence opérationnelle et la responsabilité sociétale au cœur de vos flux industriels est indispensable pour asseoir votre compétitivité. Nos ingénieurs-conseils rédigent et consolident des Systèmes de Management Intégrés (SMI) rigoureux, favorisant une forte culture HSE de terrain.",
      objectives: [
        "Formaliser des manuels QHSE intégrés et des fiches réflexes de sécurité immédiatement applicables.",
        "Réduire de manière drastique les taux de fréquence (TF) et de gravité (TG) des accidents du travail.",
        "Structurer des instances de sécurité actives et animer des rituels sécurité de premier ordre (1/4 d'heure sécurité)."
      ],
      expectedChanges: "L'entité industrielle élimine l'apparition d'accidents du travail majeurs, réduit les coûts associés à l'absentéisme et insuffle un climat de confiance partagé par l'ensemble des collaborateurs.",
      iconName: "Settings",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Nous accompagnons pas à pas votre organisation dans l'obtention de certifications internationales majeures de référence, véritables gages de confiance sur vos marchés cibles. À travers des diagnostics d'écarts stricts et des audits à blanc, nous garantissons l'obtention de vos labels ISO.",
      objectives: [
        "Réaliser un diagnostic de conformité normatif complet par rapport aux référentiels ISO d'intérêt.",
        "Former un pôle solide d'auditeurs internes certifiés au sein de votre entreprise.",
        "Accompagner l'entité lors des audits officiels de certification avec un taux d'obtention de 100%."
      ],
      expectedChanges: "Pour l'entité en question, l'obtention de la certification internationale ouvre les portes des marchés grands comptes mondiaux et atteste d'une rigueur managériale indiscutable.",
      iconName: "Award",
      imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Maîtriser les scénarios de défaillance technologique et protéger l'outil de production exige une cartographie exhaustive de vos risques procédés. Nos experts de haut niveau rédigent des documents uniques conformes et mettent en œuvre des procédures de consignation pointues.",
      objectives: [
        "Établir et mettre à jour le Document Unique d'Évaluation des Risques (DUER) de l'entreprise.",
        "Mener des analyses de risques procédés avancées (HAZOP / Bow-Tie) pour l'industrie lourde.",
        "Implémenter des protocoles de consignation (Lock-Out / Tag-Out - LOTO) et des plans d'urgence."
      ],
      expectedChanges: "L'organisation sécurise son outil industriel, évite les arrêts de production non programmés extrêmement coûteux et garantit la conformité totale de ses installations réglementées.",
      iconName: "Shield",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Incarner la transition écologique industrielle implique d'implémenter des plans de préservation des ressources et de réduction d'empreinte carbone rigoureux. Nous formons vos équipes de terrain pour fédérer l'intelligence collective autour de l'impact environnemental de vos sites.",
      objectives: [
        "Réaliser un audit de conformité environnemental et mesurer l'empreinte carbone globale du site.",
        "Concevoir des plans de réduction et de revalorisation des déchets industriels (économie circulaire).",
        "Dispenser des parcours éducatifs engageants pour mobiliser l'ensemble des salariés autour des éco-gestes."
      ],
      expectedChanges: "L'entité réduit de 30% ses rejets polluants, optimise le coût d'élimination de ses déchets et améliore son image de marque auprès des investisseurs et parties prenantes.",
      iconName: "Zap",
      imageUrl: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80"
    }
  ],
  'ing-audit': [
    {
      diversifiedDescription: "Résoudre durablement les inefficacités opérationnelles exige une analyse rigoureuse des chaînes de commandement et des adéquations postes-profils de vos effectifs. Notre pôle d'experts réalise des audits de processus transversaux et conçoit des organigrammes optimisés pour libérer les énergies de vos collaborateurs.",
      objectives: [
        "Analyser de manière critique l'organisation interne, identifier les doublons et les pertes de charge.",
        "Évaluer l'adéquation postes-profils de 100% du comité de direction et des encadrants clés.",
        "Cartographier les processus décisionnels pour en diviser le temps de traitement par deux."
      ],
      expectedChanges: "L'entité gagne en agilité managériale, dissipe les tensions interservices de manière rationnelle et augmente sa réactivité opérationnelle globale.",
      iconName: "FileSpreadsheet",
      imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Définir l'ambition stratégique à 5 ou 10 ans requiert un alignement parfait de votre capital humain, de vos ressources financières et de vos actifs technologiques. Nous modélisons des feuilles de route stratégiques robustes assorties d'indicateurs d'exécution de premier ordre.",
      objectives: [
        "Concevoir des plans de développement stratégique ou des plans nationaux sectoriels (PND).",
        "Déployer des Balanced Scorecards (tableaux de bord prospectifs) déclinés par service.",
        "Faciliter l'appropriation managériale des nouveaux objectifs à travers des plans de conduite du changement."
      ],
      expectedChanges: "Pour l'entité en question, la vision à long terme est claire et partagée par l'ensemble des salariés, ce qui accélère la réalisation des objectifs stratégiques de 20%.",
      iconName: "TrendingUp",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Instaurer des mécanismes de gouvernance d'excellence constitue le plus puissant rempart pour garantir la pérennité institutionnelle et rassurer vos investisseurs. Nous vous accompagnons dans la rédaction de chartes de gouvernance vertueuses et la structuration de comités spécialisés.",
      objectives: [
        "Rédiger des chartes de gouvernance et formaliser les responsabilités des administrateurs.",
        "Structurer des comités d'audit, de gestion des risques et de rémunérations conformes aux meilleures pratiques.",
        "Déployer des dispositifs rigoureux d'éthique des affaires et de conformité réglementaire."
      ],
      expectedChanges: "L'organisation rassure pleinement ses partenaires financiers, pérennise ses processus de décision stratégiques et élimine le risque d'infractions réglementaires.",
      iconName: "Landmark",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Faire du capital humain le principal levier de performance passe par des politiques de motivation, d'évaluation objective et d'accompagnement de carrières d'excellence. Nous élaborons des dispositifs innovants de gestion prévisionnelle des effectifs et concevons vos académies d'entreprise.",
      objectives: [
        "Concevoir des grilles d'évaluation de la performance individuelle corrélées à des plans d'intéressement.",
        "Déployer une démarche de Gestion Prévisionnelle des Emplois et des Compétences (GPEC) innovante.",
        "Accompagner de bout en bout l'ingénierie et le design d'universités ou d'académies internes d'entreprise."
      ],
      expectedChanges: "L'entité retient ses hauts potentiels, réduit son taux de rotation du personnel de 25% et accélère l'acquisition de compétences stratégiques.",
      iconName: "Award",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
    }
  ],
  'ing-projets': [
    {
      diversifiedDescription: "Nous menons des études pluridisciplinaires approfondies pour vérifier scientifiquement la viabilité de vos chantiers et de vos investissements de croissance. En alliant études de marché quantitatives et modélisations économiques poussées, nous apportons des éclairages précis à votre comité stratégique.",
      objectives: [
        "Réaliser des analyses d'opportunité sectorielles et des études de marché approfondies.",
        "Modéliser des études de faisabilité technique, juridique et de rentabilité économique (VAN, TRI).",
        "Rédiger des notes stratégiques d'aide à la décision d'investissement conformes aux critères bancaires."
      ],
      expectedChanges: "L'entité valide ou ajuste ses projets d'expansion en s'appuyant sur des bases scientifiques irréprochables, éliminant ainsi les projets non viables en amont.",
      iconName: "BarChart2",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Nous garantissons des investissements d'infrastructures ou de développements socialement équitables et parfaitement intégrés dans leur écosystème naturel. Nos spécialistes mènent des consultations inclusives et des études d'impact rigoureuses conformément aux exigences ESG.",
      objectives: [
        "Réaliser des Études d'Impact Environnemental et Social (EIES) conformes aux exigences nationales et internationales.",
        "Concevoir des Plans d'Action de Réinstallation (PAR) équitables de populations affectées.",
        "Mettre en conformité vos chantiers avec les critères ESG stricts des banques de développement."
      ],
      expectedChanges: "L'entité s'assure de la non-interruption de ses projets pour motifs sociaux ou administratifs, sécurise ses autorisations d'exploitation et valorise sa politique RSE.",
      iconName: "Compass",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Notre cabinet traduit les ambitions de développement de nos partenaires en cadres logiques rigoureux, théories du changement limpides et planifications de gestion de risques robustes. Nous préparons des dossiers d'ingénierie de projets prêts pour le financement multi-bailleurs.",
      objectives: [
        "Formaliser la Théorie du Changement et concevoir des cadres logiques irréprochables.",
        "Bâtir des planifications opérationnelles fines (WBS, GANTT) avec identification du chemin critique (PERT).",
        "Établir des plans de gestion des risques inhérents à l'exécution du projet de développement."
      ],
      expectedChanges: "Les promoteurs de projet augmentent de 80% l'acceptabilité de leurs dossiers de financement auprès des bailleurs de fonds mondiaux et maîtrisent les délais de réalisation.",
      iconName: "Settings",
      imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Nous outillons les coordinateurs de programmes pour assurer un pilotage de terrain fondé sur la remontée de données fiables et en temps réel. Grâce à l'automatisation de la collecte de données sur mobile, nous créons des tableaux de bord dynamiques pour des évaluations rigoureuses.",
      objectives: [
        "Déployer des dispositifs de Suivi-Évaluation (M&E) axés sur les résultats opérationnels.",
        "Automatiser la collecte de données mobiles de terrain via des outils performants (KoboCollect / ODK).",
        "Concevoir des rapports d'impact à mi-parcours et des études de capitalisation scientifique de premier plan."
      ],
      expectedChanges: "L'organisation identifie immédiatement les écarts d'exécution de ses programmes, prend des mesures correctives éclairées et rend des comptes clairs et transparents aux bailleurs.",
      iconName: "CheckCircle2",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
    }
  ],
  'ing-accompagnement': [
    {
      diversifiedDescription: "Garantir le succès des politiques publiques et la mise en œuvre de programmes complexes exige l'intégration à vos côtés d'experts techniques résidents de haut niveau. Notre assistance technique permanente soutient la montée en compétences quotidienne de vos cadres.",
      objectives: [
        "Accompagner les Unités de Gestion de Projets (UGP) dans l'exécution opérationnelle rigoureuse de leurs mandats.",
        "Optimiser la gestion administrative, comptable et budgétaire des programmes d'aide multilatéraux.",
        "Transférer au quotidien et de manière formelle les compétences clés de gestion de projets de développement."
      ],
      expectedChanges: "L'entité publique ou le ministère sectoriel enregistre un taux de décaissement de ses lignes de financement historique, et pérennise l'autonomie technique de ses équipes.",
      iconName: "Users",
      imageUrl: "https://images.unsplash.com/photo-1556761175-49b3dcbc2c16?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Nous sécurisons vos opérations de gestion et de passation de marchés en formalisant des manuels de procédures de gestion clairs, hautement transparents et conformes. Nos équipes forment vos personnels à l'application stricte et éthique de ces règles.",
      objectives: [
        "Concevoir et rédiger des manuels de procédures administratives, comptables, financières et de passation des marchés.",
        "Former de manière pratique les commissions internes à l'instruction rigoureuse des appels d'offres.",
        "Mettre en place des protocoles d'audit interne pour prévenir les risques de mauvaise gestion financière."
      ],
      expectedChanges: "Pour l'entité concernée, le risque de non-conformité face aux bailleurs ou de recours sur passation de marchés est neutralisé, renforçant la crédibilité institutionnelle.",
      iconName: "FileSpreadsheet",
      imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "La coordination opérationnelle de coalitions multi-acteurs d'envergure nécessite un dialogue constructif continu et une gouvernance de consortium solide. Nous facilitons les synergies opérationnelles de terrain et alignons stratégiquement l'ensemble de vos bailleurs.",
      objectives: [
        "Structurer et administrer des consortia de développement nationaux ou sous-régionaux performants.",
        "Assurer la facilitation et l'alignement continu des visions de l'ensemble des bailleurs de fonds.",
        "Établir des mécanismes de reporting unifié de haut niveau reflétant de manière consolidée l'avancement global."
      ],
      expectedChanges: "Les partenaires travaillent en harmonie totale, évitent les duplications d'efforts sur le terrain et maximisent de 30% l'impact cumulé de leurs budgets de développement.",
      iconName: "Network",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Nous soutenons les instances dirigeantes dans le dialogue institutionnel et la formulation de plaidoyers stratégiques à l'échelle régionale et internationale. Notre cabinet prépare vos instances de négociation et élabore des tables rondes d'investissement réussies.",
      objectives: [
        "Rédiger des dossiers stratégiques d'intelligence économique et institutionnelle d'aide à la négociation.",
        "Organiser et animer des ateliers d'influence réglementaire et de plaidoyer de haut niveau.",
        "Concevoir l'ingénierie professionnelle de tables rondes d'investissement et de levées de fonds bailleurs."
      ],
      expectedChanges: "L'entité publique ou associative fait adopter de nouvelles réglementations structurantes et réussit à mobiliser des financements additionnels auprès des coopérations multilatérales.",
      iconName: "Target",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
    },
    {
      diversifiedDescription: "Guider les restructurations internes d'organisations d'importance stratégique exige d'allier sens de la gouvernance et techniques de management agile. Nous conseillons vos comités exécutifs dans l'instauration d'objectifs OKR et de dynamiques d'amélioration de l'engagement.",
      objectives: [
        "Dispenser un coaching de haut niveau auprès des comités de direction sur les démarches de leadership moderne.",
        "Déployer la méthodologie des OKR (Objectives & Key Results) pour matérialiser la feuille de route stratégique.",
        "Animer des ateliers de réorganisation organisationnelle et d'amélioration continue du capital humain."
      ],
      expectedChanges: "L'entité libère pleinement l'initiative de ses collaborateurs, aligne ses objectifs d'équipe et de service de manière limpide et accroît l'implication opérationnelle globale.",
      iconName: "Settings",
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
    }
  ]
};
