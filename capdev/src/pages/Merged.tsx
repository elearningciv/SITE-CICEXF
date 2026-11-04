import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useLocation } from '../lib/router';
import { useSite } from '../lib/site';
import { slug } from '../lib/nav';
import type { Publication } from '../types';
import { EASE, Item, Stagger } from '../components/Motion';
import { MessageForm, PageHero, SectionHead } from '../components/Common';
import { PubCard, PubModal, ProtectedPhoto } from '../components/PubCard';

// ---------------- Publications ----------------
export function Publications() {
  const { content, t } = useSite();
  const { hash } = useLocation();
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [open, setOpen] = useState<Publication | null>(null);
  const types = useMemo(() => [...new Set((content?.publications || []).map(p => p.type))], [content]);
  const years = useMemo(() => [...new Set((content?.publications || []).map(p => p.publicationYear).filter(Boolean))].sort().reverse(), [content]);
  useEffect(() => { const m = types.find(ty => slug(ty) === hash); if (m) setType(m); }, [hash, types]);
  if (!content) return null;
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const list = [...content.publications]
    .filter(p => (!type || p.type === type) && (!year || p.publicationYear === year))
    .filter(p => !q || norm(`${p.title} ${t(p.title)} ${p.authors} ${p.reference} ${p.description} ${p.summary}`).includes(norm(q)))
    .sort((a, b) => (b.publicationYear || '').localeCompare(a.publicationYear || ''));
  return (
    <>
      <PageHero eyebrow={t('Publications')} title={t('Bibliothèque numérique')} lead={t('Articles, documents de travail, policy briefs et rapports, en accès libre.')} />
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
            <div className="field" style={{ maxWidth: 560 }}>
              <label htmlFor="pub-q">{t('Rechercher dans les publications')}</label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
                <input id="pub-q" value={q} onChange={e => setQ(e.target.value)} placeholder={t('Titre, auteur, référence…')} style={{ paddingLeft: 42 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <button type="button" className={`chip${!type ? ' active' : ''}`} onClick={() => setType('')}>{t('Tous les types')}</button>
              {types.map(ty => <button key={ty} type="button" className={`chip${type === ty ? ' active' : ''}`} onClick={() => setType(ty)}>{t(ty)}</button>)}
              {years.length > 1 && (
                <select aria-label={t('Année de publication')} value={year} onChange={e => setYear(e.target.value)} className="chip">
                  <option value="">{t('Toutes les années')}</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              )}
            </div>
          </div>
          <p className="muted" style={{ marginBottom: 16, fontWeight: 600 }} aria-live="polite">{list.length} {list.length > 1 ? t('publications') : t('publication')}</p>
          <motion.div className="pub-grid" layout>
            <AnimatePresence initial={false}>
              {list.map((p, i) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 6) * 0.05 }}>
                  <PubCard pub={p} onOpen={() => setOpen(p)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {!list.length && <p className="muted" style={{ paddingBlock: 24 }}>{t('Aucune publication ne correspond à votre recherche.')}</p>}
        </div>
      </section>
      <PubModal pub={open} onClose={() => setOpen(null)} />
    </>
  );
}

// ---------------- Expertise (services + doctors) ----------------
export function Expertise() {
  const { content, t } = useSite();
  if (!content) return null;
  return (
    <>
      <PageHero eyebrow={t('Expertise')} title={t('Études, évaluations et appui aux institutions')} lead={t("Nous mettons la rigueur de la recherche et l'expérience de nos docteurs au service de vos décisions.")} />
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
      <section className="section" id="docteurs" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead eyebrow={t('Équipe scientifique')} title={t('Nos docteurs')} lead={t("Les docteurs de CapDev conduisent nos recherches et nos missions d'expertise.")} />
          <Stagger className="doc-grid">
            {content.researchers.map(r => (
              <Item key={r.id} className="doc-card" whileHover={{ y: -5 }}>
                <ProtectedPhoto src={r.photo} alt={t(r.name)} />
                <div className="doc-body">
                  <span className="doc-grade">{t(r.grade)}</span>
                  <h3>{t(r.name)}</h3>
                  <span className="doc-specialty">{t(r.specialty)}</span>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="section" id="demande">
        <div className="container grid split" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.3fr)', gap: 48 }}>
          <SectionHead eyebrow={t('Demande')} title={t('Demander une étude')} lead={t('Décrivez votre besoin : objectifs, terrain, calendrier. Nous revenons vers vous avec une proposition.')} />
          <MessageForm kind="etude" subjects={[t('Étude ou enquête'), t('Évaluation de programme'), t('Appui aux politiques publiques'), t('Renforcement institutionnel'), t('Partenariat de recherche')]} cta={t('Envoyer la demande')} />
        </div>
      </section>
    </>
  );
}

// ---------------- Actualités (news, agenda, opportunities) ----------------
export function Actualites() {
  const { content, t, fmtDate } = useSite();
  if (!content) return null;
  const news = [...content.news].sort((a, b) => b.date.localeCompare(a.date));
  const events = [...content.events].sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date().toISOString().slice(0, 10);
  const opps = [...content.opportunities].sort((a, b) => a.deadline.localeCompare(b.deadline));
  return (
    <>
      <PageHero eyebrow={t('Actualités')} title={t("La vie de l'institut")} lead={t('Nouvelles, agenda scientifique, appels, bourses et stages.')} />
      <section className="section" id="actualites">
        <div className="container">
          <SectionHead eyebrow={t('Actualités')} title={t('Dernières nouvelles')} />
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
      <section className="section" id="opportunites" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead eyebrow={t('Opportunités')} title={t('Appels, bourses et stages')} lead={t('Pour les chercheurs, les étudiants et les partenaires.')} />
          <Stagger className="grid g-3">
            {opps.map(o => {
              const isOpen = !o.deadline || o.deadline >= today;
              return (
                <Item key={o.id} className="card hover">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}><span className="tag">{t(o.kind)}</span><span className={`tag${isOpen ? ' accent' : ''}`}>{isOpen ? t('Ouvert') : t('Clôturé')}</span></div>
                  <h3>{t(o.title)}</h3>
                  <p>{t(o.summary)}</p>
                  <div className="foot"><span>{t('Date limite')} : {o.deadline ? fmtDate(o.deadline) : '—'}</span></div>
                </Item>
              );
            })}
          </Stagger>
        </div>
      </section>
      <section className="section" id="candidater">
        <div className="container grid split" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.3fr)', gap: 48 }}>
          <SectionHead eyebrow={t('Candidater')} title={t('Manifester votre intérêt')} lead={t("Indiquez l'opportunité visée et présentez-vous en quelques lignes. Nous vous enverrons le dossier complet.")} />
          <MessageForm kind="contact" subjects={content.opportunities.map(o => o.title)} cta={t('Envoyer')} />
        </div>
      </section>
    </>
  );
}
