import React, { useState } from 'react';
import type { Publication } from '../types';
import { PubCard, PubModal } from '../components/PubCard';
import { motion } from 'motion/react';
import { ArrowRight, Search } from 'lucide-react';
import { Link, navigate } from '../lib/router';
import { useSite, LANGUAGES } from '../lib/site';
import { Counter, EASE, Item, NetworkCanvas, Reveal, Stagger } from '../components/Motion';
import { SectionHead } from '../components/Common';
import { AxeGlyph } from './shared';

export default function Home() {
  const { content, t, fmtDate, lang, openAssistant } = useSite();
  const [q, setQ] = useState('');
  const [openPub, setOpenPub] = useState<Publication | null>(null);
  if (!content) return null;
  const s = content.settings;
  const pubs = [...content.publications].sort((a, b) => (b.publicationYear || '').localeCompare(a.publicationYear || ''));
  const featured = pubs[0];
  const today = new Date().toISOString().slice(0, 10);
  const events = [...content.events].filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const titleWords = t(s.heroTitle).split(' ');
  const locale = LANGUAGES[lang]?.locale || 'fr-FR';

  return (
    <>
      <section className="hero on-deep">
        <NetworkCanvas />
        <div className="container">
          <div>
            <motion.span className="eyebrow" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: EASE }}>{t(s.heroEyebrow)}</motion.span>
            <h1 className="h-xl" style={{ marginTop: 18 }}>
              {titleWords.map((w, i) => (
                <motion.span key={i} className="word" initial={{ opacity: 0, y: 40, rotateX: -40 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.06 }}>{w}&nbsp;</motion.span>
              ))}
              <motion.mark initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 + titleWords.length * 0.06 }}>
                {t(s.heroHighlight)}
                <motion.span className="sweep" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.5 + titleWords.length * 0.06 }} />
              </motion.mark>
            </h1>
            <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}>{t(s.heroLead)}</motion.p>
            <motion.form className="hero-search" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
              onSubmit={e => { e.preventDefault(); if (q.trim()) openAssistant(q); }}>
              <label htmlFor="hero-q" className="hp">{t('Rechercher')}</label>
              <input id="hero-q" value={q} onChange={e => setQ(e.target.value)} placeholder={t('Une publication, un chercheur, une formation…')} />
              <button className="btn btn-accent" type="submit"><Search /> {t('Rechercher')}</button>
            </motion.form>
            <motion.div className="hero-chips" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.9 } } }}>
              {[
                [t('Policy briefs'), '/publications#policy-brief'],
                [t('Formations'), '/formations'],
                [t('Appels et bourses'), '/actualites#opportunites'],
                [t('Demander une étude'), '/expertise#demande']
              ].map(([label, to]) => (
                <motion.button key={to} type="button" onClick={() => navigate(to)} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>{label}</motion.button>
              ))}
            </motion.div>
          </div>

          {featured && (
            <motion.article className="feature-card" initial={{ opacity: 0, y: 40, rotate: 1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}>
              <div className="top"><span className="tag accent">{t('À la une')}</span><span className="mono muted">{featured.reference}</span></div>
              <Sparkline />
              <span className="tag" style={{ justifySelf: 'start' }}>{t(featured.type)}</span>
              <h3>{t(featured.title)}</h3>
              <p className="muted" style={{ fontFamily: 'var(--f-body)' }}>{t(featured.description)}</p>
              <div className="meta"><span>{t(featured.authors)}</span><span>{t('Publié en')} {featured.publicationYear}</span></div>
              <button type="button" className="link-arrow" style={{ background: 'none', border: 0, padding: 0, justifySelf: 'start' }} onClick={() => setOpenPub(featured)}>{t('Lire la publication')} <ArrowRight /></button>
            </motion.article>
          )}
        </div>
      </section>

      <Stagger className="stats">
        {s.stats.map((st, i) => (
          <Item key={i} className="stat"><Counter value={st.value} locale={locale} /><span>{t(st.label)}</span></Item>
        ))}
      </Stagger>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t('Recherche')} title={t('Nos axes de recherche')} lead={t('Six programmes qui structurent nos travaux, de la gouvernance au climat.')}
            action={<Link to="/recherche" className="link-arrow">{t('Tous les programmes')} <ArrowRight /></Link>} />
          <Stagger className="grid g-3">
            {content.axes.map((a, i) => {
              const n = content.projects.filter(p => p.axe === a.id && p.status === 'En cours').length;
              return (
                <Item key={a.id} className="card hover" whileHover={{ y: -4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><AxeGlyph index={i} /><span className="axe-code">{t(a.code)}</span></div>
                  <h3>{t(a.title)}</h3>
                  <p>{t(a.summary)}</p>
                  <div className="foot"><span>{n} {n > 1 ? t('projets en cours') : t('projet en cours')}</span><Link to={`/recherche#${a.id}`} className="link-arrow">{t('Découvrir')} <ArrowRight /></Link></div>
                </Item>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow={t('Bibliothèque')} title={t('Publications récentes')} action={<Link to="/publications" className="link-arrow">{t('Toutes les publications')} <ArrowRight /></Link>} />
          <Stagger className="pub-grid">
            {pubs.slice(0, 3).map(p => <Item key={p.id}><PubCard pub={p} onOpen={() => setOpenPub(p)} /></Item>)}
          </Stagger>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="band on-deep">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
              <div><span className="eyebrow">{t('Agenda')}</span><h3 className="h-md" style={{ margin: '12px 0 8px', color: 'var(--on-deep)' }}>{t('Agenda scientifique')}</h3></div>
              <Link to="/actualites#agenda" className="link-arrow" style={{ color: 'var(--accent)' }}>{t("Tout l'agenda")} <ArrowRight /></Link>
            </div>
            {events.length === 0 && <p className="muted">{t('Aucun événement programmé pour le moment.')}</p>}
            <div className="grid g-2" style={{ columnGap: 40, rowGap: 0 }}>
              {events.map((e, i) => (
                <motion.div key={e.id} className="event" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i + 0.2, duration: 0.6, ease: EASE }}>
                  <div className="d"><b>{fmtDate(e.date, { day: '2-digit' })}</b><span>{fmtDate(e.date, { month: 'short' })}</span></div>
                  <div><h4>{t(e.title)}</h4><p>{t(e.kind)} · {t(e.place)}</p></div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead eyebrow={t('Renforcement des capacités')} title={t('Formations et séminaires')} lead={t('Des formations courtes, en présentiel, en ligne ou hybrides, conçues par nos chercheurs.')}
            action={<Link to="/formations" className="link-arrow">{t('Catalogue des formations')} <ArrowRight /></Link>} />
          <Stagger className="grid g-4">
            {content.formations.slice(0, 4).map(f => (
              <Item key={f.id} className="card hover" whileHover={{ y: -4 }}>
                <span className={`tag${f.status === 'Inscriptions ouvertes' ? ' accent' : ''}`} style={{ justifySelf: 'start', alignSelf: 'start' }}>{t(f.status)}</span>
                <h3>{t(f.title)}</h3>
                <p>{t(f.summary)}</p>
                <div className="foot"><span>{t(f.duration)} · {t(f.mode)}</span><span>{f.date ? fmtDate(f.date, { day: 'numeric', month: 'short' }) : t('Sur demande')}</span></div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="band cta-band">
            <div style={{ display: 'grid', gap: 10 }}>
              <h2 className="h-lg" style={{ color: 'var(--on-primary)' }}>{t('Une étude, une évaluation, un partenariat de recherche ?')}</h2>
              <p className="lead">{t("CapDev réalise des études commanditées et accompagne les institutions dans la conception et l'évaluation de leurs programmes.")}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/expertise#demande" className="btn btn-accent">{t('Demander une étude')} <ArrowRight /></Link>
              <Link to="/contact" className="btn btn-ghost" style={{ color: 'var(--on-primary)' }}>{t('Nous écrire')}</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow={t('Réseau')} title={t('Ils travaillent avec nous')} />
        </div>
        <div className="marquee">
          <div className="marquee-track">
            {[...content.partners, ...content.partners].map((p, i) => (
              <div key={i} className="partner" aria-hidden={i >= content.partners.length}>
                {p.logo ? <img src={p.logo} alt={p.name} /> : <span><small>{t(p.kind)}</small>{t(p.name)}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <PubModal pub={openPub} onClose={() => setOpenPub(null)} />
    </>
  );
}

/** Small animated chart on the featured publication: a trend drawing itself */
function Sparkline() {
  const pts = [12, 18, 15, 24, 22, 31, 29, 38, 36, 45, 50, 48, 57];
  const w = 300, h = 64;
  const x = (i: number) => (i / (pts.length - 1)) * w;
  const y = (v: number) => h - 6 - (v / 60) * (h - 12);
  const d = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <motion.path d={`${d} L${w} ${h} L0 ${h} Z`} fill="var(--primary-soft)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }} />
      <motion.path d={d} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 1.6, ease: EASE }} />
      <motion.circle cx={x(pts.length - 1)} cy={y(pts[pts.length - 1])} r="4.5" fill="var(--accent)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.4, type: 'spring' }} />
    </svg>
  );
}
