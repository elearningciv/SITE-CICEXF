import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Upload, X } from 'lucide-react';
import { api } from '../lib/api';

const ToastCtx = createContext<(msg: string) => void>(() => undefined);
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <AnimatePresence>
        {msg && (
          <motion.div className="toast" role="status" initial={{ opacity: 0, y: 30, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
            <CheckCircle2 size={18} /> {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastCtx.Provider>
  );
}

export function Sheet({ open, title, onClose, children, footer }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="sheet-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside className="sheet" role="dialog" aria-label={title} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 36 }}>
            <div className="sheet-head"><h2 style={{ fontSize: 19 }}>{title}</h2><button className="icon-btn" type="button" onClick={onClose} aria-label="Fermer"><X /></button></div>
            <div className="sheet-body">{children}</div>
            {footer && <div className="sheet-foot">{footer}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/** Resizes the picture in the browser (max 1600 px, WebP) before sending it */
async function compress(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    const webp = c.toDataURL('image/webp', 0.84);
    return webp.startsWith('data:image/webp') ? webp : c.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function ImageInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const toast = useToast();
  return (
    <div className="img-field">
      {value && <img src={value} alt="" />}
      <label className="btn btn-ghost btn-sm" htmlFor={id} style={{ cursor: 'pointer' }}><Upload /> {busy ? 'Envoi…' : value ? 'Remplacer' : 'Choisir une image'}</label>
      <input id={id} type="file" accept="image/*" className="hp" onChange={async e => {
        const f = e.target.files?.[0]; if (!f) return;
        setBusy(true); setErr('');
        try { const dataUrl = await compress(f); const r = await api.post<{ url: string }>('/api/admin/upload', { dataUrl }); onChange(r.url); toast('Image ajoutée'); }
        catch (x) { setErr((x as Error).message); }
        finally { setBusy(false); e.target.value = ''; }
      }} />
      {value && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange('')}>Retirer</button>}
      {err && <span className="notice err">{err}</span>}
    </div>
  );
}

/** Several photos for one item, stored one URL per line */
export function ImagesInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const toast = useToast();
  const list = value.split('\n').filter(Boolean);
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {list.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {list.map((url, i) => (
            <div key={url + i} style={{ position: 'relative' }}>
              <img src={url} alt="" style={{ width: 120, height: 84, objectFit: 'cover', borderRadius: 10, border: i === 0 ? '2px solid var(--accent)' : '1px solid var(--line)' }} />
              <button type="button" className="icon-btn danger" aria-label="Retirer cette photo" style={{ position: 'absolute', top: 4, right: 4, width: 28, height: 28 }} onClick={() => onChange(list.filter((_, j) => j !== i).join('\n'))}><X size={14} /></button>
              {i === 0 && <span className="tag accent" style={{ position: 'absolute', left: 4, bottom: 4, fontSize: 10 }}>Couverture</span>}
            </div>
          ))}
        </div>
      )}
      <div className="img-field">
        <label className="btn btn-ghost btn-sm" htmlFor={id} style={{ cursor: 'pointer' }}><Upload /> {busy ? 'Envoi…' : 'Ajouter des photos'}</label>
        <input id={id} type="file" accept="image/*" multiple className="hp" onChange={async e => {
          const files = [...(e.target.files || [])]; if (!files.length) return;
          setBusy(true); setErr('');
          const added: string[] = [];
          try {
            for (const f of files) { const dataUrl = await compress(f); const r = await api.post<{ url: string }>('/api/admin/upload', { dataUrl }); added.push(r.url); }
            toast(`${added.length} photo(s) ajoutée(s)`);
          } catch (x) { setErr((x as Error).message); }
          finally { if (added.length) onChange([...list, ...added].join('\n')); setBusy(false); e.target.value = ''; }
        }} />
        {err && <span className="notice err">{err}</span>}
      </div>
    </div>
  );
}
