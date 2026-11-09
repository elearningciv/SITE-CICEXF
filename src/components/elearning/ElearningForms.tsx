import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { COUNTRIES, EXPERIENCE_LEVELS, STUDY_LEVELS, TRAINING_DOMAINS, TRAINING_DOMAIN_GROUPS } from '../../data/elearning';
import type { ElearningApi, LearnerProfile } from '../../lib/elearningApi';
import { learnerErrorMessage } from '../../lib/elearningApi';

const field = 'w-full rounded-xl border-[1.5px] border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue';
const label = 'block text-xs font-extrabold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-1.5';
const primary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-brand-emerald hover:bg-brand-emerald-dark disabled:opacity-50 text-white px-5 py-3 font-extrabold text-sm';
const panel = 'max-w-3xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm';

const EMPTY: LearnerProfile = { nom: '', prenom: '', telephone: '', email: '', pays: '', activite: '', formation: '', niveau: '', experience: '' };

interface SignupProps {
  api: ElearningApi;
  /** Signed in but the profile is missing: complete it instead of creating an account */
  completeFor?: string;
  initial?: LearnerProfile | null;
  onDone: () => void;
  onLogin: () => void;
}

export function SignupForm({ api, completeFor, initial, onDone, onLogin }: SignupProps) {
  const editing = !!initial;
  const [p, setP] = useState<LearnerProfile>(initial || { ...EMPTY, email: completeFor || '' });
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(editing);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof LearnerProfile) => (e: { target: { value: string } }) => setP({ ...p, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const required: (keyof LearnerProfile)[] = ['nom', 'prenom', 'telephone', 'email', 'pays', 'activite', 'formation', 'niveau', 'experience'];
    if (required.some((k) => !(p[k] || '').trim())) return setError('Merci de remplir tous les champs.');
    if (!/^\S+@\S+\.\S+$/.test(p.email.trim())) return setError("L'adresse e-mail n'est pas valide.");
    if (!/^[+\d][\d\s().-]{6,}$/.test(p.telephone.trim())) return setError("Le numéro de téléphone n'est pas valide.");
    if (!completeFor && !editing && password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.');
    if (!consent) return setError("Merci d'accepter les conditions pour continuer.");
    setBusy(true);
    setError('');
    try {
      if (completeFor || editing) await api.saveProfile(p);
      else await api.signUp(p, password);
      onDone();
    } catch (err) {
      setError(learnerErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={panel}>
      <h2 className="text-2xl font-extrabold text-brand-blue dark:text-sky-300">
        {editing ? 'Mes informations' : completeFor ? 'Compléter mon profil' : 'Créer mon compte e-learning'}
      </h2>
      <p className="mt-1.5 text-slate-600 dark:text-slate-400">
        {editing
          ? 'Votre nom et votre prénom figureront tels quels sur votre certificat : vérifiez leur orthographe.'
          : 'Ce compte est obligatoire pour suivre les parcours et recevoir un certificat. Tous les champs sont requis.'}
      </p>
      <form onSubmit={submit} noValidate className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
        <div><label className={label} htmlFor="el-nom">Nom</label><input id="el-nom" className={field} value={p.nom} onChange={set('nom')} autoComplete="family-name" maxLength={80} /></div>
        <div><label className={label} htmlFor="el-prenom">Prénom(s)</label><input id="el-prenom" className={field} value={p.prenom} onChange={set('prenom')} autoComplete="given-name" maxLength={120} /></div>
        <div><label className={label} htmlFor="el-tel">Téléphone (WhatsApp de préférence)</label><input id="el-tel" className={field} value={p.telephone} onChange={set('telephone')} autoComplete="tel" placeholder="+225 07 00 00 00 00" maxLength={30} /></div>
        <div><label className={label} htmlFor="el-email">Adresse e-mail</label><input id="el-email" type="email" className={field} value={p.email} onChange={set('email')} autoComplete="email" disabled={!!completeFor || editing} /></div>
        <div>
          <label className={label} htmlFor="el-pays">Pays de résidence</label>
          <select id="el-pays" className={field} value={p.pays} onChange={set('pays')}>
            <option value="">Choisir…</option>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label className={label} htmlFor="el-activite">Domaine d'activité</label><input id="el-activite" className={field} value={p.activite} onChange={set('activite')} placeholder="Ex. : agriculture, administration, ONG…" maxLength={120} /></div>
        <div>
          <label className={label} htmlFor="el-formation">Domaine de formation</label>
          <select id="el-formation" className={field} value={p.formation} onChange={set('formation')}>
            <option value="">Choisir…</option>
            {/* A value chosen from an older list stays selectable */}
            {p.formation && !TRAINING_DOMAINS.includes(p.formation) && <option>{p.formation}</option>}
            {TRAINING_DOMAIN_GROUPS.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.items.map((d) => <option key={d}>{d}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="el-niveau">Niveau d'études (en cours ou atteint)</label>
          <select id="el-niveau" className={field} value={p.niveau || ''} onChange={set('niveau')}>
            <option value="">Choisir…</option>
            {STUDY_LEVELS.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="el-exp">Années d'expérience</label>
          <select id="el-exp" className={field} value={p.experience} onChange={set('experience')}>
            <option value="">Choisir…</option>
            {EXPERIENCE_LEVELS.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
        {!completeFor && !editing && (
          <div className="sm:col-span-2">
            <label className={label} htmlFor="el-mdp">Mot de passe</label>
            <input id="el-mdp" type="password" className={field} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="8 caractères minimum" />
          </div>
        )}
        {!editing && (
          <label className="sm:col-span-2 flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
            <span>
              J'accepte que le CICEXF conserve ces informations pour gérer mon compte et ma certification, conformément à la{' '}
              <a href="/confidentialite" target="_blank" rel="noopener" className="underline font-semibold">politique de confidentialité</a>.
            </span>
          </label>
        )}
        <p className="sm:col-span-2 min-h-[1.25rem] text-sm font-bold text-brand-emerald" role="alert">{error}</p>
        <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={busy} className={primary}>
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {editing ? 'Enregistrer' : completeFor ? 'Enregistrer et commencer' : 'Créer mon compte et commencer'}
          </button>
          {!completeFor && !editing && (
            <button type="button" onClick={onLogin} className="text-sm font-bold text-brand-blue dark:text-sky-300 underline">J'ai déjà un compte : me connecter</button>
          )}
          {editing && <button type="button" onClick={onDone} className="text-sm font-bold text-slate-600 dark:text-slate-300 underline">Annuler</button>}
        </div>
      </form>
    </section>
  );
}

export function LoginForm({ api, onDone, onSignup }: { api: ElearningApi; onDone: () => void; onSignup: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError('Saisissez votre adresse e-mail et votre mot de passe.');
    setBusy(true); setError(''); setInfo('');
    try {
      await api.signIn(email, password);
      onDone();
    } catch (err) {
      setError(learnerErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Saisissez d'abord votre adresse e-mail ci-dessus.");
    setBusy(true); setError(''); setInfo('');
    try {
      await api.resetPassword(email);
    } catch {
      // Same message whether or not the address has an account
    } finally {
      setBusy(false);
      setInfo("Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d'être envoyé. Pensez à vérifier les courriers indésirables.");
    }
  };

  return (
    <section className={`${panel} max-w-lg`}>
      <h2 className="text-2xl font-extrabold text-brand-blue dark:text-sky-300">Me connecter</h2>
      <p className="mt-1.5 text-slate-600 dark:text-slate-400">Retrouvez votre parcours là où vous l'avez laissé.</p>
      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <div><label className={label} htmlFor="el-login-email">Adresse e-mail</label><input id="el-login-email" type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
        <div><label className={label} htmlFor="el-login-mdp">Mot de passe</label><input id="el-login-mdp" type="password" className={field} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></div>
        <p className="min-h-[1.25rem] text-sm font-bold text-brand-emerald" role="alert">{error}</p>
        {info && <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{info}</p>}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={busy} className={primary}>{busy && <Loader2 className="w-4 h-4 animate-spin" />}Me connecter</button>
          <button type="button" onClick={reset} disabled={busy} className="text-sm font-bold text-slate-600 dark:text-slate-300 underline">Mot de passe oublié</button>
        </div>
        <p className="pt-2 text-sm text-slate-600 dark:text-slate-400">
          Pas encore de compte ? <button type="button" onClick={onSignup} className="font-bold text-brand-blue dark:text-sky-300 underline">Créer mon compte gratuit</button>
        </p>
      </form>
    </section>
  );
}
