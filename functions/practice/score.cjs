// Fichier généré par scripts/build-practice-function.mjs depuis src/lib/practiceScoreServer.ts : ne pas modifier.
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/data/elearning/practice/management-pilotage-communautaire.ts
var fcfa, r1, num, inp, table, MONTHS, PERSONNEL, CHARGES, personnelTotal, ACTIVITIES, activitiesTotal, ACHATS, achatsTotal, FONCTIONNEMENT, FRAIS, TVA, direct, frais, ht, tva, CHRONO, shareAt, monthsText, DOSSIER_TDR, DOSSIER_OFFRE, LOGFRAME_COLS, DOSSIER_CADRE_LOGIQUE, DOSSIER_DICTIONNAIRE, LINES1, LOG, MODES, statutOf, ecartOf, POSTES, BENEVOLES, MOIS, DISPO, ACTS, MGP_ACT, COMPTA_ACT, ROLES, lectureOf, cell0, OUVRES, workedOf, unavailableOf, toneOf, POSTE_KEYS, ACT_KEYS, chefDaysM1, urgRetOf, chefQuad, DELAIS, fr, chargeOf, rateOf, assignedOf, anyAssigned, extremeOf, SAMPLE3, sample3, TASKS, IMPORTANCES, URGENCES, OUI_NON, DECISIONS, urgOf, quadOf, level, urgFromEntries, quadFromEntries, QUAD_LABELS, IND, IND_KEYS, TRAJ, trajOf, indPlanned, indRate, MGP_IND, MGP_KEYS, MGP_TRAJ, mgpVal, BUD_LINES, JOURNAL, spentIn, SITUATIONS, situationOf, RYTHMES, rythmeOf, lineSpent, plannedOf, lineSituation, budTotal, totalSpent, totalPlanned, gapPct, words, plain, set, management_pilotage_communautaire_default;
var init_management_pilotage_communautaire = __esm({
  "src/data/elearning/practice/management-pilotage-communautaire.ts"() {
    fcfa = (n) => `${Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " ")} FCFA`;
    r1 = (n) => Math.round(n * 10) / 10;
    num = (v, fmt = "n") => ({ v, fmt });
    inp = (id, answer, fmt = "n", tol) => ({ id, answer, fmt, ...tol !== void 0 ? { tol } : {} });
    table = (cols, rows) => `<table><tr>${cols.map((c) => `<th>${c}</th>`).join("")}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table>`;
    MONTHS = 6;
    PERSONNEL = [
      ["Chef de mission et animateur communautaire 1", 75e4],
      ["Spécialiste VBG / MGP", 65e4],
      ["Chargé de projet / programme", 5e5],
      ["Animateur communautaire 2", 35e4],
      ["Appui comptable (temps partiel)", 15e4]
    ];
    CHARGES = 0.165;
    personnelTotal = PERSONNEL.reduce((n, [, s]) => n + Math.round(s * (1 + CHARGES)) * MONTHS, 0);
    ACTIVITIES = [
      ["Pilotage, démarrage et rapportage", "Réunion de lancement avec l'UCP et les autorités", "réunion", 1, 15e4],
      ["Pilotage, démarrage et rapportage", "Rapport de démarrage (impression et reliure)", "lot", 1, 75e3],
      ["Pilotage, démarrage et rapportage", "Rapports mensuels (impression et transmission)", "rapport", 6, 2e4],
      ["Pilotage, démarrage et rapportage", "Rapport final et séance de restitution", "lot", 1, 2e5],
      ["Pilotage, démarrage et rapportage", "Enquêtes de satisfaction et de notoriété du MGP", "enquête", 2, 45e4],
      ["Pilotage, démarrage et rapportage", "Évaluation de la stratégie de communication", "évaluation", 1, 4e5],
      ["Mission 1 : animation communautaire", "Cartographie : fiches d'identification et supports", "lot", 1, 5e4],
      ["Mission 1 : animation communautaire", "Cartographie : atelier de restitution (30 participants)", "atelier", 1, 35e4],
      ["Mission 1 : animation communautaire", "Événement 1 : cérémonie officielle de lancement", "événement", 1, 9e5],
      ["Mission 1 : animation communautaire", "Événement 2 : tournoi sportif communautaire", "événement", 1, 8e5],
      ["Mission 1 : animation communautaire", "Événement 3 : journée culturelle et concours artistique", "événement", 1, 75e4],
      ["Mission 1 : animation communautaire", "Événement 4 : journée de nettoyage et d'embellissement", "événement", 1, 6e5],
      ["Mission 1 : animation communautaire", "Événement 5 : consultations publiques", "événement", 1, 7e5],
      ["Mission 1 : animation communautaire", "Événement 6 : événement de clôture", "événement", 1, 9e5],
      ["Mission 1 : animation communautaire", "Location de bâches, chaises et groupe électrogène", "événement", 6, 15e4],
      ["Mission 1 : animation communautaire", "Émissions radio mensuelles (français et langue locale)", "émission", 6, 15e4],
      ["Mission 1 : animation communautaire", "Causeries éducatives dans les quartiers", "causerie", 30, 2e4],
      ["Mission 1 : animation communautaire", "Focus groups (femmes et filles, jeunes, leaders)", "séance", 6, 6e4],
      ["Mission 1 : animation communautaire", "Séances de théâtre-forum", "séance", 4, 25e4],
      ["Mission 1 : animation communautaire", "Comité communal de liaison : réunion d'installation", "réunion", 1, 1e5],
      ["Mission 1 : animation communautaire", "Comité communal de liaison : séances mensuelles", "séance", 6, 75e3],
      ["Mission 2 : MGP et prévention des VBG", "Installation des boîtes à plaintes (pose et scellement)", "boîte", 5, 15e3],
      ["Mission 2 : MGP et prévention des VBG", "Annonce des canaux du MGP dans les quartiers", "quartier", 5, 2e4],
      ["Mission 2 : MGP et prévention des VBG", "Traitement des plaintes (vérification, médiation, déplacements)", "mois", 6, 5e4],
      ["Mission 2 : MGP et prévention des VBG", "Appui au référencement des survivant(e)s", "mois", 6, 4e4],
      ["Mission 2 : MGP et prévention des VBG", "Formation des comités : indemnités de participation (2 jours)", "participant-jour", 60, 8e3],
      ["Mission 2 : MGP et prévention des VBG", "Formation des comités : supports de formation", "participant", 30, 3e3],
      ["Mission 2 : MGP et prévention des VBG", "Formation des comités : location de salle (2 jours)", "jour", 2, 5e4],
      ["Mission 2 : MGP et prévention des VBG", "Sessions de sensibilisation des travailleurs de chantier", "session", 12, 75e3],
      ["Mission 2 : MGP et prévention des VBG", "Formation des points focaux à KoboToolbox et GEMS", "participant", 30, 1e4],
      ["Mission 2 : MGP et prévention des VBG", "Coordination avec les structures de prise en charge des VBG", "réunion", 6, 6e4],
      ["Mission 2 : MGP et prévention des VBG", "Atelier de validation du protocole de référencement", "atelier", 1, 25e4],
      ["Mission 2 : MGP et prévention des VBG", "Annuaire des services de prise en charge (impression)", "lot", 1, 5e4]
    ];
    activitiesTotal = ACTIVITIES.reduce((n, a) => n + a[3] * a[4], 0);
    ACHATS = [
      ["Mobilier et équipement de bureau", 779e3],
      ["Matériel informatique, téléphonie et collecte de données", 482e4],
      ["Transport, sécurité et équipement de terrain", 35e5],
      ["Supports de communication", 436e4]
    ];
    achatsTotal = ACHATS.reduce((n, [, v]) => n + v, 0);
    FONCTIONNEMENT = 435e4;
    FRAIS = 0.1;
    TVA = 0.18;
    direct = personnelTotal + activitiesTotal + achatsTotal + FONCTIONNEMENT;
    frais = Math.round(direct * FRAIS);
    ht = direct + frais;
    tva = Math.round(ht * TVA);
    CHRONO = [
      ["Réunion de lancement avec l'UCP et les autorités", [1]],
      ["Production et distribution des supports", [1]],
      ["Installation du MGP (boîtes à plaintes, registres, annonce des canaux)", [1]],
      ["Formation des comités et des points focaux", [1, 2]],
      ["Émissions radio (une par mois)", [1, 2, 3, 4, 5, 6]],
      ["Causeries éducatives (une par mois dans chaque quartier)", [1, 2, 3, 4, 5, 6]],
      ["Sessions de sensibilisation des travailleurs (deux par mois)", [1, 2, 3, 4, 5, 6]],
      ["Cérémonie officielle de lancement", [2]],
      ["Focus groups et réunions du comité de gestion des plaintes", [2, 4, 6]],
      ["Tournoi sportif communautaire", [3]],
      ["Séances de théâtre-forum (deux par mois prévu)", [3, 5]],
      ["Enquêtes de notoriété et de satisfaction du MGP", [3, 6]],
      ["Journée culturelle et concours artistique", [4]],
      ["Journée de nettoyage et d'embellissement", [5]],
      ["Consultations publiques, événement de clôture et rapport final", [6]]
    ];
    shareAt = (months, upTo) => months.filter((m) => m <= upTo).length / months.length;
    monthsText = (months) => months.length === 6 ? "M1 à M6" : months.map((m) => `M${m}`).join(", ");
    DOSSIER_TDR = `
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
${table(["Indicateur", "Cible"], [
      ["Notoriété du MGP dans les quartiers ciblés (enquête)", "au moins 80 %"],
      ["Satisfaction des plaignants (enquête)", "au moins 80 %"],
      ["Plaintes sensibles transmises à l'UCP sous 24 heures", "100 %"],
      ["Points focaux formés et équipés", "30"],
      ["Membres des comités formés", "30"],
      ["Sessions de sensibilisation des travailleurs", "12"],
      ["Causeries éducatives réalisées", "30 (une par mois et par quartier)"],
      ["Séances de théâtre-forum", "4"]
    ])}
<h3>6. Équipe clé</h3>
<p>Un chef de mission (coordination, liaison avec l'UCP, validation des livrables, appui au comité communal de liaison) ; une spécialiste VBG/MGP ; un chargé de projet/programme (suivi-évaluation, logistique, administration) ; deux animateurs communautaires ; un appui comptable à temps partiel.</p>
<h3>7. Livrables et calendrier</h3>
${table(["Livrable", "Échéance"], [
      ["Rapport de démarrage", "Fin M1"],
      ["Rapports mensuels d'activités", "Chaque mois"],
      ["Enquêtes de notoriété et de satisfaction du MGP", "Mi-parcours (M3) et fin de mission (M6)"],
      ["Évaluation de la stratégie de communication", "M6"],
      ["Rapport final et séance de restitution", "M6"]
    ])}
<h3>Chronogramme des activités</h3>
${table(["Activité", "M1", "M2", "M3", "M4", "M5", "M6"], CHRONO.map(([a, months]) => [a, ...[1, 2, 3, 4, 5, 6].map((m) => months.includes(m) ? "■" : "")]))}
<p>Une activité prévue sur un seul mois doit être entièrement réalisée (et sa dépense engagée) ce mois-là ; une activité répartie sur plusieurs mois se réalise au même rythme chacun de ses mois.</p>
<h3>8. Moyens à mobiliser</h3>
<p>Les quatre agents de terrain (chef de mission, spécialiste VBG/MGP, chargé de projet et animateur communautaire 2) disposent chacun d'une moto avec casque et d'un smartphone de service. Chaque membre de l'équipe, appui comptable compris, travaille sur un ordinateur portable. Les 30 points focaux reçoivent chacun un kit (sac, chasuble, carnet, fiches du MGP) et partagent des tablettes pour la collecte, à raison d'une tablette pour trois points focaux. Une boîte à plaintes est installée dans chaque quartier ciblé. Les archives et le registre confidentiel des plaintes sensibles sont conservés dans deux armoires sécurisées distinctes. Une trousse de premiers secours est gardée au bureau et une autre accompagne les déplacements.</p>
<h3>9. Contraintes connues</h3>
<p>Saison des pluies qui rend certains quartiers difficiles d'accès ; coupures d'électricité et d'internet ; délai de 24 heures pour les plaintes sensibles ; confidentialité stricte des données des plaignants ; mission courte, avec des pics de charge au démarrage et à la clôture.</p>
`;
    DOSSIER_OFFRE = `
<p>Montants en FCFA, durée de la mission : 6 mois. Les prix unitaires sont des estimations à confirmer par devis.</p>
<h3>1. Récapitulatif</h3>
${table(["Rubrique", "Montant"], [
      ["A. Personnel (équipe clé et appui comptable, charges patronales de 16,5 % comprises)", fcfa(personnelTotal)],
      ["B. Activités du projet", fcfa(activitiesTotal)],
      ["C. Achats et équipements", fcfa(achatsTotal)],
      ["D. Fonctionnement (loyer, énergie, communication, carburant, assurance, fournitures, missions)", fcfa(FONCTIONNEMENT)],
      ["E. Frais de gestion", "10 % des coûts directs (A + B + C + D)"],
      ["TVA", "18 % du total hors taxes"]
    ])}
<h3>2. Personnel (6 mois)</h3>
${table(
      ["Poste", "Salaire brut mensuel", "Coût mensuel employeur", "Montant sur 6 mois"],
      PERSONNEL.map(([p, s]) => [p, fcfa(s), fcfa(Math.round(s * (1 + CHARGES))), fcfa(Math.round(s * (1 + CHARGES)) * MONTHS)])
    )}
<h3>3. Activités du projet</h3>
${table(
      ["Rubrique", "Désignation", "Unité", "Quantité", "Prix unitaire", "Montant"],
      ACTIVITIES.map(([r, d, u, q, p]) => [r, d, u, q, fcfa(p), fcfa(q * p)])
    )}
<h3>4. Achats et équipements</h3>
${table(["Catégorie", "Montant"], ACHATS.map(([c, v]) => [c, fcfa(v)]))}
<h3>5. Prix unitaires retenus pour les équipements (devis)</h3>
${table(["Équipement", "Effectif requis", "Base de calcul (TDR, moyens à mobiliser)", "Prix unitaire"], [
      ["Moto 125 cc tout-terrain", "4", "Une par agent de terrain", fcfa(55e4)],
      ["Casque de moto homologué", "4", "Un par moto", fcfa(25e3)],
      ["Smartphone de service", "4", "Un par agent de terrain", fcfa(45e3)],
      ["Ordinateur portable (Core i5, 8 Go)", "6", "Un par membre de l'équipe, appui comptable compris", fcfa(63e4)],
      ["Tablette Android pour KoboToolbox", "10", "Une pour trois points focaux (30 ÷ 3)", fcfa(85e3)],
      ["Kit de point focal (sac, chasuble, carnet, fiches)", "30", "Un par point focal", fcfa(15e3)],
      ["Boîte à plaintes métallique avec cadenas", "5", "Une par quartier ciblé", fcfa(35e3)],
      ["Armoire métallique sécurisée à serrure", "2", "Archives et registre confidentiel des plaintes sensibles", fcfa(95e3)],
      ["Trousse de premiers secours", "2", "Une au bureau, une pour les déplacements", fcfa(2e4)]
    ])}
<h3>6. Hypothèses</h3>
<ul>
<li>Durée de la mission : 6 mois ; 5 quartiers ciblés ; 30 points focaux et 30 membres de comités à former.</li>
<li>Charges patronales : 16,5 % du salaire brut ; frais de gestion : 10 % des coûts directs ; TVA : 18 % (à retirer si l'ONG n'est pas assujettie).</li>
<li>Le matériel déjà détenu par l'ONG est mis à disposition sans être facturé.</li>
<li>Point à aligner : 12 sessions de sensibilisation des travailleurs dans l'offre technique, 6 dans le cadre logique.</li>
</ul>
`;
    LOGFRAME_COLS = ["Niveau", "Résumé narratif", "Indicateurs et cibles à 6 mois", "Sources de vérification", "Hypothèses et risques"];
    DOSSIER_CADRE_LOGIQUE = `
<p>Extrait du rapport de démarrage. Les produits ci-dessous servent de trame au rapport à mi-parcours.</p>
<h3>Tableau 5 : cadre logique des résultats de la mission 1 (animation communautaire et mobilisation sociale)</h3>
${table(LOGFRAME_COLS, [
      ["Résultat 1", "Les parties prenantes locales sont informées, sensibilisées et mobilisées autour du projet.", "Taux de participation aux activités ≥ 60 % ; ≥ 50 % de femmes parmi les participants ; ≥ 95 % de la population cible informée", "Listes de présence, enquête de satisfaction", "Les communautés restent disponibles malgré le calendrier agricole ; les leaders adhèrent au projet"],
      ["Produit 1.1", "La cartographie des acteurs est réalisée et tenue à jour.", "1 base de données transmise à l'UCP et actualisée en continu", "Base de données, accusé de réception de l'UCP", "Les autorités et les acteurs acceptent de partager l'information"],
      ["Produit 1.2", "Les événements communautaires majeurs sont organisés.", "6 événements réalisés", "PV, photos, comptes rendus", "Les conditions de sécurité et la météo permettent la tenue des événements"],
      ["Produit 1.3", "Les émissions radio sont produites et diffusées en français et en langue locale.", "6 émissions diffusées", "Attestations de diffusion", "Les radios locales sont disponibles et couvrent la commune"],
      ["Produit 1.4", "Les causeries, focus groups et séances de théâtre-forum sont animés.", "≥ 24 séances de sensibilisation ; 1 causerie par mois et par quartier", "Rapports mensuels, listes de présence", "Les relais communautaires sont mobilisés dans chaque quartier"],
      ["Produit 1.5", "Les supports de communication sont produits et distribués.", "8 500 supports produits (500 affiches, 3 000 dépliants MGP, 5 000 flyers, 12 kakémonos, 20 banderoles, 1 000 T-shirts, 300 chasubles)", "Bons de livraison, rapport de distribution", "Les validations de l'UCP et les autorisations d'affichage sont obtenues à temps"],
      ["Produit 1.6", "Le CCL fonctionne avec l'appui de l'ONG.", "6 séances mensuelles avec PV", "PV de réunion", "Les membres du CCL sont désignés et disponibles"]
    ])}
<h3>Tableau 6 : cadre logique du résultat 2 (mission 2 : appui au MGP et prévention des EAS/HS/VBG)</h3>
${table(LOGFRAME_COLS, [
      ["Résultat 2", "Un MGP accessible et fonctionnel est en place, et les risques d'EAS/HS/VBG sont prévenus.", "Notoriété du MGP ≥ 80 % ; plaintes ordinaires traitées dans les délais ≥ 90 % ; satisfaction des plaignants ≥ 80 % ; 100 % des plaintes sensibles transmises à l'UCP sous 24 h", "Registre MGP, registre confidentiel, enquêtes de satisfaction", "Les populations osent déposer des plaintes ; les normes sociales ne freinent pas la dénonciation des VBG"],
      ["Produit 2.1", "Le MGP local est opérationnel.", "5 boîtes à suggestions installées ; 2 lignes téléphoniques activées", "Photos, attestations d'installation et d'activation", "Les emplacements sont acceptés par les communautés"],
      ["Produit 2.2", "Les plaintes sont enregistrées, catégorisées et traitées.", "Nombre de plaintes reçues (suivi continu) ; nombre de cas VBG/EAS/HS référencés (suivi continu)", "Registre MGP, base de données MGP, rapport mensuel", "Les niveaux de traitement du MGP répondent dans les délais"],
      ["Produit 2.3", "Les membres du CLGP et du CCL sont formés.", "30 membres formés", "PV de formation, listes de présence, résultats des tests", "Les membres sont disponibles aux dates prévues"],
      ["Produit 2.4", "Les travailleurs de chantier sont sensibilisés aux codes de conduite.", "6 sessions réalisées ; 50 personnels d'entreprises formés", "Rapports de session, listes de présence", "Les entreprises libèrent leurs travailleurs et signent les codes de conduite"],
      ["Produit 2.5", "Les points focaux sont dotés de kits et d'outils de collecte.", "30 points focaux formés et équipés", "Fiches de remise, PV de formation", "Les outils numériques fonctionnent avec la couverture réseau locale"],
      ["Produit 2.6", "La coordination avec les structures de prise en charge des VBG est établie.", "1 protocole de référencement validé ; 1 annuaire des services à jour", "Protocole, annuaire, rapports de coordination", "Les services de santé, psychosociaux et juridiques acceptent de collaborer"]
    ])}
`;
    DOSSIER_DICTIONNAIRE = `
<p>Le dictionnaire précise, pour chaque indicateur, ce qu'il mesure exactement et comment on le renseigne. Deux personnes doivent obtenir la même valeur en l'appliquant.</p>
${table(["Indicateur", "Définition et mode de calcul", "Source de vérification", "Fréquence", "Responsable", "Désagrégation", "Cible"], [
      ["Causeries éducatives réalisées", "Nombre de causeries tenues avec un compte rendu et une liste de présence (somme des mois)", "Rapports de causerie, listes de présence", "Mensuelle", "Animateurs communautaires", "Quartier ; sexe et âge des participants", "30"],
      ["Émissions radio diffusées", "Nombre d'émissions passées à l'antenne", "Attestations de diffusion de la radio", "Mensuelle", "Chef de mission", "Langue (français, langue locale)", "6"],
      ["Points focaux formés et équipés", "Nombre de points focaux ayant suivi toute la formation et reçu leur kit", "Listes de présence, fiches de remise des kits", "À chaque formation", "Spécialiste VBG/MGP", "Sexe, quartier", "30"],
      ["Séances de théâtre-forum", "Nombre de séances tenues", "Rapports de séance, photos (avec consentement)", "Mensuelle", "Animateur communautaire 2", "Quartier", "4"],
      ["Sessions de sensibilisation des travailleurs", "Nombre de sessions tenues sur les chantiers", "Listes de présence des travailleurs", "Mensuelle", "Spécialiste VBG/MGP", "Chantier, sexe", "12"],
      ["Membres des comités formés", "Nombre de membres ayant suivi les deux jours de formation", "Listes de présence, tests avant et après", "À chaque formation", "Spécialiste VBG/MGP", "Sexe, comité", "30"],
      ["Plaintes ordinaires traitées dans les délais", "Plaintes ordinaires clôturées dans le délai fixé ÷ plaintes ordinaires reçues × 100", "Registre du MGP", "Mensuelle", "Spécialiste VBG/MGP", "Quartier, type de plainte, sexe du plaignant", "90 %"],
      ["Plaintes sensibles transmises à l'UCP sous 24 heures", "Plaintes sensibles transmises sous 24 heures ÷ plaintes sensibles reçues × 100", "Registre confidentiel (aucune donnée nominative rapportée)", "Mensuelle", "Spécialiste VBG/MGP", "Aucune désagrégation nominative", "100 %"],
      ["Notoriété du MGP", "Personnes enquêtées citant au moins un canal du MGP ÷ personnes enquêtées × 100", "Enquête de notoriété", "Mi-parcours (M3) et fin de mission (M6)", "Chargé de projet", "Sexe, âge, quartier", "au moins 80 %"]
    ])}
`;
    LINES1 = [
      ["Causeries éducatives dans les quartiers", 30, 2e4],
      ["Formation des comités : indemnités (2 jours)", 60, 8e3],
      ["Carburant des motos (litres)", 600, 900],
      ["Séances de théâtre-forum", 4, 25e4]
    ];
    LOG = [
      ["Motos 125 cc", 4, 1, 55e4],
      ["Smartphones de service", 4, 0, 45e3],
      ["Ordinateurs portables", 6, 2, 63e4],
      ["Tablettes pour KoboToolbox", 10, 0, 85e3],
      ["Kits des points focaux", 30, 0, 15e3],
      ["Boîtes à plaintes", 5, 0, 35e3],
      ["Armoires sécurisées", 2, 1, 95e3],
      ["Trousses de premiers secours", 2, 2, 2e4]
    ];
    MODES = ["Existant", "À acquérir", "Location", "Mise à disposition par un partenaire"];
    statutOf = (req, dispo, mode) => {
      if (req === null || dispo === null || !mode || req <= 0) return null;
      if (dispo >= req) return mode === "À acquérir" ? "Incohérent" : "Couvert";
      if (mode === "Existant") return "Incohérent";
      return dispo <= 0 ? "Non couvert" : "Partiellement couvert";
    };
    ecartOf = (c, i) => {
      const req = c.num(`q${i}`), dispo = c.num(`d${i}`);
      return req === null || dispo === null ? null : Math.max(0, req - dispo);
    };
    POSTES = [
      "Chef de mission",
      "Chargé de projet",
      "Spécialiste VBG/MGP",
      "Animateur communautaire 1",
      "Animateur communautaire 2",
      "Appui comptable",
      "Animateur bénévole 1",
      "Animateur bénévole 2",
      "Animateur bénévole 3",
      "Animateur bénévole 4"
    ];
    BENEVOLES = [6, 7, 8, 9];
    MOIS = [1, 2, 3, 4];
    DISPO = [[22, 2, 2], [22, 0, 2], [22, 1, 2], [22, 2, 1], [22, 1, 1], [11, 0, 1], [10, 0, 1], [10, 0, 1], [10, 0, 1], [10, 0, 1]];
    ACTS = [
      ["Pilotage, supervision et rapports", [8, 6, 6, 6]],
      ["Cartographie des acteurs", [6, 2, 0, 0]],
      ["Production et distribution des supports", [10, 4, 2, 2]],
      ["Logistique, achats et suivi budgétaire", [8, 5, 5, 5]],
      ["Installation et fonctionnement du MGP (plaintes)", [9, 8, 8, 8]],
      ["Formation des comités et des points focaux", [6, 10, 2, 0]],
      ["Causeries dans les cinq quartiers", [10, 10, 10, 10]],
      ["Événements communautaires (lancement, tournoi, journée culturelle)", [6, 12, 10, 10]],
      ["Émissions radio et comité communal de liaison", [5, 5, 5, 5]],
      ["Comptabilité et justificatifs", [6, 6, 6, 6]]
    ];
    MGP_ACT = 4;
    COMPTA_ACT = 9;
    ROLES = ["Responsable", "Appui (facultatif)"];
    lectureOf = (t) => t < 60 ? "Sous-charge" : t <= 90 ? "Équilibré" : t <= 100 ? "Tendu" : "Surcharge";
    cell0 = (c, id) => c.num(id) ?? 0;
    OUVRES = 22;
    workedOf = (c, p) => {
      if (BENEVOLES.includes(p)) return DISPO[p][0] - DISPO[p][1] - DISPO[p][2];
      const o = c.num("ouvres"), a = c.num(`c${p}`), r = c.num(`r${p}`);
      return o === null ? null : o - (a ?? 0) - (r ?? 0);
    };
    unavailableOf = (p) => OUVRES - DISPO[p][0] + DISPO[p][1];
    toneOf = (t) => t < 60 ? "low" : t <= 90 ? "ok" : t <= 100 ? "high" : "over";
    POSTE_KEYS = [
      ["chef de mission", "chef"],
      ["charge de projet"],
      ["specialiste", "vbg"],
      ["animateur communautaire 1", "animateur 1"],
      ["animateur communautaire 2", "animateur 2"],
      ["appui comptable", "comptable"],
      ["benevole 1", "benevole"],
      ["benevole 2", "benevole"],
      ["benevole 3", "benevole"],
      ["benevole 4", "benevole"]
    ];
    ACT_KEYS = ["pilotage", "cartographie", "support", "logistique", "mgp", "formation", "causerie", "evenement", "radio", "comptab"];
    chefDaysM1 = (c, i) => ROLES.reduce((k, _r, j) => k + (c.text(`p${i}${j}`) === POSTES[0] ? cell0(c, `d${i}${j}m1`) : 0), 0);
    urgRetOf = (c, i) => {
      const u = level(c.text(`eu${i}`));
      return u === null ? null : Math.min(3, u + (c.text(`eb${i}`) === "Oui" ? 1 : 0));
    };
    chefQuad = (c, i) => {
      if (c.text(`es${i}`) === "Oui") return 1;
      const imp = level(c.text(`ei${i}`)), u = urgRetOf(c, i);
      if (imp === null || u === null) return null;
      return imp >= 2 && u >= 2 ? 1 : imp >= 2 ? 2 : u >= 2 ? 3 : 4;
    };
    DELAIS = ["Sous 48 h", "Cette semaine ou ce mois", "Réponse sous 24 h", "Revue mensuelle"];
    fr = (v) => r1(v).toLocaleString("fr-FR");
    chargeOf = (c, p, m) => ACTS.reduce((n, _a, i) => n + ROLES.reduce((k, _r, j) => k + (c.text(`p${i}${j}`) === POSTES[p] ? cell0(c, `d${i}${j}m${m}`) : 0), 0), 0);
    rateOf = (c, p, m) => {
      const w = workedOf(c, p);
      return w && w > 0 ? chargeOf(c, p, m) / w * 100 : null;
    };
    assignedOf = (c, i, m) => ROLES.reduce((k, _r, j) => k + (c.text(`p${i}${j}`) ? cell0(c, `d${i}${j}m${m}`) : 0), 0);
    anyAssigned = (c) => ACTS.some((_a, i) => MOIS.some((m) => assignedOf(c, i, m) > 0));
    extremeOf = (c, m, dir) => {
      if (!anyAssigned(c)) return null;
      const rates = POSTES.map((_p, p) => rateOf(c, p, m));
      if (rates.some((r) => r === null)) return null;
      let best = 0;
      rates.forEach((r, p) => {
        if ((r - rates[best]) * dir > 0) best = p;
      });
      return POSTES[best];
    };
    SAMPLE3 = [
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
    sample3 = () => {
      const s = {};
      s.ouvres = String(OUVRES);
      POSTES.forEach((_p, p) => {
        if (!BENEVOLES.includes(p)) {
          s[`c${p}`] = String(unavailableOf(p));
          s[`r${p}`] = String(DISPO[p][2]);
        }
      });
      SAMPLE3.forEach((lines, i) => lines.forEach(([p, days], j) => {
        s[`p${i}${j}`] = POSTES[p];
        days.forEach((d, k) => {
          s[`d${i}${j}m${k + 1}`] = d ? String(d) : "";
        });
      }));
      [[0, 3, 3], [1, 3, 1], [8, 2, 1]].forEach(([i, imp, urg]) => {
        s[`ei${i}`] = IMPORTANCES[imp - 1];
        s[`eu${i}`] = IMPORTANCES[urg - 1];
        s[`eb${i}`] = "Non";
        s[`es${i}`] = "Non";
      });
      return s;
    };
    TASKS = [
      ["Transmettre à l'UCP une plainte de harcèlement sexuel reçue ce matin (délai à respecter : 24 heures)", [3], 1, false, true],
      ["Remettre à l'UCP le rapport mensuel d'activités, attendu dans 2 jours", [3], 2, false, false],
      ["Valider avec l'UCP les maquettes des affiches : l'imprimeur attend cette validation pour lancer l'impression ; rendez-vous possible dans 10 jours", [2, 3], 10, true, false],
      ["Installer les 5 boîtes à plaintes : les animateurs attendent leur installation pour annoncer les canaux du MGP ; à faire dans 7 jours", [3], 7, true, false],
      ["Renouveler le forfait internet du bureau, qui expire dans 2 jours ; sans lui, l'équipe ne peut plus envoyer les données KoboToolbox", [2, 3], 2, true, false],
      ["Organiser une visite dans le quartier 4, où une agression a été signalée près d'une boîte à plaintes ; visite à prévoir dans les 20 jours", [2, 3], 20, false, true],
      ["Former les 30 points focaux à KoboToolbox, formation prévue dans 30 jours", [3], 30, false, false],
      ["Préparer la cérémonie officielle de lancement, prévue dans 25 jours", [3], 25, false, false],
      ["Préparer l'enquête de notoriété du MGP de mi-parcours, prévue dans 45 jours", [3], 45, false, false],
      ["Mettre à jour la cartographie des acteurs, à présenter au comité de liaison dans 20 jours", [2, 3], 20, false, false],
      ["Répondre à une demande d'information générale d'une ONG partenaire, dans les 5 jours", [1], 5, false, false],
      ["Participer à une réunion externe sans ordre du jour, dans 2 jours", [1], 2, false, false],
      ["Commander des stylos et du papier pour le bureau : le stock suffit encore pour 12 jours", [1], 12, false, false],
      ["Reclasser les photos du dernier événement dans le dossier partagé, à faire d'ici 40 jours", [1], 40, false, false]
    ];
    IMPORTANCES = ["1 · faible", "2 · moyenne", "3 · forte"];
    URGENCES = ["1 · plus de 15 jours", "2 · de 3 à 15 jours", "3 · moins de 3 jours"];
    OUI_NON = ["Oui", "Non"];
    DECISIONS = ["Faire maintenant", "Planifier", "Déléguer ou décliner", "Éliminer, regrouper ou reporter"];
    urgOf = (days, blocks) => Math.min(3, (days > 15 ? 1 : days >= 3 ? 2 : 3) + (blocks ? 1 : 0));
    quadOf = (imp, urg, safety) => safety ? 1 : imp >= 2 ? urg >= 2 ? 1 : 2 : urg >= 2 ? 3 : 4;
    level = (t) => {
      const n = parseInt(t, 10);
      return n >= 1 && n <= 3 ? n : null;
    };
    urgFromEntries = (c, i) => {
      const days = c.num(`j${i}`), b = c.text(`b${i}`);
      return days === null || !b ? null : urgOf(days, b === "Oui");
    };
    quadFromEntries = (c, i) => {
      const imp = level(c.text(`i${i}`)), urg = level(c.text(`u${i}`)), s = c.text(`s${i}`);
      return imp === null || urg === null || !s ? null : quadOf(imp, urg, s === "Oui");
    };
    QUAD_LABELS = ["1 · Important et urgent", "2 · Important, pas urgent", "3 · Urgent, peu important", "4 · Ni urgent ni important"];
    IND = [
      ["Causeries éducatives réalisées", 30, [1, 2, 3, 4, 5, 6], 12],
      ["Émissions radio diffusées", 6, [1, 2, 3, 4, 5, 6], 3],
      ["Points focaux formés et équipés", 30, [1, 2], 30],
      ["Membres des comités formés", 30, [1, 2], 24],
      ["Sessions de sensibilisation des travailleurs", 12, [1, 2, 3, 4, 5, 6], 4],
      ["Séances de théâtre-forum", 4, [3, 5], 1],
      ["Tournoi sportif communautaire", 1, [3], 0],
      ["Cérémonie officielle de lancement", 1, [2], 1]
    ];
    IND_KEYS = ["causerie", "radio", "points focaux", "comite", "travailleur", "theatre", "tournoi", "ceremonie"];
    TRAJ = ["Dans la trajectoire", "Léger retard", "Retard important"];
    trajOf = (t) => t >= 90 ? "Dans la trajectoire" : t >= 60 ? "Léger retard" : "Retard important";
    indPlanned = (i) => r1(IND[i][1] * shareAt(IND[i][2], 3));
    indRate = (c, i) => {
      const rv = c.num(`rv${i}`), pv = indPlanned(i);
      return rv === null || pv <= 0 ? null : rv / pv * 100;
    };
    MGP_IND = [
      ["Plaintes ordinaires traitées dans les délais", "plaintes ordinaires reçues", 90, 18, 20],
      ["Plaintes sensibles transmises à l'UCP sous 24 heures", "plaintes sensibles reçues", 100, 3, 3],
      ["Notoriété du MGP (enquête de mi-parcours) : personnes qui citent au moins un canal", "personnes enquêtées", 80, 252, 400]
    ];
    MGP_KEYS = [["delai"], ["sensible", "24 heures", "24h"], ["notoriete"]];
    MGP_TRAJ = ["Cible atteinte", "En dessous de la cible"];
    mgpVal = (c, k) => {
      const n = c.num(`mn${k}`), b = c.num(`mb${k}`);
      return n === null || b === null || b <= 0 ? null : r1(n / b * 100);
    };
    BUD_LINES = [
      ["Cérémonie officielle de lancement", 9e5, [2]],
      ["Émissions radio mensuelles", 9e5, [1, 2, 3, 4, 5, 6]],
      ["Causeries éducatives dans les quartiers", 6e5, [1, 2, 3, 4, 5, 6]],
      ["Séances de théâtre-forum", 1e6, [3, 5]],
      ["Formation des comités : indemnités", 48e4, [1, 2]],
      ["Sessions de sensibilisation des travailleurs", 9e5, [1, 2, 3, 4, 5, 6]]
    ];
    JOURNAL = [
      [1, 9, "Collations et matériel des causeries dans les quartiers 1 à 5", 1e5, 2],
      [1, 14, "Session de sensibilisation n° 1 des travailleurs de chantier", 75e3, 5],
      [1, 27, "Radio locale : passage antenne de l'émission du mois 1", 15e4, 1],
      [2, 6, "Indemnités de participation à la formation des comités (30 participants × 2 jours × 8 000)", 48e4, 4],
      [2, 11, "Carburant des motos (fonctionnement)", 9e4, -1],
      [2, 15, "Location de la sonorisation et du chapiteau pour la cérémonie de lancement", 35e4, 0],
      [2, 15, "Collation des invités de la cérémonie de lancement", 42e4, 0],
      [2, 15, "Animation et artistes de la cérémonie de lancement", 165e3, 0],
      [2, 19, "Session de sensibilisation n° 2 des travailleurs de chantier", 75e3, 5],
      [2, 22, "Collations et matériel des causeries du mois 2", 14e4, 2],
      [2, 26, "Radio locale : passage antenne de l'émission du mois 2", 15e4, 1],
      [3, 8, "Troupe théâtrale : première séance de théâtre-forum", 6e5, 3],
      [3, 8, "Sonorisation de la séance de théâtre-forum", 22e4, 3],
      [3, 12, "Sessions de sensibilisation n° 3 et 4 des travailleurs de chantier", 15e4, 5],
      [3, 20, "Collations et matériel des causeries du mois 3", 16e4, 2],
      [3, 27, "Radio locale : passage antenne de l'émission du mois 3", 15e4, 1]
    ];
    spentIn = (line, month) => JOURNAL.filter((j) => j[4] === line && j[0] === month).reduce((n, j) => n + j[3], 0);
    SITUATIONS = ["OK", "En retard", "Attention", "Dépassé"];
    situationOf = (spent, budget, planned) => spent > budget ? "Dépassé" : spent > planned ? "Attention" : planned > 0 && spent < 0.8 * planned ? "En retard" : "OK";
    RYTHMES = ["Trop rapide", "Normal", "Trop lent"];
    rythmeOf = (gapPct2) => gapPct2 > 5 ? "Trop rapide" : gapPct2 < -5 ? "Trop lent" : "Normal";
    lineSpent = (c, i) => [1, 2, 3].reduce((n, m) => n + (c.num(`m${m}l${i}`) ?? 0), 0);
    plannedOf = (c, i) => c.num(`pv${i}`);
    lineSituation = (c, i) => {
      const pv = plannedOf(c, i);
      return pv === null ? null : situationOf(lineSpent(c, i), BUD_LINES[i][1], pv);
    };
    budTotal = BUD_LINES.reduce((n, b) => n + b[1], 0);
    totalSpent = (c) => BUD_LINES.reduce((n, _b, i) => n + lineSpent(c, i), 0);
    totalPlanned = (c) => BUD_LINES.reduce((n, _b, i) => n + (plannedOf(c, i) ?? 0), 0);
    gapPct = (c) => {
      const pv = totalPlanned(c);
      return pv > 0 ? (totalSpent(c) - pv) / pv * 100 : null;
    };
    words = (s) => (s.trim().match(/[\p{L}\p{N}]+/gu) || []).length;
    plain = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    set = {
      courseId: "management-pilotage-communautaire",
      title: "Travaux pratiques : projet PGC-Vie",
      intro: "Ces exercices vous mettent en situation sur un même projet. Lisez d'abord le dossier du projet (termes de référence et offre financière), puis remplissez les tableaux et rédigez vos réponses directement sur le site. Chaque tableau est corrigé dès que vous le validez : les réponses incorrectes vous sont signalées. Chaque rédaction est acceptée à partir de 80 % des éléments attendus ; sinon, la correction vous indique ce qui manque et vous la refaites. Vous pouvez parcourir librement tous les exercices ; dès que vous commencez à en remplir un, validez-le avant de passer à un autre. Ces travaux pratiques comptent pour 60 % de la note finale du certificat (les quiz pour 40 %) : chaque exercice validé compte avec la note de vos réponses enregistrées, un exercice non validé compte 0 %, et le certificat n'est délivré qu'une fois tous les exercices validés, avec une note des travaux pratiques d'au moins 80 %.",
      dossier: [
        { id: "tdr", title: "Termes de référence de la mission", html: DOSSIER_TDR },
        { id: "offre", title: "Offre financière de la mission", html: DOSSIER_OFFRE },
        { id: "dictionnaire", title: "Dictionnaire des indicateurs", html: DOSSIER_DICTIONNAIRE },
        { id: "cadre-logique", title: "Cadre logique des résultats (rapport de démarrage)", html: DOSSIER_CADRE_LOGIQUE }
      ],
      exercises: [
        {
          kind: "writing",
          id: "comprehension-tdr",
          title: "Rédaction 1 : la compréhension de la mission",
          skill: "Offre technique",
          prompt: "<p>À partir des termes de référence du dossier, rédigez la section « Compréhension du contexte et de la mission » de votre offre technique (10 à 15 lignes). Montrez que vous avez compris les enjeux, la zone et les bénéficiaires, les deux missions, les résultats attendus, les contraintes et les livrables, sans recopier les TDR.</p>",
          minWords: 90,
          criteria: [
            { label: "Le contexte et les enjeux du projet (travaux, cadre de vie, aspects sociaux)", keywords: ["cadre de vie", "travaux", "chantier", "aspects sociaux", "acceptation", "enjeu", "nuisance"] },
            { label: "La zone et les bénéficiaires (quartiers, femmes, jeunes, groupes vulnérables)", keywords: ["quartier", "akoupe", "beneficiair", "femme", "jeune", "vulnerab", "population", "habitant"] },
            { label: "La mission 1 : animation et mobilisation communautaire", keywords: ["animation", "mobilisation", "sensibilis", "causerie", "evenement", "radio", "theatre"] },
            { label: "La mission 2 : gestion des plaintes et prévention des violences", keywords: ["plainte", "mgp", "vbg", "violence", "eas$", "harcelement", "referencement"] },
            { label: "Les résultats attendus et les indicateurs (notoriété, satisfaction, 80 %)", keywords: ["notoriete", "satisfaction", "80", "indicateur", "cible", "resultat"] },
            { label: "Les contraintes ou les risques (pluies, délai de 24 heures, confidentialité, durée courte)", keywords: ["contrainte", "risque", "pluie", "24", "confidential", "six mois", "6 mois", "delai"] },
            { label: "Les livrables (rapport de démarrage, rapports mensuels, rapport final)", keywords: ["rapport", "livrable", "demarrage", "mensuel", "final", "enquete"] }
          ]
        },
        {
          kind: "sheet",
          id: "offre-financiere",
          title: "Exercice 1 : recalculer l'offre financière",
          skill: "Offre financière",
          intro: "Avant de déposer l'offre, le chef de mission vous demande de vérifier les calculs. Complétez le montant de quelques lignes d'activités, puis le récapitulatif.",
          tables: [
            {
              title: "Lignes d'activités",
              columns: ["Désignation", "Quantité", "Prix unitaire (FCFA)", "Montant (FCFA)"],
              rows: LINES1.map(([d, q, p], i) => [d, num(q), num(p, "fcfa"), inp(`l${i}`, q * p, "fcfa")])
            },
            {
              title: "Récapitulatif",
              columns: ["Rubrique", "Montant (FCFA)"],
              rows: [
                ["A. Personnel", num(personnelTotal, "fcfa")],
                ["B. Activités", num(activitiesTotal, "fcfa")],
                ["C. Achats et équipements", num(achatsTotal, "fcfa")],
                ["D. Fonctionnement", num(FONCTIONNEMENT, "fcfa")],
                ["Coûts directs (A + B + C + D)", inp("direct", direct, "fcfa")],
                ["E. Frais de gestion (10 %)", inp("frais", frais, "fcfa")],
                ["Total hors taxes", inp("ht", ht, "fcfa")],
                ["TVA (18 %)", inp("tva", tva, "fcfa")],
                ["Total toutes taxes comprises", inp("ttc", ht + tva, "fcfa")],
                ["Coût mensuel moyen hors taxes", inp("mensuel", Math.round(ht / MONTHS), "fcfa", 2)],
                ["Part du personnel dans le total HT (%)", inp("partPerso", r1(personnelTotal / ht * 100), "pct")]
              ]
            }
          ],
          explanation: `<p>Les frais de gestion se calculent sur les coûts directs, jamais sur le total TTC. Le personnel représente près d'un tiers du total hors taxes : c'est la rubrique qui pèse le plus. Un paramètre (durée, TVA) isolé dans une feuille d'hypothèses permet de tout recalculer sans erreur.</p>`
        },
        {
          kind: "sheet",
          id: "diagnostic-logistique",
          title: "Exercice 2 : diagnostic des moyens logistiques",
          skill: "Démarrage du projet",
          intro: "<p>Pour chaque équipement, reportez la quantité requise (TDR, section « Moyens à mobiliser », et effectifs du tableau des devis dans l'offre financière). Reportez ensuite la quantité disponible d'après l'inventaire ci-dessous, choisissez le mode d'obtention et saisissez le prix unitaire constaté sur le terrain : les prix des devis de l'offre financière servent de repère, mais ils ont pu changer depuis. L'écart, le taux de couverture, le coût de l'écart et le statut se calculent automatiquement.</p><p><strong>Inventaire réalisé au démarrage :</strong> l'ONG dispose déjà d'une moto en état de marche, de deux ordinateurs portables, d'une armoire sécurisée et de deux trousses de premiers secours. Elle n'a ni smartphone de service, ni tablette, ni kit pour les points focaux, ni boîte à plaintes.</p>",
          rules: "<p>Saisissez des nombres dans les cases blanches et choisissez le mode d'obtention dans la liste. Le prix unitaire est libre (prix terrain) : il n'est pas noté, mais il doit être saisi pour chaque équipement à acquérir, car il sert au calcul du coût de l'écart. Les colonnes grisées se calculent seules. Un statut « Incohérent » signale que le mode d'obtention contredit les quantités : corrigez-le.</p>",
          tables: [{
            columns: ["Équipement", "Quantité requise", "Quantité disponible", "Mode d'obtention", "Prix unitaire (FCFA)", "Écart", "Taux de couverture", "Coût de l'écart (FCFA)", "Statut"],
            rows: [
              ...LOG.map(([m, req, dispo, pu], i) => [
                m,
                { id: `q${i}`, answer: req, tol: 0 },
                { id: `d${i}`, answer: dispo, tol: 0 },
                { id: `m${i}`, answer: dispo >= req ? "Existant" : "À acquérir", options: MODES },
                // Prix terrain : saisie libre (les prix peuvent avoir changé depuis les devis)
                { id: `p${i}`, fmt: "fcfa" },
                { id: `e${i}`, calc: (c) => ecartOf(c, i) },
                { id: `t${i}`, fmt: "pct", calc: (c) => {
                  const q = c.num(`q${i}`), d = c.num(`d${i}`);
                  return q === null || d === null || q <= 0 ? null : r1(Math.min(100, d / q * 100));
                } },
                { id: `k${i}`, fmt: "fcfa", calc: (c) => {
                  const e = ecartOf(c, i), p = c.num(`p${i}`);
                  return e === null || p === null ? null : e * p;
                } },
                { id: `s${i}`, calc: (c) => statutOf(c.num(`q${i}`), c.num(`d${i}`), c.text(`m${i}`)) }
              ]),
              ["Coût total de l'écart", "", "", "", "", "", "", { id: "total", fmt: "fcfa", calc: (c) => LOG.reduce((n, _l, i) => n + (c.num(`k${i}`) ?? 0), 0) }, ""]
            ]
          }],
          checks: [{
            label: "Un prix unitaire terrain est saisi pour chaque équipement à acquérir",
            test: (c) => LOG.some((_l, i) => (ecartOf(c, i) ?? 0) > 0) && LOG.every((_l, i) => (ecartOf(c, i) ?? 0) === 0 || (c.num(`p${i}`) ?? 0) > 0)
          }],
          sample: Object.fromEntries(LOG.map(([, , , pu], i) => [`p${i}`, String(pu)])),
          explanation: "<p>Les quantités se déduisent des TDR : une moto et un smartphone pour chacun des quatre agents de terrain, un ordinateur pour chacune des six personnes de l'équipe, une tablette pour trois points focaux (soit 10), un kit par point focal (30), une boîte à plaintes par quartier (5), deux armoires distinctes (archives et registre confidentiel) et deux trousses (bureau et déplacements). Seules les trousses sont entièrement couvertes : elles sont « Existant ». Le transport et l'informatique concentrent l'essentiel du coût de l'écart : ce sont les achats à budgéter en premier.</p>"
        },
        {
          kind: "sheet",
          id: "plan-de-charge",
          title: "Exercice 3 : plan de charge sur quatre mois",
          skill: "Management des équipes",
          intro: "<p>Construisez le plan de charge de l'équipe pour les mois 1 à 4, comme dans la matrice des charges.</p><p><strong>Disponibilité :</strong> chaque mois compte 22 jours ouvrés. Le chef de mission prend en moyenne 2 jours de congé et consacre 2 jours aux réunions de coordination par mois. Le chargé de projet n'a pas de congé et 2 jours de coordination. La spécialiste VBG/MGP a 1 jour d'absence et 2 jours de coordination. L'animateur communautaire 1 prend 2 jours de congé et a 1 jour de coordination. L'animateur communautaire 2 a 1 jour d'absence et 1 jour de coordination. L'appui comptable travaille à mi-temps : il n'est présent que 11 jours par mois, sans congé, dont 1 jour de coordination. Les quatre animateurs bénévoles sont présents 10 jours par mois chacun, dont 1 jour de coordination : leurs 9 jours travaillés sont déjà comptés dans le tableau 4 (ils ne figurent pas dans le tableau de disponibilité).</p><p><strong>Affectation :</strong> pour chaque activité, choisissez le poste responsable et, si besoin, un poste d'appui, puis estimez vous-même les jours de travail de chacun pour chaque mois. La charge et le taux de charge de chaque personne se calculent automatiquement et se colorent selon le niveau de charge. Une surcharge est acceptée : vous la traitez ensuite dans votre plan d'équilibre. Enfin, classez les activités du chef de mission au mois 1 selon la matrice d'Eisenhower révisée : le graphique se dessine à partir de vos choix ; commentez-le.</p>",
          rules: "<p>Saisissez une seule fois le nombre de jours ouvrés du mois : il est repris automatiquement pour tous les intervenants. Pour chaque personne, indiquez les jours non disponibles (temps partiel, congés, absences) et les jours de réunion et de coordination. Les colonnes grisées se calculent seules : jours travaillés = jours ouvrés − jours non disponibles − réunions et coordination ; charge du mois = somme des jours affectés à la personne ; taux de charge = charge ÷ jours travaillés. Code couleur : gris, sous-charge (moins de 60 %) ; bleu, équilibré (60 à 90 %) ; or, tendu (91 à 100 %) ; bordeaux, surcharge (plus de 100 %). Les animateurs bénévoles peuvent appuyer les activités de terrain, mais pas le traitement des plaintes, qui est confidentiel. Tableau 6 (modèle « Tâches de la semaine : tri selon la matrice d'Eisenhower révisée ») : importance et urgence de 1 à 3 ; une activité qui bloque un collègue gagne un niveau d'urgence (au plus 3) ; une activité qui touche la sécurité d'une personne passe au cadran 1, sans calcul ; sinon, importance ≥ 2 et urgence retenue ≥ 2 = faire maintenant (sous 48 h) ; importance ≥ 2 seule = planifier (cette semaine ou ce mois) ; urgence ≥ 2 seule = déléguer ou décliner (réponse sous 24 h) ; ni l'un ni l'autre = éliminer, regrouper ou reporter (revue mensuelle).</p>",
          tables: [
            {
              title: "1. Jours ouvrés du mois (une seule saisie, reprise pour tous les intervenants)",
              columns: ["Élément", "Valeur"],
              rows: [["Nombre de jours ouvrés par mois", { id: "ouvres", answer: OUVRES, tol: 0 }]]
            },
            {
              title: "2. Disponibilité mensuelle de chaque personne",
              columns: ["Poste", "Jours ouvrés (repris de la saisie)", "Jours non disponibles (temps partiel, congés, absences)", "Réunions et coordination", "Jours travaillés par mois"],
              rows: POSTES.flatMap((p, i) => BENEVOLES.includes(i) ? [] : [[
                p,
                { id: `oj${i}`, calc: (c) => c.num("ouvres") },
                { id: `c${i}`, answer: unavailableOf(i), tol: 0 },
                { id: `r${i}`, answer: DISPO[i][2], tol: 0 },
                { id: `w${i}`, calc: (c) => workedOf(c, i) }
              ]])
            },
            {
              title: "3. Matrice d'affectation des activités (jours de travail par mois, à estimer)",
              columns: ["Activité", "Rôle", "Poste", "Mois 1", "Mois 2", "Mois 3", "Mois 4"],
              rows: ACTS.flatMap(([a], i) => ROLES.map((role, j) => [
                j === 0 ? a : "",
                role,
                { id: `p${i}${j}`, options: POSTES },
                ...MOIS.map((m) => ({ id: `d${i}${j}m${m}` }))
              ]))
            },
            {
              title: "4. Charge et taux de charge de chaque personne, mois par mois",
              columns: ["Poste", "Jours travaillés par mois", "Mois 1", "Mois 2", "Mois 3", "Mois 4"],
              rows: POSTES.map((p, i) => [
                p,
                { id: `ww${i}`, calc: (c) => workedOf(c, i) },
                ...MOIS.map((m) => ({
                  id: `t${i}m${m}`,
                  calc: (c) => {
                    const t = rateOf(c, i, m);
                    return t === null ? null : `${chargeOf(c, i, m)} j · ${fr(t)} % · ${lectureOf(t)}`;
                  },
                  tone: (c) => {
                    const t = rateOf(c, i, m);
                    return t === null || !anyAssigned(c) ? null : toneOf(t);
                  }
                }))
              ]),
              legend: [
                { tone: "low", label: "Sous-charge : moins de 60 %" },
                { tone: "ok", label: "Équilibré : 60 à 90 %" },
                { tone: "high", label: "Tendu : 91 à 100 %" },
                { tone: "over", label: "Surcharge : plus de 100 %" }
              ],
              writing: {
                id: "plan-equilibre",
                title: "Plan d'équilibre de la charge",
                prompt: "<p>À partir des taux de charge du tableau 4, rédigez le plan d'équilibre de l'équipe : pour chaque poste en surcharge (en bordeaux), indiquez les jours que vous déplacez, vers qui ou vers quel mois, et avec quel levier (décaler, déléguer, mutualiser, renforcer) ; signalez les postes en sous-charge qui peuvent reprendre du travail, et le taux visé après rééquilibrage.</p>",
                minWords: 80,
                criteria: [
                  { label: "Les leviers utilisés (décaler, déléguer, mutualiser, renforcer)", keywords: ["decal", "deleg", "mutualis", "renforc", "report", "transfer", "confi"], need: 2 },
                  { label: "Les mois concernés", keywords: ["mois 1", "mois 2", "mois 3", "mois 4", "m1$", "m2$", "m3$", "m4$"] },
                  { label: "Le taux visé après rééquilibrage (au plus 100 %, idéalement de 60 à 90 %)", keywords: ["100 %", "100%", "90 %", "90%", "60 %", "60%", "equilibr", "taux"], need: 2 }
                ],
                // Selon les taux de l'apprenant : chaque poste en surcharge doit être traité ; un poste en sous-charge doit être sollicité
                dynamicCriteria: (c) => {
                  if (!anyAssigned(c)) return [];
                  const over = POSTES.map((_p, p) => p).filter((p) => MOIS.some((m) => (rateOf(c, p, m) ?? 0) > 100));
                  if (!over.length) return [{ label: "Aucun poste n'est en surcharge dans votre plan : vous le constatez et vous gardez une marge", keywords: ["aucun", "pas de surcharge", "marge", "equilibr"] }];
                  const out = over.map((p) => ({
                    label: `Le poste « ${POSTES[p]} », en surcharge (${MOIS.filter((m) => (rateOf(c, p, m) ?? 0) > 100).map((m) => `mois ${m} : ${fr(rateOf(c, p, m))} %`).join(" ; ")}), est rééquilibré`,
                    keywords: POSTE_KEYS[p]
                  }));
                  const under = POSTES.map((_p, p) => p).filter((p) => !over.includes(p) && MOIS.some((m) => {
                    const t = rateOf(c, p, m);
                    return t !== null && t < 60;
                  }));
                  if (under.length) out.push({ label: `Au moins un poste en sous-charge reprend une partie du travail (${under.map((p) => POSTES[p]).join(", ")})`, keywords: [...new Set(under.flatMap((p) => POSTE_KEYS[p]))] });
                  return out;
                }
              }
            },
            {
              title: "5. Décision",
              columns: ["Question", "Réponse"],
              rows: [
                ["D'après votre plan, quel poste a le taux de charge le plus élevé au mois 1 ?", { id: "plus", options: POSTES, answer: (c) => extremeOf(c, 1, 1) }],
                ["D'après votre plan, quel poste a le taux de charge le plus élevé au mois 2 ?", { id: "plus2", options: POSTES, answer: (c) => extremeOf(c, 2, 1) }],
                ["Si un poste dépassait 100 %, quel levier utiliser en premier ?", { id: "levier", options: ["Décaler", "Déléguer", "Mutualiser", "Renforcer"], answer: "Décaler" }]
              ]
            },
            {
              title: "6. Tri des activités du chef de mission au mois 1 (matrice d'Eisenhower révisée)",
              columns: ["Activité", "Jours du chef de mission (mois 1)", "Importance (1-3)", "Urgence (1-3)", "Bloque un collègue ?", "Touche la sécurité d'une personne ?", "Urgence retenue", "Cadran", "Décision", "Délai de traitement"],
              rows: ACTS.map(([a], i) => [
                a,
                { id: `ej${i}`, calc: (c) => chefDaysM1(c, i) },
                { id: `ei${i}`, options: IMPORTANCES },
                { id: `eu${i}`, options: IMPORTANCES },
                { id: `eb${i}`, options: OUI_NON },
                { id: `es${i}`, options: OUI_NON },
                { id: `er${i}`, calc: (c) => urgRetOf(c, i) },
                { id: `eq${i}`, calc: (c) => {
                  const q = chefQuad(c, i);
                  return q === null ? null : QUAD_LABELS[q - 1];
                } },
                { id: `ed${i}`, calc: (c) => {
                  const q = chefQuad(c, i);
                  return q === null ? null : DECISIONS[q - 1];
                } },
                { id: `et${i}`, calc: (c) => {
                  const q = chefQuad(c, i);
                  return q === null ? null : c.text(`es${i}`) === "Oui" ? "Immédiat : règle de sécurité" : DELAIS[q - 1];
                } }
              ]),
              showRow: (c, i) => chefDaysM1(c, i) > 0,
              emptyText: "Affectez d'abord des jours au chef de mission pour le mois 1 dans la matrice (tableau 3) : ses activités apparaîtront ici.",
              chart: {
                kind: "eisenhower",
                unit: "j",
                empty: "Le graphique se dessine dès que les activités du chef de mission au mois 1 sont classées (importance et urgence).",
                note: "Taille des bulles : jours du chef de mission au mois 1. Cadrans calculés à partir de votre tri, selon le modèle « Tâches de la semaine : tri selon la matrice d'Eisenhower révisée ».",
                items: (c) => ACTS.flatMap(([a], i) => {
                  const q = chefQuad(c, i), v = chefDaysM1(c, i);
                  return q === null || v <= 0 ? [] : [{ label: a, value: v, quadrant: q }];
                })
              },
              writing: {
                id: "eisenhower-chef",
                title: "Commentaire du graphique (200 mots au maximum)",
                prompt: "<p>Commentez le graphique d'Eisenhower du chef de mission au mois 1, en 200 mots au maximum : quelle part de son temps va à chaque cadran, ce qu'il doit garder et faire lui-même, ce qu'il doit planifier, et ce qu'il doit déléguer ou abandonner, et à qui.</p>",
                minWords: 60,
                maxWords: 200,
                criteria: [
                  { label: "La répartition de son temps entre les cadrans (jours ou pourcentages)", keywords: ["cadran", "quadrant", "%", "jours", "part$", "moitie", "essentiel"], need: 2 },
                  { label: "Ce qu'il garde et fait lui-même (cadran 1)", keywords: ["garde", "lui meme", "faire maintenant", "cadran 1", "priorit", "pilotage", "rapport", "plainte"], need: 2 },
                  { label: "Ce qu'il planifie (cadran 2)", keywords: ["planifi", "agenda", "programm", "cadran 2", "calendrier"] },
                  { label: "Ce qu'il délègue, et à qui", keywords: ["deleg", "confi", "charge de projet", "animateur", "appui comptable", "specialiste", "benevole"], need: 2 }
                ],
                // Selon le tri de l'apprenant : chaque activité qu'il a classée aux cadrans 3 ou 4 doit être discutée
                dynamicCriteria: (c) => ACTS.flatMap(([a], i) => {
                  const q = chefQuad(c, i);
                  if (q === null || q < 3 || chefDaysM1(c, i) <= 0) return [];
                  return [{ label: `L'activité « ${a} », que vous avez classée au cadran ${q} (${fr(chefDaysM1(c, i))} j au mois 1) : ${q === 3 ? "à déléguer" : "à éliminer, regrouper ou reporter"}`, keywords: [ACT_KEYS[i]] }];
                })
              }
            }
          ],
          checks: [
            { label: "Chaque activité a un poste responsable et des jours affectés", test: (c) => ACTS.every((_a, i) => !!c.text(`p${i}0`) && MOIS.some((m) => assignedOf(c, i, m) > 0)) },
            {
              label: "Le MGP est confié pour l'essentiel à la spécialiste VBG/MGP",
              test: (c) => {
                const all = MOIS.reduce((n, m) => n + assignedOf(c, MGP_ACT, m), 0);
                const spec = MOIS.reduce((n, m) => n + ROLES.reduce((k, _r, j) => k + (c.text(`p${MGP_ACT}${j}`) === POSTES[2] ? cell0(c, `d${MGP_ACT}${j}m${m}`) : 0), 0), 0);
                return all > 0 && spec >= all / 2;
              }
            },
            { label: "Aucun animateur bénévole n'est affecté au MGP (confidentialité des plaintes)", test: (c) => anyAssigned(c) && ROLES.every((_r, j) => !BENEVOLES.some((b) => c.text(`p${MGP_ACT}${j}`) === POSTES[b])) },
            { label: "La comptabilité et les justificatifs sont confiés à l'appui comptable", test: (c) => c.text(`p${COMPTA_ACT}0`) === POSTES[5] },
            {
              label: "Chaque activité du chef de mission au mois 1 est triée (importance, urgence, blocage, sécurité)",
              test: (c) => ACTS.some((_a, i) => chefDaysM1(c, i) > 0) && ACTS.every((_a, i) => chefDaysM1(c, i) <= 0 || ["ei", "eu", "eb", "es"].every((k) => !!c.text(`${k}${i}`)))
            }
          ],
          sample: sample3(),
          explanation: "<p>Il n'y a pas de plan unique : chacun estime ses charges, et une surcharge n'est pas une faute tant qu'elle est vue et traitée. Le chef de mission est le premier exposé : s'il garde seul le pilotage, la cartographie et la radio, il dépasse sa capacité dès le mois 1. Le plan d'équilibre utilise d'abord le décalage (une activité moins urgente glisse d'un mois), puis la délégation (cartographie à un animateur bénévole, logistique au chargé de projet), la mutualisation et, en dernier recours, le renfort. Les bénévoles appuient les causeries et les événements, jamais le MGP, qui reste chez la spécialiste pour la confidentialité des plaintes ; la comptabilité reste à l'appui comptable. Le tri d'Eisenhower du mois 1 montre si le temps du chef de mission va bien d'abord aux cadrans 1 et 2 ; une activité classée au cadran 3 se délègue, une activité du cadran 4 s'élimine, se regroupe ou se reporte.</p>"
        },
        {
          kind: "sheet",
          id: "matrice-eisenhower",
          title: "Exercice 4 : matrice d'Eisenhower révisée",
          skill: "Priorités de la semaine",
          intro: "<p>Lundi matin, l'équipe du PGC-Vie liste les tâches de la semaine. Pour chaque tâche, à partir de sa description : saisissez l'échéance en jours, choisissez le niveau d'importance et le niveau d'urgence, puis indiquez si la tâche bloque un collègue et si elle touche la sécurité d'une personne. Le cadran et la décision se calculent automatiquement à partir de vos choix, comme dans le classeur Excel de la matrice.</p><p>Une tâche ne rapporte son point que si toute la ligne est cohérente : échéance, blocage et sécurité conformes à la description, importance défendable et urgence conforme à la règle. La décision affichée découle alors du bon cadran.</p>",
          rules: "<p><strong>Importance</strong> : 3 si la tâche contribue directement à un résultat, à un indicateur, à la conformité avec l'UCP ou à la protection des personnes ; 2 si elle y contribue indirectement ; 1 si elle n'a pas d'effet sur les résultats. <strong>Urgence</strong> : 1 si l'échéance est à plus de 15 jours ; 2 de 3 à 15 jours ; 3 à moins de 3 jours ; une tâche qui bloque un collègue gagne un niveau (au maximum 3). <strong>Cadran</strong> : 1 si importance 2 ou 3 et urgence 2 ou 3 ; 2 si importance 2 ou 3 et urgence 1 ; 3 si importance 1 et urgence 2 ou 3 ; 4 si importance 1 et urgence 1 ; toute tâche qui touche la sécurité d'une personne passe au cadran 1. <strong>Décision</strong> : cadran 1, faire maintenant ; cadran 2, planifier ; cadran 3, déléguer ou décliner ; cadran 4, éliminer, regrouper ou reporter. Elle est calculée automatiquement.</p>",
          tables: [{
            columns: ["Tâche", "Échéance (jours)", "Importance", "Urgence", "Bloque un collègue", "Sécurité d'une personne", "Cadran (calculé)", "Décision (calculée)"],
            rows: TASKS.map(([t, imps, days, blocks, safety], i) => [
              t,
              { id: `j${i}`, answer: days, tol: 0, noScore: true },
              { id: `i${i}`, options: IMPORTANCES, answer: imps.map((n) => IMPORTANCES[n - 1]), noScore: true },
              { id: `u${i}`, options: URGENCES, answer: (c) => {
                const u = urgFromEntries(c, i);
                return u === null ? null : URGENCES[u - 1];
              }, noScore: true },
              { id: `b${i}`, options: OUI_NON, answer: blocks ? "Oui" : "Non", noScore: true },
              { id: `s${i}`, options: OUI_NON, answer: safety ? "Oui" : "Non", noScore: true },
              { id: `q${i}`, calc: (c) => {
                const q = quadFromEntries(c, i);
                return q === null ? null : QUAD_LABELS[q - 1];
              } },
              { id: `d${i}`, calc: (c) => {
                const q = quadFromEntries(c, i);
                return q === null ? null : DECISIONS[q - 1];
              } }
            ])
          }],
          checks: TASKS.map(([t, imps, days, blocks, safety], i) => ({
            label: `Tâche ${i + 1} : ${t.split(/[:;(]/)[0].trim()}`,
            test: (c) => {
              const imp = level(c.text(`i${i}`)), urg = level(c.text(`u${i}`)), q = quadFromEntries(c, i);
              return imp !== null && imps.includes(imp) && c.num(`j${i}`) === days && c.text(`b${i}`) === (blocks ? "Oui" : "Non") && c.text(`s${i}`) === (safety ? "Oui" : "Non") && urg === urgOf(days, blocks) && q !== null;
            }
          })),
          explanation: "<p>Trois pièges : la validation des maquettes, l'installation des boîtes à plaintes et le forfait internet bloquent un collègue, ce qui monte leur urgence d'un niveau ; la visite du quartier 4 a une échéance lointaine mais passe au cadran 1 parce qu'elle touche la sécurité des personnes ; la commande de fournitures est urgente mais peu importante : on la délègue. Les tâches du cadran 1 reçoivent un responsable avant la fin de la journée, celles du cadran 2 une date dans l'agenda.</p>"
        },
        {
          kind: "sheet",
          id: "suivi-budgetaire",
          title: "Exercice 6 : suivi budgétaire à la fin du mois 3",
          skill: "Pilotage budgétaire",
          intro: `<p>Nous sommes à la fin du mois 3. Pour chaque ligne, calculez d'abord le budget prévu à fin M3 d'après le chronogramme : une activité prévue au seul mois 2 doit avoir consommé tout son budget ; une activité répartie sur les six mois, la moitié ; une activité prévue aux mois 3 et 5, la moitié. Saisissez ensuite chaque dépense du journal dans la bonne ligne et dans le bon mois : seules les six lignes d'activités du tableau sont suivies ici, une dépense qui ne relève d'aucune d'elles n'y est pas saisie. Choisissez enfin la situation de chaque ligne et rédigez une observation.</p>
<p><strong>Journal des dépenses du trimestre</strong></p>
${table(["Date", "Libellé", "Montant"], JOURNAL.map(([m, d, l, a]) => [`Mois ${m}, jour ${d}`, l, fcfa(a)]))}`,
          rules: "<p>Budget prévu à fin M3 = budget alloué × (nombre de mois prévus jusqu'au mois 3 ÷ nombre total de mois prévus). Saisissez les dépenses de chaque mois (laissez vide ou mettez 0 s'il n'y en a pas ; vous pouvez additionner, par exemple =350000+420000). Le total dépensé, le solde, l'écart avec le prévu et le taux d'exécution se calculent seuls. Situation : <strong>Dépassé</strong> si la dépense dépasse le budget alloué ; <strong>Attention</strong> si elle dépasse le budget prévu à fin M3 (dépense en avance sur le chronogramme) ; <strong>En retard</strong> si elle est inférieure à 80 % du budget prévu à fin M3 ; <strong>OK</strong> sinon. Dans l'observation, expliquez la situation et, si besoin, la mesure à prendre.</p>",
          tables: [
            {
              title: "Suivi par ligne (FCFA)",
              columns: ["Ligne budgétaire", "Budget alloué", "Mois prévus (chronogramme)", "Budget prévu à fin M3", "Mois 1", "Mois 2", "Mois 3", "Total dépensé", "Solde", "Écart avec le prévu", "Taux d'exécution", "Situation", "Observation"],
              rows: BUD_LINES.map(([l, b, months], i) => [
                l,
                num(b, "fcfa"),
                monthsText(months),
                { id: `pv${i}`, answer: Math.round(b * shareAt(months, 3)), fmt: "fcfa" },
                ...[1, 2, 3].map((m) => ({ id: `m${m}l${i}`, answer: spentIn(i, m), fmt: "fcfa" })),
                { id: `s${i}`, fmt: "fcfa", calc: (c) => lineSpent(c, i) },
                { id: `r${i}`, fmt: "fcfa", calc: (c) => b - lineSpent(c, i) },
                { id: `e${i}`, fmt: "fcfa", calc: (c) => {
                  const pv = plannedOf(c, i);
                  return pv === null ? null : lineSpent(c, i) - pv;
                } },
                { id: `t${i}`, fmt: "pct", calc: (c) => r1(lineSpent(c, i) / b * 100) },
                { id: `x${i}`, options: SITUATIONS, answer: (c) => lineSituation(c, i) },
                { id: `o${i}`, text: true, placeholder: "Votre observation" }
              ])
            },
            {
              title: "Synthèse",
              columns: ["Élément", "Valeur"],
              rows: [
                ["Budget total des six lignes", { id: "bt", fmt: "fcfa", calc: () => budTotal }],
                ["Budget prévu à fin M3 (selon le chronogramme)", { id: "pt", fmt: "fcfa", calc: (c) => totalPlanned(c) }],
                ["Total dépensé", { id: "st", fmt: "fcfa", calc: (c) => totalSpent(c) }],
                ["Écart avec le prévu à fin M3 (%)", { id: "gp", fmt: "pct", calc: (c) => {
                  const g = gapPct(c);
                  return g === null ? null : r1(g);
                } }],
                ["Taux d'exécution sur le budget total", { id: "tg", fmt: "pct", calc: (c) => r1(totalSpent(c) / budTotal * 100) }],
                ["Rythme des dépenses par rapport au chronogramme (écart de plus de 5 % = trop rapide ou trop lent)", { id: "rythme", options: RYTHMES, answer: (c) => {
                  const g = gapPct(c);
                  return g === null ? null : rythmeOf(g);
                } }]
              ]
            }
          ],
          checks: [
            { label: "Chaque ligne a une observation rédigée (au moins 3 mots)", test: (c) => BUD_LINES.every((_b, i) => words(c.text(`o${i}`)) >= 3) },
            {
              label: "Les lignes dépassées sont expliquées avec une mesure (justifier, compenser, demander un transfert…)",
              test: (c) => totalSpent(c) > 0 && BUD_LINES.every((_b, i) => lineSituation(c, i) !== "Dépassé" || /justif|compens|transfert|reaffect|realloc|ucp|depass|explic|regularis|economi/.test(plain(c.text(`o${i}`))))
            },
            {
              label: "Les lignes en attention signalent la dépense en avance sur le chronogramme",
              test: (c) => totalSpent(c) > 0 && BUD_LINES.every((_b, i) => lineSituation(c, i) !== "Attention" || /avance|chronogramme|prevu|surveill|limit|attention|cout|ecart|anticip|reste/.test(plain(c.text(`o${i}`))))
            },
            {
              label: "Les lignes en retard proposent de rattraper le retard (accélérer, replanifier…)",
              test: (c) => totalSpent(c) > 0 && BUD_LINES.every((_b, i) => lineSituation(c, i) !== "En retard" || /retard|accelerer|accelere|replanif|rattrap|programmer|organiser|relancer/.test(plain(c.text(`o${i}`))))
            }
          ],
          sample: {
            o0: "Dépassement de 35 000 FCFA sur une activité terminée : justifier auprès de l'UCP et compenser sur une autre ligne.",
            o1: "Conforme au chronogramme : trois émissions payées, la moitié du budget.",
            o2: "Dépense en avance sur le chronogramme (400 000 pour 300 000 prévus) : surveiller le coût des collations.",
            o3: "Dépense en avance : 820 000 FCFA pour une seule séance alors que 500 000 étaient prévus, coût unitaire à revoir.",
            o4: "Formation terminée et budget entièrement consommé, comme prévu au chronogramme.",
            o5: "En retard : 4 sessions sur 6 prévues, accélérer les sessions avec les travailleurs au mois 4."
          },
          explanation: "<p>Le chronogramme change la lecture : la cérémonie et la formation des comités devaient avoir consommé tout leur budget à la fin du mois 2 ; la radio, les causeries et les sessions la moitié ; le théâtre-forum la moitié (une période sur deux). La cérémonie est dépassée de 35 000 FCFA. Les causeries et le théâtre-forum dépensent plus vite que prévu : le coût unitaire du théâtre-forum est très supérieur à la prévision. Les sessions avec les travailleurs sont en retard. Le carburant (90 000 FCFA) relève du fonctionnement et ne se saisit dans aucune des six lignes. Au total, les dépenses dépassent d'environ 10 % ce qui était prévu à fin M3 : le rythme est trop rapide.</p>"
        },
        {
          kind: "sheet",
          id: "tableau-de-bord",
          title: "Exercice 5 : tableau de bord des indicateurs à mi-parcours",
          skill: "Suivi-évaluation",
          intro: "<p>Nous sommes à la fin du mois 3. Chaque indicateur se compare à ce qui était prévu à cette date d'après le chronogramme (dans le dossier du projet), et non à la cible de fin de mission : la cible prévue à fin M3 vous est donnée dans le tableau. Saisissez la valeur réalisée à la fin du mois 3, telle que vous la relevez sur le terrain (listes de présence, rapports d'activités) ; le taux par rapport au prévu se calcule seul ; choisissez ensuite l'appréciation de chaque indicateur.</p><p>Pour les indicateurs de qualité du MGP, saisissez le nombre réalisé et la base (registre des plaintes, enquête de notoriété) : la valeur et l'écart à la cible se calculent seuls ; choisissez l'appréciation.</p>",
          rules: "<p>Cible prévue à fin M3 = cible de fin de mission × (nombre de mois prévus jusqu'au mois 3 ÷ nombre total de mois prévus). Taux par rapport au prévu = réalisé ÷ cible prévue à fin M3. Appréciation : <strong>dans la trajectoire</strong> à partir de 90 % du prévu ; <strong>léger retard</strong> de 60 à 89 % ; <strong>retard important</strong> en dessous de 60 %. Pour les indicateurs du MGP : valeur = nombre réalisé ÷ base ; écart à la cible en points = valeur − cible ; <strong>cible atteinte</strong> si la valeur est au moins égale à la cible, sinon <strong>en dessous de la cible</strong>.</p>",
          tables: [
            {
              title: "Indicateurs d'activités",
              columns: ["Indicateur", "Cible fin M6", "Mois prévus (chronogramme)", "Cible prévue à fin M3", "Réalisé fin M3", "Taux par rapport au prévu", "Appréciation"],
              rows: IND.map(([n, cible, months], i) => [
                n,
                num(cible),
                monthsText(months),
                num(indPlanned(i)),
                { id: `rv${i}` },
                { id: `t${i}`, fmt: "pct", calc: (c) => {
                  const t = indRate(c, i);
                  return t === null ? null : r1(t);
                } },
                { id: `a${i}`, options: TRAJ, answer: (c) => {
                  const t = indRate(c, i);
                  return t === null ? null : trajOf(t);
                } }
              ])
            },
            {
              title: "Indicateurs de qualité du MGP",
              columns: ["Indicateur", "Base du calcul", "Réalisé fin M3 (nombre)", "Base (nombre)", "Valeur (%)", "Cible (%)", "Écart à la cible (points)", "Appréciation"],
              rows: MGP_IND.map(([n, base, cible], k) => [
                n,
                base,
                { id: `mn${k}` },
                { id: `mb${k}` },
                { id: `mv${k}`, fmt: "pct", calc: (c) => mgpVal(c, k) },
                num(cible, "pct"),
                { id: `me${k}`, calc: (c) => {
                  const v = mgpVal(c, k);
                  return v === null ? null : r1(v - cible);
                } },
                { id: `ma${k}`, options: MGP_TRAJ, answer: (c) => {
                  const v = mgpVal(c, k);
                  return v === null ? null : v >= cible ? MGP_TRAJ[0] : MGP_TRAJ[1];
                } }
              ])
            }
          ],
          checks: [{
            label: "Les données du MGP sont cohérentes : base saisie et nombre réalisé compris entre 0 et la base",
            test: (c) => MGP_IND.every((_m, k) => {
              const n = c.num(`mn${k}`), bs = c.num(`mb${k}`);
              return n !== null && bs !== null && bs > 0 && n >= 0 && n <= bs;
            })
          }],
          sample: {
            ...Object.fromEntries(IND.map(([, , , done], i) => [`rv${i}`, String(done)])),
            ...Object.fromEntries(MGP_IND.flatMap(([, , , n, bs], k) => [[`mn${k}`, String(n)], [`mb${k}`, String(bs)]]))
          },
          writing: {
            prompt: "<p><strong>Note d'analyse à mi-parcours (une page).</strong> À partir de votre tableau de bord, du chronogramme et du dictionnaire des indicateurs (dans le dossier du projet), rédigez la note que le chef de mission transmettra à l'UCP : situation à mi-parcours par rapport à ce qui était prévu, indicateurs dans la trajectoire, indicateurs en retard et leurs causes probables, qualité du mécanisme de gestion des plaintes, fiabilité des données (sources, fréquence, responsables, désagrégation) et recommandations concrètes.</p>",
            minWords: 250,
            criteria: [
              { label: "La situation à mi-parcours (fin du mois 3)", keywords: ["mi-parcours", "mi parcours", "mois 3", "moitie", "temps ecoule"] },
              { label: "La comparaison avec ce qui était prévu à date selon le chronogramme", keywords: ["chronogramme", "prevu", "planifie", "a date"] },
              { label: "La qualité du mécanisme de gestion des plaintes (traitement dans les délais, plaintes sensibles sous 24 heures, notoriété)", keywords: ["plainte", "mgp", "delai", "sensible", "24 heures", "24h", "notoriete"], need: 3 },
              { label: "La fiabilité des données selon le dictionnaire (sources, fréquence, responsables)", keywords: ["source", "frequence", "responsable", "liste de presence", "registre", "enquete", "dictionnaire"], need: 2 },
              { label: "La désagrégation des données (sexe, âge, quartier)", keywords: ["desagreg", "sexe", "age$", "ages$", "quartier"] },
              { label: "Des recommandations concrètes (replanifier, accélérer, renforcer l'annonce des canaux…)", keywords: ["recommand", "replanif", "accelerer", "renforcer", "proposons", "mesure", "action"], need: 2 }
            ],
            // Selon les valeurs et les appréciations de l'apprenant : indicateurs dans la trajectoire cités, chaque indicateur
            // jugé en retard ou sous sa cible commenté, notoriété citée avec sa valeur
            dynamicCriteria: (c) => {
              const onTrack = IND.map((_n, i) => i).filter((i) => c.text(`a${i}`) === "Dans la trajectoire");
              const out = onTrack.length ? [{
                label: `Les indicateurs que vous avez jugés dans la trajectoire sont cités (${onTrack.map((i) => IND[i][0].toLowerCase()).join(", ")})`,
                keywords: onTrack.map((i) => IND_KEYS[i]),
                need: Math.min(2, onTrack.length)
              }] : [];
              IND.forEach(([n], i) => {
                const a = c.text(`a${i}`);
                if (a === "Retard important" || a === "Léger retard") out.push({ label: `L'indicateur « ${n} », que vous avez jugé en ${a === "Léger retard" ? "léger retard" : "retard important"}, est commenté`, keywords: [IND_KEYS[i]] });
              });
              MGP_IND.forEach(([n], k) => {
                if (k < 2 && c.text(`ma${k}`) === MGP_TRAJ[1]) out.push({ label: `L'indicateur « ${n} », en dessous de sa cible, est commenté`, keywords: MGP_KEYS[k] });
              });
              const v = mgpVal(c, 2);
              if (v !== null) out.push({ label: `La notoriété du MGP (${v.toLocaleString("fr-FR")} % pour une cible de 80 %)`, keywords: ["notoriete", `${Math.round(v)}`], need: 2 });
              return out;
            }
          },
          explanation: "<p>Le chronogramme change la lecture : une activité prévue aux mois 1 et 2 doit être entièrement réalisée à la fin du mois 3 ; une activité répartie sur les six mois, à moitié ; une activité prévue aux mois 3 et 5, pour moitié. Comparer le réalisé à la cible de fin de mission ferait croire à des retards qui n'en sont pas. Un indicateur en retard important se replanifie tout de suite ; un léger retard se rattrape en accélérant le rythme. Pour le MGP, un indicateur sous sa cible appelle une mesure précise : par exemple, une notoriété faible se corrige en renforçant l'annonce des canaux avant l'enquête finale.</p>"
        },
        {
          kind: "writing",
          id: "regle-repartition",
          title: "Rédaction 4 : la règle de répartition des sorties",
          skill: "Équité dans l'équipe",
          prompt: "<p>Les deux animateurs reçoivent la même indemnité, alors que l'un accompagne les visites de l'UCP et que l'autre fait les sorties les plus longues. Rédigez la règle écrite de répartition équitable des sorties et des indemnités de l'équipe.</p>",
          minWords: 60,
          criteria: [
            { label: "Des critères objectifs (distance, durée, difficulté, visibilité)", keywords: ["distance", "duree", "difficulte", "visibilite", "eloign", "kilometre"] },
            { label: "Une rotation des sorties", keywords: ["rotation", "tour de role", "altern", "tournant", "chacun son tour", "a tour"] },
            { label: "Un calcul identique des indemnités (barème)", keywords: ["bareme", "identique", "meme calcul", "meme taux", "par kilometre", "forfait", "grille"] },
            { label: "La transparence (affichage, planning partagé)", keywords: ["affich", "transparen", "partage", "connu de tous", "publie", "planning"] },
            { label: "Une revue régulière", keywords: ["mensuel", "chaque mois", "revue", "revis", "bilan"] },
            { label: "Une voie de recours en cas de désaccord", keywords: ["recours", "desaccord", "reclamation", "contest", "mediation"] }
          ]
        },
        {
          kind: "writing",
          id: "note-delegation",
          title: "Rédaction 2 : la note de délégation",
          skill: "Délégation",
          prompt: "<p>Vous êtes chef de mission. Rédigez la note par laquelle vous déléguez la rédaction du rapport trimestriel au chargé de projet, dont la charge est déjà à 120 %. Votre note doit être complète.</p>",
          minWords: 70,
          criteria: [
            { label: "L'objectif et le livrable attendu", keywords: ["objectif", "livrable", "rapport trimestriel", "attendu"] },
            { label: "Le délai et les étapes", keywords: ["delai", "date", "echeance", "etape", "avant le", "au plus tard", "jalon", "version provisoire"] },
            { label: "Les moyens et les appuis", keywords: ["moyen", "donnee", "appui", "acces", "outil", "ressource", "aide"] },
            { label: "La tâche retirée en échange", keywords: ["retir", "decharg", "allege", "reporte", "suspend", "en echange", "a la place", "confie a", "reprend"] },
            { label: "Le niveau d'autonomie", keywords: ["autonomie", "niveau", "marge de manoeuvre", "tu decides", "vous decidez", "valider"] },
            { label: "Le point d'étape et le mode de retour", keywords: ["point d etape", "point intermediaire", "faire le point", "reunion de suivi", "relecture", "point le", "retour"] },
            { label: "L'information de l'équipe", keywords: ["equipe", "informe", "annonce", "prevenir"] }
          ]
        },
        {
          kind: "writing",
          id: "entretien-sci",
          title: "Rédaction 3 : l'entretien SCI",
          skill: "Retour d'information",
          prompt: "<p>L'animateur communautaire 2, chargé des quartiers éloignés, arrive en retard et rend des fiches incomplètes depuis deux semaines, après qu'on a refusé devant l'équipe de le remplacer sur une sortie lointaine. Rédigez votre entretien individuel avec lui en utilisant la méthode SCI : cadre posé, situation, comportement, impact, écoute de son besoin, reconnaissance de votre part et engagements.</p>",
          minWords: 80,
          criteria: [
            { label: "Un cadre posé : en privé, dans l'écoute, sans jugement", keywords: ["prive", "ecoute", "confidentiel", "sans jugement", "entre nous", "tete a tete", "calme"] },
            { label: "La situation datée", keywords: ["semaine", "depuis", "mardi", "lundi", "jeudi", "date", "derniere", "mois"] },
            { label: "Le comportement décrit par des faits", keywords: ["retard", "fiche", "incomplet", "absence", "absent", "manque"] },
            { label: "L'impact sur l'équipe ou la qualité des données", keywords: ["impact", "consequence", "qualite", "donnee", "equipe", "ucp", "rapport"] },
            { label: "L'écoute de son besoin", keywords: ["besoin", "fatigue", "difficulte", "qu est ce qui", "comment", "pourquoi", "surcharge", "ressens", "eloign"] },
            { label: "La reconnaissance de votre part de responsabilité", keywords: ["je reconnais", "ma part", "j aurais du", "aurais du", "mon erreur", "excuse", "desole", "je regrette"] },
            { label: "Des engagements précis et datés", keywords: ["engag", "ajust", "rotation", "remplac", "nous convenons", "nous allons", "prochain point", "a partir de"] }
          ]
        },
        {
          kind: "writing",
          id: "plan-action-correctif",
          title: "Rédaction 5 : le plan d'action correctif de la supervision",
          skill: "Supervision",
          prompt: "<p>La supervision du mois 4 a relevé : 300 participants rapportés pour les causeries du quartier 3 mais seulement 240 noms sur les listes de présence ; des fiches sans âge ni sexe ; une boîte à plaintes installée dans la cour d'un leader, peu accessible aux femmes ; 6 pièces justificatives manquantes sur 40 ; 3 recommandations de la supervision précédente non mises en œuvre. Rédigez le plan d'action correctif : pour chaque constat, une mesure, un responsable et une échéance.</p>",
          minWords: 80,
          criteria: [
            { label: "La correction des données surdéclarées", keywords: ["liste de presence", "surdeclar", "ecart", "240", "300", "corrig", "rectif"] },
            { label: "La désagrégation (âge et sexe obligatoires)", keywords: ["age$", "ages$", "sexe", "obligatoire", "desagreg", "champ"] },
            { label: "Le déplacement de la boîte à plaintes", keywords: ["boite", "deplac", "accessible", "neutre", "femme", "lieu", "emplacement"] },
            { label: "La régularisation des pièces justificatives", keywords: ["piece", "justificatif", "classer", "dossier", "complet", "regularis"] },
            { label: "Le suivi des recommandations antérieures", keywords: ["recommandation", "anterieur", "precedent", "mise en oeuvre", "suivi des recommandations"] },
            { label: "Un responsable pour chaque mesure", keywords: ["responsable", "chef de mission", "charge de projet", "specialiste", "animateur", "point focal"] },
            { label: "Une échéance pour chaque mesure", keywords: ["echeance", "delai", "avant le", "d ici", "semaine", "jours", "fin du mois", "date"] }
          ]
        },
        {
          kind: "writing",
          id: "rapport-mi-parcours",
          title: "Rédaction 6 : le rapport à mi-parcours",
          skill: "Rapport à mi-parcours",
          prompt: "<p>Nous sommes à la fin du mois 3. En tant que chef de mission, rédigez le rapport à mi-parcours que vous transmettrez à l'UCP, partie par partie, dans les zones ci-dessous. Rendez compte de chaque produit du cadre logique (dossier du projet, tableaux 5 et 6 du rapport de démarrage) et appuyez-vous sur vos travaux : compréhension de la mission (rédaction 1), diagnostic logistique (exercice 2), plan de charge (exercice 3), suivi budgétaire (exercice 6), tableau de bord (exercice 5) et règle de répartition des sorties (rédaction 4).</p><p>Une fois toutes les parties rédigées, téléchargez votre rapport en PDF : les tableaux de vos exercices (indicateurs, MGP, budget, moyens logistiques, charge de l'équipe) y sont ajoutés automatiquement, sous la partie correspondante. Vous pouvez aussi insérer vos propres tableaux : une ligne par rangée, colonnes séparées par « | », la première ligne donnant les titres.</p>",
          minWords: 350,
          criteria: [],
          download: {
            title: "Rapport à mi-parcours",
            subtitle: "Mission d'animation communautaire et d'appui au mécanisme de gestion des plaintes (MGP) — Projet PGC-Vie, commune d'Akoupé",
            details: ["Période couverte : mois 1 à 3 (situation à la fin du mois 3)", "Destinataire : Unité de coordination du projet (UCP)"],
            footer: "Rapport à mi-parcours — PGC-Vie, Akoupé · Travaux pratiques CICEXF",
            fileName: "rapport-mi-parcours-pgc-vie",
            tables: [
              { section: "resultat1", exercise: "tableau-de-bord", table: 0, title: "Indicateurs du résultat 1 à la fin du mois 3 (tableau de bord, exercice 5)", columns: [0, 3, 4, 5, 6], rows: [0, 1, 5, 6, 7] },
              { section: "resultat2", exercise: "tableau-de-bord", table: 0, title: "Indicateurs du résultat 2 à la fin du mois 3 (tableau de bord, exercice 5)", columns: [0, 3, 4, 5, 6], rows: [2, 3, 4] },
              { section: "resultat2", exercise: "tableau-de-bord", table: 1, title: "Qualité du mécanisme de gestion des plaintes (exercice 5)", columns: [0, 2, 3, 4, 5, 6, 7] },
              { section: "budget", exercise: "suivi-budgetaire", table: 0, title: "Suivi budgétaire par ligne à la fin du mois 3, en FCFA (exercice 6)", columns: [0, 1, 3, 7, 9, 10, 11] },
              { section: "budget", exercise: "suivi-budgetaire", table: 1, title: "Synthèse budgétaire (exercice 6)", columns: [0, 1] },
              { section: "equipe", exercise: "diagnostic-logistique", table: 0, title: "Diagnostic des moyens logistiques (exercice 2)", columns: [0, 1, 2, 3, 5, 7, 8] },
              { section: "equipe", exercise: "plan-de-charge", table: 3, title: "Charge et taux de charge de l'équipe, mois par mois (exercice 3)", columns: [0, 1, 2, 3, 4, 5] },
              { section: "equipe", exercise: "plan-de-charge", table: 5, title: "Tri d'Eisenhower des activités du chef de mission au mois 1 (exercice 3)", columns: [0, 1, 7, 8, 9] }
            ]
          },
          sections: [
            {
              id: "resume",
              title: "1. Résumé",
              hint: "Les messages clés du rapport en quelques lignes.",
              criteria: [
                { label: "L'état d'avancement global à la fin du mois 3", keywords: ["mois 3", "mi parcours", "avance", "retard", "globalement", "realise"], need: 2 },
                { label: "Les principales difficultés et les mesures proposées", keywords: ["difficult", "retard", "mesure", "recommand", "propos", "depass"], need: 2 }
              ]
            },
            {
              id: "contexte",
              title: "2. Contexte et objectifs de la mission",
              hint: "Le projet, la zone, les deux résultats attendus.",
              criteria: [
                { label: "Le contexte (travaux, cadre de vie, Akoupé)", keywords: ["contexte", "akoupe", "pgc", "travaux", "cadre de vie"], need: 2 },
                { label: "Les deux résultats attendus : mobilisation communautaire ; MGP et prévention des EAS/HS/VBG", keywords: ["mobilis", "animation", "sensibilis", "mgp", "plainte", "vbg", "violence", "eas$", "hs$"], need: 3 }
              ]
            },
            {
              id: "resultat1",
              title: "3. Résultat 1 : animation communautaire et mobilisation sociale (produits 1.1 à 1.6)",
              hint: "Pour chaque produit du tableau 5 : ce qui est réalisé à la fin du mois 3, comparé au prévu, et les écarts.",
              criteria: [
                { label: "Produit 1.1 : la cartographie des acteurs (base de données transmise à l'UCP)", keywords: ["cartographie", "base de donnees"] },
                { label: "Produit 1.2 : les événements communautaires (lancement, tournoi…)", keywords: ["evenement", "ceremonie", "lancement", "tournoi"] },
                { label: "Produit 1.3 : les émissions radio", keywords: ["radio", "emission"] },
                { label: "Produit 1.4 : les causeries, focus groups et séances de théâtre-forum", keywords: ["causerie", "theatre", "focus"] },
                { label: "Produit 1.5 : les supports de communication produits et distribués", keywords: ["support", "affiche", "depliant", "flyer", "kakemono", "banderole"] },
                { label: "Produit 1.6 : le comité communal de liaison (CCL)", keywords: ["ccl", "comite communal", "liaison"] },
                { label: "La comparaison avec le prévu à fin M3 et les indicateurs du résultat 1 (participation, part des femmes)", keywords: ["prevu", "chronogramme", "participation", "femme", "trajectoire", "retard"], need: 2 }
              ]
            },
            {
              id: "resultat2",
              title: "4. Résultat 2 : MGP et prévention des EAS/HS/VBG (produits 2.1 à 2.6)",
              hint: "Pour chaque produit du tableau 6 : ce qui est réalisé, les indicateurs du MGP et les écarts.",
              criteria: [
                { label: "Produit 2.1 : le MGP opérationnel (boîtes à suggestions, lignes téléphoniques)", keywords: ["boite", "ligne", "telephon", "operationnel"] },
                { label: "Produit 2.2 : les plaintes enregistrées, catégorisées et traitées", keywords: ["plainte", "registre", "enregistr", "trait", "categoris"], need: 2 },
                { label: "Produit 2.3 : la formation des membres du CLGP et du CCL", keywords: ["clgp", "comite", "membres", "form"], need: 2 },
                { label: "Produit 2.4 : la sensibilisation des travailleurs de chantier aux codes de conduite", keywords: ["travailleur", "chantier", "code de conduite"] },
                { label: "Produit 2.5 : les points focaux formés et équipés", keywords: ["points focaux", "point focal", "kit"] },
                { label: "Produit 2.6 : le référencement vers les structures de prise en charge des VBG", keywords: ["referencement", "prise en charge", "protocole", "annuaire"] },
                { label: "Les indicateurs du résultat 2 (notoriété, traitement dans les délais, plaintes sensibles sous 24 heures)", keywords: ["notoriete", "delai", "24 h", "24h", "24 heures", "sensible", "satisfaction"], need: 2 }
              ]
            },
            {
              id: "budget",
              title: "5. Exécution budgétaire",
              hint: "Le rythme des dépenses par rapport au chronogramme et les lignes à surveiller (exercice 6).",
              criteria: [
                { label: "L'exécution budgétaire et son rythme (dépenses supérieures d'environ 10 % au prévu à fin M3 : rythme trop rapide)", keywords: ["trop rapide", "rythme", "10 %", "10%", "execution", "taux d execution", "au dessus du prevu"], need: 2 },
                { label: "Les lignes budgétaires à surveiller (cérémonie dépassée de 35 000 FCFA, coût unitaire du théâtre-forum) et la mesure prise", keywords: ["35 000", "35000", "depass", "cout unitaire", "transfert", "compens", "justifi"], need: 2 }
              ]
            },
            {
              id: "equipe",
              title: "6. Moyens, organisation et charge de l'équipe",
              hint: "Les moyens logistiques, le plan de charge et l'équité dans l'équipe (exercices 2 et 3, rédaction 4).",
              criteria: [
                { label: "Les moyens logistiques (motos, smartphones, ordinateurs, tablettes, kits)", keywords: ["moto", "smartphone", "ordinateur", "tablette", "kit", "logistique", "equipement"], need: 2 },
                { label: "La charge de l'équipe (plan de charge, surcharge, délégation, bénévoles tenus hors du MGP)", keywords: ["plan de charge", "taux de charge", "surcharge", "100 %", "100%", "deleg", "benevole"], need: 2 },
                { label: "L'équité dans l'équipe (règle de répartition des sorties et des indemnités)", keywords: ["equit", "indemnit", "rotation", "bareme", "sorties"], need: 2 }
              ]
            },
            {
              id: "difficultes",
              title: "7. Difficultés, risques et leçons apprises",
              hint: "Ce qui a freiné la mission, les risques pour la suite et ce que l'équipe en retient.",
              criteria: [
                { label: "Les difficultés, les risques et les leçons apprises", keywords: ["difficult", "risque", "contrainte", "lecon", "enseignement", "pluie"], need: 2 }
              ]
            },
            {
              id: "plan",
              title: "8. Plan d'action des mois 4 à 6",
              hint: "Les mesures, avec un responsable et une échéance pour chacune. Vous pouvez les présenter en tableau : une ligne par mesure, colonnes séparées par « | », la première ligne donnant les titres (par exemple : Mesure | Responsable | Échéance).",
              criteria: [
                { label: "Des mesures concrètes pour les mois 4 à 6", keywords: ["mois 4", "mois 5", "mois 6", "replanif", "accelerer", "renforcer", "rattrap"], need: 2 },
                { label: "Un responsable et une échéance pour chaque mesure", keywords: ["responsable", "chef de mission", "charge de projet", "specialiste", "animateur", "echeance", "avant le", "d ici", "fin du mois", "semaine"], need: 2 }
              ]
            }
          ]
        }
      ]
    };
    management_pilotage_communautaire_default = set;
  }
});

// src/lib/practiceScoreServer.ts
var practiceScoreServer_exports = {};
__export(practiceScoreServer_exports, {
  PRACTICE_COURSES: () => PRACTICE_COURSES,
  practiceFor: () => practiceFor
});
module.exports = __toCommonJS(practiceScoreServer_exports);
init_management_pilotage_communautaire();

// src/data/elearning/practice.ts
var PRACTICE_WEIGHTS = { "management-pilotage-communautaire": 0.6 };
var PRACTICE_PASS = 80;
var isCalc = (c) => typeof c === "object" && "calc" in c;
var isChoice = (c) => typeof c === "object" && "options" in c;
var isTextInput = (c) => typeof c === "object" && "text" in c;
var isNumInput = (c) => typeof c === "object" && "id" in c && !("calc" in c) && !("options" in c) && !("text" in c);
var isInput = (c) => isNumInput(c) || isChoice(c) || isTextInput(c);
var inputCells = (ex) => ex.tables.flatMap((t) => t.rows.flat()).filter(isInput);
var gradedCells = (ex) => inputCells(ex).filter((c) => !isTextInput(c) && (c.answer !== void 0 || isNumInput(c) && c.range !== void 0));

// src/lib/practiceGrading.ts
function evaluate(raw) {
  const s = raw.replace(/fcfa|f\s*cfa|francs?/gi, "").replace(/[\s  ]/g, "").replace(/^=/, "").replace(/%$/, "").replace(/×|x(?=\d|\()/gi, "*").replace(/÷/g, "/");
  if (!s) return null;
  const normalized = /^\d{1,3}(\.\d{3})+$/.test(s) ? s.replace(/\./g, "") : s.replace(/,/g, ".");
  if (!/^[\d.+\-*/()]+$/.test(normalized)) return null;
  let i = 0;
  const peek = () => normalized[i];
  const number = () => {
    const m = /^\d+(\.\d+)?|^\.\d+/.exec(normalized.slice(i));
    if (!m) return null;
    i += m[0].length;
    return parseFloat(m[0]);
  };
  const factor = () => {
    if (peek() === "-") {
      i++;
      const f = factor();
      return f === null ? null : -f;
    }
    if (peek() === "+") {
      i++;
      return factor();
    }
    if (peek() === "(") {
      i++;
      const v2 = expr();
      if (v2 === null || peek() !== ")") return null;
      i++;
      return v2;
    }
    return number();
  };
  const term = () => {
    let v2 = factor();
    while (v2 !== null && (peek() === "*" || peek() === "/")) {
      const op = normalized[i++];
      const f = factor();
      if (f === null) return null;
      v2 = op === "*" ? v2 * f : f === 0 ? null : v2 / f;
    }
    return v2;
  };
  const expr = () => {
    let v2 = term();
    while (v2 !== null && (peek() === "+" || peek() === "-")) {
      const op = normalized[i++];
      const t = term();
      if (t === null) return null;
      v2 = op === "+" ? v2 + t : v2 - t;
    }
    return v2;
  };
  const v = expr();
  return v !== null && i === normalized.length && Number.isFinite(v) ? v : null;
}
var defaultTol = (fmt) => fmt === "pct" ? 0.6 : fmt === "fcfa" ? 1 : 0.01;
function numericOk(raw, answer, fmt, tol) {
  let v = evaluate(raw);
  if (v === null) return false;
  const t = tol ?? defaultTol(fmt);
  if (fmt === "pct" && Math.abs(answer) >= 2 && Math.abs(v) <= 1.5 && Math.abs(v * 100 - answer) <= t) v *= 100;
  return Math.abs(v - answer) <= t;
}
function makeCtx(ex, answers) {
  const byId = /* @__PURE__ */ new Map();
  for (const t of ex.tables) for (const row of t.rows) for (const c of row) if (typeof c === "object" && "id" in c) byId.set(c.id, c);
  const memo = /* @__PURE__ */ new Map();
  const busy = /* @__PURE__ */ new Set();
  const ctx = {
    num(id) {
      const c = byId.get(id);
      if (!c) return null;
      if (isCalc(c)) {
        const v = calcValue(id, c);
        return typeof v === "number" && Number.isFinite(v) ? v : null;
      }
      const raw = (answers[id] || "").trim();
      return raw ? evaluate(raw) : null;
    },
    text(id) {
      const c = byId.get(id);
      if (!c) return "";
      if (isCalc(c)) {
        const v = calcValue(id, c);
        return v === null ? "" : String(v);
      }
      return (answers[id] || "").trim();
    }
  };
  const calcValue = (id, c) => {
    if (memo.has(id)) return memo.get(id);
    if (busy.has(id)) return null;
    busy.add(id);
    let v = null;
    try {
      v = c.calc(ctx);
    } catch {
      v = null;
    }
    busy.delete(id);
    memo.set(id, v);
    return v;
  };
  return ctx;
}
var resolve = (d, ctx) => typeof d === "function" ? d(ctx) : d;
function gradeSheet(ex, answers) {
  const ctx = makeCtx(ex, answers);
  const ok = {};
  const rowStarted = /* @__PURE__ */ new Set();
  for (const t of ex.tables) for (const row of t.rows) {
    const ids = row.filter((c) => typeof c === "object" && "id" in c && !isCalc(c)).map((c) => c.id);
    if (ids.some((id) => (answers[id] || "").trim())) ids.forEach((id) => rowStarted.add(id));
  }
  for (const c of gradedCells(ex)) {
    const raw = (answers[c.id] || "").trim();
    if (isChoice(c)) {
      const a = resolve(c.answer, ctx);
      ok[c.id] = !!raw && a !== null && a !== void 0 && (Array.isArray(a) ? a.includes(raw) : raw === a);
    } else if (c.range) {
      const v = ctx.num(c.id);
      ok[c.id] = v !== null && v >= c.range[0] - 1e-9 && v <= c.range[1] + 1e-9;
    } else {
      const a = resolve(c.answer, ctx);
      ok[c.id] = a !== null && a !== void 0 && (raw === "" ? a === 0 && rowStarted.has(c.id) : numericOk(raw, a, c.fmt, c.tol));
    }
  }
  const checks = (ex.checks || []).map((k) => {
    let pass = false;
    try {
      pass = !!k.test(ctx);
    } catch {
      pass = false;
    }
    return { label: k.label, ok: pass };
  });
  const scored = gradedCells(ex).filter((c) => !c.noScore).map((c) => c.id);
  const good = scored.filter((id) => ok[id]).length + checks.filter((k) => k.ok).length;
  const total = scored.length + checks.length;
  return { score: total ? Math.round(good / total * 100) : 0, good, total, ok, checks };
}
var normalizeText = (s) => ` ${s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").replace(/[^a-z0-9%]+/g, " ").trim()} `;
var wordCount = (s) => (s.trim().match(/[\p{L}\p{N}]+/gu) || []).length;
var hasKeyword = (norm, keyword) => {
  const whole = keyword.endsWith("$");
  const k = normalizeText(whole ? keyword.slice(0, -1) : keyword).trim();
  return k.length > 0 && norm.includes(whole ? ` ${k} ` : ` ${k}`);
};
function gradeWriting(ex, text) {
  const norm = normalizeText(text);
  const words2 = wordCount(text);
  const criteria = ex.criteria.map((c) => {
    const found = c.keywords.filter((k) => hasKeyword(norm, k));
    return { label: c.label, met: found.length >= (c.need ?? 1), found, keywords: c.keywords };
  });
  const met = criteria.filter((c) => c.met).length;
  const tooShort = words2 < ex.minWords;
  const tooLong = ex.maxWords !== void 0 && words2 > ex.maxWords;
  let score = Math.round(met / criteria.length * 100);
  if (tooShort || tooLong) score = Math.min(score, 50);
  return { score, words: words2, tooShort, tooLong, criteria };
}
function gradeSheetWriting(ex, answers, text) {
  if (!ex.writing) return null;
  return gradeWithCtx(ex.writing, makeCtx(ex, answers), text);
}
function gradeWithCtx(w, ctx, text) {
  let dyn = [];
  try {
    dyn = w.dynamicCriteria ? w.dynamicCriteria(ctx) : [];
  } catch {
    dyn = [];
  }
  return gradeWriting({ criteria: [...w.criteria, ...dyn], minWords: w.minWords, maxWords: w.maxWords }, text);
}
var sectionKey = (id) => `sec:${id}`;
function gradeWritingEntry(ex, text, answers) {
  if (!ex.sections?.length) return gradeWriting(ex, text);
  const parts = ex.sections.map((s) => ({ s, r: gradeWriting({ criteria: s.criteria, minWords: 0 }, answers[sectionKey(s.id)] || "") }));
  const criteria = parts.flatMap(({ s, r }) => r.criteria.map((c) => ({ ...c, label: `${s.title} : ${c.label}` })));
  const words2 = parts.reduce((n, p) => n + p.r.words, 0);
  const tooShort = words2 < ex.minWords;
  let score = Math.round(criteria.filter((c) => c.met).length / Math.max(1, criteria.length) * 100);
  if (tooShort) score = Math.min(score, 50);
  return { score, words: words2, tooShort, criteria };
}
var tableWritingKey = (id) => `txt:${id}`;
function gradeTableWritings(ex, answers) {
  const ctx = makeCtx(ex, answers);
  return ex.tables.flatMap((t) => t.writing ? [{ id: t.writing.id, result: gradeWithCtx(t.writing, ctx, answers[tableWritingKey(t.writing.id)] || "") }] : []);
}

// src/lib/practiceScore.ts
var isValidated = (e) => !!e && e.score !== void 0 && !e.pending;
function exerciseScore(ex, e) {
  const answers = e.answers || {};
  if (ex.kind === "writing") return gradeWritingEntry(ex, e.text || "", answers).score;
  const table2 = gradeSheet(ex, answers).score;
  const writings = [
    ...ex.writing ? [gradeSheetWriting(ex, answers, e.text || "").score] : [],
    ...gradeTableWritings(ex, answers).map((w) => w.result.score)
  ];
  return writings.length ? Math.round((table2 + Math.min(...writings)) / 2) : table2;
}
function practiceResult(set2, state) {
  const scores = {};
  const missing = [];
  for (const ex of set2.exercises) {
    const e = state[ex.id];
    if (isValidated(e)) {
      try {
        scores[ex.id] = exerciseScore(ex, e);
      } catch {
        scores[ex.id] = 0;
      }
    } else missing.push(ex.title);
  }
  const total = set2.exercises.length;
  const sum = Object.values(scores).reduce((a, b) => a + b, 0);
  return { total, done: total - missing.length, missing, scores, average: total ? Math.round(sum / total) : 0 };
}

// src/lib/practiceScoreServer.ts
var SETS = { [management_pilotage_communautaire_default.courseId]: management_pilotage_communautaire_default };
var PRACTICE_COURSES = Object.keys(SETS);
function practiceFor(courseId, state) {
  const set2 = SETS[courseId];
  if (!set2) return null;
  return { weight: PRACTICE_WEIGHTS[courseId] ?? 0, pass: PRACTICE_PASS, ...practiceResult(set2, state || {}) };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PRACTICE_COURSES,
  practiceFor
});
