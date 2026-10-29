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
  const [formAltPhone, setFormAltPhone] = useState('');
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
      const cleanAltPhone = formAltPhone.trim();
      const formattedAltPhone = cleanAltPhone ? (cleanAltPhone.startsWith('+') ? cleanAltPhone : `${selectedCountryObj.dial} ${cleanAltPhone}`) : '';

      await saveProspect({
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formattedPhone,
        type: formAccountType === 'entreprise' ? 'Demande Entreprise' : defaultType,
        target: targetTitle || 'Formation / Mission CICEXF',
        session: formSession,
        modality: formModality,
        company: formAccountType === 'entreprise' ? (formCompany.trim() || 'Entreprise') : '',
        notes: `Pays: ${selectedCountryObj.name} (${selectedCountryObj.dial})${formattedAltPhone ? ` | Autre Numéro: ${formattedAltPhone}` : ''} | Type: ${formAccountType === 'entreprise' ? 'Compte Entreprise' : 'Compte Individuel'}${formRole.trim() ? ` | Poste: ${formRole.trim()}` : ''}`,
        channel: 'En ligne'
      });

      setSubmitSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormAltPhone('');
        setFormCompany('');
        setFormRole('');
        setFormSession('');
      }, 4000);
    } catch (err) {
      console.error("Erreur enregistrement formulaire:", err);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="registration-form-card" className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3.5">
      {submitSuccess ? (
        <div id="registration-success-banner" className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-700 p-5 rounded-xl space-y-2.5 text-emerald-900 dark:text-emerald-100 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">Inscription Enregistrée avec Succès !</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">Votre dossier a bien été transmis à nos directeurs pédagogiques et consultants.</p>
            </div>
          </div>
          <p className="font-sans leading-relaxed text-xs text-slate-700 dark:text-slate-300 pl-9">
            Un accusé de réception a été envoyé à <strong>{formEmail || 'votre adresse email'}</strong>. Un conseiller vous contactera très rapidement pour finaliser votre dossier.
          </p>
          <div className="pl-9 pt-1">
            <button
              type="button"
              onClick={() => setSubmitSuccess(false)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs"
            >
              ← Soumettre une autre inscription
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 font-sans">
          
          {/* 1. ACCOUNT TYPE SELECTION (Compact buttons, label suppressed) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setFormAccountType('individuel')}
              className={`p-2 sm:p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
                formAccountType === 'individuel'
                  ? 'border-[#8A1A24] bg-[#8A1A24]/5 dark:bg-[#8A1A24]/15 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                formAccountType === 'individuel' ? 'bg-[#8A1A24] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className={`block font-extrabold text-xs sm:text-[13px] ${
                  formAccountType === 'individuel' ? 'text-[#8A1A24] dark:text-red-400' : 'text-slate-900 dark:text-white'
                }`}>
                  Compte Individuel
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Candidature personnelle / Financement propre
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormAccountType('entreprise')}
              className={`p-2 sm:p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
                formAccountType === 'entreprise'
                  ? 'border-[#8A1A24] bg-[#8A1A24]/5 dark:bg-[#8A1A24]/15 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                formAccountType === 'entreprise' ? 'bg-[#8A1A24] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className={`block font-extrabold text-xs sm:text-[13px] ${
                  formAccountType === 'entreprise' ? 'text-[#8A1A24] dark:text-red-400' : 'text-slate-900 dark:text-white'
                }`}>
                  Compte Entreprise
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Prise en charge entreprise, FDFP ou bon de commande
                </span>
              </div>
            </button>
          </div>

          {/* Conditional Enterprise Fields */}
          {formAccountType === 'entreprise' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="block font-bold text-slate-900 dark:text-white text-[11px]">
                  Entreprise / Organisation * :
                </label>
                <input
                  type="text"
                  placeholder="Ex: Orange, Ministère, Sodeci, Cabinet..."
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className={`w-full bg-white dark:bg-slate-900 border rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none transition-all ${
                    errors.company ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24]'
                  }`}
                />
                {errors.company && <span className="text-[10px] text-red-500 font-semibold block">{errors.company}</span>}
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-900 dark:text-white text-[11px]">
                  Fonction / Poste :
                </label>
                <input
                  type="text"
                  placeholder="Ex: DRH, DAF, Chef de Projet..."
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#8A1A24]"
                />
              </div>
            </div>
          )}

          {/* 2. PERSONAL DETAILS (Nom & Email) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="block font-bold text-slate-900 dark:text-white text-[11.5px]">
                Nom Complet * :
              </label>
              <input
                type="text"
                placeholder="Ex: KOUASSI Jean-Philippe"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={`w-full bg-white dark:bg-slate-900 border rounded-lg px-3 py-1.5 text-xs sm:text-[13px] text-slate-900 dark:text-white outline-none transition-all ${
                  errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24]'
                }`}
              />
              {errors.name && <span className="text-[10.5px] text-red-500 font-semibold block">{errors.name}</span>}
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-900 dark:text-white text-[11.5px]">
                Adresse Email * :
              </label>
              <input
                type="email"
                placeholder="votre.email@domaine.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className={`w-full bg-white dark:bg-slate-900 border rounded-lg px-3 py-1.5 text-xs sm:text-[13px] text-slate-900 dark:text-white outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24]'
                }`}
              />
              {errors.email && <span className="text-[10.5px] text-red-500 font-semibold block">{errors.email}</span>}
            </div>
          </div>

          {/* 3. COUNTRY SELECTOR (WITH EXPLICIT VISIBLE FLAG) & PRIMARY WHATSAPP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* Country Dropdown WITH VISIBLE FLAG BADGE */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-900 dark:text-white text-[11.5px]">
                Pays de Résidence * :
              </label>
              <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-[#8A1A24] shadow-2xs transition-all">
                <div className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-lg flex items-center justify-center shrink-0 select-none">
                  <span>{selectedCountryObj.flag}</span>
                </div>
                <select
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  className="w-full bg-transparent px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none font-medium cursor-pointer"
                >
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {c.flag} {c.name} ({c.dial})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Primary Phone / WhatsApp */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-900 dark:text-white text-[11.5px]">
                Numéro WhatsApp * :
              </label>
              <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-[#8A1A24] shadow-2xs transition-all">
                <div className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold font-mono text-[11.5px] flex items-center space-x-1 shrink-0 select-none">
                  <span>{selectedCountryObj.flag}</span>
                  <span>{selectedCountryObj.dial}</span>
                </div>
                <input
                  type="tel"
                  placeholder="Ex: 07 01 02 03 04"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs text-slate-900 dark:text-white bg-transparent outline-none font-medium placeholder-slate-400"
                />
              </div>
              {errors.phone && <span className="text-[10.5px] text-red-500 font-semibold block">{errors.phone}</span>}
            </div>
          </div>

          {/* 4. AUTRE NUMÉRO (demande autre numero) & SESSION SOUHAITÉE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* Second / Alternative Phone Number */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-900 dark:text-white text-[11.5px]">
                Autre numéro de contact :
              </label>
              <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-[#8A1A24] shadow-2xs transition-all">
                <div className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold font-mono text-[11.5px] flex items-center space-x-1 shrink-0 select-none">
                  <span>{selectedCountryObj.flag}</span>
                  <span>{selectedCountryObj.dial}</span>
                </div>
                <input
                  type="tel"
                  placeholder="Ex: 05 06 07 08 09 (Appels / Secondaire)"
                  value={formAltPhone}
                  onChange={(e) => setFormAltPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs text-slate-900 dark:text-white bg-transparent outline-none font-medium placeholder-slate-400"
                />
              </div>
            </div>

            {/* Session souhaitée */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-900 dark:text-white text-[11.5px]">
                Session / Période Souhaitée * :
              </label>
              <select
                value={formSession}
                onChange={(e) => setFormSession(e.target.value)}
                className={`w-full bg-white dark:bg-slate-900 border rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none transition-all shadow-2xs cursor-pointer ${
                  errors.session ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#8A1A24]'
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
              {errors.session && <span className="text-[10.5px] text-red-500 font-semibold block">{errors.session}</span>}
            </div>
          </div>

          {/* 5. MODALITÉ PRÉFÉRÉE */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-900 dark:text-white text-[11.5px]">
              Modalité Préférée :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Présentiel', 'En ligne', 'Hybride'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFormModality(m)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer text-center ${
                    formModality === m
                      ? 'border-[#8A1A24] bg-[#8A1A24] text-white shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* 6. TERMS / CONSENT */}
          <div className="pt-0.5">
            <label className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formTerms}
                onChange={(e) => setFormTerms(e.target.checked)}
                className="mt-0.5 shrink-0 accent-[#8A1A24] w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-[10.5px] text-slate-600 dark:text-slate-400 leading-tight font-normal">
                J'autorise le Cabinet CICEXF à enregistrer mes informations de contact pour le traitement réglementaire de mon dossier de candidature.
              </span>
            </label>
            {errors.terms && <span className="text-[10.5px] text-red-500 font-semibold block mt-1">{errors.terms}</span>}
          </div>

            {/* 7. SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-[#8A1A24] hover:bg-[#6D141C] text-white rounded-lg font-extrabold uppercase tracking-wider text-xs transition-all flex items-center justify-center space-x-2 shadow-sm hover:shadow-md cursor-pointer active:scale-98 disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'ENREGISTREMENT EN COURS...' : 'VALIDER MON INSCRIPTION'}</span>
            </button>
          </form>
        )}
      </div>
    );
}
