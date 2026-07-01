import React, { useState } from 'react';
import { ShieldCheck, UploadCloud, FileText, CheckCircle, Mail, Globe, Users, Briefcase, PlusCircle, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { PARTNERS } from '../data';

export default function Partners() {
  const [partnerType, setPartnerType] = useState<'consultant' | 'institution'>('consultant');
  
  // Consultant Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [domain, setDomain] = useState('Data');
  const [motivation, setMotivation] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Login portal states
  const [portalCode, setPortalCode] = useState('');
  const [portalError, setPortalError] = useState('');
  const [portalSuccess, setPortalSuccess] = useState(false);

  // Form errors / success
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setCvFile(file);
      setCvFileName(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCvFile(file);
      setCvFileName(file.name);
    }
  };

  const handleSubmitConsultant = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "Le nom complet doit comporter au moins 3 caractères.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Veuillez saisir une adresse email valide.";
    }

    if (!linkedin || !linkedin.includes('linkedin.com')) {
      newErrors.linkedin = "Le lien LinkedIn doit commencer par linkedin.com/in/.";
    }

    if (!cvFileName) {
      newErrors.cv = "Veuillez téléverser votre Curriculum Vitae (PDF, DOCX).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
    } else {
      setErrors({});
      setSuccess(true);
      
      // Clear fields
      setTimeout(() => {
        setName('');
        setEmail('');
        setLinkedin('');
        setMotivation('');
        setCvFile(null);
        setCvFileName('');
      }, 5000);
    }
  };

  const handlePortalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (portalCode === 'CICEXF-2026') {
      setPortalSuccess(true);
      setPortalError('');
    } else {
      setPortalError("Code d'accès incorrect ou expiré. Contactez l'administrateur.");
      setPortalSuccess(false);
    }
  };

  return (
    <div id="partners-view" className="py-16 bg-slate-50 dark:bg-slate-950 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title banner */}
        <div className="mb-12">
          <nav className="flex text-xs font-semibold text-slate-400 mb-2">
            <span>CICEXF</span>
            <span className="mx-2">/</span>
            <span className="text-brand-emerald">Espace Partenaires</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Écosystème &amp; Espace Partenaires
          </h1>
          <div className="w-16 h-1.5 bg-brand-emerald mt-4 rounded-full"></div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 max-w-2xl font-semibold uppercase tracking-widest">
            Rejoignez notre réseau de formateurs certifiés ou accédez à notre portail institutionnel
          </p>
        </div>

        {/* 1. Global Trust Partners display grid */}
        <section id="our-partners" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-8 shadow-sm mb-16">
          <div className="mb-8 border-b pb-4 border-slate-100 dark:border-slate-800">
            <h3 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
              Ils Nous Font Confiance à l'International
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Les institutions multilatérales, ministères publics et groupes privés qui collaborent avec le CICEXF.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center text-center">
            {PARTNERS.map(part => (
              <div key={part.id} className="group flex flex-col items-center space-y-3 p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
                <img
                  src={part.logoUrl}
                  alt={part.name}
                  referrerPolicy="no-referrer"
                  className="h-10 object-contain filter grayscale group-hover:grayscale-0 transition-all dark:invert dark:opacity-80"
                />
                <div>
                  <span className="block font-bold text-[11px] text-slate-850 dark:text-slate-200">{part.name}</span>
                  <span className="block text-[9px] text-slate-400 font-semibold">{part.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Grid: Application Form (Left) + Protected Portal (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Consultant Partner Application Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-8 shadow-md">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Candidature : Rejoindre le Réseau d'Experts CICEXF
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Vous êtes consultant international senior, auditeur agréé, ou chercheur ? Déposez votre dossier pour intégrer notre vivier d'intervenants.
              </p>
            </div>

            {success ? (
              <div id="partner-success-banner" className="bg-emerald-50 dark:bg-emerald-950/20 border border-brand-emerald/30 p-6 rounded-2xl text-xs space-y-3 text-brand-emerald-dark dark:text-brand-emerald-light">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle className="w-5 h-5 text-brand-emerald" />
                  <span className="font-bold">Dossier Académique Enregistré !</span>
                </div>
                <p className="font-sans leading-relaxed text-[11px] text-slate-700 dark:text-slate-300">
                  Merci <strong>{name}</strong>. Votre dossier de candidature a été validé et envoyé au comité scientifique du pôle <strong>{domain}</strong>. Vous recevrez un accusé de réception formel à l'adresse <strong>{email}</strong> sous un délai de 48h.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-[10px] font-bold text-brand-blue hover:underline block pt-2"
                >
                  Déposer une autre candidature
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitConsultant} className="space-y-4 font-sans text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-600 dark:text-slate-350">Nom complet :</label>
                    <input
                      id="partner-input-name"
                      type="text"
                      required
                      placeholder="Dr. / Pr. / M. Nom Prénom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-lg px-3 py-2 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-brand-emerald'}`}
                    />
                    {errors.name && (
                      <span className="text-[10px] text-red-500 flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-600 dark:text-slate-350">Adresse email :</label>
                    <input
                      id="partner-input-email"
                      type="email"
                      required
                      placeholder="votre.nom@cabinet.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-lg px-3 py-2 outline-none ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-brand-emerald'}`}
                    />
                    {errors.email && (
                      <span className="text-[10px] text-red-500 flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* LinkedIn URL */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-600 dark:text-slate-350">Lien LinkedIn Professionnel :</label>
                    <input
                      id="partner-input-linkedin"
                      type="text"
                      required
                      placeholder="https://linkedin.com/in/votre-nom"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-lg px-3 py-2 outline-none ${errors.linkedin ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-brand-emerald'}`}
                    />
                    {errors.linkedin && (
                      <span className="text-[10px] text-red-500 flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.linkedin}
                      </span>
                    )}
                  </div>

                  {/* Domain of Expertise selection */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-600 dark:text-slate-350">Domaine principal d'expertise :</label>
                    <select
                      id="partner-input-domain"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
                    >
                      <option value="Data">Data Analytics &amp; Business Intelligence</option>
                      <option value="QHSE">Sécurité QHSE &amp; Environnement</option>
                      <option value="Finance">Ingénierie Financière &amp; Fiscalité</option>
                      <option value="SIG">SIG &amp; Aménagement Territorial</option>
                      <option value="Management">Management de projets &amp; Stratégie</option>
                    </select>
                  </div>
                </div>

                {/* CV file attachment drag and drop upload field */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-600 dark:text-slate-350">Curriculum Vitae (Format PDF, DOCX - Max 5MB) :</label>
                  
                  <div
                    id="cv-drag-and-drop"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                      isDragging
                        ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald'
                        : cvFileName
                        ? 'border-brand-emerald/40 bg-emerald-50/20 dark:bg-emerald-950/10 text-brand-emerald'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <UploadCloud className="w-10 h-10 text-slate-400" />
                    {cvFileName ? (
                      <div className="space-y-1">
                        <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs">Fichier Sélectionné :</span>
                        <span className="block text-slate-500 font-mono text-[11px]">{cvFileName}</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-700 dark:text-slate-300 font-bold">Glissez-déposez votre CV ici, ou cliquez pour parcourir</p>
                        <p className="text-[10px] text-slate-400 mt-1">Accepte les fichiers PDF, Word (.docx) ou compressés</p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="partner-file-cv"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="partner-file-cv" className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 cursor-pointer">
                      Sélectionner
                    </label>
                  </div>
                  {errors.cv && (
                    <span className="text-[10px] text-red-500 flex items-center mt-1">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      {errors.cv}
                    </span>
                  )}
                </div>

                {/* Motivation textarea */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-600 dark:text-slate-350">Présentation synthétique (Expertises clés, certifications) :</label>
                  <textarea
                    id="partner-input-motivation"
                    rows={4}
                    placeholder="Résumez brièvement votre parcours, vos certifications (ex: PMP, ITIL, Lead Implementer ISO) et vos disponibilités..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none focus:border-brand-emerald"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="partner-submit-btn"
                  className="w-full py-3.5 bg-brand-emerald text-white hover:bg-brand-emerald-dark font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Soumettre ma candidature d'expert associé</span>
                </button>

              </form>
            )}

          </div>

          {/* Right: Protected Partnership Area / Portal (Portail Privé) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Login Portal Card */}
            <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-8 shadow-lg space-y-6">
              
              <div className="border-b border-slate-800 pb-3">
                <div className="inline-flex items-center space-x-2 bg-brand-blue/20 text-brand-blue dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold mb-3 uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-brand-emerald" />
                  <span>Portail B2B/B2G Sécurisé</span>
                </div>
                <h3 className="font-display text-base font-bold text-white">
                  Espace Partenaires Privé
                </h3>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                  Réservé aux consultants accrédités du CICEXF et aux administrateurs de nos clients institutionnels.
                </p>
              </div>

              {portalSuccess ? (
                <div id="portal-logged-in-banner" className="bg-slate-950 border border-brand-emerald/20 p-5 rounded-2xl text-xs space-y-3">
                  <div className="flex items-center space-x-2 text-brand-emerald">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold">Accès autorisé avec succès</span>
                  </div>
                  <p className="font-sans leading-relaxed text-[10.5px] text-slate-400 font-light">
                    Bienvenue dans votre espace d'échange sécurisé CICEXF. Vous êtes authentifié comme consultant partenaire externe.
                  </p>
                  
                  {/* Private download files resources list */}
                  <div className="pt-3 border-t border-slate-900 space-y-2 text-[10.5px]">
                    <span className="block font-bold text-slate-300 uppercase tracking-wider text-[9px]">Documents et livrables d'ingénierie :</span>
                    <a href="#" className="flex items-center text-brand-emerald hover:underline font-mono">
                      <FileText className="w-4 h-4 mr-2" /> Template_Rapport_Mission_CICEXF.docx
                    </a>
                    <a href="#" className="flex items-center text-brand-emerald hover:underline font-mono">
                      <FileText className="w-4 h-4 mr-2" /> Charte_Graphique_CICEXF_2026.pdf
                    </a>
                    <a href="#" className="flex items-center text-brand-emerald hover:underline font-mono">
                      <FileText className="w-4 h-4 mr-2" /> Guide_Remunerations_Formateurs.pdf
                    </a>
                  </div>
                  
                  <button
                    onClick={() => {
                      setPortalSuccess(false);
                      setPortalCode('');
                    }}
                    className="text-[10px] font-bold text-red-500 hover:underline pt-3 block"
                  >
                    Se déconnecter de l'Espace Sécurisé
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePortalSubmit} className="space-y-4 font-sans text-xs">
                  
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-300">Code d'accès sécurisé :</label>
                    <input
                      id="portal-access-code-input"
                      type="password"
                      placeholder="Saisir le code d'accès de mission"
                      value={portalCode}
                      onChange={(e) => setPortalCode(e.target.value)}
                      className={`w-full bg-slate-950 border rounded-lg px-3 py-2 outline-none text-white placeholder-slate-600 ${portalError ? 'border-red-500' : 'border-slate-800 focus:border-brand-emerald'}`}
                    />
                    {portalError && (
                      <span className="text-[10px] text-red-500 flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {portalError}
                      </span>
                    )}
                    <span className="block text-[9px] text-slate-500 leading-normal font-light">
                      Astuce démo : Utilisez le code d'évaluation <strong>CICEXF-2026</strong> pour déverrouiller l'espace privé.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Se connecter au Coffre Fort Privé</span>
                  </button>

                </form>
              )}

            </div>

            {/* Corporate Security Guidelines */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-8 shadow-sm space-y-4">
              <h4 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
                Qualité ISO 9001:2015 &amp; Accompagnement
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Tous nos consultants partenaires externes s'engagent à respecter de manière stricte la <strong>Charte de Confidentialité et d'Éthique CICEXF</strong>. Nos processus pédagogiques font l'objet d'un audit annuel garantissant un taux de satisfaction apprenant de 98% sur l'ensemble de nos sessions d'Abidjan.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-xs font-bold text-brand-blue dark:text-brand-emerald-light">
                <ShieldCheck className="w-5 h-5 text-brand-emerald" />
                <span>Certification en cours de validation</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
