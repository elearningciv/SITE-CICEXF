import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarDays, ChevronDown, MapPin, X, Images } from 'lucide-react';
import { useSite } from '../lib/site';
import type { GalleryItem } from '../types';
import { EASE, Item, Stagger } from '../components/Motion';
import { PageHero } from '../components/Common';
import { GenCover } from '../components/Covers';

const photosOf = (g: GalleryItem) => (g.images || '').split('\n').filter(Boolean);

export default function Galerie() {
  const { content, t } = useSite();
  const [view, setView] = useState<{ photos: string[]; index: number } | null>(null);
  if (!content) return null;
  const items = [...(content.gallery || [])].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero eyebrow={t('Galerie')} title={t('Nos activités réalisées')} />
      <section className="section">
        <div className="container">
          {!items.length && <p className="muted">{t('Les activités réalisées seront bientôt publiées ici.')}</p>}
          <Stagger className="gal-grid">
            {items.map(g => <Item key={g.id} className="gal-item"><GalleryCard item={g} onPhoto={(photos, index) => setView({ photos, index })} /></Item>)}
          </Stagger>
        </div>
      </section>
      <Lightbox view={view} onClose={() => setView(null)} onMove={index => setView(v => (v ? { ...v, index } : v))} />
    </>
  );
}

function GalleryCard({ item, onPhoto }: { item: GalleryItem; onPhoto: (photos: string[], index: number) => void }) {
  const { t, fmtDate } = useSite();
  const [open, setOpen] = useState(false);
  const photos = photosOf(item);
  return (
    <article className={`gal-card${open ? ' open' : ''}`}>
      <button type="button" className="gal-cover" onClick={() => (photos.length ? onPhoto(photos, 0) : setOpen(o => !o))} aria-label={photos.length ? t('Agrandir la photo') : t(item.title)}>
        {photos[0] ? <img src={photos[0]} alt="" loading="lazy" /> : <GenCover seed={item.id + item.title} />}
        {photos.length > 1 && <span className="gal-count"><Images size={14} /> {photos.length}</span>}
      </button>
      <div className="gal-body">
        <span className="gal-tag">{t(item.category)}</span>
        <h3>{t(item.title)}</h3>
        <p className={open ? '' : 'clamp'}>{t(item.summary)}</p>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div className="gal-more" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
              <div className="gal-facts">
                {item.date && <span><CalendarDays size={15} /> {fmtDate(item.date)}</span>}
                {item.place && <span><MapPin size={15} /> {t(item.place)}</span>}
              </div>
              {item.body && <p className="gal-text">{t(item.body)}</p>}
              {photos.length > 1 && (
                <div className="gal-thumbs">
                  {photos.map((src, i) => (
                    <button key={src + i} type="button" onClick={() => onPhoto(photos, i)} aria-label={`${t('Photo')} ${i + 1}`}><img src={src} alt="" loading="lazy" /></button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <button type="button" className="gal-toggle" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          {open ? t('Voir moins') : t('Voir plus')} <ChevronDown size={18} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .35s' }} />
        </button>
      </div>
    </article>
  );
}

function Lightbox({ view, onClose, onMove }: { view: { photos: string[]; index: number } | null; onClose: () => void; onMove: (i: number) => void }) {
  const { t } = useSite();
  useEffect(() => {
    if (!view) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove((view.index + 1) % view.photos.length);
      if (e.key === 'ArrowLeft') onMove((view.index - 1 + view.photos.length) % view.photos.length);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [view, onClose, onMove]);
  return (
    <AnimatePresence>
      {view && (
        <motion.div className="lightbox" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.img key={view.photos[view.index]} src={view.photos[view.index]} alt="" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: EASE }} />
          <button type="button" className="modal-x" onClick={onClose} aria-label={t('Fermer')}><X size={18} /></button>
          {view.photos.length > 1 && <span className="lightbox-count">{view.index + 1} / {view.photos.length}</span>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
