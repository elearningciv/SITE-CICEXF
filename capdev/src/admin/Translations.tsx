import React, { useEffect, useMemo, useState } from 'react';
import { Languages, Sparkles, Save } from 'lucide-react';
import { useSite, LANGUAGES } from '../lib/site';
import { api } from '../lib/api';
import { COLLECTIONS, type Content } from '../types';
import { UNTRANSLATED } from './schema';
import { useToast } from './ui';
import uiStrings from '../lib/uiStrings.json';

/** Every French text a visitor can see: interface texts + content entered in the admin */
export function collectStrings(c: Content): { text: string; group: string }[] {
  const out = new Map<string, string>();
  const add = (s: unknown, group: string) => {
    if (typeof s !== 'string') return;
    const v = s.trim();
    if (!v || /^[\d\s.,%+-]+$/.test(v) || /^https?:\/\//.test(v) || /^\/uploads\//.test(v)) return;
    if (!out.has(v)) out.set(v, group);
  };
  for (const [k, v] of Object.entries(c.settings)) {
    if (UNTRANSLATED.has(k) || k === 'languages' || k === 'siteName' || k === 'assistantName') continue;
    if (k === 'stats') (v as { label: string }[]).forEach(s => add(s.label, 'Paramètres'));
    else add(v, 'Paramètres');
  }
  for (const name of COLLECTIONS) {
    for (const item of c[name] as unknown as Record<string, string>[]) {
      for (const [k, v] of Object.entries(item)) if (!UNTRANSLATED.has(k)) add(v, name);
    }
  }
  for (const s of uiStrings as string[]) add(s, 'Interface');
  return [...out].map(([text, group]) => ({ text, group }));
}

const GROUP_LABELS: Record<string, string> = {
  Interface: 'Interface (menus, boutons)', Paramètres: 'Paramètres et pages', axes: 'Axes', projects: 'Projets', publications: 'Publications',
  researchers: 'Chercheurs', formations: 'Formations', services: 'Expertise', news: 'Actualités', events: 'Agenda', opportunities: 'Opportunités', partners: 'Partenaires'
};

export default function Translations({ ai }: { ai: boolean }) {
  const { content, setContent } = useSite();
  const toast = useToast();
  const languages = content?.settings.languages || ['fr'];
  const others = languages.filter(l => l !== 'fr');
  const [lang, setLang] = useState(others[0] || '');
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'missing' | 'all'>('missing');
  const [group, setGroup] = useState('');
  const [busy, setBusy] = useState<'' | 'save' | 'ai' | 'langs'>('');
  const [error, setError] = useState('');

  useEffect(() => { if (lang && !languages.includes(lang)) setLang(others[0] || ''); }, [languages.join()]);
  useEffect(() => { setDraft({ ...(content?.translations[lang] || {}) }); }, [lang, content?.updatedAt]);

  const all = useMemo(() => (content ? collectStrings(content) : []), [content]);
  if (!content) return null;
  const done = all.filter(s => draft[s.text]?.trim()).length;
  const rows = all.filter(s => (!group || s.group === group) && (filter === 'all' || !draft[s.text]?.trim()));
  const dirty = JSON.stringify(draft) !== JSON.stringify(content.translations[lang] || {});

  const toggleLang = async (l: string) => {
    const next = languages.includes(l) ? languages.filter(x => x !== l) : [...languages, l];
    setBusy('langs'); setError('');
    try { const c = await api.put<Content>('/api/admin/settings', { languages: next }); setContent(c); toast(languages.includes(l) ? 'Langue retirée du site' : 'Langue ajoutée au site'); if (!languages.includes(l)) setLang(l); }
    catch (e) { setError((e as Error).message); } finally { setBusy(''); }
  };

  const save = async (map = draft) => {
    setBusy('save'); setError('');
    try { const c = await api.put<Content>(`/api/admin/translations/${lang}`, { map }); setContent(c); toast('Traductions enregistrées'); }
    catch (e) { setError((e as Error).message); } finally { setBusy(''); }
  };

  const autoTranslate = async () => {
    const missing = all.filter(s => !draft[s.text]?.trim()).map(s => s.text);
    if (!missing.length) return;
    setBusy('ai'); setError('');
    try {
      const { map } = await api.post<{ map: Record<string, string> }>('/api/admin/translate', { lang, strings: missing });
      const next = { ...draft, ...map };
      setDraft(next);
      await save(next);
      toast(`${Object.keys(map).length} textes traduits automatiquement. Relisez-les avant de les laisser en ligne.`);
    } catch (e) { setError((e as Error).message); } finally { setBusy(''); }
  };

  return (
    <>
      <div className="admin-head">
        <div><h1>Langues et traductions</h1><p>Le site est rédigé en français. Activez d'autres langues : les visiteurs pourront les choisir en haut de page. Tant qu'un texte n'est pas traduit, il s'affiche en français.</p></div>
      </div>
      <div className="panel">
        <h2>Langues proposées aux visiteurs</h2>
        <div className="lang-toggles">
          <span className="chip active">Français (langue source)</span>
          {Object.entries(LANGUAGES).filter(([k]) => k !== 'fr').map(([k, l]) => (
            <button key={k} type="button" disabled={busy === 'langs'} className={`chip${languages.includes(k) ? ' active' : ''}`} onClick={() => toggleLang(k)} aria-pressed={languages.includes(k)}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {others.length === 0 ? (
        <div className="panel"><p className="muted">Activez une langue ci-dessus pour commencer à traduire.</p></div>
      ) : (
        <div className="panel">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Languages size={18} />
              {others.map(l => <button key={l} type="button" className={`chip${l === lang ? ' active' : ''}`} onClick={() => setLang(l)}>{LANGUAGES[l]?.label || l}</button>)}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-accent btn-sm" type="button" onClick={autoTranslate} disabled={!!busy || done === all.length} title={ai ? '' : 'Ajoutez GEMINI_API_KEY sur le serveur pour activer la traduction automatique'}>
                <Sparkles /> {busy === 'ai' ? 'Traduction en cours…' : `Traduire automatiquement les ${all.length - done} textes manquants`}
              </button>
              <button className="btn btn-primary btn-sm" type="button" onClick={() => save()} disabled={!dirty || !!busy}><Save /> {busy === 'save' ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 6, marginBottom: 14 }}>
            <div style={{ height: 8, borderRadius: 4, background: 'var(--surface-2)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${all.length ? (done / all.length) * 100 : 0}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', transition: 'width .6s var(--ease)' }} />
            </div>
            <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{done} textes traduits sur {all.length}{!ai && ' · traduction automatique inactive (clé Gemini absente) : vous pouvez traduire à la main'}</span>
          </div>
          {error && <div className="notice err" style={{ marginBottom: 12 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <button type="button" className={`chip${filter === 'missing' ? ' active' : ''}`} onClick={() => setFilter('missing')}>À traduire</button>
            <button type="button" className={`chip${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>Tous les textes</button>
            <select value={group} onChange={e => setGroup(e.target.value)} aria-label="Rubrique" style={{ border: '1px solid var(--line)', borderRadius: 999, padding: '4px 10px', background: 'var(--surface)' }}>
              <option value="">Toutes les rubriques</option>
              {Object.entries(GROUP_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="scroll-x">
            <table className="tr-table">
              <thead><tr><th>Français</th><th>{LANGUAGES[lang]?.label || lang}</th></tr></thead>
              <tbody>
                {rows.slice(0, 300).map(r => (
                  <tr key={r.text} className={draft[r.text]?.trim() ? '' : 'missing'}>
                    <td>{r.text}</td>
                    <td><textarea aria-label={`Traduction de : ${r.text.slice(0, 60)}`} dir={LANGUAGES[lang]?.dir || 'ltr'} value={draft[r.text] || ''} rows={Math.min(6, Math.ceil(r.text.length / 60))} onChange={e => setDraft(d => ({ ...d, [r.text]: e.target.value }))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 300 && <p className="muted" style={{ marginTop: 10 }}>300 premiers textes affichés. Enregistrez puis filtrez par rubrique pour voir la suite.</p>}
          {!rows.length && <p className="muted" style={{ marginTop: 10 }}>Tous les textes de cette sélection sont traduits.</p>}
        </div>
      )}
    </>
  );
}
