import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Youtube, ArrowUp, Send, CheckCircle, Key } from 'lucide-react';
import { trackSubscription } from '../lib/tracker';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setSelectedDomainId: (id: string | null) => void;
  isAdminLoggedIn?: boolean;
  onOpenAdminLogin?: () => void;
  onAdminLogout?: () => void;
}

export default function Footer({ 
  setActiveTab, 
  setSelectedDomainId,
  isAdminLoggedIn = false,
  onOpenAdminLogin,
  onAdminLogout
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleLinkClick = (tab: string, domainId: string | null = null) => {
    if (tab === 'partners') {
      setActiveTab('home');
      setSelectedDomainId(null);
      setTimeout(() => {
        const el = document.getElementById('partners-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setActiveTab(tab);
      setSelectedDomainId(domainId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        await trackSubscription(email);
        setSubscribed(true);
        setTimeout(() => {
          setEmail('');
          setSubscribed(false);
        }, 4000);
      } catch (err) {
        console.error('Subscription track error:', err);
      }
    }
  };

  return (
    <footer id="institutional-footer" className="bg-brand-emerald dark:bg-[#54150A] text-white border-t border-[#B84F3D]/40 pt-4 pb-3 sm:pt-5 sm:pb-4 relative overflow-hidden transition-colors shadow-2xl">
      {/* Visual background details */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-3">
          
          {/* Identity & Legal Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-white text-[#8A2E1C] rounded-lg flex items-center justify-center font-black text-sm shadow-md shrink-0">
                CX
              </div>
              <span className="font-display font-extrabold text-base tracking-tight text-white">
                CIC<span className="text-yellow-400">EXF</span>
              </span>
            </div>

            {/* Références Officielles du Cabinet et Numéro d'Agrément */}
            <div className="pt-1 text-xs space-y-1 font-sans">
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span className="text-yellow-400 font-extrabold uppercase tracking-wide">Agrément Officiel :</span>
                <span className="text-white font-extrabold font-mono bg-black/25 px-1.5 py-0.5 rounded border border-white/30 text-xs">
                  N°25343/GTCA/RC/2025
                </span>
              </div>
              <p className="text-white text-xs font-medium">
                Cocody Palmeraie
              </p>
              <p className="text-white/90 text-xs">
                Société de Consultance et Formation Agréée en Côte d'Ivoire
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-yellow-400 uppercase tracking-wider border-l-2 border-yellow-400 pl-2">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-white">
              <li>
                <button onClick={() => handleLinkClick('home')} className="text-white hover:text-yellow-300 hover:translate-x-0.5 transition-all duration-150 text-left cursor-pointer">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('formations')} className="text-white hover:text-yellow-300 hover:translate-x-0.5 transition-all duration-150 text-left cursor-pointer">
                  Nos Formations
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('realisations')} className="text-white hover:text-yellow-300 hover:translate-x-0.5 transition-all duration-150 text-left cursor-pointer">
                  Nos Réalisations
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('news')} className="text-white hover:text-yellow-300 hover:translate-x-0.5 transition-all duration-150 text-left cursor-pointer">
                  Actualités &amp; Publications
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('partners')} className="text-white hover:text-yellow-300 hover:translate-x-0.5 transition-all duration-150 text-left cursor-pointer">
                  Espace Partenaires
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-yellow-400 uppercase tracking-wider border-l-2 border-yellow-400 pl-2">
              Nos contacts
            </h4>
            <ul className="space-y-2 text-xs leading-snug text-white font-medium">
              <li className="flex items-start text-white">
                <MapPin className="w-3.5 h-3.5 text-yellow-400 mr-2 shrink-0 mt-0.5" />
                <span className="text-white">Cocody Palmeraie, Rue de la Clinique, Abidjan</span>
              </li>
              <li className="flex items-center text-white">
                <Phone className="w-3.5 h-3.5 text-yellow-400 mr-2 shrink-0" />
                <div className="flex flex-wrap gap-x-2">
                  <a href="tel:+2250574222246" className="text-white hover:text-yellow-300 transition-colors font-bold">+225 05 74 22 22 46</a>
                  <span className="text-white/60">/</span>
                  <a href="tel:+2250701970065" className="text-white hover:text-yellow-300 transition-colors font-bold">+225 07 01 97 00 65</a>
                </div>
              </li>
              <li className="flex items-start text-white">
                <Mail className="w-3.5 h-3.5 text-yellow-400 mr-2 shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-0.5">
                  <a href="mailto:cabinetcicexf@gmail.com" className="text-white hover:text-yellow-300 transition-colors break-all font-bold">cabinetcicexf@gmail.com</a>
                  <a href="mailto:elearningciv@gmail.com" className="text-white hover:text-yellow-300 transition-colors break-all font-bold">elearningciv@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-yellow-400 uppercase tracking-wider border-l-2 border-yellow-400 pl-2">
              Lettre d'Information
            </h4>
            <p className="text-xs text-white leading-tight font-sans font-medium">
              Abonnez-vous pour recevoir les calendriers et analyses stratégiques.
            </p>
            {subscribed ? (
              <div className="bg-white/15 border border-white/30 p-2 rounded-lg flex items-center space-x-2 text-xs text-white font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span className="text-white">Inscription réussie !</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex bg-white/10 border border-white/30 rounded-lg overflow-hidden focus-within:border-white transition-colors shadow-xs backdrop-blur-xs">
                <input
                  id="newsletter-email-input"
                  type="email"
                  required
                  placeholder="votre.email@institution.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-2.5 py-1.5 text-xs outline-none text-white placeholder-white/80"
                />
                <button
                  type="submit"
                  id="newsletter-submit-btn"
                  className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-3 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  aria-label="S'abonner"
                >
                  <Send className="w-3 h-3 text-slate-900" />
                </button>
              </form>
            )}

            {/* Social handles */}
            <div className="pt-1 flex space-x-2.5">
              <a
                href="https://www.facebook.com/CabinetCICEXF"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/15 border border-white/25 text-white hover:bg-white hover:text-[#8A2E1C] flex items-center justify-center shadow-xs transition-all duration-200"
                title="Suivez CICEXF sur Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/15 border border-white/25 text-white hover:bg-white hover:text-[#8A2E1C] flex items-center justify-center shadow-xs transition-all duration-200"
                title="Suivez CICEXF sur LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/15 border border-white/25 text-white hover:bg-red-600 hover:text-white flex items-center justify-center shadow-xs transition-all duration-200"
                title="Abonnez-vous à notre chaîne YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Legal Mentions and Certifications Footer */}
        <div className="border-t border-white/20 pt-2.5 mt-2 flex flex-col md:flex-row justify-between items-center text-xs text-white font-medium gap-1.5">
          <p className="text-white">© {new Date().getFullYear()} CICEXF &middot; Agrément N°25343/GTCA/RC/2025. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-2 md:space-x-3 items-center justify-center md:justify-end text-white">
            <a href="#mentions" className="hover:text-yellow-300 transition-colors text-white">Mentions Légales</a>
            <span className="text-white/40">|</span>
            <a href="#confidentiality" className="hover:text-yellow-300 transition-colors text-white">Politique de Confidentialité</a>
            <span className="text-white/40">|</span>
            <span className="text-yellow-400 font-semibold">Agrément N°25343/GTCA/RC/2025</span>
            <span className="text-white/40">|</span>
            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-1.5">
                <button 
                  onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-yellow-300 text-yellow-400 transition-colors font-bold flex items-center space-x-1 cursor-pointer"
                  title="Espace Administrateur - Console de Gestion"
                >
                  <Key className="w-2.5 h-2.5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">Administration</span>
                </button>
                {onAdminLogout && (
                  <button
                    onClick={onAdminLogout}
                    className="text-xs text-white/70 hover:text-red-300 underline cursor-pointer ml-1"
                    title="Se déconnecter de l'administration"
                  >
                    (Déconnexion)
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
