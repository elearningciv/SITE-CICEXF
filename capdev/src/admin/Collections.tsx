import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, ArrowUp, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useSite } from '../lib/site';
import { api } from '../lib/api';
import type { Content } from '../types';
import { COLLECTION_DEFS, type CollectionDef } from './schema';
import { ImageInput, ImagesInput, Sheet, useToast } from './ui';

type Row = Record<string, string>;

export default function Collections({ initial }: { initial?: string }) {
  const { content, setContent } = useSite();
  const [active, setActive] = useState(initial || COLLECTION_DEFS[0].name);
  const def = COLLECTION_DEFS.find(d => d.name === active)!;
  if (!content) return null;
  return (
    <>
      <div className="admin-head">
        <div><h1>Contenus du site</h1><p>Ajoutez, modifiez ou supprimez les éléments affichés dans chaque onglet. Les changements sont visibles immédiatement sur le site.</p></div>
      </div>
      <div className="coll-tabs" role="tablist">
        {COLLECTION_DEFS.map(d => (
          <button key={d.name} type="button" role="tab" aria-selected={d.name === active} className={`chip${d.name === active ? ' active' : ''}`} onClick={() => setActive(d.name)}>
            {d.label} <span className="mono" style={{ opacity: .7 }}>{(content[d.name] as unknown[]).length}</span>
          </button>
        ))}
      </div>
      <CollectionEditor key={def.name} def={def} content={content} onSaved={setContent} />
    </>
  );
}

function CollectionEditor({ def, content, onSaved }: { def: CollectionDef; content: Content; onSaved: (c: Content) => void }) {
  const toast = useToast();
  const items = content[def.name] as unknown as Row[];
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const shown = useMemo(() => {
    const n = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return items.map((it, index) => ({ it, index })).filter(({ it }) => !q || n(Object.values(it).join(' ')).includes(n(q)));
  }, [items, q]);

  const save = async (next: Row[], message: string) => {
    setSaving(true); setError('');
    try {
      const c = await api.put<Content>(`/api/admin/collection/${def.name}`, { items: next });
      onSaved(c); toast(message); return true;
    } catch (e) { setError((e as Error).message); return false; }
    finally { setSaving(false); }
  };

  const blank = (): Row => Object.fromEntries(def.fields.map(f => [f.key, f.type === 'select' ? f.options?.[0] || '' : f.type === 'year' ? String(new Date().getFullYear()) : f.type === 'date' && def.sortKey === f.key ? new Date().toISOString().slice(0, 10) : '']));

  const submit = async () => {
    if (!editing) return;
    const missing = def.fields.filter(f => f.required && !editing[f.key]?.trim());
    if (missing.length) { setError(`À remplir : ${missing.map(f => f.label).join(', ')}.`); return; }
    const next = isNew ? [editing, ...items] : items.map(it => (it.id === editing.id ? editing : it));
    if (await save(next, isNew ? `${cap(def.singular)} ajouté(e)` : 'Modifications enregistrées')) setEditing(null);
  };

  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    save(next, 'Ordre mis à jour');
  };

  return (
    <div className="panel">
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="field" style={{ flex: '1 1 260px', maxWidth: 420 }}>
          <label htmlFor={`q-${def.name}`} className="hp">Rechercher</label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--muted)' }} />
            <input id={`q-${def.name}`} value={q} onChange={e => setQ(e.target.value)} placeholder={`Rechercher dans ${def.label.toLowerCase()}…`} style={{ paddingLeft: 36 }} />
          </div>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => { setEditing({ ...blank() }); setIsNew(true); setError(''); }}><Plus /> Ajouter {def.singular === 'actualité' || def.singular === 'publication' || def.singular === 'formation' || def.singular === 'opportunité' ? 'une' : 'un'} {def.singular}</button>
      </div>
      {error && !editing && <div className="notice err" style={{ marginBottom: 12 }}>{error}</div>}
      <motion.div className="items" layout>
        <AnimatePresence initial={false}>
          {shown.map(({ it, index }) => (
            <motion.div key={it.id} className="item-row" layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <div style={{ minWidth: 0 }}>
                <b>{it[def.titleKey] || '(sans titre)'}</b>
                <small>{def.subtitle(it)}</small>
              </div>
              <div className="row-actions">
                {confirm === it.id ? (
                  <>
                    <span style={{ fontSize: 13, fontWeight: 600, alignSelf: 'center' }}>Supprimer ?</span>
                    <button className="btn btn-danger btn-sm" type="button" disabled={saving} onClick={async () => { await save(items.filter(x => x.id !== it.id), 'Élément supprimé'); setConfirm(null); }}>Oui, supprimer</button>
                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => setConfirm(null)}>Annuler</button>
                  </>
                ) : (
                  <>
                    {!q && <button className="icon-btn" type="button" aria-label="Monter" onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp /></button>}
                    {!q && <button className="icon-btn" type="button" aria-label="Descendre" onClick={() => move(index, 1)} disabled={index === items.length - 1}><ArrowDown /></button>}
                    <button className="icon-btn" type="button" aria-label="Modifier" onClick={() => { setEditing({ ...it }); setIsNew(false); setError(''); }}><Pencil /></button>
                    <button className="icon-btn danger" type="button" aria-label="Supprimer" onClick={() => setConfirm(it.id)}><Trash2 /></button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {!shown.length && <p className="muted" style={{ padding: '16px 4px' }}>{q ? 'Aucun résultat.' : `Aucun élément pour le moment. Cliquez sur « Ajouter » pour créer le premier.`}</p>}

      <Sheet open={!!editing} title={isNew ? `Nouveau : ${def.singular}` : `Modifier : ${def.singular}`} onClose={() => setEditing(null)}
        footer={<>
          <button className="btn btn-ghost" type="button" onClick={() => setEditing(null)}>Annuler</button>
          <button className="btn btn-primary" type="button" onClick={submit} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </>}>
        {editing && (
          <form className="form" onSubmit={e => { e.preventDefault(); submit(); }}>
            {def.fields.map(f => {
              const id = `${def.name}-${f.key}`;
              const v = editing[f.key] || '';
              const set = (val: string) => setEditing(prev => ({ ...prev!, [f.key]: val }));
              return (
                <div className="field" key={f.key}>
                  <label htmlFor={id}>{f.label}{f.required ? ' *' : ''}</label>
                  {f.type === 'textarea' ? <textarea id={id} value={v} onChange={e => set(e.target.value)} />
                    : f.type === 'select' ? (
                      <select id={id} value={v} onChange={e => set(e.target.value)}>
                        {[...new Set([...(f.options || []), v].filter(Boolean))].map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : f.type === 'axe' ? (
                      <select id={id} value={v} onChange={e => set(e.target.value)}>
                        <option value="">— Aucun —</option>
                        {content.axes.map(a => <option key={a.id} value={a.id}>{a.code} · {a.title}</option>)}
                      </select>
                    ) : f.type === 'image' ? <ImageInput id={id} value={v} onChange={set} />
                    : f.type === 'images' ? <ImagesInput id={id} value={v} onChange={set} />
                    : f.type === 'year' ? <input id={id} type="number" inputMode="numeric" min="1950" max="2100" step="1" placeholder="2026" value={v} onChange={e => set(e.target.value.slice(0, 4))} />
                    : <input id={id} type={f.type === 'date' ? 'date' : f.type === 'url' ? 'url' : 'text'} value={v} onChange={e => set(e.target.value)} />}
                  {f.help && <span className="help">{f.help}</span>}
                </div>
              );
            })}
            {error && <div className="notice err">{error}</div>}
            <p className="help muted" style={{ fontSize: 13 }}>Rédigez en français. Les traductions se gèrent dans l'onglet « Langues et traductions ».</p>
          </form>
        )}
      </Sheet>
    </div>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
