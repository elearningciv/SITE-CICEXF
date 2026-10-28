import React from 'react';
import { Formation, DomainIntervention, SubDomain, SoftwareTool } from '../types';
import { TabSectionItem, ProgramModule } from '../components/InteractiveSectionTabs';
import { PRESET_SOFTWARE_TOOLS } from '../data/softwarePresets';
import RegistrationGrandPlanForm from '../components/RegistrationGrandPlanForm';

export function matchSoftwareWithIcons(softwareNames: string[] = []): SoftwareTool[] {
  return softwareNames.map(name => {
    const n = name.toLowerCase();
    const found = PRESET_SOFTWARE_TOOLS.find(p => {
      const pn = p.name.toLowerCase();
      return pn === n || n.includes(pn) || pn.includes(n);
    });
    return {
      name,
      iconUrl: found?.iconUrl || ''
    };
  });
}

/**
 * Builds the 8 interactive tab sections for Formations:
 * 1. DESCRIPTION (premier)
 * 2. OBJECTIFS
 * 3. PUBLIC
 * 4. PROGRAMME (Module en gras + points non gras, sans mentionner "sous point")
 * 5. ADMISSION
 * 6. PÉDAGOGIE
 * 7. FINANCEMENT
 * 8. S'INSCRIRE (dernier)
 */
export function buildFormationTabSections(
  formation: Formation,
  axisData?: any,
  registrationContent?: React.ReactNode
): TabSectionItem[] {
  // 1. Description text
  const descText = formation.context || formation.shortDescription || "Formation certifiante d'excellence opérationnelle conçue et animée par les experts du Cabinet CICEXF.";

  // 2. Objectives & Results
  const objectivesList = (formation.objectives && formation.objectives.length > 0)
    ? formation.objectives
    : (axisData?.objectives || [
        "Maîtriser les méthodologies d'excellence et les standards internationaux du secteur.",
        "Acquérir les techniques de conception, de structuration et de pilotage opérationnel.",
        "Développer une expertise technique autonome immédiatement applicable en entreprise.",
        "Savoir manager des dossiers complexes de bout en bout et diriger les équipes d'exécution."
      ]);

  const resultsList = (formation.resultsExpected && formation.resultsExpected.length > 0)
    ? formation.resultsExpected
    : (axisData?.results || [
        "Obtention du Certificat professionnel officiel délivré par le Cabinet CICEXF.",
        "Validation des acquis techniques via une étude de cas pratique d'envergure réelle.",
        "Capacité opérationnelle immédiate de niveau exécutif sur votre poste de travail."
      ]);

  // 3. Target public & prerequisites
  const publicList = (formation.targetPublic && formation.targetPublic.length > 0)
    ? formation.targetPublic
    : (axisData?.opportunities || [
        "Cadres, directeurs techniques, chefs de département et responsables de pôle.",
        "Consultants, auditeurs et chargés d'études en quête de perfectionnement.",
        "Professionnels en reconversion ou désireux de valider une certification reconnue.",
        "Diplômés de l'enseignement supérieur préparant une insertion professionnelle de haut niveau."
      ]);

  const prerequisitesList = (formation.prerequisites && formation.prerequisites.length > 0)
    ? formation.prerequisites
    : [
        "Connaissance pratique de base de l'environnement informatique et bureautique.",
        "Expérience professionnelle ou formation académique dans un domaine connexe souhaitée."
      ];

  // 4. Program Modules (Modules in bold, details points in normal font, no "sous point" text)
  let programModules: ProgramModule[] = [];
  if (formation.program && formation.program.length > 0) {
    programModules = formation.program.map(p => ({
      module: p.module,
      details: Array.isArray(p.details) ? p.details : [String(p.details)]
    }));
  } else {
    programModules = [
      {
        module: "Module 1 : Cadrage stratégique, fondements méthodologiques et revue sectorielle",
        details: [
          "Fondamentaux conceptuels et analyse des enjeux contemporains du secteur",
          "Revue critique des normes professionnelles et standards internationaux",
          "Études de cas réels appliqués aux contextes organisationnels africains"
        ]
      },
      {
        module: "Module 2 : Outils d'ingénierie opérationnelle et simulations pratiques",
        details: [
          "Prise en main des outils informatiques et des progiciels spécialisés",
          "Protocoles de traitement, d'analyse et de modélisation avancée",
          "Ateliers dirigés en laboratoire applicatif avec encadrement d'experts séniors"
        ]
      },
      {
        module: "Module 3 : Modélisation avancée, digitalisation et automatisation des livrables",
        details: [
          "Structuration des tableaux de bord et indicateurs de performance clés (KPI)",
          "Automatisation des flux de reporting et fiabilisation des livrables finaux",
          "Contrôle qualité, auditabilité des processus et détection des anomalies"
        ]
      },
      {
        module: "Module 4 : Projet pratique de fin de cycle et soutenance officielle de certification",
        details: [
          "Élaboration d'un projet professionnel d'envergure réelle sur votre poste",
          "Présentation et soutenance devant le jury d'experts du Cabinet CICEXF",
          "Délivrance de l'attestation officielle de réussite et du certificat d'expertise"
        ]
      }
    ];
  }

  // 5. Accessibility / Admission
  const accessList = [
    `Modalité de suivi : ${formation.modality || "Présentiel & En ligne (Hybride)"} avec accès continu aux ressources digitales.`,
    `Durée du parcours : ${formation.duration || "6 semaines intensives"} modulables selon votre disponibilité.`,
    `Niveau d'admission : ${formation.level || "Tous niveaux"} avec positionnement pédagogique personnalisé.`,
    "Accessibilité : Rythme adapté aux cadres en activité (cours du soir, sessions intensives le week-end ou e-learning 24/7).",
    "Certification : Évaluation continue des compétences et délivrance du certificat officiel CICEXF après validation."
  ];

  if (formation.sessions && formation.sessions.length > 0) {
    formation.sessions.forEach(s => {
      accessList.push(`Session programmée : ${s.date} — Lieu : ${s.location} (${s.status})`);
    });
  }

  // 6. Pedagogy
  const pedagogyList = [
    "Pédagogie active et andragogie moderne axée à 80% sur la pratique et l'Approche Par Compétences (APC).",
    "Ateliers de codéveloppement et résolution de cas réels d'entreprises ivoiriennes et internationales.",
    "Animation exclusive par des praticiens et consultants séniors justifiant de plus de 10 ans d'expérience métier.",
    "Accès privilégié aux plateformes e-learning, supports interactifs et communauté d'alumni CICEXF."
  ];

  // 7. Financing
  const financeList = [
    `Tarif de référence : ${formation.price || "450 000 FCFA"} (Tarif net sans coûts dissimulés).`,
    "Facilités de paiement : Possibilité d'échelonnement en 2 ou 3 versements sans frais additionnels pour les particuliers.",
    "Prise en charge entreprise & FDFP : Délivrance de convention officielle de formation et facture proforma sous 24 heures.",
    "Remises accordées : -10% pour les inscriptions de groupe (à partir de 3 collaborateurs) ou anticipées.",
    "Moyens de règlement acceptés : Virement bancaire, chèque certifié, Mobile Money (Orange Money, Wave, MTN MoMo) ou au secrétariat du siège."
  ];

  // 8. Inscription
  const inscriptionList = [
    "Dépôt de candidature immédiat avec prise en charge sous 24h ouvrées par notre service pédagogique.",
    "Entretien de cadrage individuel offert pour adapter les dates et les horaires à votre planning.",
    "Délivrance immédiate de convention de formation pour les prises en charge employeur (agrément FDFP).",
    "Accès prioritaire à la documentation préparatoire dès validation de l'inscription."
  ];

  return [
    {
      id: 'description',
      label: 'DESCRIPTION',
      intro: 'Présentation générale et portée d\'excellence du programme :',
      items: [
        descText,
        `Domaine d'expertise : ${formation.domain}${formation.specialty ? ` — Spécialité : ${formation.specialty}` : ''}`,
        `Niveau de qualification : ${formation.level} | Modalité d'exécution : ${formation.modality}`,
        "Parcours professionnalisant orienté à 80% sur la pratique, les études de cas réels et la maîtrise opérationnelle."
      ],
      extraDetails: [
        { label: 'Thématique', value: formation.domain },
        { label: 'Spécialité', value: formation.specialty || 'Générale' }
      ]
    },
    {
      id: 'objectifs',
      label: 'OBJECTIFS',
      intro: 'Les travaux de cette formation permettront aux personnes engagées ou non dans la vie active de :',
      items: [...objectivesList, ...resultsList.map(r => `Résultat certifié : ${r}`)]
    },
    {
      id: 'public',
      label: 'PUBLIC',
      intro: 'Cette formation d\'excellence est spécialement calibrée pour les profils et exigences suivants :',
      items: [
        ...publicList.map(p => `Profil visé : ${p}`),
        ...prerequisitesList.map(pre => `Prérequis d'admission : ${pre}`)
      ],
      extraDetails: [
        { label: 'Niveau d\'accès', value: formation.level || 'Intermédiaire' },
        { label: 'Modalité', value: formation.modality || 'Hybride' }
      ]
    },
    {
      id: 'programme',
      label: 'PROGRAMME',
      intro: 'Architecture académique et découpage des modules d\'apprentissage :',
      programModules: programModules
    },
    {
      id: 'admission',
      label: 'ADMISSION',
      intro: 'Conditions d\'admission, souplesse d\'accès et calendrier officiel :',
      items: accessList,
      extraDetails: [
        { label: 'Durée', value: formation.duration || '6 semaines' },
        { label: 'Agrément', value: 'Récépissé N°25343/GTCA/RC/2025' }
      ]
    },
    {
      id: 'pedagogie',
      label: 'PÉDAGOGIE',
      intro: 'Méthodes andragogiques et outils professionnels mobilisés par le CICEXF :',
      items: pedagogyList
    },
    {
      id: 'financement',
      label: 'FINANCEMENT',
      intro: 'Modalités financières, conventions d\'entreprise et options de règlement :',
      items: financeList,
      extraDetails: [
        { label: 'Investissement', value: formation.price || '450 000 FCFA' },
        { label: 'Échelonnement', value: '2 à 3 fois sans frais' }
      ]
    },
    {
      id: 'sinscrire',
      label: "S'INSCRIRE",
      intro: 'Rejoignez la prochaine cohorte certifiante du Cabinet CICEXF :',
      content: registrationContent || React.createElement(RegistrationGrandPlanForm, {
        targetTitle: formation.title,
        price: formation.price,
        sessions: formation.sessions,
        defaultType: 'Candidature Formation'
      }),
      items: inscriptionList,
      extraDetails: [
        { label: 'Délai de traitement', value: '24 heures ouvrées' },
        { label: 'Validation', value: 'Dossier & Entretien' }
      ]
    }
  ];
}

/**
 * Builds the 8 interactive tab sections for Accompagnements / Domaines d'intervention:
 * 1. DESCRIPTION (premier)
 * 2. OBJECTIFS
 * 3. PUBLIC
 * 4. PROGRAMME (Démarche d'accompagnement : phases en gras + points non gras)
 * 5. ADMISSION (Modalités de déploiement)
 * 6. PÉDAGOGIE (Évaluation & Logiciels)
 * 7. FINANCEMENT
 * 8. S'INSCRIRE (dernier)
 */
export function buildAccompanimentTabSections(
  sub: SubDomain,
  domain: DomainIntervention,
  registrationContent?: React.ReactNode
): TabSectionItem[] {
  // 1. Description
  const descText = sub.presentationService || sub.description || domain.description || "Mission d'assistance technique, d'audit opérationnel et d'accompagnement stratégique réalisée par le Cabinet CICEXF.";

  // 2. Objectives
  const objectivesList = (sub.objectives && sub.objectives.length > 0)
    ? sub.objectives
    : [
        "Réaliser un diagnostic approfondi et cartographier 100% des processus critiques de l'organisation.",
        "Structurer des cadres d'intervention sur-mesure conformes aux standards internationaux.",
        "Déployer des solutions opérationnelles pérennes et sécuriser la conformité réglementaire.",
        "Garantir le transfert de compétences et l'autonomie technique souveraine des équipes locales."
      ];

  // 3. Public / Target entities
  const publicList = [
    "Directions Générales, Directions Financières, Directions Techniques et comités de gouvernance.",
    "Institutions publiques, ministères sectoriels et agences gouvernementales d'exécution.",
    "Projets sous financements internationaux (Banque Mondiale, BAD, AFD, Union Européenne).",
    "Collectivités territoriales, municipalités et structures d'aménagement territorial.",
    "Grandes entreprises privées, PME en expansion et cabinets d'ingénierie partenaires."
  ];

  // 4. Program / Démarche d'accompagnement (Phases in bold, details points in normal font, no "sous point" text)
  let programModules: ProgramModule[] = [];
  if (sub.demarcheAccompagnement && sub.demarcheAccompagnement.length > 0) {
    programModules = sub.demarcheAccompagnement.map(step => {
      const parts = step.split(':');
      if (parts.length > 1) {
        return {
          module: parts[0].trim(),
          details: [parts.slice(1).join(':').trim()]
        };
      }
      return {
        module: step,
        details: []
      };
    });
  } else {
    programModules = [
      {
        module: "Phase 1 : Cadrage stratégique, immersion et diagnostic des besoins",
        details: [
          "Entretiens de fond avec les comités de direction et acteurs opérationnels clés",
          "Revue documentaire exhaustive et analyse des processus existants",
          "Rapport de cadrage préliminaire et fixation des indicateurs de réussite"
        ]
      },
      {
        module: "Phase 2 : Analyse approfondie des données, cartographie technique et co-conception",
        details: [
          "Modélisation sur-mesure et études d'impact organisationnel",
          "Ateliers collaboratifs de validation avec les équipes d'exécution",
          "Élaboration des livrables provisoires et des outils techniques"
        ]
      },
      {
        module: "Phase 3 : Déploiement opérationnel sur le terrain et outillage technique",
        details: [
          "Mise en place des progiciels, protocoles et grilles de gestion",
          "Accompagnement per diem et sessions de renforcement des compétences",
          "Stabilisation des processus et correction des anomalies identifiées"
        ]
      },
      {
        module: "Phase 4 : Évaluation d'impact, remise des livrables définitifs et transfert d'autonomie",
        details: [
          "Audit de clôture et mesure des gains d'efficacité opérationnelle",
          "Remise des manuels de procédures et des cartographies définitives",
          "Session officielle de restitution et transfert souverain des compétences"
        ]
      }
    ];
  }

  // 5. Accessibility / Intervention modalities
  const accessList = [
    "Intervention sur site dans vos locaux à Abidjan, sur l'ensemble du territoire ivoirien et dans la sous-région ouest-africaine.",
    "Modalités agiles : Formules en immersion continue, missions modulaires ou assistance technique per diem.",
    "Équipe dédiée d'experts pluridisciplinaires chevronnés encadrée par un chef de mission sénior dédié.",
    "Permanence technique et comités de suivi bi-hebdomadaires pour garantir le respect strict des jalons.",
    "Accès sécurisé à nos plateformes collaboratives pour le partage des livrables en temps réel."
  ];

  // 6. Pedagogy / Evaluation / Software
  const resultsExpected = sub.resultatsAttendus || [
    "Rapports d'expertise exhaustifs et grilles de recommandations opérationnelles remis.",
    "Processus internes fluidifiés, sécurisés et outillés pour une productivité décuplée."
  ];

  const evalMethods = sub.methodeEvaluation || [
    "Revues périodiques avec le comité de pilotage et validation formelle des livrables.",
    "Indicateurs de performance avant/après et mesure des gains d'efficacité à J+60."
  ];

  const pedagogyList = [
    `Impact stratégique : ${sub.impactEntite || 'Autonomie opérationnelle renforcée, réduction des risques et souveraineté décisionnelle.'}`,
    ...resultsExpected.map(r => `Résultat attendu : ${r}`),
    ...evalMethods.map(e => `Protocole d'évaluation : ${e}`)
  ];

  const tools: SoftwareTool[] = (sub.softwareTools && sub.softwareTools.length > 0)
    ? sub.softwareTools
    : (sub.software && sub.software.length > 0
        ? matchSoftwareWithIcons(sub.software)
        : matchSoftwareWithIcons(domain.software || []));

  // 7. Financing
  const financeList = [
    "Offre technique et financière sur-mesure formalisée sous 48 heures ouvrées sur la base de vos Termes de Référence (TDR).",
    "Facturation progressive échelonnée selon la validation effective des jalons contractuels et des livrables.",
    "Eligibilité au financement institutionnel, conventions d'appui et financements internationaux de développement.",
    "Transparence contractuelle intégrale : aucune charge cachée, cadrage budgétaire ferme et définitif.",
    "Possibilité de conventions-cadres pluriannuelles avec tarifs préférentiels pour les accompagnements réguliers."
  ];

  // 8. Inscription
  const inscriptionList = [
    "Demande de devis ou d'assistance technique prise en charge immédiatement par nos experts séniors.",
    "Réunion de cadrage offerte (en présentiel ou en visioconférence) sous 48 heures ouvrées.",
    "Cadrage contractuel clair garantissant la confidentialité absolue de vos données stratégiques.",
    "Déploiement rapide de nos consultants selon votre calendrier d'urgence."
  ];

  return [
    {
      id: 'description',
      label: 'DESCRIPTION',
      intro: 'Présentation stratégique et cadrage de la mission d\'accompagnement :',
      items: [
        descText,
        `Pôle d'intervention : ${domain.title}`,
        `Axe spécifique : ${sub.title}`,
        "Accompagnement sur-mesure combinant diagnostic stratégique, déploiement opérationnel et transfert de compétences souveraines."
      ],
      extraDetails: [
        { label: 'Pôle', value: domain.title },
        { label: 'Axe', value: sub.title }
      ]
    },
    {
      id: 'objectifs',
      label: 'OBJECTIFS',
      intro: 'L\'accompagnement technique et stratégique du Cabinet CICEXF permet à votre entité de :',
      items: objectivesList
    },
    {
      id: 'public',
      label: 'PUBLIC',
      intro: 'Ce pôle d\'expertise et de conseil s\'adresse en priorité aux entités et organisations suivantes :',
      items: publicList
    },
    {
      id: 'programme',
      label: 'PROGRAMME',
      intro: 'Démarche d\'accompagnement et étapes méthodologiques de la mission :',
      programModules: programModules
    },
    {
      id: 'admission',
      label: 'ADMISSION',
      intro: 'Modalités de déploiement, calendrier et conditions d\'intervention du cabinet :',
      items: accessList
    },
    {
      id: 'pedagogie',
      label: 'PÉDAGOGIE',
      intro: 'Méthodes d\'évaluation de l\'impact, résultats attendus et outils déployés :',
      items: pedagogyList,
      softwareTools: tools
    },
    {
      id: 'financement',
      label: 'FINANCEMENT',
      intro: 'Dispositifs de financement, conventions d\'entreprise et facilités de règlement :',
      items: [
        "Éligibilité aux conventions d'appui et prises en charge d'ingénierie (conventions FDFP et équivalents régionaux).",
        "Financement institutionnel et programmes d'assistance technique bilatéraux (Banque Mondiale, BAD, AFD, UE).",
        "Cadrage budgétaire ferme et définitif formalisé par une convention d'intervention claire et sans frais cachés.",
        "Facturation progressive échelonnée selon la validation effective des jalons contractuels et des livrables.",
        "Facilités de paiement pour les partenariats pluriannuels et les conventions-cadres institutionnelles."
      ],
      extraDetails: [
        { label: 'Proposition', value: 'Devis sur-mesure sous 48h' },
        { label: 'Agrément', value: 'Récépissé N°25343/GTCA/RC/2025' }
      ]
    },
    {
      id: 'sinscrire',
      label: "S'INSCRIRE",
      intro: 'Modalités contractuelles, devis sur-mesure et convention d\'ingénierie :',
      items: financeList,
      content: registrationContent || React.createElement(RegistrationGrandPlanForm, {
        targetTitle: `${domain.title} — ${sub.title}`,
        defaultType: 'Demande Entreprise'
      }),
      extraDetails: [
        { label: 'Délai d\'offre', value: '48 heures ouvrées' },
        { label: 'Modalité', value: 'Mission sur-mesure' }
      ]
    }
  ];
}
