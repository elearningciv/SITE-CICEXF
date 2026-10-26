import React, { useState } from 'react';
import { X, Lock, Mail, Key, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ALLOWED_ADMIN_EMAILS, isAuthorizedAdminEmail } from './AdminPanel';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState('cabinetcicexf@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Validation de l'adresse autorisée
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setError("Accès réservé. Seules les adresses officielles cabinetcicexf@gmail.com et elearningciv@gmail.com sont habilitées.");
      setLoading(false);
      return;
    }

    // 2. Validation du mot de passe officiel
    if (cleanPassword !== '123456') {
      setError("Mot de passe incorrect. Le mot de passe requis pour accéder à l'administration est 123456.");
      setLoading(false);
      return;
    }

    try {
      // Tentative de connexion via Firebase Auth
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      } catch (fbErr: any) {
        console.warn("Firebase Auth fallback to local session:", fbErr?.message || fbErr);
      }

      // Enregistrement de la session administrative garantie
      const adminSession = {
        email: cleanEmail,
        name: cleanEmail === 'cabinetcicexf@gmail.com' ? 'Cabinet CICEXF (Direction)' : 'CICEXF E-Learning',
        loggedInAt: Date.now()
      };
      localStorage.removeItem('cicexf_admin_explicit_logout');
      sessionStorage.removeItem('cicexf_admin_explicit_logout');
      localStorage.setItem('cicexf_admin_session', JSON.stringify(adminSession));
      sessionStorage.setItem('cicexf_admin_session', JSON.stringify(adminSession));

      window.dispatchEvent(new CustomEvent('admin-auth-changed', {
        detail: { isLoggedIn: true, email: cleanEmail }
      }));

      onSuccess(cleanEmail);
      onClose();
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const userEmail = res.user?.email?.toLowerCase();
      
      if (isAuthorizedAdminEmail(userEmail)) {
        const adminSession = {
          email: userEmail,
          name: res.user?.displayName || userEmail,
          loggedInAt: Date.now()
        };
        localStorage.removeItem('cicexf_admin_explicit_logout');
        sessionStorage.removeItem('cicexf_admin_explicit_logout');
        localStorage.setItem('cicexf_admin_session', JSON.stringify(adminSession));
        sessionStorage.setItem('cicexf_admin_session', JSON.stringify(adminSession));

        window.dispatchEvent(new CustomEvent('admin-auth-changed', {
          detail: { isLoggedIn: true, email: userEmail }
        }));

        onSuccess(userEmail!);
        onClose();
      } else {
        setError(`L'adresse Google "${userEmail}" n'est pas habilitée. Veuillez vous connecter avec cabinetcicexf@gmail.com ou elearningciv@gmail.com.`);
      }
    } catch (err: any) {
      console.warn("Google Sign-In canceled or failed:", err);
      setError("Connexion Google annulée ou indisponible. Veuillez utiliser le formulaire mot de passe (123456).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#003B6F] to-[#8A2E1C] p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm text-white">
                Console d'Administration CICEXF
              </h3>
              <p className="text-[10px] text-white/80">
                Accès réservé aux gestionnaires habilités
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-3 rounded-2xl text-xs text-red-700 dark:text-red-300 flex items-start space-x-2 animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Quick select buttons */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Choisir votre compte administrateur :
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEmail('cabinetcicexf@gmail.com')}
                className={`p-2 rounded-xl text-left border text-[11px] font-bold transition-all cursor-pointer ${
                  email === 'cabinetcicexf@gmail.com'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 ring-1 ring-amber-500/30'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="block truncate">cabinetcicexf@gmail.com</span>
                <span className="text-[9px] text-slate-500 font-normal">Direction Générale</span>
              </button>

              <button
                type="button"
                onClick={() => setEmail('elearningciv@gmail.com')}
                className={`p-2 rounded-xl text-left border text-[11px] font-bold transition-all cursor-pointer ${
                  email === 'elearningciv@gmail.com'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 ring-1 ring-amber-500/30'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="block truncate">elearningciv@gmail.com</span>
                <span className="text-[9px] text-slate-500 font-normal">Pôle Pédagogique</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Adresse e-mail autorisée :
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cabinetcicexf@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Mot de passe :
                </label>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  Requis : 123456
                </span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>Ouvrir l'Espace d'Administration</span>
            </button>
          </form>

          {/* Quick Google Sign In */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Connexion rapide avec Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
