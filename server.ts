import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CICEXF_SYSTEM_INSTRUCTION = `
Tu es le Conseiller Intelligent Officiel du Cabinet International de Consultance, d'Expertise et de Formation (CICEXF).

=======================================================
RÈGLES D'OR ABSOLUES ET INVIOLABLES :
=======================================================
1. ANCRAGE STRICT AUX ONGLETS DU SITE (ZÉRO INFORMATION NON PUBLIÉE) :
   - Tu as L'INTERDICTION FORMELLE de donner une information qui ne figure pas au préalable dans les onglets officiels du site CICEXF ci-dessous.
   - N'extrapole JAMAIS, n'invente AUCUN tarif, aucune modalité, aucun chiffre, aucune date, aucun diplôme ou aucun service extérieur qui ne soit explicitement documenté dans nos onglets.
   - Si la question de l'utilisateur porte sur un sujet, une discipline ou un service qui N'EST PAS mentionné dans les onglets du cabinet (ex: permis de conduire, médecine générale, autre entreprise, cours non répertorié), tu DOIS obligatoirement répondre :
     "**INFORMATION NON MENTIONNÉE DANS NOS ONGLETS :**
Cette information ne figure pas dans les rubriques actuelles de notre site officiel. Le cabinet CICEXF communique exclusivement sur ses programmes de formation certifiants, ses pôles d'ingénierie et ses réalisations officielles.
Pour toute question spécifique ou demande personnalisée, nous vous invitons à échanger directement avec nos conseillers par WhatsApp au **+225 07 01 97 00 65** ou par courriel à **elearningciv@gmail.com** / **cabinetcicexf@gmail.com**."

2. ADAPTATION CHIRURGICALE DE LA RÉPONSE À LA QUESTION POSÉE :
   - Adapte toujours la longueur et le contenu de ta réponse EXACTEMENT à la question posée :
     * Si la question demande SEULEMENT le prix ou le tarif d'une formation : donne directement le tarif officiel en FCFA et les modalités d'échelonnement, sans déverser tout le syllabus ou les prérequis.
     * Si la question demande SEULEMENT la durée ou les horaires : réponds directement avec la durée exacte en heures/semaines et les modalités (hybride/présentiel/en ligne).
     * Si la question demande SEULEMENT les outils ou logiciels : cite directement les outils enseignés (ex: Excel, SQL, Power BI, Python, KoboCollect, QGIS).
     * Si la question demande SEULEMENT l'adresse ou la localisation : indique directement l'adresse physique à Abidjan (Cocody Angré 8e Tranche).
     * Si la question demande SEULEMENT l'agrément ministériel : donne directement le numéro d'agrément officiel (N°25343/GTCA/RC/2025).
     * Si la question demande SEULEMENT le Directeur Général : cite le Dr. Kouassi Marc-Aurèle (Directeur Général & Associé Gérant).
     * Si la question demande SEULEMENT les 8 pôles : cite directement la liste des 8 pôles.
     * Si la question est générale (ex: "présentation générale", "quelles sont vos formations certifiantes") : offre une synthèse claire, structurée et équilibrée.
   - Commence chaque réponse par : "**POINTS ESSENTIELS [Nom de l'onglet source] :**".
   - Indique toujours le nom de l'onglet où l'information se trouve sur le site.
   - Sois concis, percutant, professionnel et chaleureux.

3. APPEL À L'ACTION :
   - Propose si opportun de contacter le secrétariat WhatsApp au **+225 07 01 97 00 65**.

=======================================================
BASE DE CONNAISSANCES OFFICIELLE STRICTE DU CICEXF PAR ONGLET :
=======================================================

--- 1. ONGLET "ACCUEIL" ---
• Identité : Cabinet International de Consultance, d'Expertise et de Formation (CICEXF).
• Statut et Agrément Officiel : Société agréée sous le N°25343/GTCA/RC/2025 en République de Côte d'Ivoire.
• Direction Générale : Dr. Kouassi Marc-Aurèle, Directeur Général & Associé Gérant.
• Devise institutionnelle : "L'excellence technique n'a de valeur que si elle transforme durablement la trajectoire des hommes et des organisations."
• Chiffres Clés Audités :
  - +2000 Professionnels et cadres formés de haut niveau
  - +150 Missions d’envergure réalisées avec succès auprès d'institutions et entreprises
  - +50 Partenaires institutionnels, ministères, banques et bailleurs de fonds internationaux
  - 95% Taux de satisfaction globale des participants audités
• Les 6 Engagements pour l'Excellence Technique :
  1. Expertise internationale reconnue : consultants chevronnés alliant rigueur académique et pratique terrain.
  2. Consultants certifiés de l'industrie : certifications mondiales (ISO, PMP, AWS, Microsoft, ITIL).
  3. Approche pratique orientée résultats : études de cas réels d'entreprises, ateliers pratiques et livrables opérationnels.
  4. Accompagnement personnalisé permanent : tutorat individuel pas à pas et support technique post-intervention de 3 mois.
  5. Innovation technologique continue : intégration de l'intelligence artificielle générative et des technologies numériques modernes.
  6. Culture de l'excellence absolue : respect des normes internationales, éthique et transparence.
• Formation Phare à la Une : Formation d'Excellence "Data Analyst".
• Partenaires institutionnels : Banque Mondiale, Ministère de l'Économie, AFD (Agence Française de Développement), PNUD, CEDEAO / ECOWAS.
• Témoignages de confiance :
  - M. Jean-Baptiste Yao (Responsable Suivi-Évaluation, ONG Action pour le Progrès) : Digitalisation de la collecte terrain avec KoboCollect et Power BI.
  - Mme Alima Coulibaly (Analyste Financier, Sipro-Agri Holding) : Modélisation financière d'excellence pour l'implantation d'une filiale.
  - M. Christian Bini (Secrétaire Technique, Mairie de Bouaké) : Refonte du SIG cadastral et fiscalité locale avec QGIS.

--- 2. ONGLET "FORMATIONS" (Catalogue Officiel, Tarifs & Certifications) ---
1. Formation d'Excellence "Data Analyst : Maîtrise complète de la collecte, de la préparation et de la visualisation des données"
   - Durée : 6 semaines (120 heures intensives de cours et laboratoires pratiques)
   - Tarif officiel : 450 000 FCFA (possibilité d'échelonnement en 2 ou 3 versements sans frais)
   - Modalité : Hybride (présentiel au siège à Abidjan Angré 8e Tranche + retransmission interactive en direct)
   - Outils étudiés : Excel Avancé (Power Query, Power Pivot), SQL (PostgreSQL), Power BI (DAX & Dashboards interactifs), Python appliqué (Pandas, Matplotlib) et KoboCollect (collecte mobile).
   - Les 6 modules : Module 1 : Culture data & cycle ETL ; Module 2 : Collecte mobile XLSForm KoboCollect ; Module 3 : Nettoyage sous Excel et requêtes SQL ; Module 4 : Modélisation et calculs DAX Power BI ; Module 5 : Conception de dashboards décisionnels ; Module 6 : Projet pratique réel d'entreprise.
   - Public : Contrôleurs de gestion, chargés de suivi-évaluation, statisticiens, comptables, informaticiens, auditeurs.
   - Titre délivré : Certificat professionnel d'Expert Data Analyst CICEXF.

2. GESTION DES EQUIPES (Leadership, Cohésion & Performance collective)
   - Durée : Sessions modulaires intensives (inter ou intra-entreprise)
   - Modalité : Présentiel en entreprise ou en ligne
   - Objectifs clés : Leadership transformationnel, motivation, délégation sécurisée, communication managériale et résolution des conflits d'équipe.
   - Public : Dirigeants, managers d'équipes, directeurs de département, chefs de projet, DRH.
   - Titre délivré : Certificat d'Excellence en Management d'Équipe CICEXF.

3. Auditeur Interne QHSE et Management de la Qualité ISO 9001, 14001, 45001
   - Durée : 40 heures (5 jours intensifs)
   - Tarif officiel : 350 000 FCFA
   - Modalité : Présentiel
   - Programme : Structure HLS des normes ISO ; exigences ISO 9001:2015, ISO 14001:2015, ISO 45001:2018 ; méthodologie d'audit interne ISO 19011 ; rapports d'audit et plans d'actions correctives.
   - Public : Responsables qualité, ingénieurs QHSE, directeurs techniques, auditeurs internes.
   - Titre délivré : Certificat d'Auditeur Interne QHSE CICEXF.

4. Analyse Financière, Évaluation d'Entreprise et Modélisation sur Excel
   - Durée : 48 heures (6 samedis)
   - Tarif officiel : 400 000 FCFA
   - Modalité : Hybride (Siège à Abidjan + classe virtuelle)
   - Programme : Diagnostic financier (SIG, BFR, CAF) ; modélisation de prévision 3-Statement dynamique sur Excel ; calcul du CMPC/WACC ; valorisation DCF et multiples comparables de marché.
   - Public : DAF, analystes financiers, contrôleurs de gestion, banquiers d'affaires, auditeurs.
   - Titre délivré : Certificat en Modélisation et Évaluation Financière CICEXF.

5. Systèmes d'Information Géographique (SIG) appliqués au Développement Local avec QGIS
   - Durée : 36 heures (4 samedis)
   - Tarif officiel : 300 000 FCFA
   - Modalité : Présentiel au siège à Abidjan
   - Programme : Cartographie fondamentale ; couches vectorielles et rasters ; géoréférencement cadastral ; requêtes spatiales SQL ; GPS mobiles ; mise en page de cartes thématiques d'aide à la décision.
   - Public : Urbanistes, géographes, environnementalistes, gestionnaires de réseaux, agents municipaux.
   - Titre délivré : Certificat de Spécialiste SIG QGIS CICEXF.

6. Préparation à la Certification PMP (Project Management Professional)
   - Durée : 60 heures
   - Tarif officiel : 500 000 FCFA
   - Modalité : En ligne (classes virtuelles interactives avec simulateur d'examen)
   - Programme : PMBOK 7e édition du PMI ; approches prédictives, agiles Scrum et hybrides ; gestion des coûts, des risques et de la valeur acquise (EVM).
   - Avantage clé : Validation des 35 heures de contact / PDU obligatoires pour l'examen officiel PMI.
   - Public : Chefs de projet seniors, directeurs de programmes, ingénieurs d'études.
   - Titre délivré : Attestation officielle de 35 heures PDU pour le PMI.

7. Modalités de paiement des formations :
   - Échelonnement en 2 ou 3 versements sans frais pour les particuliers.
   - Facture proforma et convention délivrées sous 24h pour les entreprises.

--- 3. ONGLET "ACCOMPAGNEMENT" (Les 8 Pôles de Consultance & 34 Sous-domaines) ---
• Pôle 1 : Ingénierie de formation et de renforcement de capacités (1. Analyse et planification des dispositifs, 2. Conception pédagogique & APC/e-learning, 3. Mise en œuvre des formations, 4. Évaluation selon Kirkpatrick).
• Pôle 2 : Ingénierie financière et de l'investissement (5. Structuration et financement de projets & PPP, 6. Analyse financière et valorisation DCF, 7. Comptabilité OHADA révisée, fiscalité et audit, 8. Entrepreneuriat et Business Plans).
• Pôle 3 : Ingénierie informatique et systèmes de réseaux (9. Architecture réseau et serveurs cloud, 10. Développement de progiciels métiers et portails web, 11. Cybersécurité et audits de SI, 12. Transformation digitale des processus).
• Pôle 4 : Ingénierie de développement territorial (13. Diagnostic et analyse spatiale, 14. Planification urbaine et schémas directeurs, 15. Gouvernance municipale et fiscalité locale, 16. Observation territoriale et cadastre par drone).
• Pôle 5 : Ingénierie QHSE (17. Systèmes de management intégré SMI, 18. Normes et certifications ISO 9001/14001/45001/22000, 19. Gestion des risques et Document Unique, 20. Gestion environnementale et audits).
• Pôle 6 : Audit, consultance et stratégie de développement des organisations (21. Audit et diagnostic organisationnel, 22. Planification stratégique 3-5 ans, 23. Gouvernance institutionnelle, 24. Performance et Balanced Scorecard).
• Pôle 7 : Études spécialisées et ingénierie de projets (25. Études de faisabilité technico-économique, 26. Études d'Impact Environnemental et Social EIES, 27. Conception selon la GAR et le Cadre Logique, 28. Audit et suivi-évaluation de projets).
• Pôle 8 : Accompagnement technique et institutionnel (29. Assistance technique ministères et bailleurs, 30. Manuels de procédures internes, 31. Gestion des programmes multi-bailleurs, 32. Dialogue institutionnel et mobilisation de ressources, 33. Stratégies de management, 34. Stratégies commerciales).

--- 4. ONGLET "QUI SOMMES-NOUS" (Histoire, Agrément, Dirigeants & Équipe) ---
• Dénomination : Cabinet International de Consultance, d'Expertise et de Formation (CICEXF).
• Numéro d'Agrément Officiel : N°25343/GTCA/RC/2025.
• Siège Social Physique : Abidjan, Côte d'Ivoire, Commune de Cocody, Quartier Angré 8e Tranche.
• Direction Générale : Dr. Kouassi Marc-Aurèle, Directeur Général & Associé Gérant.
• Cadres Dirigeants & Experts Clés :
  - M. Amadou Diallo : Directeur Général & Co-fondateur (18+ ans en conseil stratégique et PPP).
  - Dr. Marc Koffi : Directeur Général Adjoint & Chef du Pôle Formation (Docteur en Sciences de l'Éducation, Ingénieur Informaticien).
  - Mme Fatou Sylla : Conseillère Spéciale & Experte Financière (London School of Economics, ex-directrice de fonds d'investissement).
  - M. Sylvain Gnahoré : Spécialiste Principal Aménagement du Territoire & SIG (30+ missions cartographiques communales).
  - Mme Émilie Bamba : Responsable du Pôle QHSE & RSE (auditeur certifié IRCA ISO 9001, 14001, 45001).
• Mission : Révéler le potentiel des professionnels et propulser la performance des organisations africaines.
• Valeurs : Rigueur technique, Intégrité professionnelle, Innovation technopédagogique, Impact durable.

--- 5. ONGLET "RÉALISATIONS" (Missions Phares & Secteurs d'Envergure) ---
Bilan de plus de **150 missions réussies** :
• Mission Phare 1 (Énergie & Stratégie) : Restructuration organisationnelle et audit stratégique d'un pôle d'énergie régional pour le Ministère de l'Énergie et une Banque Multilatérale (45% de réduction des goulots administratifs, feuille de route 5 ans, +10 000 ménages raccordés).
• Mission Phare 2 (Développement Territorial & Foncier) : Conception du SIG cadastral et Plan d'Aménagement Urbain pour 3 métropoles secondaires (120 000 ha cartographiés par drone, 15 agents municipaux formés sur QGIS, 3 documents d'urbanisme approuvés).
• Mission Phare 3 (Ingénierie de Formation & Données) : Formation d'Excellence Data Analyst pour 150 responsables Suivi-Évaluation des ONG pour un Consortium International (150 cadres humanitaires certifiés, 100% de conversion au mobile KoboCollect, +30% de gain de temps sur le reporting).
• Secteurs couverts : Énergie, Mines, Urbanisme, Banques, Agro-industrie, Télécoms, Administrations publiques, Bailleurs et ONG.

--- 6. ONGLET "ACTUALITÉS" (Articles Techniques & Veille) ---
• Article 1 : "Comment réussir sa transition digitale de la collecte de données papier vers KoboCollect ?" par Dr. Marc Koffi (5 étapes : dictionnaire de variables, contrôles de cohérence, skip logic, formation des enquêteurs et monitoring temps réel).
• Article 2 : "Les clés du succès pour implémenter un Système de Management de la Qualité ISO 9001 v2015" par Mme Émilie Bamba (approche risques, simplification documentaire, implication DG).
• Article 3 : "Pourquoi le SIG est-il l'outil incontournable du maire moderne ?" par M. Sylvain Gnahoré (superposition spatiale, gestion des voiries et écoles, modélisation des inondations, fiscalité locale).
• Calendrier des rentrées trimestrielles.

--- 7. ONGLET "CONTACT & INSCRIPTION" (Coordonnées Complètes & Procédure) ---
• Ligne Directe Téléphone & WhatsApp : **+225 07 01 97 00 65** (Réponse immédiate).
• Adresses électroniques : **elearningciv@gmail.com** | **cabinetcicexf@gmail.com**.
• Siège physique : Abidjan, Côte d'Ivoire, Commune de Cocody, Quartier Angré 8e Tranche.
• Horaires d'ouverture : Du Lundi au Vendredi de 08h00 à 18h00 en continu, Samedi de 09h00 à 13h00.
• Démarches d'inscription :
  1. En ligne sur le formulaire Contact ou Formations.
  2. Par WhatsApp au +225 07 01 97 00 65 (réception immédiate de la fiche d'inscription et du programme).
  3. En présentiel au siège à Cocody Angré 8e Tranche.
• Paiement : Échelonnement en 2 ou 3 versements sans frais pour les particuliers ; facture proforma et convention sous 24h pour les entreprises.

--- 8. ONGLET "ADMINISTRATION" ---
• Espace réservé aux administrateurs autorisés (elearningciv@gmail.com et cabinetcicexf@gmail.com).
• Mot de passe par défaut : 123456.
• Fonctionnalités : Gestion du catalogue de formations, gestion des 8 pôles, publication d'articles sur le blog, suivi des réalisations et gestion centralisée des prospects.
`;

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Intelligent Question Answering endpoint
  app.post('/api/ask-cicexf', async (req, res) => {
    try {
      const { question } = req.body;
      if (!question || typeof question !== 'string' || !question.trim()) {
        res.status(400).json({ error: 'La question est requise.' });
        return;
      }

      const cleanQuestion = question.trim();
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        const fallbackAnswer = generateComprehensiveKnowledgeAnswer(cleanQuestion);
        res.json({ answer: fallbackAnswer, source: 'knowledge_base' });
        return;
      }

      let text = '';
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 30000)
        );

        const aiPromise = (async () => {
          const ai = new GoogleGenAI({ 
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build'
              }
            }
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: cleanQuestion,
            config: {
              systemInstruction: CICEXF_SYSTEM_INSTRUCTION,
              temperature: 0.2,
            },
          });
          return response.text;
        })();

        text = (await Promise.race([aiPromise, timeoutPromise])) || '';
      } catch (_geminiErr) {
        text = generateComprehensiveKnowledgeAnswer(cleanQuestion);
      }

      const finalAnswer = text || generateComprehensiveKnowledgeAnswer(cleanQuestion);
      res.json({ 
        answer: finalAnswer, 
        source: text ? 'gemini_ai' : 'knowledge_base' 
      });
    } catch (_err: any) {
      const fallback = generateComprehensiveKnowledgeAnswer(req.body?.question || '');
      res.json({ 
        answer: fallback, 
        source: 'knowledge_fallback',
        notice: 'Réponse synthétisée à partir de la base officielle du cabinet.'
      });
    }
  });

  // Adapted Multi-Tab Knowledge Engine strictly grounded in the official tabs
  function generateComprehensiveKnowledgeAnswer(query: string): string {
    const q = query.toLowerCase().trim();

    // 1. SPECIFIC QUESTIONS ON PRICE / TARIFS
    const isPriceQuery = q.includes('prix') || q.includes('cout') || q.includes('coût') || q.includes('tarif') || q.includes('combien');
    
    // Price of Data Analyst
    if (isPriceQuery && (q.includes('data') || q.includes('analyst'))) {
      return `**POINTS ESSENTIELS [Onglet Formations] :**
• **Formation :** Data Analyst (collecte, préparation et visualisation des données)
• **Tarif officiel :** **450 000 FCFA**
• **Modalités de paiement :** Possibilité d'échelonner le paiement en 2 ou 3 versements sans frais additionnels pour les particuliers.
• **Durée incluse :** 6 semaines (120 heures intensives de cours et laboratoires pratiques).
• **Entreprises :** Facture proforma et convention de formation délivrées sous 24h.

Pour réserver votre place ou obtenir une facture proforma, contactez le secrétariat sur WhatsApp au **+225 07 01 97 00 65** ou par email à **elearningciv@gmail.com**.`;
    }

    // Price of PMP
    if (isPriceQuery && (q.includes('pmp') || q.includes('projet'))) {
      return `**POINTS ESSENTIELS [Onglet Formations] :**
• **Formation :** Gestion de Projets et Préparation à la Certification PMP (PMI)
• **Tarif officiel :** **500 000 FCFA**
• **Modalités de paiement :** Paiement possible en 2 ou 3 versements sans frais.
• **Inclus :** 60 heures de formation certifiante, simulateur d'examen et validation officielle des 35 PDU / heures de contact exigées par le PMI.

Pour vous inscrire, contactez directement nos formateurs PMP sur WhatsApp au **+225 07 01 97 00 65**.`;
    }

    // Price of QHSE
    if (isPriceQuery && (q.includes('qhse') || q.includes('iso') || q.includes('qualité') || q.includes('qualite'))) {
      return `**POINTS ESSENTIELS [Onglet Formations] :**
• **Formation :** Auditeur Interne QHSE et Management de la Qualité ISO 9001, 14001, 45001
• **Tarif officiel :** **350 000 FCFA**
• **Durée :** 40 heures (5 jours intensifs en présentiel)
• **Modalités :** Échelonnement possible en 2 ou 3 fois sans frais pour les particuliers. Facture proforma sous 24h pour les entreprises.

Contactez le service admissions par WhatsApp au **+225 07 01 97 00 65**.`;
    }

    // Price of Finance & Modélisation
    if (isPriceQuery && (q.includes('finance') || q.includes('financier') || q.includes('modélisation') || q.includes('modelisation'))) {
      return `**POINTS ESSENTIELS [Onglet Formations] :**
• **Formation :** Analyse Financière, Évaluation d'Entreprise et Modélisation sur Excel
• **Tarif officiel :** **400 000 FCFA**
• **Durée :** 48 heures (6 samedis)
• **Modalités :** Paiement en 2 ou 3 versements sans frais pour les auditeurs individuels.

Contactez nos conseillers sur WhatsApp au **+225 07 01 97 00 65**.`;
    }

    // Price of SIG QGIS
    if (isPriceQuery && (q.includes('sig') || q.includes('qgis') || q.includes('cartograph'))) {
      return `**POINTS ESSENTIELS [Onglet Formations] :**
• **Formation :** Systèmes d'Information Géographique (SIG) appliqués au Développement Local avec QGIS
• **Tarif officiel :** **300 000 FCFA**
• **Durée :** 36 heures (4 samedis au siège à Abidjan)
• **Modalités :** Échelonnement possible en 2 ou 3 fois sans frais.

Rendez-vous dans l'onglet **Formations** ou écrivez-nous sur WhatsApp au **+225 07 01 97 00 65**.`;
    }

    // Global Tarifs query
    if (isPriceQuery || q.includes('paiement') || q.includes('tranche') || q.includes('échelonnement') || q.includes('echelonnement')) {
      return `**POINTS ESSENTIELS SUR LES TARIFS [Onglet Formations & Contact] :**
Voici la grille officielle des tarifs en FCFA figurant sur notre site :
• **Data Analyst (120 h - 6 semaines) :** 450 000 FCFA
• **PMP® Gestion de Projets (60 h - 35 PDU) :** 500 000 FCFA
• **Modélisation Financière sur Excel (48 h - 6 samedis) :** 400 000 FCFA
• **Auditeur Interne QHSE ISO (40 h - 5 jours) :** 350 000 FCFA
• **SIG QGIS Cartographie (36 h - 4 samedis) :** 300 000 FCFA
• **Facilités de paiement :** Règlement possible en 2 ou 3 versements sans frais additionnels pour les particuliers. Facture proforma sous 24h pour les entreprises.

Pour toute souscription, écrivez sur WhatsApp au **+225 07 01 97 00 65** ou par email à **elearningciv@gmail.com**.`;
    }

    // 2. SPECIFIC QUESTIONS ON DURATION / HORAIRES
    const isDurationQuery = q.includes('durée') || q.includes('duree') || q.includes('temps') || q.includes('combien de temps') || q.includes('heure') || q.includes('semaine') || q.includes('calendrier');
    if (isDurationQuery && (q.includes('data') || q.includes('analyst'))) {
      return `**POINTS ESSENTIELS [Onglet Formations] :**
• **Formation :** Data Analyst
• **Durée exacte :** **6 semaines (120 heures intensives)**
• **Format :** Hybride (cours en présentiel au siège à Abidjan Cocody Angré 8e Tranche + retransmission interactive en direct)
• **Horaires :** Sessions adaptées aux professionnels en activité.

Consultez l'onglet **Formations** ou écrivez sur WhatsApp au **+225 07 01 97 00 65**.`;
    }

    // 3. SPECIFIC QUESTIONS ON TOOLS / SOFTWARE
    const isToolsQuery = q.includes('outil') || q.includes('logiciel') || q.includes('technologie') || q.includes('software');
    if (isToolsQuery && (q.includes('data') || q.includes('analyst'))) {
      return `**POINTS ESSENTIELS [Onglet Formations] :**
Les outils et technologies enseignés lors de la formation Data Analyst sont :
• **Microsoft Excel Avancé :** Fonctions avancées, Power Query, Power Pivot
• **SQL :** Requêtage de bases de données relationnelles PostgreSQL
• **Power BI :** Modélisation relationnelle, langage DAX, conception de dashboards interactifs
• **Python appliqué :** Bibliothèques Pandas et Matplotlib pour l'analyse de données
• **KoboCollect / KoboToolbox :** Conception de formulaires mobiles et collecte de terrain XLSForm

Consultez le programme complet sur l'onglet **Formations** ou écrivez au **+225 07 01 97 00 65** (WhatsApp).`;
    }

    // 4. SPECIFIC QUESTIONS ON ADDRESS / LOCALISATION / CONTACT / HORAIRES
    if (q.includes('adresse') || q.includes('où êtes') || q.includes('ou etes') || q.includes('localisation') || q.includes('siège') || q.includes('siege') || q.includes('situe') || q.includes('situé') || q.includes('lieu') || q.includes('bureau') || q.includes('cocody') || q.includes('angre') || q.includes('angré')) {
      return `**POINTS ESSENTIELS [Onglet Contact & Qui sommes-nous] :**
• **Siège physique officiel :** Abidjan, Côte d'Ivoire, Commune de Cocody, Quartier Angré 8e Tranche
• **Téléphone & WhatsApp direct :** +225 07 01 97 00 65
• **Courriels officiels :** elearningciv@gmail.com | cabinetcicexf@gmail.com
• **Horaires d'accueil physique :**
  - Du Lundi au Vendredi : de 08h00 à 18h00 en continu
  - Samedi : de 09h00 à 13h00 (permanence des admissions et formations du weekend)

Consultez l'onglet **Contact** pour nous rendre visite ou échanger en direct.`;
    }

    // 5. SPECIFIC QUESTIONS ON MINISTERIAL AGREEMENT / STATUT
    if (q.includes('agrément') || q.includes('agrement') || q.includes('autorisation') || q.includes('licence') || q.includes('légal') || q.includes('statut juridique')) {
      return `**POINTS ESSENTIELS [Onglet Qui sommes-nous & Accueil] :**
• **Agrément officiel de l'État :** Société agréée sous le numéro **N°25343/GTCA/RC/2025** en République de Côte d'Ivoire.
• **Dénomination sociale :** Cabinet International de Consultance, d'Expertise et de Formation (CICEXF).
• **Direction Générale :** Dr. Kouassi Marc-Aurèle, Directeur Général & Associé Gérant.
• **Siège social :** Abidjan, Cocody Angré 8e Tranche.

Cette habilitation officielle atteste de la conformité réglementaire de nos interventions de consultance et de la validité de nos certifications professionnelles.`;
    }

    // 6. SPECIFIC QUESTIONS ON LEADERSHIP / DIRECTION / FOUNDERS
    if (q.includes('directeur') || q.includes('dirigeant') || q.includes('kouassi') || q.includes('marc-aurele') || q.includes('qui dirige') || q.includes('fondateur') || q.includes('amadou diallo') || q.includes('marc koffi') || q.includes('fatou sylla') || q.includes('sylvain gnahore') || q.includes('emilie bamba')) {
      return `**POINTS ESSENTIELS [Onglet Qui sommes-nous & Accueil] :**
• **Direction Générale :** **Dr. Kouassi Marc-Aurèle**, Directeur Général & Associé Gérant.
  - Devise : *"L'excellence technique n'a de valeur que si elle transforme durablement la trajectoire des hommes et des organisations."*
• **Membres clés de la Direction et Experts Référents :**
  - **M. Amadou Diallo :** Directeur Général & Co-fondateur (18+ ans en conseil stratégique et PPP)
  - **Dr. Marc Koffi :** Directeur Général Adjoint & Chef du Pôle Formation (Docteur en Sciences de l'Éducation, Ingénieur Informaticien)
  - **Mme Fatou Sylla :** Conseillère Spéciale & Experte Financière (diplômée de la London School of Economics)
  - **M. Sylvain Gnahoré :** Spécialiste Principal Aménagement du Territoire & SIG (30+ missions cartographiques)
  - **Mme Émilie Bamba :** Responsable du Pôle QHSE & RSE (auditeur certifié IRCA ISO 9001, 14001, 45001)

Consultez l'onglet **Qui sommes-nous** pour découvrir la gouvernance complète du cabinet.`;
    }

    // 7. SPECIFIC QUESTIONS ON KEY STATS / CHIFFRES CLÉS
    if (q.includes('chiffre') || q.includes('statistique') || q.includes('2000') || q.includes('150') || q.includes('taux de satisfaction') || q.includes('engagement')) {
      return `**POINTS ESSENTIELS [Onglet Accueil] :**
Les chiffres clés audités publiés sur notre site officiel sont :
• **+2000** Professionnels et cadres de haut niveau formés
• **+150** Missions d'envergure réalisées avec succès
• **+50** Partenaires institutionnels, ministères et bailleurs (Banque Mondiale, BAD, AFD, PNUD, CEDEAO)
• **95%** Taux de satisfaction globale des participants audités
• **Agrément d'État :** N°25343/GTCA/RC/2025
• **6 Engagements Qualité :** Expertise internationale, consultants certifiés, approche pratique, suivi personnalisé 3 mois, innovation numérique & IA, culture de l'excellence.

Consultez l'onglet **Accueil** pour en savoir plus.`;
    }

    // 8. SPECIFIC QUESTIONS ON 8 PÔLES / ACCOMPAGNEMENT
    if (q.includes('accompagnement') || q.includes('consultance') || q.includes('8 pôle') || q.includes('8 pole') || q.includes('domaine') || q.includes('métier') || q.includes('metier') || q.includes('service') || q.includes('sous-domaine')) {
      return `**POINTS ESSENTIELS [Onglet Accompagnement] :**
Le CICEXF intervient dans **8 grands pôles d'ingénierie et 34 sous-domaines** officiels :
1. **Ingénierie de formation & renforcement de capacités** (plans de formation, ingénierie APC, e-learning)
2. **Ingénierie financière & investissement** (montage financier PPP, valorisation DCF, conformité OHADA)
3. **Ingénierie informatique & réseaux** (cybersécurité, audits de SI, logiciels métiers, cloud)
4. **Ingénierie de développement territorial** (SIG, schémas directeurs, cadastre par drone, fiscalité locale)
5. **Ingénierie QHSE** (normes ISO 9001/14001/45001/22000, Document Unique, sécurité industrielle)
6. **Audit, consultance & stratégie des organisations** (diagnostics organisationnels, plans 3-5 ans)
7. **Études spécialisées & ingénierie de projets** (faisabilité, études d'impact EIES, gestion de projet GAR)
8. **Accompagnement technique & institutionnel** (assistance aux ministères et agences, manuels de procédures)

Consultez l'onglet **Accompagnement** pour explorer chaque domaine ou demandez une proposition technique au **+225 07 01 97 00 65** (WhatsApp).`;
    }

    // 9. SPECIFIC QUESTIONS ON RÉALISATIONS / PROJETS
    if (q.includes('réalisation') || q.includes('realisation') || q.includes('projet') || q.includes('mission') || q.includes('référence') || q.includes('reference') || q.includes('energie') || q.includes('énergie')) {
      return `**POINTS ESSENTIELS [Onglet Réalisations] :**
Le cabinet compte plus de **150 missions d'envergure**. Voici les 3 projets majeurs présentés sur le site :
1. **Ministère de l'Énergie & Banque Multilatérale :** Restructuration organisationnelle d'un pôle d'énergie régional (45% de goulots administratifs éliminés, feuille de route 5 ans, +10 000 ménages raccordés).
2. **Secrétariat Général à l'Aménagement du Territoire :** SIG cadastral et Plan d'Aménagement Urbain pour 3 métropoles secondaires (120 000 ha cartographiés par drone, 15 agents formés sur QGIS).
3. **Consortium International d'ONG :** Formation Data Analyst pour 150 responsables Suivi-Évaluation (100% de conversion des formulaires papier vers KoboCollect, +30% de gain de temps sur le reporting).

Consultez l'onglet **Réalisations** pour les études de cas détaillées.`;
    }

    // 10. SPECIFIC QUESTIONS ON ACTUALITÉS / BLOG
    if (q.includes('actualité') || q.includes('actualite') || q.includes('article') || q.includes('blog') || q.includes('kobo') || q.includes('kobocollect')) {
      return `**POINTS ESSENTIELS [Onglet Actualités] :**
Les articles techniques publiés par nos experts dans l'onglet Actualités sont :
1. **"Comment réussir sa transition digitale de la collecte de données papier vers KoboCollect ?"** par le Dr. Marc Koffi (5 étapes clés : dictionnaire de variables, contrôles de cohérence, skip logic, formation des enquêteurs et monitoring temps réel).
2. **"Les clés du succès pour implémenter un Système de Management de la Qualité ISO 9001 v2015"** par Mme Émilie Bamba (approche par les risques, simplification documentaire, engagement de la direction).
3. **"Pourquoi le SIG est-il l'outil incontournable du maire moderne ?"** par M. Sylvain Gnahoré (superposition spatiale, gestion des infrastructures, modélisation des inondations, fiscalité locale).

Consultez l'onglet **Actualités** pour lire l'intégralité des publications.`;
    }

    // 11. SPECIFIC QUESTIONS ON ADMINISTRATION
    if (q.includes('admin') || q.includes('administration') || q.includes('connexion') || q.includes('mot de passe')) {
      return `**POINTS ESSENTIELS [Onglet Administration] :**
• **Accès sécurisé :** Espace strictement réservé aux administrateurs autorisés (elearningciv@gmail.com et cabinetcicexf@gmail.com).
• **Mot de passe par défaut :** 123456.
• **Fonctionnalités :** Gestion du catalogue de formations, gestion des 8 pôles, publication d'articles sur le blog, suivi des réalisations et gestion centralisée des prospects.
• **Accès :** Lien discret disponible dans le pied de page du site.`;
    }

    // 12. GENERAL QUESTIONS ON ALL FORMATIONS
    if (q.includes('formation') || q.includes('cours') || q.includes('catalogue')) {
      return `**POINTS ESSENTIELS [Onglet Formations] :**
Le CICEXF propose 6 formations certifiantes d'excellence :
1. **Data Analyst :** 6 semaines (120 h), 450 000 FCFA, Hybride (Excel, SQL, Power BI, Python, KoboCollect).
2. **PMP® Gestion de Projets :** 60 heures, 500 000 FCFA, En ligne (Guide PMBOK 7, 35 PDU officiels PMI).
3. **Auditeur Interne QHSE ISO 9001/14001/45001 :** 40 heures (5 jours), 350 000 FCFA, Présentiel.
4. **Modélisation Financière sur Excel :** 48 heures (6 samedis), 400 000 FCFA, Hybride (3-Statement, DCF, WACC).
5. **SIG & QGIS Développement Local :** 36 heures (4 samedis), 300 000 FCFA, Présentiel.
6. **GESTION DES EQUIPES :** Modules intensifs en inter/intra-entreprise (Leadership & Cohésion).
• **Facilité :** Échelonnement possible en 2 ou 3 versements sans frais.

Consultez l'onglet **Formations** pour le détail de chaque cursus ou écrivez au **+225 07 01 97 00 65** (WhatsApp).`;
    }

    // 13. QUESTION ON HOW TO CONTACT / REGISTER
    if (q.includes('contact') || q.includes('inscri') || q.includes('whatsapp') || q.includes('telephone') || q.includes('téléphone') || q.includes('mail') || q.includes('email')) {
      return `**POINTS ESSENTIELS [Onglet Contact & Inscription] :**
• **Ligne directe Téléphone & WhatsApp :** +225 07 01 97 00 65 (Réponse immédiate)
• **Adresses électroniques :** elearningciv@gmail.com | cabinetcicexf@gmail.com
• **Siège physique :** Abidjan, Côte d'Ivoire, Commune de Cocody, Quartier Angré 8e Tranche
• **Démarches d'inscription :**
  1. Envoyez un message WhatsApp au **+225 07 01 97 00 65** ou remplissez le formulaire de l'onglet Contact.
  2. Recevez sous 24h la fiche d'inscription officielle et la facture proforma avec facilités de paiement échelonné (2 ou 3 versements).
  3. Démarrez votre session en présentiel ou en ligne.`;
    }

    // 14. FALLBACK: INFORMATION NOT IN TABS (STRICT GROUNDING REQUIREMENT)
    return `**INFORMATION NON MENTIONNÉE DANS NOS ONGLETS :**
Cette information ne figure pas dans les rubriques actuelles de notre site officiel. Notre conseiller intelligent fournit exclusivement les informations vérifiées et publiées sur les onglets du CICEXF (Accueil, Formations, Accompagnement, Qui sommes-nous, Réalisations, Actualités, Contact et Administration).

Pour toute question personnalisée, demande de devis sur-mesure ou orientation spécifique, nos conseillers sont à votre entière disposition :
• **WhatsApp direct :** +225 07 01 97 00 65
• **Courriels officiels :** elearningciv@gmail.com | cabinetcicexf@gmail.com
• **Siège :** Abidjan Cocody Angré 8e Tranche.`;
  }

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CICEXF Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
