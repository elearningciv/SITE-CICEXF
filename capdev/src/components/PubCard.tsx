import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarDays, FileText, FlaskConical, X, BookOpen, UserRound } from 'lucide-react';
import type { Publication } from '../types';
import { useSite } from '../lib/site';
import { EASE } from './Motion';

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Cover image of a publication; without an uploaded image, a generated cover in the palette colours */
export function PubCover({ pub }: { pub: Publication }) {
  if (pub.image) return <img className="pub-cover" src={pub.image} alt="" loading="lazy" />;
  const h = hash(pub.id + pub.title);
  const lines = Array.from({ length: 7 }, (_, i) => {
    const y = 30 + i * 26 + ((h >>> i) % 12);
    const k = 30 + ((h >>> (i + 3)) % 40);
    return `M -20 ${y} C 120 ${y - k}, 220 ${y + k}, 420 ${y - (k >> 1)}`;
  });
  const bars = Array.from({ length: 9 }, (_, i) => 18 + ((h >>> (i * 2)) % 60));
  return (
    <svg className="pub-cover" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`g-${pub.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--deep-2)" />
          <stop offset="1" stopColor="var(--deep)" />
        </linearGradient>
      </defs>
      <rect width="400" height="230" fill={`url(#g-${pub.id})`} />
      {lines.map((d, i) => <path key={i} d={d} fill="none" stroke={i === 2 ? 'var(--accent)' : 'var(--on-deep)'} strokeOpacity={i === 2 ? 0.7 : 0.14} strokeWidth={i === 2 ? 2 : 1} />)}
      {bars.map((v, i) => <rect key={i} x={250 + i * 14} y={200 - v} width="8" height={v} rx="2" fill={i === bars.length - 1 ? 'var(--accent)' : 'var(--primary)'} opacity={0.85} />)}
      <text x="24" y="44" fill="var(--accent)" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="1">{pub.reference}</text>
      <text x="24" y="200" fill="var(--on-deep)" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="34" opacity="0.92">{pub.publicationYear}</text>
    </svg>
  );
}

export function PubCard({ pub, onOpen }: { pub: Publication; onOpen: () => void }) {
  const { t } = useSite();
  return (
    <motion.article className="pub-card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
      <button type="button" className="pub-card-btn" onClick={onOpen} aria-label={`${t('Lire la publication')} : ${t(pub.title)}`}>
        <div className="pub-cover-wrap"><PubCover pub={pub} /></div>
        <div className="pub-body">
          <div className="pub-meta">
            <span><FlaskConical size={15} /> {t('Recherche')} {pub.researchYear}</span>
            <span className="pub-badge">{t(pub.type)}</span>
          </div>
          <h3>{t(pub.title)}</h3>
          <p>{t(pub.description)}</p>
          <div className="pub-foot">
            <span><CalendarDays size={14} /> {t('Publié en')} {pub.publicationYear}</span>
            <span className="pub-read">{t('Lire')} <BookOpen size={14} /></span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}

export function PubModal({ pub, onClose }: { pub: Publication | null; onClose: () => void }) {
  const { t } = useSite();
  useEffect(() => {
    if (!pub) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [pub, onClose]);
  return (
    <AnimatePresence>
      {pub && (
        <motion.div className="modal-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.article className="modal" role="dialog" aria-modal="true" aria-label={t(pub.title)} onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.98 }} transition={{ duration: 0.45, ease: EASE }}>
            <div className="modal-cover"><PubCover pub={pub} /><button type="button" className="modal-x" onClick={onClose} aria-label={t('Fermer')}><X size={18} /></button></div>
            <div className="modal-body">
              <div className="pub-meta"><span className="pub-badge">{t(pub.type)}</span><span className="mono muted">{pub.reference}</span></div>
              <h2 className="h-md" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)' }}>{t(pub.title)}</h2>
              <p className="muted" style={{ fontWeight: 600 }}>{t(pub.authors)}</p>
              <dl className="pub-facts">
                <div><dt>{t('Année de recherche')}</dt><dd>{pub.researchYear || '—'}</dd></div>
                <div><dt>{t('Année de publication')}</dt><dd>{pub.publicationYear || '—'}</dd></div>
                <div><dt>{t('Type')}</dt><dd>{t(pub.type)}</dd></div>
              </dl>
              <section><h3>{t('Description')}</h3><p className="prose">{t(pub.description)}</p></section>
              <section><h3>{t('Résumé')}</h3><p className="prose">{t(pub.summary)}</p></section>
              {pub.link
                ? <a className="btn btn-primary" href={pub.link} target="_blank" rel="noreferrer" style={{ justifySelf: 'start' }}><FileText /> {t('Télécharger le document')}</a>
                : <span className="chip" style={{ justifySelf: 'start' }}>{t('Document bientôt disponible')}</span>}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Photo shown as a background behind a transparent layer: no "Save image" menu, no dragging,
 * no direct image link in the page. (A screenshot can never be prevented.)
 */
export function ProtectedPhoto({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="photo" role="img" aria-label={alt} onContextMenu={e => e.preventDefault()} onDragStart={e => e.preventDefault()}>
      {src ? <div className="photo-img" style={{ backgroundImage: `url("${src}")` }} /> : <span className="photo-initials" aria-hidden="true"><UserRound strokeWidth={1.3} /></span>}
      <div className="photo-shield" />
    </div>
  );
}
