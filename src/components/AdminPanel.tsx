import React, { useState, useEffect } from 'react';
import { 
  auth, db 
} from '../firebase';
import { 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  doc, 
  updateDoc, 
  Timestamp,
  setDoc,
  deleteDoc,
  addDoc,
  arrayUnion,
  onSnapshot
} from 'firebase/firestore';
import { 
  Lock, Mail, Key, LogOut, Users, Eye, CheckCircle2, 
  AlertCircle, Search, RefreshCw, Calendar, Monitor, Download, ArrowLeftRight,
  Plus, Trash2, Edit3, Image, BookOpen, Layers, ExternalLink, Sparkles, Check, HelpCircle, MapPin, Tag, FileText,
  FileSpreadsheet, Phone, MessageSquare, Send, CheckCheck, UserCheck, Filter, Clock, Briefcase, Award, Building, Compass,
  Target, ShieldCheck, Cpu
} from 'lucide-react';
import { DOMAINS_INTERVENTION, PROJECTS, FORMATIONS, BLOG_POSTS, PARTNERS } from '../data';
import { Prospect, exportProspectsToExcel, exportSingleProspectToExcel, saveProspect } from '../lib/prospects';
import { SoftwareTool } from '../types';
import { isAuthorizedAdminEmail, getAuthErrorMessage } from '../lib/adminAuth';
import { PRESET_SOFTWARE_TOOLS } from '../data/softwarePresets';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AdminPanelProps {
  formations?: any[];
  accompagnements?: any[];
  realisations?: any[];
  blogPosts?: any[];
  partners?: any[];
}

export default function AdminPanel({
  formations = [],
  accompagnements = [],
  realisations = [],
  blogPosts = [],
  partners = []
}: AdminPanelProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Dashboard Data State
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [prospectFilterStatus, setProspectFilterStatus] = useState<string>('all');
  const [prospectFilterType, setProspectFilterType] = useState<string>('all');
  const [visits, setVisits] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [dbFormations, setDbFormations] = useState<any[]>([]);
  const [dbAccompagnements, setDbAccompagnements] = useState<any[]>([]);
  const [dbRealisations, setDbRealisations] = useState<any[]>([]);
  const [dbBlogPosts, setDbBlogPosts] = useState<any[]>([]);
  const [dbPartners, setDbPartners] = useState<any[]>([]);

  // Local tracking of deleted items to guarantee instant zero-latency UI update for both static and Firestore items
  const [localDeletedIds, setLocalDeletedIds] = useState<{
    formations: string[];
    accompagnements: string[];
    realisations: string[];
    blog_posts: string[];
    partners: string[];
  }>(() => {
    try {
      const cached = localStorage.getItem('cicexf_deleted_items');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return { formations: [], accompagnements: [], realisations: [], blog_posts: [], partners: [] };
  });

  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'formations' | 'accompagnements' | 'realisations' | 'blog_posts' | 'prospects' | 'partners' | 'visits' | 'subscribers'>('formations');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for Formations
  const [showFormationForm, setShowFormationForm] = useState(false);
  const [editingFormation, setEditingFormation] = useState<any | null>(null);
  const [fTitle, setFTitle] = useState('');
  const [fDomain, setFDomain] = useState(DOMAINS_INTERVENTION[0]?.title || 'Ingénierie de formation et de renforcement de capacités');
  const [fSpecialty, setFSpecialty] = useState(DOMAINS_INTERVENTION[0]?.subDomains[0]?.title || '');
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [isCustomSpecialty, setIsCustomSpecialty] = useState(false);
  const [fLevel, setFLevel] = useState<'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux'>('Intermédiaire');
  const [fModality, setFModality] = useState<'Présentiel' | 'En ligne' | 'Hybride'>('Hybride');
  const [fDuration, setFDuration] = useState('6 semaines (120 heures)');
  const [fPrice, setFPrice] = useState('450 000 FCFA');
  const [fShortDescription, setFShortDescription] = useState('');
  const [fFeaturedImage, setFFeaturedImage] = useState('');
  const [fIsFeatured, setFIsFeatured] = useState(true);
  const [fObjectives, setFObjectives] = useState('');
  const [fResultsExpected, setFResultsExpected] = useState('');
  const [fTargetPublic, setFTargetPublic] = useState('');
  const [fPrerequisites, setFPrerequisites] = useState('');
  const [fProgramModules, setFProgramModules] = useState<{ module: string; details: string[] }[]>([
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
    }
  ]);

  // Form states for Accompagnements (Domaines d'intervention)
  const [showAccompagnementForm, setShowAccompagnementForm] = useState(false);
  const [editingAccompagnement, setEditingAccompagnement] = useState<any | null>(null);
  const [accTitle, setAccTitle] = useState('');
  const [accShortDescription, setAccShortDescription] = useState('');
  const [accDescription, setAccDescription] = useState('');
  const [accIconName, setAccIconName] = useState('Layers');
  const [accSubDomainsText, setAccSubDomainsText] = useState('');
  const [accExamplesText, setAccExamplesText] = useState('');

  // 7 Architectural sections for Accompagnements
  const [accPresentationService, setAccPresentationService] = useState(''); // 1. Présentation du service
  const [accObjectives, setAccObjectives] = useState(''); // 2. Objectifs opérationnels (1 par ligne)
  const [accDemarche, setAccDemarche] = useState(''); // 3. Démarche d'accompagnement (1 phase par ligne)
  const [accResultatsAttendus, setAccResultatsAttendus] = useState(''); // 4. Résultats attendus (1 par ligne)
  const [accImpactEntite, setAccImpactEntite] = useState(''); // 5. Impact pour l'entité
  const [accMethodeEvaluation, setAccMethodeEvaluation] = useState(''); // 6. Méthode d'évaluation (1 par ligne)
  const [accSoftwareList, setAccSoftwareList] = useState<SoftwareTool[]>([]); // 7. Logiciels impliqués
  const [newSoftwareName, setNewSoftwareName] = useState('');
  const [newSoftwareIconUrl, setNewSoftwareIconUrl] = useState('');

  // Form states for Realisations (Projets & Chantiers)
  const [showRealisationForm, setShowRealisationForm] = useState(false);
  const [editingRealisation, setEditingRealisation] = useState<any | null>(null);
  const [rTitle, setRTitle] = useState('');
  const [rCategory, setRCategory] = useState('Ingénierie & SIG');
  const [rClient, setRClient] = useState('');
  const [rLocation, setRLocation] = useState('Abidjan, Côte d\'Ivoire');
  const [rYear, setRYear] = useState(new Date().getFullYear().toString());
  const [rImageUrl, setRImageUrl] = useState('');
  const [rDescription, setRDescription] = useState('');
  const [rChallengesText, setRChallengesText] = useState('');
  const [rSolutionsText, setRSolutionsText] = useState('');

  // Form states for Blog Posts
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<any | null>(null);
  const [bTitle, setBTitle] = useState('');
  const [bCategory, setBCategory] = useState('Formation');
  const [bReadTime, setBReadTime] = useState('5 min de lecture');
  const [bExcerpt, setBExcerpt] = useState('');
  const [bContent, setBContent] = useState('');
  const [bImageUrl, setBImageUrl] = useState('');
  const [bIsFeatured, setBIsFeatured] = useState(false);
  const [bTags, setBTags] = useState('');
  const [bAuthorName, setBAuthorName] = useState('Cabinet CICEXF');
  const [bAuthorRole, setBAuthorRole] = useState('Expert Formateur');
  const [bAuthorAvatar, setBAuthorAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');

  // Form states for Partners
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [pName, setPName] = useState('');
  const [pLogoUrl, setPLogoUrl] = useState('');
  const [pCategory, setPCategory] = useState('Cabinet Partenaire');

  // Track the verified Firebase Auth user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && isAuthorizedAdminEmail(user.email)) {
        loadDashboardData();
      }
      setLoading(false);
    });

    // Real-time listener for permanently deleted items (formations, accompagnements, realisations, blog_posts, partners)
    const unsubDeleted = onSnapshot(doc(db, 'app_settings', 'deleted_items'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const map = {
          formations: (data.deletedFormationIds || []) as string[],
          accompagnements: (data.deletedAccompagnementIds || []) as string[],
          realisations: (data.deletedRealisationIds || []) as string[],
          blog_posts: (data.deletedBlogPostIds || []) as string[],
          partners: (data.deletedPartnerIds || []) as string[]
        };
        setLocalDeletedIds(map);
        try {
          localStorage.setItem('cicexf_deleted_items', JSON.stringify(map));
        } catch (e) {}
      }
    });

    return () => {
      unsubscribe();
      unsubDeleted();
    };
  }, []);

  // Fetch all collections from Firestore
  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
      // 0. Fetch Prospects for Excel
      try {
        const prospectsQuery = query(collection(db, 'prospects'), orderBy('createdAt', 'desc'));
        const prospectsSnapshot = await getDocs(prospectsQuery);
        const prospectsData = prospectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
        })) as Prospect[];
        setProspects(prospectsData);
      } catch (e) {
        // Fallback without orderBy
        const prospectsSnapshot = await getDocs(collection(db, 'prospects'));
        const prospectsData = prospectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
        })) as Prospect[];
        setProspects(prospectsData);
      }

      // 1. Fetch Visits
      const visitsQuery = query(collection(db, 'visits'), orderBy('timestamp', 'desc'), limit(1000));
      const visitsSnapshot = await getDocs(visitsQuery);
      const visitsData = visitsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp)?.toDate() || new Date()
      }));
      setVisits(visitsData);

      // 2. Fetch Subscribers
      const subsSnapshot = await getDocs(collection(db, 'subscribers'));
      const subsData = subsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        subscribedAt: (doc.data().subscribedAt as Timestamp)?.toDate() || null,
        lastVisitAt: (doc.data().lastVisitAt as Timestamp)?.toDate() || null
      }));
      setSubscribers(subsData);

      // 3. Fetch Formations
      const formSnapshot = await getDocs(collection(db, 'formations'));
      const formData = formSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDbFormations(formData);

      // 4. Fetch Blog Posts
      const blogSnapshot = await getDocs(collection(db, 'blog_posts'));
      const blogData = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDbBlogPosts(blogData);

      // 5. Fetch Partners
      const partnerSnapshot = await getDocs(collection(db, 'partners'));
      const partnerData = partnerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDbPartners(partnerData);

      // 6. Fetch Accompagnements
      try {
        const accSnapshot = await getDocs(collection(db, 'accompagnements'));
        const accData = accSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDbAccompagnements(accData);
      } catch (errAcc) {
        console.warn('Error fetching accompagnements:', errAcc);
      }

      // 7. Fetch Realisations
      try {
        const realSnapshot = await getDocs(collection(db, 'realisations'));
        const realData = realSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDbRealisations(realData);
      } catch (errReal) {
        console.warn('Error fetching realisations:', errReal);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setAuthError("Veuillez sélectionner une adresse administrateur autorisée (elearningciv@gmail.com ou cabinetcicexf@gmail.com).");
      return;
    }
    setResetLoading(true);
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setResetEmailSent(true);
    } catch (err: any) {
      console.warn("Reset password error:", err);
      setAuthError("Impossible d'envoyer l'e-mail de réinitialisation. Vérifiez l'adresse et réessayez.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setResetEmailSent(false);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setAuthError("Accès refusé. Seules les adresses habilitées du Cabinet peuvent accéder à l'administration.");
      setLoading(false);
      return;
    }

    try {
      // onAuthStateChanged met à jour currentUser et charge le tableau de bord
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      setPassword('');
    } catch (err: any) {
      console.warn('Admin sign-in failed:', err?.code || err);
      setAuthError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const userEmail = res.user?.email?.toLowerCase();

      if (!isAuthorizedAdminEmail(userEmail)) {
        await signOut(auth);
        setAuthError(`L'adresse Google "${userEmail}" n'est pas habilitée à accéder à l'administration.`);
      }
    } catch (err: any) {
      console.warn("Google Sign-In canceled or failed:", err?.code || err);
      setAuthError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    setCurrentUser(null);
  };

  const handleToggleSubscription = async (subId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'subscribers', subId), {
        isSubscribed: !currentStatus
      });
      setSubscribers(prev => prev.map(s => s.id === subId ? { ...s, isSubscribed: !currentStatus } : s));
    } catch (err) {
      console.error('Error updating subscription:', err);
    }
  };

  // Status & Management for Prospects
  const handleUpdateProspectStatus = async (id: string, newStatus: Prospect['status']) => {
    try {
      await updateDoc(doc(db, 'prospects', id), { status: newStatus });
      setProspects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (err) {
      console.error('Error updating prospect status:', err);
    }
  };

  const handleDeleteProspect = async (id: string) => {
    if (!window.confirm("Êtes-vous certain de vouloir supprimer cette fiche prospect de la liste ?")) return;
    try {
      await deleteDoc(doc(db, 'prospects', id));
      setProspects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting prospect:', err);
    }
  };

  const handleSeedSampleProspects = async () => {
    try {
      setDataLoading(true);
      await saveProspect({
        name: "Kouadio Jean-Luc",
        email: "jl.kouadio@orange.ci",
        phone: "+225 07 48 12 34 56",
        type: "Inscription Individuelle",
        target: "Modélisation Financière Avancée et Évaluation des Investissements",
        session: "14 Octobre 2025",
        modality: "Présentiel (Cocody)",
        channel: "WhatsApp",
        status: "Nouveau"
      });
      await saveProspect({
        name: "Cabinet Sylla & Associés (Mme Fatou Sylla)",
        email: "contact@sylla-conseil.ci",
        phone: "+225 05 06 78 90 12",
        company: "Sylla & Associés",
        participants: "8 cadres",
        type: "Demande Entreprise",
        target: "Audit Légal, Fiscal et Due Diligence Institutionnelle",
        session: "Session Intra sur-mesure",
        modality: "Sur-mesure",
        channel: "En ligne",
        status: "Contacté"
      });
      await saveProspect({
        name: "Dr. Bakayoko Ibrahima",
        email: "i.bakayoko@ci-sante.gouv.ci",
        phone: "+225 01 02 45 67 89",
        company: "Ministère de la Santé",
        type: "Candidature Formation",
        target: "Systèmes d'Information Géographique (SIG) & Télédétection",
        session: "03 Novembre 2025",
        modality: "Hybride",
        channel: "Email",
        status: "En cours"
      });
      await loadDashboardData();
    } catch (e) {
      console.error("Error seeding prospects:", e);
    } finally {
      setDataLoading(false);
    }
  };

  // CSV Export for Subscribers & Visits
  const exportToCSV = (type: 'visits' | 'subscribers') => {
    let headers: string[] = [];
    let rows: any[] = [];
    let filename = '';

    if (type === 'visits') {
      headers = ['ID Visite', 'ID Visiteur', 'Session ID', 'Date & Heure', 'Email Visiteur', 'Page Consultée', 'Navigateur'];
      rows = visits.map(v => [
        v.id,
        v.visitorId,
        v.sessionId,
        v.timestamp.toLocaleString('fr-FR'),
        v.email || 'Anonyme',
        v.page,
        v.userAgent
      ]);
      filename = `Visites_CICEXF_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      headers = ['Email', 'ID Visiteur', 'Date Inscription', 'Dernière Visite', 'Statut Abonnement'];
      rows = subscribers.map(s => [
        s.email,
        s.visitorId,
        s.subscribedAt ? s.subscribedAt.toLocaleString('fr-FR') : 'Non renseigné',
        s.lastVisitAt ? s.lastVisitAt.toLocaleString('fr-FR') : 'Non renseigné',
        s.isSubscribed ? 'Abonné' : 'Non Abonné'
      ]);
      filename = `Abonnes_CICEXF_${new Date().toISOString().split('T')[0]}.csv`;
    }

    const csvContent = [
      headers.join(';'),
      ...rows.map(r => r.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CRUD for Formations
  const resetFormationForm = () => {
    setFTitle('');
    setFDomain(DOMAINS_INTERVENTION[0]?.title || 'Ingénierie de formation et de renforcement de capacités');
    setFSpecialty(DOMAINS_INTERVENTION[0]?.subDomains[0]?.title || '');
    setIsCustomDomain(false);
    setIsCustomSpecialty(false);
    setFLevel('Intermédiaire');
    setFModality('Hybride');
    setFDuration('6 semaines (120 heures)');
    setFPrice('450 000 FCFA');
    setFShortDescription('');
    setFFeaturedImage('');
    setFIsFeatured(true);
    setFObjectives('');
    setFResultsExpected('');
    setFTargetPublic('');
    setFPrerequisites('');
    setFProgramModules([
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
      }
    ]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert("L'image est un peu volumineuse (max conseillé 800 Ko). Veuillez utiliser une image de taille inférieure si possible.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFFeaturedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveFormation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sanitizedTitle = (fTitle || '')
        .replace(/^Nouvelle\s+Formation\s+d['’]Excellence\s*[:\-–—]?\s*/i, '')
        .replace(/Nouvelle\s+Formation\s+d['’]Excellence\s*[:\-–—]?\s*/gi, '')
        .trim();
      const finalTitle = sanitizedTitle || fTitle;

      const slug = finalTitle.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      const formId = editingFormation?.id || `f-${Date.now()}`;
      
      const payload = {
        id: formId,
        slug,
        title: finalTitle,
        domain: fDomain,
        thematic: fDomain,
        specialty: fSpecialty,
        level: fLevel,
        modality: fModality,
        duration: fDuration,
        price: fPrice,
        shortDescription: fShortDescription,
        featuredImage: fFeaturedImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        isFeatured: fIsFeatured,
        context: "Parcours de formation d'excellence pratique et intensive conçu par le Cabinet CICEXF.",
        objectives: fObjectives ? fObjectives.split('\n').map(o => o.trim()).filter(Boolean) : [],
        resultsExpected: fResultsExpected ? fResultsExpected.split('\n').map(o => o.trim()).filter(Boolean) : [],
        targetPublic: fTargetPublic ? fTargetPublic.split('\n').map(o => o.trim()).filter(Boolean) : [],
        prerequisites: fPrerequisites ? fPrerequisites.split('\n').map(o => o.trim()).filter(Boolean) : [],
        sessions: editingFormation?.sessions || [
          { date: "Session en cours (Inscriptions ouvertes)", location: "Abidjan & En ligne", status: "Disponible" },
          { date: "Session sur-mesure / Intra-entreprise", location: "Sur site ou Hybride", status: "Disponible" }
        ],
        program: fProgramModules
          .filter(m => m.module.trim())
          .map(m => ({
            module: m.module.trim(),
            details: m.details.map(d => d.trim()).filter(Boolean)
          })),
        createdAt: editingFormation?.createdAt || Timestamp.now()
      };

      await setDoc(doc(db, 'formations', formId), payload);

      // If adding a new formation, automatically create a corresponding blog post (actualité)
      if (!editingFormation) {
        const blogPostId = `p-f-${formId}`;
        const blogSlug = `formation-${slug}`;
        const blogTitle = fTitle;
        const blogExcerpt = `Découvrez notre programme de formation : "${fTitle}". Thématique : ${fDomain}. Spécialité : ${fSpecialty || 'Générale'}. ${fShortDescription.substring(0, 150)}...`;
        
        const blogContent = `### Lancement d'un nouveau programme de formation d'excellence\n\nNous avons le plaisir de vous annoncer le lancement officiel de notre nouvelle formation :\n\n**${fTitle}**\n\nCe parcours de formation de haut niveau est spécialement conçu par les experts du **Cabinet CICEXF** pour vous apporter des compétences immédiatement opérationnelles.\n\n### Fiche d'identité de la formation :\n- **Thématique principale :** ${fDomain}\n- **Spécialité :** ${fSpecialty || 'Générale'}\n- **Niveau d'accès :** ${fLevel}\n- **Modalité de suivi :** ${fModality}\n- **Durée totale :** ${fDuration}\n- **Tarif de participation :** ${fPrice}\n\n#### Présentation du programme\n${fShortDescription}\n\n${fObjectives ? `#### Objectifs pédagogiques :\n${fObjectives.split('\n').map(o => `* ${o.trim()}`).filter(Boolean).join('\n')}` : ''}\n\n${fResultsExpected ? `#### Résultats attendus :\n${fResultsExpected.split('\n').map(r => `* ${r.trim()}`).filter(Boolean).join('\n')}` : ''}\n\n### Comment s'inscrire ?\nVous pouvez retrouver ce programme complet dans notre catalogue de formations et soumettre votre demande de devis ou d'inscription en direct. Pour toute question, nos conseillers pédagogiques sont à votre entière disposition.`;

        const blogPayload = {
          id: blogPostId,
          slug: blogSlug,
          title: blogTitle,
          category: 'Formation',
          readTime: '3 min de lecture',
          date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          author: {
            name: 'Cabinet CICEXF',
            role: 'Expert Formateur',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
          },
          excerpt: blogExcerpt,
          content: blogContent,
          imageUrl: fFeaturedImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
          isFeatured: true,
          tags: ['Formation', fDomain, fSpecialty].filter(Boolean),
          createdAt: Timestamp.now()
        };

        await setDoc(doc(db, 'blog_posts', blogPostId), blogPayload);

        // Update local blog posts state
        setDbBlogPosts(prev => [blogPayload, ...prev]);
      }
      
      // Update state locally
      setDbFormations(prev => {
        const exists = prev.some(item => item.id === formId);
        if (exists) {
          return prev.map(item => item.id === formId ? payload : item);
        } else {
          return [payload, ...prev];
        }
      });

      setEditingFormation(null);
      setShowFormationForm(false);
      resetFormationForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'formations');
    }
  };

  const handleDeleteFormation = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ? Cette action la retirera définitivement du site.")) return;
    try {
      const blogIds = [`p-f-${id}`, `p-f-f-${id}`];
      setLocalDeletedIds(prev => ({
        ...prev,
        formations: Array.from(new Set([...prev.formations, id])),
        blog_posts: Array.from(new Set([...prev.blog_posts, ...blogIds]))
      }));
      setDbFormations(prev => prev.filter(item => item.id !== id));
      setDbBlogPosts(prev => prev.filter(item => item.id !== id && !blogIds.includes(item.id)));

      // Delete from Firestore collections
      await deleteDoc(doc(db, 'formations', id));
      for (const bId of blogIds) {
        await deleteDoc(doc(db, 'blog_posts', bId)).catch(() => {});
      }

      // Permanent blacklist in app_settings
      await setDoc(doc(db, 'app_settings', 'deleted_items'), {
        deletedFormationIds: arrayUnion(id),
        deletedBlogPostIds: arrayUnion(...blogIds)
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'formations');
    }
  };

  // CRUD for Accompagnements (Domaines d'intervention)
  const resetAccompagnementForm = () => {
    setAccTitle('');
    setAccShortDescription('');
    setAccDescription('');
    setAccIconName('Layers');
    setAccSubDomainsText('');
    setAccExamplesText('');
    // Reset the 7 architectural sections
    setAccPresentationService('');
    setAccObjectives('');
    setAccDemarche('');
    setAccResultatsAttendus('');
    setAccImpactEntite('');
    setAccMethodeEvaluation('');
    setAccSoftwareList([]);
    setNewSoftwareName('');
    setNewSoftwareIconUrl('');
  };

  const handleSaveAccompagnement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = accTitle.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const accId = editingAccompagnement?.id || `acc-${Date.now()}`;

      const objectivesList = accObjectives.split('\n').map(l => l.trim().replace(/^[-*•0-9.]+\s*/, '')).filter(Boolean);
      const demarcheList = accDemarche.split('\n').map(l => l.trim().replace(/^[-*•0-9.]+\s*/, '')).filter(Boolean);
      const resultatsList = accResultatsAttendus.split('\n').map(l => l.trim().replace(/^[-*•0-9.]+\s*/, '')).filter(Boolean);
      const methodeList = accMethodeEvaluation.split('\n').map(l => l.trim().replace(/^[-*•0-9.]+\s*/, '')).filter(Boolean);
      const softwareLegacy = accSoftwareList.map(s => s.name);

      const lines = accSubDomainsText.split('\n').map(l => l.trim().replace(/^[-*•0-9.]+\s*/, '')).filter(Boolean);
      const subDomainsList = lines.length > 0
        ? lines.map((title) => ({
            title,
            description: `Intervention spécialisée et cadrage opérationnel sur ${title}.`,
            presentationService: accPresentationService || `Intervention spécialisée et cadrage opérationnel sur ${title}.`,
            objectives: objectivesList.length > 0 ? objectivesList : ['Diagnostic approfondi', 'Accompagnement technique sur-mesure', 'Transfert de compétences'],
            demarcheAccompagnement: demarcheList.length > 0 ? demarcheList : [
              '1. Diagnostic initial et cadrage des exigences',
              '2. Déploiement des solutions et outillage technique',
              '3. Conduite du changement et transfert d\'autonomie'
            ],
            resultatsAttendus: resultatsList.length > 0 ? resultatsList : [
              'Processus optimisés et outillés',
              'Rapport d\'expertise et documentation remis'
            ],
            impactEntite: accImpactEntite || 'Autonomie opérationnelle renforcée et sécurisation des processus métier.',
            methodeEvaluation: methodeList.length > 0 ? methodeList : [
              'Mesure des indicateurs de performance avant/après',
              'Comité de clôture et audit de satisfaction'
            ],
            softwareTools: accSoftwareList,
            software: softwareLegacy
          }))
        : (editingAccompagnement?.subDomains || [
            {
              title: accTitle,
              description: accShortDescription,
              presentationService: accPresentationService || accDescription || accShortDescription,
              objectives: objectivesList.length > 0 ? objectivesList : ['Conseil stratégique', 'Optimisation des processus'],
              demarcheAccompagnement: demarcheList,
              resultatsAttendus: resultatsList,
              impactEntite: accImpactEntite,
              methodeEvaluation: methodeList,
              softwareTools: accSoftwareList,
              software: softwareLegacy
            }
          ]);

      const examplesList = accExamplesText.split('\n').map(l => l.trim().replace(/^[-*•0-9.]+\s*/, '')).filter(Boolean);

      const payload = {
        id: accId,
        slug,
        title: accTitle,
        shortDescription: accShortDescription,
        description: accDescription || accPresentationService,
        // The 7 architectural sections:
        presentationService: accPresentationService || accDescription,
        objectives: objectivesList,
        demarcheAccompagnement: demarcheList,
        resultatsAttendus: resultatsList,
        impactEntite: accImpactEntite,
        methodeEvaluation: methodeList,
        softwareTools: accSoftwareList,
        software: softwareLegacy,
        iconName: accIconName || 'Layers',
        subDomains: subDomainsList,
        examples: examplesList.length > 0 ? examplesList : ['Assistance technique institutionnelle', 'Audit et cadrage opérationnel'],
        createdAt: editingAccompagnement?.createdAt || Timestamp.now()
      };

      await setDoc(doc(db, 'accompagnements', accId), payload, { merge: true });

      setDbAccompagnements(prev => {
        const exists = prev.some(item => item.id === accId);
        if (exists) return prev.map(item => item.id === accId ? payload : item);
        return [payload, ...prev];
      });

      setEditingAccompagnement(null);
      setShowAccompagnementForm(false);
      resetAccompagnementForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'accompagnements');
    }
  };

  const handleDeleteAccompagnement = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet accompagnement (domaine d'intervention) ? Cette action le retirera définitivement du site.")) return;
    try {
      setLocalDeletedIds(prev => ({
        ...prev,
        accompagnements: Array.from(new Set([...prev.accompagnements, id]))
      }));
      setDbAccompagnements(prev => prev.filter(item => item.id !== id));

      await deleteDoc(doc(db, 'accompagnements', id));
      await setDoc(doc(db, 'app_settings', 'deleted_items'), {
        deletedAccompagnementIds: arrayUnion(id)
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'accompagnements');
    }
  };

  const handleEditAccompagnementClick = (acc: any) => {
    setEditingAccompagnement(acc);
    setAccTitle(acc.title || '');
    setAccShortDescription(acc.shortDescription || '');
    setAccDescription(acc.description || '');
    setAccIconName(acc.iconName || 'Layers');
    setAccSubDomainsText(acc.subDomains ? acc.subDomains.map((s: any) => s.title || s).join('\n') : '');
    setAccExamplesText(acc.examples ? acc.examples.join('\n') : '');

    // Populate the 7 architectural sections from acc or its subDomains
    const firstSub = acc.subDomains && acc.subDomains.length > 0 ? acc.subDomains[0] : null;
    setAccPresentationService(acc.presentationService || acc.description || firstSub?.presentationService || '');
    
    const objs = acc.objectives || firstSub?.objectives || [];
    setAccObjectives(Array.isArray(objs) ? objs.join('\n') : '');

    const demarche = acc.demarcheAccompagnement || firstSub?.demarcheAccompagnement || [];
    setAccDemarche(Array.isArray(demarche) ? demarche.join('\n') : '');

    const resultats = acc.resultatsAttendus || firstSub?.resultatsAttendus || [];
    setAccResultatsAttendus(Array.isArray(resultats) ? resultats.join('\n') : '');

    setAccImpactEntite(acc.impactEntite || firstSub?.impactEntite || firstSub?.expectedChanges || '');

    const methode = acc.methodeEvaluation || firstSub?.methodeEvaluation || [];
    setAccMethodeEvaluation(Array.isArray(methode) ? methode.join('\n') : '');

    // Software tools with icons
    const tools: SoftwareTool[] = acc.softwareTools || firstSub?.softwareTools || (
      (acc.software || firstSub?.software || []).map((s: string) => {
        const found = PRESET_SOFTWARE_TOOLS.find(p => p.name.toLowerCase() === s.toLowerCase());
        return { name: s, iconUrl: found?.iconUrl || '' };
      })
    );
    setAccSoftwareList(tools);
    setNewSoftwareName('');
    setNewSoftwareIconUrl('');

    setShowAccompagnementForm(true);
  };

  // CRUD for Realisations (Projets & Chantiers)
  const resetRealisationForm = () => {
    setRTitle('');
    setRCategory('Ingénierie & SIG');
    setRClient('');
    setRLocation('Abidjan, Côte d\'Ivoire');
    setRYear(new Date().getFullYear().toString());
    setRImageUrl('');
    setRDescription('');
    setRChallengesText('');
    setRSolutionsText('');
  };

  const handleSaveRealisation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const realId = editingRealisation?.id || `proj-${Date.now()}`;
      const challengesList = rChallengesText.split('\n').map(l => l.trim().replace(/^[-*•0-9.]+\s*/, '')).filter(Boolean);
      const solutionsList = rSolutionsText.split('\n').map(l => l.trim().replace(/^[-*•0-9.]+\s*/, '')).filter(Boolean);

      const payload = {
        id: realId,
        title: rTitle,
        category: rCategory,
        client: rClient,
        location: rLocation,
        year: parseInt(rYear, 10) || new Date().getFullYear(),
        imageUrl: rImageUrl || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
        description: rDescription,
        challenges: challengesList.length > 0 ? challengesList : ['Contraintes de délais serrés', 'Exigence de haute technicité opérationnelle'],
        solutions: solutionsList.length > 0 ? solutionsList : ['Mobilisation d une équipe d experts chevronnés', 'Méthodologie agile et restitution documentée'],
        stats: editingRealisation?.stats || [
          { value: '100%', label: 'Conformité' },
          { value: '+45%', label: 'Gains d efficience' }
        ],
        createdAt: editingRealisation?.createdAt || Timestamp.now()
      };

      await setDoc(doc(db, 'realisations', realId), payload, { merge: true });

      setDbRealisations(prev => {
        const exists = prev.some(item => item.id === realId);
        if (exists) return prev.map(item => item.id === realId ? payload : item);
        return [payload, ...prev];
      });

      setEditingRealisation(null);
      setShowRealisationForm(false);
      resetRealisationForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'realisations');
    }
  };

  const handleDeleteRealisation = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette réalisation / chantier ? Cette action la retirera définitivement du site.")) return;
    try {
      setLocalDeletedIds(prev => ({
        ...prev,
        realisations: Array.from(new Set([...prev.realisations, id]))
      }));
      setDbRealisations(prev => prev.filter(item => item.id !== id));

      await deleteDoc(doc(db, 'realisations', id));
      await setDoc(doc(db, 'app_settings', 'deleted_items'), {
        deletedRealisationIds: arrayUnion(id)
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'realisations');
    }
  };

  const handleEditRealisationClick = (proj: any) => {
    setEditingRealisation(proj);
    setRTitle(proj.title || '');
    setRCategory(proj.category || 'Ingénierie & SIG');
    setRClient(proj.client || '');
    setRLocation(proj.location || 'Abidjan, Côte d\'Ivoire');
    setRYear(proj.year ? proj.year.toString() : new Date().getFullYear().toString());
    setRImageUrl(proj.imageUrl || '');
    setRDescription(proj.description || '');
    setRChallengesText(proj.challenges ? proj.challenges.join('\n') : '');
    setRSolutionsText(proj.solutions ? proj.solutions.join('\n') : '');
    setShowRealisationForm(true);
  };

  const handleEditFormationClick = (f: any) => {
    setEditingFormation(f);
    setFTitle(f.title || '');
    
    const domainVal = f.domain || f.thematic || DOMAINS_INTERVENTION[0]?.title || '';
    setFDomain(domainVal);
    
    const specVal = f.specialty || '';
    setFSpecialty(specVal);

    // Check if domain is custom
    const domainExists = DOMAINS_INTERVENTION.some(d => d.title === domainVal);
    if (domainVal && !domainExists) {
      setIsCustomDomain(true);
    } else {
      setIsCustomDomain(false);
    }

    // Check if specialty is custom within that domain
    const dObj = DOMAINS_INTERVENTION.find(d => d.title === domainVal);
    const specExists = dObj ? dObj.subDomains.some(sub => sub.title === specVal) : false;
    if (specVal && !specExists) {
      setIsCustomSpecialty(true);
    } else {
      setIsCustomSpecialty(false);
    }

    setFLevel(f.level || 'Intermédiaire');
    setFModality(f.modality || 'Hybride');
    setFDuration(f.duration || '');
    setFPrice(f.price || '');
    setFShortDescription(f.shortDescription || '');
    setFFeaturedImage(f.featuredImage || '');
    setFIsFeatured(!!f.isFeatured);
    setFObjectives(f.objectives ? f.objectives.join('\n') : '');
    setFResultsExpected(f.resultsExpected ? f.resultsExpected.join('\n') : '');
    setFTargetPublic(f.targetPublic ? f.targetPublic.join('\n') : '');
    setFPrerequisites(f.prerequisites ? f.prerequisites.join('\n') : '');
    if (f.program && Array.isArray(f.program) && f.program.length > 0) {
      setFProgramModules(f.program.map((p: any) => ({
        module: p.module || '',
        details: Array.isArray(p.details) ? p.details : (p.details ? [String(p.details)] : [])
      })));
    } else {
      setFProgramModules([
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
        }
      ]);
    }
    setShowFormationForm(true);
  };

  // CRUD for Blog Posts (News)
  const resetBlogForm = () => {
    setBTitle('');
    setBCategory('Formation');
    setBReadTime('5 min de lecture');
    setBExcerpt('');
    setBContent('');
    setBImageUrl('');
    setBIsFeatured(false);
    setBTags('');
    setBAuthorName('Cabinet CICEXF');
    setBAuthorRole('Expert Formateur');
    setBAuthorAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
  };

  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = bTitle.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      const postId = editingBlogPost?.id || `p-${Date.now()}`;
      
      const payload = {
        id: postId,
        slug,
        title: bTitle,
        category: bCategory,
        readTime: bReadTime,
        date: editingBlogPost?.date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        author: {
          name: bAuthorName,
          role: bAuthorRole,
          avatarUrl: bAuthorAvatar
        },
        excerpt: bExcerpt,
        content: bContent,
        imageUrl: bImageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        isFeatured: bIsFeatured,
        tags: bTags ? bTags.split(',').map(t => t.trim()).filter(Boolean) : [bCategory],
        createdAt: editingBlogPost?.createdAt || Timestamp.now()
      };

      await setDoc(doc(db, 'blog_posts', postId), payload);
      
      setDbBlogPosts(prev => {
        const exists = prev.some(item => item.id === postId);
        if (exists) {
          return prev.map(item => item.id === postId ? payload : item);
        } else {
          return [payload, ...prev];
        }
      });

      setEditingBlogPost(null);
      setShowBlogForm(false);
      resetBlogForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'blog_posts');
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article d'actualité ? Cette action le retirera définitivement du site.")) return;
    try {
      setLocalDeletedIds(prev => ({
        ...prev,
        blog_posts: Array.from(new Set([...prev.blog_posts, id]))
      }));
      setDbBlogPosts(prev => prev.filter(item => item.id !== id));

      await deleteDoc(doc(db, 'blog_posts', id));
      await setDoc(doc(db, 'app_settings', 'deleted_items'), {
        deletedBlogPostIds: arrayUnion(id)
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'blog_posts');
    }
  };

  const handleEditBlogPostClick = (post: any) => {
    setEditingBlogPost(post);
    setBTitle(post.title || '');
    setBCategory(post.category || 'Formation');
    setBReadTime(post.readTime || '5 min de lecture');
    setBExcerpt(post.excerpt || '');
    setBContent(post.content || '');
    setBImageUrl(post.imageUrl || '');
    setBIsFeatured(!!post.isFeatured);
    setBAuthorName(post.author?.name || 'Cabinet CICEXF');
    setBAuthorRole(post.author?.role || 'Expert Formateur');
    setBAuthorAvatar(post.author?.avatarUrl || '');
    setBTags(post.tags ? post.tags.join(', ') : '');
    setShowBlogForm(true);
  };

  // CRUD for Partners
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const partnerId = editingPartner?.id || `part-${Date.now()}`;
      
      const payload = {
        id: partnerId,
        name: pName,
        logoUrl: pLogoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        category: pCategory,
        createdAt: editingPartner?.createdAt || Timestamp.now()
      };

      await setDoc(doc(db, 'partners', partnerId), payload);
      
      setDbPartners(prev => {
        const exists = prev.some(item => item.id === partnerId);
        if (exists) {
          return prev.map(item => item.id === partnerId ? payload : item);
        } else {
          return [payload, ...prev];
        }
      });

      setEditingPartner(null);
      setShowPartnerForm(false);
      setPName('');
      setPLogoUrl('');
      setPCategory('Cabinet Partenaire');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'partners');
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?")) return;
    try {
      setLocalDeletedIds(prev => ({
        ...prev,
        partners: Array.from(new Set([...prev.partners, id]))
      }));
      setDbPartners(prev => prev.filter(item => item.id !== id));

      await deleteDoc(doc(db, 'partners', id));
      await setDoc(doc(db, 'app_settings', 'deleted_items'), {
        deletedPartnerIds: arrayUnion(id)
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'partners');
    }
  };

  const handleEditPartnerClick = (part: any) => {
    setEditingPartner(part);
    setPName(part.name || '');
    setPLogoUrl(part.logoUrl || '');
    setPCategory(part.category || 'Cabinet Partenaire');
    setShowPartnerForm(true);
  };

  // Filter lists based on search query
  const filteredProspects = prospects.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.phone && p.phone.toLowerCase().includes(q)) ||
      (p.target && p.target.toLowerCase().includes(q)) ||
      (p.company && p.company.toLowerCase().includes(q)) ||
      (p.type && p.type.toLowerCase().includes(q));

    const matchesStatus = prospectFilterStatus === 'all' || p.status === prospectFilterStatus;
    const matchesType = prospectFilterType === 'all' || p.type === prospectFilterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredVisits = visits.filter(v => 
    (v.email && v.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    v.visitorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.page.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Merged sources (props from real-time App.tsx + local db items + static seed)
  const rawFormations = formations !== undefined ? formations : (dbFormations.length > 0 ? dbFormations : FORMATIONS);
  const rawAccompagnements = accompagnements !== undefined ? accompagnements : (dbAccompagnements.length > 0 ? dbAccompagnements : DOMAINS_INTERVENTION);
  const rawRealisations = realisations !== undefined ? realisations : (dbRealisations.length > 0 ? dbRealisations : PROJECTS);
  const rawBlogPosts = blogPosts !== undefined ? blogPosts : (dbBlogPosts.length > 0 ? dbBlogPosts : BLOG_POSTS);
  const rawPartners = partners !== undefined ? partners : (dbPartners.length > 0 ? dbPartners : PARTNERS);

  const mergedFormations = rawFormations.filter(f => !localDeletedIds.formations.includes(f.id));
  const mergedAccompagnements = rawAccompagnements.filter(a => !localDeletedIds.accompagnements.includes(a.id));
  const mergedRealisations = rawRealisations.filter(r => !localDeletedIds.realisations.includes(r.id));
  const mergedBlogPosts = rawBlogPosts.filter(b => !localDeletedIds.blog_posts.includes(b.id));
  const mergedPartners = rawPartners.filter(p => !localDeletedIds.partners.includes(p.id));

  const filteredFormations = mergedFormations.filter(f => 
    !searchQuery ||
    (f.title && f.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (f.domain && f.domain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAccompagnements = mergedAccompagnements.filter(a => 
    !searchQuery ||
    (a.title && a.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.shortDescription && a.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredRealisations = mergedRealisations.filter(r => 
    !searchQuery ||
    (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.client && r.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredBlogPosts = mergedBlogPosts.filter(b => 
    !searchQuery ||
    (b.title && b.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (b.category && b.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPartners = mergedPartners.filter(p => 
    !searchQuery ||
    (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 text-brand-emerald animate-spin" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Chargement de la console d'administration...</p>
        </div>
      </div>
    );
  }

  // Security gate: only elearningciv@gmail.com and cabinetcicexf@gmail.com can see the administrative rubriques
  if (!currentUser || !isAuthorizedAdminEmail(currentUser.email)) {
    return (
      <div id="admin-login-view" className="min-h-screen bg-slate-50 dark:bg-[#020817] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-md w-full space-y-6">
          {/* Logo & Brand */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-emerald rounded-2xl text-white font-extrabold text-2xl shadow-lg mb-3">
              CX
            </div>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Console d'Administration CICEXF
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Espace sécurisé de gestion et publication de contenu
            </p>
          </div>

          {/* Access Restriction Warning */}
          <div className="bg-amber-50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide text-[11px]">
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Accès strictement réservé</span>
            </div>
            <p className="text-[11.5px] leading-relaxed">
              Les rubriques d'administration sont strictement confidentielles et réservées aux adresses habilitées du Cabinet :
            </p>
            <ul className="text-[11px] font-mono font-bold text-amber-900 dark:text-amber-200 list-disc list-inside space-y-0.5">
              <li>elearningciv@gmail.com</li>
              <li>cabinetcicexf@gmail.com</li>
            </ul>
          </div>

          {/* Connected but unauthorized notice */}
          {currentUser && !isAuthorizedAdminEmail(currentUser.email) && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3.5 text-xs text-red-700 dark:text-red-300 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Compte non habilité : {currentUser.email}</p>
                <p className="text-[11px]">Cette adresse n'a pas les droits d'administration. Veuillez vous connecter avec l'une des deux adresses autorisées.</p>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-2 text-xs font-bold text-red-700 dark:text-red-300 underline hover:no-underline cursor-pointer"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          )}

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            {authError && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-3 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{authError}</span>
              </div>
            )}

            {resetEmailSent && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Un e-mail de réinitialisation a été envoyé à <strong>{email}</strong>. Veuillez vérifier votre boîte de réception pour choisir un nouveau mot de passe.
                </span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Adresse e-mail administrateur
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elearningciv@gmail.com ou cabinetcicexf@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-750 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="text-[11px] text-brand-emerald dark:text-amber-400 font-semibold hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {resetLoading ? "Envoi..." : "Mot de passe oublié ?"}
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-750 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-bold rounded-xl shadow-md transition-all uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>Accéder aux rubriques d'administration</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Connexion rapide avec Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-view" className="py-6 bg-slate-50 dark:bg-slate-950 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-brand-emerald font-extrabold uppercase tracking-widest mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Console d'Administration &amp; Gestion de Contenu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Espace de Publication &amp; Pilotage CICEXF
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Ajoutez ou supprimez en direct les formations, accompagnements, réalisations et actualités du cabinet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold shadow-xs">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Connecté : {currentUser?.email}</span>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
              title="Déconnexion sécurisée"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Analytical Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-5 text-xs font-sans">
          
          {/* Card 1: Formations */}
          <div 
            onClick={() => { setActiveTab('formations'); setSearchQuery(''); }}
            className={`border rounded-2xl p-4 shadow-sm flex items-center space-x-3.5 cursor-pointer transition-all ${
              activeTab === 'formations'
                ? 'bg-blue-50/90 dark:bg-blue-950/40 border-brand-blue ring-2 ring-brand-blue/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-blue/50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Formations</span>
              <span className="block text-lg font-black text-slate-900 dark:text-white mt-0.5">{filteredFormations.length}</span>
            </div>
          </div>

          {/* Card 2: Accompagnements */}
          <div 
            onClick={() => { setActiveTab('accompagnements'); setSearchQuery(''); }}
            className={`border rounded-2xl p-4 shadow-sm flex items-center space-x-3.5 cursor-pointer transition-all ${
              activeTab === 'accompagnements'
                ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-brand-emerald ring-2 ring-brand-emerald/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-emerald/50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-emerald text-white flex items-center justify-center shrink-0 shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Accompagnement</span>
              <span className="block text-lg font-black text-slate-900 dark:text-white mt-0.5">{filteredAccompagnements.length}</span>
            </div>
          </div>

          {/* Card 3: Réalisations */}
          <div 
            onClick={() => { setActiveTab('realisations'); setSearchQuery(''); }}
            className={`border rounded-2xl p-4 shadow-sm flex items-center space-x-3.5 cursor-pointer transition-all ${
              activeTab === 'realisations'
                ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500/50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Réalisations</span>
              <span className="block text-lg font-black text-slate-900 dark:text-white mt-0.5">{filteredRealisations.length}</span>
            </div>
          </div>

          {/* Card 4: Actualités */}
          <div 
            onClick={() => { setActiveTab('blog_posts'); setSearchQuery(''); }}
            className={`border rounded-2xl p-4 shadow-sm flex items-center space-x-3.5 cursor-pointer transition-all ${
              activeTab === 'blog_posts'
                ? 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-500/50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actualités</span>
              <span className="block text-lg font-black text-slate-900 dark:text-white mt-0.5">{filteredBlogPosts.length}</span>
            </div>
          </div>

          {/* Card 5: Prospects Excel */}
          <div 
            onClick={() => { setActiveTab('prospects'); setSearchQuery(''); }}
            className={`border rounded-2xl p-4 shadow-sm flex items-center space-x-3.5 cursor-pointer transition-all ${
              activeTab === 'prospects'
                ? 'bg-teal-50/90 dark:bg-teal-950/40 border-teal-600 ring-2 ring-teal-600/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-600/50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prospects &amp; Excel</span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-lg font-black text-slate-900 dark:text-white">{prospects.length}</span>
                {prospects.filter(p => p.status === 'Nouveau').length > 0 && (
                  <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-extrabold px-1.5 py-0.2 rounded-full">
                    {prospects.filter(p => p.status === 'Nouveau').length} nv
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card 6: Partenaires */}
          <div 
            onClick={() => { setActiveTab('partners'); setSearchQuery(''); }}
            className={`border rounded-2xl p-4 shadow-sm flex items-center space-x-3.5 cursor-pointer transition-all ${
              activeTab === 'partners'
                ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-500/50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Partenaires</span>
              <span className="block text-lg font-black text-slate-900 dark:text-white mt-0.5">{filteredPartners.length}</span>
            </div>
          </div>

        </div>

        {/* Content Management Tab Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden mb-6">
          
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            
            {/* Tabs Selector Trigger List */}
            <div className="flex flex-wrap bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl gap-1">
              <button
                onClick={() => { setActiveTab('formations'); setSearchQuery(''); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'formations' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Formations</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'formations' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {filteredFormations.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('accompagnements'); setSearchQuery(''); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'accompagnements' 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Accompagnement</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'accompagnements' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {filteredAccompagnements.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('realisations'); setSearchQuery(''); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'realisations' 
                    ? 'bg-amber-600 text-white shadow-md' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Réalisations</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'realisations' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {filteredRealisations.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('blog_posts'); setSearchQuery(''); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'blog_posts' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Actualités</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'blog_posts' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {filteredBlogPosts.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('prospects'); setSearchQuery(''); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'prospects' 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-teal-600 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Devis &amp; Inscriptions</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'prospects' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {prospects.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('partners'); setSearchQuery(''); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'partners' 
                    ? 'bg-rose-600 text-white shadow-md' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Partenaires</span>
              </button>

              <button
                onClick={() => { setActiveTab('visits'); setSearchQuery(''); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'visits' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Visites
              </button>

              <button
                onClick={() => { setActiveTab('subscribers'); setSearchQuery(''); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'subscribers' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Abonnés
              </button>
            </div>

            {/* Right Side Search Bar & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-brand-emerald w-full sm:w-56 text-slate-900 dark:text-white font-medium"
                />
              </div>

              {activeTab === 'formations' && (
                <button
                  onClick={() => { resetFormationForm(); setEditingFormation(null); setShowFormationForm(true); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:scale-102 active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Formation</span>
                </button>
              )}

              {activeTab === 'accompagnements' && (
                <button
                  onClick={() => { resetAccompagnementForm(); setEditingAccompagnement(null); setShowAccompagnementForm(true); }}
                  className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:scale-102 active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvel Accompagnement</span>
                </button>
              )}

              {activeTab === 'realisations' && (
                <button
                  onClick={() => { resetRealisationForm(); setEditingRealisation(null); setShowRealisationForm(true); }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:scale-102 active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Réalisation</span>
                </button>
              )}

              {activeTab === 'blog_posts' && (
                <button
                  onClick={() => { resetBlogForm(); setEditingBlogPost(null); setShowBlogForm(true); }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:scale-102 active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Actualité</span>
                </button>
              )}

              {activeTab === 'prospects' && (
                <button
                  onClick={() => exportProspectsToExcel(filteredProspects)}
                  className="bg-teal-600 hover:bg-teal-700 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  title="Télécharger l'ensemble des prospects sous format Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Télécharger Excel ({filteredProspects.length})</span>
                </button>
              )}

              {activeTab === 'partners' && (
                <button
                  onClick={() => { setEditingPartner(null); setPName(''); setPLogoUrl(''); setPCategory('Cabinet Partenaire'); setShowPartnerForm(true); }}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:scale-102 active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Partenaire</span>
                </button>
              )}

              {(activeTab === 'visits' || activeTab === 'subscribers') && (
                <button
                  onClick={() => exportToCSV(activeTab as 'visits' | 'subscribers')}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter CSV</span>
                </button>
              )}
            </div>

          </div>

          {/* Form Overlays / Accordions */}
          
          {/* 1. FORMATION FORM MODAL */}
          {showFormationForm && (
            <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                  <Layers className="w-4 h-4 mr-2 text-brand-emerald" />
                  {editingFormation ? "Modifier la formation" : "Ajouter une nouvelle formation d'excellence"}
                </h3>
                <button
                  onClick={() => { setShowFormationForm(false); setEditingFormation(null); }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Fermer [X]
                </button>
              </div>

              <form onSubmit={handleSaveFormation} className="space-y-5 text-xs text-slate-700 dark:text-slate-350">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-bold">Titre complet de la formation :</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Data Analyst : Maîtrise complète de Power BI"
                      value={fTitle}
                      onChange={(e) => setFTitle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Thématique / Domaine d'intervention :</label>
                    <select
                      value={isCustomDomain ? "autre" : fDomain}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "autre") {
                          setIsCustomDomain(true);
                          setFDomain("");
                          setFSpecialty("");
                        } else {
                          setIsCustomDomain(false);
                          setFDomain(val);
                          const dObj = DOMAINS_INTERVENTION.find(d => d.title === val);
                          if (dObj && dObj.subDomains && dObj.subDomains.length > 0) {
                            setFSpecialty(dObj.subDomains[0].title);
                            setIsCustomSpecialty(false);
                          } else {
                            setFSpecialty("");
                          }
                        }
                      }}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none focus:border-brand-emerald"
                    >
                      {DOMAINS_INTERVENTION.map((dom) => (
                        <option key={dom.id} value={dom.title}>
                          {dom.title}
                        </option>
                      ))}
                      <option value="autre">Autre (Saisir manuellement)...</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {isCustomDomain ? (
                    <div className="space-y-1.5">
                      <label className="block font-bold text-brand-emerald">Saisir la thématique personnalisée :</label>
                      <input
                        type="text"
                        required
                        placeholder="Saisissez la thématique..."
                        value={fDomain}
                        onChange={(e) => setFDomain(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none focus:border-brand-emerald"
                      />
                    </div>
                  ) : null}

                  <div className="space-y-1.5">
                    <label className="block font-bold">Spécialité de la formation :</label>
                    <select
                      value={isCustomSpecialty ? "autre" : fSpecialty}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "autre") {
                          setIsCustomSpecialty(true);
                          setFSpecialty("");
                        } else {
                          setIsCustomSpecialty(false);
                          setFSpecialty(val);
                        }
                      }}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none focus:border-brand-emerald"
                    >
                      {(() => {
                        const dObj = DOMAINS_INTERVENTION.find(d => d.title === fDomain);
                        const list = dObj ? dObj.subDomains : [];
                        return (
                          <>
                            {list.map((sub, sIdx) => (
                              <option key={sIdx} value={sub.title}>
                                {sub.title}
                              </option>
                            ))}
                            <option value="autre">Autre (Saisir manuellement)...</option>
                          </>
                        );
                      })()}
                    </select>
                  </div>

                  {isCustomSpecialty && (
                    <div className="space-y-1.5">
                      <label className="block font-bold text-brand-emerald">Saisir la spécialité personnalisée :</label>
                      <input
                        type="text"
                        required
                        placeholder="Saisissez la spécialité..."
                        value={fSpecialty}
                        onChange={(e) => setFSpecialty(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none focus:border-brand-emerald"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-bold">Niveau requis :</label>
                    <select
                      value={fLevel}
                      onChange={(e) => setFLevel(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-3 outline-none"
                    >
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                      <option value="Tous niveaux">Tous niveaux</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Modalité :</label>
                    <select
                      value={fModality}
                      onChange={(e) => setFModality(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-3 outline-none"
                    >
                      <option value="Présentiel">Présentiel</option>
                      <option value="En ligne">En ligne</option>
                      <option value="Hybride">Hybride</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Durée de la formation :</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: 6 semaines (120 heures)"
                      value={fDuration}
                      onChange={(e) => setFDuration(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-3 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Tarif / Prix de participation :</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: 450 000 FCFA"
                      value={fPrice}
                      onChange={(e) => setFPrice(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-3 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-bold">Photo de la formation :</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-950">
                      {fFeaturedImage ? (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                          <img src={fFeaturedImage} alt="Aperçu" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFFeaturedImage('')}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow"
                            title="Supprimer la photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-slate-200/50 dark:bg-slate-900 flex items-center justify-center shrink-0">
                          <Image className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                        <label className="inline-flex items-center space-x-2 px-3 py-1.5 bg-brand-emerald text-white text-[11px] font-bold rounded-lg cursor-pointer hover:bg-brand-emerald-dark transition-colors">
                          <span>Téléverser une photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-slate-400">Formats acceptés : PNG, JPG, WEBP. Taille conseillée &lt; 800 Ko.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-between">
                    <div>
                      <label className="block font-bold">Ou saisir l'URL de l'image descriptive :</label>
                      <input
                        type="url"
                        placeholder="Lien d'une image (ex: https://images.unsplash.com/...)"
                        value={fFeaturedImage && !fFeaturedImage.startsWith('data:') ? fFeaturedImage : ''}
                        onChange={(e) => setFFeaturedImage(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none"
                      />
                    </div>

                    <div className="flex items-center py-2">
                      <label className="flex items-center space-x-2 cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={fIsFeatured}
                          onChange={(e) => setFIsFeatured(e.target.checked)}
                          className="w-4 h-4 text-brand-emerald rounded"
                        />
                        <span>Mettre en avant sur la page d'accueil (Sélection Phare)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold">Brève description d'accroche (Rendu sur le catalogue) :</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Résumez l'objectif de ce cursus en 2-3 phrases accrocheuses..."
                    value={fShortDescription}
                    onChange={(e) => setFShortDescription(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-bold text-brand-emerald">Objectifs pédagogiques (Saisir UN objectif par ligne) :</label>
                    <textarea
                      rows={4}
                      placeholder="ex: Concevoir des bases de données relationnelles professionnelles.&#10;Maîtriser le langage DAX."
                      value={fObjectives}
                      onChange={(e) => setFObjectives(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none font-mono text-[11px]"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-brand-emerald font-bold">Résultats attendus (Saisir UN résultat par ligne) :</label>
                    <textarea
                      rows={4}
                      placeholder="ex: Autonomie totale pour concevoir des livrables BI.&#10;Obtention d'une double certification d'excellence."
                      value={fResultsExpected}
                      onChange={(e) => setFResultsExpected(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none font-mono text-[11px]"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-bold">Public Cible (Saisir UN public cible par ligne) :</label>
                    <textarea
                      rows={4}
                      placeholder="ex: Responsables Suivi-Evaluation&#10;Consultants et experts d'organisations internationales"
                      value={fTargetPublic}
                      onChange={(e) => setFTargetPublic(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none font-mono text-[11px]"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Prérequis académiques (Saisir UN prérequis par ligne) :</label>
                    <textarea
                      rows={4}
                      placeholder="ex: Maîtrise fondamentale de l'ordinateur portable.&#10;Connaissances de base d'Excel."
                      value={fPrerequisites}
                      onChange={(e) => setFPrerequisites(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none font-mono text-[11px]"
                    ></textarea>
                  </div>
                </div>

                {/* PROGRAMME DE LA FORMATION : MODULES (EN GRAS) ET POINTS D'APPRENTISSAGE */}
                <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border-2 border-brand-emerald/30 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <label className="block font-extrabold text-xs text-brand-emerald uppercase tracking-wider flex items-center">
                        <Layers className="w-4 h-4 mr-2" />
                        Programme : Modules (en gras) &amp; Détails des notions (non gras)
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Chaque intitulé de module apparaîtra en gras sur le menu PROGRAMME. Les points détaillés apparaîtront en texte normal sans gras.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFProgramModules(prev => [
                          ...prev,
                          {
                            module: `Module ${prev.length + 1} : Nouveau module d'apprentissage`,
                            details: ["Notion clé et cas pratique d'application", "Exercice dirigé et livrable opérationnel"]
                          }
                        ]);
                      }}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter un module</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {fProgramModules.map((mod, mIdx) => (
                      <div key={mIdx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 space-y-1">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-emerald">
                              Module #{mIdx + 1} (Intitulé affiché en gras) :
                            </span>
                            <input
                              type="text"
                              required
                              placeholder={`ex: Module ${mIdx + 1} : Cadrage stratégique et méthodologie`}
                              value={mod.module}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFProgramModules(prev => prev.map((m, i) => i === mIdx ? { ...m, module: val } : m));
                              }}
                              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 font-bold text-slate-900 dark:text-white text-xs outline-none focus:border-brand-emerald"
                            />
                          </div>
                          {fProgramModules.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setFProgramModules(prev => prev.filter((_, i) => i !== mIdx));
                              }}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer mt-5"
                              title="Supprimer ce module"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Points du module (un par ligne, affichés sans gras) :
                          </span>
                          <textarea
                            rows={3}
                            placeholder="Revue des concepts fondamentaux&#10;Études de cas réels sectoriels&#10;Exercices d'application pratique et validation"
                            value={mod.details.join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n');
                              setFProgramModules(prev => prev.map((m, i) => i === mIdx ? { ...m, details: lines } : m));
                            }}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-normal text-slate-800 dark:text-slate-200 outline-none font-mono"
                          ></textarea>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => { setShowFormationForm(false); setEditingFormation(null); }}
                    className="px-5 py-2.5 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Enregistrer la formation</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. BLOG POST / NEWS FORM MODAL */}
          {showBlogForm && (
            <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-brand-emerald" />
                  {editingBlogPost ? "Modifier la publication" : "Publier une nouvelle actualité sur le site"}
                </h3>
                <button
                  onClick={() => { setShowBlogForm(false); setEditingBlogPost(null); }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Fermer [X]
                </button>
              </div>

              <form onSubmit={handleSaveBlogPost} className="space-y-5 text-xs text-slate-700 dark:text-slate-350">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block font-bold">Titre de la publication :</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Lancement de la nouvelle cohorte d'analyse de données..."
                      value={bTitle}
                      onChange={(e) => setBTitle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Catégorie de l'article :</label>
                    <select
                      value={bCategory}
                      onChange={(e) => setBCategory(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none"
                    >
                      <option value="Formation">Formation / Cohorte</option>
                      <option value="Data">Analyse de Données</option>
                      <option value="Intelligence Artificielle">Intelligence Artificielle</option>
                      <option value="SIG">Systèmes d'Information Géographique</option>
                      <option value="QHSE">Sécurité &amp; Environnement QHSE</option>
                      <option value="Finance">Ingénierie Financière</option>
                      <option value="Gouvernance">Gouvernance Locale &amp; Aménagement</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-bold">Temps de lecture estimé :</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: 5 min de lecture"
                      value={bReadTime}
                      onChange={(e) => setBReadTime(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-3 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Tags / Mots-clés (séparés par des virgules) :</label>
                    <input
                      type="text"
                      placeholder="ex: KoboCollect, PowerBI, Python"
                      value={bTags}
                      onChange={(e) => setBTags(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-3 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 flex items-center pt-5">
                    <label className="flex items-center space-x-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={bIsFeatured}
                        onChange={(e) => setBIsFeatured(e.target.checked)}
                        className="w-4 h-4 text-brand-emerald rounded"
                      />
                      <span>Mettre en avant cet article (Tête d'affiche)</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t pt-4 border-slate-100 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <label className="block font-bold">Nom de l'auteur :</label>
                    <input
                      type="text"
                      required
                      value={bAuthorName}
                      onChange={(e) => setBAuthorName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-3 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Rôle / Titre de l'auteur :</label>
                    <input
                      type="text"
                      required
                      value={bAuthorRole}
                      onChange={(e) => setBAuthorRole(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-3 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">URL Photo Avatar Auteur :</label>
                    <input
                      type="url"
                      value={bAuthorAvatar}
                      onChange={(e) => setBAuthorAvatar(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-3 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold">URL de l'image de couverture de l'article :</label>
                  <input
                    type="url"
                    placeholder="Lien d'une image descriptive (ex: Unsplash)"
                    value={bImageUrl}
                    onChange={(e) => setBImageUrl(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold">Extrait d'accroche (S'affiche dans la carte liste) :</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Une courte introduction pour donner envie de lire..."
                    value={bExcerpt}
                    onChange={(e) => setBExcerpt(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-brand-emerald">Contenu de l'article (Markdown supporté - Utilisez deux retours à la ligne pour un paragraphe) :</label>
                  <textarea
                    required
                    rows={12}
                    placeholder="Rédigez l'actualité en détails...&#10;&#10;Utilisez ### Titre de Section pour ajouter des chapitres."
                    value={bContent}
                    onChange={(e) => setBContent(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none font-sans leading-relaxed"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => { setShowBlogForm(false); setEditingBlogPost(null); }}
                    className="px-5 py-2.5 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Publier l'actualité</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. PARTNER FORM MODAL */}
          {showPartnerForm && (
            <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-brand-emerald" />
                  {editingPartner ? "Modifier le partenaire" : "Ajouter un nouveau partenaire officiel"}
                </h3>
                <button
                  onClick={() => { setShowPartnerForm(false); setEditingPartner(null); }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Fermer [X]
                </button>
              </div>

              <form onSubmit={handleSavePartner} className="space-y-5 text-xs text-slate-700 dark:text-slate-350">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-bold">Nom de l'entreprise ou institution :</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Banque Mondiale, Ministère de l'Énergie..."
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Catégorie :</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none"
                    >
                      <option value="Institutionnel">Partenaire Institutionnel</option>
                      <option value="Multilatéral">Organisme Multilatéral</option>
                      <option value="Secteur Privé">Secteur Privé / Entreprise</option>
                      <option value="Cabinet Partenaire">Cabinet d'Expertise Partenaire</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">URL du logo (sur fond transparent de préférence) :</label>
                    <input
                      type="url"
                      placeholder="Lien vers l'image du logo"
                      value={pLogoUrl}
                      onChange={(e) => setPLogoUrl(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => { setShowPartnerForm(false); setEditingPartner(null); }}
                    className="px-5 py-2.5 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-bold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Enregistrer le partenaire</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. ACCOMPAGNEMENT FORM MODAL */}
          {showAccompagnementForm && (
            <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-emerald bg-brand-emerald/10 px-2.5 py-0.5 rounded-full">
                    Architecture d'Accompagnement en 7 Sections
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center mt-1">
                    <Briefcase className="w-4 h-4 mr-2 text-brand-emerald" />
                    {editingAccompagnement ? "Modifier l'accompagnement" : "Ajouter un nouveau pôle d'accompagnement & conseil"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowAccompagnementForm(false); setEditingAccompagnement(null); }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all"
                >
                  Fermer [X]
                </button>
              </div>

              <form onSubmit={handleSaveAccompagnement} className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
                
                {/* En-tête Général */}
                <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                  <div className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center">
                    <Layers className="w-4 h-4 mr-2 text-brand-emerald" />
                    Identification Générale du Pôle
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block font-bold">Titre du pôle d'accompagnement * :</label>
                      <input
                        type="text"
                        required
                        placeholder="ex: Ingénierie Géomatique, SIG & Télédétection"
                        value={accTitle}
                        onChange={(e) => setAccTitle(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-emerald text-slate-900 dark:text-white font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold">Icône représentative :</label>
                      <select
                        value={accIconName}
                        onChange={(e) => setAccIconName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none text-slate-900 dark:text-white font-medium"
                      >
                        <option value="Layers">Layers (Multi-couches / Système)</option>
                        <option value="MapPin">MapPin (SIG / Territoire / Géomatique)</option>
                        <option value="Database">Database (Données / Data Gouvernance)</option>
                        <option value="BarChart">BarChart (Finance / Décisionnel)</option>
                        <option value="ShieldCheck">ShieldCheck (QHSE / Sécurité / Audit)</option>
                        <option value="Cpu">Cpu (Informatique / Réseaux)</option>
                        <option value="Building">Building (Infrastructures / Collectivités)</option>
                        <option value="Compass">Compass (Stratégie / Aménagement)</option>
                        <option value="Target">Target (Performance & Objectifs)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Accroche synthétique (S'affiche sur les vignettes du catalogue) * :</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Cartographie haute précision, cadastre numérique et modélisation spatiale pour décideurs."
                      value={accShortDescription}
                      onChange={(e) => setAccShortDescription(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* LES 7 SECTIONS DEMANDÉES */}
                <div className="space-y-5">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center">
                    <span className="w-2.5 h-2.5 bg-brand-emerald rounded-full mr-2"></span>
                    Structure Opérationnelle des 7 Sections :
                  </div>

                  {/* 1. Présentation du service */}
                  <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                    <label className="block font-extrabold text-xs text-brand-emerald uppercase tracking-wider flex items-center">
                      <span className="w-5 h-5 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-mono mr-2 text-xs">1</span>
                      Présentation du service *
                    </label>
                    <p className="text-[11px] text-slate-500">Décrivez le service, les enjeux stratégiques, l'expertise mobilisée et le positionnement du cabinet.</p>
                    <textarea
                      required
                      rows={4}
                      placeholder="Ex: Notre accompagnement en Ingénierie Financière structure vos projets selon les standards bancaires de premier rang..."
                      value={accPresentationService || accDescription}
                      onChange={(e) => {
                        setAccPresentationService(e.target.value);
                        setAccDescription(e.target.value);
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white leading-relaxed font-sans"
                    ></textarea>
                  </div>

                  {/* 2. Objectifs opérationnels */}
                  <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                    <label className="block font-extrabold text-xs text-brand-emerald uppercase tracking-wider flex items-center">
                      <span className="w-5 h-5 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-mono mr-2 text-xs">2</span>
                      Objectifs opérationnels (1 par ligne)
                    </label>
                    <p className="text-[11px] text-slate-500">Listez les buts concrets mesurables visés par l'intervention.</p>
                    <textarea
                      rows={3}
                      placeholder="Réaliser un diagnostic de maturité et cartographier 100% des flux critiques&#10;Établir un modèle financier auditable selon les standards bancaires&#10;Déployer les outils de pilotage auprès des comités de direction"
                      value={accObjectives}
                      onChange={(e) => setAccObjectives(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none font-mono text-xs text-slate-900 dark:text-white"
                    ></textarea>
                  </div>

                  {/* 3. Démarche d’accompagnement */}
                  <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                    <label className="block font-extrabold text-xs text-brand-emerald uppercase tracking-wider flex items-center">
                      <span className="w-5 h-5 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-mono mr-2 text-xs">3</span>
                      Démarche d’accompagnement (1 étape / phase par ligne)
                    </label>
                    <p className="text-[11px] text-slate-500">Détaillez le cheminement méthodologique étape par étape (ex: Phase 1 : Cadrage, Phase 2 : Audit, etc.).</p>
                    <textarea
                      rows={3}
                      placeholder="Phase 1 : Cadrage stratégique et immersion auprès des parties prenantes&#10;Phase 2 : Analyse des données, cartographie technique et modélisation&#10;Phase 3 : Co-construction des livrables et sessions d'ateliers de restitution&#10;Phase 4 : Assistance au déploiement et transfert de compétences aux équipes"
                      value={accDemarche}
                      onChange={(e) => setAccDemarche(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none font-mono text-xs text-slate-900 dark:text-white"
                    ></textarea>
                  </div>

                  {/* 4. Résultats attendus */}
                  <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                    <label className="block font-extrabold text-xs text-brand-emerald uppercase tracking-wider flex items-center">
                      <span className="w-5 h-5 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-mono mr-2 text-xs">4</span>
                      Résultats attendus (1 par ligne)
                    </label>
                    <p className="text-[11px] text-slate-500">Livrables tangibles, documents remis ou transformations opérationnelles concrètes.</p>
                    <textarea
                      rows={3}
                      placeholder="Rapport complet de diagnostic et matrice de recommandations prioritaires&#10;Plateforme ou modèles opérationnels clé en main configurés&#10;Guides méthodologiques d'utilisation interne et fiches de poste harmonisées"
                      value={accResultatsAttendus}
                      onChange={(e) => setAccResultatsAttendus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none font-mono text-xs text-slate-900 dark:text-white"
                    ></textarea>
                  </div>

                  {/* 5. Impact pour l’entité */}
                  <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                    <label className="block font-extrabold text-xs text-brand-emerald uppercase tracking-wider flex items-center">
                      <span className="w-5 h-5 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-mono mr-2 text-xs">5</span>
                      Impact pour l’entité
                    </label>
                    <p className="text-[11px] text-slate-500">Gains de productivité, réduction des risques, retour sur investissement ou autonomie souveraine.</p>
                    <textarea
                      rows={2}
                      placeholder="Ex: L'organisation sécurise ses décisions de gouvernance, réduit de 40% ses délais de traitement et autonomise durablement ses cadres."
                      value={accImpactEntite}
                      onChange={(e) => setAccImpactEntite(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none text-slate-900 dark:text-white"
                    ></textarea>
                  </div>

                  {/* 6. Méthode d'évaluation */}
                  <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                    <label className="block font-extrabold text-xs text-brand-emerald uppercase tracking-wider flex items-center">
                      <span className="w-5 h-5 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-mono mr-2 text-xs">6</span>
                      Méthode d'évaluation (1 par ligne)
                    </label>
                    <p className="text-[11px] text-slate-500">Comment la qualité et le succès de l'accompagnement sont mesurés et audités.</p>
                    <textarea
                      rows={3}
                      placeholder="Revue d'étape bi-hebdomadaire avec le comité de pilotage&#10;Audit de conformité des livrables selon les grilles de validation interne&#10;Enquête de satisfaction des bénéficiaires et mesure des gains d'efficacité à J+60"
                      value={accMethodeEvaluation}
                      onChange={(e) => setAccMethodeEvaluation(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none font-mono text-xs text-slate-900 dark:text-white"
                    ></textarea>
                  </div>

                  {/* 7. Logiciels impliqués (Laisse moi la main d'insérer les icônes des logiciels) */}
                  <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/40 space-y-4 shadow-sm">
                    <div>
                      <label className="block font-extrabold text-xs text-brand-emerald uppercase tracking-wider flex items-center">
                        <span className="w-5 h-5 rounded-full bg-brand-emerald text-white flex items-center justify-center font-mono mr-2 text-xs shadow-xs">7</span>
                        Logiciels impliqués (Insertion libre d'icônes &amp; logos)
                      </label>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Vous avez la main totale pour insérer le nom du logiciel et son icône (via un lien direct URL ou en cliquant sur un modèle ci-dessous).
                      </p>
                    </div>

                    {/* Quick Presets Chips */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Modèles fréquents (cliquez pour ajouter instantanément) :
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        {PRESET_SOFTWARE_TOOLS.map((preset, pIdx) => {
                          const isAlreadyAdded = accSoftwareList.some(s => s.name.toLowerCase() === preset.name.toLowerCase());
                          return (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => {
                                if (!isAlreadyAdded) {
                                  setAccSoftwareList(prev => [...prev, { name: preset.name, iconUrl: preset.iconUrl, category: preset.category }]);
                                }
                              }}
                              disabled={isAlreadyAdded}
                              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                                isAlreadyAdded
                                  ? 'bg-slate-200/60 dark:bg-slate-800 text-slate-400 border-transparent cursor-not-allowed'
                                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-brand-emerald hover:text-brand-emerald cursor-pointer shadow-2xs'
                              }`}
                            >
                              <img src={preset.iconUrl} alt={preset.name} className="w-3.5 h-3.5 object-contain shrink-0" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                              <span>{preset.name}</span>
                              {!isAlreadyAdded && <Plus className="w-3 h-3 text-emerald-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Free Custom Software & Custom Icon Input */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="font-bold text-[11px] text-slate-800 dark:text-slate-200 flex items-center">
                        <Plus className="w-3.5 h-3.5 mr-1 text-brand-emerald" />
                        <span>Ajouter un logiciel personnalisé avec son icône :</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        <div className="sm:col-span-5 space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Nom du logiciel :</label>
                          <input
                            type="text"
                            placeholder="ex: ArcGIS Pro, Odoo, R Studio..."
                            value={newSoftwareName}
                            onChange={(e) => setNewSoftwareName(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none text-xs text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="sm:col-span-5 space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">URL de l'icône / logo (PNG, SVG, Web) :</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="url"
                              placeholder="https://... (lien de l'icône)"
                              value={newSoftwareIconUrl}
                              onChange={(e) => setNewSoftwareIconUrl(e.target.value)}
                              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none text-xs text-slate-900 dark:text-white font-mono"
                            />
                            {newSoftwareIconUrl && (
                              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1 flex items-center justify-center shrink-0">
                                <img src={newSoftwareIconUrl} alt="Aperçu" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (!newSoftwareName.trim()) return;
                              setAccSoftwareList(prev => [...prev, { name: newSoftwareName.trim(), iconUrl: newSoftwareIconUrl.trim() }]);
                              setNewSoftwareName('');
                              setNewSoftwareIconUrl('');
                            }}
                            className="w-full py-2 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-lg font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Ajouter</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Selected Softwares Badges List */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Logiciels enregistrés pour cet accompagnement ({accSoftwareList.length}) :
                      </span>
                      {accSoftwareList.length === 0 ? (
                        <div className="text-[11px] text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                          Aucun logiciel sélectionné. Utilisez les modèles ci-dessus ou insérez un logiciel avec son icône.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {accSoftwareList.map((sw, idx) => (
                            <div
                              key={idx}
                              className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs group"
                            >
                              {sw.iconUrl ? (
                                <img src={sw.iconUrl} alt={sw.name} className="w-4 h-4 object-contain shrink-0" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                              ) : (
                                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="text-slate-900 dark:text-white font-medium">{sw.name}</span>
                              <button
                                type="button"
                                onClick={() => setAccSoftwareList(prev => prev.filter((_, i) => i !== idx))}
                                className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                                title="Supprimer ce logiciel"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>

                {/* Sub-domaines & Exemples optionnels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <label className="block font-bold text-brand-emerald">Sous-domaines / Axes d'intervention spécifiques (1 par ligne) :</label>
                    <textarea
                      rows={4}
                      placeholder="Systèmes d'Information Géographique (SIG)&#10;Télédétection spatiale &amp; drone&#10;Cadastre numérique &amp; foncier&#10;Aménagement territorial"
                      value={accSubDomainsText}
                      onChange={(e) => setAccSubDomainsText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none font-mono text-xs text-slate-900 dark:text-white"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-brand-emerald">Exemples de missions réalisées (1 par ligne) :</label>
                    <textarea
                      rows={4}
                      placeholder="Délimitation et numérisation de 45 000 parcelles&#10;Déploiement du SIG d'un réseau de distribution d'eau&#10;Formation technique des cadres ministériels"
                      value={accExamplesText}
                      onChange={(e) => setAccExamplesText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none font-mono text-xs text-slate-900 dark:text-white"
                    ></textarea>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => { setShowAccompagnementForm(false); setEditingAccompagnement(null); }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md active:scale-98"
                  >
                    <Check className="w-4 h-4" />
                    <span>Enregistrer l'accompagnement (7 sections)</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 5. REALISATION FORM MODAL */}
          {showRealisationForm && (
            <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                  <Award className="w-4 h-4 mr-2 text-amber-500" />
                  {editingRealisation ? "Modifier la réalisation" : "Ajouter une nouvelle réalisation (Chantier / Projet)"}
                </h3>
                <button
                  onClick={() => { setShowRealisationForm(false); setEditingRealisation(null); }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  Fermer [X]
                </button>
              </div>

              <form onSubmit={handleSaveRealisation} className="space-y-5 text-xs text-slate-700 dark:text-slate-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block font-bold">Titre du chantier / Projet :</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Cartographie SIG & Délimitation Foncière de la Commune de Bonoua"
                      value={rTitle}
                      onChange={(e) => setRTitle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Domaine d'intervention :</label>
                    <select
                      value={rCategory}
                      onChange={(e) => setRCategory(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Ingénierie & SIG">Ingénierie &amp; SIG</option>
                      <option value="Formation Professionnelle">Formation Professionnelle</option>
                      <option value="Data & Intelligence Artificielle">Data &amp; Intelligence Artificielle</option>
                      <option value="Audit & Conseil QHSE">Audit &amp; Conseil QHSE</option>
                      <option value="Ingénierie Financière">Ingénierie Financière</option>
                      <option value="Gouvernance Locale">Gouvernance Locale</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-bold">Client / Maître d'ouvrage :</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Mairie de Bonoua / Ministère du Plan"
                      value={rClient}
                      onChange={(e) => setRClient(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Localisation :</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Sud Comoé, Côte d'Ivoire"
                      value={rLocation}
                      onChange={(e) => setRLocation(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Année de réalisation :</label>
                    <input
                      type="number"
                      required
                      value={rYear}
                      onChange={(e) => setRYear(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold">URL de l'image représentative :</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={rImageUrl}
                    onChange={(e) => setRImageUrl(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold">Description &amp; Portée opérationnelle :</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Présentez la mission, le contexte, les résultats concrets obtenus sur le terrain..."
                    value={rDescription}
                    onChange={(e) => setRDescription(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white leading-relaxed"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-bold text-amber-600 dark:text-amber-400">Défis &amp; Contraintes relevés (1 par ligne) :</label>
                    <textarea
                      rows={4}
                      placeholder="Topographie difficile et accès restreint&#10;Volume important de données parcellaires&#10;Délai impératif de livraison de 90 jours"
                      value={rChallengesText}
                      onChange={(e) => setRChallengesText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none font-mono text-xs text-slate-900 dark:text-white"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-emerald-600 dark:text-emerald-400">Solutions techniques &amp; Livrables (1 par ligne) :</label>
                    <textarea
                      rows={4}
                      placeholder="Survol photogrammétrique par drone haute précision&#10;Intégration sur géodatabase PostgreSQL/PostGIS&#10;Formation des agents municipaux à la mise à jour"
                      value={rSolutionsText}
                      onChange={(e) => setRSolutionsText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none font-mono text-xs text-slate-900 dark:text-white"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => { setShowRealisationForm(false); setEditingRealisation(null); }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Enregistrer la réalisation</span>
                  </button>
                </div>
              </form>
            </div>
          )}


          {/* Table / Lists Render Area depending on active tab */}
          <div className="overflow-x-auto">
            
            {/* TAB 0: PROSPECTS & EXCEL DOWNLOAD */}
            {activeTab === 'prospects' && (
              <div className="space-y-4">
                
                {/* Banner Header with Excel download CTA & filters */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-slate-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="font-display text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                          Fichier Central des Devis, Inscriptions &amp; Prospects (Excel)
                        </h3>
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full">
                          cabinetcicexf@gmail.com &amp; elearningciv@gmail.com
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                        Toutes les demandes de devis et inscriptions soumises sur le site sont enregistrées ici en direct pour le Cabinet. Vous pouvez contacter les demandeurs, mettre à jour leur statut et exporter la liste complète sous Excel (.xlsx) d'un simple clic.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => exportProspectsToExcel(filteredProspects)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Télécharger Fichier Excel ({filteredProspects.length})</span>
                      </button>

                      {prospects.length === 0 && (
                        <button
                          onClick={handleSeedSampleProspects}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-brand-emerald" />
                          <span>Générer 3 exemples de test</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Sub-Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 mt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-500">Filtrer par statut :</span>
                      <div className="flex items-center space-x-1">
                        {['all', 'Nouveau', 'Contacté', 'En cours', 'Inscrit', 'Archivé'].map((st) => (
                          <button
                            key={st}
                            onClick={() => setProspectFilterStatus(st)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                              prospectFilterStatus === st
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            {st === 'all' ? 'Tous' : st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:ml-auto">
                      <span className="font-bold text-slate-500">Type :</span>
                      <select
                        value={prospectFilterType}
                        onChange={(e) => setProspectFilterType(e.target.value)}
                        className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1 text-xs outline-none font-semibold text-slate-700 dark:text-slate-300"
                      >
                        <option value="all">Tous les types de formulaires</option>
                        <option value="Inscription Individuelle">Inscriptions Individuelles</option>
                        <option value="Demande Entreprise">Demandes Entreprises</option>
                        <option value="Candidature Formation">Candidatures Formations</option>
                        <option value="Contact / Renseignement">Messages &amp; Contact</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Prospects Table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-[850px] text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-400 border-b border-slate-100 dark:border-slate-850 font-bold">
                      <th className="p-4">Date &amp; Heure</th>
                      <th className="p-4">Statut Relance</th>
                      <th className="p-4">Prospect / Candidat</th>
                      <th className="p-4">Coordonnées</th>
                      <th className="p-4">Formation / Spécialité</th>
                      <th className="p-4">Canal</th>
                      <th className="p-4 text-center">Actions de Contact &amp; Fichier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {filteredProspects.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-400 font-medium space-y-2">
                          <FileSpreadsheet className="w-10 h-10 text-emerald-400 mx-auto" />
                          <p className="font-bold text-slate-600 dark:text-slate-300">Aucun prospect ne correspond aux critères de filtre.</p>
                          <p className="text-xs text-slate-400">
                            Dès qu'un visiteur soumet un formulaire sur le site, ses coordonnées apparaissent immédiatement ici et dans le fichier Excel.
                          </p>
                          {prospects.length === 0 && (
                            <button
                              onClick={handleSeedSampleProspects}
                              className="mt-3 px-4 py-2 bg-brand-emerald text-white rounded-xl font-bold text-xs hover:bg-brand-emerald-dark transition-all cursor-pointer shadow-sm"
                            >
                              Générer des exemples pour tester le téléchargement Excel
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredProspects.map((p) => {
                        const dateFormatted = p.createdAt instanceof Date 
                          ? p.createdAt.toLocaleString('fr-FR')
                          : (p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString('fr-FR') : 'Récent');

                        const whatsappNumber = (p.phone || '').replace(/[^0-9]/g, '');
                        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                          `Bonjour ${p.name},\n\nSuite à votre demande au sujet de : "${p.target}" auprès du Cabinet CICEXF, nous prenons contact avec vous pour finaliser vos modalités d'inscription.`
                        )}`;

                        const emailLink = `mailto:${p.email}?subject=${encodeURIComponent(
                          `Cabinet CICEXF - Suite à votre demande (${p.target})`
                        )}&body=${encodeURIComponent(
                          `Bonjour ${p.name},\n\nNous faisons suite à votre inscription sur notre plateforme concernant "${p.target}".\n\nBien cordialement,\nLe Secrétariat Technique du Cabinet CICEXF`
                        )}`;

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                            
                            {/* Date */}
                            <td className="p-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                              <div className="flex items-center space-x-1.5">
                                <Calendar className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                                <span>{dateFormatted}</span>
                              </div>
                            </td>

                            {/* Statut Dropdown */}
                            <td className="p-4 whitespace-nowrap">
                              <select
                                value={p.status || 'Nouveau'}
                                onChange={(e) => handleUpdateProspectStatus(p.id!, e.target.value as Prospect['status'])}
                                className={`text-xs font-black uppercase px-2.5 py-1 rounded-full outline-none border cursor-pointer ${
                                  p.status === 'Nouveau'
                                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300'
                                    : p.status === 'Contacté'
                                    ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border-sky-300'
                                    : p.status === 'En cours'
                                    ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300'
                                    : p.status === 'Inscrit'
                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200'
                                }`}
                              >
                                <option value="Nouveau">🟡 Nouveau</option>
                                <option value="Contacté">🔵 Contacté</option>
                                <option value="En cours">🟣 En cours</option>
                                <option value="Inscrit">🟢 Inscrit</option>
                                <option value="Archivé">⚪ Archivé</option>
                              </select>
                            </td>

                            {/* Nom & Entreprise */}
                            <td className="p-4 font-bold text-slate-900 dark:text-white">
                              <div>{p.name}</div>
                              {p.company && (
                                <div className="text-xs font-semibold text-slate-400 flex items-center space-x-1 mt-0.5">
                                  <span>🏢</span>
                                  <span>{p.company}</span>
                                </div>
                              )}
                              <span className="inline-block mt-1 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {p.type}
                              </span>
                            </td>

                            {/* Contact Details */}
                            <td className="p-4 space-y-1">
                              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                                <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                                <a href={`tel:${p.phone}`} className="hover:underline hover:text-brand-emerald">
                                  {p.phone}
                                </a>
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <a href={emailLink} className="hover:underline hover:text-brand-emerald truncate max-w-[180px]">
                                  {p.email}
                                </a>
                              </div>
                            </td>

                            {/* Formation / Sujet */}
                            <td className="p-4 max-w-[240px]">
                              <div className="font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
                                {p.target}
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-slate-500">
                                {p.session && <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">📅 {p.session}</span>}
                                {p.modality && <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">📍 {p.modality}</span>}
                              </div>
                            </td>

                            {/* Canal */}
                            <td className="p-4 whitespace-nowrap">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center space-x-1 ${
                                p.channel === 'WhatsApp' 
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                                  : p.channel === 'Email'
                                  ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400'
                                  : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400'
                              }`}>
                                <span>{p.channel === 'WhatsApp' ? '💬 WhatsApp' : p.channel === 'Email' ? '✉️ Email' : '🌐 En ligne'}</span>
                              </span>
                            </td>

                            {/* Actions rapides */}
                            <td className="p-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center space-x-1.5">
                                
                                {/* 1-Click WhatsApp Direct */}
                                <a
                                  href={whatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center shadow-xs"
                                  title="Contacter immédiatement sur WhatsApp"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>

                                {/* 1-Click Email Direct */}
                                <a
                                  href={emailLink}
                                  className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/30 text-sky-600 hover:bg-sky-600 hover:text-white transition-all flex items-center justify-center shadow-xs"
                                  title="Envoyer un email officiel"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </a>

                                {/* 1-Click Fiche Individuelle Excel */}
                                <button
                                  onClick={() => exportSingleProspectToExcel(p)}
                                  className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-700 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
                                  title="Télécharger la fiche individuelle sous format Excel (.xlsx)"
                                >
                                  <FileSpreadsheet className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete button */}
                                <button
                                  onClick={() => handleDeleteProspect(p.id!)}
                                  className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
                                  title="Supprimer la fiche"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            )}

            {/* TAB 1: VISITS LIST */}
            {activeTab === 'visits' && (
              <table className="w-full min-w-[750px] text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-400 border-b border-slate-100 dark:border-slate-850 font-bold">
                    <th className="p-4">Date &amp; Heure</th>
                    <th className="p-4">Utilisateur (Email)</th>
                    <th className="p-4">Page Consultée</th>
                    <th className="p-4">ID Visiteur</th>
                    <th className="p-4">Session</th>
                    <th className="p-4">Navigateur / UserAgent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredVisits.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                        Aucune visite enregistrée correspondant aux filtres de recherche.
                      </td>
                    </tr>
                  ) : (
                    filteredVisits.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="p-4 font-mono font-medium text-slate-500">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                            <span>{v.timestamp.toLocaleString('fr-FR')}</span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                          {v.email ? (
                            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald-light border border-brand-emerald/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                              {v.email}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">Visiteur Anonyme</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2.5 py-0.5 rounded-lg font-bold uppercase text-xs tracking-wider">
                            {v.page}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-400">{v.visitorId}</td>
                        <td className="p-4 font-mono text-xs text-slate-400">{v.sessionId}</td>
                        <td className="p-4 max-w-[200px] truncate text-slate-400 flex items-center space-x-1.5" title={v.userAgent}>
                          <Monitor className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{v.userAgent}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* TAB 2: SUBSCRIBERS LIST */}
            {activeTab === 'subscribers' && (
              <table className="w-full min-w-[750px] text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-400 border-b border-slate-100 dark:border-slate-850 font-bold">
                    <th className="p-4">Adresse Email</th>
                    <th className="p-4">ID Visiteur Unique</th>
                    <th className="p-4">Date d'Abonnement</th>
                    <th className="p-4">Dernière Visite</th>
                    <th className="p-4">Statut d'Abonnement</th>
                    <th className="p-4 text-center">Actions de Contrôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                        Aucun abonné enregistré correspondant.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{s.email}</td>
                        <td className="p-4 font-mono text-xs text-slate-400">{s.visitorId || 'Inconnu'}</td>
                        <td className="p-4 text-slate-500 font-medium">
                          {s.subscribedAt ? s.subscribedAt.toLocaleString('fr-FR') : 'Non renseigné'}
                        </td>
                        <td className="p-4 font-semibold text-slate-500">
                          {s.lastVisitAt ? s.lastVisitAt.toLocaleString('fr-FR') : 'Jamais revenu'}
                        </td>
                        <td className="p-4">
                          {s.isSubscribed !== false ? (
                            <span className="inline-flex items-center space-x-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-bold text-xs">
                              <span>Abonné</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full font-bold text-xs">
                              <span>Désabonné</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleSubscription(s.id, s.isSubscribed !== false)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              s.isSubscribed !== false 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 hover:text-slate-800' 
                                : 'bg-emerald-50 dark:bg-emerald-950/20 text-brand-emerald hover:bg-brand-emerald hover:text-white'
                            }`}
                          >
                            {s.isSubscribed !== false ? "Désabonner" : "Abonner"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* TAB 3: FORMATIONS CRUD TABLE */}
            {activeTab === 'formations' && (
              <table className="w-full min-w-[750px] text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-bold">
                    <th className="p-4">Aperçu</th>
                    <th className="p-4">Titre de la Formation</th>
                    <th className="p-4">Thème / Domaine</th>
                    <th className="p-4">Durée &amp; Prix</th>
                    <th className="p-4">Modalité &amp; Niveau</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredFormations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-500 dark:text-slate-400 font-semibold">
                        <Layers className="w-10 h-10 text-slate-400 mx-auto mb-2 animate-bounce" />
                        <span>Aucune formation trouvée.</span>
                        <p className="font-normal text-[11px] text-slate-400 mt-1">Cliquez sur "Nouvelle Formation" pour créer un programme en direct sur le site !</p>
                        <button
                          onClick={() => { resetFormationForm(); setEditingFormation(null); setShowFormationForm(true); }}
                          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all cursor-pointer shadow-sm"
                        >
                          + Ajouter une Formation
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredFormations.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 shrink-0">
                          <img
                            src={f.featuredImage}
                            alt={f.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-8 rounded object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
                          />
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white max-w-[200px] truncate" title={f.title}>
                          {f.title}
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 font-medium max-w-[150px] truncate" title={f.domain}>
                          {f.domain}
                        </td>
                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                          <div className="font-bold">{f.price}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">{f.duration}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-600 dark:text-slate-300">
                          <div>{f.modality}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">{f.level}</div>
                        </td>
                        <td className="p-4">
                          {f.isFeatured ? (
                            <span className="bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-300/60 px-2 py-0.5 rounded text-xs font-bold">
                              Phare
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">Standard</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditFormationClick(f)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all cursor-pointer"
                              title="Modifier la formation"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFormation(f.id)}
                              className="p-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Supprimer la formation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* TAB ACCOMPAGNEMENTS (DOMAINES D'INTERVENTION) */}
            {activeTab === 'accompagnements' && (
              <table className="w-full min-w-[750px] text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-bold">
                    <th className="p-4">Pôle / Domaine</th>
                    <th className="p-4">Mission Synthétique</th>
                    <th className="p-4">Axes Spécialisés</th>
                    <th className="p-4">Missions Types</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredAccompagnements.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-500 dark:text-slate-400 font-semibold">
                        <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2 animate-bounce" />
                        <span>Aucun accompagnement trouvé.</span>
                        <p className="font-normal text-[11px] text-slate-400 mt-1">Ajoutez vos pôles d'expertise et d'assistance technique pour les entreprises et collectivités.</p>
                        <button
                          onClick={() => { resetAccompagnementForm(); setEditingAccompagnement(null); setShowAccompagnementForm(true); }}
                          className="mt-3 px-4 py-2 bg-brand-emerald text-white rounded-xl font-bold text-xs hover:bg-brand-emerald-dark transition-all cursor-pointer shadow-sm"
                        >
                          + Nouvel Accompagnement
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredAccompagnements.map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white max-w-[220px]">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-brand-emerald flex items-center justify-center shrink-0">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <span className="truncate" title={acc.title}>{acc.title}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 font-medium max-w-[260px] truncate" title={acc.shortDescription}>
                          {acc.shortDescription}
                        </td>
                        <td className="p-4">
                          <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold text-xs">
                            {acc.subDomains?.length || 0} axes spécialisés
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                          {acc.examples?.length || 0} missions répertoriées
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditAccompagnementClick(acc)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-emerald rounded-lg transition-all cursor-pointer"
                              title="Modifier l'accompagnement"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAccompagnement(acc.id)}
                              className="p-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Supprimer l'accompagnement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* TAB REALISATIONS (PROJETS & CHANTIERS) */}
            {activeTab === 'realisations' && (
              <table className="w-full min-w-[750px] text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-bold">
                    <th className="p-4">Aperçu</th>
                    <th className="p-4">Titre du Projet / Chantier</th>
                    <th className="p-4">Client / Maître d'Ouvrage</th>
                    <th className="p-4">Domaine</th>
                    <th className="p-4">Année &amp; Lieu</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredRealisations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-500 dark:text-slate-400 font-semibold">
                        <Award className="w-10 h-10 text-slate-400 mx-auto mb-2 animate-bounce" />
                        <span>Aucune réalisation trouvée.</span>
                        <p className="font-normal text-[11px] text-slate-400 mt-1">Ajoutez vos chantiers, missions d'ingénierie et études réalisées par le CICEXF.</p>
                        <button
                          onClick={() => { resetRealisationForm(); setEditingRealisation(null); setShowRealisationForm(true); }}
                          className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-xl font-bold text-xs hover:bg-amber-700 transition-all cursor-pointer shadow-sm"
                        >
                          + Nouvelle Réalisation
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredRealisations.map((proj) => (
                      <tr key={proj.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 shrink-0">
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-8 rounded object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
                          />
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white max-w-[200px] truncate" title={proj.title}>
                          {proj.title}
                        </td>
                        <td className="p-4 text-slate-700 dark:text-slate-300 font-medium max-w-[150px] truncate" title={proj.client}>
                          {proj.client}
                        </td>
                        <td className="p-4">
                          <span className="bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800 px-2 py-0.5 rounded text-xs font-bold">
                            {proj.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                          <div>{proj.year}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{proj.location}</div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditRealisationClick(proj)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 rounded-lg transition-all cursor-pointer"
                              title="Modifier la réalisation"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRealisation(proj.id)}
                              className="p-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Supprimer la réalisation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* TAB 4: BLOG POSTS CRUD TABLE */}
            {activeTab === 'blog_posts' && (
              <table className="w-full min-w-[750px] text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-400 border-b border-slate-100 dark:border-slate-850 font-bold">
                    <th className="p-4">Aperçu</th>
                    <th className="p-4">Titre de l'Actualité</th>
                    <th className="p-4">Catégorie</th>
                    <th className="p-4">Auteur</th>
                    <th className="p-4">Date de Publication</th>
                    <th className="p-4">Mise en avant</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredBlogPosts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400 font-semibold">
                        <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2 animate-bounce" />
                        <span>Aucune actualité personnalisée enregistrée dans Firestore.</span>
                        <p className="font-normal text-[11px] text-slate-400 mt-1">Cliquez sur "Nouvelle Actualité" pour lancer un recrutement de formation !</p>
                      </td>
                    </tr>
                  ) : (
                    filteredBlogPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="p-4 shrink-0">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-8 rounded object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
                          />
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white max-w-[200px] truncate" title={post.title}>
                          {post.title}
                        </td>
                        <td className="p-4 text-slate-500 font-medium">
                          <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/40 px-2 py-0.5 rounded text-xs font-bold">
                            {post.category}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-500">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{post.author?.name || 'Inconnu'}</div>
                          <div className="text-xs text-slate-400">{post.author?.role}</div>
                        </td>
                        <td className="p-4 text-slate-500 font-mono font-medium">{post.date}</td>
                        <td className="p-4">
                          {post.isFeatured ? (
                            <span className="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/40 px-2 py-0.5 rounded text-xs font-bold">
                              Une
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">Normal</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditBlogPostClick(post)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-blue rounded-lg transition-all cursor-pointer"
                              title="Modifier"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlogPost(post.id)}
                              className="p-1.5 bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* TAB 5: PARTNERS CRUD TABLE */}
            {activeTab === 'partners' && (
              <table className="w-full min-w-[650px] text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-400 border-b border-slate-100 dark:border-slate-850 font-bold">
                    <th className="p-4">Logo</th>
                    <th className="p-4">Nom de l'Institution</th>
                    <th className="p-4">Catégorie</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredPartners.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-400 font-semibold">
                        <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2 animate-bounce" />
                        <span>Aucun partenaire personnalisé enregistré dans Firestore.</span>
                        <p className="font-normal text-[11px] text-slate-400 mt-1">Ajoutez vos nouveaux logos d'organismes de confiance ici !</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPartners.map((part) => (
                      <tr key={part.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="p-4 shrink-0 bg-slate-100/50 dark:bg-slate-950/20">
                          <img
                            src={part.logoUrl}
                            alt={part.name}
                            referrerPolicy="no-referrer"
                            className="h-8 object-contain max-w-[100px] border border-slate-200 dark:border-slate-850 rounded p-1"
                          />
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {part.name}
                        </td>
                        <td className="p-4 text-slate-500 font-bold font-sans">
                          {part.category || 'Partenaire Institutionnel'}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditPartnerClick(part)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-blue rounded-lg transition-all cursor-pointer"
                              title="Modifier"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePartner(part.id)}
                              className="p-1.5 bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
