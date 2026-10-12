import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Youtube, ArrowUp, Send, CheckCircle, Key } from 'lucide-react';
import { trackSubscription } from '../lib/tracker';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setSelectedDomainId: (id: string | null) => void;
}

export default function Footer({ setActiveTab, setSelectedDomainId }: FooterProps) {
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
    <footer id="institutional-footer" className="bg-brand-emerald dark:bg-[#54150A] text-white border-t border-[#B84F3D]/40 pt-7 pb-4 relative overflow-hidden transition-colors shadow-2xl">
      {/* Visual background details */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/25 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-5">
          
          {/* Identity & Legal Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-white text-[#8A2E1C] rounded-lg flex items-center justify-center font-black text-base shadow-md shrink-0">
                CX
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-white">
                CIC<span className="text-amber-300">EXF</span>
              </span>
            </div>
            <p className="text-[11px] text-amber-50/90 leading-relaxed font-sans font-medium line-clamp-3">
              Cabinet International de Consultance, d'Expertise et de Formation. Solutions de haut niveau pour l'accompagnement des organisations et la formation de cadres d'excellence.
            </p>
            <div className="pt-1.5 text-[9.5px] text-amber-200/80 space-y-0.5 border-t border-white/20 font-mono">
              <p>Récépissé N°25343/GTCA/RC/2025</p>
              <p>N°IDU CI-2025-0058238 N · Cocody Palmeraie</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-amber-300 pl-2">
              Navigation
            </h4>
            <ul className="space-y-1 text-[11px] font-semibold text-amber-100/90">
              <li>
                <button onClick={() => handleLinkClick('home')} className="hover:text-white hover:translate-x-0.5 transition-all duration-150 text-left cursor-pointer">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-white hover:translate-x-0.5 transition-all duration-150 text-left cursor-pointer">
                  Qui sommes-nous (Cabinet)
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('formations')} className="hover:text-white hover:translate-x-0.5 transition-all duration-150 text-left cursor-pointer">
                  Nos Formations
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('realisations')} className="hover:text-white hover:translate-x-0.5 transition-all duration-150 text-left cursor-pointer">
                  Nos Réalisations
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('news')} className="hover:text-white hover:translate-x-0.5 transition-all duration-150 text-left cursor-pointer">
                  Actualités &amp; Publications
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('partners')} className="hover:text-white hover:translate-x-0.5 transition-all duration-150 text-left cursor-pointer">
                  Espace Partenaires
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-amber-300 pl-2">
              Nous Contacter
            </h4>
            <ul className="space-y-2 text-[11px] leading-snug text-amber-50/95 font-medium">
              <li className="flex items-start">
                <MapPin className="w-3.5 h-3.5 text-amber-300 mr-2 shrink-0 mt-0.5" />
                <span>Cocody Palmeraie, Rue de la Clinique, Abidjan</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-3.5 h-3.5 text-amber-300 mr-2 shrink-0" />
                <div className="flex flex-wrap gap-x-2">
                  <a href="tel:+2250574222246" className="hover:text-white transition-colors font-semibold text-amber-100">+225 05 74 22 22 46</a>
                  <span className="text-white/40">/</span>
                  <a href="tel:+2250701970065" className="hover:text-white transition-colors font-semibold text-amber-100">+225 07 01 97 00 65</a>
                </div>
              </li>
              <li className="flex items-center">
                <Mail className="w-3.5 h-3.5 text-amber-300 mr-2 shrink-0" />
                <a href="mailto:elearningciv@gmail.com" className="hover:text-white transition-colors break-all font-semibold text-amber-100">elearningciv@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-amber-300 pl-2">
              Lettre d'Information
            </h4>
            <p className="text-[11px] text-amber-50/90 leading-tight font-sans font-medium">
              Abonnez-vous pour recevoir les calendriers et analyses stratégiques.
            </p>
            {subscribed ? (
              <div className="bg-white/15 border border-white/30 p-2 rounded-lg flex items-center space-x-2 text-[11px] text-white font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Inscription réussie !</span>
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
                  className="w-full bg-transparent px-2.5 py-1.5 text-[11px] outline-none text-white placeholder-amber-100/60"
                />
                <button
                  type="submit"
                  id="newsletter-submit-btn"
                  className="bg-white hover:bg-amber-100 text-[#8A2E1C] font-bold px-3 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  aria-label="S'abonner"
                >
                  <Send className="w-3 h-3" />
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
        <div className="border-t border-white/20 pt-3.5 mt-3.5 flex flex-col md:flex-row justify-between items-center text-[10px] text-amber-100/80 font-medium gap-2">
          <p>© {new Date().getFullYear()} CICEXF. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-2 md:space-x-3 items-center justify-center md:justify-end">
            <a href="#mentions" className="hover:text-white transition-colors text-amber-100/90">Mentions Légales</a>
            <span className="text-white/30">|</span>
            <a href="#confidentiality" className="hover:text-white transition-colors text-amber-100/90">Politique de Confidentialité</a>
            <span className="text-white/30">|</span>
            <span className="text-amber-300 font-semibold">Standards WCAG Accessibilité</span>
            <span className="text-white/30">|</span>
            <button 
              onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-white text-amber-200 transition-colors font-bold flex items-center space-x-1 cursor-pointer"
              title="Espace Administrateur"
            >
              <Key className="w-2.5 h-2.5 text-amber-300" />
              <span>Administration</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
