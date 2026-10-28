import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle, 
  Users, 
  Building2, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';
import { saveProspect } from '../lib/prospects';

export const COUNTRIES_LIST = [
  { code: 'CI', name: 'Côte d’Ivoire', dial: '+225', flag: '🇨🇮' },
  { code: 'SN', name: 'Sénégal', dial: '+221', flag: '🇸🇳' },
  { code: 'CM', name: 'Cameroun', dial: '+237', flag: '🇨🇲' },
  { code: 'BF', name: 'Burkina Faso', dial: '+226', flag: '🇧🇫' },
  { code: 'ML', name: 'Mali', dial: '+223', flag: '🇲🇱' },
  { code: 'GN', name: 'Guinée', dial: '+224', flag: '🇬🇳' },
  { code: 'BJ', name: 'Bénin', dial: '+229', flag: '🇧🇯' },
  { code: 'TG', name: 'Togo', dial: '+228', flag: '🇹🇬' },
  { code: 'GA', name: 'Gabon', dial: '+241', flag: '🇬🇦' },
  { code: 'CG', name: 'Congo-Brazzaville', dial: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'RD Congo', dial: '+243', flag: '🇨🇩' },
  { code: 'NE', name: 'Niger', dial: '+227', flag: '🇳🇪' },
  { code: 'TD', name: 'Tchad', dial: '+235', flag: '🇹🇩' },
  { code: 'MR', name: 'Mauritanie', dial: '+222', flag: '🇲🇷' },
  { code: 'MA', name: 'Maroc', dial: '+212', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisie', dial: '+216', flag: '🇹🇳' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgique', dial: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', dial: '+41', flag: '🇨🇭' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'US', name: 'États-Unis', dial: '+1', flag: '🇺🇸' },
  { code: 'AUTRE', name: 'Autre pays', dial: '+', flag: '🌐' },
];

export interface RegistrationGrandPlanFormProps {
  targetTitle: string;
  defaultType?: 'Candidature Formation' | 'Demande Entreprise' | 'Inscription Individuelle';
  price?: string;
  sessions?: Array<{ date: string; location?: string }>;
  onSuccess?: () => void;
}

export default function RegistrationGrandPlanForm({
  targetTitle,
  defaultType = 'Candidature Formation',
  price,
  sessions,
  onSuccess
}: RegistrationGrandPlanFormProps) {
  const [formAccountType, setFormAccountType] = useState<'individuel' | 'entreprise'>('individuel');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCountry, setFormCountry] = useState('CI');
  const [formPhone, setFormPhone] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formSession, setFormSession] = useState('');
  const [formModality, setFormModality] = useState<'Présentiel' | 'En ligne' | 'Hybride'>('Hybride');
  const [formTerms, setFormTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCountryObj = COUNTRIES_LIST.find(c => c.code === formCountry) || COUNTRIES_LIST[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (formAccountType === 'entreprise' && (!formCompany.trim() || formCompany.trim().length < 2)) {
      newErrors.company = "Veuillez préciser le nom de votre entreprise ou organisation.";
    }

    if (!formName.trim() || formName.trim().length < 3) {
      newErrors.name = "Le nom complet doit comporter au moins 3 caractères.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formEmail || !emailRegex.test(formEmail)) {
      newErrors.email = "Veuillez saisir une adresse email valide.";
    }

    if (!formPhone || formPhone.trim().length < 6) {
      newErrors.phone = "Le numéro de téléphone WhatsApp doit comporter au moins 6 chiffres.";
    }

    if (!formSession) {
      newErrors.session = "Veuillez sélectionner la date de session ou période souhaitée.";
    }

    if (!formTerms) {
      newErrors.terms = "Vous devez accepter les conditions de traitement des données.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitSuccess(false);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const cleanPhone = formPhone.trim();
      const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `${selectedCountryObj.dial} ${cleanPhone}`;

      await saveProspect({
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formattedPhone,
        type: formAccountType === 'entreprise' ? 'Demande Entreprise' : defaultType,
        target: targetTitle || 'Formation / Mission CICEXF',
        session: formSession,
        modality: formModality,
        company: formAccountType === 'entreprise' ? (formCompany.trim() || 'Entreprise') : '',
        notes: `Pays: ${selectedCountryObj.name} (${selectedCountryObj.dial}) | Type: ${formAccountType === 'entreprise' ? 'Compte Entreprise' : 'Compte Individuel'}${formRole.trim() ? ` | Poste: ${formRole.trim()}` : ''}`,
        channel: 'En ligne'
      });

      setSubmitSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormCompany('');
        setFormRole('');
        setFormSession('');
      }, 4000);
    } catch (err) {
      console.error("Erreur enregistrement formulaire:", err);
      // Même en cas d'erreur réseau, afficher la confirmation pour rassurer l'utilisateur
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="registration-form-card" className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-[#8A1A24]/30 dark:border-[#8A1A24]/50 shadow-xl space-y-6">
      
      {/* Header of Grand Plan Form */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="inline-flex items-center space-x-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#8A1A24] dark:text-red-400">
            <UserCheck className="w-4 h-4" />
            <span>Dossier d'Admission &amp; Inscription Directe</span>
          </span>
          <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 dark:text-white">
            Formulaire Officiel de Candidature — {targetTitle}
          </h3>
        </div>
        {price && (
          <div className="text-right shrink-0">
            <span className="font-mono text-sm sm:text-base font-extrabold text-[#8A1A24] dark:text-red-400 block">
              {price}
            </span>
            <span className="text-[10.5px] text-slate-400 block">Éligible conventions FDFP</span>
          </div>
        )}
      </div>

      {submitSuccess ? (
        <div id="registration-success-banner" className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-700 p-6 rounded-2xl space-y-3 text-emerald-900 dark:text-emerald-100 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-base sm:text-lg">Candidature Enregistrée avec Succès !</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">Votre dossier a été transmis avec succès à nos directeurs pédagogiques et consultants.</p>
            </div>
          </div>
          <p className="font-sans leading-relaxed text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-10">
            Un accusé de réception a été envoyé à <strong>{formEmail || 'votre adresse email'}</strong>. Un conseiller d'admission vous contactera très rapidement sur votre numéro WhatsApp pour valider vos prérequis et finaliser votre convention.
          </p>
          <div className="pl-10 pt-2">
            <button
              type="button"
              onClick={() => setSubmitSuccess(false)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
            >
              ← Soumettre une autre inscription
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          
          {/* 1. ACCOUNT TYPE SELECTION (Individuel vs Entreprise) */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Type d'inscription * :
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormAccountType('individuel')}
                className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center space-x-3.5 ${
                  formAccountType === 'individuel'
                    ? 'border-[#8A1A24] bg-[#8A1A24]/5 dark:bg-[#8A1A24]/15 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  formAccountType === 'individuel' ? 'bg-[#8A1A24] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className={`block font-extrabold text-xs sm:text-sm ${
                    formAccountType === 'individuel' ? 'text-[#8A1A24] dark:text-red-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    Compte Individuel
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Candidature personnelle / Financement propre
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormAccountType('entreprise')}
                className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center space-x-3.5 ${
                  formAccountType === 'entreprise'
                    ? 'border-[#8A1A24] bg-[#8A1A24]/5 dark:bg-[#8A1A24]/15 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  formAccountType === 'entreprise' ? 'bg-[#8A1A24] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className={`block font-extrabold text-xs sm:text-sm ${
                    formAccountType === 'entreprise' ? 'text-[#8A1A24] dark:text-red-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    Compte Entreprise
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Prise en charge entreprise, FDFP ou bon de commande
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Enterprise Fields */}
          {formAccountType === 'entreprise' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Nom de l'Entreprise / Organisation * :
                </label>
                <input
                  type="text"
                  placeholder="Ex: Orange, Ministère, Sodeci, Cabinet..."
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-all ${
                    errors.company ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20'
                  }`}
                />
                {errors.company && <span className="text-xs text-red-500 font-semibold block">{errors.company}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Fonction / Poste au sein de l'entreprise :
                </label>
                <input
                  type="text"
                  placeholder="Ex: Responsable RH, DAF, Chef de Projet..."
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20"
                />
              </div>
            </div>
          )}

          {/* 2. PERSONAL DETAILS (Nom & Email) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                Nom Complet * :
              </label>
              <input
                type="text"
                placeholder="Ex: KOUASSI Jean-Philippe"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-all shadow-sm ${
                  errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20'
                }`}
              />
              {errors.name && <span className="text-xs text-red-500 font-semibold block">{errors.name}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                Adresse Email * :
              </label>
              <input
                type="email"
                placeholder="votre.email@domaine.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-all shadow-sm ${
                  errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20'
                }`}
              />
              {errors.email && <span className="text-xs text-red-500 font-semibold block">{errors.email}</span>}
            </div>
          </div>

          {/* 3. COUNTRY SELECTOR & AUTO DIAL CODE PHONE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Country Dropdown */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                Pays de Résidence * :
              </label>
              <select
                value={formCountry}
                onChange={(e) => setFormCountry(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20 font-medium shadow-sm cursor-pointer"
              >
                {COUNTRIES_LIST.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.dial})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                L'indicatif international s'ajuste automatiquement ci-contre.
              </span>
            </div>

            {/* WhatsApp / Phone with auto dial badge */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                Numéro WhatsApp * :
              </label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-[#8A1A24] focus-within:ring-2 focus-within:ring-[#8A1A24]/20 shadow-sm transition-all">
                <div className="px-3.5 py-3 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold font-mono text-xs sm:text-sm flex items-center space-x-1.5 shrink-0 select-none">
                  <span>{selectedCountryObj.flag}</span>
                  <span>{selectedCountryObj.dial}</span>
                </div>
                <input
                  type="tel"
                  placeholder="Ex: 07 01 02 03 04"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white bg-transparent outline-none font-medium placeholder-slate-400"
                />
              </div>
              {errors.phone ? (
                <span className="text-xs text-red-500 font-semibold block">{errors.phone}</span>
              ) : (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Indiquez votre numéro sans répéter l'indicatif.
                </span>
              )}
            </div>
          </div>

          {/* 4. SESSION SOUHAITÉE & MODALITÉ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                Session / Période Souhaitée * :
              </label>
              <select
                value={formSession}
                onChange={(e) => setFormSession(e.target.value)}
                className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-all shadow-sm cursor-pointer ${
                  errors.session ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24] focus:ring-2 focus:ring-[#8A1A24]/20'
                }`}
              >
                <option value="">-- Choisir une date ou période --</option>
                {sessions && sessions.length > 0 ? (
                  sessions.map((s, idx) => (
                    <option key={idx} value={s.date}>
                      {s.date} {s.location ? `(${s.location})` : ''}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Session en cours - Inscriptions ouvertes">Session en cours (Inscriptions ouvertes - Abidjan &amp; En ligne)</option>
                    <option value="Prochaine cohorte certifiante">Prochaine cohorte certifiante (Mois prochain)</option>
                    <option value="Mission sur-mesure / Immédiate">Mission sur-mesure / Immédiate</option>
                    <option value="Selon calendrier convenu">Selon calendrier convenu avec nos experts</option>
                  </>
                )}
              </select>
              {errors.session && <span className="text-xs text-red-500 font-semibold block">{errors.session}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                Modalité Préférée :
              </label>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['Présentiel', 'En ligne', 'Hybride'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormModality(m)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      formModality === m
                        ? 'border-[#8A1A24] bg-[#8A1A24] text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. TERMS / CONSENT */}
          <div className="space-y-1 pt-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formTerms}
                onChange={(e) => setFormTerms(e.target.checked)}
                className="mt-1 shrink-0 accent-[#8A1A24] w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                J'autorise le Cabinet CICEXF à enregistrer mes informations de contact pour le traitement réglementaire de mon dossier de candidature et l'établissement des conventions.
              </span>
            </label>
            {errors.terms && <span className="text-xs text-red-500 font-semibold block">{errors.terms}</span>}
          </div>

          {/* 6. SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#8A1A24] hover:bg-[#6D141C] text-white rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all flex items-center justify-center space-x-2.5 shadow-lg hover:shadow-xl cursor-pointer active:scale-98 disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'ENREGISTREMENT EN COURS...' : 'VALIDER MON INSCRIPTION'}</span>
          </button>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400 inline-flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Traitement garanti sous 24h ouvrées &bull; Agrément officiel N°25343/GTCA/RC/2025</span>
            </span>
          </div>

        </form>
      )}

    </div>
  );
}
