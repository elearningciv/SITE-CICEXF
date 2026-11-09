// Acronyms of the e-learning courses: each one is spelled out at its first use in every module
// (unless the text already defines it) and listed in a "Sigles et abréviations" glossary per course.
// A definition may depend on the course family (e.g. SIG = geographic information system or
// intermediate management balances in accounting).

const GEO = ['cartographie-geomatique', 'cartographie-semiologie', 'analyse-spatiale-modelisation', 'collecte-donnees-terrain', 'geomatique-urbaine-risques'];
const FIN = ['modelisation-financiere', 'comptabilite-generale', 'gestion-financiere-budgetaire', 'controle-gestion-performance', 'audit-comptable-financier', 'controle-interne-risques'];
const familyOf = (id) => (GEO.includes(id) ? 'geo' : FIN.includes(id) ? 'fin' : /^qhse-|^hygiene-/.test(id) ? 'qhse' : 'other');

export const GLOSSARY = {
  // Organisations, institutions
  ACFE: 'Association of Certified Fraud Examiners, association des examinateurs certifiés de fraude',
  ALNAP: "réseau d'apprentissage actif pour la redevabilité et la performance dans l'action humanitaire",
  ARMP: 'Autorité nationale de régulation des marchés publics',
  ARTCI: "Autorité de régulation des télécommunications/TIC de Côte d'Ivoire",
  BCEAO: "Banque centrale des États de l'Afrique de l'Ouest",
  BNETD: "Bureau national d'études techniques et de développement",
  CALP: 'réseau international sur les transferts monétaires humanitaires (Cash Learning Partnership)',
  CARE: 'ONG internationale de lutte contre la pauvreté (Cooperative for Assistance and Relief Everywhere)',
  CBM: 'ONG internationale pour l\'inclusion des personnes handicapées (Christian Blind Mission)',
  CCT: 'Centre de cartographie et de télédétection',
  CEDEAO: "Communauté économique des États de l'Afrique de l'Ouest",
  CENTIF: 'Cellule nationale de traitement des informations financières',
  CICR: 'Comité international de la Croix-Rouge',
  CNPS: 'Caisse nationale de prévoyance sociale',
  COSO: 'Committee of Sponsoring Organizations of the Treadway Commission, comité des organisations parrainantes de la commission Treadway',
  DGI: 'Direction générale des impôts',
  ECHO: "direction générale de la protection civile et des opérations d'aide humanitaire européennes (Commission européenne)",
  ECOSOC: 'Conseil économique et social des Nations unies',
  FAO: "Organisation des Nations unies pour l'alimentation et l'agriculture",
  FICR: 'Fédération internationale des Sociétés de la Croix-Rouge et du Croissant-Rouge',
  FMI: 'Fonds monétaire international',
  FNUAP: 'Fonds des Nations unies pour la population',
  G20: 'Groupe des vingt (principales économies mondiales)',
  GAFI: "Groupe d'action financière",
  GIABA: "Groupe intergouvernemental d'action contre le blanchiment d'argent en Afrique de l'Ouest",
  GIEC: "Groupe d'experts intergouvernemental sur l'évolution du climat",
  HCR: 'Haut-Commissariat des Nations unies pour les réfugiés',
  HelpAge: 'ONG internationale pour les droits des personnes âgées',
  IAASB: "International Auditing and Assurance Standards Board, conseil des normes internationales d'audit et d'assurance",
  IASB: 'International Accounting Standards Board, conseil des normes comptables internationales',
  IASC: 'Inter-Agency Standing Committee, Comité permanent interorganisations',
  IAWG: 'groupe de travail interorganisations sur la santé reproductive en situations de crise',
  ICA: 'Association cartographique internationale',
  IEC: 'Commission électrotechnique internationale',
  IEEE: "Institute of Electrical and Electronics Engineers, institut des ingénieurs électriciens et électroniciens",
  IESBA: "International Ethics Standards Board for Accountants, conseil des normes internationales de déontologie comptable",
  IETF: "Internet Engineering Task Force, groupe de travail qui élabore les standards d'Internet",
  IFAC: 'Fédération internationale des experts-comptables',
  IIA: 'Institute of Internal Auditors, Institut des auditeurs internes',
  INEE: "Réseau interagences pour l'éducation en situations d'urgence",
  INTOSAI: 'Organisation internationale des institutions supérieures de contrôle des finances publiques',
  IRC: 'International Rescue Committee, ONG internationale d\'aide humanitaire',
  ISO: 'Organisation internationale de normalisation',
  MSF: 'Médecins Sans Frontières',
  OCDE: 'Organisation de coopération et de développement économiques',
  'OCDE-CAD': "Comité d'aide au développement de l'Organisation de coopération et de développement économiques",
  OCHA: 'Bureau de la coordination des affaires humanitaires des Nations unies',
  OGC: 'Open Geospatial Consortium, consortium international de normalisation géospatiale',
  OHADA: "Organisation pour l'harmonisation en Afrique du droit des affaires",
  OIT: 'Organisation internationale du travail',
  OMC: 'Organisation mondiale du commerce',
  OMS: 'Organisation mondiale de la santé',
  ONG: 'organisation non gouvernementale',
  ONU: 'Organisation des Nations unies',
  ONUDC: "Office des Nations unies contre la drogue et le crime",
  OPEP: 'Organisation des pays exportateurs de pétrole',
  OTAN: "Organisation du traité de l'Atlantique Nord",
  OUA: "Organisation de l'unité africaine",
  PAM: 'Programme alimentaire mondial',
  PNUD: 'Programme des Nations unies pour le développement',
  UA: 'Union africaine',
  UE: 'Union européenne',
  UEMOA: 'Union économique et monétaire ouest-africaine',
  UNDG: 'Groupe des Nations unies pour le développement',
  UNDRR: 'Bureau des Nations unies pour la réduction des risques de catastrophe',
  UNESCO: "Organisation des Nations unies pour l'éducation, la science et la culture",
  UNICEF: "Fonds des Nations unies pour l'enfance",
  UNISDR: 'ancien nom du Bureau des Nations unies pour la réduction des risques de catastrophe',
  URD: 'Urgence, réhabilitation, développement (groupe de recherche humanitaire)',
  USGS: "Institut d'études géologiques des États-Unis",
  EHESS: "École des hautes études en sciences sociales",
  PUF: 'Presses universitaires de France',
  CTHS: 'Comité des travaux historiques et scientifiques',
  HEC: 'École des hautes études commerciales',
  OPH: 'organisation de personnes handicapées',
  DSCG: "diplôme supérieur de comptabilité et de gestion",
  MIT: 'Massachusetts Institute of Technology',
  BEPC: "brevet d'études du premier cycle",
  SDUGA: "schéma directeur d'urbanisme du Grand Abidjan",

  // Law, norms, standards, frameworks
  AUDCIF: "Acte uniforme relatif au droit comptable et à l'information financière",
  CDE: "Convention relative aux droits de l'enfant",
  CDPH: 'Convention relative aux droits des personnes handicapées',
  CEDAW: "Convention sur l'élimination de toutes les formes de discrimination à l'égard des femmes",
  CHS: 'Core Humanitarian Standard, Norme humanitaire fondamentale de qualité et de redevabilité',
  CNUCC: 'Convention des Nations unies contre la corruption',
  CPMS: "standards minimums pour la protection de l'enfance dans l'action humanitaire",
  DIH: 'droit international humanitaire',
  ERM: 'Enterprise Risk Management, management des risques de l\'entreprise',
  GAM: "Gender with Age Marker, marqueur genre et âge de l'IASC",
  IAS: 'International Accounting Standards, normes comptables internationales (anciennes)',
  IFRS: "International Financial Reporting Standards, normes internationales d'information financière",
  ISA: "International Standards on Auditing, normes internationales d'audit",
  ISQM: 'International Standard on Quality Management, norme internationale de gestion de la qualité',
  ISRS: 'International Standards on Related Services, normes internationales de services connexes',
  MISP: 'Minimum Initial Service Package, dispositif minimum d\'urgence en santé reproductive',
  DMU: "dispositif minimum d'urgence pour la santé sexuelle et reproductive",
  NSSDA: 'National Standard for Spatial Data Accuracy, norme américaine de précision des données spatiales',
  FGDC: 'Federal Geographic Data Committee, comité fédéral américain des données géographiques',
  'FGDC-STD': 'norme du comité fédéral américain des données géographiques',
  ODD: 'objectif de développement durable',
  PGI: 'protection, genre et inclusion',
  RFC: "Request for Comments, document de normalisation d'Internet",
  SYSCOHADA: "Système comptable de l'Organisation pour l'harmonisation en Afrique du droit des affaires",
  SGB: 'circulaire du Secrétaire général des Nations unies',
  'WG-SS': 'questionnaire court du Groupe de Washington sur le fonctionnement',
  OWASP: 'Open Worldwide Application Security Project, projet ouvert sur la sécurité des applications',
  EBIOS: 'Expression des besoins et identification des objectifs de sécurité (méthode d\'analyse des risques)',
  SCORM: 'Sharable Content Object Reference Model, norme d\'échange de contenus de formation en ligne',

  // Humanitarian and social
  AAP: 'redevabilité envers les populations affectées',
  AGD: 'âge, genre et diversité',
  CEA: 'engagement communautaire et redevabilité',
  DAPS: 'Dignité, Accès, Participation, Sécurité',
  GBV: 'Gender-Based Violence, violence basée sur le genre',
  GBVIMS: "système de gestion de l'information sur la violence basée sur le genre",
  HAP: 'Humanitarian Accountability Partnership, partenariat pour la redevabilité humanitaire',
  KYC: 'Know Your Customer, connaissance du client',
  LBC: 'lutte contre le blanchiment de capitaux',
  FT: 'financement du terrorisme',
  LGBTIQ: 'personnes lesbiennes, gays, bisexuelles, trans, intersexes et queer',
  PAF: 'Protection Analytical Framework, cadre d\'analyse de protection',
  PDM: 'panier de dépenses minimum',
  PEAS: "protection contre l'exploitation et les abus sexuels",
  RSU: 'registre social unifié',
  SADD: 'données ventilées par sexe et par âge',
  SADDD: 'données ventilées par sexe, âge et handicap',
  SASPP: 'Programme de protection sociale adaptative au Sahel',
  SSR: 'santé sexuelle et reproductive',
  TMUM: 'transferts monétaires à usages multiples',
  VBG: 'violence basée sur le genre',
  VIH: "virus de l'immunodéficience humaine",
  CMU: 'couverture maladie universelle',
  EMMA: "cartographie et analyse des marchés en situation d'urgence",
  KRI: 'Key Risk Indicators, indicateurs clés de risque',
  'COVID-19': 'maladie à coronavirus 2019',

  // Accounting, finance, management
  BFR: 'besoin en fonds de roulement',
  BFRE: "besoin en fonds de roulement d'exploitation",
  CA: "chiffre d'affaires",
  CAF: "capacité d'autofinancement",
  CMPC: 'coût moyen pondéré du capital',
  CP: 'capitaux propres',
  DSCR: 'Debt Service Coverage Ratio, ratio de couverture du service de la dette',
  DSF: 'déclaration statistique et fiscale',
  EBE: "excédent brut d'exploitation",
  FCFA: "franc de la Communauté financière africaine",
  CFA: 'Communauté financière africaine',
  FNE: 'facture normalisée électronique',
  FRNG: 'fonds de roulement net global',
  GIE: "groupement d'intérêt économique",
  HAO: 'hors activités ordinaires',
  HT: 'hors taxes',
  MCV: 'marge sur coût variable',
  PME: 'petite et moyenne entreprise',
  RAO: 'résultat des activités ordinaires',
  RIB: "relevé d'identité bancaire",
  ROA: 'Return on Assets, rentabilité des actifs',
  ROCE: 'Return on Capital Employed, rentabilité des capitaux employés',
  ROE: 'Return on Equity, rentabilité des capitaux propres',
  RRR: 'rabais, remises et ristournes',
  SARL: 'société à responsabilité limitée',
  SMT: 'système minimal de trésorerie',
  TFT: 'tableau des flux de trésorerie',
  TN: 'trésorerie nette',
  TRI: 'taux de rentabilité interne',
  TTC: 'toutes taxes comprises',
  TVA: 'taxe sur la valeur ajoutée',
  UO: "unité d'œuvre",
  USD: 'dollar des États-Unis',
  VAN: 'valeur actuelle nette',
  WACC: 'Weighted Average Cost of Capital, coût moyen pondéré du capital',
  ABC: {
    'gestion-financiere-budgetaire': 'classement ABC des stocks selon leur valeur (méthode de Pareto)',
    qhse: 'poudre extinctrice polyvalente pour feux de classes A, B et C',
    other: 'Activity-Based Costing, méthode des coûts par activités'
  },
  OVAR: 'Objectifs, Variables d\'action, Responsables (méthode de pilotage)',
  RI: 'risque inhérent',
  RC: 'risque lié au contrôle',
  PAR: 'portefeuille à risque',
  PIB: 'produit intérieur brut',
  DOP: 'dilution de précision',

  // Monitoring, evaluation, projects, HR, training
  GAR: 'gestion axée sur les résultats',
  CAD: "Comité d'aide au développement de l'OCDE",
  SMART: 'Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini',
  PDCA: 'Plan, Do, Check, Act : planifier, réaliser, vérifier, agir',
  SWOT: 'Strengths, Weaknesses, Opportunities, Threats : forces, faiblesses, opportunités, menaces',
  PESTEL: 'facteurs politiques, économiques, sociaux, technologiques, écologiques et légaux',
  ADDIE: 'Analyse, Design (conception), Développement, Implémentation, Évaluation',
  SAM: 'Successive Approximation Model, modèle des approximations successives',
  AST: 'analyse de la situation de travail',
  LMS: "Learning Management System, plateforme de gestion de l'apprentissage",
  MOOC: 'Massive Open Online Course, cours en ligne ouvert à tous',
  QCM: 'questionnaire à choix multiples',
  CDD: 'contrat à durée déterminée',
  CDI: 'contrat à durée indéterminée',
  GPEC: 'gestion prévisionnelle des emplois et des compétences',
  GRH: 'gestion des ressources humaines',
  RH: 'ressources humaines',
  SIRH: "système d'information des ressources humaines",
  QVT: 'qualité de vie au travail',
  RPS: 'risques psychosociaux',
  CV: 'curriculum vitae',

  // QHSE
  QHSE: 'qualité, hygiène, sécurité, environnement',
  EPI: 'équipement de protection individuelle',
  FDS: 'fiche de données de sécurité',
  SGH: 'Système général harmonisé de classification et d\'étiquetage des produits chimiques',
  TMS: 'troubles musculosquelettiques',
  TF: 'taux de fréquence',
  TG: 'taux de gravité',
  BTP: 'bâtiment et travaux publics',

  // IT and security
  CMS: 'Content Management System, système de gestion de contenu',
  DIC: 'Disponibilité, Intégrité, Confidentialité',
  DICT: 'Disponibilité, Intégrité, Confidentialité, Traçabilité',
  DKIM: 'DomainKeys Identified Mail, signature des courriels par domaine',
  DMARC: "Domain-based Message Authentication, Reporting and Conformance, politique d'authentification des courriels",
  DMZ: 'zone démilitarisée (réseau isolé exposé à Internet)',
  HTTPS: 'protocole de transfert hypertexte sécurisé',
  PCA: "plan de continuité d'activité",
  PRA: "plan de reprise d'activité",
  PIN: "numéro d'identification personnel",
  PSSI: "politique de sécurité des systèmes d'information",
  RPO: 'Recovery Point Objective, perte de données maximale admissible',
  RTO: 'Recovery Time Objective, durée maximale d\'interruption admissible',
  SIEM: 'Security Information and Event Management, gestion des informations et des événements de sécurité',
  SMSI: "système de management de la sécurité de l'information",
  SOC: 'Security Operations Center, centre opérationnel de sécurité',
  SPF: "Sender Policy Framework, liste des serveurs autorisés à envoyer les courriels d'un domaine",
  SMS: 'Short Message Service, message texte court',
  USB: 'Universal Serial Bus, port et périphérique de connexion universel',
  VNC: "Virtual Network Computing, logiciel de prise de contrôle à distance",
  VPN: 'Virtual Private Network, réseau privé virtuel',
  WEP: 'Wired Equivalent Privacy, ancien protocole de chiffrement Wi-Fi',
  WPA2: 'Wi-Fi Protected Access 2, protocole de sécurité Wi-Fi',
  WPA3: 'Wi-Fi Protected Access 3, protocole de sécurité Wi-Fi récent',
  WPS: 'Wi-Fi Protected Setup, appairage simplifié des appareils Wi-Fi',
  XSS: 'Cross-Site Scripting, injection de script intersite',
  TIC: "technologies de l'information et de la communication",
  SQL: 'Structured Query Language, langage de requête des bases de données',
  ASCII: "American Standard Code for Information Interchange, codage standard des caractères",
  'UTF-8': 'format universel de codage des caractères',
  CSV: 'Comma-Separated Values, fichier texte à valeurs séparées',
  PDF: 'Portable Document Format, format de document portable',
  JPEG: "format de compression d'images photographiques",
  PNG: "format d'image sans perte",
  SVG: 'format d\'image vectorielle',
  KML: 'Keyhole Markup Language, format de données géographiques de Google Earth',
  KMZ: 'fichier KML compressé',
  TXT: 'fichier texte brut',
  DOCX: 'format de document Word',
  XLSX: 'format de classeur Excel',
  MP3: 'format audio compressé',
  MP4: 'format vidéo compressé',

  // Geomatics and remote sensing
  AHP: 'Analytic Hierarchy Process, processus d\'analyse hiérarchique',
  'AMC-SIG': "analyse multicritère couplée à un système d'information géographique",
  CMJN: 'cyan, magenta, jaune, noir (couleurs d\'impression)',
  DGNSS: 'GNSS différentiel',
  EGNOS: 'European Geostationary Navigation Overlay Service, système européen de correction GPS',
  EPSG: 'registre de référence des systèmes de coordonnées (European Petroleum Survey Group)',
  GHSL: 'Global Human Settlement Layer, couche mondiale des établissements humains',
  GIS: "Geographic Information System, système d'information géographique",
  GLONASS: 'système russe de positionnement par satellite',
  GNSS: 'Global Navigation Satellite System, système mondial de navigation par satellite',
  GPS: 'Global Positioning System, système de positionnement par satellite américain',
  GWR: 'Geographically Weighted Regression, régression géographiquement pondérée',
  HAND: 'Height Above Nearest Drainage, hauteur au-dessus du drain le plus proche',
  HDOP: 'dilution horizontale de la précision',
  HDX: "Humanitarian Data Exchange, plateforme d'échange de données humanitaires",
  HR: 'haute résolution',
  VHR: 'très haute résolution',
  IDW: 'Inverse Distance Weighting, inverse de la distance pondérée',
  LISA: 'Local Indicators of Spatial Association, indicateurs locaux d\'association spatiale',
  LTR: 'Long Term Release, version à long terme',
  MAUP: 'Modifiable Areal Unit Problem, problème des unités spatiales modifiables',
  MIR: 'moyen infrarouge',
  MNT: 'modèle numérique de terrain',
  NDBI: 'Normalized Difference Built-up Index, indice normalisé du bâti',
  NDVI: 'Normalized Difference Vegetation Index, indice de végétation par différence normalisée',
  NDWI: "Normalized Difference Water Index, indice normalisé de l'eau",
  NTRIP: 'protocole de diffusion des corrections GNSS par Internet',
  ODK: 'Open Data Kit, outil de collecte de données mobile',
  OSM: 'OpenStreetMap, carte collaborative libre',
  PDOP: 'dilution de la précision de position',
  PIR: 'proche infrarouge',
  PPP: 'Precise Point Positioning, positionnement ponctuel précis',
  QGIS: "logiciel libre de système d'information géographique",
  RMSE: 'Root Mean Square Error, erreur quadratique moyenne',
  RTK: 'Real Time Kinematic, positionnement cinématique en temps réel',
  RVB: 'rouge, vert, bleu',
  SBAS: 'Satellite-Based Augmentation System, système de correction par satellite',
  SIG: { geo: "système d'information géographique", fin: 'soldes intermédiaires de gestion', other: "système d'information géographique" },
  SRTM: 'Shuttle Radar Topography Mission, modèle de relief mondial',
  'SRTM-DEM': 'modèle numérique de relief issu de la mission SRTM',
  TIN: 'Triangulated Irregular Network, réseau triangulé irrégulier',
  TM: 'Thematic Mapper, capteur des satellites Landsat',
  TWI: 'Topographic Wetness Index, indice topographique d\'humidité',
  UTM: 'Universal Transverse Mercator, projection transverse universelle de Mercator',
  VDOP: 'dilution verticale de la précision',
  VGI: 'Volunteered Geographic Information, information géographique volontaire',
  WAAS: 'Wide Area Augmentation System, système américain de correction GPS',
  WGS: 'World Geodetic System, système géodésique mondial',
  SIMPOP: 'modèle de simulation de la dynamique des systèmes de villes',
  SLEUTH: "modèle de simulation de l'étalement urbain (Slope, Land use, Exclusion, Urban, Transportation, Hillshade)",
  CATMOG: 'Concepts and Techniques in Modern Geography (collection de manuels)',
  SREX: 'rapport spécial du GIEC sur les événements extrêmes',
  IPCC: 'Intergovernmental Panel on Climate Change, nom anglais du GIEC',
  CLEAR: 'organisation CLEAR Global (anciennement Traducteurs sans frontières)',
  SMA: 'système multi-agents',
  FAIR: 'Faciles à trouver, Accessibles, Interopérables, Réutilisables (principes de gestion des données)',
  FIFA: 'Fédération internationale de football association',
  'S-E': 'suivi-évaluation',
  APC: 'approche par compétences',
  GNUE: "Groupe des Nations unies pour l'évaluation",
  UNEG: "United Nations Evaluation Group, Groupe des Nations unies pour l'évaluation",
  MEAL: 'Monitoring, Evaluation, Accountability and Learning : suivi, évaluation, redevabilité et apprentissage',
  RACI: 'Responsible, Accountable, Consulted, Informed : qui réalise, qui valide, qui est consulté, qui est informé',
  USAID: 'Agence des États-Unis pour le développement international',
  CREAM: "Clair, Pertinent (Relevant), Économique, Adéquat, Suivable (Monitorable) : critères de qualité d'un indicateur",
  LQAS: "Lot Quality Assurance Sampling, sondage par lots pour l'assurance de la qualité",
  MARP: 'méthode accélérée de recherche participative',
  DHIS2: 'District Health Information Software 2, logiciel de gestion des informations sanitaires',
  MEASURE: "programme MEASURE Evaluation de l'USAID sur le suivi-évaluation en santé",
  ID: 'identifiant',
  'J-PAL': "Abdul Latif Jameel Poverty Action Lab, laboratoire d'action contre la pauvreté du MIT",
  IPA: 'Innovations for Poverty Action, organisation de recherche sur la pauvreté',
  IATI: "International Aid Transparency Initiative, Initiative internationale pour la transparence de l'aide",
  SECI: 'Socialisation, Externalisation, Combinaison, Intériorisation (modèle de création de connaissances)',
  DFID: 'Department for International Development, ancien ministère britannique du développement international',
  CME: 'Contexte, Mécanisme, Effet (configuration de l\'évaluation réaliste)',
  AfrEA: 'African Evaluation Association, Association africaine d\'évaluation',
  PMI: 'Project Management Institute, institut international du management de projet',
  PMBOK: 'Project Management Body of Knowledge, guide du corpus des connaissances en management de projet',
  QQOQCP: "Qui, Quoi, Où, Quand, Comment, Combien (méthode de description d'un problème)",
  CODINORM: "Côte d'Ivoire Normalisation, organisme national de normalisation",
  HACCP: "Hazard Analysis Critical Control Point, analyse des dangers et points critiques pour leur maîtrise",
  CIAPOL: "Centre ivoirien antipollution",
  ANDE: "Agence nationale de l'environnement, Côte d'Ivoire",
  SL: 'structure harmonisée des normes ISO de systèmes de management',
  EIES: "étude d'impact environnemental et social",
  PGES: "plan de gestion environnementale et sociale",
  NASA: "agence spatiale des États-Unis",
  SIPOC: "Suppliers, Inputs, Process, Outputs, Customers : fournisseurs, entrées, processus, sorties, clients",
  REACH: "règlement européen sur l'enregistrement, l'évaluation et l'autorisation des substances chimiques",
  HSE: "hygiène, sécurité, environnement",
  "ILO-OSH": "principes directeurs de l'OIT concernant les systèmes de gestion de la sécurité et de la santé au travail",
  SST: "santé et sécurité au travail",
  WBGT: "Wet Bulb Globe Temperature, indice de température au thermomètre-globe mouillé",
  EN: "norme européenne",
  AES: "accident d'exposition au sang",
  INRS: "Institut national de recherche et de sécurité, France",
  IPBES: "Plateforme intergouvernementale scientifique et politique sur la biodiversité et les services écosystémiques",
  DCO: "demande chimique en oxygène",
  SFI: "Société financière internationale (Groupe de la Banque mondiale)",
  COV: "composés organiques volatils",
  DBO5: "demande biochimique en oxygène sur cinq jours",
  MES: "matières en suspension",
  N2O: "protoxyde d'azote",
  GHG: "Greenhouse Gas, gaz à effet de serre",
  LED: "Light-Emitting Diode, diode électroluminescente",
  WBCSD: "World Business Council for Sustainable Development, Conseil mondial des entreprises pour le développement durable",
  DEEE: "déchets d'équipements électriques et électroniques",
  PCB: "polychlorobiphényles",
  ACV: "analyse du cycle de vie",
  GRI: "Global Reporting Initiative",
  ISSB: "International Sustainability Standards Board, conseil des normes internationales d'information sur la durabilité",
  CO2: "dioxyde de carbone",
  SO2: "dioxyde de soufre",
  CH4: "méthane",
  PM10: "particules de diamètre inférieur à 10 micromètres",
  OHSAS: "Occupational Health and Safety Assessment Series, ancien référentiel de santé-sécurité au travail",
  IAF: "International Accreditation Forum, forum international de l'accréditation",
  MD: "Mandatory Document, document obligatoire de l'IAF",
  BSI: "British Standards Institution, organisme britannique de normalisation",
  SOAC: "Système ouest-africain d'accréditation",
  DMAIC: "Define, Measure, Analyze, Improve, Control : définir, mesurer, analyser, améliorer, contrôler",
  CAPA: "Corrective and Preventive Actions, actions correctives et préventives",
  REX: "retour d'expérience",
  IBM: "entreprise informatique américaine International Business Machines"
};

// Uppercase tokens that are not acronyms to spell out (cell references, function names, emphasis…)
const IGNORE = new Set(['P-SST', 'D5-D6', 'ALORS', 'PARCE', 'QUE', 'SI', 'PAS', 'AND', 'OR', 'MAX', 'MIN', 'SI', 'ET', 'OK', 'ERREUR', 'CHOISIR', 'SOMME', 'INDEX', 'EQUIV', 'RECHERCHEX',
  'VPM', 'XX', 'XXE', 'XYZ', 'FINAL', 'AB', 'ST', 'UN', 'CO', 'CR', 'RES', 'CF', 'DG', 'RS', 'UK', 'ACM', 'ICTD', 'TN', 'GOV', 'LEGAL',
  'OECD', 'OECD-DAC', 'JOSAA', 'AAG', 'SIMPOP2', 'RG2004', 'ODI', 'IA', 'II', 'III', 'IV', 'VI', 'VII', 'VIII', 'IX', 'XI', 'XII', 'XIX', 'XV', 'XVI', 'XVII', 'XVIII']);
const isNoise = (t) => IGNORE.has(t) || /^[A-Z]{1,2}\d{1,3}$/.test(t) || /^[PC]\d+([MTE]\d*)?$/.test(t) || /\d{3,}-\d/.test(t) || /^[IVXLC]+$/.test(t);

const TOKEN = /(?<![\p{L}\d&/])([A-ZÉ][A-Z0-9É]*(?:-[A-Z0-9]+)?)(?![\p{L}\d])/gu;
const upperCount = (t) => (t.match(/[A-ZÉ]/g) || []).length;

const defOf = (acr, courseId) => {
  const d = GLOSSARY[acr];
  if (!d) return null;
  return typeof d === 'string' ? d : d[courseId] || d[familyOf(courseId)] || d.other;
};

const plain = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Spells out each acronym at its first use in a module text (outside headings), unless already defined. */
// Very frequent acronyms are spelled out once per course only
const ONCE_PER_COURSE = new Set(['FCFA', 'CFA', 'ONG', 'ONU', 'HT', 'TTC', 'TVA', 'CA']);

function expandText(html, courseId, found, courseSeen) {
  if (!html) return html;
  const inserts = [];
  const seen = new Set();
  // Positions of <h3>…</h3> blocks (headings are left untouched)
  const headings = [...html.matchAll(/<h3[\s\S]*?<\/h3>/g)].map((m) => [m.index, m.index + m[0].length]);
  const inHeading = (i) => headings.some(([a, b]) => i >= a && i < b);
  // Only text outside tags
  const textRanges = [];
  html.replace(/[^<]+|<[^>]*>/g, (seg, off) => { if (seg[0] !== '<') textRanges.push([off, seg]); return seg; });
  for (const [off, seg] of textRanges) {
    for (const m of seg.matchAll(TOKEN)) {
      const t = m[1];
      if (upperCount(t) < 2 || (isNoise(t) && !GLOSSARY[t])) continue;
      found.add(t);
      if (seen.has(t)) continue;
      const pos = off + m.index;
      const def = defOf(t, courseId);
      if (!def || inHeading(pos)) continue;
      seen.add(t);
      if (ONCE_PER_COURSE.has(t)) { if (courseSeen.has(t)) continue; courseSeen.add(t); }
      const end = pos + t.length;
      const after = html.slice(end, end + 40).replace(/^(<\/(strong|em|b|i)>)+/, '');
      const before = html.slice(Math.max(0, pos - 40), pos).replace(/(<(strong|em|b|i)>)+$/, '');
      // Already defined: "ACR (…)", "(ACR", "ACR 9001" (followed by a number), "l'ACR :" definitions, or definition just before
      if (/^[/-][A-Za-z]/.test(after) || /^\s*[(:]/.test(after) || /\(\s*$/.test(before) || /^\s?[\d:]/.test(after) || /^\s*[,;]?\s*(qui|c'est|soit)\b/.test(after)) continue;
      const head = plain(def.split(',').pop().trim()).slice(0, 14);
      if (head.length > 6 && plain(html.slice(Math.max(0, pos - 220), pos + 220).replace(/<[^>]+>/g, '')).includes(head)) continue;
      let at = end;
      const close = html.slice(end).match(/^(<\/(strong|em|b|i)>)+/);
      if (close) at += close[0].length;
      inserts.push([at, ` (${def})`]);
    }
  }
  inserts.sort((a, b) => b[0] - a[0]);
  let out = html;
  for (const [at, s] of inserts) out = out.slice(0, at) + s + out.slice(at);
  return out;
}

const collect = (s, found) => {
  for (const m of String(s || '').matchAll(TOKEN)) { const t = m[1]; if (upperCount(t) >= 2 && (!isNoise(t) || GLOSSARY[t])) found.add(t); }
};

/** Adds definitions to module texts and a glossary to the course. Returns acronyms that have no definition. */
export function applyAcronyms(course) {
  const found = new Set();
  const courseSeen = new Set();
  collect(course.title, found); collect(course.summary, found);
  for (const s of course.steps) collect(s.title, found);
  for (const m of Object.values(course.modules)) {
    m.text = expandText(m.text, course.id, found, courseSeen);
    for (const o of m.objectives || []) collect(o, found);
    for (const z of m.quizzes || []) for (const q of z.questions) { collect(q.question, found); q.answers.forEach((a) => collect(a, found)); }
  }
  const glossary = [...found].filter((t) => defOf(t, course.id)).sort((a, b) => a.localeCompare(b, 'fr'))
    .map((s) => ({ s, d: defOf(s, course.id) }));
  course.glossary = glossary;
  return [...found].filter((t) => !defOf(t, course.id));
}
