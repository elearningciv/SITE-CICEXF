// Travaux pratiques de la certification « Management et pilotage communautaire de projets ».
// Dossier reconstitué à partir des documents du cas PGC-Vie (offre financière, classeurs de suivi budgétaire,
// supports de formation du CICEXF). Situation fictive construite pour la formation ; aucun nom de personne.
// Les réponses attendues sont calculées ici à partir des données, pour éviter toute erreur de calcul.
import type { PracticeSet, SheetCell, Fmt } from '../practice';

const fcfa = (n: number) => `${Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ')} FCFA`;
const r1 = (n: number) => Math.round(n * 10) / 10;
const num = (v: number, fmt: Fmt = 'n'): SheetCell => ({ v, fmt });
const inp = (id: string, answer: number, fmt: Fmt = 'n', tol?: number): SheetCell => ({ id, answer, fmt, ...(tol !== undefined ? { tol } : {}) });
const pick = (id: string, answer: string, options: string[]): SheetCell => ({ id, answer, options });
const table = (cols: string[], rows: (string | number)[][]) =>
  `<table><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;

// ---------------------------------------------------------------------------------------------
// Données de l'offre financière (6 mois)

const MONTHS = 6;
const PERSONNEL = [
  ['Chef de mission et animateur communautaire 1', 750000],
  ['Spécialiste VBG / MGP', 650000],
  ['Chargé de projet / programme', 500000],
  ['Animateur communautaire 2', 350000],
  ['Appui comptable (temps partiel)', 150000]
] as const;
const CHARGES = 0.165;
const personnelTotal = PERSONNEL.reduce((n, [, s]) => n + Math.round(s * (1 + CHARGES)) * MONTHS, 0);

const ACTIVITIES: [string, string, string, number, number][] = [
  ['Pilotage, démarrage et rapportage', 'Réunion de lancement avec l\'UCP et les autorités', 'réunion', 1, 150000],
  ['Pilotage, démarrage et rapportage', 'Rapport de démarrage (impression et reliure)', 'lot', 1, 75000],
  ['Pilotage, démarrage et rapportage', 'Rapports mensuels (impression et transmission)', 'rapport', 6, 20000],
  ['Pilotage, démarrage et rapportage', 'Rapport final et séance de restitution', 'lot', 1, 200000],
  ['Pilotage, démarrage et rapportage', 'Enquêtes de satisfaction et de notoriété du MGP', 'enquête', 2, 450000],
  ['Pilotage, démarrage et rapportage', 'Évaluation de la stratégie de communication', 'évaluation', 1, 400000],
  ['Mission 1 : animation communautaire', 'Cartographie : fiches d\'identification et supports', 'lot', 1, 50000],
  ['Mission 1 : animation communautaire', 'Cartographie : atelier de restitution (30 participants)', 'atelier', 1, 350000],
  ['Mission 1 : animation communautaire', 'Événement 1 : cérémonie officielle de lancement', 'événement', 1, 900000],
  ['Mission 1 : animation communautaire', 'Événement 2 : tournoi sportif communautaire', 'événement', 1, 800000],
  ['Mission 1 : animation communautaire', 'Événement 3 : journée culturelle et concours artistique', 'événement', 1, 750000],
  ['Mission 1 : animation communautaire', 'Événement 4 : journée de nettoyage et d\'embellissement', 'événement', 1, 600000],
  ['Mission 1 : animation communautaire', 'Événement 5 : consultations publiques', 'événement', 1, 700000],
  ['Mission 1 : animation communautaire', 'Événement 6 : événement de clôture', 'événement', 1, 900000],
  ['Mission 1 : animation communautaire', 'Location de bâches, chaises et groupe électrogène', 'événement', 6, 150000],
  ['Mission 1 : animation communautaire', 'Émissions radio mensuelles (français et langue locale)', 'émission', 6, 150000],
  ['Mission 1 : animation communautaire', 'Causeries éducatives dans les quartiers', 'causerie', 30, 20000],
  ['Mission 1 : animation communautaire', 'Focus groups (femmes et filles, jeunes, leaders)', 'séance', 6, 60000],
  ['Mission 1 : animation communautaire', 'Séances de théâtre-forum', 'séance', 4, 250000],
  ['Mission 1 : animation communautaire', 'Comité communal de liaison : réunion d\'installation', 'réunion', 1, 100000],
  ['Mission 1 : animation communautaire', 'Comité communal de liaison : séances mensuelles', 'séance', 6, 75000],
  ['Mission 2 : MGP et prévention des VBG', 'Installation des boîtes à plaintes (pose et scellement)', 'boîte', 5, 15000],
  ['Mission 2 : MGP et prévention des VBG', 'Annonce des canaux du MGP dans les quartiers', 'quartier', 5, 20000],
  ['Mission 2 : MGP et prévention des VBG', 'Traitement des plaintes (vérification, médiation, déplacements)', 'mois', 6, 50000],
  ['Mission 2 : MGP et prévention des VBG', 'Appui au référencement des survivant(e)s', 'mois', 6, 40000],
  ['Mission 2 : MGP et prévention des VBG', 'Formation des comités : indemnités de participation (2 jours)', 'participant-jour', 60, 8000],
  ['Mission 2 : MGP et prévention des VBG', 'Formation des comités : supports de formation', 'participant', 30, 3000],
  ['Mission 2 : MGP et prévention des VBG', 'Formation des comités : location de salle (2 jours)', 'jour', 2, 50000],
  ['Mission 2 : MGP et prévention des VBG', 'Sessions de sensibilisation des travailleurs de chantier', 'session', 12, 75000],
  ['Mission 2 : MGP et prévention des VBG', 'Formation des points focaux à KoboToolbox et GEMS', 'participant', 30, 10000],
  ['Mission 2 : MGP et prévention des VBG', 'Coordination avec les structures de prise en charge des VBG', 'réunion', 6, 60000],
  ['Mission 2 : MGP et prévention des VBG', 'Atelier de validation du protocole de référencement', 'atelier', 1, 250000],
  ['Mission 2 : MGP et prévention des VBG', 'Annuaire des services de prise en charge (impression)', 'lot', 1, 50000]
];
const activitiesTotal = ACTIVITIES.reduce((n, a) => n + a[3] * a[4], 0);
const ACHATS = [
  ['Mobilier et équipement de bureau', 779000],
  ['Matériel informatique, téléphonie et collecte de données', 4820000],
  ['Transport, sécurité et équipement de terrain', 3500000],
  ['Supports de communication', 4360000]
] as const;
const achatsTotal = ACHATS.reduce((n, [, v]) => n + v, 0);
const FONCTIONNEMENT = 4350000;
const FRAIS = 0.1, TVA = 0.18;
const direct = personnelTotal + activitiesTotal + achatsTotal + FONCTIONNEMENT;
const frais = Math.round(direct * FRAIS);
const ht = direct + frais;
const tva = Math.round(ht * TVA);

// ---------------------------------------------------------------------------------------------
// Dossier du projet

const DOSSIER_TDR = `
<p><em>Dossier pédagogique reconstitué à partir des documents du cas (offre financière et classeurs de suivi). Situation fictive construite pour la formation.</em></p>
<h3>1. Contexte</h3>
<p>Le Projet de gestion du cadre de vie (PGC-Vie) réalise des travaux d'amélioration du cadre de vie dans la ville d'Akoupé. Ces travaux transforment le quotidien des quartiers : circulation, nuisances, présence de travailleurs de chantier, attentes des populations. L'unité de coordination du projet (UCP) recrute une ONG pour appuyer la mise en œuvre des <strong>aspects sociaux</strong> du projet : informer et mobiliser les communautés, recueillir et traiter leurs plaintes, prévenir l'exploitation, les abus et le harcèlement sexuels (EAS/HS) et les violences basées sur le genre (VBG).</p>
<h3>2. Objectif général</h3>
<p>Favoriser l'acceptation sociale et la participation des communautés au PGC-Vie, et garantir un traitement rapide, équitable et confidentiel de leurs préoccupations.</p>
<h3>3. Zone, bénéficiaires et durée</h3>
<p>Cinq quartiers ciblés de la ville d'Akoupé ; habitants, femmes et filles, jeunes, leaders communautaires et religieux, autorités locales, travailleurs des chantiers. Durée de la mission : <strong>6 mois</strong> (M1 à M6).</p>
<h3>4. Missions et activités</h3>
<p><strong>Mission 1, animation communautaire et mobilisation sociale :</strong> cartographie des acteurs et atelier de validation ; six événements communautaires (lancement en M2, tournoi sportif en M3, journée culturelle en M4, nettoyage en M5, consultations publiques et clôture en M6) ; une émission radio par mois ; une causerie par mois dans chaque quartier ; focus groups ; quatre séances de théâtre-forum ; appui au comité communal de liaison (installation puis séances mensuelles).</p>
<p><strong>Mission 2, appui au mécanisme de gestion des plaintes (MGP) et prévention des EAS/HS/VBG :</strong> installation de 5 boîtes à plaintes et annonce des canaux ; traitement des plaintes ordinaires dans les délais ; transmission des plaintes sensibles à l'UCP <strong>sous 24 heures</strong> et référencement des survivant(e)s ; formation de 30 membres des comités de gestion des plaintes et de liaison ; 12 sessions de sensibilisation des travailleurs de chantier ; formation et équipement de 30 points focaux à KoboToolbox et GEMS ; coordination avec les structures de prise en charge ; protocole de référencement validé et annuaire des services.</p>
<h3>5. Résultats et indicateurs</h3>
${table(['Indicateur', 'Cible'], [
  ['Notoriété du MGP dans les quartiers ciblés (enquête)', 'au moins 80 %'],
  ['Satisfaction des plaignants (enquête)', 'au moins 80 %'],
  ['Plaintes sensibles transmises à l\'UCP sous 24 heures', '100 %'],
  ['Points focaux formés et équipés', '30'],
  ['Membres des comités formés', '30'],
  ['Sessions de sensibilisation des travailleurs', '12'],
  ['Causeries éducatives réalisées', '30 (une par mois et par quartier)'],
  ['Séances de théâtre-forum', '4']
])}
<h3>6. Équipe clé</h3>
<p>Un chef de mission (coordination, liaison avec l'UCP, validation des livrables, appui au comité communal de liaison) ; une spécialiste VBG/MGP ; un chargé de projet/programme (suivi-évaluation, logistique, administration) ; deux animateurs communautaires ; un appui comptable à temps partiel.</p>
<h3>7. Livrables et calendrier</h3>
${table(['Livrable', 'Échéance'], [
  ['Rapport de démarrage', 'Fin M1'],
  ['Rapports mensuels d\'activités', 'Chaque mois'],
  ['Enquêtes de notoriété et de satisfaction du MGP', 'Mi-parcours (M3) et fin de mission (M6)'],
  ['Évaluation de la stratégie de communication', 'M6'],
  ['Rapport final et séance de restitution', 'M6']
])}
<h3>8. Contraintes connues</h3>
<p>Saison des pluies qui rend certains quartiers difficiles d'accès ; coupures d'électricité et d'internet ; délai de 24 heures pour les plaintes sensibles ; confidentialité stricte des données des plaignants ; mission courte, avec des pics de charge au démarrage et à la clôture.</p>
`;

const DOSSIER_OFFRE = `
<p>Montants en FCFA, durée de la mission : 6 mois. Les prix unitaires sont des estimations à confirmer par devis.</p>
<h3>1. Récapitulatif</h3>
${table(['Rubrique', 'Montant'], [
  ['A. Personnel (équipe clé et appui comptable, charges patronales de 16,5 % comprises)', fcfa(personnelTotal)],
  ['B. Activités du projet', fcfa(activitiesTotal)],
  ['C. Achats et équipements', fcfa(achatsTotal)],
  ['D. Fonctionnement (loyer, énergie, communication, carburant, assurance, fournitures, missions)', fcfa(FONCTIONNEMENT)],
  ['E. Frais de gestion', '10 % des coûts directs (A + B + C + D)'],
  ['TVA', '18 % du total hors taxes']
])}
<h3>2. Personnel (6 mois)</h3>
${table(['Poste', 'Salaire brut mensuel', 'Coût mensuel employeur', 'Montant sur 6 mois'],
  PERSONNEL.map(([p, s]) => [p, fcfa(s), fcfa(Math.round(s * (1 + CHARGES))), fcfa(Math.round(s * (1 + CHARGES)) * MONTHS)]))}
<h3>3. Activités du projet</h3>
${table(['Rubrique', 'Désignation', 'Unité', 'Quantité', 'Prix unitaire', 'Montant'],
  ACTIVITIES.map(([r, d, u, q, p]) => [r, d, u, q, fcfa(p), fcfa(q * p)]))}
<h3>4. Achats et équipements</h3>
${table(['Catégorie', 'Montant'], ACHATS.map(([c, v]) => [c, fcfa(v)]))}
<h3>5. Hypothèses</h3>
<ul>
<li>Durée de la mission : 6 mois ; 5 quartiers ciblés ; 30 points focaux et 30 membres de comités à former.</li>
<li>Charges patronales : 16,5 % du salaire brut ; frais de gestion : 10 % des coûts directs ; TVA : 18 % (à retirer si l'ONG n'est pas assujettie).</li>
<li>Le matériel déjà détenu par l'ONG est mis à disposition sans être facturé.</li>
<li>Point à aligner : 12 sessions de sensibilisation des travailleurs dans l'offre technique, 6 dans le cadre logique.</li>
</ul>
`;

// ---------------------------------------------------------------------------------------------
// Exercice 1 : recalculer l'offre financière

const LINES1: [string, number, number][] = [
  ['Causeries éducatives dans les quartiers', 30, 20000],
  ['Formation des comités : indemnités (2 jours)', 60, 8000],
  ['Carburant des motos (litres)', 600, 900],
  ['Séances de théâtre-forum', 4, 250000]
];

// Exercice 2 : diagnostic logistique
const LOG: [string, number, number, 'À acquérir' | 'Existant', number][] = [
  ['Motos 125 cc', 4, 2, 'À acquérir', 550000],
  ['Ordinateurs portables', 6, 3, 'À acquérir', 630000],
  ['Tablettes pour KoboToolbox', 10, 4, 'À acquérir', 85000],
  ['Trousses de premiers secours', 3, 3, 'À acquérir', 20000],
  ['Armoires sécurisées', 2, 0, 'Existant', 95000],
  ['Groupe électrogène', 1, 0, 'À acquérir', 450000],
  ['Chaises (lots de 5)', 2, 2, 'Existant', 49000]
];
const STATUTS = ['Couvert', 'Partiellement couvert', 'Non couvert', 'Incohérent'];
const statutOf = (req: number, dispo: number, mode: string) =>
  dispo >= req ? (mode === 'À acquérir' ? 'Incohérent' : 'Couvert')
    : mode === 'Existant' ? 'Incohérent' : dispo === 0 ? 'Non couvert' : 'Partiellement couvert';
const ecartTotal = LOG.reduce((n, [, req, dispo, , pu]) => n + Math.max(0, req - dispo) * pu, 0);

// Exercice 3 : plan de charge
const CAPA = 22 - 2 - 2;
const CHARGE: [string, number][] = [
  ['Chef de mission', 17], ['Chargé de projet', 20], ['Spécialiste VBG/MGP', 18], ['Animateur communautaire 1', 12], ['Animateur communautaire 2', 14]
];
const LECTURES = ['Sous-charge', 'Équilibré', 'Tendu', 'Surcharge'];
const lectureOf = (t: number) => (t < 60 ? 'Sous-charge' : t <= 90 ? 'Équilibré' : t <= 100 ? 'Tendu' : 'Surcharge');

// Exercice 4 : matrice d'Eisenhower révisée
const TASKS: [string, number, number, boolean, boolean][] = [
  ['Transmettre une plainte sensible à l\'UCP', 3, 1, false, true],
  ['Remettre le rapport mensuel', 3, 2, false, false],
  ['Valider les maquettes avec l\'UCP (bloque l\'impression)', 2, 10, true, false],
  ['Former les points focaux à KoboToolbox', 3, 30, false, false],
  ['Mettre à jour la cartographie des acteurs', 2, 20, false, false],
  ['Répondre à une demande d\'information d\'un partenaire', 1, 5, false, false],
  ['Participer à une réunion externe sans ordre du jour', 1, 2, false, false],
  ['Reclasser les photos du dernier événement', 1, 40, false, false],
  ['Visiter un quartier où un incident de sécurité a été signalé', 2, 20, false, true]
];
const DECISIONS = ['Faire maintenant', 'Planifier', 'Déléguer ou décliner', 'Éliminer ou reporter'];
const urgOf = (days: number, blocks: boolean) => Math.min(3, (days > 15 ? 1 : days >= 3 ? 2 : 3) + (blocks ? 1 : 0));
const quadOf = (imp: number, urg: number, safety: boolean) => (safety ? 1 : imp >= 2 ? (urg >= 2 ? 1 : 2) : urg >= 2 ? 3 : 4);

// Exercice 5 : tableau de bord des indicateurs (fin M3)
const IND: [string, number, number][] = [
  ['Causeries éducatives réalisées', 30, 12],
  ['Émissions radio diffusées', 6, 3],
  ['Points focaux formés et équipés', 30, 30],
  ['Séances de théâtre-forum', 4, 1],
  ['Sessions de sensibilisation des travailleurs', 12, 4],
  ['Membres des comités formés', 30, 24]
];
const TRAJ = ['Dans la trajectoire', 'Léger retard', 'Retard important'];
const trajOf = (t: number) => (t >= 50 ? 'Dans la trajectoire' : t >= 35 ? 'Léger retard' : 'Retard important');

// Exercice 6 : suivi budgétaire (fin M3)
const BUD: [string, number, number, number, number][] = [
  ['Cérémonie officielle de lancement', 900000, 0, 935000, 0],
  ['Émissions radio mensuelles', 900000, 150000, 150000, 150000],
  ['Causeries éducatives dans les quartiers', 600000, 100000, 140000, 160000],
  ['Séances de théâtre-forum', 1000000, 0, 0, 820000],
  ['Formation des comités : indemnités', 480000, 0, 480000, 0],
  ['Sessions de sensibilisation des travailleurs', 900000, 75000, 75000, 150000]
];
const SITUATIONS = ['OK', 'Attention', 'Dépassé'];
const situationOf = (rate: number) => (rate > 100 ? 'Dépassé' : rate >= 80 ? 'Attention' : 'OK');
const budTotal = BUD.reduce((n, b) => n + b[1], 0);
const spentTotal = BUD.reduce((n, b) => n + b[2] + b[3] + b[4], 0);
const rateTotal = r1((spentTotal / budTotal) * 100);
const RYTHMES = ['Trop rapide', 'Normal', 'Trop lent'];
const rythmeOf = (consumed: number, time: number) => (consumed > time + 15 ? 'Trop rapide' : consumed < time - 15 ? 'Trop lent' : 'Normal');

const set: PracticeSet = {
  courseId: 'management-pilotage-communautaire',
  title: 'Travaux pratiques : projet PGC-Vie',
  intro: "Ces exercices vous mettent en situation sur un même projet. Lisez d'abord le dossier du projet (termes de référence et offre financière), puis remplissez les tableaux et rédigez vos réponses directement sur le site. Chaque exercice est corrigé dès que vous le validez : le corrigé s'affiche ensuite et vous pouvez recommencer. Ces travaux pratiques sont formatifs : ils ne comptent pas pour le certificat.",
  dossier: [
    { id: 'tdr', title: 'Termes de référence de la mission', html: DOSSIER_TDR },
    { id: 'offre', title: 'Offre financière de la mission', html: DOSSIER_OFFRE }
  ],
  exercises: [
    {
      kind: 'sheet',
      id: 'offre-financiere',
      title: 'Exercice 1 : recalculer l\'offre financière',
      skill: 'Offre financière',
      intro: "Avant de déposer l'offre, le chef de mission vous demande de vérifier les calculs. Complétez le montant de quelques lignes d'activités, puis le récapitulatif.",
      rules: "<p>Montant d'une ligne = quantité × prix unitaire. Coûts directs = A + B + C + D. Frais de gestion = 10 % des coûts directs. Total HT = coûts directs + frais de gestion. TVA = 18 % du total HT. Total TTC = HT + TVA. Coût mensuel moyen = total HT ÷ 6. Part du personnel = A ÷ total HT.</p>",
      tables: [
        {
          title: 'Lignes d\'activités',
          columns: ['Désignation', 'Quantité', 'Prix unitaire (FCFA)', 'Montant (FCFA)'],
          rows: LINES1.map(([d, q, p], i) => [d, num(q), num(p, 'fcfa'), inp(`l${i}`, q * p, 'fcfa')])
        },
        {
          title: 'Récapitulatif',
          columns: ['Rubrique', 'Montant (FCFA)'],
          rows: [
            ['A. Personnel', num(personnelTotal, 'fcfa')],
            ['B. Activités', num(activitiesTotal, 'fcfa')],
            ['C. Achats et équipements', num(achatsTotal, 'fcfa')],
            ['D. Fonctionnement', num(FONCTIONNEMENT, 'fcfa')],
            ['Coûts directs (A + B + C + D)', inp('direct', direct, 'fcfa')],
            ['E. Frais de gestion (10 %)', inp('frais', frais, 'fcfa')],
            ['Total hors taxes', inp('ht', ht, 'fcfa')],
            ['TVA (18 %)', inp('tva', tva, 'fcfa')],
            ['Total toutes taxes comprises', inp('ttc', ht + tva, 'fcfa')],
            ['Coût mensuel moyen hors taxes', inp('mensuel', Math.round(ht / MONTHS), 'fcfa', 2)],
            ['Part du personnel dans le total HT (%)', inp('partPerso', r1((personnelTotal / ht) * 100), 'pct')]
          ]
        }
      ],
      explanation: `<p>Les frais de gestion se calculent sur les coûts directs, jamais sur le total TTC. Le personnel représente près d'un tiers du total hors taxes : c'est la rubrique qui pèse le plus. Un paramètre (durée, TVA) isolé dans une feuille d'hypothèses permet de tout recalculer sans erreur.</p>`
    },
    {
      kind: 'sheet',
      id: 'diagnostic-logistique',
      title: 'Exercice 2 : diagnostic des moyens logistiques',
      skill: 'Démarrage du projet',
      intro: "Au démarrage, l'inventaire du bureau d'Akoupé donne le tableau ci-dessous. Complétez l'écart, le taux de couverture, le coût de l'écart et le statut de chaque moyen, puis le coût total de l'écart.",
      rules: "<p>Écart = requis − disponible (jamais négatif). Taux de couverture = disponible ÷ requis (plafonné à 100 %). Coût de l'écart = écart × prix unitaire. Statut : <strong>Couvert</strong> si disponible ≥ requis et mode « Existant » ; <strong>Partiellement couvert</strong> si 0 &lt; disponible &lt; requis ; <strong>Non couvert</strong> si disponible = 0 ; <strong>Incohérent</strong> si le mode contredit la situation (couvert mais « À acquérir », ou manque constaté mais « Existant »).</p>",
      tables: [{
        columns: ['Moyen', 'Requis', 'Disponible', 'Mode d\'obtention', 'Prix unitaire', 'Écart', 'Taux de couverture (%)', 'Coût de l\'écart (FCFA)', 'Statut'],
        rows: [
          ...LOG.map(([m, req, dispo, mode, pu], i): SheetCell[] => [
            m, num(req), num(dispo), mode, num(pu, 'fcfa'),
            inp(`e${i}`, Math.max(0, req - dispo)),
            inp(`t${i}`, r1(Math.min(100, (dispo / req) * 100)), 'pct'),
            inp(`c${i}`, Math.max(0, req - dispo) * pu, 'fcfa'),
            pick(`s${i}`, statutOf(req, dispo, mode), STATUTS)
          ]),
          ['Coût total de l\'écart', '', '', '', '', '', '', inp('total', ecartTotal, 'fcfa'), '']
        ]
      }],
      explanation: "<p>Les deux statuts « Incohérent » ne signalent pas un manque mais une erreur de saisie : on corrige le mode d'obtention (les trousses existent déjà ; les armoires sont à acquérir). Le transport et l'informatique concentrent l'essentiel du coût de l'écart : ce sont les achats à budgéter en premier.</p>"
    },
    {
      kind: 'sheet',
      id: 'plan-de-charge',
      title: 'Exercice 3 : plan de charge du mois 1',
      skill: 'Management des équipes',
      intro: "Le mois 1 compte 22 jours ouvrés. Chaque membre de l'équipe a 2 jours de congés ou d'absences et 2 jours de réunions et de coordination. Calculez la capacité utile, puis le taux de charge et sa lecture pour chaque poste. Indiquez enfin le levier à utiliser en premier et le poste qui peut recevoir une tâche.",
      rules: "<p>Capacité utile = jours ouvrés − absences − coordination. Taux de charge = charge prévue ÷ capacité utile. Lecture : sous-charge en dessous de 60 % ; équilibré de 60 à 90 % ; tendu de 91 à 100 % ; surcharge au-delà de 100 %. Leviers, dans l'ordre : décaler, déléguer, mutualiser, renforcer.</p>",
      tables: [
        { title: 'Capacité', columns: ['Élément', 'Jours'], rows: [['Jours ouvrés', num(22)], ['Congés et absences', num(2)], ['Réunions et coordination', num(2)], ['Capacité utile par personne', inp('capa', CAPA)]] },
        {
          title: 'Taux de charge du mois 1',
          columns: ['Poste', 'Charge prévue (jours)', 'Taux de charge (%)', 'Lecture'],
          rows: CHARGE.map(([p, c], i) => [p, num(c), inp(`t${i}`, r1((c / CAPA) * 100), 'pct'), pick(`l${i}`, lectureOf((c / CAPA) * 100), LECTURES)])
        },
        {
          title: 'Décision',
          columns: ['Question', 'Réponse'],
          rows: [
            ['Premier levier à utiliser pour le poste en surcharge', pick('levier', 'Décaler', ['Décaler', 'Déléguer', 'Mutualiser', 'Renforcer'])],
            ['Poste le moins chargé, qui peut recevoir une tâche', pick('receveur', 'Animateur communautaire 1', CHARGE.map(([p]) => p))]
          ]
        }
      ],
      explanation: "<p>Le chargé de projet est en surcharge (111 %) au mois 1, à cause de l'impression des supports et de la logistique du démarrage. Avant de demander un renfort, on décale ce qui n'est pas bloquant (par exemple avancer l'impression au mois précédent ou la répartir), puis on délègue à l'animateur 1, qui garde de la marge (67 %). Les postes « tendus » (chef de mission, spécialiste) ne doivent rien recevoir de plus.</p>"
    },
    {
      kind: 'sheet',
      id: 'matrice-eisenhower',
      title: 'Exercice 4 : matrice d\'Eisenhower révisée',
      skill: 'Priorités de la semaine',
      intro: "Lundi matin, l'équipe liste les tâches de la semaine. Pour chacune, déterminez l'urgence (en appliquant la règle de blocage), le quadrant et la décision.",
      rules: "<p>Urgence : 1 si l'échéance est à plus de 15 jours ; 2 de 3 à 15 jours ; 3 à moins de 3 jours. Une tâche qui bloque un collègue gagne un niveau d'urgence (au maximum 3). Quadrant : 1 si importance 2 ou 3 et urgence 2 ou 3 ; 2 si importance 2 ou 3 et urgence 1 ; 3 si importance 1 et urgence 2 ou 3 ; 4 si importance 1 et urgence 1. <strong>Règle de sécurité</strong> : toute tâche qui protège une personne passe au quadrant 1, quel que soit le calcul. Décisions : 1 faire maintenant ; 2 planifier ; 3 déléguer ou décliner ; 4 éliminer ou reporter.</p>",
      tables: [{
        columns: ['Tâche', 'Importance', 'Échéance (jours)', 'Bloque un collègue', 'Sécurité d\'une personne', 'Urgence', 'Quadrant', 'Décision'],
        rows: TASKS.map(([t, imp, days, blocks, safety], i) => {
          const urg = urgOf(days, blocks), quad = quadOf(imp, urg, safety);
          return [t, num(imp), num(days), blocks ? 'Oui' : 'Non', safety ? 'Oui' : 'Non',
            pick(`u${i}`, String(urg), ['1', '2', '3']), pick(`q${i}`, String(quad), ['1', '2', '3', '4']), pick(`d${i}`, DECISIONS[quad - 1], DECISIONS)];
        })
      }],
      explanation: "<p>Deux pièges : la validation des maquettes (urgence 2 au départ) passe en urgence 3 parce qu'elle bloque l'impression ; la visite du quartier après un incident de sécurité a une échéance lointaine (urgence 1) mais passe au quadrant 1 par la règle de sécurité. Les tâches du quadrant 1 reçoivent un responsable avant la fin de la journée, celles du quadrant 2 une date.</p>"
    },
    {
      kind: 'sheet',
      id: 'tableau-de-bord',
      title: 'Exercice 5 : tableau de bord des indicateurs à mi-parcours',
      skill: 'Suivi-évaluation',
      intro: "Nous sommes à la fin du mois 3 : la moitié de la mission est écoulée. Calculez le taux d'atteinte de chaque indicateur et son appréciation, puis les indicateurs de qualité du MGP.",
      rules: "<p>Taux d'atteinte = réalisé ÷ cible de fin de mission. À mi-parcours : <strong>dans la trajectoire</strong> si le taux est d'au moins 50 % ; <strong>léger retard</strong> de 35 à 49 % ; <strong>retard important</strong> en dessous de 35 %. Pour les indicateurs du MGP : taux = numérateur ÷ dénominateur ; écart à la cible en points = valeur − cible.</p>",
      tables: [
        {
          title: 'Indicateurs d\'activités',
          columns: ['Indicateur', 'Cible fin M6', 'Réalisé fin M3', 'Taux d\'atteinte (%)', 'Appréciation'],
          rows: IND.map(([n, c, r], i) => [n, num(c), num(r), inp(`t${i}`, r1((r / c) * 100), 'pct'), pick(`a${i}`, trajOf((r / c) * 100), TRAJ)])
        },
        {
          title: 'Indicateurs de qualité du MGP',
          columns: ['Indicateur', 'Données', 'Valeur (%)', 'Cible (%)', 'Écart à la cible (points)'],
          rows: [
            ['Plaintes ordinaires traitées dans les délais', '18 sur 20 plaintes reçues', inp('mgp1', 90, 'pct'), num(90, 'pct'), inp('mgp1e', 0, 'n', 0.6)],
            ['Plaintes sensibles transmises à l\'UCP sous 24 heures', '3 sur 3', inp('mgp2', 100, 'pct'), num(100, 'pct'), inp('mgp2e', 0, 'n', 0.6)],
            ['Notoriété du MGP (enquête de mi-parcours)', '252 personnes sur 400 citent au moins un canal', inp('mgp3', 63, 'pct'), num(80, 'pct'), inp('mgp3e', -17, 'n', 0.6)]
          ]
        }
      ],
      explanation: "<p>Les points focaux sont déjà tous formés : c'est une activité de démarrage, normalement en avance. Le théâtre-forum et les sessions avec les travailleurs sont en retard important : il faut les replanifier tout de suite. La notoriété du MGP (63 %) est loin de la cible de 80 % : renforcer l'annonce des canaux (crieur public, radio, affiches, points focaux) avant l'enquête finale.</p>"
    },
    {
      kind: 'sheet',
      id: 'suivi-budgetaire',
      title: 'Exercice 6 : suivi budgétaire à la fin du mois 3',
      skill: 'Pilotage budgétaire',
      intro: "Voici les dépenses réellement payées sur six lignes d'activités pendant les trois premiers mois. Complétez le tableau de suivi, puis la synthèse.",
      rules: "<p>Total dépensé = M1 + M2 + M3. Solde = budget − total dépensé (il peut être négatif). Taux d'exécution = total dépensé ÷ budget. Situation : <strong>OK</strong> en dessous de 80 % ; <strong>Attention</strong> de 80 à 100 % ; <strong>Dépassé</strong> au-delà de 100 %. Rythme : comparer le taux global à la part du temps écoulé (50 %) ; au-delà de 15 points d'écart, le rythme est trop rapide ou trop lent.</p>",
      tables: [
        {
          title: 'Suivi par ligne (FCFA)',
          columns: ['Ligne', 'Budget', 'M1', 'M2', 'M3', 'Total dépensé', 'Solde', 'Taux (%)', 'Situation'],
          rows: BUD.map(([l, b, m1, m2, m3], i) => {
            const s = m1 + m2 + m3, rate = (s / b) * 100;
            return [l, num(b, 'fcfa'), num(m1, 'fcfa'), num(m2, 'fcfa'), num(m3, 'fcfa'),
              inp(`s${i}`, s, 'fcfa'), inp(`r${i}`, b - s, 'fcfa'), inp(`t${i}`, r1(rate), 'pct'), pick(`x${i}`, situationOf(rate), SITUATIONS)];
          })
        },
        {
          title: 'Synthèse',
          columns: ['Élément', 'Réponse'],
          rows: [
            ['Budget total des six lignes (FCFA)', inp('bt', budTotal, 'fcfa')],
            ['Total dépensé (FCFA)', inp('st', spentTotal, 'fcfa')],
            ['Taux d\'exécution global (%)', inp('tg', rateTotal, 'pct')],
            ['Écart avec la part du temps écoulé (points)', inp('ecart', r1(rateTotal - 50), 'n', 0.6)],
            ['Rythme des dépenses', pick('rythme', rythmeOf(rateTotal, 50), RYTHMES)]
          ]
        }
      ],
      explanation: "<p>La cérémonie de lancement est dépassée de 35 000 FCFA : il faut le justifier et le compenser. Le théâtre-forum a consommé 82 % de son budget pour une seule séance sur quatre : le coût unitaire réel est très supérieur à la prévision, à analyser avant les séances suivantes. Globalement, les dépenses vont trop vite (plus de 70 % pour 50 % du temps) : on revoit les gros postes et on prépare, si besoin, une demande de transfert justifiée à l'UCP.</p>"
    },
    {
      kind: 'writing',
      id: 'comprehension-tdr',
      title: 'Rédaction 1 : la compréhension de la mission',
      skill: 'Offre technique',
      prompt: "<p>À partir des termes de référence du dossier, rédigez la section « Compréhension du contexte et de la mission » de votre offre technique (10 à 15 lignes). Montrez que vous avez compris les enjeux, la zone et les bénéficiaires, les deux missions, les résultats attendus, les contraintes et les livrables, sans recopier les TDR.</p>",
      minWords: 90,
      criteria: [
        { label: 'Le contexte et les enjeux du projet (travaux, cadre de vie, aspects sociaux)', keywords: ['cadre de vie', 'travaux', 'chantier', 'aspects sociaux', 'acceptation', 'enjeu', 'nuisance'] },
        { label: 'La zone et les bénéficiaires (quartiers, femmes, jeunes, groupes vulnérables)', keywords: ['quartier', 'akoupe', 'beneficiair', 'femme', 'jeune', 'vulnerab', 'population', 'habitant'] },
        { label: 'La mission 1 : animation et mobilisation communautaire', keywords: ['animation', 'mobilisation', 'sensibilis', 'causerie', 'evenement', 'radio', 'theatre'] },
        { label: 'La mission 2 : gestion des plaintes et prévention des violences', keywords: ['plainte', 'mgp', 'vbg', 'violence', 'eas$', 'harcelement', 'referencement'] },
        { label: 'Les résultats attendus et les indicateurs (notoriété, satisfaction, 80 %)', keywords: ['notoriete', 'satisfaction', '80', 'indicateur', 'cible', 'resultat'] },
        { label: 'Les contraintes ou les risques (pluies, délai de 24 heures, confidentialité, durée courte)', keywords: ['contrainte', 'risque', 'pluie', '24', 'confidential', 'six mois', '6 mois', 'delai'] },
        { label: 'Les livrables (rapport de démarrage, rapports mensuels, rapport final)', keywords: ['rapport', 'livrable', 'demarrage', 'mensuel', 'final', 'enquete'] }
      ],
      model: "<p>Les travaux du PGC-Vie améliorent le cadre de vie d'Akoupé, mais ils bousculent le quotidien des cinq quartiers ciblés : nuisances, circulation, présence de travailleurs de chantier. Leur réussite dépend de l'acceptation sociale du projet et de la confiance des habitants, en particulier des femmes, des jeunes et des personnes vulnérables, plus exposées aux risques d'exploitation, d'abus et de harcèlement sexuels.</p><p>Notre mission poursuit deux axes. Le premier mobilise les communautés : cartographie des acteurs, causeries mensuelles dans chaque quartier, émissions radio, théâtre-forum, six événements et appui au comité communal de liaison. Le second rend le mécanisme de gestion des plaintes accessible et fiable : cinq boîtes à plaintes, traitement des plaintes ordinaires dans les délais, transmission des plaintes sensibles à l'UCP sous 24 heures et référencement des survivant(e)s, formation des comités et de 30 points focaux.</p><p>Les résultats seront mesurés par une notoriété du MGP et une satisfaction des plaignants d'au moins 80 %. Nous tiendrons compte de contraintes fortes : six mois seulement, saison des pluies, confidentialité absolue des plaintes sensibles. Nous remettrons un rapport de démarrage, des rapports mensuels, deux enquêtes et un rapport final avec restitution.</p>"
    },
    {
      kind: 'writing',
      id: 'note-delegation',
      title: 'Rédaction 2 : la note de délégation',
      skill: 'Délégation',
      prompt: "<p>Vous êtes chef de mission. Rédigez la note par laquelle vous déléguez la rédaction du rapport trimestriel au chargé de projet, dont la charge est déjà à 120 %. Votre note doit être complète.</p>",
      minWords: 70,
      criteria: [
        { label: "L'objectif et le livrable attendu", keywords: ['objectif', 'livrable', 'rapport trimestriel', 'attendu'] },
        { label: 'Le délai et les étapes', keywords: ['delai', 'date', 'echeance', 'etape', 'avant le', 'au plus tard', 'jalon', 'version provisoire'] },
        { label: 'Les moyens et les appuis', keywords: ['moyen', 'donnee', 'appui', 'acces', 'outil', 'ressource', 'aide'] },
        { label: 'La tâche retirée en échange', keywords: ['retir', 'decharg', 'allege', 'reporte', 'suspend', 'en echange', 'a la place', 'confie a', 'reprend'] },
        { label: "Le niveau d'autonomie", keywords: ['autonomie', 'niveau', 'marge de manoeuvre', 'tu decides', 'vous decidez', 'valider'] },
        { label: "Le point d'étape et le mode de retour", keywords: ['point d etape', 'point intermediaire', 'faire le point', 'reunion de suivi', 'relecture', 'point le', 'retour'] },
        { label: "L'information de l'équipe", keywords: ['equipe', 'informe', 'annonce', 'prevenir'] }
      ],
      model: "<p><strong>Objet : délégation de la rédaction du rapport trimestriel.</strong></p><p>Je te confie la rédaction du rapport trimestriel destiné à l'UCP (livrable : rapport de 15 pages au format standard, avec le tableau des indicateurs). Délai : version provisoire le 20, version finale le 27. Pour t'en donner le temps, je reprends la préparation de la séance du comité communal de liaison et l'animateur 1 assure la distribution des supports ce mois-ci. Tu disposes des fiches mensuelles, de la base KoboToolbox et de l'appui de la spécialiste pour la partie MGP (elle te fournit ses données le 15). Niveau d'autonomie 3 : tu rédiges et tu choisis la présentation, je valide avant l'envoi. Point d'étape le 18 à 10 h, relecture ensemble le 21. J'informe l'équipe de cette organisation à la réunion de lundi, et le rapport sera signé de nos deux noms.</p>"
    },
    {
      kind: 'writing',
      id: 'entretien-sci',
      title: 'Rédaction 3 : l\'entretien SCI',
      skill: 'Retour d\'information',
      prompt: "<p>L'animateur communautaire 2, chargé des quartiers éloignés, arrive en retard et rend des fiches incomplètes depuis deux semaines, après qu'on a refusé devant l'équipe de le remplacer sur une sortie lointaine. Rédigez votre entretien individuel avec lui en utilisant la méthode SCI : cadre posé, situation, comportement, impact, écoute de son besoin, reconnaissance de votre part et engagements.</p>",
      minWords: 80,
      criteria: [
        { label: 'Un cadre posé : en privé, dans l\'écoute, sans jugement', keywords: ['prive', 'ecoute', 'confidentiel', 'sans jugement', 'entre nous', 'tete a tete', 'calme'] },
        { label: 'La situation datée', keywords: ['semaine', 'depuis', 'mardi', 'lundi', 'jeudi', 'date', 'derniere', 'mois'] },
        { label: 'Le comportement décrit par des faits', keywords: ['retard', 'fiche', 'incomplet', 'absence', 'absent', 'manque'] },
        { label: "L'impact sur l'équipe ou la qualité des données", keywords: ['impact', 'consequence', 'qualite', 'donnee', 'equipe', 'ucp', 'rapport'] },
        { label: 'L\'écoute de son besoin', keywords: ['besoin', 'fatigue', 'difficulte', 'qu est ce qui', 'comment', 'pourquoi', 'surcharge', 'ressens', 'eloign'] },
        { label: 'La reconnaissance de votre part de responsabilité', keywords: ['je reconnais', 'ma part', 'j aurais du', 'aurais du', 'mon erreur', 'excuse', 'desole', 'je regrette'] },
        { label: 'Des engagements précis et datés', keywords: ['engag', 'ajust', 'rotation', 'remplac', 'nous convenons', 'nous allons', 'prochain point', 'a partir de'] }
      ],
      model: "<p>« Merci d'avoir pris ce moment. Nous sommes entre nous, je suis là pour comprendre, pas pour juger. Depuis deux semaines, tu es arrivé trois fois en retard et plusieurs fiches de collecte m'ont été remises sans l'âge ni le quartier. Résultat : nous ne pouvons pas désagréger les données que l'UCP nous demande, et l'équipe s'inquiète. Qu'est-ce qui se passe pour toi ? […] Je comprends que les sorties vers les quartiers éloignés, avec la même indemnité que les autres, t'épuisent. Je reconnais aussi que j'ai eu tort de refuser ta demande devant tout le monde, sans t'écouter. Voici ce que je te propose : dès la semaine prochaine, une rotation des sorties lointaines entre les deux animateurs, un barème d'indemnités selon la distance, et une fiche simplifiée avec les champs obligatoires. De ton côté, tu t'engages à remettre des fiches complètes et à me prévenir dès qu'une difficulté apparaît. Nous refaisons le point le 15 ensemble. »</p>"
    },
    {
      kind: 'writing',
      id: 'regle-repartition',
      title: 'Rédaction 4 : la règle de répartition des sorties',
      skill: 'Équité dans l\'équipe',
      prompt: "<p>Les deux animateurs reçoivent la même indemnité, alors que l'un accompagne les visites de l'UCP et que l'autre fait les sorties les plus longues. Rédigez la règle écrite de répartition équitable des sorties et des indemnités de l'équipe.</p>",
      minWords: 60,
      criteria: [
        { label: 'Des critères objectifs (distance, durée, difficulté, visibilité)', keywords: ['distance', 'duree', 'difficulte', 'visibilite', 'eloign', 'kilometre'] },
        { label: 'Une rotation des sorties', keywords: ['rotation', 'tour de role', 'altern', 'tournant', 'chacun son tour', 'a tour'] },
        { label: 'Un calcul identique des indemnités (barème)', keywords: ['bareme', 'identique', 'meme calcul', 'meme taux', 'par kilometre', 'forfait', 'grille'] },
        { label: 'La transparence (affichage, planning partagé)', keywords: ['affich', 'transparen', 'partage', 'connu de tous', 'publie', 'planning'] },
        { label: 'Une revue régulière', keywords: ['mensuel', 'chaque mois', 'revue', 'revis', 'bilan'] },
        { label: 'Une voie de recours en cas de désaccord', keywords: ['recours', 'desaccord', 'reclamation', 'contest', 'mediation'] }
      ],
      model: "<p><strong>Règle de répartition des sorties et des indemnités (équipe PGC-Vie).</strong></p><ol><li>Chaque sortie est classée selon quatre critères : distance, durée, difficulté d'accès et visibilité auprès de l'UCP ou des autorités.</li><li>Les sorties lointaines et les accompagnements de l'UCP sont attribués par rotation entre les animateurs, selon un planning mensuel.</li><li>Les indemnités suivent un barème identique pour tous : un forfait de base plus un montant par tranche de distance.</li><li>Le planning et le barème sont affichés au bureau et partagés avec l'équipe.</li><li>La répartition est revue chaque mois au bilan mensuel.</li><li>En cas de désaccord, l'agent en parle d'abord au chef de mission sous 48 heures ; à défaut, une médiation est organisée au point hebdomadaire.</li></ol>"
    },
    {
      kind: 'writing',
      id: 'plan-action-correctif',
      title: 'Rédaction 5 : le plan d\'action correctif de la supervision',
      skill: 'Supervision',
      prompt: "<p>La supervision du mois 4 a relevé : 300 participants rapportés pour les causeries du quartier 3 mais seulement 240 noms sur les listes de présence ; des fiches sans âge ni sexe ; une boîte à plaintes installée dans la cour d'un leader, peu accessible aux femmes ; 6 pièces justificatives manquantes sur 40 ; 3 recommandations de la supervision précédente non mises en œuvre. Rédigez le plan d'action correctif : pour chaque constat, une mesure, un responsable et une échéance.</p>",
      minWords: 80,
      criteria: [
        { label: 'La correction des données surdéclarées', keywords: ['liste de presence', 'surdeclar', 'ecart', '240', '300', 'corrig', 'rectif'] },
        { label: 'La désagrégation (âge et sexe obligatoires)', keywords: ['age$', 'ages$', 'sexe', 'obligatoire', 'desagreg', 'champ'] },
        { label: 'Le déplacement de la boîte à plaintes', keywords: ['boite', 'deplac', 'accessible', 'neutre', 'femme', 'lieu', 'emplacement'] },
        { label: 'La régularisation des pièces justificatives', keywords: ['piece', 'justificatif', 'classer', 'dossier', 'complet', 'regularis'] },
        { label: 'Le suivi des recommandations antérieures', keywords: ['recommandation', 'anterieur', 'precedent', 'mise en oeuvre', 'suivi des recommandations'] },
        { label: 'Un responsable pour chaque mesure', keywords: ['responsable', 'chef de mission', 'charge de projet', 'specialiste', 'animateur', 'point focal'] },
        { label: 'Une échéance pour chaque mesure', keywords: ['echeance', 'delai', 'avant le', 'd ici', 'semaine', 'jours', 'fin du mois', 'date'] }
      ],
      model: "<ol><li><strong>Données du quartier 3</strong> : corriger le chiffre rapporté à 240 participants d'après les listes de présence, informer l'UCP de la rectification et vérifier les autres quartiers par échantillon. Responsable : chargé de projet. Échéance : sous 5 jours.</li><li><strong>Fiches sans âge ni sexe</strong> : rendre ces champs obligatoires dans le formulaire KoboToolbox et former les collecteurs en une heure. Responsable : chargé de projet. Échéance : avant la fin de la semaine.</li><li><strong>Boîte à plaintes du quartier 5</strong> : la déplacer dans un lieu neutre, sûr et accessible aux femmes (centre de santé, marché), choisi avec le comité de quartier. Responsable : spécialiste VBG/MGP. Échéance : sous 10 jours.</li><li><strong>Pièces justificatives</strong> : retrouver et classer les 6 pièces manquantes, sinon justifier par écrit. Responsable : appui comptable. Échéance : fin du mois.</li><li><strong>Recommandations antérieures</strong> : inscrire les 3 recommandations restantes au tableau de suivi avec une date ferme et en faire le point à chaque réunion hebdomadaire. Responsable : chef de mission. Échéance : 15 jours.</li></ol>"
    }
  ]
};

export default set;
