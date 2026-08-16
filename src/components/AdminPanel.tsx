import React, { useState, useEffect } from 'react';
import { 
  auth, db 
} from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
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
  addDoc
} from 'firebase/firestore';
import { 
  Lock, Mail, Key, LogOut, Users, Eye, CheckCircle2, 
  AlertCircle, Search, RefreshCw, Calendar, Monitor, Download, ArrowLeftRight,
  Plus, Trash2, Edit3, Image, BookOpen, Layers, ExternalLink, Sparkles, Check, HelpCircle, MapPin, Tag, FileText
} from 'lucide-react';
import { DOMAINS_INTERVENTION } from '../data';

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

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [email, setEmail] = useState('elearningciv@gmail.com');
  const [password, setPassword] = useState('');
  const [isNewAdminRegistration, setIsNewAdminRegistration] = useState(false);

  // Dashboard Data State
  const [visits, setVisits] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [dbFormations, setDbFormations] = useState<any[]>([]);
  const [dbBlogPosts, setDbBlogPosts] = useState<any[]>([]);
  const [dbPartners, setDbPartners] = useState<any[]>([]);

  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'visits' | 'subscribers' | 'formations' | 'blog_posts' | 'partners'>('visits');
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

  // Track Auth state changes
  useEffect(() => {
    loadDashboardData();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'elearningciv@gmail.com') {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Fetch all collections from Firestore
  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
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

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== 'elearningciv@gmail.com') {
      setAuthError("Accès Refusé. Seul l'administrateur de ce site (elearningciv@gmail.com) peut accéder à cet espace.");
      setLoading(false);
      return;
    }

    try {
      if (isNewAdminRegistration) {
        await createUserWithEmailAndPassword(auth, cleanEmail, password);
      } else {
        try {
          await signInWithEmailAndPassword(auth, cleanEmail, password);
        } catch (signInErr: any) {
          if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
            try {
              await createUserWithEmailAndPassword(auth, cleanEmail, password);
            } catch (signUpErr: any) {
              if (signUpErr.code === 'auth/email-already-in-use') {
                setAuthError("Mot de passe incorrect. Veuillez réessayer.");
              } else if (signUpErr.code === 'auth/weak-password') {
                setAuthError("Le mot de passe doit contenir au moins 6 caractères.");
              } else {
                setAuthError(signUpErr.message || "Erreur d'authentification.");
              }
            }
          } else {
            setAuthError(signInErr.message || "Erreur d'authentification.");
          }
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError("Ce compte administrateur a déjà été initialisé. Veuillez simplement vous connecter via l'onglet 'Se Connecter'.");
        setIsNewAdminRegistration(false);
      } else if (err.code === 'auth/weak-password') {
        setAuthError("Le mot de passe doit contenir au moins 6 caractères.");
      } else {
        setAuthError(err.message || "Une erreur est survenue lors de l'authentification.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error(err);
    }
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
      const slug = fTitle.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      const formId = editingFormation?.id || `f-${Date.now()}`;
      
      const payload = {
        id: formId,
        slug,
        title: fTitle,
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
        createdAt: editingFormation?.createdAt || Timestamp.now()
      };

      await setDoc(doc(db, 'formations', formId), payload);

      // If adding a new formation, automatically create a corresponding blog post (actualité)
      if (!editingFormation) {
        const blogPostId = `p-f-${formId}`;
        const blogSlug = `formation-${slug}`;
        const blogTitle = `Nouvelle Formation d'Excellence : ${fTitle}`;
        const blogExcerpt = `Découvrez notre tout nouveau programme de formation d'excellence : "${fTitle}". Thématique : ${fDomain}. Spécialité : ${fSpecialty || 'Générale'}. ${fShortDescription.substring(0, 150)}...`;
        
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
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) return;
    try {
      await deleteDoc(doc(db, 'formations', id));
      setDbFormations(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'formations');
    }
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
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article d'actualité ?")) return;
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
      setDbBlogPosts(prev => prev.filter(item => item.id !== id));
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
      await deleteDoc(doc(db, 'partners', id));
      setDbPartners(prev => prev.filter(item => item.id !== id));
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
  const filteredVisits = visits.filter(v => 
    (v.email && v.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    v.visitorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.page.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFormations = dbFormations.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlogPosts = dbBlogPosts.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPartners = dbPartners.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If loading security check (bypassed but keeping loading screen state safe)
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

  return (
    <div id="admin-view" className="py-12 bg-slate-50 dark:bg-slate-950 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2.5 text-xs text-brand-emerald font-bold uppercase tracking-widest mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Console d'Administration Publique &amp; Libre</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Espace de Publication &amp; de Gestion
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ajoutez, modifiez ou organisez en direct les formations, actualités et partenaires du site CICEXF.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
              <span>Actualiser les données</span>
            </button>
          </div>
        </div>

        {/* Analytical Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 text-xs font-sans">
          
          {/* Card 1: Unique Visitors */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-brand-blue flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-brand-blue dark:text-brand-emerald-light" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visites totales</span>
              <span className="block text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{visits.length}</span>
            </div>
          </div>

          {/* Card 2: Active Subscribers */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-800 text-brand-emerald flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Abonnés actifs</span>
              <span className="block text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                {subscribers.filter(s => s.isSubscribed !== false).length}
              </span>
            </div>
          </div>

          {/* Card 3: Dynamic Formations */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-slate-800 text-orange-500 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Formations live</span>
              <span className="block text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{dbFormations.length}</span>
            </div>
          </div>

          {/* Card 4: Actualités */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-500 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actualités live</span>
              <span className="block text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{dbBlogPosts.length}</span>
            </div>
          </div>

          {/* Card 5: Partenaires */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Partenaires live</span>
              <span className="block text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{dbPartners.length}</span>
            </div>
          </div>

        </div>

        {/* Content Management Tab Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden mb-12">
          
          <div className="p-6 border-b border-slate-100 dark:border-slate-850 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            
            {/* Tabs Selector Trigger List */}
            <div className="flex flex-wrap bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl gap-1">
              <button
                onClick={() => { setActiveTab('visits'); setSearchQuery(''); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'visits' 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Journal des Visites
              </button>
              <button
                onClick={() => { setActiveTab('subscribers'); setSearchQuery(''); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'subscribers' 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Abonnés Newsletter
              </button>
              <button
                onClick={() => { setActiveTab('formations'); setSearchQuery(''); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'formations' 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Gérer les Formations
              </button>
              <button
                onClick={() => { setActiveTab('blog_posts'); setSearchQuery(''); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'blog_posts' 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Gérer les Actualités
              </button>
              <button
                onClick={() => { setActiveTab('partners'); setSearchQuery(''); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'partners' 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Gérer les Partenaires
              </button>
            </div>

            {/* Right Side Search Bar & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par mot-clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-brand-emerald w-full sm:w-64"
                />
              </div>

              {(activeTab === 'visits' || activeTab === 'subscribers') && (
                <button
                  onClick={() => exportToCSV(activeTab as 'visits' | 'subscribers')}
                  className="bg-brand-blue hover:bg-brand-blue-light text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter CSV</span>
                </button>
              )}

              {activeTab === 'formations' && (
                <button
                  onClick={() => { resetFormationForm(); setEditingFormation(null); setShowFormationForm(true); }}
                  className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Formation</span>
                </button>
              )}

              {activeTab === 'blog_posts' && (
                <button
                  onClick={() => { resetBlogForm(); setEditingBlogPost(null); setShowBlogForm(true); }}
                  className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Actualité</span>
                </button>
              )}

              {activeTab === 'partners' && (
                <button
                  onClick={() => { setEditingPartner(null); setPName(''); setPLogoUrl(''); setPCategory('Cabinet Partenaire'); setShowPartnerForm(true); }}
                  className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Partenaire</span>
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
                        <p className="text-[10px] text-slate-400">Formats acceptés : PNG, JPG, WEBP. Taille conseillée &lt; 800 Ko.</p>
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


          {/* Table / Lists Render Area depending on active tab */}
          <div className="overflow-x-auto">
            
            {/* TAB 1: VISITS LIST */}
            {activeTab === 'visits' && (
              <table className="w-full text-left border-collapse text-xs font-sans">
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
                            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald-light border border-brand-emerald/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              {v.email}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">Visiteur Anonyme</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2.5 py-0.5 rounded-lg font-bold uppercase text-[10px] tracking-wider">
                            {v.page}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[10px] text-slate-400">{v.visitorId}</td>
                        <td className="p-4 font-mono text-[10px] text-slate-400">{v.sessionId}</td>
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
              <table className="w-full text-left border-collapse text-xs font-sans">
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
                        <td className="p-4 font-mono text-[10px] text-slate-400">{s.visitorId || 'Inconnu'}</td>
                        <td className="p-4 text-slate-500 font-medium">
                          {s.subscribedAt ? s.subscribedAt.toLocaleString('fr-FR') : 'Non renseigné'}
                        </td>
                        <td className="p-4 font-semibold text-slate-500">
                          {s.lastVisitAt ? s.lastVisitAt.toLocaleString('fr-FR') : 'Jamais revenu'}
                        </td>
                        <td className="p-4">
                          {s.isSubscribed !== false ? (
                            <span className="inline-flex items-center space-x-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                              <span>Abonné</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                              <span>Désabonné</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleSubscription(s.id, s.isSubscribed !== false)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
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
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-400 border-b border-slate-100 dark:border-slate-850 font-bold">
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
                      <td colSpan={7} className="p-12 text-center text-slate-400 font-semibold">
                        <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2 animate-bounce" />
                        <span>Aucune formation personnalisée enregistrée dans Firestore.</span>
                        <p className="font-normal text-[11px] text-slate-400 mt-1">Cliquez sur "Nouvelle Formation" pour en ajouter une en direct sur le site !</p>
                      </td>
                    </tr>
                  ) : (
                    filteredFormations.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
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
                        <td className="p-4 text-slate-500 font-medium max-w-[150px] truncate" title={f.domain}>
                          {f.domain}
                        </td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-350">
                          <div className="font-bold">{f.price}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{f.duration}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-500">
                          <div>{f.modality}</div>
                          <div className="text-[10px] text-slate-400 font-bold">{f.level}</div>
                        </td>
                        <td className="p-4">
                          {f.isFeatured ? (
                            <span className="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/40 px-2 py-0.5 rounded text-[10px] font-bold">
                              Phare
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Standard</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditFormationClick(f)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-blue rounded-lg transition-all cursor-pointer"
                              title="Modifier"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFormation(f.id)}
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

            {/* TAB 4: BLOG POSTS CRUD TABLE */}
            {activeTab === 'blog_posts' && (
              <table className="w-full text-left border-collapse text-xs font-sans">
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
                          <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/40 px-2 py-0.5 rounded text-[10px] font-bold">
                            {post.category}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-500">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{post.author?.name || 'Inconnu'}</div>
                          <div className="text-[10px] text-slate-400">{post.author?.role}</div>
                        </td>
                        <td className="p-4 text-slate-500 font-mono font-medium">{post.date}</td>
                        <td className="p-4">
                          {post.isFeatured ? (
                            <span className="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/40 px-2 py-0.5 rounded text-[10px] font-bold">
                              Une
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Normal</span>
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
              <table className="w-full text-left border-collapse text-xs font-sans">
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
