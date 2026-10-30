import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, X, Send, User, ArrowRight, MessageCircle, 
  CheckCircle2, RefreshCw, ThumbsUp, ThumbsDown, Download,
  Mic, MicOff, Volume2, VolumeX, Paperclip, FileText,
  Calendar, Award, Phone, Mail, HelpCircle, GraduationCap,
  Calculator, UserCheck, Shield, ChevronRight,
  Maximize2, Minimize2, Trash2, Play, Pause, Square
} from 'lucide-react';
import adilineAvatar from '../assets/images/adiline_avatar_1792359280949.webp';
import { CABINET_INFO, FORMATIONS, TEAM_MEMBERS } from '../knowledgeBase';
import { saveProspect } from '../lib/prospects';

// Service IA d'ADILINE (fonction Firebase `adilineChat`, Gemini + contenu du site)
const ADILINE_API_URL = import.meta.env.VITE_ADILINE_API_URL
  || 'https://europe-west1-project-a93f5a0f-743d-4552-852.cloudfunctions.net/adilineChat';

export interface RichCard {
  type: 'formation' | 'session' | 'expert' | 'devis';
  title: string;
  subtitle?: string;
  price?: string;
  duration?: string;
  modality?: string;
  date?: string;
  location?: string;
  contact?: string;
  formationId?: string;
  details?: Record<string, string | number>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  sources?: string[];
  cards?: RichCard[];
  attachmentName?: string;
  audioUrl?: string; // Voice note playback URL
  feedback?: 'like' | 'dislike';
}

interface AdilineChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string, itemId?: string) => void;
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Renders text with bold parsing (**mot**) and bullet points cleanly
function FormattedMessageText({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed text-[12.5px] sm:text-[13px]">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lIdx} className="h-1" />;

        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const content = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : trimmed;

        const renderSegments = (str: string) => {
          const parts = str.split(/(\*\*[^*]+\*\*)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
              return (
                <strong key={pIdx} className="font-semibold text-slate-900 dark:text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          });
        };

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start space-x-2 pl-0.5">
              <span className="text-brand-blue dark:text-cyan-400 mt-1 select-none text-xs shrink-0">•</span>
              <div className="flex-1 text-slate-700 dark:text-slate-200">
                {renderSegments(content)}
              </div>
            </div>
          );
        }

        if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <h5 key={lIdx} className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mt-2 mb-1">
              {renderSegments(headerText)}
            </h5>
          );
        }

        return (
          <p key={lIdx} className="text-slate-700 dark:text-slate-200">
            {renderSegments(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function AdilineChatbot({ isOpen, onClose, onNavigateTab }: AdilineChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Bonjour ! Je suis **ADILINE**, votre assistante virtuelle au sein du **CICEXF** (Cabinet International de Consultance, d'Expertise et de Formation).

Je suis à votre entière disposition pour vous renseigner avec précision sur :
• Nos formations certifiantes : Data Analyst, Auditeur QHSE ISO, Modélisation Financière Excel, SIG QGIS, PMP, Gestion des équipes
• Les tarifs officiels en FCFA, calendriers des sessions et facilités de paiement échelonné
• Le calcul instantané de vos devis avec remises de groupe (-10% dès 3 personnes, -15% dès 5 personnes)
• Nos 8 grands pôles d'ingénierie et d'accompagnement

Comment puis-je vous accompagner aujourd'hui ?`,
      timestamp: new Date(),
      sources: ["Site officiel CICEXF", "Catalogue des formations 2026"]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeSpeechMsgId, setActiveSpeechMsgId] = useState<string | null>(null);
  
  // Screen adaptation state: 'adapted' (dynamically centered to user's screen), 'fullscreen' (100% viewport), 'compact' (docked widget)
  const [screenLayout, setScreenLayout] = useState<'adapted' | 'fullscreen' | 'compact'>('adapted');

  // Voice note recording states
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [liveTranscription, setLiveTranscription] = useState<string>('');
  const [showVoiceHelper, setShowVoiceHelper] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const speechRecognitionInstanceRef = useRef<any>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  
  // Multimodal file attachment
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    mimeType: string;
    data: string; // Base64
  } | null>(null);

  // Conseiller de parcours modal / step
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [advisorStep, setAdvisorStep] = useState(1);
  const [advisorProfile, setAdvisorProfile] = useState('');
  const [advisorGoal, setAdvisorGoal] = useState('');

  // Lead capture modal / inline state
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadFormation, setLeadFormation] = useState('Data Analyst');
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadParticipants, setLeadParticipants] = useState('1');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle direct audio file upload (voice memo from phone or computer)
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setVoiceError("Le fichier audio est trop volumineux (max 15 Mo).");
      setTimeout(() => setVoiceError(null), 5000);
      return;
    }

    const audioUrl = URL.createObjectURL(file);
    const mimeType = file.type || 'audio/webm';
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      handleSendVoiceNote({
        audioUrl,
        base64Data,
        mimeType,
        transcript: '',
        duration: file.name
      });
      setShowVoiceHelper(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Cleanup audio tracks and timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (speechRecognitionInstanceRef.current) {
        try { speechRecognitionInstanceRef.current.stop(); } catch {}
      }
    };
  }, []);

  // START RECORDING VOICE NOTE (MediaRecorder with speech recognition and resilient fallback)
  const startRecordingVoice = async () => {
    setVoiceError(null);
    setLiveTranscription('');
    audioChunksRef.current = [];

    let hasAudioStream = false;

    // 1. Try to access microphone stream
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        hasAudioStream = true;

        let mimeType = 'audio/webm';
        if (typeof MediaRecorder !== 'undefined') {
          if (!MediaRecorder.isTypeSupported('audio/webm')) {
            if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
            else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
            else mimeType = '';
          }

          const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          recorder.start(250);
        }
      }
    } catch (err: any) {
      console.warn("Microphone access restricted or blocked:", err);
    }

    // 2. Start Web Speech recognition in parallel (or as standalone fallback if getUserMedia was blocked)
    let hasSpeechRecognition = false;
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setLiveTranscription(currentTranscript);
            setInputText(currentTranscript);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition warning:", e.error);
        };

        speechRecognitionInstanceRef.current = recognition;
        recognition.start();
        hasSpeechRecognition = true;
      }
    } catch (speechErr) {
      console.warn("Speech recognition start warning:", speechErr);
    }

    // 3. If neither microphone nor speech recognition is permitted by the browser/iframe, open the Voice Helper modal
    if (!hasAudioStream && !hasSpeechRecognition) {
      setShowVoiceHelper(true);
      return;
    }

    // 4. Timer & UI state
    setIsRecordingVoice(true);
    setRecordingSeconds(0);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  // STOP RECORDING AND SEND
  const stopRecordingVoice = async (sendImmediately: boolean = true) => {
    if (!isRecordingVoice) return;

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (speechRecognitionInstanceRef.current) {
      try {
        speechRecognitionInstanceRef.current.stop();
      } catch {}
      speechRecognitionInstanceRef.current = null;
    }

    setIsRecordingVoice(false);

    const recorder = mediaRecorderRef.current;
    const finalSeconds = recordingSeconds;
    const capturedTranscript = liveTranscription || inputText;

    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = (reader.result as string).split(',')[1];
          const durationStr = formatDuration(finalSeconds);

          if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(t => t.stop());
            audioStreamRef.current = null;
          }

          if (sendImmediately) {
            handleSendVoiceNote({
              audioUrl,
              base64Data,
              mimeType,
              transcript: capturedTranscript,
              duration: durationStr
            });
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      try {
        recorder.stop();
      } catch (err) {
        console.warn("Recorder stop error:", err);
      }
    } else {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(t => t.stop());
        audioStreamRef.current = null;
      }
      if (sendImmediately && capturedTranscript) {
        handleSendMessage(capturedTranscript);
      }
    }
  };

  // CANCEL RECORDING
  const cancelRecordingVoice = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (speechRecognitionInstanceRef.current) {
      try { speechRecognitionInstanceRef.current.stop(); } catch {}
      speechRecognitionInstanceRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(t => t.stop());
      audioStreamRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecordingVoice(false);
    setRecordingSeconds(0);
    setLiveTranscription('');
  };

  // Text-to-Speech playback
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (activeSpeechMsgId === msgId) {
      window.speechSynthesis.cancel();
      setActiveSpeechMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '').replace(/https?:\/\/\S+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.05;

    utterance.onend = () => setActiveSpeechMsgId(null);
    utterance.onerror = () => setActiveSpeechMsgId(null);

    setActiveSpeechMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // File upload handler (PDF or image)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Le fichier est trop volumineux. La taille maximale est de 8 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      setAttachedFile({
        name: file.name,
        mimeType: file.type || 'application/pdf',
        data: base64Data
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Process SSE or JSON stream response from ADILINE server
  const processServerStream = async (response: Response, assistantMsgId: string, query: string) => {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/event-stream')) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let sourcesFound: string[] = [];
      let cardsFound: RichCard[] = [];

      if (reader) {
        // A network chunk can end in the middle of an event: keep the partial line for the next read
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              let data: any;
              try {
                data = JSON.parse(line.slice(6));
              } catch {
                continue; // non-json line
              }
              if (data.type === 'error') {
                throw new Error('ADILINE service unavailable');
              }
              {
                if (data.type === 'chunk' && data.text) {
                  accumulatedText += data.text;
                  setMessages(prev => prev.map(m => 
                    m.id === assistantMsgId ? { ...m, text: accumulatedText } : m
                  ));
                } else if (data.type === 'cards' && data.cards) {
                  cardsFound = data.cards;
                } else if (data.type === 'sources' && data.sources) {
                  sourcesFound = data.sources;
                } else if (data.type === 'done') {
                  if (data.sources) sourcesFound = data.sources;
                  if (data.cards) cardsFound = data.cards;
                }
              }
            }
          }
        }
      }

      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { 
          ...m, 
          text: accumulatedText || "Je suis à votre écoute pour toute information complémentaire.",
          sources: sourcesFound.length > 0 ? sourcesFound : ["Site officiel CICEXF", "Catalogue 2026"],
          cards: cardsFound
        } : m
      ));
    } else {
      // Fallback standard JSON
      const data = await response.json();
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { 
          ...m, 
          text: data.text || data.answer || "Réponse officielle du cabinet.",
          sources: data.sources || ["Catalogue officiel CICEXF"],
          cards: data.cards || []
        } : m
      ));
    }
  };

  // Send voice note with audio attachment and live transcript
  const handleSendVoiceNote = async ({
    audioUrl,
    base64Data,
    mimeType,
    transcript,
    duration
  }: {
    audioUrl: string;
    base64Data: string;
    mimeType: string;
    transcript: string;
    duration: string;
  }) => {
    const userMessageId = 'u_' + Date.now();
    const query = transcript.trim();
    const displayText = query ? query : `Note vocale enregistrée (${duration})`;

    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: displayText,
      audioUrl: audioUrl,
      attachmentName: `Note vocale (${duration})`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLiveTranscription('');
    setIsStreaming(true);

    const assistantMsgId = 'a_' + Date.now();
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      text: '',
      timestamp: new Date(),
      sources: []
    };

    setMessages(prev => [...prev, initialAssistantMsg]);

    try {
      const recentHistory = messages.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const response = await fetch(ADILINE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query || "Voici ma note vocale avec ma question. Merci d'y répondre avec précision selon les données officielles du cabinet.",
          history: recentHistory,
          attachment: {
            mimeType: mimeType || 'audio/webm',
            data: base64Data,
            name: `note_vocale_${Date.now()}.webm`
          }
        })
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      await processServerStream(response, assistantMsgId, query || "note vocale");
    } catch (err) {
      console.warn("Voice note stream error:", err);
      const fallbackText = getLocalAdilineFallback(query || "formation");
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { 
          ...m, 
          text: fallbackText,
          sources: ["Base de connaissances officielle intégrée", "Secrétariat CICEXF"]
        } : m
      ));
    } finally {
      setIsStreaming(false);
    }
  };

  // Send message to ADILINE API with streaming
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if ((!query && !attachedFile) || isStreaming) return;

    const userMessageId = 'u_' + Date.now();
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: query || `Analyse du document joint : ${attachedFile?.name}`,
      timestamp: new Date(),
      attachmentName: attachedFile?.name
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    const currentAttachment = attachedFile;
    setAttachedFile(null);
    setIsStreaming(true);

    const assistantMsgId = 'a_' + Date.now();
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      text: '',
      timestamp: new Date(),
      sources: []
    };

    setMessages(prev => [...prev, initialAssistantMsg]);

    try {
      const recentHistory = messages.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const response = await fetch(ADILINE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: recentHistory,
          attachment: currentAttachment ? {
            mimeType: currentAttachment.mimeType,
            data: currentAttachment.data,
            name: currentAttachment.name
          } : undefined
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      await processServerStream(response, assistantMsgId, query);
    } catch (err) {
      console.warn("Adiline API call note:", err);
      const fallbackText = getLocalAdilineFallback(query);
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { 
          ...m, 
          text: fallbackText,
          sources: ["Base de connaissances officielle intégrée", "Secrétariat CICEXF"]
        } : m
      ));
    } finally {
      setIsStreaming(false);
    }
  };

  // Local fallback response if connection or quota fails
  const getLocalAdilineFallback = (q: string): string => {
    const l = q.toLowerCase();

    // Présentation officielle, nom et raison d'être de l'assistante d'accueil
    if (
      l.includes('qui es') || 
      l.includes('qui etes') || 
      l.includes('qui êtes') || 
      l.includes('nom') || 
      l.includes('t\'appelles') || 
      l.includes('te nommes') || 
      l.includes('présente') || 
      l.includes('presente') || 
      l.includes('présentez') || 
      l.includes('presentez') || 
      l.includes('présentation') || 
      l.includes('presentation') || 
      l.includes('se présenter') || 
      l.includes('se presenter') || 
      l.includes('te présenter') || 
      l.includes('te presenter') || 
      l.includes('vous présenter') || 
      l.includes('vous presenter') || 
      l.includes('raison d\'être') || 
      l.includes('raison d\'etre') || 
      l.includes('rôle') || 
      l.includes('role') || 
      l.includes('mission') || 
      l.includes('sers-tu') || 
      l.includes('sers tu') || 
      l.includes('assistant d\'accueil') || 
      l.includes('assistante d\'accueil') || 
      l.includes('accueil') && (l.includes('assistant') || l.includes('assistante') || l.includes('guide')) || 
      l.includes('pourquoi tu existes') || 
      l.includes('pourquoi existes-tu') || 
      (l.includes('adiline') && (l.includes('qui') || l.includes('que') || l.includes('quoi') || l.includes('bonjour') || l.includes('salut') || l.length < 25))
    ) {
      return `Bonjour et bienvenue au cabinet **CICEXF** (Cabinet International de Consultance, d'Expertise et de Formation) !

Je m'appelle **ADILINE**, je suis l'assistante d'accueil officielle et conseillère d'orientation virtuelle du cabinet.

### 🌟 Ma raison d'être et mon rôle auprès de vous :
• **Accueil et orientation sur-mesure** : Vous guider vers la formation certifiante la plus adaptée à vos aspirations professionnelles (**Data Analyst**, **Auditeur Interne QHSE ISO**, **Modélisation Financière Excel**, **SIG QGIS**, **Management de Projets PMP**, **Gestion des équipes**).
• **Transparence tarifaire et facilités** : Vous fournir en toute clarté nos tarifs officiels en FCFA, les calendriers de rentrée et nos modalités de paiement échelonné en 2 ou 3 versements sans frais additionnels.
• **Devis proforma instantanés** : Établir immédiatement vos devis personnalisés avec remises de groupe automatiques (-10% dès 3 participants, -15% dès 5 participants).
• **Liaison directe avec nos experts** : Vous mettre en relation directe avec les consultants formateurs et la Direction Générale du Dr. Kouassi Marc-Aurèle via notre ligne officielle WhatsApp (**+225 07 01 97 00 65**).

Comment puis-je vous accompagner dans votre projet aujourd'hui ?`;
    }

    if (l.includes('prix') || l.includes('tarif') || l.includes('cout') || l.includes('coût')) {
      return `Tarifs officiels des formations certifiantes du cabinet CICEXF :
• Data Analyst : **450 000 FCFA** (6 semaines / 120 h, format hybride)
• Gestion de Projets PMP : **500 000 FCFA** (60 h en ligne, attestation 35 PDU PMI)
• Auditeur Interne QHSE ISO : **350 000 FCFA** (40 h / 5 jours, présentiel)
• Modélisation Financière Excel : **400 000 FCFA** (48 h / 6 samedis, hybride)
• SIG & QGIS Cartographie : **300 000 FCFA** (36 h / 4 samedis, présentiel)
• Gestion des Équipes : programmes sur mesure sur convention

Facilités de paiement : échelonnement en 2 ou 3 versements sans frais additionnels pour les particuliers.
Remises de groupe : -10% dès 3 inscrits, -15% dès 5 inscrits.`;
    }
    if (l.includes('contact') || l.includes('whatsapp') || l.includes('adresse') || l.includes('telephone') || l.includes('téléphone')) {
      return `Coordonnées officielles du Cabinet CICEXF :
• Ligne directe WhatsApp : **+225 07 01 97 00 65** (Admissions & Direction)
• Secrétariat technique : +225 05 74 22 22 46
• E-mails officiels : elearningciv@gmail.com | cabinetcicexf@gmail.com
• Siège : Abidjan Cocody Angré 8e Tranche, Carrefour Duncan, Immeuble Prestige
• Horaires : du Lundi au Vendredi de 08h à 18h en continu, Samedi de 09h à 13h.`;
    }
    return `Bonjour, je suis ADILINE, votre assistante virtuelle au cabinet CICEXF. Pour vous répondre au mieux, pouvez-vous me préciser si votre demande concerne l'une de nos formations certifiantes (Data Analyst, PMP, QHSE, Finance, SIG, Gestion d'équipe) ou l'un de nos 8 pôles d'ingénierie et d'accompagnement ? Vous pouvez également contacter nos conseillers directement sur WhatsApp au **+225 07 01 97 00 65**.`;
  };



  // Feedback thumb up / thumb down
  const handleFeedback = (msgId: string, feedback: 'like' | 'dislike') => {
    setMessages(prev => prev.map(m => 
      m.id === msgId ? { ...m, feedback } : m
    ));
  };

  // Export conversation to text file
  const handleExportConversation = () => {
    const textContent = messages.map(m => {
      const time = m.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const sender = m.role === 'user' ? 'VOUS' : 'ADILINE (CICEXF)';
      return `[${time}] ${sender} :\n${m.text}\n${m.sources ? `(Sources : ${m.sources.join(', ')})` : ''}\n----------------------------------------\n`;
    }).join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `entretien_adiline_cicexf_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Open WhatsApp with conversation summary
  const handleTalkToAdvisorWhatsApp = () => {
    const lastExchange = messages.slice(-3).map(m => `${m.role === 'user' ? 'Client' : 'ADILINE'}: ${m.text.slice(0, 120)}...`).join('\n');
    const text = encodeURIComponent(`Bonjour CICEXF, j'ai échangé avec votre assistante virtuelle ADILINE sur le site et souhaite poursuivre avec un conseiller humain.\n\nRésumé :\n${lastExchange}`);
    window.open(`https://wa.me/2250701970065?text=${text}`, '_blank');
  };

  // Submit Lead Capture
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !leadEmail) return;

    const newLead = {
      name: leadName,
      company: leadCompany || 'Particulier',
      email: leadEmail,
      phone: leadPhone,
      formation: leadFormation,
      participants: parseInt(leadParticipants, 10) || 1,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('adiline_leads') || '[]');
      existing.push(newLead);
      localStorage.setItem('adiline_leads', JSON.stringify(existing));
    } catch (e) {
      console.warn("Local storage save lead:", e);
    }

    // Save to prospect tracker
    saveProspect({
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      type: (parseInt(leadParticipants, 10) > 1 ? 'Demande Entreprise' : 'Inscription Individuelle'),
      target: `${leadFormation} (${leadParticipants} pers.) - ${leadCompany || 'Particulier'}`,
      notes: `Capture automatisée par l'assistante virtuelle ADILINE`,
      channel: 'En ligne'
    });

    setLeadSubmitted(true);
    setTimeout(() => {
      setShowLeadModal(false);
      setLeadSubmitted(false);
      // Add confirmation in chat
      setMessages(prev => [...prev, {
        id: 'lead_confirm_' + Date.now(),
        role: 'assistant',
        text: `Merci beaucoup **${leadName}** ! Votre demande d'inscription pour la formation **${leadFormation}** (${leadParticipants} participant(s)) a bien été transmise à notre secrétariat d'admission.

Vous recevrez votre devis proforma et la fiche d'inscription officielle par courriel à **${leadEmail}** et un message de confirmation au **${leadPhone}** sous 24h ouvrées.`,
        timestamp: new Date(),
        sources: ["Service des Admissions CICEXF"]
      }]);
    }, 1800);
  };

  // Guided course advisor submit
  const handleLaunchAdvisor = (profile: string, goal: string) => {
    setShowAdvisorModal(false);
    const advisorPrompt = `Je suis actuellement : ${profile}. Mon objectif professionnel prioritaire est : ${goal}. En tant qu'ADILINE, quel parcours de formations et quel plan de montée en compétences me conseillez-vous au CICEXF avec le budget total estimé ?`;
    handleSendMessage(advisorPrompt);
  };

  if (!isOpen) return null;

  return (
    <div 
      id="adiline-chat-modal" 
      className={`fixed inset-0 z-50 flex font-sans transition-all duration-300 ${
        screenLayout === 'fullscreen'
          ? 'items-center justify-center p-0 bg-slate-950/80 backdrop-blur-md'
          : screenLayout === 'adapted'
          ? 'items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/65 backdrop-blur-sm'
          : 'items-end justify-end sm:p-4 md:p-6 bg-slate-950/40 backdrop-blur-xs'
      }`}
    >
      
      {/* Main Chat Window Card - Adapts dynamically to screen size */}
      <div 
        className={`w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all duration-300 ${
          screenLayout === 'fullscreen'
            ? 'h-[100dvh] w-full rounded-none'
            : screenLayout === 'adapted'
            ? 'h-[100dvh] sm:h-[min(850px,calc(100dvh-2.5rem))] sm:w-[min(980px,calc(100vw-2rem))] sm:rounded-3xl'
            : 'h-[100dvh] sm:h-[min(680px,calc(100dvh-2.5rem))] sm:w-[480px] sm:rounded-3xl'
        }`}
      >
        
        {/* HEADER BAR */}
        <div className="bg-brand-blue p-3.5 sm:p-4 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={adilineAvatar} 
                alt="Avatar ADILINE" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white/90 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-brand-blue rounded-full"></span>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-display font-extrabold text-sm sm:text-base tracking-wide text-white">
                  ADILINE
                </h3>
                <span className="text-xs bg-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  IA Certifiée
                </span>
              </div>
              <p className="text-[11px] text-blue-100/90 font-medium">
                Assistante virtuelle · CICEXF
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {/* Screen adaptation button (Adapter à mon écran / Plein écran / Réduire) */}
            <button
              onClick={() => {
                setScreenLayout(prev => {
                  if (prev === 'compact') return 'adapted';
                  if (prev === 'adapted') return 'fullscreen';
                  return 'compact';
                });
              }}
              className="px-2.5 py-1.5 text-white/90 hover:text-white hover:bg-white/15 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-medium border border-white/10"
              title={`Mode d'affichage : ${
                screenLayout === 'compact' ? 'Compact' : screenLayout === 'adapted' ? 'Adapté à votre écran' : 'Plein écran'
              }. Cliquez pour basculer.`}
              aria-label="Adapter à l'écran"
            >
              {screenLayout === 'fullscreen' ? (
                <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
              ) : screenLayout === 'adapted' ? (
                <Maximize2 className="w-3.5 h-3.5 text-cyan-300" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-white" />
              )}
              <span className="hidden sm:inline text-[11px]">
                {screenLayout === 'compact' ? 'Adapter' : screenLayout === 'adapted' ? 'Plein écran' : 'Réduire'}
              </span>
            </button>

            <button
              onClick={handleExportConversation}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Exporter la conversation en texte"
              aria-label="Exporter la conversation"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (window.confirm("Voulez-vous réinitialiser la conversation avec ADILINE ?")) {
                  setMessages([messages[0]]);
                }
              }}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Nouvelle conversation"
              aria-label="Nouvelle conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Fermer le chat"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* QUICK ACTION BANNER : Conseiller de parcours & Parler à un conseiller */}
        <div className="bg-slate-100 dark:bg-slate-850 px-3 py-2 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-semibold gap-2">
          <button
            onClick={() => setShowAdvisorModal(true)}
            className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 text-brand-blue dark:text-blue-300 border border-slate-200 dark:border-slate-700 shadow-2xs hover:bg-blue-50 dark:hover:bg-slate-750 transition-all cursor-pointer text-[11px]"
          >
            <span>Conseiller de parcours</span>
          </button>
          
          <button
            onClick={() => setShowLeadModal(true)}
            className="flex items-center justify-center space-x-1 py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 shadow-2xs hover:bg-emerald-50 dark:hover:bg-slate-750 transition-all cursor-pointer text-[11px]"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Demander un devis</span>
          </button>

          <button
            onClick={handleTalkToAdvisorWhatsApp}
            className="flex items-center justify-center space-x-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all cursor-pointer text-[11px] font-bold"
            title="Poursuivre sur WhatsApp avec le résumé"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">WhatsApp</span>
          </button>
        </div>

        {/* MESSAGES LIST AREA */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-slate-50/70 dark:bg-slate-950/40">
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-end space-x-2 max-w-[92%] sm:max-w-[85%]">
                {msg.role === 'assistant' && (
                  <img 
                    src={adilineAvatar} 
                    alt="ADILINE" 
                    className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 border border-brand-blue/30 shadow-xs"
                  />
                )}

                <div 
                  className={`p-3.5 rounded-2xl text-[12.5px] sm:text-[13px] leading-relaxed shadow-sm font-sans ${
                    msg.role === 'user'
                      ? 'bg-blue-50 text-slate-900 border border-blue-200 dark:bg-slate-800 dark:text-white dark:border-slate-700 rounded-br-none'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {/* File badge if message contained non-audio attachment */}
                  {msg.attachmentName && !msg.audioUrl && (
                    <div className="mb-2 p-2 rounded-lg bg-white/70 dark:bg-white/10 flex items-center space-x-2 text-xs font-semibold">
                      <FileText className="w-4 h-4" />
                      <span className="truncate">{msg.attachmentName}</span>
                    </div>
                  )}

                  {/* Audio player if voice note was recorded */}
                  {msg.audioUrl && (
                    <div className="mb-2.5 p-2 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                        <div className="flex items-center space-x-1.5">
                          <Mic className="w-3.5 h-3.5 text-rose-300" />
                          <span>{msg.attachmentName || 'Note vocale'}</span>
                        </div>
                        <span className="text-xs opacity-80">Audio</span>
                      </div>
                      <audio controls src={msg.audioUrl} className="w-full h-8 rounded-lg" preload="metadata" />
                    </div>
                  )}

                  {/* Render text with clean paragraphs, parsed bolding and bullet styling */}
                  <FormattedMessageText text={msg.text} />

                  {/* RICH CARDS (Formations, Sessions, Experts, Devis) */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                      {msg.cards.map((card, cIdx) => (
                        <div 
                          key={cIdx}
                          className="bg-slate-50 dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
                                {card.type === 'formation' ? 'Formation Certifiante' : card.type === 'session' ? 'Session au calendrier' : card.type === 'devis' ? 'Devis Proforma' : 'Expert Consultance'}
                              </span>
                              <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                                {card.title}
                              </h4>
                              {card.subtitle && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">{card.subtitle}</p>
                              )}
                            </div>
                            {card.price && (
                              <span className="font-black text-brand-blue dark:text-cyan-400 shrink-0 text-xs">
                                {card.price}
                              </span>
                            )}
                          </div>

                          {/* Extra details chips */}
                          <div className="flex flex-wrap gap-1.5 text-xs">
                            {card.duration && (
                              <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                ⏱ {card.duration}
                              </span>
                            )}
                            {card.modality && (
                              <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                📍 {card.modality}
                              </span>
                            )}
                            {card.date && (
                              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-semibold">
                                📅 {card.date}
                              </span>
                            )}
                          </div>

                          {/* Action buttons inside card */}
                          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                            {card.type === 'formation' && (
                              <>
                                <button
                                  onClick={() => {
                                    if (onNavigateTab) {
                                      onNavigateTab('formations', card.formationId);
                                      onClose();
                                    }
                                  }}
                                  className="flex-1 py-1 px-2 rounded-lg bg-brand-blue text-white font-bold text-xs hover:bg-brand-blue-dark transition-colors text-center"
                                >
                                  Voir la fiche
                                </button>
                                <button
                                  onClick={() => {
                                    setLeadFormation(card.title);
                                    setShowLeadModal(true);
                                  }}
                                  className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors text-center"
                                >
                                  S'inscrire
                                </button>
                              </>
                            )}

                            {card.type === 'expert' && (
                              <a
                                href={`mailto:${card.contact || 'elearningciv@gmail.com'}?subject=Demande de consultance via ADILINE`}
                                className="flex-1 py-1 px-2 rounded-lg bg-brand-blue text-white font-bold text-xs text-center"
                              >
                                Contacter l'expert
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CITATION DES SOURCES */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-500 flex items-center space-x-1">
                      <Shield className="w-3 h-3 text-brand-emerald shrink-0" />
                      <span className="truncate">
                        Sources : {msg.sources.join(' · ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Footer: Voice Read Aloud, Thumb feedback & Time */}
              {msg.role === 'assistant' && msg.id !== 'welcome' && (
                <div className="flex items-center space-x-2 pl-9 text-[11px] text-slate-400">
                  <span className="text-xs">
                    {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {/* Voice playback button */}
                  <button
                    onClick={() => handleToggleSpeak(msg.id, msg.text)}
                    className="p-1 hover:text-brand-blue dark:hover:text-blue-300 transition-colors"
                    title={activeSpeechMsgId === msg.id ? "Arrêter la lecture" : "Écouter la réponse"}
                  >
                    {activeSpeechMsgId === msg.id ? (
                      <VolumeX className="w-3.5 h-3.5 text-brand-emerald animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Thumbs up / down feedback */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleFeedback(msg.id, 'like')}
                      className={`p-1 hover:text-emerald-600 transition-colors ${msg.feedback === 'like' ? 'text-emerald-600 font-bold' : ''}`}
                      title="Réponse utile"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, 'dislike')}
                      className={`p-1 hover:text-rose-600 transition-colors ${msg.feedback === 'dislike' ? 'text-rose-600 font-bold' : ''}`}
                      title="Réponse imprécise"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                    {msg.feedback && (
                      <span className="text-[11px] text-slate-400">Merci !</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* STREAMING TYPING INDICATOR */}
          {isStreaming && (
            <div className="flex items-end space-x-2 pl-1">
              <img 
                src={adilineAvatar} 
                alt="ADILINE" 
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-brand-blue/30"
              />
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="w-2 h-2 rounded-full bg-brand-blue animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-brand-emerald animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 ml-1">
                  ADILINE écrit…
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ATTACHMENT PREVIEW PILL */}
        {attachedFile && (
          <div className="px-4 py-2 bg-blue-50 dark:bg-slate-850 border-t border-blue-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 truncate">
              <Paperclip className="w-3.5 h-3.5 text-brand-blue shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                Fichier prêt à être analysé : {attachedFile.name}
              </span>
            </div>
            <button
              onClick={() => setAttachedFile(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* VOICE ERROR BANNER */}
        {voiceError && (
          <div className="mx-3 mb-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-2">
              <MicOff className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{voiceError}</span>
            </div>
            <button onClick={() => setVoiceError(null)} className="text-amber-600 hover:text-amber-900 p-1 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* VOICE HELPER MODAL IF PERMISSION IS BLOCKED OR ON MOBILE */}
        {showVoiceHelper && (
          <div className="mx-3 mb-2 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-xs shadow-md space-y-2 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 font-bold">
                <Mic className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Enregistrement de note vocale</span>
              </div>
              <button 
                onClick={() => setShowVoiceHelper(false)} 
                className="text-amber-700 hover:text-amber-900 dark:text-amber-300 p-0.5 cursor-pointer"
                title="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-amber-800 dark:text-amber-300/90 text-[11px] leading-relaxed">
              L'autorisation directe du microphone est restreinte par le navigateur ou la fenêtre. Vous pouvez autoriser le micro, ou importer directement un enregistrement vocal (fichier audio .m4a, .mp3, .ogg de votre téléphone ou ordinateur).
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowVoiceHelper(false);
                  startRecordingVoice();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Réessayer d'autoriser le micro</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  audioFileInputRef.current?.click();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Joindre un mémo vocal audio</span>
              </button>
            </div>
          </div>
        )}

        {/* INPUT BAR */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          
          {/* Hidden Audio file input for voice note attachment */}
          <input 
            type="file" 
            ref={audioFileInputRef} 
            onChange={handleAudioFileUpload} 
            accept="audio/*" 
            className="hidden" 
          />

          {isRecordingVoice ? (
            /* ACTIVE VOICE NOTE RECORDING CONSOLE */
            <div className="flex items-center space-x-2 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 p-2.5 rounded-2xl animate-in fade-in duration-200">
              <div className="flex items-center space-x-2.5 flex-1 px-1.5 min-w-0">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                </span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono shrink-0">
                  {formatDuration(recordingSeconds)}
                </span>
                
                {/* Dynamic animated audio equalizer wave bars */}
                <div className="flex items-center space-x-0.5 h-4 px-1 shrink-0">
                  <span className="w-0.5 bg-rose-500 rounded-full animate-pulse h-2.5"></span>
                  <span className="w-0.5 bg-rose-500 rounded-full animate-bounce h-3.5" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-0.5 bg-rose-500 rounded-full animate-pulse h-2" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-0.5 bg-rose-500 rounded-full animate-bounce h-4" style={{ animationDelay: '0.3s' }}></span>
                  <span className="w-0.5 bg-rose-500 rounded-full animate-pulse h-2.5" style={{ animationDelay: '0.15s' }}></span>
                </div>

                <div className="flex-1 truncate text-xs text-slate-700 dark:text-slate-200 font-medium">
                  {liveTranscription ? (
                    <span className="italic">« {liveTranscription} »</span>
                  ) : (
                    <span className="text-rose-600/90 dark:text-rose-300">Parlez maintenant, enregistrement en cours...</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={cancelRecordingVoice}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl transition-colors cursor-pointer"
                title="Annuler la note vocale"
                aria-label="Annuler la note vocale"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => stopRecordingVoice(true)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                title="Terminer et envoyer la note vocale à ADILINE"
                aria-label="Envoyer la note vocale"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer</span>
              </button>
            </div>
          ) : (
            /* STANDARD TEXT & ATTACHMENT FORM */
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-1.5"
            >
              {/* Attachment input hidden */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="application/pdf,image/*" 
                className="hidden" 
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-slate-500 hover:text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Joindre un PDF ou une image (fiche de poste, CV...)"
                aria-label="Joindre un fichier"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice Note Button */}
              <button
                type="button"
                onClick={startRecordingVoice}
                className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer group relative"
                title="Enregistrer une note vocale (micro)"
                aria-label="Note vocale"
              >
                <Mic className="w-4 h-4 text-slate-500 group-hover:text-rose-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Posez une question ou cliquez sur le micro..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-transparent focus:border-brand-blue focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-400"
                disabled={isStreaming}
              />

              <button
                type="submit"
                disabled={(!inputText.trim() && !attachedFile) || isStreaming}
                className="p-2.5 bg-brand-blue text-white rounded-xl hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                aria-label="Envoyer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-1">
            <span>Données officielles CICEXF</span>
          </div>
        </div>

      </div>

      {/* MODAL 1 : CONSEILLER DE PARCOURS */}
      {showAdvisorModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-brand-blue dark:text-cyan-400 font-bold text-sm">
                <span>Conseiller de Parcours Personnalisé</span>
              </div>
              <button onClick={() => setShowAdvisorModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Répondez à deux questions rapides afin qu'ADILINE assemble un parcours certifiant adapté à votre carrière avec le budget optimisé :
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-800 dark:text-slate-200">
                  1. Votre poste ou niveau actuel :
                </label>
                <input
                  type="text"
                  placeholder="Ex : Chargé de suivi-évaluation, DAF, Chef de projet..."
                  value={advisorProfile}
                  onChange={(e) => setAdvisorProfile(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-800 dark:text-slate-200">
                  2. Votre objectif professionnel prioritaire :
                </label>
                <input
                  type="text"
                  placeholder="Ex : Maîtriser Power BI & SQL, Réussir la certif PMP, Piloter les audits ISO..."
                  value={advisorGoal}
                  onChange={(e) => setAdvisorGoal(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAdvisorModal(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!advisorProfile.trim() || !advisorGoal.trim()}
                onClick={() => handleLaunchAdvisor(advisorProfile, advisorGoal)}
                className="flex-1 py-2 text-xs font-bold bg-brand-blue text-white rounded-xl hover:bg-brand-blue-dark disabled:opacity-50"
              >
                Générer mon parcours
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2 : CAPTURE DE LEAD / DEVIS EN 1 CLIC */}
      {showLeadModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Demande de Devis & Inscription</span>
              </div>
              <button onClick={() => setShowLeadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {leadSubmitted ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Demande enregistrée !</h4>
                <p className="text-xs text-slate-500">Un conseiller vous contacte sous 24h avec la proforma officielle.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                    Formation souhaitée :
                  </label>
                  <select
                    value={leadFormation}
                    onChange={(e) => setLeadFormation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    {FORMATIONS.map(f => (
                      <option key={f.id} value={f.title}>{f.title} ({f.price})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Nom complet * :</label>
                    <input
                      type="text"
                      required
                      placeholder="M. / Mme..."
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Entreprise / Org :</label>
                    <input
                      type="text"
                      placeholder="Société ou Particulier"
                      value={leadCompany}
                      onChange={(e) => setLeadCompany(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">E-mail * :</label>
                    <input
                      type="email"
                      required
                      placeholder="nom@domaine.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Téléphone (WhatsApp) * :</label>
                    <input
                      type="tel"
                      required
                      placeholder="+225..."
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                    Nombre de participants :
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={leadParticipants}
                    onChange={(e) => setLeadParticipants(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    * Rappel : -10% dès 3 inscrits, -15% dès 5 inscrits.
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLeadModal(false)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                  >
                    Valider ma demande
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
