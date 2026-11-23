// Travaux pratiques de la certification « Management et pilotage communautaire de projets ».
// Dossier reconstitué à partir des documents du cas PGC-Vie (offre financière, classeurs de suivi budgétaire,
// supports de formation du CICEXF). Situation fictive construite pour la formation ; aucun nom de personne.
// Les réponses attendues sont calculées ici à partir des données, pour éviter toute erreur de calcul.
import type { Ctx, PracticeSet, SheetCell, Fmt } from '../practice';

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

// Chronogramme de la mission (mois 1 à 6) : sert au dossier, au tableau de bord et au suivi budgétaire
const CHRONO: [string, number[]][] = [
  ['Réunion de lancement avec l\'UCP et les autorités', [1]],
  ['Production et distribution des supports', [1]],
  ['Installation du MGP (boîtes à plaintes, registres, annonce des canaux)', [1]],
  ['Formation des comités et des points focaux', [1, 2]],
  ['Émissions radio (une par mois)', [1, 2, 3, 4, 5, 6]],
  ['Causeries éducatives (une par mois dans chaque quartier)', [1, 2, 3, 4, 5, 6]],
  ['Sessions de sensibilisation des travailleurs (deux par mois)', [1, 2, 3, 4, 5, 6]],
  ['Cérémonie officielle de lancement', [2]],
  ['Focus groups et réunions du comité de gestion des plaintes', [2, 4, 6]],
  ['Tournoi sportif communautaire', [3]],
  ['Séances de théâtre-forum (deux par mois prévu)', [3, 5]],
  ['Enquêtes de notoriété et de satisfaction du MGP', [3, 6]],
  ['Journée culturelle et concours artistique', [4]],
  ['Journée de nettoyage et d\'embellissement', [5]],
  ['Consultations publiques, événement de clôture et rapport final', [6]]
];
/** Part d'une activité (ou d'un budget) prévue jusqu'à la fin d'un mois, d'après ses mois de réalisation */
const shareAt = (months: number[], upTo: number) => months.filter((m) => m <= upTo).length / months.length;
const monthsText = (months: number[]) => (months.length === 6 ? 'M1 à M6' : months.map((m) => `M${m}`).join(', '));

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
<h3>Chronogramme des activités</h3>
${table(['Activité', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'], CHRONO.map(([a, months]) => [a, ...[1, 2, 3, 4, 5, 6].map((m) => (months.includes(m) ? '■' : ''))]))}
<p>Une activité prévue sur un seul mois doit être entièrement réalisée (et sa dépense engagée) ce mois-là ; une activité répartie sur plusieurs mois se réalise au même rythme chacun de ses mois.</p>
<h3>8. Moyens à mobiliser</h3>
<p>Les quatre agents de terrain (chef de mission, spécialiste VBG/MGP, chargé de projet et animateur communautaire 2) disposent chacun d'une moto avec casque et d'un smartphone de service. Chaque membre de l'équipe, appui comptable compris, travaille sur un ordinateur portable. Les 30 points focaux reçoivent chacun un kit (sac, chasuble, carnet, fiches du MGP) et partagent des tablettes pour la collecte, à raison d'une tablette pour trois points focaux. Une boîte à plaintes est installée dans chaque quartier ciblé. Les archives et le registre confidentiel des plaintes sensibles sont conservés dans deux armoires sécurisées distinctes. Une trousse de premiers secours est gardée au bureau et une autre accompagne les déplacements.</p>
<h3>9. Contraintes connues</h3>
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
<h3>5. Prix unitaires retenus pour les équipements (devis)</h3>
${table(['Équipement', 'Prix unitaire'], [
  ['Moto 125 cc tout-terrain', fcfa(550000)], ['Casque de moto homologué', fcfa(25000)], ['Smartphone de service', fcfa(45000)],
  ['Ordinateur portable (Core i5, 8 Go)', fcfa(630000)], ['Tablette Android pour KoboToolbox', fcfa(85000)],
  ['Kit de point focal (sac, chasuble, carnet, fiches)', fcfa(15000)], ['Boîte à plaintes métallique avec cadenas', fcfa(35000)],
  ['Armoire métallique sécurisée à serrure', fcfa(95000)], ['Trousse de premiers secours', fcfa(20000)]
])}
<h3>6. Hypothèses</h3>
<ul>
<li>Durée de la mission : 6 mois ; 5 quartiers ciblés ; 30 points focaux et 30 membres de comités à former.</li>
<li>Charges patronales : 16,5 % du salaire brut ; frais de gestion : 10 % des coûts directs ; TVA : 18 % (à retirer si l'ONG n'est pas assujettie).</li>
<li>Le matériel déjà détenu par l'ONG est mis à disposition sans être facturé.</li>
<li>Point à aligner : 12 sessions de sensibilisation des travailleurs dans l'offre technique, 6 dans le cadre logique.</li>
</ul>
`;


const DOSSIER_DICTIONNAIRE = `
<p>Le dictionnaire précise, pour chaque indicateur, ce qu'il mesure exactement et comment on le renseigne. Deux personnes doivent obtenir la même valeur en l'appliquant.</p>
${table(['Indicateur', 'Définition et mode de calcul', 'Source de vérification', 'Fréquence', 'Responsable', 'Désagrégation', 'Cible'], [
  ['Causeries éducatives réalisées', 'Nombre de causeries tenues avec un compte rendu et une liste de présence (somme des mois)', 'Rapports de causerie, listes de présence', 'Mensuelle', 'Animateurs communautaires', 'Quartier ; sexe et âge des participants', '30'],
  ['Émissions radio diffusées', 'Nombre d\'émissions passées à l\'antenne', 'Attestations de diffusion de la radio', 'Mensuelle', 'Chef de mission', 'Langue (français, langue locale)', '6'],
  ['Points focaux formés et équipés', 'Nombre de points focaux ayant suivi toute la formation et reçu leur kit', 'Listes de présence, fiches de remise des kits', 'À chaque formation', 'Spécialiste VBG/MGP', 'Sexe, quartier', '30'],
  ['Séances de théâtre-forum', 'Nombre de séances tenues', 'Rapports de séance, photos (avec consentement)', 'Mensuelle', 'Animateur communautaire 2', 'Quartier', '4'],
  ['Sessions de sensibilisation des travailleurs', 'Nombre de sessions tenues sur les chantiers', 'Listes de présence des travailleurs', 'Mensuelle', 'Spécialiste VBG/MGP', 'Chantier, sexe', '12'],
  ['Membres des comités formés', 'Nombre de membres ayant suivi les deux jours de formation', 'Listes de présence, tests avant et après', 'À chaque formation', 'Spécialiste VBG/MGP', 'Sexe, comité', '30'],
  ['Plaintes ordinaires traitées dans les délais', 'Plaintes ordinaires clôturées dans le délai fixé ÷ plaintes ordinaires reçues × 100', 'Registre du MGP', 'Mensuelle', 'Spécialiste VBG/MGP', 'Quartier, type de plainte, sexe du plaignant', '90 %'],
  ['Plaintes sensibles transmises à l\'UCP sous 24 heures', 'Plaintes sensibles transmises sous 24 heures ÷ plaintes sensibles reçues × 100', 'Registre confidentiel (aucune donnée nominative rapportée)', 'Mensuelle', 'Spécialiste VBG/MGP', 'Aucune désagrégation nominative', '100 %'],
  ['Notoriété du MGP', 'Personnes enquêtées citant au moins un canal du MGP ÷ personnes enquêtées × 100', 'Enquête de notoriété', 'Mi-parcours (M3) et fin de mission (M6)', 'Chargé de projet', 'Sexe, âge, quartier', 'au moins 80 %']
])}
`;

// ---------------------------------------------------------------------------------------------
// Exercice 1 : recalculer l'offre financière

const LINES1: [string, number, number][] = [
  ['Causeries éducatives dans les quartiers', 30, 20000],
  ['Formation des comités : indemnités (2 jours)', 60, 8000],
  ['Carburant des motos (litres)', 600, 900],
  ['Séances de théâtre-forum', 4, 250000]
];

// Exercice 2 : diagnostic logistique. Les quantités requises se déduisent des TDR (section « Moyens à mobiliser »),
// les quantités disponibles de l'inventaire donné dans l'énoncé, les prix unitaires des devis de l'offre financière.
const LOG: [string, number, number, number][] = [
  ['Motos 125 cc', 4, 1, 550000],
  ['Smartphones de service', 4, 0, 45000],
  ['Ordinateurs portables', 6, 2, 630000],
  ['Tablettes pour KoboToolbox', 10, 0, 85000],
  ['Kits des points focaux', 30, 0, 15000],
  ['Boîtes à plaintes', 5, 0, 35000],
  ['Armoires sécurisées', 2, 1, 95000],
  ['Trousses de premiers secours', 2, 2, 20000]
];
const MODES = ['Existant', 'À acquérir', 'Location', 'Mise à disposition par un partenaire'];
const statutOf = (req: number | null, dispo: number | null, mode: string): string | null => {
  if (req === null || dispo === null || !mode || req <= 0) return null;
  if (dispo >= req) return mode === 'À acquérir' ? 'Incohérent' : 'Couvert';
  if (mode === 'Existant') return 'Incohérent';
  return dispo <= 0 ? 'Non couvert' : 'Partiellement couvert';
};
const ecartOf = (c: Ctx, i: number) => {
  const req = c.num(`q${i}`), dispo = c.num(`d${i}`);
  return req === null || dispo === null ? null : Math.max(0, req - dispo);
};

// Exercice 3 : plan de charge sur quatre mois. Pour chaque activité, l'apprenant choisit le poste responsable (et
// éventuellement un poste d'appui) dans une liste, puis le nombre de jours de travail de chacun, mois par mois.
const POSTES = [
  'Chef de mission', 'Chargé de projet', 'Spécialiste VBG/MGP', 'Animateur communautaire 1', 'Animateur communautaire 2',
  'Appui comptable', 'Animateur bénévole 1', 'Animateur bénévole 2', 'Animateur bénévole 3', 'Animateur bénévole 4'
];
const BENEVOLES = [6, 7, 8, 9];
const MOIS = [1, 2, 3, 4];
/** Disponibilité mensuelle donnée dans l'énoncé : jours disponibles, congés ou absences, réunions et coordination */
const DISPO: [number, number, number][] = [[22, 2, 2], [22, 0, 2], [22, 1, 2], [22, 2, 1], [22, 1, 1], [11, 0, 1], [10, 0, 1], [10, 0, 1], [10, 0, 1], [10, 0, 1]];
/** Activité, charge prévue en jours pour les mois 1 à 4 */
const ACTS: [string, number[]][] = [
  ['Pilotage, supervision et rapports', [8, 6, 6, 6]],
  ['Cartographie des acteurs', [6, 2, 0, 0]],
  ['Production et distribution des supports', [10, 4, 2, 2]],
  ['Logistique, achats et suivi budgétaire', [8, 5, 5, 5]],
  ['Installation et fonctionnement du MGP (plaintes)', [9, 8, 8, 8]],
  ['Formation des comités et des points focaux', [6, 10, 2, 0]],
  ['Causeries dans les cinq quartiers', [10, 10, 10, 10]],
  ['Événements communautaires (lancement, tournoi, journée culturelle)', [6, 12, 10, 10]],
  ['Émissions radio et comité communal de liaison', [5, 5, 5, 5]],
  ['Comptabilité et justificatifs', [6, 6, 6, 6]]
];
const MGP_ACT = 4, COMPTA_ACT = 9;
const ROLES = ['Responsable', 'Appui (facultatif)'];
const LECTURES = ['Sous-charge', 'Équilibré', 'Tendu', 'Surcharge'];
const lectureOf = (t: number) => (t < 60 ? 'Sous-charge' : t <= 90 ? 'Équilibré' : t <= 100 ? 'Tendu' : 'Surcharge');
const cell0 = (c: Ctx, id: string) => c.num(id) ?? 0;
const workedOf = (c: Ctx, p: number) => {
  const o = c.num(`o${p}`), a = c.num(`c${p}`), r = c.num(`r${p}`);
  return o === null ? null : o - (a ?? 0) - (r ?? 0);
};
/** Jours affectés à un poste pour un mois, sur toutes les lignes où ce poste est choisi */
const chargeOf = (c: Ctx, p: number, m: number) =>
  ACTS.reduce((n, _a, i) => n + ROLES.reduce((k, _r, j) => k + (c.text(`p${i}${j}`) === POSTES[p] ? cell0(c, `d${i}${j}m${m}`) : 0), 0), 0);
const rateOf = (c: Ctx, p: number, m: number) => {
  const w = workedOf(c, p);
  return w && w > 0 ? (chargeOf(c, p, m) / w) * 100 : null;
};
/** Jours affectés à une activité pour un mois (seules les lignes avec un poste choisi comptent) */
const assignedOf = (c: Ctx, i: number, m: number) => ROLES.reduce((k, _r, j) => k + (c.text(`p${i}${j}`) ? cell0(c, `d${i}${j}m${m}`) : 0), 0);
const anyAssigned = (c: Ctx) => ACTS.some((_a, i) => MOIS.some((m) => assignedOf(c, i, m) > 0));
/** Poste dont le taux de charge du mois est le plus haut (dir = 1) ou le plus bas (dir = -1) */
const extremeOf = (c: Ctx, m: number, dir: 1 | -1) => {
  if (!anyAssigned(c)) return null;
  const rates = POSTES.map((_p, p) => rateOf(c, p, m));
  if (rates.some((r) => r === null)) return null;
  let best = 0;
  rates.forEach((r, p) => { if ((r! - rates[best]!) * dir > 0) best = p; });
  return POSTES[best];
};
/** Exemple de répartition (pour les tests et l'affichage administrateur) : [poste, jours M1..M4] par ligne */
const SAMPLE3: [number, number[]][][] = [
  [[0, [8, 6, 6, 6]]],
  [[0, [2, 2, 0, 0]], [6, [4, 0, 0, 0]]],
  [[1, [8, 4, 2, 2]], [3, [2, 0, 0, 0]]],
  [[1, [8, 5, 5, 5]]],
  [[2, [9, 8, 8, 8]]],
  [[2, [6, 8, 2, 0]], [1, [0, 2, 0, 0]]],
  [[3, [5, 5, 5, 5]], [7, [5, 5, 5, 5]]],
  [[4, [6, 8, 6, 6]], [8, [0, 4, 4, 4]]],
  [[0, [3, 3, 3, 3]], [4, [2, 2, 2, 2]]],
  [[5, [6, 6, 6, 6]]]
];
const sample3 = () => {
  const s: Record<string, string> = {};
  POSTES.forEach((_p, p) => { s[`o${p}`] = String(DISPO[p][0]); s[`c${p}`] = String(DISPO[p][1]); s[`r${p}`] = String(DISPO[p][2]); });
  SAMPLE3.forEach((lines, i) => lines.forEach(([p, days], j) => { s[`p${i}${j}`] = POSTES[p]; days.forEach((d, k) => { s[`d${i}${j}m${k + 1}`] = d ? String(d) : ''; }); }));
  return s;
};

// Exercice 4 : matrice d'Eisenhower révisée. Chaque tâche contient les faits utiles (échéance, blocage, sécurité) ;
// l'importance se juge (plusieurs niveaux acceptés quand c'est défendable). Le cadran se calcule à partir des choix
// de l'apprenant, et une tâche ne rapporte son point que si tout est cohérent.
/** Tâche, niveaux d'importance acceptés, échéance (jours), bloque un collègue, sécurité d'une personne */
const TASKS: [string, number[], number, boolean, boolean][] = [
  ['Transmettre à l\'UCP une plainte de harcèlement sexuel reçue ce matin (délai à respecter : 24 heures)', [3], 1, false, true],
  ['Remettre à l\'UCP le rapport mensuel d\'activités, attendu dans 2 jours', [3], 2, false, false],
  ['Valider avec l\'UCP les maquettes des affiches : l\'imprimeur attend cette validation pour lancer l\'impression ; rendez-vous possible dans 10 jours', [2, 3], 10, true, false],
  ['Installer les 5 boîtes à plaintes : les animateurs attendent leur installation pour annoncer les canaux du MGP ; à faire dans 7 jours', [3], 7, true, false],
  ['Renouveler le forfait internet du bureau, qui expire dans 2 jours ; sans lui, l\'équipe ne peut plus envoyer les données KoboToolbox', [2, 3], 2, true, false],
  ['Organiser une visite dans le quartier 4, où une agression a été signalée près d\'une boîte à plaintes ; visite à prévoir dans les 20 jours', [2, 3], 20, false, true],
  ['Former les 30 points focaux à KoboToolbox, formation prévue dans 30 jours', [3], 30, false, false],
  ['Préparer la cérémonie officielle de lancement, prévue dans 25 jours', [3], 25, false, false],
  ['Préparer l\'enquête de notoriété du MGP de mi-parcours, prévue dans 45 jours', [3], 45, false, false],
  ['Mettre à jour la cartographie des acteurs, à présenter au comité de liaison dans 20 jours', [2, 3], 20, false, false],
  ['Répondre à une demande d\'information générale d\'une ONG partenaire, dans les 5 jours', [1], 5, false, false],
  ['Participer à une réunion externe sans ordre du jour, dans 2 jours', [1], 2, false, false],
  ['Commander des stylos et du papier pour le bureau : le stock suffit encore pour 12 jours', [1], 12, false, false],
  ['Reclasser les photos du dernier événement dans le dossier partagé, à faire d\'ici 40 jours', [1], 40, false, false]
];
const IMPORTANCES = ['1 · faible', '2 · moyenne', '3 · forte'];
const URGENCES = ['1 · plus de 15 jours', '2 · de 3 à 15 jours', '3 · moins de 3 jours'];
const OUI_NON = ['Oui', 'Non'];
const DECISIONS = ['Faire maintenant', 'Planifier', 'Déléguer ou décliner', 'Éliminer ou reporter'];
const urgOf = (days: number, blocks: boolean) => Math.min(3, (days > 15 ? 1 : days >= 3 ? 2 : 3) + (blocks ? 1 : 0));
const quadOf = (imp: number, urg: number, safety: boolean) => (safety ? 1 : imp >= 2 ? (urg >= 2 ? 1 : 2) : urg >= 2 ? 3 : 4);
const level = (t: string) => { const n = parseInt(t, 10); return n >= 1 && n <= 3 ? n : null; };
/** Urgence que donne la règle à partir de l'échéance et du blocage saisis par l'apprenant */
const urgFromEntries = (c: Ctx, i: number) => {
  const days = c.num(`j${i}`), b = c.text(`b${i}`);
  return days === null || !b ? null : urgOf(days, b === 'Oui');
};
/** Cadran calculé à partir de l'importance, de l'urgence et de la sécurité choisies par l'apprenant */
const quadFromEntries = (c: Ctx, i: number) => {
  const imp = level(c.text(`i${i}`)), urg = level(c.text(`u${i}`)), s = c.text(`s${i}`);
  return imp === null || urg === null || !s ? null : quadOf(imp, urg, s === 'Oui');
};
const QUAD_LABELS = ['1 · Important et urgent', '2 · Important, pas urgent', '3 · Urgent, peu important', '4 · Ni urgent ni important'];

// Exercice 5 : tableau de bord des indicateurs (fin M3), comparés à la cible prévue à date selon le chronogramme
/** Indicateur, cible de fin de mission, mois prévus (chronogramme), réalisé à la fin du mois 3 */
const IND: [string, number, number[], number][] = [
  ['Causeries éducatives réalisées', 30, [1, 2, 3, 4, 5, 6], 12],
  ['Émissions radio diffusées', 6, [1, 2, 3, 4, 5, 6], 3],
  ['Points focaux formés et équipés', 30, [1, 2], 30],
  ['Membres des comités formés', 30, [1, 2], 24],
  ['Sessions de sensibilisation des travailleurs', 12, [1, 2, 3, 4, 5, 6], 4],
  ['Séances de théâtre-forum', 4, [3, 5], 1],
  ['Tournoi sportif communautaire', 1, [3], 0],
  ['Cérémonie officielle de lancement', 1, [2], 1]
];
/** Mot qui doit apparaître dans la note pour commenter chaque indicateur */
const IND_KEYS = ['causerie', 'radio', 'points focaux', 'comite', 'travailleur', 'theatre', 'tournoi', 'ceremonie'];
const TRAJ = ['Dans la trajectoire', 'Léger retard', 'Retard important'];
const trajOf = (t: number) => (t >= 90 ? 'Dans la trajectoire' : t >= 60 ? 'Léger retard' : 'Retard important');
const indRate = (c: Ctx, i: number) => { const pv = c.num(`pv${i}`); return pv && pv > 0 ? (IND[i][3] / pv) * 100 : null; };

// Exercice 6 : suivi budgétaire (fin M3). L'apprenant calcule le budget prévu à date d'après le chronogramme, ventile
// le journal des dépenses dans les lignes et les mois ; le total, le solde, l'écart et le taux se calculent ; il choisit
// la situation et rédige une observation par ligne.
/** Ligne budgétaire, budget alloué, mois prévus (chronogramme) */
const BUD_LINES: [string, number, number[]][] = [
  ['Cérémonie officielle de lancement', 900000, [2]],
  ['Émissions radio mensuelles', 900000, [1, 2, 3, 4, 5, 6]],
  ['Causeries éducatives dans les quartiers', 600000, [1, 2, 3, 4, 5, 6]],
  ['Séances de théâtre-forum', 1000000, [3, 5]],
  ['Formation des comités : indemnités', 480000, [1, 2]],
  ['Sessions de sensibilisation des travailleurs', 900000, [1, 2, 3, 4, 5, 6]]
];
/** Journal des dépenses payées : mois, jour, libellé, montant, ligne budgétaire (-1 : hors des six lignes suivies) */
const JOURNAL: [number, number, string, number, number][] = [
  [1, 9, 'Collations et matériel des causeries dans les quartiers 1 à 5', 100000, 2],
  [1, 14, 'Session de sensibilisation n° 1 des travailleurs de chantier', 75000, 5],
  [1, 27, 'Radio locale : passage antenne de l\'émission du mois 1', 150000, 1],
  [2, 6, 'Indemnités de participation à la formation des comités (30 participants × 2 jours × 8 000)', 480000, 4],
  [2, 11, 'Carburant des motos (fonctionnement)', 90000, -1],
  [2, 15, 'Location de la sonorisation et du chapiteau pour la cérémonie de lancement', 350000, 0],
  [2, 15, 'Collation des invités de la cérémonie de lancement', 420000, 0],
  [2, 15, 'Animation et artistes de la cérémonie de lancement', 165000, 0],
  [2, 19, 'Session de sensibilisation n° 2 des travailleurs de chantier', 75000, 5],
  [2, 22, 'Collations et matériel des causeries du mois 2', 140000, 2],
  [2, 26, 'Radio locale : passage antenne de l\'émission du mois 2', 150000, 1],
  [3, 8, 'Troupe théâtrale : première séance de théâtre-forum', 600000, 3],
  [3, 8, 'Sonorisation de la séance de théâtre-forum', 220000, 3],
  [3, 12, 'Sessions de sensibilisation n° 3 et 4 des travailleurs de chantier', 150000, 5],
  [3, 20, 'Collations et matériel des causeries du mois 3', 160000, 2],
  [3, 27, 'Radio locale : passage antenne de l\'émission du mois 3', 150000, 1]
];
const spentIn = (line: number, month: number) => JOURNAL.filter((j) => j[4] === line && j[0] === month).reduce((n, j) => n + j[3], 0);
const SITUATIONS = ['OK', 'En retard', 'Attention', 'Dépassé'];
/** Dépassé : au-delà du budget alloué ; Attention : dépense en avance sur le chronogramme ; En retard : moins de 80 % du prévu à date */
const situationOf = (spent: number, budget: number, planned: number) =>
  spent > budget ? 'Dépassé' : spent > planned ? 'Attention' : planned > 0 && spent < 0.8 * planned ? 'En retard' : 'OK';
const RYTHMES = ['Trop rapide', 'Normal', 'Trop lent'];
const rythmeOf = (gapPct: number) => (gapPct > 5 ? 'Trop rapide' : gapPct < -5 ? 'Trop lent' : 'Normal');
const lineSpent = (c: Ctx, i: number) => [1, 2, 3].reduce((n, m) => n + (c.num(`m${m}l${i}`) ?? 0), 0);
const plannedOf = (c: Ctx, i: number) => c.num(`pv${i}`);
const lineSituation = (c: Ctx, i: number) => { const pv = plannedOf(c, i); return pv === null ? null : situationOf(lineSpent(c, i), BUD_LINES[i][1], pv); };
const budTotal = BUD_LINES.reduce((n, b) => n + b[1], 0);
const totalSpent = (c: Ctx) => BUD_LINES.reduce((n, _b, i) => n + lineSpent(c, i), 0);
const totalPlanned = (c: Ctx) => BUD_LINES.reduce((n, _b, i) => n + (plannedOf(c, i) ?? 0), 0);
const gapPct = (c: Ctx) => { const pv = totalPlanned(c); return pv > 0 ? ((totalSpent(c) - pv) / pv) * 100 : null; };
const words = (s: string) => (s.trim().match(/[\p{L}\p{N}]+/gu) || []).length;
const plain = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const set: PracticeSet = {
  courseId: 'management-pilotage-communautaire',
  title: 'Travaux pratiques : projet PGC-Vie',
  intro: "Ces exercices vous mettent en situation sur un même projet. Lisez d'abord le dossier du projet (termes de référence et offre financière), puis remplissez les tableaux et rédigez vos réponses directement sur le site. Chaque tableau est corrigé dès que vous le validez, avec son corrigé. Chaque rédaction est acceptée à partir de 80 % des éléments attendus ; sinon, la correction vous indique ce qui manque et vous la refaites. Ces travaux pratiques ne comptent pas pour le certificat.",
  dossier: [
    { id: 'tdr', title: 'Termes de référence de la mission', html: DOSSIER_TDR },
    { id: 'offre', title: 'Offre financière de la mission', html: DOSSIER_OFFRE },
    { id: 'dictionnaire', title: 'Dictionnaire des indicateurs', html: DOSSIER_DICTIONNAIRE }
  ],
  exercises: [
    {
      kind: 'sheet',
      id: 'offre-financiere',
      title: 'Exercice 1 : recalculer l\'offre financière',
      skill: 'Offre financière',
      intro: "Avant de déposer l'offre, le chef de mission vous demande de vérifier les calculs. Complétez le montant de quelques lignes d'activités, puis le récapitulatif.",
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
      intro: "<p>À partir de votre lecture des TDR (section « Moyens à mobiliser »), indiquez pour chaque équipement la quantité requise. Reportez ensuite la quantité disponible d'après l'inventaire ci-dessous, choisissez le mode d'obtention et saisissez le prix unitaire retenu dans l'offre financière (prix des devis). L'écart, le taux de couverture, le coût de l'écart et le statut se calculent automatiquement.</p><p><strong>Inventaire réalisé au démarrage :</strong> l'ONG dispose déjà d'une moto en état de marche, de deux ordinateurs portables, d'une armoire sécurisée et de deux trousses de premiers secours. Elle n'a ni smartphone de service, ni tablette, ni kit pour les points focaux, ni boîte à plaintes.</p>",
      rules: "<p>Saisissez des nombres dans les cases blanches et choisissez le mode d'obtention dans la liste. Les colonnes grisées se calculent seules. Un statut « Incohérent » signale que le mode d'obtention contredit les quantités : corrigez-le.</p>",
      tables: [{
        columns: ['Équipement', 'Quantité requise', 'Quantité disponible', 'Mode d\'obtention', 'Prix unitaire (FCFA)', 'Écart', 'Taux de couverture', 'Coût de l\'écart (FCFA)', 'Statut'],
        rows: [
          ...LOG.map(([m, req, dispo, pu], i): SheetCell[] => [
            m,
            { id: `q${i}`, answer: req, tol: 0 },
            { id: `d${i}`, answer: dispo, tol: 0 },
            { id: `m${i}`, answer: dispo >= req ? 'Existant' : 'À acquérir', options: MODES },
            { id: `p${i}`, answer: pu, fmt: 'fcfa', tol: Math.round(pu * 0.1) },
            { id: `e${i}`, calc: (c) => ecartOf(c, i) },
            { id: `t${i}`, fmt: 'pct', calc: (c) => {
              const q = c.num(`q${i}`), d = c.num(`d${i}`);
              return q === null || d === null || q <= 0 ? null : r1(Math.min(100, (d / q) * 100));
            } },
            { id: `k${i}`, fmt: 'fcfa', calc: (c) => {
              const e = ecartOf(c, i), p = c.num(`p${i}`);
              return e === null || p === null ? null : e * p;
            } },
            { id: `s${i}`, calc: (c) => statutOf(c.num(`q${i}`), c.num(`d${i}`), c.text(`m${i}`)) }
          ]),
          ['Coût total de l\'écart', '', '', '', '', '', '', { id: 'total', fmt: 'fcfa', calc: (c) => LOG.reduce((n, _l, i) => n + (c.num(`k${i}`) ?? 0), 0) }, '']
        ]
      }],
      explanation: "<p>Les quantités se déduisent des TDR : une moto et un smartphone pour chacun des quatre agents de terrain, un ordinateur pour chacune des six personnes de l'équipe, une tablette pour trois points focaux (soit 10), un kit par point focal (30), une boîte à plaintes par quartier (5), deux armoires distinctes (archives et registre confidentiel) et deux trousses (bureau et déplacements). Seules les trousses sont entièrement couvertes : elles sont « Existant ». Le transport et l'informatique concentrent l'essentiel du coût de l'écart : ce sont les achats à budgéter en premier.</p>"
    },
    {
      kind: 'sheet',
      id: 'plan-de-charge',
      title: 'Exercice 3 : plan de charge sur quatre mois',
      skill: 'Management des équipes',
      intro: "<p>Construisez le plan de charge de l'équipe pour les mois 1 à 4, comme dans la matrice des charges.</p><p><strong>Disponibilité :</strong> chaque mois compte 22 jours ouvrés pour le personnel salarié. Le chef de mission prend en moyenne 2 jours de congé et consacre 2 jours aux réunions de coordination par mois. Le chargé de projet n'a pas de congé et 2 jours de coordination. La spécialiste VBG/MGP a 1 jour d'absence et 2 jours de coordination. L'animateur communautaire 1 prend 2 jours de congé et a 1 jour de coordination. L'animateur communautaire 2 a 1 jour d'absence et 1 jour de coordination. L'appui comptable travaille à mi-temps : 11 jours disponibles par mois, sans congé, dont 1 jour de coordination. Les quatre animateurs bénévoles sont disponibles 10 jours par mois chacun, sans congé, et participent à 1 jour de coordination.</p><p><strong>Affectation :</strong> pour chaque activité, choisissez dans la liste le poste responsable et, si besoin, un poste d'appui, puis indiquez les jours de travail de chacun pour chaque mois. Les jours affectés à une activité doivent correspondre à sa charge prévue. La charge et le taux de charge de chaque personne se calculent automatiquement, mois par mois.</p>",
      rules: "<p>Les colonnes grisées se calculent seules : jours travaillés = jours disponibles − congés et absences − réunions et coordination ; charge du mois = somme des jours affectés à la personne ; taux de charge = charge ÷ jours travaillés. Lecture : sous-charge en dessous de 60 % ; équilibré de 60 à 90 % ; tendu de 91 à 100 % ; surcharge au-delà de 100 %. Les animateurs bénévoles peuvent appuyer les activités de terrain, mais pas le traitement des plaintes, qui est confidentiel.</p>",
      tables: [
        {
          title: '1. Disponibilité mensuelle de chaque personne',
          columns: ['Poste', 'Jours disponibles par mois', 'Congés et absences', 'Réunions et coordination', 'Jours travaillés par mois'],
          rows: POSTES.map((p, i): SheetCell[] => [
            p,
            { id: `o${i}`, answer: DISPO[i][0], tol: 0 },
            { id: `c${i}`, answer: DISPO[i][1], tol: 0 },
            { id: `r${i}`, answer: DISPO[i][2], tol: 0 },
            { id: `w${i}`, calc: (c) => workedOf(c, i) }
          ])
        },
        {
          title: '2. Matrice d\'affectation des activités (jours de travail par mois)',
          columns: ['Activité (charge prévue M1 · M2 · M3 · M4)', 'Rôle', 'Poste', 'Mois 1', 'Mois 2', 'Mois 3', 'Mois 4', 'Reste à affecter (M1 · M2 · M3 · M4)'],
          rows: ACTS.flatMap(([a, plan], i) => ROLES.map((role, j): SheetCell[] => [
            j === 0 ? `${a} (${plan.join(' · ')} j)` : '',
            role,
            { id: `p${i}${j}`, options: POSTES },
            ...MOIS.map((m): SheetCell => ({ id: `d${i}${j}m${m}` })),
            j === 0 ? '' : { id: `x${i}`, calc: (c) => MOIS.map((m) => r1(plan[m - 1] - assignedOf(c, i, m))).join(' · ') }
          ]))
        },
        {
          title: '3. Charge et taux de charge de chaque personne, mois par mois',
          columns: ['Poste', 'Jours travaillés par mois', 'Mois 1', 'Mois 2', 'Mois 3', 'Mois 4'],
          rows: POSTES.map((p, i): SheetCell[] => [
            p,
            { id: `ww${i}`, calc: (c) => workedOf(c, i) },
            ...MOIS.map((m): SheetCell => ({
              id: `t${i}m${m}`,
              calc: (c) => { const t = rateOf(c, i, m); return t === null ? null : `${chargeOf(c, i, m)} j · ${r1(t).toLocaleString('fr-FR')} % · ${lectureOf(t)}`; }
            }))
          ])
        },
        {
          title: '4. Décision',
          columns: ['Question', 'Réponse'],
          rows: [
            ['D\'après votre plan, quel poste a le taux de charge le plus élevé au mois 1 ?', { id: 'plus', options: POSTES, answer: (c) => extremeOf(c, 1, 1) }],
            ['D\'après votre plan, quel poste a le taux de charge le plus élevé au mois 2 ?', { id: 'plus2', options: POSTES, answer: (c) => extremeOf(c, 2, 1) }],
            ['Si un poste dépassait 100 %, quel levier utiliser en premier ?', { id: 'levier', options: ['Décaler', 'Déléguer', 'Mutualiser', 'Renforcer'], answer: 'Décaler' }]
          ]
        }
      ],
      checks: [
        { label: 'Chaque activité a un poste responsable', test: (c) => ACTS.every((_a, i) => !!c.text(`p${i}0`)) },
        { label: 'Chaque mois, les jours affectés à chaque activité correspondent à sa charge prévue (aucun reste à affecter)', test: (c) => ACTS.every(([, plan], i) => MOIS.every((m) => Math.abs(plan[m - 1] - assignedOf(c, i, m)) < 0.01)) },
        { label: 'Le MGP est confié pour l\'essentiel à la spécialiste VBG/MGP', test: (c) => MOIS.every((m) => ROLES.reduce((k, _r, j) => k + (c.text(`p${MGP_ACT}${j}`) === POSTES[2] ? cell0(c, `d${MGP_ACT}${j}m${m}`) : 0), 0) >= ACTS[MGP_ACT][1][m - 1] / 2) },
        { label: 'Aucun animateur bénévole n\'est affecté au MGP (confidentialité des plaintes)', test: (c) => anyAssigned(c) && ROLES.every((_r, j) => !BENEVOLES.some((b) => c.text(`p${MGP_ACT}${j}`) === POSTES[b])) },
        { label: 'La comptabilité et les justificatifs sont confiés à l\'appui comptable', test: (c) => c.text(`p${COMPTA_ACT}0`) === POSTES[5] },
        { label: 'Aucun poste ne dépasse 100 % de charge, quel que soit le mois', test: (c) => anyAssigned(c) && POSTES.every((_p, p) => MOIS.every((m) => { const t = rateOf(c, p, m); return t !== null && t <= 100; })) }
      ],
      sample: sample3(),
      explanation: "<p>Si le chef de mission garde seul le pilotage, la cartographie et la radio, il dépasse sa capacité au mois 1 (19 jours pour 18 jours travaillés). On rééquilibre en confiant une partie de la cartographie à un animateur bénévole et une partie de la radio et du comité de liaison à l'animateur communautaire 2. Les bénévoles renforcent utilement les causeries et les événements, mais jamais le MGP, qui reste chez la spécialiste pour la confidentialité des plaintes. La comptabilité reste à l'appui comptable.</p>"
    },
    {
      kind: 'sheet',
      id: 'matrice-eisenhower',
      title: 'Exercice 4 : matrice d\'Eisenhower révisée',
      skill: 'Priorités de la semaine',
      intro: "<p>Lundi matin, l'équipe du PGC-Vie liste les tâches de la semaine. Pour chaque tâche, à partir de sa description : choisissez le niveau d'importance, saisissez l'échéance en jours, indiquez si la tâche bloque un collègue et si elle touche la sécurité d'une personne, puis choisissez le niveau d'urgence. Le cadran se calcule automatiquement à partir de vos choix ; décidez enfin de ce que vous faites de la tâche.</p><p>Une tâche ne rapporte son point que si toute la ligne est cohérente : importance défendable, échéance, blocage et sécurité conformes à la description, urgence conforme à la règle et décision conforme au cadran.</p>",
      rules: "<p><strong>Importance</strong> : 3 si la tâche contribue directement à un résultat, à un indicateur, à la conformité avec l'UCP ou à la protection des personnes ; 2 si elle y contribue indirectement ; 1 si elle n'a pas d'effet sur les résultats. <strong>Urgence</strong> : 1 si l'échéance est à plus de 15 jours ; 2 de 3 à 15 jours ; 3 à moins de 3 jours ; une tâche qui bloque un collègue gagne un niveau (au maximum 3). <strong>Cadran</strong> : 1 si importance 2 ou 3 et urgence 2 ou 3 ; 2 si importance 2 ou 3 et urgence 1 ; 3 si importance 1 et urgence 2 ou 3 ; 4 si importance 1 et urgence 1 ; toute tâche qui touche la sécurité d'une personne passe au cadran 1. <strong>Décision</strong> : cadran 1, faire maintenant ; cadran 2, planifier ; cadran 3, déléguer ou décliner ; cadran 4, éliminer ou reporter.</p>",
      tables: [{
        columns: ['Tâche', 'Importance', 'Échéance (jours)', 'Bloque un collègue', 'Sécurité d\'une personne', 'Urgence', 'Cadran (calculé)', 'Décision'],
        rows: TASKS.map(([t, imps, days, blocks, safety], i): SheetCell[] => [
          t,
          { id: `i${i}`, options: IMPORTANCES, answer: imps.map((n) => IMPORTANCES[n - 1]), noScore: true },
          { id: `j${i}`, answer: days, tol: 0, noScore: true },
          { id: `b${i}`, options: OUI_NON, answer: blocks ? 'Oui' : 'Non', noScore: true },
          { id: `s${i}`, options: OUI_NON, answer: safety ? 'Oui' : 'Non', noScore: true },
          { id: `u${i}`, options: URGENCES, answer: (c) => { const u = urgFromEntries(c, i); return u === null ? null : URGENCES[u - 1]; }, noScore: true },
          { id: `q${i}`, calc: (c) => { const q = quadFromEntries(c, i); return q === null ? null : QUAD_LABELS[q - 1]; } },
          { id: `d${i}`, options: DECISIONS, answer: (c) => { const q = quadFromEntries(c, i); return q === null ? null : DECISIONS[q - 1]; }, noScore: true }
        ])
      }],
      checks: TASKS.map(([t, imps, days, blocks, safety], i) => ({
        label: `Tâche ${i + 1} : ${t.split(/[:;(]/)[0].trim()}`,
        test: (c: Ctx) => {
          const imp = level(c.text(`i${i}`)), urg = level(c.text(`u${i}`)), q = quadFromEntries(c, i);
          return imp !== null && imps.includes(imp)
            && c.num(`j${i}`) === days
            && c.text(`b${i}`) === (blocks ? 'Oui' : 'Non')
            && c.text(`s${i}`) === (safety ? 'Oui' : 'Non')
            && urg === urgOf(days, blocks)
            && q !== null && c.text(`d${i}`) === DECISIONS[q - 1];
        }
      })),
      explanation: "<p>Trois pièges : la validation des maquettes, l'installation des boîtes à plaintes et le forfait internet bloquent un collègue, ce qui monte leur urgence d'un niveau ; la visite du quartier 4 a une échéance lointaine mais passe au cadran 1 parce qu'elle touche la sécurité des personnes ; la commande de fournitures est urgente mais peu importante : on la délègue. Les tâches du cadran 1 reçoivent un responsable avant la fin de la journée, celles du cadran 2 une date dans l'agenda.</p>"
    },
    {
      kind: 'sheet',
      id: 'tableau-de-bord',
      title: 'Exercice 5 : tableau de bord des indicateurs à mi-parcours',
      skill: 'Suivi-évaluation',
      intro: "<p>Nous sommes à la fin du mois 3. Chaque indicateur se compare à ce qui était prévu à cette date d'après le chronogramme (dans le dossier du projet), et non à la cible de fin de mission : une activité prévue aux mois 1 et 2 doit être entièrement réalisée, une activité répartie sur les six mois doit l'être à moitié, une activité prévue aux mois 3 et 5 pour moitié. Calculez la cible prévue à fin M3 de chaque indicateur et choisissez son appréciation, puis complétez les indicateurs de qualité du MGP.</p>",
      rules: "<p>Cible prévue à fin M3 = cible de fin de mission × (nombre de mois prévus jusqu'au mois 3 ÷ nombre total de mois prévus). Le taux par rapport au prévu se calcule seul. Appréciation : <strong>dans la trajectoire</strong> à partir de 90 % du prévu ; <strong>léger retard</strong> de 60 à 89 % ; <strong>retard important</strong> en dessous de 60 %. Pour les indicateurs du MGP : taux = numérateur ÷ dénominateur ; écart à la cible en points = valeur − cible.</p>",
      tables: [
        {
          title: 'Indicateurs d\'activités',
          columns: ['Indicateur', 'Cible fin M6', 'Mois prévus (chronogramme)', 'Cible prévue à fin M3', 'Réalisé fin M3', 'Taux par rapport au prévu', 'Appréciation'],
          rows: IND.map(([n, cible, months, done], i): SheetCell[] => [
            n, num(cible), monthsText(months),
            { id: `pv${i}`, answer: r1(cible * shareAt(months, 3)), tol: 0.01 },
            num(done),
            { id: `t${i}`, fmt: 'pct', calc: (c) => { const t = indRate(c, i); return t === null ? null : r1(t); } },
            { id: `a${i}`, options: TRAJ, answer: (c) => { const t = indRate(c, i); return t === null ? null : trajOf(t); } }
          ])
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
      writing: {
        prompt: "<p><strong>Note d'analyse à mi-parcours (une page).</strong> À partir de votre tableau de bord, du chronogramme et du dictionnaire des indicateurs (dans le dossier du projet), rédigez la note que le chef de mission transmettra à l'UCP : situation à mi-parcours par rapport à ce qui était prévu, indicateurs dans la trajectoire, indicateurs en retard et leurs causes probables, qualité du mécanisme de gestion des plaintes, fiabilité des données (sources, fréquence, responsables, désagrégation) et recommandations concrètes.</p>",
        minWords: 250,
        criteria: [
          { label: 'La situation à mi-parcours (fin du mois 3)', keywords: ['mi-parcours', 'mi parcours', 'mois 3', 'moitie', 'temps ecoule'] },
          { label: 'La comparaison avec ce qui était prévu à date selon le chronogramme', keywords: ['chronogramme', 'prevu', 'planifie', 'a date'] },
          { label: 'Les indicateurs dans la trajectoire (émissions radio, points focaux, cérémonie de lancement)', keywords: ['radio', 'points focaux', 'ceremonie', 'lancement', 'trajectoire'], need: 2 },
          { label: 'Les retards importants (théâtre-forum, tournoi sportif)', keywords: ['theatre', 'tournoi'], need: 2 },
          { label: 'Les légers retards (causeries, sessions avec les travailleurs, membres des comités)', keywords: ['causerie', 'travailleur', 'chantier', 'comite'], need: 2 },
          { label: 'La notoriété du MGP (63 % pour une cible de 80 %)', keywords: ['notoriete', '63'], need: 2 },
          { label: 'La qualité du traitement des plaintes (90 % dans les délais, 100 % des plaintes sensibles sous 24 heures)', keywords: ['delai', '90', '24 heures', '24h', 'sensible'], need: 2 },
          { label: 'La fiabilité des données selon le dictionnaire (sources, fréquence, responsables)', keywords: ['source', 'frequence', 'responsable', 'liste de presence', 'registre', 'enquete', 'dictionnaire'], need: 2 },
          { label: 'La désagrégation des données (sexe, âge, quartier)', keywords: ['desagreg', 'sexe', 'age$', 'ages$', 'quartier'] },
          { label: "Des recommandations concrètes (replanifier, accélérer, renforcer l'annonce des canaux…)", keywords: ['recommand', 'replanif', 'accelerer', 'renforcer', 'proposons', 'mesure', 'action'], need: 2 }
        ],
        // Selon la déclaration de l'apprenant : chaque indicateur qu'il a jugé en retard doit être commenté
        dynamicCriteria: (c) => IND.flatMap(([n], i) => {
          const a = c.text(`a${i}`);
          if (a !== 'Retard important' && a !== 'Léger retard') return [];
          return [{ label: `L'indicateur « ${n} », que vous avez jugé en ${a === 'Léger retard' ? 'léger retard' : 'retard important'}, est commenté`, keywords: [IND_KEYS[i]] }];
        })
      },
      explanation: "<p>Le chronogramme change la lecture : les points focaux et la cérémonie de lancement, prévus aux mois 1 et 2, sont entièrement réalisés, comme attendu. Les membres des comités devaient tous être formés à la fin du mois 2 : 24 sur 30, c'est un léger retard. Les causeries (12 pour 15 prévues) et les sessions avec les travailleurs (4 pour 6 prévues) sont en léger retard. Le théâtre-forum (1 séance pour 2 prévues) et le tournoi sportif, prévu au mois 3 et non réalisé, sont en retard important : à replanifier tout de suite. La notoriété du MGP (63 %) est loin de la cible de 80 % : renforcer l'annonce des canaux avant l'enquête finale.</p>"
    },
    {
      kind: 'sheet',
      id: 'suivi-budgetaire',
      title: 'Exercice 6 : suivi budgétaire à la fin du mois 3',
      skill: 'Pilotage budgétaire',
      intro: `<p>Nous sommes à la fin du mois 3. Pour chaque ligne, calculez d'abord le budget prévu à fin M3 d'après le chronogramme : une activité prévue au seul mois 2 doit avoir consommé tout son budget ; une activité répartie sur les six mois, la moitié ; une activité prévue aux mois 3 et 5, la moitié. Saisissez ensuite chaque dépense du journal dans la bonne ligne et dans le bon mois : seules les six lignes d'activités du tableau sont suivies ici, une dépense qui ne relève d'aucune d'elles n'y est pas saisie. Choisissez enfin la situation de chaque ligne et rédigez une observation.</p>
<p><strong>Journal des dépenses du trimestre</strong></p>
${table(['Date', 'Libellé', 'Montant'], JOURNAL.map(([m, d, l, a]) => [`Mois ${m}, jour ${d}`, l, fcfa(a)]))}`,
      rules: "<p>Budget prévu à fin M3 = budget alloué × (nombre de mois prévus jusqu'au mois 3 ÷ nombre total de mois prévus). Saisissez les dépenses de chaque mois (laissez vide ou mettez 0 s'il n'y en a pas ; vous pouvez additionner, par exemple =350000+420000). Le total dépensé, le solde, l'écart avec le prévu et le taux d'exécution se calculent seuls. Situation : <strong>Dépassé</strong> si la dépense dépasse le budget alloué ; <strong>Attention</strong> si elle dépasse le budget prévu à fin M3 (dépense en avance sur le chronogramme) ; <strong>En retard</strong> si elle est inférieure à 80 % du budget prévu à fin M3 ; <strong>OK</strong> sinon. Dans l'observation, expliquez la situation et, si besoin, la mesure à prendre.</p>",
      tables: [
        {
          title: 'Suivi par ligne (FCFA)',
          columns: ['Ligne budgétaire', 'Budget alloué', 'Mois prévus (chronogramme)', 'Budget prévu à fin M3', 'Mois 1', 'Mois 2', 'Mois 3', 'Total dépensé', 'Solde', 'Écart avec le prévu', 'Taux d\'exécution', 'Situation', 'Observation'],
          rows: BUD_LINES.map(([l, b, months], i): SheetCell[] => [
            l, num(b, 'fcfa'), monthsText(months),
            { id: `pv${i}`, answer: Math.round(b * shareAt(months, 3)), fmt: 'fcfa' },
            ...[1, 2, 3].map((m): SheetCell => ({ id: `m${m}l${i}`, answer: spentIn(i, m), fmt: 'fcfa' })),
            { id: `s${i}`, fmt: 'fcfa', calc: (c) => lineSpent(c, i) },
            { id: `r${i}`, fmt: 'fcfa', calc: (c) => b - lineSpent(c, i) },
            { id: `e${i}`, fmt: 'fcfa', calc: (c) => { const pv = plannedOf(c, i); return pv === null ? null : lineSpent(c, i) - pv; } },
            { id: `t${i}`, fmt: 'pct', calc: (c) => r1((lineSpent(c, i) / b) * 100) },
            { id: `x${i}`, options: SITUATIONS, answer: (c) => lineSituation(c, i) },
            { id: `o${i}`, text: true, placeholder: 'Votre observation' }
          ])
        },
        {
          title: 'Synthèse',
          columns: ['Élément', 'Valeur'],
          rows: [
            ['Budget total des six lignes', { id: 'bt', fmt: 'fcfa', calc: () => budTotal }],
            ['Budget prévu à fin M3 (selon le chronogramme)', { id: 'pt', fmt: 'fcfa', calc: (c) => totalPlanned(c) }],
            ['Total dépensé', { id: 'st', fmt: 'fcfa', calc: (c) => totalSpent(c) }],
            ['Écart avec le prévu à fin M3 (%)', { id: 'gp', fmt: 'pct', calc: (c) => { const g = gapPct(c); return g === null ? null : r1(g); } }],
            ['Taux d\'exécution sur le budget total', { id: 'tg', fmt: 'pct', calc: (c) => r1((totalSpent(c) / budTotal) * 100) }],
            ['Rythme des dépenses par rapport au chronogramme (écart de plus de 5 % = trop rapide ou trop lent)', { id: 'rythme', options: RYTHMES, answer: (c) => { const g = gapPct(c); return g === null ? null : rythmeOf(g); } }]
          ]
        }
      ],
      checks: [
        { label: 'Chaque ligne a une observation rédigée (au moins 3 mots)', test: (c) => BUD_LINES.every((_b, i) => words(c.text(`o${i}`)) >= 3) },
        {
          label: 'Les lignes dépassées sont expliquées avec une mesure (justifier, compenser, demander un transfert…)',
          test: (c) => totalSpent(c) > 0 && BUD_LINES.every((_b, i) => lineSituation(c, i) !== 'Dépassé'
            || /justif|compens|transfert|reaffect|realloc|ucp|depass|explic|regularis|economi/.test(plain(c.text(`o${i}`))))
        },
        {
          label: 'Les lignes en attention signalent la dépense en avance sur le chronogramme',
          test: (c) => totalSpent(c) > 0 && BUD_LINES.every((_b, i) => lineSituation(c, i) !== 'Attention'
            || /avance|chronogramme|prevu|surveill|limit|attention|cout|ecart|anticip|reste/.test(plain(c.text(`o${i}`))))
        },
        {
          label: 'Les lignes en retard proposent de rattraper le retard (accélérer, replanifier…)',
          test: (c) => totalSpent(c) > 0 && BUD_LINES.every((_b, i) => lineSituation(c, i) !== 'En retard'
            || /retard|accelerer|accelere|replanif|rattrap|programmer|organiser|relancer/.test(plain(c.text(`o${i}`))))
        }
      ],
      sample: {
        o0: 'Dépassement de 35 000 FCFA sur une activité terminée : justifier auprès de l\'UCP et compenser sur une autre ligne.',
        o1: 'Conforme au chronogramme : trois émissions payées, la moitié du budget.',
        o2: 'Dépense en avance sur le chronogramme (400 000 pour 300 000 prévus) : surveiller le coût des collations.',
        o3: 'Dépense en avance : 820 000 FCFA pour une seule séance alors que 500 000 étaient prévus, coût unitaire à revoir.',
        o4: 'Formation terminée et budget entièrement consommé, comme prévu au chronogramme.',
        o5: 'En retard : 4 sessions sur 6 prévues, accélérer les sessions avec les travailleurs au mois 4.'
      },
      explanation: "<p>Le chronogramme change la lecture : la cérémonie et la formation des comités devaient avoir consommé tout leur budget à la fin du mois 2 ; la radio, les causeries et les sessions la moitié ; le théâtre-forum la moitié (une période sur deux). La cérémonie est dépassée de 35 000 FCFA. Les causeries et le théâtre-forum dépensent plus vite que prévu : le coût unitaire du théâtre-forum est très supérieur à la prévision. Les sessions avec les travailleurs sont en retard. Le carburant (90 000 FCFA) relève du fonctionnement et ne se saisit dans aucune des six lignes. Au total, les dépenses dépassent d'environ 10 % ce qui était prévu à fin M3 : le rythme est trop rapide.</p>"
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ]
};

export default set;
