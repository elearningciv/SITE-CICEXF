import { DomainIntervention, SubDomain } from '../types';
import { ACCOMPANIMENT_DOMAINS, ACCOMPANIMENT_SHEETS } from './accompanimentSheets';
import { FORMATION_OFFERS } from './formationOffers';
import { FORMATION_PROGRAMS } from './formationPrograms';

/**
 * Sheets of the domains and axes on the "Formations" tab, written for the learner and for both
 * individuals and organizations. The "Accompagnement" tab has its own sheets (accompanimentSheets.ts).
 * enrichDomains gives each tab its own content.
 */

export interface DomainSheet {
  description: string;
  imageUrl: string;
}

export interface AxisSheet extends DomainSheet {
  objectives: string[];
  resultatsAttendus: string[];
  publicParticuliers: string[];
  publicOrganisations: string[];
  admission: string[];
}

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=750&q=80`;

export const DOMAIN_SHEETS: Record<string, DomainSheet> = {
  'ing-financiere': {
    imageUrl: photo('1554224155-6726b3ff858f'),
    description: "Savoir lire les chiffres, c'est décider mieux, négocier mieux et avancer plus vite. Ce domaine vous donne cette maîtrise, que vous soyez un professionnel décidé à accélérer votre carrière, un entrepreneur qui veut financer son projet ou une organisation qui veut fiabiliser sa gestion. À partir de cas concrets, vous apprenez à monter un dossier de financement, à construire un modèle financier, à tenir une comptabilité conforme et à sécuriser vos obligations fiscales. Vous en sortez avec des compétences immédiatement utiles et l'assurance de défendre vos chiffres devant une banque, un investisseur ou une direction."
  },
  'ing-qhse': {
    imageUrl: photo('1622612023350-b15f063eabe6'),
    description: "Qualité, santé, sécurité et environnement ouvrent aujourd'hui les portes des marchés, des financements et de nombreuses carrières. Ce domaine fait de vous un acteur capable de prévenir les risques, d'appliquer les normes et de conduire de vrais changements sur le terrain. Que vous souhaitiez vous spécialiser, vous reconvertir ou renforcer les pratiques de votre organisation, vous travaillez sur des situations concrètes : évaluation des risques, audit, plans d'action, sauvegardes environnementales et sociales. Vous repartez avec des méthodes reconnues et la capacité de les mettre en œuvre dès votre retour."
  },
  'ing-formation': {
    imageUrl: photo('1524178232363-1fb2b075b655'),
    description: "Transmettre est un métier, et il s'apprend. Ce domaine vous apprend à identifier les besoins, à concevoir des parcours captivants, à animer avec aisance et à mesurer les progrès réels. Il s'adresse aussi bien au formateur, à l'expert ou au consultant qui veut professionnaliser sa pratique qu'aux organisations qui veulent des formations rentables et utiles. Vous pratiquez à chaque étape et vous repartez avec vos propres outils, vos supports et la confiance nécessaire pour faire progresser les autres."
  },
  'ing-informatique': {
    imageUrl: photo('1680992044138-ce4864c2b962'),
    description: "Le numérique transforme tous les métiers, et les compétences techniques solides font la différence. Ce domaine vous permet de passer de simple utilisateur à professionnel capable de concevoir, de sécuriser et de faire évoluer des systèmes d'information. Étudiant, technicien, cadre en reconversion ou organisation engagée dans sa digitalisation : chacun y gagne des compétences directement applicables en réseaux, en développement, en cybersécurité et en transformation numérique. Vous apprenez en manipulant, pour être opérationnel et crédible dès la fin du parcours."
  },
  'ing-territoriale': {
    imageUrl: photo('1783260606376-046b461ba2bc'),
    description: "Les territoires qui réussissent sont portés par des femmes et des hommes capables de planifier, de mobiliser et de décider à partir de données fiables. Ce domaine vous donne ces compétences, que vous soyez agent public, élu, étudiant, porteur d'initiative locale ou institution chargée du développement. Aménagement, gouvernance locale, filières agricoles, cartographie : vous travaillez sur des réalités de terrain et vous produisez des outils concrets. À la clé, une expertise utile et la capacité d'agir réellement sur le développement de votre commune, de votre région ou de votre filière."
  },
  'ing-gestion-projets': {
    imageUrl: photo('1590402494587-44b71d7772f6'),
    description: "De l'idée au résultat mesuré, conduire un projet est une compétence précieuse pour les entreprises, les ONG et les institutions. Ce domaine vous apprend à concevoir un projet finançable, à le piloter sans perdre le fil des délais et des budgets, puis à prouver ses effets. Vous pouvez le suivre pour évoluer vers les métiers de chef de projet ou de suivi-évaluation, ou pour renforcer toute une équipe. Vous utilisez les outils des professionnels sur des cas pratiques et vous gagnez une méthode solide, réutilisable sur chacun de vos futurs projets."
  },
  'etudes-recherches': {
    imageUrl: photo('1650499311129-5dc75c1038e6'),
    description: "Dans un monde saturé d'opinions, savoir produire et interpréter des données fiables rend indispensable. Ce domaine vous apprend à concevoir une enquête, à conduire le terrain, à analyser les résultats et à les transformer en recommandations convaincantes. Étudiant, chercheur, consultant, chargé d'études ou organisation à la recherche de preuves pour décider : vous progressez en travaillant sur des données et avec de vrais outils. Vous gagnez une compétence transférable, utile dans tous les secteurs."
  },
  'conseil-strategique': {
    imageUrl: photo('1542744173-8e7e53415bb0'),
    description: "Les grandes réussites naissent d'une vision claire, d'équipes alignées et d'une gouvernance solide. Ce domaine vous donne les méthodes des consultants pour analyser une situation, décider des priorités et conduire le changement. Il s'adresse au manager qui veut prendre de la hauteur, au futur consultant, à l'entrepreneur qui structure sa croissance, comme aux organisations qui veulent gagner en efficacité. Vous travaillez sur des cas concrets et vous repartez avec des outils directement applicables et une posture de leader plus affirmée."
  }
};

/** Keys: axis title without its number, in lower case and without accents (see axisKey) */
export const AXIS_SHEETS: Record<string, AxisSheet> = {
  // Ingénierie financière et de l'investissement
  'structuration et financement des projets': {
    imageUrl: photo('1628348068343-c6a848d2b6dd'),
    description: "Une bonne idée ne suffit pas : c'est un dossier solide qui convainc une banque ou un investisseur. Ici, vous apprenez à transformer un projet en proposition finançable, de l'étude de faisabilité au plan de financement, en passant par la présentation aux partenaires. Que le projet soit le vôtre ou celui de votre organisation, vous avancez sur des cas concrets et vous ressortez avec une méthode éprouvée, un dossier mieux construit et l'assurance de défendre vos chiffres face à ceux qui décident.",
    objectives: [
      "Évaluer la faisabilité technique, financière et économique d'un projet.",
      "Construire un plan de financement équilibré entre fonds propres, crédits et subventions.",
      "Rédiger un dossier de financement clair et convaincant.",
      "Identifier les financeurs adaptés et préparer l'entretien avec eux."
    ],
    resultatsAttendus: [
      "Vous savez dire, chiffres à l'appui, si un projet est viable.",
      "Vous repartez avec une trame de dossier réutilisable pour votre projet ou votre structure.",
      "Vous présentez et défendez un projet avec assurance devant un financeur.",
      "Vous devenez une personne ressource sur le financement de projets."
    ],
    publicParticuliers: ["Porteurs de projets, entrepreneurs et futurs créateurs d'entreprise.", "Professionnels et étudiants en finance ou en gestion qui visent les métiers du financement."],
    publicOrganisations: ["Directions financières et directions du développement.", "PME, ONG, collectivités et institutions à la recherche de financements."],
    admission: ["Profil conseillé : avoir un projet à financer ou s'intéresser aux métiers du financement.", "Prérequis conseillé : notions simples de gestion et d'utilisation d'Excel.", "À prévoir : un ordinateur portable et, si possible, une idée de projet à travailler."]
  },
  'analyse financiere et modelisation': {
    imageUrl: photo('1560221328-12fe60f83ab8'),
    description: "Faire parler les chiffres et simuler l'avenir : voilà ce qui distingue un bon analyste. Vous apprenez à poser un diagnostic financier, à bâtir un modèle sous Excel et à comparer des scénarios pour éclairer une décision. Chaque notion est appliquée à un cas concret, de sorte qu'à la fin vous ne vous contentez plus de lire un tableau : vous en tirez des recommandations. Une compétence qui fait progresser une carrière, et qui permet à une organisation de décider sur des bases solides.",
    objectives: [
      "Diagnostiquer la rentabilité, la solvabilité et la trésorerie d'une activité.",
      "Construire sous Excel un modèle financier prévisionnel clair et modifiable.",
      "Calculer les indicateurs de décision : VAN, TRI et délai de récupération.",
      "Comparer plusieurs scénarios et mesurer leur sensibilité."
    ],
    resultatsAttendus: [
      "Vous réalisez en autonomie un diagnostic financier complet et argumenté.",
      "Vous repartez avec un modèle financier que vous savez adapter à d'autres projets.",
      "Vous éclairez une décision d'investissement à l'aide de scénarios chiffrés.",
      "Vous renforcez votre profil d'analyste, ou la capacité d'analyse de votre équipe."
    ],
    publicParticuliers: ["Analystes, comptables, contrôleurs de gestion et jeunes diplômés en finance.", "Entrepreneurs qui veulent maîtriser les chiffres de leur activité."],
    publicOrganisations: ["Directions financières et services de contrôle de gestion.", "Banques, institutions financières et équipes d'investissement."],
    admission: ["Profil conseillé : formation ou expérience en gestion, finance ou comptabilité.", "Prérequis conseillé : pratique courante d'Excel et lecture de base d'un bilan.", "À prévoir : un ordinateur portable équipé d'Excel."]
  },
  'gestion comptable fiscale et audit': {
    imageUrl: photo('1642043175009-5997b3a078d8'),
    description: "Des comptes justes et une fiscalité maîtrisée évitent bien des pénalités et inspirent confiance. Vous apprenez à tenir une comptabilité conforme au SYSCOHADA, à sécuriser vos déclarations, à renforcer le contrôle interne et à préparer un audit. Grâce à des exercices sur des situations concrètes, vous gagnez en rigueur et en autonomie. Que vous visiez un poste comptable, que vous gériez votre propre entreprise ou que vous soyez responsable des comptes d'une structure, vous saurez quoi faire, comment le faire et comment le justifier.",
    objectives: [
      "Enregistrer les opérations courantes selon le SYSCOHADA.",
      "Préparer les principales déclarations fiscales et sociales.",
      "Mettre en place des procédures de contrôle interne efficaces.",
      "Conduire les étapes clés d'une mission d'audit."
    ],
    resultatsAttendus: [
      "Vous tenez et contrôlez une comptabilité de façon autonome.",
      "Vous repérez à temps les risques fiscaux et vous savez les prévenir.",
      "Vous produisez des états fiables, prêts à être présentés et audités.",
      "Vous gagnez en crédibilité auprès d'un employeur, d'un client ou d'un auditeur."
    ],
    publicParticuliers: ["Comptables, aides-comptables et étudiants en comptabilité.", "Entrepreneurs et commerçants qui veulent gérer eux-mêmes leurs comptes."],
    publicOrganisations: ["Directions administratives, financières et comptables.", "PME, associations, ONG et projets financés par des bailleurs."],
    admission: ["Profil conseillé : débutant motivé ou professionnel de la comptabilité souhaitant se mettre à niveau.", "Prérequis conseillé : notions de calcul et aisance avec les outils bureautiques.", "À prévoir : un ordinateur portable et, si possible, des exemples de pièces comptables anonymisées."]
  },
  'entrepreneuriat et developpement de pme': {
    imageUrl: photo('1687422808191-93810cd07ab0'),
    description: "Passer de l'idée à une activité rentable s'apprend. Vous clarifiez votre offre, vous construisez un plan d'affaires réaliste, vous installez des outils simples de gestion et vous préparez l'accès aux clients et aux financements. Pas de théorie abstraite : vous travaillez directement sur votre propre activité ou sur celle de votre structure. Vous gagnez en lucidité, en organisation et en confiance, avec un plan clair pour lancer ou faire grandir votre entreprise.",
    objectives: [
      "Formuler un modèle économique et une offre de valeur claire.",
      "Élaborer un plan d'affaires chiffré et réaliste.",
      "Installer des outils simples de gestion et de suivi de la trésorerie.",
      "Préparer une présentation convaincante pour les clients et les financeurs."
    ],
    resultatsAttendus: [
      "Vous disposez d'un plan d'affaires complet, prêt à être présenté.",
      "Vous pilotez votre activité à partir de vos chiffres, et non plus à l'instinct.",
      "Vous savez présenter votre entreprise en quelques minutes avec conviction.",
      "Vous repartez avec un plan d'action concret pour vos prochains mois."
    ],
    publicParticuliers: ["Créateurs d'entreprise, jeunes diplômés et personnes en reconversion.", "Dirigeants de TPE, commerçants et artisans."],
    publicOrganisations: ["PME en croissance, coopératives et groupements.", "Incubateurs et programmes d'appui à l'entrepreneuriat."],
    admission: ["Profil conseillé : toute personne ayant une idée ou une activité à développer.", "Prérequis : pas de diplôme particulier, seulement une vraie motivation à entreprendre.", "À prévoir : les informations disponibles sur votre projet ou votre activité."]
  },

  // Ingénierie QHSE
  'systemes de management integre smi': {
    imageUrl: photo('1589793463357-5fb813435467'),
    description: "Qualité, environnement et sécurité : les organisations performantes les pilotent ensemble, et elles ont besoin de professionnels capables de le faire. Vous apprenez à interpréter les normes ISO 9001, ISO 14001 et ISO 45001, à cartographier les processus, à mener des audits internes et à faire vivre le système au quotidien. Par des exercices d'audit et des cas d'entreprise, vous passez de la norme à la pratique. Un vrai accélérateur pour votre carrière QHSE, comme pour toute organisation qui vise la certification.",
    objectives: [
      "Interpréter les exigences communes des normes ISO 9001, ISO 14001 et ISO 45001.",
      "Cartographier les processus et structurer une documentation unique.",
      "Conduire un audit interne, du plan d'audit au rapport.",
      "Piloter les actions correctives et l'amélioration continue."
    ],
    resultatsAttendus: [
      "Vous réalisez un diagnostic d'écarts par rapport aux normes.",
      "Vous menez un audit interne avec méthode et rédigez des constats solides.",
      "Vous êtes capable de contribuer activement à une démarche de certification.",
      "Vous renforcez votre employabilité sur les fonctions QHSE."
    ],
    publicParticuliers: ["Animateurs et responsables QHSE, futurs auditeurs internes.", "Jeunes diplômés et professionnels en reconversion vers la QHSE."],
    publicOrganisations: ["Directions générales et pilotes de processus.", "Entreprises industrielles, de services et de BTP visant une certification."],
    admission: ["Profil conseillé : expérience ou fort intérêt pour la qualité, la sécurité ou l'environnement.", "Prérequis conseillé : connaissance générale du fonctionnement d'une entreprise.", "À prévoir : un ordinateur portable."]
  },
  'hygiene et securite au travail sst': {
    imageUrl: photo('1662309376159-b95fb193d96b'),
    description: "Un accident évité, c'est une vie protégée et une activité préservée. Vous apprenez à repérer les dangers, à évaluer les risques, à rédiger le Document Unique et à construire de vrais plans de prévention. Études d'accidents et mises en situation vous donnent les bons réflexes. Vous devenez capable d'agir, de convaincre et de faire respecter les consignes, que vous visiez un poste HSE ou que vous ayez la responsabilité d'une équipe, d'un chantier ou d'un site.",
    objectives: [
      "Identifier les dangers et évaluer les risques à chaque poste de travail.",
      "Rédiger un Document Unique et un plan de prévention.",
      "Analyser un accident pour en traiter les causes profondes.",
      "Animer une sensibilisation sécurité auprès d'une équipe."
    ],
    resultatsAttendus: [
      "Vous évaluez en autonomie les risques d'un poste ou d'un chantier.",
      "Vous savez produire un Document Unique complet et utile.",
      "Vous réagissez avec méthode face à un incident et vous en tirez des leçons.",
      "Vous faites évoluer les comportements autour de vous."
    ],
    publicParticuliers: ["Agents et animateurs HSE, techniciens et chefs d'équipe.", "Jeunes diplômés et personnes qui veulent se spécialiser en prévention."],
    publicOrganisations: ["Responsables HSE et ressources humaines, comités de santé et sécurité au travail.", "Entreprises du BTP, de l'industrie, des mines et de la logistique."],
    admission: ["Profil conseillé : toute personne amenée à encadrer ou à travailler sur le terrain.", "Prérequis : pas de prérequis technique, seulement une bonne capacité d'observation.", "À prévoir : de quoi prendre des notes et, si possible, des exemples de situations vécues."]
  },
  'environnement et developpement durable': {
    imageUrl: photo('1509391366360-2e959784a276'),
    description: "L'environnement est devenu un enjeu d'avenir, et un champ de carrières à part entière. Vous apprenez à évaluer les impacts d'une activité, à réaliser un bilan carbone, à élaborer un plan de gestion environnementale et sociale et à construire une démarche RSE crédible. À partir d'exemples de projets, vous transformez de grands principes en actions mesurables. Vous en sortez capable d'agir concrètement pour votre organisation, vos clients ou votre propre parcours professionnel.",
    objectives: [
      "Identifier et hiérarchiser les impacts environnementaux et sociaux d'une activité.",
      "Réaliser un bilan carbone simplifié et définir des actions de réduction.",
      "Élaborer un plan de gestion environnementale et sociale.",
      "Structurer une démarche RSE adaptée au contexte."
    ],
    resultatsAttendus: [
      "Vous analysez un projet sous l'angle de ses impacts et vous proposez des mesures concrètes.",
      "Vous savez chiffrer des émissions et bâtir une trajectoire de réduction.",
      "Vous rédigez des documents exploitables par les décideurs.",
      "Vous vous positionnez sur des métiers et des missions d'avenir."
    ],
    publicParticuliers: ["Étudiants, jeunes professionnels et consultants en environnement.", "Personnes engagées qui veulent faire de l'écologie leur métier."],
    publicOrganisations: ["Entreprises industrielles, énergétiques et minières.", "Institutions publiques, collectivités et promoteurs de projets."],
    admission: ["Profil conseillé : formation scientifique, technique ou sociale, ou forte motivation pour l'environnement.", "Prérequis conseillé : aisance à l'écrit et notions de calcul.", "À prévoir : un ordinateur portable."]
  },
  'securite sanitaire et agroalimentaire': {
    imageUrl: photo('1551884170-09fb70a3a2ed'),
    description: "Protéger le consommateur, c'est aussi protéger sa réputation et conquérir de nouveaux marchés. Vous apprenez à appliquer les bonnes pratiques d'hygiène, à construire un plan HACCP, à comprendre les exigences de la norme ISO 22000 et à organiser la traçabilité. Vous raisonnez sur de vrais procédés, du restaurant à l'usine de transformation. À la fin, vous savez repérer ce qui peut mal tourner et comment l'éviter : une expertise précieuse pour votre carrière, votre commerce ou votre entreprise.",
    objectives: [
      "Appliquer les bonnes pratiques d'hygiène et de fabrication.",
      "Construire un plan HACCP en identifiant les points critiques.",
      "Organiser la traçabilité, du fournisseur au client.",
      "Préparer une inspection ou un audit sanitaire."
    ],
    resultatsAttendus: [
      "Vous repérez les dangers d'un procédé et vous définissez les bons contrôles.",
      "Vous élaborez et faites vivre un plan HACCP.",
      "Vous retrouvez l'historique d'un lot grâce à une traçabilité organisée.",
      "Vous abordez les contrôles avec sérénité."
    ],
    publicParticuliers: ["Techniciens et responsables qualité, étudiants en agroalimentaire.", "Restaurateurs, traiteurs et entrepreneurs de la transformation alimentaire."],
    publicOrganisations: ["Industries agroalimentaires et unités de transformation.", "Hôtels, restaurants, coopératives et exportateurs."],
    admission: ["Profil conseillé : toute personne travaillant ou souhaitant travailler dans l'alimentation.", "Prérequis : pas de prérequis scientifique avancé.", "À prévoir : si possible, la description d'un produit ou d'un procédé à étudier."]
  },
  'sauvegarde environnementale et sociale ses': {
    imageUrl: photo('1509391366360-2e959784a276'),
    description: "Les grands projets financés exigent désormais des spécialistes capables de prévenir leurs risques pour l'environnement et les populations. Vous apprenez à appliquer les normes de sauvegarde, à évaluer les risques, à élaborer les instruments requis, à consulter les communautés et à gérer les plaintes. Vous travaillez à partir de situations de projet et vous gagnez une expertise utile aux bailleurs, aux bureaux d'études et aux unités de gestion.",
    objectives: [
      "Identifier les risques et les impacts environnementaux et sociaux d'un projet.",
      "Élaborer les principaux instruments de sauvegarde.",
      "Organiser la consultation des parties prenantes et la gestion des plaintes.",
      "Suivre et rapporter la conformité d'un projet."
    ],
    resultatsAttendus: [
      "Vous analysez un projet selon les exigences de sauvegarde.",
      "Vous contribuez à la rédaction d'instruments de qualité.",
      "Vous dialoguez efficacement avec les communautés concernées.",
      "Vous vous positionnez sur les postes et missions de spécialiste en sauvegarde."
    ],
    publicParticuliers: ["Consultants, étudiants et professionnels de l'environnement ou du social.", "Personnes qui visent un poste de spécialiste en sauvegarde."],
    publicOrganisations: ["Unités de gestion de projets, ministères et agences d'exécution.", "Entreprises, bureaux d'études et ONG intervenant sur des projets financés."],
    admission: ["Profil conseillé : expérience ou intérêt pour les projets de développement.", "Prérequis conseillé : bonne capacité de rédaction.", "À prévoir : un ordinateur portable."]
  },

  // Ingénierie de formation et de renforcement de capacités
  'analyse et planification des dispositifs de formation': {
    imageUrl: photo('1623652554515-91c833e3080e'),
    description: "Une formation qui transforme commence toujours par les bonnes questions. Vous apprenez à identifier les vrais besoins en compétences, à construire un référentiel et à bâtir un plan de formation priorisé et chiffré. Avec des outils d'entretien et d'analyse utilisables immédiatement, vous devenez capable de relier chaque action de formation à un enjeu réel. Une compétence clé pour évoluer vers les métiers des ressources humaines et du conseil, comme pour rendre chaque franc investi par une organisation plus utile.",
    objectives: [
      "Recueillir et analyser des besoins en compétences par métier.",
      "Élaborer un référentiel de compétences simple et utile.",
      "Prioriser les actions selon les enjeux et les budgets.",
      "Formaliser un plan de formation chiffré."
    ],
    resultatsAttendus: [
      "Vous menez en autonomie un diagnostic des besoins.",
      "Vous distinguez un vrai besoin de formation d'un autre type de problème.",
      "Vous présentez et défendez un plan de formation crédible.",
      "Vous devenez un interlocuteur stratégique sur le développement des compétences."
    ],
    publicParticuliers: ["Formateurs, consultants et chargés de formation.", "Professionnels RH et personnes en reconversion vers l'ingénierie de formation."],
    publicOrganisations: ["Directions des ressources humaines et responsables de formation.", "Ministères, collectivités, entreprises et ONG."],
    admission: ["Profil conseillé : expérience en formation ou en ressources humaines, ou projet professionnel dans ce domaine.", "Prérequis conseillé : aisance à l'écrit et à l'oral.", "À prévoir : un ordinateur portable."]
  },
  'conception pedagogique et innovation educative': {
    imageUrl: photo('1758873272955-3b066dd11c6b'),
    description: "Un bon contenu ne suffit pas : encore faut-il qu'il donne envie d'apprendre. Vous apprenez à définir des objectifs mesurables, à scénariser un parcours par compétences et à créer des supports et des modules en ligne attractifs. Vous concevez votre propre séquence pendant la formation. Que vous soyez enseignant, expert, formateur ou équipe pédagogique, vous repartez avec des réalisations concrètes et un nouveau regard sur la manière de transmettre.",
    objectives: [
      "Rédiger des objectifs pédagogiques observables et mesurables.",
      "Scénariser un parcours structuré par compétences.",
      "Produire des supports et des contenus e-learning attractifs.",
      "Combiner présentiel, distanciel et mises en situation."
    ],
    resultatsAttendus: [
      "Vous concevez une séquence de formation complète, de l'objectif à l'évaluation.",
      "Vous créez vos propres supports et un module en ligne.",
      "Vous choisissez la modalité la mieux adaptée à chaque public.",
      "Vous renouvelez durablement votre façon de transmettre."
    ],
    publicParticuliers: ["Enseignants, formateurs et experts métiers.", "Créateurs de contenus et personnes qui veulent lancer leurs propres formations."],
    publicOrganisations: ["Centres de formation, écoles et universités.", "Directions RH et académies d'entreprise."],
    admission: ["Profil conseillé : toute personne qui a un savoir à transmettre.", "Prérequis conseillé : aisance de base avec un ordinateur.", "À prévoir : un ordinateur portable et un thème de formation à travailler."]
  },
  'mise en oeuvre des formations': {
    imageUrl: photo('1664382953481-141e97ad9825'),
    description: "Un formateur qui captive laisse une trace durable. Vous apprenez à préparer une session, à animer en présentiel comme à distance, à gérer un groupe et à garder chacun actif du début à la fin. Vous passez vous-même devant le groupe et vous progressez à chaque essai. Vous gagnez en aisance, en présence et en efficacité, que vous animiez à titre indépendant ou pour votre organisation.",
    objectives: [
      "Préparer et organiser une session de formation.",
      "Animer des séquences actives avec des cas pratiques.",
      "Gérer la dynamique d'un groupe et les situations délicates.",
      "Assurer le suivi administratif et l'évaluation de la session."
    ],
    resultatsAttendus: [
      "Vous animez une session avec aisance et assurance.",
      "Vous maintenez l'attention et la participation de tout le groupe.",
      "Vous adaptez votre animation au profil des participants.",
      "Vous progressez grâce à des retours précis sur votre pratique."
    ],
    publicParticuliers: ["Formateurs débutants ou confirmés, consultants et experts.", "Toute personne amenée à prendre la parole pour transmettre."],
    publicOrganisations: ["Responsables de formation et formateurs internes.", "Projets de développement ayant un volet de renforcement de capacités."],
    admission: ["Profil conseillé : toute personne amenée à former ou à animer un groupe.", "Prérequis : une maîtrise du sujet que vous souhaitez transmettre.", "À prévoir : une courte séquence à présenter pendant les mises en situation."]
  },
  'evaluation et developpement professionnel': {
    imageUrl: photo('1627556704290-2b1f5853ff78'),
    description: "Ce qui ne se mesure pas s'améliore difficilement. Vous apprenez à utiliser le modèle de Kirkpatrick pour évaluer la satisfaction, les acquis, les changements de pratiques et les résultats. Vous construisez vos grilles, vous analysez des retours et vous apprenez à accompagner la progression des personnes. Vous saurez prouver la valeur d'une formation et construire un parcours de développement, pour vous-même, pour ceux que vous accompagnez ou pour votre organisation.",
    objectives: [
      "Construire des outils d'évaluation à chaque niveau du modèle de Kirkpatrick.",
      "Mesurer l'application des acquis en situation de travail.",
      "Analyser les résultats et formuler des améliorations.",
      "Élaborer un plan de développement professionnel."
    ],
    resultatsAttendus: [
      "Vous démontrez, preuves à l'appui, ce qu'une formation a réellement changé.",
      "Vous disposez d'outils d'évaluation prêts à l'emploi.",
      "Vous améliorez chaque action à partir de ses résultats.",
      "Vous pilotez avec méthode votre progression ou celle de vos collaborateurs."
    ],
    publicParticuliers: ["Formateurs, coachs et chargés de formation.", "Professionnels qui veulent construire leur plan de carrière."],
    publicOrganisations: ["Directions RH, managers et responsables de programmes.", "Centres de formation, bailleurs et organismes certificateurs."],
    admission: ["Profil conseillé : expérience en formation, en RH ou en gestion d'équipe.", "Prérequis conseillé : notions de base en tableur.", "À prévoir : un ordinateur portable et, si possible, une formation déjà réalisée à analyser."]
  },

  // Ingénierie informatique et systèmes de réseaux
  'infrastructure et reseaux': {
    imageUrl: photo('1698668975271-2ba9a323be6b'),
    description: "Derrière chaque service numérique, il y a des réseaux et des serveurs, et des professionnels qui les font tourner. Vous apprenez à concevoir un réseau d'entreprise, à configurer des serveurs, à utiliser le cloud et à garantir la continuité des services. Les exercices pratiques occupent une large place : vous configurez, vous testez et vous dépannez. Vous gagnez une compétence technique concrète, pour viser un poste, évoluer dans le vôtre ou fiabiliser le système de votre organisation.",
    objectives: [
      "Concevoir l'architecture d'un réseau d'entreprise.",
      "Configurer et administrer des serveurs.",
      "Mettre en place des sauvegardes et un plan de reprise.",
      "Diagnostiquer et résoudre les pannes courantes."
    ],
    resultatsAttendus: [
      "Vous installez et configurez un réseau fonctionnel.",
      "Vous administrez des serveurs avec méthode.",
      "Vous résolvez les pannes de manière structurée et rapide.",
      "Vous élargissez vos perspectives vers les métiers de l'infrastructure."
    ],
    publicParticuliers: ["Étudiants, techniciens et jeunes diplômés en informatique.", "Personnes en reconversion vers les réseaux et les systèmes."],
    publicOrganisations: ["Directions des systèmes d'information et administrateurs.", "Entreprises multisites, administrations, banques, hôpitaux et écoles."],
    admission: ["Profil conseillé : bases en informatique ou forte motivation technique.", "Prérequis conseillé : utilisation courante d'un ordinateur et notions d'adressage réseau.", "À prévoir : un ordinateur portable capable d'exécuter des outils de simulation."]
  },
  'developpement logiciel et solutions applicatives': {
    imageUrl: photo('1515879218367-8466d910aaa4'),
    description: "Créer une application utile, c'est transformer une idée en solution concrète. Vous apprenez à recueillir un besoin, à concevoir une application, à développer pour le web, à connecter des services par des API et à livrer un produit fiable. Vous construisez un vrai projet du début à la fin, qui pourra enrichir votre portfolio. Une excellente porte d'entrée vers les métiers du développement, et un moyen pour les organisations de créer les outils qui leur manquent.",
    objectives: [
      "Formaliser les besoins fonctionnels d'une application.",
      "Développer une application web simple et sécurisée.",
      "Connecter des services à l'aide d'API.",
      "Tester et déployer une application."
    ],
    resultatsAttendus: [
      "Vous transformez un besoin en application fonctionnelle.",
      "Vous repartez avec un projet concret à présenter.",
      "Vous adoptez les bonnes pratiques de code et de sécurité.",
      "Vous gagnez en autonomie pour poursuivre votre progression."
    ],
    publicParticuliers: ["Étudiants, développeurs débutants et autodidactes.", "Personnes en reconversion et entrepreneurs du numérique."],
    publicOrganisations: ["Directions informatiques et directions métiers.", "PME, institutions publiques et ONG ayant besoin d'outils spécifiques."],
    admission: ["Profil conseillé : esprit logique et goût de la résolution de problèmes.", "Prérequis conseillé : notions de base en programmation.", "À prévoir : un ordinateur portable et une idée d'application à réaliser."]
  },
  'cybersecurite et gouvernance it': {
    imageUrl: photo('1614064641938-3bbee52942c7'),
    description: "Les attaques se multiplient, et il faut des personnes capables d'y faire face. Vous apprenez à reconnaître les menaces, à évaluer les vulnérabilités, à appliquer les bonnes pratiques et à comprendre les principes de la norme ISO 27001. Vous vous exercez sur des scénarios réalistes. Vous saurez mieux protéger vos données, celles de vos clients et celles de votre organisation, tout en ouvrant la voie à un métier d'avenir.",
    objectives: [
      "Reconnaître les principales menaces et techniques d'attaque.",
      "Évaluer les vulnérabilités d'un système.",
      "Rédiger des règles de sécurité adaptées au contexte.",
      "Réagir avec méthode à un incident de sécurité."
    ],
    resultatsAttendus: [
      "Vous détectez les failles les plus courantes et proposez des corrections.",
      "Vous adoptez et diffusez les bons réflexes de sécurité.",
      "Vous savez que faire, et dans quel ordre, en cas d'incident.",
      "Vous posez des bases solides pour évoluer vers les métiers de la cybersécurité."
    ],
    publicParticuliers: ["Étudiants, techniciens et administrateurs qui veulent se spécialiser.", "Toute personne qui souhaite protéger ses comptes et ses données."],
    publicOrganisations: ["Responsables de la sécurité et directions des systèmes d'information.", "Banques, assurances, télécoms, santé, administrations et PME."],
    admission: ["Profil conseillé : débutant motivé pour les bases, ou profil informatique pour aller plus loin.", "Prérequis conseillé : aisance avec un ordinateur et Internet.", "À prévoir : un ordinateur portable."]
  },
  'transformation numerique': {
    imageUrl: photo('1542751110-97427bbecf20'),
    description: "Le numérique rend plus forts ceux qui savent s'en servir. Vous apprenez à évaluer une maturité numérique, à bâtir une feuille de route, à automatiser des tâches et à exploiter les données pour mieux décider. Vous repartez avec des outils que vous pouvez utiliser dès le lendemain. Que vous souhaitiez gagner en efficacité dans votre métier, devenir référent numérique ou conduire la digitalisation d'une organisation, vous prenez une longueur d'avance.",
    objectives: [
      "Évaluer une maturité numérique.",
      "Élaborer une feuille de route priorisée.",
      "Automatiser des tâches et des processus répétitifs.",
      "Exploiter les données à l'aide de tableaux de bord."
    ],
    resultatsAttendus: [
      "Vous identifiez les tâches à automatiser et vous passez à l'action.",
      "Vous gagnez du temps grâce à des outils simples.",
      "Vous prenez des décisions à partir de tableaux de bord clairs.",
      "Vous devenez un moteur du changement numérique autour de vous."
    ],
    publicParticuliers: ["Professionnels de tous métiers qui veulent gagner en efficacité.", "Entrepreneurs, jeunes diplômés et futurs chefs de projet numérique."],
    publicOrganisations: ["Directions générales et directions de la transformation.", "Administrations, PME et entreprises de tous secteurs."],
    admission: ["Profil conseillé : toute personne utilisant déjà des outils numériques au travail.", "Prérequis conseillé : aisance avec la bureautique.", "À prévoir : un ordinateur portable et un exemple de tâche à simplifier."]
  },

  // Ingénierie de développement territorial
  'amenagement du territoire et urbanisme': {
    imageUrl: photo('1717700299588-ee73dc7de1fa'),
    description: "Les villes de demain se dessinent aujourd'hui, et elles ont besoin de personnes capables de les penser. Vous apprenez à poser un diagnostic territorial, à lire et à produire des documents d'urbanisme, à organiser la concertation et à programmer les investissements. Vous travaillez sur des cas de quartiers et de communes. Une compétence qui valorise votre parcours, et qui permet aux institutions de mieux maîtriser leur croissance.",
    objectives: [
      "Réaliser un diagnostic territorial.",
      "Lire et élaborer des documents d'urbanisme.",
      "Animer une concertation avec les acteurs locaux.",
      "Programmer des équipements et des investissements prioritaires."
    ],
    resultatsAttendus: [
      "Vous analysez un territoire et vous en dégagez les enjeux.",
      "Vous participez activement à l'élaboration d'un schéma ou d'un plan.",
      "Vous conduisez une réunion de concertation avec méthode.",
      "Vous renforcez votre profil dans les métiers de l'urbanisme."
    ],
    publicParticuliers: ["Étudiants, urbanistes, architectes et géographes.", "Agents publics et consultants qui veulent se spécialiser."],
    publicOrganisations: ["Ministères, agences d'aménagement et services techniques.", "Districts, régions, communes et promoteurs de projets urbains."],
    admission: ["Profil conseillé : formation ou expérience en urbanisme, géographie, génie civil ou administration.", "Prérequis conseillé : lecture de plans et de cartes.", "À prévoir : un ordinateur portable."]
  },
  'decentralisation et gouvernance locale': {
    imageUrl: photo('1780396269429-e20eaa1a1cd2'),
    description: "C'est au niveau local que le développement se voit et se vit. Vous apprenez le fonctionnement des collectivités, la planification participative, la mobilisation des recettes et la redevabilité envers les citoyens. Avec des études de cas et des exercices, vous gagnez des outils pour agir, que vous soyez élu, agent municipal, leader associatif, étudiant ou institution d'appui. Vous repartez capable d'améliorer concrètement les services rendus aux populations.",
    objectives: [
      "Expliquer les compétences et le fonctionnement des collectivités.",
      "Élaborer un plan de développement local participatif.",
      "Améliorer la mobilisation et le recouvrement des recettes locales.",
      "Mettre en place des pratiques de transparence et de redevabilité."
    ],
    resultatsAttendus: [
      "Vous contribuez efficacement à la gestion d'une collectivité.",
      "Vous animez une démarche participative avec les habitants.",
      "Vous proposez des actions réalistes pour accroître les recettes.",
      "Vous gagnez en légitimité auprès des élus et des citoyens."
    ],
    publicParticuliers: ["Élus, candidats, agents municipaux et leaders associatifs.", "Étudiants et consultants intéressés par la gouvernance locale."],
    publicOrganisations: ["Mairies, conseils régionaux et districts.", "Ministères, organisations de la société civile et programmes d'appui."],
    admission: ["Profil conseillé : engagement ou intérêt pour la vie publique locale.", "Prérequis : pas de diplôme particulier, seulement une expérience ou un projet d'engagement local.", "À prévoir : si possible, un document de votre commune à étudier."]
  },
  'developpement rural et filieres agricoles': {
    imageUrl: photo('1564491683755-fb07a55a5299'),
    description: "De la plantation au marché, la valeur se gagne à chaque maillon. Vous apprenez à analyser une chaîne de valeur, à structurer une coopérative, à mieux vendre et à monter un projet agricole crédible. Vous travaillez sur des filières bien connues comme le cacao ou le vivrier, avec des exercices directement applicables. Vous repartez capable de créer davantage de valeur, pour votre exploitation, votre coopérative, votre entreprise ou les communautés que vous accompagnez.",
    objectives: [
      "Analyser une chaîne de valeur et ses points de blocage.",
      "Organiser une coopérative ou un groupement performant.",
      "Améliorer la mise en marché et la valorisation des produits.",
      "Monter un projet agricole ou rural finançable."
    ],
    resultatsAttendus: [
      "Vous identifiez les leviers qui augmentent les revenus d'une filière.",
      "Vous améliorez la gestion d'une exploitation ou d'une coopérative.",
      "Vous négociez mieux avec les acheteurs et les fournisseurs.",
      "Vous disposez d'un projet agricole prêt à être présenté."
    ],
    publicParticuliers: ["Producteurs, jeunes agripreneurs et techniciens agricoles.", "Étudiants et conseillers en développement rural."],
    publicOrganisations: ["Coopératives, faîtières et agro-industriels.", "Ministères, projets de développement rural et bailleurs."],
    admission: ["Profil conseillé : toute personne impliquée ou qui souhaite investir dans l'agriculture.", "Prérequis : pas de diplôme exigé, l'expérience de terrain est valorisée.", "À prévoir : les informations disponibles sur votre exploitation ou votre filière."]
  },
  'sig et observation territoriale': {
    imageUrl: photo('1473968512647-3e447244af8f'),
    description: "Une bonne carte vaut souvent mieux qu'un long rapport. Vous apprenez à collecter des données géographiques, à les traiter avec QGIS, à produire des cartes professionnelles et à exploiter les images, notamment celles issues de drones. Vous travaillez sur vos propres cartes dès les premières séances. Vous repartez avec une compétence utile à l'urbanisme, à l'agriculture, à l'environnement et aux projets de développement, et qui permet à toute organisation de mieux voir pour mieux décider.",
    objectives: [
      "Collecter et structurer des données géographiques.",
      "Traiter et analyser des données avec QGIS.",
      "Produire des cartes thématiques claires et professionnelles.",
      "Exploiter des images aériennes et des images de drone."
    ],
    resultatsAttendus: [
      "Vous réalisez une carte professionnelle de A à Z.",
      "Vous répondez à une question de terrain grâce à l'analyse spatiale.",
      "Vous constituez et mettez à jour une base de données géographiques.",
      "Vous enrichissez votre CV d'une compétence technique concrète."
    ],
    publicParticuliers: ["Étudiants, géographes, agronomes et techniciens.", "Professionnels qui veulent ajouter la cartographie à leurs compétences."],
    publicOrganisations: ["Services techniques, fonciers et cadastraux.", "Projets d'infrastructure, d'agriculture et d'environnement."],
    admission: ["Profil conseillé : débutant motivé ou professionnel utilisant des données de terrain.", "Prérequis conseillé : aisance avec un ordinateur et un tableur.", "À prévoir : un ordinateur portable pouvant accueillir QGIS."]
  },

  // Gestion, suivi et évaluation des projets et programmes
  'conception et planification de projets': {
    imageUrl: photo('1532622785990-d2c36a76f5a6'),
    description: "Un projet bien conçu est déjà à moitié réussi. Vous apprenez à analyser un problème, à formuler une théorie du changement, à construire un cadre logique et à établir un budget et un calendrier réalistes. Vous faites évoluer un projet concret, séance après séance. À la fin, vous savez écrire un projet qui tient debout et qui convainc : un atout majeur pour répondre à des appels à propositions, viser un poste ou renforcer une équipe.",
    objectives: [
      "Analyser un problème et ses parties prenantes.",
      "Formuler une théorie du changement et un cadre logique.",
      "Élaborer un chronogramme et un budget par objectifs.",
      "Identifier les risques et les réponses à apporter."
    ],
    resultatsAttendus: [
      "Vous rédigez un document de projet cohérent et finançable.",
      "Vous définissez des indicateurs réellement mesurables.",
      "Vous répondez avec plus d'assurance aux appels à propositions.",
      "Vous gagnez une méthode réutilisable sur tous vos projets."
    ],
    publicParticuliers: ["Chefs de projet débutants, étudiants et jeunes diplômés.", "Porteurs d'initiatives et responsables associatifs."],
    publicOrganisations: ["ONG, associations et organisations internationales.", "Ministères, collectivités et entreprises."],
    admission: ["Profil conseillé : toute personne amenée à concevoir ou à rédiger un projet.", "Prérequis conseillé : aisance à l'écrit et bases d'Excel.", "À prévoir : un ordinateur portable et une idée de projet."]
  },
  'suivi operationnel et financier': {
    imageUrl: photo('1686061594225-3e92c0cd51b0'),
    description: "Un projet dérape rarement d'un seul coup : ce sont les petits écarts non vus qui coûtent cher. Vous apprenez à définir des indicateurs, à construire des tableaux de bord, à relier l'avancement aux dépenses, notamment avec la valeur acquise, et à rédiger des rapports utiles. Vous manipulez des outils de suivi sur des cas concrets. Vous gagnez une capacité de pilotage qui fait la différence, pour vous en tant que professionnel comme pour votre organisation.",
    objectives: [
      "Définir des indicateurs et une routine de suivi.",
      "Construire des tableaux de bord de pilotage.",
      "Relier l'avancement physique à l'exécution financière.",
      "Rédiger des rapports d'avancement clairs."
    ],
    resultatsAttendus: [
      "Vous repérez tôt les écarts de délais et de coûts.",
      "Vous pilotez un projet avec des tableaux de bord que vous avez conçus.",
      "Vous proposez des mesures correctives argumentées.",
      "Vous produisez des rapports fiables à échéance."
    ],
    publicParticuliers: ["Assistants de projet, chefs de projet et chargés de suivi.", "Comptables et gestionnaires qui veulent évoluer vers le pilotage de projets."],
    publicOrganisations: ["Unités de gestion de projets et coordinations.", "Directions de la planification, ONG et entreprises."],
    admission: ["Profil conseillé : première expérience de projet ou de gestion.", "Prérequis conseillé : pratique d'Excel.", "À prévoir : un ordinateur portable équipé d'Excel."]
  },
  'evaluation d impact': {
    imageUrl: photo('1553775927-a071d5a6a39a'),
    description: "Qu'est-ce qui a réellement changé dans la vie des gens ? Savoir répondre à cette question est une expertise précieuse. Vous apprenez à concevoir une évaluation, à collecter des données fiables et à analyser les résultats selon les critères du CAD de l'OCDE. Vous rédigez et présentez vos conclusions lors d'exercices encadrés. Vous gagnez la rigueur d'un évaluateur, pour vos missions, votre carrière et votre organisation.",
    objectives: [
      "Formuler des questions et une méthodologie d'évaluation.",
      "Collecter des données quantitatives et qualitatives.",
      "Apprécier des résultats selon les critères du CAD de l'OCDE.",
      "Rédiger des conclusions et des recommandations utiles."
    ],
    resultatsAttendus: [
      "Vous concevez le plan d'évaluation d'un projet.",
      "Vous distinguez les résultats réels des simples activités réalisées.",
      "Vous rédigez un rapport argumenté et utile à la décision.",
      "Vous pouvez contribuer à des missions d'évaluation."
    ],
    publicParticuliers: ["Consultants, chargés de suivi-évaluation et jeunes chercheurs.", "Professionnels du développement qui veulent se spécialiser."],
    publicOrganisations: ["Bailleurs, organisations internationales et ONG.", "Ministères, agences d'exécution et unités de gestion de projets."],
    admission: ["Profil conseillé : expérience de projet, de recherche ou de suivi-évaluation.", "Prérequis conseillé : notions de statistiques et bonne capacité de rédaction.", "À prévoir : un ordinateur portable."]
  },
  'systemes d information pour le suivi evaluation sise': {
    imageUrl: photo('1599591520443-e5045e52d4e6'),
    description: "Fini les fichiers dispersés et les rapports faits dans l'urgence. Vous apprenez à créer des formulaires avec KoboCollect, à centraliser et à contrôler vos données, puis à construire des tableaux de bord sous Power BI. Vous bâtissez une chaîne complète, de la collecte sur le terrain jusqu'au tableau de bord final. Vous devenez capable de mettre les bonnes données à la disposition des bonnes personnes, une compétence précieuse dans les projets et les organisations.",
    objectives: [
      "Concevoir un formulaire de collecte numérique sous KoboCollect.",
      "Centraliser et contrôler la qualité des données.",
      "Construire des tableaux de bord sous Power BI.",
      "Automatiser la production des rapports."
    ],
    resultatsAttendus: [
      "Vous déployez une collecte numérique complète.",
      "Vous repérez et corrigez les erreurs de données.",
      "Vous repartez avec un tableau de bord réalisé par vos soins.",
      "Vous devenez une référence sur la donnée dans votre équipe."
    ],
    publicParticuliers: ["Chargés de suivi-évaluation, gestionnaires de données et étudiants.", "Professionnels du terrain qui veulent monter en compétences sur la donnée."],
    publicOrganisations: ["Unités de gestion de projets et programmes.", "ONG, organisations internationales et directions de la statistique."],
    admission: ["Profil conseillé : toute personne qui collecte ou utilise des données de terrain.", "Prérequis conseillé : bonne pratique d'Excel.", "À prévoir : un ordinateur portable et un smartphone Android."]
  },

  // Études, enquêtes et recherches socio-économiques
  'enquetes statistiques et sondages': {
    imageUrl: photo('1631540702177-d2b28aa09fb0'),
    description: "Une enquête bien faite vaut de l'or ; une enquête mal faite induit en erreur. Vous apprenez à définir un échantillon, à rédiger un questionnaire qui fonctionne, à organiser le terrain avec la collecte mobile et à contrôler la qualité. Vous réalisez une enquête à petite échelle pendant la formation. Vous en sortez capable de conduire vos propres études, d'encadrer des enquêteurs et d'apporter des données solides à ceux qui décident.",
    objectives: [
      "Définir une méthodologie et un échantillon représentatif.",
      "Rédiger et tester un questionnaire.",
      "Organiser et superviser une collecte mobile.",
      "Apurer et analyser les données."
    ],
    resultatsAttendus: [
      "Vous concevez une enquête de bout en bout.",
      "Vous réduisez les biais grâce à de bonnes pratiques de terrain.",
      "Vous encadrez une équipe d'enquêteurs avec méthode.",
      "Vous livrez des résultats clairs et exploitables."
    ],
    publicParticuliers: ["Étudiants, enquêteurs et jeunes statisticiens.", "Chargés d'études et consultants."],
    publicOrganisations: ["Institutions statistiques et ministères.", "Bailleurs, ONG et entreprises réalisant des études."],
    admission: ["Profil conseillé : intérêt pour les études, les statistiques ou le terrain.", "Prérequis conseillé : notions de base en statistiques et en tableur.", "À prévoir : un ordinateur portable et un smartphone."]
  },
  'etudes socio economiques': {
    imageUrl: photo('1687422808565-929533931584'),
    description: "Pour agir juste, il faut d'abord comprendre les réalités des personnes et des marchés. Vous apprenez à analyser les conditions de vie et les vulnérabilités, à étudier un marché, à établir une situation de référence et à formuler des recommandations claires. Vous pratiquez les entretiens, les groupes de discussion et l'analyse sur des cas concrets. Vous gagnez un regard d'expert, utile à votre carrière, à vos projets et aux décisions de votre organisation.",
    objectives: [
      "Choisir les méthodes qualitatives et quantitatives adaptées.",
      "Conduire des entretiens et des groupes de discussion.",
      "Analyser les vulnérabilités et le potentiel d'un marché.",
      "Rédiger un rapport d'étude convaincant."
    ],
    resultatsAttendus: [
      "Vous réalisez une étude socio-économique structurée.",
      "Vous tirez des enseignements solides de vos données de terrain.",
      "Vous formulez des recommandations réalistes et bien argumentées.",
      "Vous pouvez répondre à des demandes d'études."
    ],
    publicParticuliers: ["Sociologues, économistes, étudiants et chargés d'études.", "Entrepreneurs qui veulent mieux connaître leur marché."],
    publicOrganisations: ["Ministères sociaux, agences de développement et ONG.", "Entreprises et collectivités territoriales."],
    admission: ["Profil conseillé : formation en sciences sociales, économie ou gestion, ou expérience de terrain.", "Prérequis conseillé : bonne capacité de rédaction.", "À prévoir : un ordinateur portable."]
  },
  'econometrie et analyse de donnees': {
    imageUrl: photo('1551288049-bebda4e38f71'),
    description: "Savoir ce qui explique réellement un phénomène, et l'anticiper : voilà la force de l'analyse de données. Vous apprenez à préparer un jeu de données, à estimer des modèles sous Stata, R ou Python, à tester leur solidité et à présenter vos résultats simplement. Vous travaillez sur des données dès le début. Vous développez un profil solide et valorisant, pour vos recherches, votre carrière ou les décisions stratégiques de votre organisation.",
    objectives: [
      "Préparer et nettoyer un jeu de données.",
      "Estimer un modèle économétrique adapté à la question posée.",
      "Tester la robustesse des résultats.",
      "Présenter les résultats à des non-spécialistes."
    ],
    resultatsAttendus: [
      "Vous menez une analyse complète, des données brutes aux conclusions.",
      "Vous interprétez correctement vos modèles.",
      "Vous écrivez des scripts que vous pouvez réutiliser.",
      "Vous rendez vos résultats compréhensibles pour les décideurs."
    ],
    publicParticuliers: ["Étudiants, chercheurs, économistes et statisticiens.", "Analystes de données qui veulent approfondir leurs méthodes."],
    publicOrganisations: ["Banques et institutions financières.", "Ministères de l'économie, instituts de recherche et grandes entreprises."],
    admission: ["Profil conseillé : formation en économie, statistique, mathématiques ou domaine voisin.", "Prérequis conseillé : bases de statistiques.", "À prévoir : un ordinateur portable."]
  },
  'etudes sectorielles specialisees': {
    imageUrl: photo('1508514177221-188b1cf16e9d'),
    description: "Comprendre vraiment un secteur, c'est devenir la personne qu'on consulte. Vous apprenez à cartographier les acteurs, à analyser les règles du jeu, à repérer les tendances et les opportunités, puis à produire une note sectorielle convaincante. Énergie, éducation ou autres secteurs clés : vous pratiquez sur des cas concrets. Vous renforcez votre valeur de consultant, d'investisseur ou de cadre, et vous aidez les organisations à mieux choisir leurs orientations.",
    objectives: [
      "Dresser l'état des lieux d'un secteur et de ses acteurs.",
      "Analyser le cadre réglementaire et institutionnel.",
      "Identifier les contraintes et les opportunités.",
      "Rédiger une note d'orientation sectorielle."
    ],
    resultatsAttendus: [
      "Vous réalisez un diagnostic sectoriel complet.",
      "Vous repérez plus tôt les opportunités et les risques.",
      "Vous produisez une note claire pour la décision.",
      "Vous gagnez en crédibilité sur le secteur étudié."
    ],
    publicParticuliers: ["Consultants, analystes et jeunes économistes.", "Entrepreneurs et investisseurs qui ciblent un secteur précis."],
    publicOrganisations: ["Ministères sectoriels et autorités de régulation.", "Bailleurs, banques de développement et organisations professionnelles."],
    admission: ["Profil conseillé : expérience ou fort intérêt pour le secteur étudié.", "Prérequis conseillé : capacité d'analyse et de rédaction.", "À prévoir : un ordinateur portable et le secteur que vous souhaitez approfondir."]
  },

  // Conseil stratégique et organisationnel
  'strategie d entreprise et vision': {
    imageUrl: photo('1528819622765-d6bcf132f793'),
    description: "Sans cap clair, même les plus grands efforts se dispersent. Vous apprenez à analyser un environnement avec les outils SWOT et PESTEL, à formuler une vision, à choisir des priorités et à les traduire en plan d'action. Vous appliquez chaque outil à votre propre activité ou à votre organisation. Vous développez une pensée de stratège qui fait évoluer votre posture de manager, d'entrepreneur ou de dirigeant.",
    objectives: [
      "Analyser un environnement à l'aide des outils SWOT et PESTEL.",
      "Formuler une vision, une mission et des axes stratégiques.",
      "Choisir des priorités réalistes.",
      "Traduire la stratégie en plan d'actions et en indicateurs."
    ],
    resultatsAttendus: [
      "Vous réalisez un diagnostic stratégique pertinent.",
      "Vous repartez avec un plan stratégique structuré.",
      "Vous argumentez vos choix devant une direction ou des partenaires.",
      "Vous prenez de la hauteur dans vos décisions."
    ],
    publicParticuliers: ["Managers, cadres et futurs dirigeants.", "Entrepreneurs et futurs consultants."],
    publicOrganisations: ["Dirigeants, comités de direction et conseils d'administration.", "Entreprises, institutions publiques et ONG."],
    admission: ["Profil conseillé : responsabilités d'encadrement ou projet d'entreprise.", "Prérequis conseillé : une première expérience professionnelle.", "À prévoir : les informations disponibles sur votre activité ou votre organisation."]
  },
  'organisation et processus': {
    imageUrl: photo('1769738360873-3ba6cac0b308'),
    description: "Travailler mieux, ce n'est pas toujours travailler plus : c'est d'abord supprimer ce qui ralentit. Vous apprenez à cartographier un processus, à repérer les pertes de temps, à clarifier les rôles et à rédiger des procédures réellement appliquées. Vous améliorez un processus concret au fil de la formation. Vous devenez la personne qui simplifie, qui clarifie et qui fait gagner du temps à tous : un profil précieux dans toute organisation.",
    objectives: [
      "Cartographier un processus existant.",
      "Identifier les pertes de temps et les doublons.",
      "Rédiger des fiches de postes et un organigramme clairs.",
      "Écrire des procédures simples et applicables."
    ],
    resultatsAttendus: [
      "Vous repensez un processus et vous en mesurez le gain.",
      "Vous rédigez des procédures réellement utilisées.",
      "Vous clarifiez qui fait quoi au sein d'une équipe.",
      "Vous vous affirmez comme force de proposition."
    ],
    publicParticuliers: ["Assistants de direction, responsables administratifs et qualité.", "Consultants et professionnels qui veulent évoluer vers l'organisation."],
    publicOrganisations: ["Directions générales, RH et contrôle interne.", "Entreprises en croissance, institutions publiques, projets et ONG."],
    admission: ["Profil conseillé : toute personne impliquée dans le fonctionnement d'un service.", "Prérequis conseillé : aisance avec la bureautique.", "À prévoir : un ordinateur portable et un processus de votre quotidien à améliorer."]
  },
  'gestion des ressources humaines et gpec': {
    imageUrl: photo('1573497491208-6b1acb260507'),
    description: "Les organisations qui gagnent savent attirer, développer et garder les talents. Vous apprenez à bâtir un référentiel de compétences, à mener des entretiens efficaces, à construire une grille salariale et à préparer des plans de carrière et de succession. Vous travaillez avec des modèles concrets, réutilisables immédiatement. Une compétence qui accélère votre carrière RH et qui rend votre organisation plus forte et plus attractive.",
    objectives: [
      "Élaborer un référentiel de métiers et de compétences.",
      "Analyser les écarts entre besoins et ressources.",
      "Structurer une grille salariale et un système d'évaluation.",
      "Préparer des plans de carrière et de succession."
    ],
    resultatsAttendus: [
      "Vous concevez des outils RH directement applicables.",
      "Vous menez des entretiens d'évaluation constructifs.",
      "Vous anticipez les besoins en compétences de demain.",
      "Vous gagnez en légitimité dans les fonctions RH."
    ],
    publicParticuliers: ["Assistants et chargés RH, jeunes diplômés en gestion.", "Managers qui veulent mieux développer leurs collaborateurs."],
    publicOrganisations: ["Directions des ressources humaines et directions générales.", "Entreprises, établissements publics et ONG."],
    admission: ["Profil conseillé : expérience ou projet professionnel dans les ressources humaines.", "Prérequis conseillé : aisance avec la bureautique.", "À prévoir : un ordinateur portable."]
  },
  'conduite du changement et culture': {
    imageUrl: photo('1600880292089-90a7e086ee0c'),
    description: "Bien des transformations échouent à cause des résistances humaines, et non de la technique. Vous apprenez à anticiper ces réactions, à communiquer, à mobiliser des relais et à faire adopter durablement de nouvelles pratiques. Mises en situation et études de cas vous entraînent aux conversations difficiles. Vous gagnez une compétence de leader, utile à chaque étape de votre carrière et décisive pour toute organisation qui veut réussir sa transformation.",
    objectives: [
      "Évaluer l'impact humain d'un changement.",
      "Identifier les freins et mobiliser des relais.",
      "Construire un plan de communication et d'accompagnement.",
      "Conduire des échanges difficiles avec calme et méthode."
    ],
    resultatsAttendus: [
      "Vous anticipez les résistances au lieu de les subir.",
      "Vous embarquez une équipe autour d'un changement.",
      "Vous communiquez clairement dans les moments d'incertitude.",
      "Vous vous affirmez comme un leader du changement."
    ],
    publicParticuliers: ["Managers, chefs de projet et futurs consultants.", "Professionnels RH et communicants."],
    publicOrganisations: ["Dirigeants et équipes de transformation.", "Organisations en fusion, restructuration ou digitalisation."],
    admission: ["Profil conseillé : toute personne qui encadre, ou qui porte un projet de changement.", "Prérequis conseillé : une première expérience d'équipe.", "À prévoir : un exemple de changement vécu ou à venir."]
  },
  'audit organisationnel': {
    imageUrl: photo('1635859890085-ec8cb5466806'),
    description: "Un regard rigoureux révèle ce que le quotidien empêche de voir. Vous apprenez à préparer un audit, à conduire des entretiens, à analyser des documents et à formuler des constats et des recommandations sans détour. Vous vous exercez sur un audit simulé de bout en bout. Vous gagnez une méthode de consultant et une capacité d'analyse qui vous distinguent, et qui aident les organisations à se redresser ou à franchir un cap.",
    objectives: [
      "Préparer une mission d'audit et ses outils.",
      "Conduire des entretiens et une revue documentaire.",
      "Identifier les dysfonctionnements et leurs causes.",
      "Rédiger un rapport et un plan d'amélioration priorisé."
    ],
    resultatsAttendus: [
      "Vous menez un audit organisationnel avec méthode.",
      "Vous rédigez des constats objectifs et argumentés.",
      "Vous présentez avec tact des conclusions difficiles.",
      "Vous pouvez intervenir sur des missions de conseil."
    ],
    publicParticuliers: ["Consultants, auditeurs et contrôleurs internes.", "Cadres qui souhaitent évoluer vers le conseil."],
    publicOrganisations: ["Conseils d'administration et directions générales.", "Établissements publics, entreprises et ONG en réorganisation."],
    admission: ["Profil conseillé : expérience en gestion, audit, contrôle ou management.", "Prérequis conseillé : capacité d'analyse et de rédaction.", "À prévoir : un ordinateur portable."]
  },
  'gouvernance et ethique': {
    imageUrl: photo('1573167507387-6b4b98cb7c13'),
    description: "La confiance se construit lentement et se perd vite. Vous apprenez le rôle d'un conseil d'administration, les bonnes pratiques de décision, la rédaction de chartes et la mise en place de dispositifs de conformité et de lutte contre la corruption. Vous travaillez à partir de dilemmes et d'études de cas. Vous renforcez votre stature d'administrateur, de dirigeant ou de responsable conformité, et vous aidez votre organisation à gagner la confiance de ses partenaires.",
    objectives: [
      "Distinguer les rôles du conseil, de la direction et des contrôleurs.",
      "Rédiger une charte de gouvernance ou d'éthique.",
      "Mettre en place un dispositif de conformité et d'alerte.",
      "Résoudre des dilemmes éthiques avec méthode."
    ],
    resultatsAttendus: [
      "Vous participez efficacement aux travaux d'un conseil.",
      "Vous repérez les conflits d'intérêts et vous savez les traiter.",
      "Vous contribuez à rédiger des règles claires et applicables.",
      "Vous gagnez en stature et en crédibilité."
    ],
    publicParticuliers: ["Administrateurs, futurs administrateurs et juristes.", "Dirigeants d'association et responsables conformité."],
    publicOrganisations: ["Conseils d'administration et directions générales.", "Entreprises, sociétés d'État, ONG et organisations faîtières."],
    admission: ["Profil conseillé : exercice ou projet de responsabilités de gouvernance.", "Prérequis conseillé : une première expérience de direction ou de la vie associative.", "À prévoir : si possible, les statuts ou règles de votre organisation."]
  }
};

export const axisKey = (title: string) => title
  .replace(/^\s*\d+\s*[.)-]\s*/, '')
  .replace(/œ/gi, 'oe')
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

// Below these lengths a text is a one-line summary or a generic placeholder, not a real description
const MIN_DESCRIPTION = 120;
const isThinList = (list?: string[]) => !list || list.length < 2 || list.every(item => item.length < 40);

export type AxisAudience = 'formation' | 'accompagnement';

/** Formations tab: the training sheet of the axis. The admin edits the mission, so only its image is kept. */
function formationAxis(sub: SubDomain): SubDomain {
  const key = axisKey(sub.title);
  const sheet = AXIS_SHEETS[key];
  if (!sheet) return sub;
  return {
    ...sub,
    presentationService: sheet.description,
    objectives: sheet.objectives,
    resultatsAttendus: sheet.resultatsAttendus,
    publicParticuliers: sheet.publicParticuliers,
    publicOrganisations: sheet.publicOrganisations,
    admission: sheet.admission,
    programme: FORMATION_PROGRAMS[key],
    offer: FORMATION_OFFERS[key],
    imageUrl: sub.imageUrl || sheet.imageUrl
  };
}

/** Accompagnement tab: what the admin entered, completed by the mission sheet of the axis */
function accompanimentAxis(sub: SubDomain): SubDomain {
  const key = axisKey(sub.title);
  const sheet = ACCOMPANIMENT_SHEETS[key];
  if (!sheet) return sub;
  return {
    ...sub,
    presentationService: (sub.presentationService || '').length >= MIN_DESCRIPTION ? sub.presentationService : sheet.description,
    objectives: isThinList(sub.objectives) ? sheet.objectives : sub.objectives,
    resultatsAttendus: sub.resultatsAttendus?.length ? sub.resultatsAttendus : sheet.resultatsAttendus,
    publicParticuliers: sub.publicParticuliers?.length ? sub.publicParticuliers : sheet.publicParticuliers,
    publicOrganisations: sub.publicOrganisations?.length ? sub.publicOrganisations : sheet.publicOrganisations,
    admission: sub.admission?.length ? sub.admission : sheet.admission,
    programme: sub.demarcheAccompagnement?.length ? undefined : sheet.programme,
    imageUrl: sub.imageUrl || AXIS_SHEETS[key]?.imageUrl
  };
}

/** The domains as displayed on each tab */
export function enrichDomains<T extends DomainIntervention>(domains: T[], audience: AxisAudience): T[] {
  return domains.map(domain => {
    const sheet = DOMAIN_SHEETS[domain.id];
    const missionText = ACCOMPANIMENT_DOMAINS[domain.id];
    return {
      ...domain,
      subDomains: (domain.subDomains || []).map(audience === 'formation' ? formationAxis : accompanimentAxis),
      ...(sheet ? {
        description: audience === 'formation'
          ? sheet.description
          : (domain.description || '').length >= 200 ? domain.description : missionText,
        imageUrl: domain.imageUrl || sheet.imageUrl
      } : {})
    };
  });
}
