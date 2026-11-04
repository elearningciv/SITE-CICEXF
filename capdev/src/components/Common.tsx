import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Send } from 'lucide-react';
import { Link } from '../lib/router';
import { NAV } from '../lib/nav';
import { useSite } from '../lib/site';
import { api } from '../lib/api';
import { BrandMark } from './Header';
import { ContourLines, EASE } from './Motion';

export function PageHero({ eyebrow, title, lead, sub }: { eyebrow: string; title: string; lead?: string; sub?: { label: string; to: string }[] }) {
  const { t } = useSite();
  return (
    <section className="page-hero on-deep">
      <ContourLines />
      <div className="container">
        <motion.nav className="crumbs" aria-label={t("Fil d'Ariane")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Link to="/">{t('Accueil')}</Link><span>/</span><span>{eyebrow}</span>
        </motion.nav>
        <motion.h1 className="h-xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>{title}</motion.h1>
        {lead && <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}>{lead}</motion.p>}
        {sub && sub.length > 0 && (
          <motion.div className="subnav" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.22 }}>
            {sub.map((s, i) => <Link key={i} to={s.to}>{s.label}</Link>)}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead, action }: { eyebrow?: string; title: string; lead?: string; action?: React.ReactNode }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="h-lg">{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

/** Public form; every submission lands in Administration › Messages */
export function MessageForm({ kind, subject, subjects, cta }: { kind: 'contact' | 'inscription' | 'etude' | 'partenariat'; subject?: string; subjects?: string[]; cta?: string }) {
  const { t } = useSite();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = { kind };
    fd.forEach((v, k) => { data[k] = String(v); });
    if (subject && !data.subject) data.subject = subject;
    if (data.organisation) data.message = `${data.message}\n\nOrganisation : ${data.organisation}`;
    setState('sending');
    try {
      await api.sendMessage(data);
      setState('sent');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError((err as Error).message); setState('error');
    }
  };
  const id = (n: string) => `${kind}-${n}`;
  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="row">
        <div className="field"><label htmlFor={id('name')}>{t('Nom et prénom')}</label><input id={id('name')} name="name" required autoComplete="name" /></div>
        <div className="field"><label htmlFor={id('org')}>{t('Organisation')}</label><input id={id('org')} name="organisation" autoComplete="organization" /></div>
      </div>
      <div className="row">
        <div className="field"><label htmlFor={id('email')}>{t('E-mail')}</label><input id={id('email')} name="email" type="email" autoComplete="email" /></div>
        <div className="field"><label htmlFor={id('phone')}>{t('Téléphone ou WhatsApp')}</label><input id={id('phone')} name="phone" type="tel" autoComplete="tel" /></div>
      </div>
      {subjects && (
        <div className="field"><label htmlFor={id('subject')}>{t('Objet')}</label>
          <select id={id('subject')} name="subject" defaultValue={subject || subjects[0]}>{subjects.map(s => <option key={s} value={s}>{t(s)}</option>)}</select>
        </div>
      )}
      <div className="field"><label htmlFor={id('message')}>{t('Votre message')}</label><textarea id={id('message')} name="message" required /></div>
      <div className="hp" aria-hidden="true"><label htmlFor={id('website')}>Site</label><input id={id('website')} name="website" tabIndex={-1} autoComplete="off" /></div>
      {state === 'sent' && <div className="notice ok" role="status">{t("Merci, votre message a bien été envoyé. L'équipe vous répondra rapidement.")}</div>}
      {state === 'error' && <div className="notice err" role="alert">{t(error)}</div>}
      <div><button className="btn btn-primary" type="submit" disabled={state === 'sending'}>{state === 'sending' ? t('Envoi…') : (cta || t('Envoyer'))} <Send /></button></div>
    </form>
  );
}

export function Footer() {
  const { content, t } = useSite();
  const s = content?.settings;
  const [news, setNews] = useState<'idle' | 'ok' | 'err'>('idle');
  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email') || '');
    try { await api.sendMessage({ kind: 'contact', name: 'Abonné(e) lettre', email, subject: "Inscription à la lettre d'information", message: `Inscription : ${email}` }); setNews('ok'); }
    catch { setNews('err'); }
  };
  return (
    <footer className="footer on-deep">
      <div className="container">
        <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <Link to="/" className="brand"><BrandMark /><span><span className="brand-name">{s?.siteName}</span></span></Link>
          <p>{t(s?.fullName || '')}</p>
          <p>{t(s?.address || '')}<br />{t(s?.phone || '')}<br />{s?.email}</p>
        </div>
        <div>
          <h5>{t("L'Institut")}</h5>
          <ul>{NAV.slice(0, 5).map(n => <li key={n.id}><Link to={n.path}>{t(n.label)}</Link></li>)}</ul>
        </div>
        <div>
          <h5>{t('Ressources')}</h5>
          <ul>{NAV.slice(5).map(n => <li key={n.id}><Link to={n.path}>{t(n.label)}</Link></li>)}</ul>
        </div>
        <div>
          <h5>{t("Lettre d'information")}</h5>
          <p>{t(s?.newsletterText || '')}</p>
          <form className="news-form" onSubmit={subscribe}>
            <label htmlFor="nl-email" className="hp">E-mail</label>
            <input id="nl-email" name="email" type="email" required placeholder={t('Votre e-mail')} />
            <button className="btn btn-accent" type="submit" style={{ padding: '9px 14px' }}><ArrowRight /></button>
          </form>
          {news === 'ok' && <p style={{ marginTop: 8, color: 'var(--accent)' }}>{t('Inscription enregistrée, merci.')}</p>}
          {news === 'err' && <p style={{ marginTop: 8 }}>{t("L'inscription n'a pas abouti. Vérifiez l'adresse et réessayez.")}</p>}
        </div>
        <div className="legal">
          <span>© {new Date().getFullYear()} {s?.siteName}. {t('Tous droits réservés.')}</span>
          <Link to="/connexion">{t('Espace administrateur')}</Link>
        </div>
      </div>
    </footer>
  );
}
