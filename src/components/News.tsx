import React, { useState } from 'react';
import { Search, BookOpen, Clock, FileText, CheckCircle, ArrowRight, CornerDownRight, X, Mail, Download, Sparkles, HelpCircle } from 'lucide-react';
import { BLOG_POSTS } from '../data';
import { BlogPost } from '../types';

interface NewsProps {
  blogPosts?: BlogPost[];
}

export default function News({ blogPosts = BLOG_POSTS }: NewsProps) {
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');

  // Lead capture state
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [requestedGuide, setRequestedGuide] = useState<string | null>(null);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const categoriesList = [
    'Tous',
    'Formation',
    'Data',
    'Intelligence Artificielle',
    'SIG',
    'QHSE',
    'Finance',
    'Gouvernance',
    'Développement Territorial'
  ];

  const handleOpenArticle = (post: BlogPost) => {
    setSelectedArticle(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadName.trim() && leadEmail.trim()) {
      setLeadSuccess(true);
      setTimeout(() => {
        // Trigger simulated file download
        const fileUrl = "#";
        const alertMsg = `Génération et envoi du guide pratique : "${requestedGuide}" à l'adresse ${leadEmail}. Merci pour votre téléchargement !`;
        alert(alertMsg);
        
        // Reset state
        setLeadName('');
        setLeadEmail('');
        setLeadSuccess(false);
        setRequestedGuide(null);
      }, 2000);
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check main category or tags
    const matchesCategory = activeCategory === 'Tous' || 
                            post.category === activeCategory ||
                            post.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="news-view" className="py-16 bg-slate-50 dark:bg-slate-950 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ------------------ VIEW 1: FULL EXPANDED ARTICLE VIEW ------------------ */}
        {selectedArticle ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
            {/* Back button */}
            <button
              onClick={handleCloseArticle}
              id="btn-back-to-blog"
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-brand-emerald transition-colors"
            >
              <span>← Retourner aux actualités</span>
            </button>

            {/* Article cover */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-brand-emerald text-white text-[10px] font-bold px-3 py-1 rounded">
                {selectedArticle.category}
              </div>
            </div>

            {/* Metadata & Title */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400">{selectedArticle.date} • {selectedArticle.readTime}</span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                {selectedArticle.title}
              </h1>
              
              {/* Author display */}
              <div className="flex items-center space-x-3.5 pt-2 border-b border-slate-150 dark:border-slate-800 pb-4">
                <img
                  src={selectedArticle.author.avatarUrl}
                  alt={selectedArticle.author.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border-2 border-brand-emerald"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-950 dark:text-white">{selectedArticle.author.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{selectedArticle.author.role}</p>
                </div>
              </div>
            </div>

            {/* Rich Article text content block */}
            <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-normal space-y-6">
              {/* Process standard paragraphs split by newlines */}
              {selectedArticle.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('###')) {
                  return <h3 key={idx} className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-4">{paragraph.replace('###', '').trim()}</h3>;
                }
                return <p key={idx}>{paragraph}</p>;
              })}
            </div>

            {/* Optional Lead capture for the article's downloadable guide */}
            {selectedArticle.guidePdfUrl && (
              <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-emerald/10 rounded-full blur-2xl"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                  <div className="md:col-span-7 space-y-4">
                    <div className="inline-flex items-center space-x-1 bg-brand-emerald/15 text-brand-emerald px-2.5 py-1 rounded text-[10px] font-bold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ressource téléchargeable gratuite</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-white">
                      Télécharger le Guide de transition de données vers KoboCollect (PDF)
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-light">
                      Un document technique complet de 15 pages conçu par nos consultants pour réussir l'informatisation de votre collecte sans erreurs.
                    </p>
                  </div>

                  <div className="md:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                    <h4 className="font-bold text-[11px] text-slate-300 uppercase tracking-wider mb-3">Recevoir le document :</h4>
                    
                    {leadSuccess ? (
                      <div className="text-[11px] text-brand-emerald space-y-1 py-4 text-center">
                        <CheckCircle className="w-8 h-8 mx-auto text-brand-emerald mb-2" />
                        <span className="block font-bold">Lien généré !</span>
                        <p className="text-slate-400 font-sans text-[10px]">Un email contenant le lien de téléchargement vient d'être envoyé.</p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => {
                        setRequestedGuide("Guide Pratique de collecte de données KoboCollect");
                        handleDownloadLead(e);
                      }} className="space-y-3 font-sans text-[11px]">
                        <input
                          id="lead-article-name"
                          type="text"
                          required
                          placeholder="Votre nom complet"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 outline-none focus:border-brand-emerald text-white placeholder-slate-500"
                        />
                        <input
                          id="lead-article-email"
                          type="email"
                          required
                          placeholder="votre.email@institution.com"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 outline-none focus:border-brand-emerald text-white placeholder-slate-500"
                        />
                        <button
                          type="submit"
                          className="w-full py-2 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold rounded text-xs transition-colors"
                        >
                          Télécharger le guide gratuit
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Back button at footer */}
            <div className="pt-8 border-t border-slate-150 dark:border-slate-800 flex justify-start">
              <button
                onClick={handleCloseArticle}
                className="text-xs font-bold text-slate-500 hover:text-brand-emerald transition-colors"
              >
                ← Retourner à la liste des articles
              </button>
            </div>
          </div>
        ) : (
          /* ------------------ VIEW 2: FILTERABLE LIST & SEARCH ------------------ */
          <div className="space-y-12 animate-in fade-in duration-200">
            
            {/* Header Title block */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Actualités &amp; Publications Institutionnelles
              </h1>
              <div className="w-16 h-1.5 bg-brand-emerald mx-auto mt-4 rounded-full"></div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest leading-relaxed">
                Analyses stratégiques, avis d'experts, actualités des formations et guides téléchargeables
              </p>
            </div>

            {/* Search and Category Filtering Tools */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
              {/* text search input bar */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 flex items-center max-w-md mx-auto">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  id="blog-search-bar"
                  type="text"
                  placeholder="Rechercher des articles, des auteurs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
                />
              </div>

              {/* category horizontal scrolling pills list */}
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {categoriesList.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      activeCategory === category
                        ? 'bg-brand-emerald text-white'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Article Grid layout */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <article
                    key={post.id}
                    id={`blog-card-${post.id}`}
                    onClick={() => handleOpenArticle(post)}
                    className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col h-full cursor-pointer group"
                  >
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-brand-emerald text-white text-[9px] font-bold px-2.5 py-1 rounded">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow space-y-3">
                      <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500">
                        <span>{post.date} • {post.readTime}</span>
                      </div>
                      
                      <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-blue dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-sans line-clamp-3 flex-grow font-light">
                        {post.excerpt}
                      </p>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] font-bold">
                        <span className="text-brand-blue dark:text-brand-emerald-light group-hover:underline">Lire l'article entier →</span>
                        {post.guidePdfUrl && (
                          <span className="text-slate-400 flex items-center text-[10px]"><Download className="w-3.5 h-3.5 mr-1" /> PDF inclus</span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/50 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-display text-base font-bold text-slate-800 dark:text-slate-200">Aucun article trouvé</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Aucune publication ne correspond à vos mots-clés ou filtres de catégorie actuels.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('Tous');
                  }}
                  className="px-5 py-2 bg-brand-emerald text-white text-xs font-bold rounded-xl"
                >
                  Afficher tous les articles
                </button>
              </div>
            )}

            {/* Newsletter & generic lead capture block */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-lg relative overflow-hidden max-w-4xl mx-auto">
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-brand-blue/10 rounded-full blur-2xl"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                <div className="md:col-span-7 space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center space-x-1 bg-amber-400/10 text-amber-400 px-2.5 py-1 rounded text-[10px] font-bold">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Alerte Prochaines Sessions</span>
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white">
                    Recevoir les Calendriers &amp; Guides trimestriels
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-light">
                    Rejoignez plus de 1 500 professionnels abonnés et recevez directement dans votre boîte de messagerie nos guides thématiques sur le QHSE, les SIG, et le management stratégique.
                  </p>
                </div>

                <div className="md:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-[11px] text-slate-300 uppercase tracking-wider mb-4 text-center">Formulaire d'enregistrement :</h4>
                  
                  {leadSuccess && !requestedGuide ? (
                    <div className="text-[11px] text-brand-emerald space-y-1 py-4 text-center">
                      <CheckCircle className="w-8 h-8 mx-auto text-brand-emerald mb-2" />
                      <span className="block font-bold">Inscription Enregistrée !</span>
                      <p className="text-slate-400 font-sans text-[10px]">Vous recevrez notre prochain bulletin d'analyse sous peu.</p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => {
                      setRequestedGuide(null);
                      handleDownloadLead(e);
                    }} className="space-y-3 font-sans text-[11px]">
                      <input
                        id="generic-lead-name"
                        type="text"
                        required
                        placeholder="Votre nom complet"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 outline-none focus:border-brand-emerald text-white placeholder-slate-500"
                      />
                      <input
                        id="generic-lead-email"
                        type="email"
                        required
                        placeholder="votre.email@institution.com"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 outline-none focus:border-brand-emerald text-white placeholder-slate-500"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold rounded text-xs uppercase tracking-wider transition-colors"
                      >
                        S'abonner gratuitement
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
