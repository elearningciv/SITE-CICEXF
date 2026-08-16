import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Youtube, Send, MessageSquare, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { trackSubscription } from '../lib/tracker';

interface ContactProps {
  preselectedDomain: string; // Preselected category ('Formation', 'Consultance', 'Expertise', etc.)
  setPreselectedDomain: (domain: string) => void;
}

export default function Contact({ preselectedDomain, setPreselectedDomain }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Consultance');
  const [message, setMessage] = useState('');
  
  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (preselectedDomain) {
      setCategory(preselectedDomain);
    }
  }, [preselectedDomain]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "Le nom complet doit comporter au moins 3 caractères.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Veuillez saisir une adresse email valide.";
    }

    if (!phone.trim() || phone.trim().length < 8) {
      newErrors.phone = "Le numéro de téléphone est requis (8 chiffres minimum).";
    }

    if (!message.trim() || message.trim().length < 10) {
      newErrors.message = "Le message est trop court (10 caractères minimum).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
    } else {
      setErrors({});
      setSuccess(true);
      
      // Save subscription and identity in tracker
      trackSubscription(email, true);
      
      // Simulate API send
      setTimeout(() => {
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setPreselectedDomain('');
      }, 5000);
    }
  };

  return (
    <div id="contact-view" className="py-16 bg-slate-50 dark:bg-slate-950 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title banner */}
        <div className="mb-12">
          <nav className="flex text-xs font-semibold text-slate-400 mb-2">
            <span>CICEXF</span>
            <span className="mx-2">/</span>
            <span className="text-brand-emerald">Contact</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contactez Notre Secrétariat Technique
          </h1>
          <div className="w-16 h-1.5 bg-brand-emerald mt-4 rounded-full"></div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 max-w-2xl font-semibold uppercase tracking-widest">
            Entrez en relation avec nos conseillers ou demandez une cotation d'expertise
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Coordinates & Channels */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-8 shadow-sm space-y-6">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Coordonnées Officielles du Siège
              </h3>
              
              <div className="space-y-4 text-xs font-medium leading-relaxed">
                
                {/* Physical address */}
                <div className="flex items-start">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-slate-800 text-brand-emerald flex items-center justify-center shrink-0 mr-4">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Adresse du Siège :</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      Cocody Palmeraie, Rue de la Clinique, Immeuble Prestige, 3ème étage, Abidjan, Côte d'Ivoire
                    </p>
                  </div>
                </div>

                {/* Telephone numbers */}
                <div className="flex items-start">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-slate-800 text-brand-blue flex items-center justify-center shrink-0 mr-4">
                    <Phone className="w-4.5 h-4.5 text-brand-emerald" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Numéros Directs :</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      Secrétariat : <a href="tel:+2250574222246" className="hover:underline text-slate-700 dark:text-slate-300 font-semibold">+225 05 74 22 22 46</a>
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Admissions : <a href="tel:+2250701970065" className="hover:underline text-slate-700 dark:text-slate-300 font-semibold">+225 07 01 97 00 65</a>
                    </p>
                  </div>
                </div>

                {/* Email contact */}
                <div className="flex items-start">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-slate-800 text-purple-500 flex items-center justify-center shrink-0 mr-4">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Messagerie Électronique :</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      <a href="mailto:elearningciv@gmail.com" className="hover:underline font-semibold break-all text-slate-700 dark:text-slate-300">elearningciv@gmail.com</a>
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Click-to-Chat WhatsApp CTA */}
            <div className="bg-gradient-to-br from-brand-blue to-brand-emerald rounded-3xl p-8 text-white shadow-md space-y-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-6 h-6 text-white" />
                <h4 className="font-display font-extrabold text-base text-white">Canal d'Échange WhatsApp</h4>
              </div>
              <p className="text-xs text-slate-100 font-sans leading-relaxed">
                Vous souhaitez obtenir une réponse instantanée à vos questions sur les inscriptions, tarifs, ou disponibilités de nos programmes ? Chattez directement avec un chargé d'admission.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/2250701970065"
                  target="_blank"
                  rel="noreferrer"
                  id="whatsapp-click-to-chat"
                  className="inline-flex items-center space-x-2 bg-slate-950 hover:bg-slate-900 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  <span>Discuter sur WhatsApp (+225 07 01 97 00 65)</span>
                </a>
              </div>
            </div>

            {/* Social Network Connections coordinates */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-8 shadow-sm space-y-4">
              <h4 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
                Suivez nos publications
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Abonnez-vous à nos canaux officiels pour suivre l'actualité de nos événements académiques et recevoir des études gratuites de marché.
              </p>
              <div className="flex space-x-4 pt-2">
                <a
                  href="https://www.facebook.com/CabinetCICEXF"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-brand-blue flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                  title="CICEXF sur Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-brand-blue flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                  title="CICEXF sur LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-red-600 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                  title="CICEXF sur YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Smart Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-8 shadow-md">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Soumettre un Formulaire de Demande
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-1">
                Indiquez le service concerné afin que votre message soit routé vers le bon pôle d'ingénierie (Consultance, Expertise, Formation).
              </p>
            </div>

            {success ? (
              <div id="contact-success-banner" className="bg-emerald-50 dark:bg-emerald-950/20 border border-brand-emerald/30 p-6 rounded-2xl text-xs space-y-3 text-brand-emerald-dark dark:text-brand-emerald-light">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-emerald" />
                  <span className="font-bold">Demande d'Accompagnement Reçue !</span>
                </div>
                <p className="font-sans leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                  Merci <strong>{name}</strong>. Votre message a été enregistré avec succès et routé vers le pôle <strong>{category}</strong> de notre cabinet. Un expert technique vous contactera par email (<strong>{email}</strong>) ou téléphone sous un délai de 24 heures ouvrées.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-[10px] font-bold text-brand-blue hover:underline block pt-2"
                >
                  Rédiger une nouvelle demande d'assistance
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-600 dark:text-slate-350">Nom complet ou Institution :</label>
                    <input
                      id="contact-input-name"
                      type="text"
                      required
                      placeholder="M. Nom Prénom / Cabinet / ONG"
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

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-600 dark:text-slate-350">Numéro de Téléphone :</label>
                    <input
                      id="contact-input-phone"
                      type="tel"
                      required
                      placeholder="Ex: +225 05 74 22 22 46"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-lg px-3 py-2 outline-none ${errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-brand-emerald'}`}
                    />
                    {errors.phone && (
                      <span className="text-[10px] text-red-500 flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-600 dark:text-slate-350">Adresse de Courrier Électronique :</label>
                  <input
                    id="contact-input-email"
                    type="email"
                    required
                    placeholder="votre.email@institution-publique.org"
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

                {/* Subject selection (Formation, Consultance, Expertise, Partenariat ou Autre) */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-600 dark:text-slate-350">Objet principal de la demande :</label>
                  <select
                    id="contact-input-subject"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
                  >
                    <option value="Formation">Formation (Parcours ou certification)</option>
                    <option value="Consultance">Consultance (Accompagnement stratégique, audit organisationnel)</option>
                    <option value="Expertise">Expertise technique (Ingénierie QHSE, Finance, SIG, Informatique)</option>
                    <option value="Partenariat">Partenariat (Formateur associé, expert thématique)</option>
                    <option value="Autre">Autre demande spécifique</option>
                  </select>
                </div>

                {/* Message text area */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-600 dark:text-slate-350">Description de votre besoin :</label>
                  <textarea
                    id="contact-input-message"
                    required
                    rows={5}
                    placeholder="Veuillez décrire brièvement votre situation, les défis actuels de votre structure et les résultats que vous attendez."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-lg px-3 py-2 outline-none ${errors.message ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-brand-emerald'}`}
                  ></textarea>
                  {errors.message && (
                    <span className="text-[10px] text-red-500 flex items-center mt-1">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* GDPR security confirmation */}
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800 flex items-start space-x-2 text-[10px] text-slate-500 leading-normal font-sans">
                  <ShieldCheck className="w-5 h-5 text-brand-emerald shrink-0 mt-0.5" />
                  <span>
                    Conformément au RGPD et à la loi n°2013-450 relative à la protection des données à caractère personnel de Côte d'Ivoire, les informations saisies font l'objet d'un chiffrement AES-256 et ne seront jamais partagées en dehors du cabinet.
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  className="w-full py-3.5 bg-brand-blue dark:bg-brand-emerald text-white dark:text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.01] hover:shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Soumettre ma demande d'accompagnement</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
