import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LockKeyhole, LogIn } from 'lucide-react';
import { useSite } from '../lib/site';
import { api } from '../lib/api';
import { navigate } from '../lib/router';
import { EASE } from '../components/Motion';

export default function Login() {
  const { session, setSession } = useSite();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (session.admin) navigate('/admin'); }, [session.admin]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try { const s = await api.login(email, password); setSession(s); navigate('/admin'); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="login-wrap container">
      <motion.form className="login-card" onSubmit={submit} initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: EASE }}>
        <span className="lock"><LockKeyhole /></span>
        <div style={{ display: 'grid', gap: 6 }}>
          <h1 style={{ fontSize: 26 }}>Espace administrateur</h1>
          <p className="muted">Réservé à l'administrateur principal de CapDev. Une fois connecté, l'onglet « Administration » apparaît dans le menu.</p>
        </div>
        <div className="form">
          <div className="field"><label htmlFor="login-email">E-mail</label><input id="login-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div className="field"><label htmlFor="login-pass">Mot de passe</label><input id="login-pass" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          {error && <div className="notice err" role="alert">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={busy} style={{ justifyContent: 'center' }}><LogIn /> {busy ? 'Connexion…' : 'Se connecter'}</button>
        </div>
      </motion.form>
    </div>
  );
}
