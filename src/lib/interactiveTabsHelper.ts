import { Formation, DomainIntervention, SubDomain, SoftwareTool } from '../types';
import { TabSectionItem } from '../components/InteractiveSectionTabs';
import { PRESET_SOFTWARE_TOOLS } from '../data/softwarePresets';

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
 * Builds the 6 interactive tab sections for Formations
 * (OBJECTIFS, PUBLIC, PROGRAMME, ACCESSIBILITÉ, PÉDAGOGIE, FINANCEMENT)
 */
export function buildFormationTabSections(
  formation: Formation,
  axisData?: any
): TabSectionItem[] {
  // 1. Objectives & Results
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

  // 2. Target public & prerequisites
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

  // 3. Program / Modules
  const programList = (formation.program && formation.program.length > 0)
    ? formation.program.map(p => `${p.module} : ${p.details.join(' • ')}`)
    : [
        "Module 1 : Cadrage stratégique, fondements méthodologiques et revue des normes sectorielles.",
        "Module 2 : Outils d'ingénierie opérationnelle, études de cas réels et simulations pratiques.",
        "Module 3 : Modélisation avancée, digitalisation des processus et automatisation des livrables.",
        "Module 4 : Projet pratique de fin d'études et soutenance officielle devant jury d'experts."
      ];

  // 4. Accessibility / Admission / Sessions
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

  // 5. Pedagogy & Software
  const pedagogyList = [
    "Pédagogie active et andragogie moderne axée à 80% sur la pratique et l'Approche Par Compétences (APC).",
    "Ateliers de codéveloppement et résolution de cas réels d'entreprises ivoiriennes et internationales.",
    "Animation exclusive par des praticiens et consultants séniors justifiant de plus de 10 ans d'expérience métier.",
    "Accès privilégié aux plateformes e-learning, supports interactifs et communauté d'alumni CICEXF."
  ];

  // 6. Financing
  const financeList = [
    `Tarif de référence : ${formation.price || "450 000 FCFA"} (Tarif net sans coûts dissimulés).`,
    "Facilités de paiement : Possibilité d'échelonnement en 2 ou 3 versements sans frais additionnels pour les particuliers.",
    "Prise en charge entreprise & FDFP : Délivrance de convention officielle de formation et facture proforma sous 24 heures.",
    "Remises accordées : -10% pour les inscriptions de groupe (à partir de 3 collaborateurs) ou anticipées.",
    "Moyens de règlement acceptés : Virement bancaire, chèque certifié, Mobile Money (Orange Money, Wave, MTN MoMo) ou au secrétariat du siège."
  ];

  return [
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
      items: programList
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
    }
  ];
}

/**
 * Builds the 6 interactive tab sections for Accompagnements / Domaines d'intervention
 * (OBJECTIFS, PUBLIC, PROGRAMME, ACCESSIBILITÉ, PÉDAGOGIE, FINANCEMENT)
 */
export function buildAccompanimentTabSections(
  sub: SubDomain,
  domain: DomainIntervention
): TabSectionItem[] {
  // 1. Objectives
  const objectivesList = (sub.objectives && sub.objectives.length > 0)
    ? sub.objectives
    : [
        "Réaliser un diagnostic approfondi et cartographier 100% des processus critiques de l'organisation.",
        "Structurer des cadres d'intervention sur-mesure conformes aux standards internationaux.",
        "Déployer des solutions opérationnelles pérennes et sécuriser la conformité réglementaire.",
        "Garantir le transfert de compétences et l'autonomie technique souveraine des équipes locales."
      ];

  // 2. Public / Target entities
  const publicList = [
    "Directions Générales, Directions Financières, Directions Techniques et comités de gouvernance.",
    "Institutions publiques, ministères sectoriels et agences gouvernementales d'exécution.",
    "Projets sous financements internationaux (Banque Mondiale, BAD, AFD, Union Européenne).",
    "Collectivités territoriales, municipalités et structures d'aménagement territorial.",
    "Grandes entreprises privées, PME en expansion et cabinets d'ingénierie partenaires."
  ];

  // 3. Program / Démarche d'accompagnement
  const programList = (sub.demarcheAccompagnement && sub.demarcheAccompagnement.length > 0)
    ? sub.demarcheAccompagnement
    : [
        "Phase 1 : Cadrage stratégique, immersion auprès des parties prenantes et diagnostic des besoins.",
        "Phase 2 : Analyse approfondie des données, cartographie technique et co-conception des solutions.",
        "Phase 3 : Déploiement opérationnel sur le terrain, outillage technique et conduite du changement.",
        "Phase 4 : Évaluation d'impact, remise des livrables définitifs et transfert d'autonomie."
      ];

  // 4. Accessibility / Intervention modalities
  const accessList = [
    "Intervention sur site dans vos locaux à Abidjan, sur l'ensemble du territoire ivoirien et dans la sous-région ouest-africaine.",
    "Modalités agiles : Formules en immersion continue, missions modulaires ou assistance technique per diem.",
    "Équipe dédiée d'experts pluridisciplinaires chevronnés encadrée par un chef de mission sénior dédié.",
    "Permanence technique et comités de suivi bi-hebdomadaires pour garantir le respect strict des jalons.",
    "Accès sécurisé à nos plateformes collaboratives pour le partage des livrables en temps réel."
  ];

  // 5. Pedagogy / Evaluation / Software
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

  // 6. Financing
  const financeList = [
    "Offre technique et financière sur-mesure formalisée sous 48 heures ouvrées sur la base de vos Termes de Référence (TDR).",
    "Facturation progressive échelonnée selon la validation effective des jalons contractuels et des livrables.",
    "Eligibilité au financement institutionnel, conventions d'appui et financements internationaux de développement.",
    "Transparence contractuelle intégrale : aucune charge cachée, cadrage budgétaire ferme et définitif.",
    "Possibilité de conventions-cadres pluriannuelles avec tarifs préférentiels pour les accompagnements réguliers."
  ];

  return [
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
      items: programList
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
      intro: 'Modalités contractuelles, devis sur-mesure et convention d\'ingénierie :',
      items: financeList,
      extraDetails: [
        { label: 'Proposition', value: 'Devis sur-mesure sous 48h' },
        { label: 'Agrément', value: 'Récépissé N°25343/GTCA/RC/2025' }
      ]
    }
  ];
}
