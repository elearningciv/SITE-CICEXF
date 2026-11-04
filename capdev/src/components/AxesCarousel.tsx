import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useSite } from '../lib/site';
import type { Axe } from '../types';
import { EASE } from './Motion';
import { GenCover } from './Covers';

/** Research axes as a carousel: arrows, dots, gentle autoplay that pauses on hover */
export default function AxesCarousel() {
  const { content, t } = useSite();
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<Axe | null>(null);
  const reduce = useReducedMotion();
  const axes = content?.axes || [];

  const measure = useCallback(() => {
    const el = track.current; if (!el) return;
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);
  useEffect(() => { measure(); window.addEventListener('resize', measure); return () => window.removeEventListener('resize', measure); }, [measure, axes.length]);

  const go = (p: number) => {
    const el = track.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const next = p < 0 ? max : p * el.clientWidth > max + 2 ? 0 : p * el.clientWidth;
    el.scrollTo({ left: next, behavior: 'smooth' });
  };
  useEffect(() => {
    if (reduce || paused || pages < 2 || open) return;
    const id = setInterval(() => go(page + 1), 5500);
    return () => clearInterval(id);
  }, [page, pages, paused, reduce, open]);

  if (!content) return null;
  const projectsOf = (a: Axe) => content.projects.filter(p => p.axe === a.id);

  return (
    <div className="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <button type="button" className="car-arrow left" onClick={() => go(page - 1)} aria-label={t('Précédent')}><ChevronLeft /></button>
      <div className="car-track" ref={track} onScroll={measure}>
        {axes.map((a, i) => {
          const n = projectsOf(a).length;
          return (
            <motion.article key={a.id} className="car-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: Math.min(i, 4) * 0.07 }}>
              <div className="car-img">{a.image ? <img src={a.image} alt="" loading="lazy" /> : <GenCover seed={a.id} glyph={i} label={t(a.code)} />}</div>
              <div className="car-body">
                <h3>{t(a.title)}</h3>
                <span className="muted">{n} {n > 1 ? t('projets de recherche') : t('projet de recherche')}</span>
                <button type="button" className="car-more" onClick={() => setOpen(a)}>{t('Voir le détail')} <ArrowRight size={17} /></button>
              </div>
            </motion.article>
          );
        })}
      </div>
      <button type="button" className="car-arrow right" onClick={() => go(page + 1)} aria-label={t('Suivant')}><ChevronRight /></button>
      {pages > 1 && (
        <div className="car-dots">
          {Array.from({ length: pages }, (_, i) => <button key={i} type="button" aria-label={`${t('Page')} ${i + 1}`} aria-current={i === page} onClick={() => go(i)} />)}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div className="modal-backdrop" onClick={() => setOpen(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="modal" role="dialog" aria-modal="true" aria-label={t(open.title)} onClick={e => e.stopPropagation()} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.45, ease: EASE }}>
              <div className="modal-cover">{open.image ? <img src={open.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <GenCover seed={open.id} glyph={axes.indexOf(open)} label={t(open.code)} />}
                <button type="button" className="modal-x" onClick={() => setOpen(null)} aria-label={t('Fermer')}><X size={18} /></button></div>
              <div className="modal-body">
                <span className="eyebrow">{t(open.code)}</span>
                <h2 className="h-md" style={{ fontSize: 'clamp(22px, 2.4vw, 28px)' }}>{t(open.title)}</h2>
                <p className="prose">{t(open.description || open.summary)}</p>
                {projectsOf(open).length > 0 && (
                  <section>
                    <h3>{t('Projets de recherche')}</h3>
                    <div style={{ display: 'grid', gap: 10 }}>
                      {projectsOf(open).map(p => (
                        <div key={p.id} className="card" style={{ padding: 16, gap: 6 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}><span className={`tag${p.status === 'Terminé' ? '' : ' accent'}`}>{t(p.status)}</span><span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{p.period}</span></div>
                          <b>{t(p.title)}</b>
                          <p>{t(p.summary)}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
