import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Youtube, ArrowUp, Send, CheckCircle } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setSelectedDomainId: (id: string | null) => void;
}

export default function Footer({ setActiveTab, setSelectedDomainId }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleLinkClick = (tab: string, domainId: string | null = null) => {
    setActiveTab(tab);
    setSelectedDomainId(domainId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer id="institutional-footer" className="bg-[#020817] text-slate-300 border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-emerald/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Identity & Legal Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-emerald rounded-lg flex items-center justify-center text-white font-bold text-lg">
                CX
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                CIC<span className="text-brand-emerald">EXF</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Cabinet International de Consultance, d'Expertise et de Formation. Solutions de haut niveau pour l'accompagnement des organisations et la formation de cadres d'excellence.
            </p>
            <div className="pt-2 text-[10px] text-slate-500 space-y-1 border-t border-slate-900">
              <p>Récépissé N°25343/GTCA/RC/2025</p>
              <p>N°IDU CI-2025-0058238 N</p>
              <p>Cocody Palmeraie, Abidjan</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-emerald pl-2.5">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button onClick={() => handleLinkClick('home')} className="hover:text-brand-emerald transition-colors">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-brand-emerald transition-colors">
                  Qui sommes-nous (Cabinet)
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('formations')} className="hover:text-brand-emerald transition-colors">
                  Nos Formations
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('realisations')} className="hover:text-brand-emerald transition-colors">
                  Nos Réalisations
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('news')} className="hover:text-brand-emerald transition-colors">
                  Actualités &amp; Publications
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('partners')} className="hover:text-brand-emerald transition-colors">
                  Espace Partenaires
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-emerald pl-2.5">
              Nous Contacter
            </h4>
            <ul className="space-y-3 text-xs leading-relaxed">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-brand-emerald mr-2.5 shrink-0 mt-0.5" />
                <span>Cocody Palmeraie, Rue de la Clinique, Immeuble Prestige, Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-brand-emerald mr-2.5 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+2250574222246" className="hover:text-white transition-colors">+225 05 74 22 22 46</a>
                  <a href="tel:+2250701970065" className="hover:text-white transition-colors">+225 07 01 97 00 65</a>
                </div>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-brand-emerald mr-2.5 shrink-0" />
                <a href="mailto:elearningciv@gmail.com" className="hover:text-white transition-colors break-all">elearningciv@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-emerald pl-2.5">
              Lettre d'Information
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Abonnez-vous pour recevoir les calendriers des prochaines sessions de formation et nos analyses stratégiques de pointe.
            </p>
            {subscribed ? (
              <div className="bg-slate-900 border border-brand-emerald/30 p-3 rounded-lg flex items-center space-x-2 text-xs text-brand-emerald-light">
                <CheckCircle className="w-4 h-4 text-brand-emerald" />
                <span>Inscription réussie ! Merci pour votre confiance.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex bg-slate-900 border border-slate-800 rounded-lg overflow-hidden focus-within:border-brand-emerald transition-colors">
                <input
                  id="newsletter-email-input"
                  type="email"
                  required
                  placeholder="votre.email@institution.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-xs outline-none text-slate-200 placeholder-slate-500"
                />
                <button
                  type="submit"
                  id="newsletter-submit-btn"
                  className="bg-brand-emerald hover:bg-brand-emerald-dark px-3 flex items-center justify-center transition-colors text-white"
                  aria-label="S'abonner"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Social handles */}
            <div className="pt-3 flex space-x-4">
              <a
                href="https://www.facebook.com/CabinetCICEXF"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-brand-blue flex items-center justify-center hover:text-white transition-all duration-200"
                title="Suivez CICEXF sur Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-brand-blue flex items-center justify-center hover:text-white transition-all duration-200"
                title="Suivez CICEXF sur LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-red-600 flex items-center justify-center hover:text-white transition-all duration-200"
                title="Abonnez-vous à notre chaîne YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Legal Mentions and Certifications Footer */}
        <div className="border-t border-slate-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} CICEXF. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#mentions" className="hover:text-slate-300 transition-colors">Mentions Légales</a>
            <span className="text-slate-850">|</span>
            <a href="#confidentiality" className="hover:text-slate-300 transition-colors">Politique de Confidentialité</a>
            <span className="text-slate-850">|</span>
            <span className="text-brand-emerald">Conçu selon les standards WCAG Accessibilité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
