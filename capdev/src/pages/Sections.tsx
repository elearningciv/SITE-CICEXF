import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CalendarDays, Clock, FileText, MapPin, Mail, Phone, Search } from 'lucide-react';
import { Link, useLocation } from '../lib/router';
import { useSite, LANGUAGES } from '../lib/site';
import { NAV, slug } from '../lib/nav';
import { Counter, EASE, Item, Reveal, Stagger } from '../components/Motion';
import { MessageForm, PageHero, SectionHead } from '../components/Common';
import { AxeGlyph, initials } from './shared';

const sub = (id: string, t: (s: string) => string) => (NAV.find(n => n.id === id)?.items || []).map(i => ({ label: t(i.label), to: i.to }));

// ---------------- L'Institut ----------------
export function Institut() {
  const { content, t, lang } = useSite();
  if (!content) return null;
  const s = content.settings;
  return (
    <>
      <PageHero eyebrow={t("L'Institut")} title={t('Qui nous sommes')} lead={t(s.fullName)} sub={sub('institut', t)} />
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
      <PageHero eyebrow={t('Recherche')} title={t('Axes, programmes et projets')} lead={t('Nos travaux sont organisés en six axes. Chaque axe réunit chercheurs permanents, associés et doctorants autour de projets financés.')} sub={sub('recherche', t)} />
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
                      <span>{content.projects.filter(p => p.axe === a.id).length} {t('projets')} · {content.publications.filter(p => p.axe === a.id).length} {t('publications')}</span>
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

// ---------------- Publications ----------------
export function Publications() {
  const { content, t, fmtDate } = useSite();
  const { hash } = useLocation();
  const [q, setQ] = useState('');
  const [type, setType] = useState<string>('');
  const [axe, setAxe] = useState<string>('');
  const types = useMemo(() => [...new Set((content?.publications || []).map(p => p.type))], [content]);
  useEffect(() => { const m = types.find(ty => slug(ty) === hash); setType(m || ''); }, [hash, types]);
  if (!content) return null;
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const list = [...content.publications]
    .filter(p => (!type || p.type === type) && (!axe || p.axe === axe))
    .filter(p => !q || norm(`${p.title} ${t(p.title)} ${p.authors} ${p.reference} ${p.summary}`).includes(norm(q)))
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero eyebrow={t('Publications')} title={t('Bibliothèque numérique')} lead={t('Articles, documents de travail, policy briefs et rapports, en accès libre.')} />
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gap: 16, marginBottom: 28 }}>
            <div className="field" style={{ maxWidth: 560 }}>
              <label htmlFor="pub-q">{t('Rechercher dans les publications')}</label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
                <input id="pub-q" value={q} onChange={e => setQ(e.target.value)} placeholder={t('Titre, auteur, référence…')} style={{ paddingLeft: 42 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className={`chip${!type ? ' active' : ''}`} onClick={() => setType('')}>{t('Tous les types')}</button>
              {types.map(ty => <button key={ty} type="button" className={`chip${type === ty ? ' active' : ''}`} onClick={() => setType(ty)}>{t(ty)}</button>)}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className={`chip${!axe ? ' active' : ''}`} onClick={() => setAxe('')}>{t('Tous les axes')}</button>
              {content.axes.map(a => <button key={a.id} type="button" className={`chip${axe === a.id ? ' active' : ''}`} onClick={() => setAxe(a.id)}>{t(a.code)}</button>)}
            </div>
          </div>
          <p className="muted" style={{ marginBottom: 8, fontWeight: 600 }} aria-live="polite">{list.length} {list.length > 1 ? t('publications') : t('publication')}</p>
          <motion.div className="pub-list" layout>
            <AnimatePresence initial={false}>
              {list.map(p => (
                <motion.article key={p.id} className="pub" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                  <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}><span className="tag">{t(p.type)}</span><span className="date">{fmtDate(p.date)}</span></div>
                  <div>
                    <h3>{t(p.title)}</h3>
                    <p className="by">{t(p.authors)}</p>
                    <p className="muted" style={{ fontFamily: 'var(--f-body)', marginTop: 8 }}>{t(p.summary)}</p>
                    <p className="ref mono">{p.reference}</p>
                  </div>
                  {p.link ? <a className="btn btn-ghost" href={p.link} target="_blank" rel="noreferrer"><FileText /> {t('Télécharger')}</a> : <span className="chip">{t('PDF bientôt disponible')}</span>}
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
          {!list.length && <p className="muted" style={{ paddingBlock: 24 }}>{t('Aucune publication ne correspond à votre recherche.')}</p>}
        </div>
      </section>
    </>
  );
}

// ---------------- Chercheurs ----------------
export function Chercheurs() {
  const { content, t } = useSite();
  if (!content) return null;
  const cats = [...new Set(content.researchers.map(r => r.category))];
  return (
    <>
      <PageHero eyebrow={t('Chercheurs')} title={t("L'équipe scientifique")} lead={t('Direction, chercheurs permanents, associés et doctorants.')} sub={cats.map(c => ({ label: t(c), to: `/chercheurs#${slug(c)}` }))} />
      {cats.map((c, ci) => (
        <section key={c} className="section tight" id={slug(c)} style={ci % 2 ? { background: 'var(--surface)', borderBlock: '1px solid var(--line)' } : undefined}>
          <div className="container">
            <SectionHead title={t(c)} />
            <Stagger className="grid g-3">
              {content.researchers.filter(r => r.category === c).map(r => (
                <Item key={r.id} className="card hover">
                  <div className="person">
                    <span className="avatar">{r.photo ? <img src={r.photo} alt="" /> : initials(r.name)}</span>
                    <div style={{ display: 'grid', gap: 4 }}>
                      <h3>{t(r.name)}</h3>
                      <span style={{ color: 'var(--primary)', fontWeight: 650, fontSize: 14 }}>{t(r.title)}</span>
                      <p>{t(r.bio)}</p>
                      {r.axe && <span className="axe-code">{t(content.axes.find(a => a.id === r.axe)?.title || '')}</span>}
                    </div>
                  </div>
                </Item>
              ))}
            </Stagger>
          </div>
        </section>
      ))}
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
      <PageHero eyebrow={t('Formations')} title={t('Renforcement des capacités')} lead={t('Formations courtes et séminaires méthodologiques pour chercheurs, cadres et institutions.')} sub={sub('formations', t)} />
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

// ---------------- Expertise ----------------
export function Expertise() {
  const { content, t } = useSite();
  if (!content) return null;
  return (
    <>
      <PageHero eyebrow={t('Expertise')} title={t('Études, évaluations et appui aux institutions')} lead={t('Nous mettons la rigueur de la recherche au service de vos décisions.')} sub={sub('expertise', t)} />
      <section className="section" id="services">
        <div className="container">
          <SectionHead eyebrow={t('Services')} title={t('Nos services')} />
          <Stagger className="grid g-2">
            {content.services.map((x, i) => (
              <Item key={x.id} className="card hover">
                <span className="axe-code">{String(i + 1).padStart(2, '0')}</span>
                <h3 style={{ fontSize: 21 }}>{t(x.title)}</h3>
                <p style={{ fontFamily: 'var(--f-body)', fontSize: 16 }}>{t(x.summary)}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="section" id="demande" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container grid split" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.3fr)', gap: 48 }}>
          <SectionHead eyebrow={t('Demande')} title={t('Demander une étude')} lead={t("Décrivez votre besoin : objectifs, terrain, calendrier. Nous revenons vers vous avec une proposition.")} />
          <MessageForm kind="etude" subjects={[t('Étude ou enquête'), t('Évaluation de programme'), t('Appui aux politiques publiques'), t('Renforcement institutionnel'), t('Partenariat de recherche')]} cta={t('Envoyer la demande')} />
        </div>
      </section>
    </>
  );
}

// ---------------- Actualités ----------------
export function Actualites() {
  const { content, t, fmtDate } = useSite();
  if (!content) return null;
  const news = [...content.news].sort((a, b) => b.date.localeCompare(a.date));
  const events = [...content.events].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <>
      <PageHero eyebrow={t('Actualités')} title={t("La vie de l'institut")} lead={t('Nouvelles, restitutions, colloques et séminaires.')} sub={sub('actualites', t)} />
      <section className="section" id="actualites">
        <div className="container">
          <Stagger className="grid g-3">
            {news.map(n => (
              <Item key={n.id} className="card hover">
                {n.image && <img className="cover" src={n.image} alt="" />}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}><span className="tag">{t(n.category)}</span><span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{fmtDate(n.date)}</span></div>
                <h3>{t(n.title)}</h3>
                <p>{t(n.summary)}</p>
                {n.body && <p style={{ fontFamily: 'var(--f-body)' }}>{t(n.body)}</p>}
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="section" id="agenda" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow={t('Agenda')} title={t('Agenda des événements')} />
          <div className="band on-deep">
            {events.map((e, i) => (
              <motion.div key={e.id} className="event" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}>
                <div className="d"><b>{fmtDate(e.date, { day: '2-digit' })}</b><span>{fmtDate(e.date, { month: 'short', year: '2-digit' })}</span></div>
                <div><h4>{t(e.title)}</h4><p>{t(e.kind)} · {t(e.place)}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ---------------- Opportunités ----------------
export function Opportunites() {
  const { content, t, fmtDate } = useSite();
  if (!content) return null;
  const today = new Date().toISOString().slice(0, 10);
  const list = [...content.opportunities].sort((a, b) => a.deadline.localeCompare(b.deadline));
  return (
    <>
      <PageHero eyebrow={t('Opportunités')} title={t('Appels, bourses et stages')} lead={t('Pour les chercheurs, les étudiants et les partenaires.')} sub={sub('opportunites', t)} />
      <section className="section" id="liste">
        <div className="container">
          <Stagger className="grid g-3">
            {list.map(o => {
              const open = !o.deadline || o.deadline >= today;
              return (
                <Item key={o.id} className="card hover">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}><span className="tag">{t(o.kind)}</span><span className={`tag${open ? ' accent' : ''}`}>{open ? t('Ouvert') : t('Clôturé')}</span></div>
                  <h3>{t(o.title)}</h3>
                  <p>{t(o.summary)}</p>
                  <div className="foot"><span>{t('Date limite')} : {o.deadline ? fmtDate(o.deadline) : '—'}</span></div>
                </Item>
              );
            })}
          </Stagger>
        </div>
      </section>
      <section className="section" id="candidater" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container grid split" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.3fr)', gap: 48 }}>
          <SectionHead eyebrow={t('Candidater')} title={t('Manifester votre intérêt')} lead={t('Indiquez l\'opportunité visée et présentez-vous en quelques lignes. Nous vous enverrons le dossier complet.')} />
          <MessageForm kind="contact" subjects={content.opportunities.map(o => o.title)} cta={t('Envoyer')} />
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
      <PageHero eyebrow={t('Contact')} title={t('Écrivez-nous')} lead={t('Une question, une demande de partenariat, une proposition de collaboration : nous vous répondons.')} sub={sub('contact', t)} />
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
