import React, { useState } from 'react';
import { Search, BookOpen, Clock, FileText, CheckCircle, ArrowRight, CornerDownRight, X, Mail, Download, Sparkles, HelpCircle } from 'lucide-react';
import { BLOG_POSTS } from '../data';
import { BlogPost, Formation } from '../types';
import FormationDetail from './FormationDetail';
import { ViewCatalogueButton } from './CatalogueActions';
import ArticleContent from './ArticleContent';
import CatalogueActions from './CatalogueActions';
import { useCatalogueMeta } from '../lib/catalogue';

interface NewsProps {
  blogPosts?: BlogPost[];
  formations?: Formation[];
}

export default function News({ blogPosts = BLOG_POSTS, formations = [] }: NewsProps) {
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const { meta: catalogueMeta } = useCatalogueMeta();

  // Announcement of a formation (created with it in the admin: id "p-f-<formation id>", or same title)
  const linkedFormation = selectedArticle
    ? formations.find(f => selectedArticle.id === `p-f-${f.id}`)
      || formations.find(f => f.title.trim().toLowerCase() === selectedArticle.title.trim().toLowerCase())
    : undefined;

  // Listen to select-article event from the ticker
  React.useEffect(() => {
    const handleSelectArticleEvent = (e: any) => {
      const postId = e.detail?.postId;
      if (postId) {
        const found = blogPosts.find(p => p.id === postId || p.slug === postId);
        if (found) {
          setSelectedArticle(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('select-article', handleSelectArticleEvent);
    return () => window.removeEventListener('select-article', handleSelectArticleEvent);
  }, [blogPosts]);

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
    <div id="news-view" className="py-6 bg-slate-50 dark:bg-slate-950 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ------------------ VIEW 1: FULL EXPANDED ARTICLE VIEW ------------------ */}
        {selectedArticle ? (
          linkedFormation ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleCloseArticle}
                className="inline-flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-brand-emerald dark:text-slate-400 transition-colors cursor-pointer"
              >
                <span>← Retour aux actualités</span>
              </button>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Actualité · {selectedArticle.date}</span>
            </div>
            <FormationDetail
              formation={linkedFormation}
              extraActions={<ViewCatalogueButton />}
            />
          </div>
          ) : (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Back button */}
            <button
              onClick={handleCloseArticle}
              id="btn-back-to-blog"
              className="inline-flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-brand-emerald dark:text-slate-400 transition-colors cursor-pointer"
            >
              <span>← Retour aux actualités</span>
            </button>

            {/* Article header */}
            <header className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-10">
              <span className="inline-block rounded-full bg-brand-emerald/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-emerald dark:text-orange-300">
                {selectedArticle.category}
              </span>
              <h1 className="mt-4 max-w-4xl font-display text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {selectedArticle.title}
              </h1>
              {selectedArticle.excerpt && !/(.)\1{7,}/i.test(selectedArticle.excerpt.replace(/\s/g, '')) && (
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">{selectedArticle.excerpt}</p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5 text-sm dark:border-slate-800">
                <span className="flex items-center gap-3">
                  <img
                    src={selectedArticle.author.avatarUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-emerald/40"
                  />
                  <span>
                    <span className="block font-bold text-slate-900 dark:text-white">{selectedArticle.author.name}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{selectedArticle.author.role}</span>
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400"><Clock className="w-4 h-4" /> {selectedArticle.date} · {selectedArticle.readTime}</span>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              {/* Main column */}
              <div className="min-w-0 space-y-8">
                {selectedArticle.imageUrl && (
                  <div className="aspect-video overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                    <img
                      src={selectedArticle.imageUrl}
                      alt={selectedArticle.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}

                <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-10">
                  <ArticleContent content={selectedArticle.content} />
                </article>

            {/* Optional Lead capture for the article's downloadable guide */}
            {selectedArticle.guidePdfUrl && (
              <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-md relative overflow-hidden">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                  <div className="md:col-span-7 space-y-4">
                    <div className="inline-flex items-center space-x-1 bg-brand-emerald/15 text-brand-emerald px-2.5 py-1 rounded text-xs font-bold">
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
                        <p className="text-slate-400 font-sans text-xs">Un email contenant le lien de téléchargement vient d'être envoyé.</p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => {
                        setRequestedGuide("Guide Pratique de collecte de données KoboCollect");
                        handleDownloadLead(e);
                      }} className="pro-form space-y-3 font-sans">
                        <input
                          id="lead-article-name"
                          type="text"
                          required
                          placeholder="Votre nom complet"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 outline-none focus:border-brand-emerald text-white placeholder-slate-400"
                        />
                        <input
                          id="lead-article-email"
                          type="email"
                          required
                          placeholder="votre.email@institution.com"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 outline-none focus:border-brand-emerald text-white placeholder-slate-400"
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

            <div className="flex justify-start">
              <button
                onClick={handleCloseArticle}
                className="text-sm font-bold text-slate-600 hover:text-brand-emerald dark:text-slate-400 transition-colors cursor-pointer"
              >
                ← Retour à la liste des articles
              </button>
            </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">En bref</h2>
                  <dl className="mt-3 space-y-2.5 text-sm">
                    <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Rubrique</dt><dd className="text-right font-semibold text-slate-900 dark:text-white">{selectedArticle.category}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Publié le</dt><dd className="text-right font-semibold text-slate-900 dark:text-white">{selectedArticle.date}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Lecture</dt><dd className="text-right font-semibold text-slate-900 dark:text-white">{selectedArticle.readTime}</dd></div>
                  </dl>
                  {selectedArticle.tags?.filter(t => t && t !== selectedArticle.category).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                      {selectedArticle.tags.filter(t => t && t !== selectedArticle.category).map(t => (
                        <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                {catalogueMeta && (
                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                      <FileText className="w-5 h-5 text-red-700 dark:text-red-300" /> Catalogue des formations
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Programmes, durées et tarifs (PDF)</p>
                    <div className="mt-4"><CatalogueActions meta={catalogueMeta} compact /></div>
                  </div>
                )}

                <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <p className="font-display text-base font-bold text-slate-900 dark:text-white">Une question sur cette annonce ?</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">ADILINE, notre assistante virtuelle, vous répond immédiatement.</p>
                  <button
                    onClick={() => window.dispatchEvent(new Event('cicexf:open-adiline'))}
                    className="mt-4 w-full rounded-xl bg-brand-emerald px-4 py-3 text-sm font-bold text-white hover:bg-brand-emerald-dark cursor-pointer"
                  >
                    Discuter avec ADILINE
                  </button>
                </div>
              </aside>
            </div>
          </div>
          )
        ) : (
          /* ------------------ VIEW 2: FILTERABLE LIST & SEARCH ------------------ */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search and Category Filtering Tools */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              {/* text search input bar */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 flex items-center max-w-md mx-auto">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  id="blog-search-bar"
                  type="text"
                  placeholder="Rechercher des articles, des auteurs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>

              {/* category horizontal scrolling pills list */}
              <div className="flex flex-wrap gap-2 justify-center pt-1">
                {categoriesList.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      activeCategory === category
                        ? 'bg-brand-emerald text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Article Grid layout */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPosts.map(post => (
                  <article
                    key={post.id}
                    id={`blog-card-${post.id}`}
                    onClick={() => handleOpenArticle(post)}
                    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col h-full cursor-pointer group"
                  >
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain bg-white dark:bg-slate-800 group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-brand-emerald text-white text-[11px] font-bold px-2.5 py-1 rounded">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow space-y-2.5">
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        <span>{post.date} • {post.readTime}</span>
                      </div>
                      
                      <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-blue dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans line-clamp-3 flex-grow font-normal">
                        {post.excerpt}
                      </p>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] font-bold">
                        <span className="text-brand-blue dark:text-brand-emerald-light group-hover:underline">Lire l'article entier →</span>
                        {post.guidePdfUrl && (
                          <span className="text-slate-600 dark:text-slate-300 flex items-center text-xs"><Download className="w-3.5 h-3.5 mr-1" /> PDF inclus</span>
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
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
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
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden max-w-4xl mx-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                <div className="md:col-span-12 w-full max-w-md mx-auto bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-[11px] text-slate-300 uppercase tracking-wider mb-4 text-center">Formulaire d'enregistrement :</h4>
                  
                  {leadSuccess && !requestedGuide ? (
                    <div className="text-[11px] text-brand-emerald space-y-1 py-4 text-center">
                      <CheckCircle className="w-8 h-8 mx-auto text-brand-emerald mb-2" />
                      <span className="block font-bold">Inscription Enregistrée !</span>
                      <p className="text-slate-400 font-sans text-xs">Vous recevrez notre prochain bulletin d'analyse sous peu.</p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => {
                      setRequestedGuide(null);
                      handleDownloadLead(e);
                    }} className="pro-form space-y-3 font-sans">
                      <input
                        id="generic-lead-name"
                        type="text"
                        required
                        placeholder="Votre nom complet"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 outline-none focus:border-brand-emerald text-white placeholder-slate-400"
                      />
                      <input
                        id="generic-lead-email"
                        type="email"
                        required
                        placeholder="votre.email@institution.com"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 outline-none focus:border-brand-emerald text-white placeholder-slate-400"
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
