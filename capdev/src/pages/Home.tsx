import React, { useState } from 'react';
import type { Publication } from '../types';
import { PubCard, PubModal, ProtectedPhoto } from '../components/PubCard';
import { motion } from 'motion/react';
import { ArrowRight, Phone } from 'lucide-react';
import AxesCarousel from '../components/AxesCarousel';
import heroDefault from '../assets/hero-default.webp';
import { Link } from '../lib/router';
import { useSite, LANGUAGES } from '../lib/site';
import { Counter, EASE, Item, NetworkCanvas, Reveal, Stagger } from '../components/Motion';
import { SectionHead } from '../components/Common';

export default function Home() {
  const { content, t, fmtDate, lang } = useSite();
  const [openPub, setOpenPub] = useState<Publication | null>(null);
  if (!content) return null;
  const s = content.settings;
  const pubs = [...content.publications].sort((a, b) => (b.publicationYear || '').localeCompare(a.publicationYear || ''));
  const today = new Date().toISOString().slice(0, 10);
  const events = [...content.events].filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const locale = LANGUAGES[lang]?.locale || 'fr-FR';

  return (
    <>
      <section className="hero2">
        <div className="hero2-photo">
          <motion.img src={s.heroImage || heroDefault} alt="" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: EASE }} />
        </div>
        <div className="container hero2-inner">
          <motion.div className="hero2-disc on-deep" initial={{ opacity: 0, scale: 0.82, x: -40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>
            <NetworkCanvas density={0.35} />
            <div className="hero2-text">
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}>
                {t(s.heroTitle)}<br /><span>{t(s.heroHighlight)}</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}>{t(s.heroLead)}</motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.95 }} style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
                <Link to="/publications" className="btn btn-accent">{t(s.heroCta)} <ArrowRight /></Link>
                <span className="hero2-phone"><Phone size={17} /> {t(s.phone)}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Stagger className="stats">
        {s.stats.map((st, i) => (
          <Item key={i} className="stat"><Counter value={st.value} locale={locale} /><span>{t(st.label)}</span></Item>
        ))}
      </Stagger>

      <section className="section">
        <div className="container">
          <Reveal className="word">
            <ProtectedPhoto src={s.directorPhoto} alt={t(s.directorName)} />
            <div style={{ display: 'grid', gap: 14 }}>
              <span className="eyebrow">{t('Mot du Responsable de CapDev')}</span>
              <blockquote>« {t(s.directorWord)} »<footer>{t(s.directorName)}</footer></blockquote>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="axes">
        <div className="container">
          <h2 className="title-lines">{t('Nos axes de recherche')}</h2>
          <AxesCarousel />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow={t('Bibliothèque')} title={t('Publications récentes')} action={<Link to="/publications" className="link-arrow">{t('Toutes les publications')} <ArrowRight /></Link>} />
          <Stagger className="pub-grid one-row">
            {pubs.slice(0, 4).map(p => <Item key={p.id}><PubCard pub={p} onOpen={() => setOpenPub(p)} /></Item>)}
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
          <SectionHead eyebrow={t('Renforcement des capacités')} title={t('Accompagnement')} lead={t('Des formations courtes, en présentiel, en ligne ou hybrides, conçues par nos chercheurs.')}
            action={<Link to="/accompagnement" className="link-arrow">{t('Tout l\'accompagnement')} <ArrowRight /></Link>} />
          <Stagger className="grid g-fit">
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
