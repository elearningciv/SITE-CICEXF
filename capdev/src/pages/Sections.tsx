import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, Clock, MapPin, Mail, Phone } from 'lucide-react';
import { Link } from '../lib/router';
import { useSite, LANGUAGES } from '../lib/site';
import { Counter, EASE, Item, Reveal, Stagger } from '../components/Motion';
import { MessageForm, PageHero, SectionHead } from '../components/Common';
import { AxeGlyph } from './shared';


// ---------------- L'Institut ----------------
export function Institut() {
  const { content, t, lang } = useSite();
  if (!content) return null;
  const s = content.settings;
  return (
    <>
      <PageHero eyebrow={t("L'Institut")} title={t('Qui nous sommes')} lead={t(s.fullName)} />
      <section className="section" id="mission">
        <div className="container grid g-2" style={{ gap: 48 }}>
          <Reveal><SectionHead eyebrow={t('Mission')} title={t('Notre mission')} /><div className="prose"><p>{t(s.mission)}</p></div></Reveal>
          <Reveal delay={0.1}><SectionHead eyebrow={t('Vision')} title={t('Notre vision')} /><div className="prose"><p>{t(s.vision)}</p></div></Reveal>
        </div>
      </section>
      <section className="section" id="mot" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">{t('Mot du Directeur')}</span>
            <blockquote style={{ margin: '20px 0 0', fontFamily: 'var(--f-body)', fontSize: 'clamp(21px, 2.4vw, 30px)', lineHeight: 1.45, maxWidth: '38em', borderLeft: '4px solid var(--accent)', paddingLeft: 28 }}>
              « {t(s.directorWord)} »
              <footer style={{ fontFamily: 'var(--f-display)', fontSize: 15, fontWeight: 700, marginTop: 18, color: 'var(--primary)' }}>{t(s.directorName)}</footer>
            </blockquote>
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container grid g-2" style={{ gap: 48 }}>
          <Reveal><div id="historique" /><SectionHead eyebrow={t('Historique')} title={t('Notre histoire')} /><div className="prose"><p>{t(s.history)}</p></div></Reveal>
          <Reveal delay={0.1}><div id="gouvernance" /><SectionHead eyebrow={t('Gouvernance')} title={t('Organisation')} /><div className="prose"><p>{t(s.governance)}</p></div></Reveal>
        </div>
      </section>
      <section className="section" id="chiffres" style={{ paddingTop: 0 }}>
        <div className="container">
          <Stagger className="stats" >
            {s.stats.map((st, i) => <Item key={i} className="stat"><Counter value={st.value} locale={LANGUAGES[lang]?.locale || 'fr-FR'} /><span>{t(st.label)}</span></Item>)}
          </Stagger>
        </div>
      </section>
    </>
  );
}

// ---------------- Recherche ----------------
export function Recherche() {
  const { content, t } = useSite();
  if (!content) return null;
  const running = content.projects.filter(p => p.status !== 'Terminé');
  const done = content.projects.filter(p => p.status === 'Terminé');
  const axe = (id: string) => content.axes.find(a => a.id === id);
  const ProjectCard = ({ p }: { p: typeof content.projects[number] }) => (
    <Item className="card hover">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span className={`tag${p.status === 'Terminé' ? '' : ' accent'}`}>{t(p.status)}</span><span className="mono muted">{p.period}</span>
      </div>
      <h3>{t(p.title)}</h3>
      <p>{t(p.summary)}</p>
      <div className="foot"><span>{axe(p.axe) ? t(axe(p.axe)!.title) : ''}</span><span>{t(p.partners)}</span></div>
    </Item>
  );
  return (
    <>
      <PageHero eyebrow={t('Recherche')} title={t('Axes, programmes et projets')} lead={t('Nos travaux sont organisés en six axes. Chaque axe réunit des docteurs et des chercheurs associés autour de projets financés.')} />
      <section className="section" id="axes">
        <div className="container">
          <SectionHead eyebrow={t('Programmes')} title={t('Les axes de recherche')} />
          <div className="grid" style={{ gap: 14 }}>
            {content.axes.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.04}>
                <article id={a.id} className="card" style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', gap: 22, alignItems: 'start' }}>
                  <AxeGlyph index={i} />
                  <div style={{ display: 'grid', gap: 8 }}>
                    <span className="axe-code">{t(a.code)}</span>
                    <h3 style={{ fontSize: 22 }}>{t(a.title)}</h3>
                    <p style={{ fontFamily: 'var(--f-body)', fontSize: 16.5 }}>{t(a.description || a.summary)}</p>
                    <div className="foot" style={{ marginTop: 6 }}>
                      <span>{content.projects.filter(p => p.axe === a.id).length} {t('projets')}</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="projets" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead eyebrow={t('Projets')} title={t('Projets en cours')} />
          <Stagger className="grid g-2">{running.map(p => <ProjectCard key={p.id} p={p} />)}</Stagger>
        </div>
      </section>
      <section className="section" id="termines">
        <div className="container">
          <SectionHead eyebrow={t('Archives')} title={t('Projets terminés')} />
          {done.length ? <Stagger className="grid g-2">{done.map(p => <ProjectCard key={p.id} p={p} />)}</Stagger> : <p className="muted">{t('Aucun projet terminé publié pour le moment.')}</p>}
        </div>
      </section>
    </>
  );
}

// ---------------- Formations ----------------
export function Formations() {
  const { content, t, fmtDate } = useSite();
  const [chosen, setChosen] = useState('');
  if (!content) return null;
  const dated = content.formations.filter(f => f.date).sort((a, b) => a.date.localeCompare(b.date));
  return (
    <>
      <PageHero eyebrow={t('Formations')} title={t('Renforcement des capacités')} lead={t('Formations courtes et séminaires méthodologiques pour chercheurs, cadres et institutions.')} />
      <section className="section" id="catalogue">
        <div className="container">
          <SectionHead eyebrow={t('Catalogue')} title={t('Catalogue des formations')} />
          <Stagger className="grid g-2">
            {content.formations.map(f => (
              <Item key={f.id} className="card hover">
                <span className={`tag${f.status === 'Inscriptions ouvertes' ? ' accent' : ''}`} style={{ justifySelf: 'start' }}>{t(f.status)}</span>
                <h3 style={{ fontSize: 21 }}>{t(f.title)}</h3>
                <p style={{ fontFamily: 'var(--f-body)', fontSize: 16 }}>{t(f.summary)}</p>
                <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', color: 'var(--muted)', fontSize: 14, fontWeight: 600 }}>
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Clock size={15} /> {t(f.duration)}</span>
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><MapPin size={15} /> {t(f.mode)}</span>
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><CalendarDays size={15} /> {f.date ? fmtDate(f.date) : t('Sur demande')}</span>
                </div>
                <div className="foot"><span>{t(f.price)}</span>
                  <Link to="/formations#inscription" className="link-arrow" onClick={() => setChosen(f.title)}>{t("S'inscrire")} <ArrowRight /></Link>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="section" id="calendrier" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead eyebrow={t('Calendrier')} title={t('Prochaines sessions')} />
          <div className="band on-deep">
            {dated.map((f, i) => (
              <motion.div key={f.id} className="event" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}>
                <div className="d"><b>{fmtDate(f.date, { day: '2-digit' })}</b><span>{fmtDate(f.date, { month: 'short', year: '2-digit' })}</span></div>
                <div><h4>{t(f.title)}</h4><p>{t(f.duration)} · {t(f.mode)} · {t(f.status)}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="inscription">
        <div className="container grid split" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.3fr)', gap: 48 }}>
          <SectionHead eyebrow={t('Inscription')} title={t('Inscription en ligne')} lead={t("Choisissez la formation, laissez vos coordonnées : l'équipe vous confirme la session et les modalités.")} />
          <MessageForm key={chosen} kind="inscription" subject={chosen || content.formations[0]?.title} subjects={content.formations.map(f => f.title)} cta={t("Envoyer ma demande d'inscription")} />
        </div>
      </section>
    </>
  );
}

// ---------------- Contact ----------------
export function Contact() {
  const { content, t } = useSite();
  if (!content) return null;
  const s = content.settings;
  return (
    <>
      <PageHero eyebrow={t('Contact')} title={t('Écrivez-nous')} lead={t('Une question, une demande de partenariat, une proposition de collaboration : nous vous répondons.')} />
      <section className="section" id="formulaire">
        <div className="container grid split" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: 48 }}>
          <Reveal>
            <div className="grid" style={{ gap: 18 }}>
              {[[MapPin, t(s.address)], [Phone, t(s.phone)], [Mail, s.email], [Clock, t(s.hours)]].map(([Icon, text], i) => {
                const I = Icon as typeof MapPin;
                return <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}><span className="axe-glyph"><I /></span><span style={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{text as string}</span></div>;
              })}
            </div>
          </Reveal>
          <MessageForm kind="contact" subjects={[t("Demande d'information"), t('Partenariat'), t('Presse'), t('Autre')]} />
        </div>
      </section>
      <section className="section" id="partenaires" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead eyebrow={t('Réseau')} title={t('Nos partenaires')} lead={t('Universités, institutions publiques, bailleurs et réseaux de recherche.')} />
          <Stagger className="grid g-3">
            {content.partners.map(p => (
              <Item key={p.id} className="card">
                {p.logo && <img src={p.logo} alt="" style={{ maxHeight: 56, width: 'auto', objectFit: 'contain', alignSelf: 'start' }} />}
                <span className="axe-code">{t(p.kind)}</span>
                <h3>{t(p.name)}</h3>
                {p.url && <a className="link-arrow" href={p.url} target="_blank" rel="noreferrer">{t('Site web')} <ArrowRight /></a>}
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  const { t } = useSite();
  return (
    <>
      <PageHero eyebrow="404" title={t('Page introuvable')} lead={t("Cette adresse n'existe pas ou a changé.")} />
      <section className="section"><div className="container"><Link to="/" className="btn btn-primary">{t("Retour à l'accueil")} <ArrowRight /></Link></div></section>
    </>
  );
}
