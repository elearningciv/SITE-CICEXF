import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, X, Send, Bot, User, ArrowRight, MessageCircle, 
  CheckCircle2, BookOpen, RefreshCw
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isFallback?: boolean;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}

export default function AiAssistantModal({ isOpen, onClose, onNavigate }: AiAssistantModalProps) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `**Bienvenue sur le Conseiller Intelligent du CICEXF !**

Je maîtrise l'intégralité des informations publiées sur l'ensemble des rubriques et onglets du cabinet :
• **Onglet Formations :** Programmes détaillés (Data Analyst, PMP 35 PDU, Auditeur QHSE ISO, Finance & Modélisation Excel, SIG QGIS, Gestion des équipes), durées, modules et tarifs officiels en FCFA.
• **Onglet Accompagnement :** Les 8 grands pôles d'ingénierie et 34 sous-domaines de consultance de haut niveau.
• **Onglet Qui sommes-nous :** Agrément officiel N°25343/GTCA/RC/2025, Direction Générale (Dr. Kouassi Marc-Aurèle) et équipe de direction.
• **Onglet Réalisations :** Les grands chantiers (Secteur Énergie, Cadastre métropolitain, 150 cadres humanitaires formés) et chiffres d'impact.
• **Onglet Actualités :** Articles techniques de référence (KoboCollect, ISO 9001 v2015, SIG municipal) et calendrier des rentrées.
• **Onglet Contact & Inscription :** WhatsApp direct (+225 07 01 97 00 65), adresses à Cocody Angré 8e Tranche, horaires et paiements échelonnés.

Posez directement votre question ci-dessous pour obtenir immédiatement les **informations essentielles** et les réponses les plus précises.`,
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (qToSend?: string) => {
    const query = (qToSend || question).trim();
    if (!query || loading) return;

    const userMessage: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch('/api/ask-cicexf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const answerText = data.answer || getClientFallbackAnswer(query);

      const assistantMessage: Message = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: answerText,
        timestamp: new Date(),
        isFallback: data.source !== 'gemini_ai'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('API request error, switching to built-in knowledge base:', err);
      const fallbackText = getClientFallbackAnswer(query);
      const assistantMessage: Message = {
        id: 'bot_fallback_' + Date.now(),
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date(),
        isFallback: true
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const detectRelevantTab = (text: string): { tabKey: string; label: string } | null => {
    const t = text.toLowerCase();
    if (t.includes('formation') || t.includes('analyst') || t.includes('pmp') || t.includes('qgis') || t.includes('equipe') || t.includes('tarif') || t.includes('cours')) {
      return { tabKey: 'formations', label: "Consulter l'onglet Formations" };
    }
    if (t.includes('accompagnement') || t.includes('consultance') || t.includes('domaine') || t.includes('ingénierie') || t.includes('pole')) {
      return { tabKey: 'accompagnements', label: "Voir l'onglet Accompagnement" };
    }
    if (t.includes('qui sommes') || t.includes('agrément') || t.includes('kouassi') || t.includes('directeur') || t.includes('équipe')) {
      return { tabKey: 'about', label: "Ouvrir l'onglet Qui sommes-nous" };
    }
    if (t.includes('réalisation') || t.includes('projet') || t.includes('chantier') || t.includes('client')) {
      return { tabKey: 'realisations', label: "Découvrir l'onglet Réalisations" };
    }
    if (t.includes('actualité') || t.includes('article') || t.includes('blog') || t.includes('kobo')) {
      return { tabKey: 'news', label: "Lire l'onglet Actualités" };
    }
    if (t.includes('admin') || t.includes('administration') || t.includes('connexion')) {
      return { tabKey: 'admin', label: "Accéder à l'Espace Admin" };
    }
    if (t.includes('contact') || t.includes('whatsapp') || t.includes('adresse') || t.includes('horaire') || t.includes('inscri')) {
      return { tabKey: 'contact', label: "Aller à l'onglet Contact & Inscription" };
    }
    if (t.includes('accueil') || t.includes('chiffre') || t.includes('statistique') || t.includes('engagement')) {
      return { tabKey: 'home', label: "Voir l'onglet Accueil" };
    }
    return null;
  };

  const formatAnswerText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      const isPointsEssentielsHeader = trimmed.toUpperCase().includes('POINTS ESSENTIELS');
      const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');

      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isPointsEssentielsHeader) {
        return (
          <div key={idx} className="my-2.5 p-3 sm:p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border-l-4 border-amber-600 dark:border-amber-500 text-amber-950 dark:text-amber-200 font-black text-xs sm:text-sm md:text-[14px] flex items-center space-x-2.5 shadow-2xs">
            <span>{parts}</span>
          </div>
        );
      }

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start space-x-2.5 my-1.5 text-xs sm:text-sm md:text-[14px] leading-relaxed">
            <span className="text-brand-emerald dark:text-amber-400 font-bold shrink-0 mt-0.5">•</span>
            <span>{parts}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="my-1.5 text-xs sm:text-sm md:text-[14px] leading-relaxed">
          {parts}
        </p>
      );
    });
  };

  return (
    <div id="ai-assistant-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-200">
      <div 
        id="ai-assistant-card" 
        className="bg-white dark:bg-[#020d1c] w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl h-[94vh] sm:h-[90vh] md:h-[88vh] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col overflow-hidden"
      >
        {/* Header - Enriched & Spacious */}
        <div className="bg-brand-blue-dark px-5 sm:px-8 py-4 sm:py-5 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3.5 sm:space-x-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-inner shrink-0">
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display font-black text-base sm:text-lg md:text-xl tracking-wide text-white">
                  Conseiller Intelligent CICEXF
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-900 shadow-xs">
                  Expertise Tous Onglets
                </span>
                <span className="hidden md:inline-block text-[11px] text-brand-emerald-light font-mono font-bold">
                  Agrément N°25343/GTCA/RC/2025
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
                Réponses précises et synthétisées sur chaque information de tous les onglets du cabinet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-3"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Body - Enlarged & High Readability */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-5 text-slate-800 dark:text-slate-100">
          {messages.map((msg) => {
            const relevantTab = msg.sender === 'assistant' ? detectRelevantTab(msg.text) : null;

            return (
              <div 
                key={msg.id}
                className={`flex items-start space-x-3 sm:space-x-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-brand-emerald text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div 
                  className={`max-w-[92%] sm:max-w-[85%] rounded-3xl p-4 sm:p-6 shadow-xs text-xs sm:text-sm md:text-[14px] ${
                    msg.sender === 'user' 
                      ? 'bg-brand-blue-dark text-white rounded-tr-none ml-auto' 
                      : 'bg-slate-50 dark:bg-[#031429] border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                  }`}
                >
                  {formatAnswerText(msg.text)}

                  {/* Direct interactive actions for assistant responses */}
                  {msg.sender === 'assistant' && msg.id !== 'welcome-msg' && (
                    <div className="mt-4 pt-3.5 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-wrap gap-2.5 items-center">
                      <a
                        href="https://wa.me/2250701970065"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1eb857] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>WhatsApp Direct (+225 07 01 97 00 65)</span>
                      </a>

                      {relevantTab && onNavigate && (
                        <button
                          onClick={() => { onClose(); onNavigate(relevantTab.tabKey); }}
                          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:text-brand-blue dark:hover:text-amber-400 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 text-brand-emerald" />
                          <span>{relevantTab.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                        </button>
                      )}

                      {onNavigate && (
                        <button
                          onClick={() => { onClose(); onNavigate('contact'); }}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald hover:text-white font-bold text-xs transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Demander un devis officiel</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-brand-emerald text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                <Bot className="w-5 h-5 animate-bounce" />
              </div>
              <div className="bg-slate-50 dark:bg-[#031429] border border-slate-200 dark:border-slate-800 p-4 rounded-3xl rounded-tl-none flex items-center space-x-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-emerald" />
                <span className="font-semibold">Recherche précise des informations essentielles dans tous les onglets du cabinet...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Question Input Footer - Spacious and Ergonomic */}
        <div className="bg-white dark:bg-[#020c1a] border-t border-slate-200 dark:border-slate-800 p-4 sm:p-5 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center space-x-2.5 sm:space-x-3"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question sur chaque information du cabinet (ex: Tarifs Data Analyst, 8 Pôles de consultance, Agrément, Réalisations)..."
                disabled={loading}
                className="w-full pl-5 pr-12 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs sm:text-sm md:text-base text-slate-900 dark:text-white outline-none focus:border-brand-emerald focus:ring-2 focus:ring-brand-emerald/20 transition-all font-medium disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="h-11 sm:h-12 px-5 sm:px-7 rounded-2xl bg-brand-emerald hover:bg-brand-emerald-dark disabled:opacity-50 text-white font-bold text-xs sm:text-sm md:text-base shadow-md transition-all flex items-center space-x-2 cursor-pointer shrink-0 active:scale-95"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              <span className="hidden sm:inline">Poser</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 px-1.5">
            <span>Base de connaissances complète synchronisée avec tous les onglets du site officiel</span>
            <span className="font-semibold text-brand-emerald dark:text-amber-400">Secrétariat Admissions WhatsApp : +225 07 01 97 00 65</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getClientFallbackAnswer(query: string): string {
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
• **Accès sécurisé :** Espace strictement réservé aux administrateurs habilités du Cabinet, avec authentification personnelle.
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
