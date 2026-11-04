import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, FolderOpen, Settings2, Palette as PaletteIcon, Languages, Inbox as InboxIcon, MessagesSquare, LogOut, ExternalLink, Trash2, Check, Mail, Plus } from 'lucide-react';
import { useSite } from '../lib/site';
import { api } from '../lib/api';
import { Link, navigate, useLocation } from '../lib/router';
import { PALETTES } from '../lib/palettes';
import type { Content, Conversation, InboxMessage, PaletteId, Settings } from '../types';
import Collections from './Collections';
import Translations, { collectStrings } from './Translations';
import { ToastProvider, useToast } from './ui';
import './admin.css';

const TABS = [
  { id: 'tableau', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'contenus', label: 'Contenus', icon: FolderOpen },
  { id: 'parametres', label: 'Textes et coordonnées', icon: Settings2 },
  { id: 'couleurs', label: 'Couleurs et apparence', icon: PaletteIcon },
  { id: 'langues', label: 'Langues et traductions', icon: Languages },
  { id: 'messages', label: 'Messages reçus', icon: InboxIcon },
  { id: 'conversations', label: 'Conversations assistant', icon: MessagesSquare }
];

export default function Admin() {
  const { session, setSession } = useSite();
  const { hash } = useLocation();
  const [tab, sub] = (hash || 'tableau').split('-');
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [ai, setAi] = useState(false);

  const refresh = () => {
    api.get<InboxMessage[]>('/api/admin/inbox').then(setInbox).catch(() => undefined);
    api.get<Conversation[]>('/api/admin/conversations').then(setConvos).catch(() => undefined);
  };
  useEffect(() => {
    api.get<{ ai: boolean }>('/api/admin/status').then(r => setAi(r.ai)).catch(() => setSession({ admin: false }));
    refresh();
  }, []);

  if (!session.admin) return null;
  const unread = inbox.filter(m => !m.read).length;
  const go = (id: string) => navigate(`/admin#${id}`);

  return (
    <ToastProvider>
      <div className="admin">
        <aside className="admin-side" aria-label="Menu administration">
          <div className="who"><b>Administration</b><span>{session.email}</span></div>
          {TABS.map(t => (
            <button key={t.id} type="button" className="admin-tab" aria-current={tab === t.id} onClick={() => go(t.id)}>
              {tab === t.id && <motion.span layoutId="admin-pill" className="pill-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <t.icon /> <span>{t.label}</span>
              {t.id === 'messages' && unread > 0 && <span className="badge">{unread}</span>}
            </button>
          ))}
          <div className="bottom">
            <Link to="/" className="admin-tab" style={{ textDecoration: 'none' }}><ExternalLink /> <span>Voir le site</span></Link>
            <button type="button" className="admin-tab" onClick={async () => { await api.logout(); setSession({ admin: false }); navigate('/'); }}><LogOut /> <span>Se déconnecter</span></button>
          </div>
        </aside>
        <main className="admin-main">
          <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            {tab === 'tableau' && <Dashboard inbox={inbox} convos={convos} ai={ai} go={go} />}
            {tab === 'contenus' && <Collections key={sub || 'all'} initial={sub} />}
            {tab === 'parametres' && <SettingsForm />}
            {tab === 'couleurs' && <Appearance />}
            {tab === 'langues' && <Translations ai={ai} />}
            {tab === 'messages' && <InboxView inbox={inbox} setInbox={setInbox} />}
            {tab === 'conversations' && <Conversations convos={convos} setConvos={setConvos} />}
          </motion.div>
        </main>
      </div>
    </ToastProvider>
  );
}

function Dashboard({ inbox, convos, ai, go }: { inbox: InboxMessage[]; convos: Conversation[]; ai: boolean; go: (id: string) => void }) {
  const { content } = useSite();
  if (!content) return null;
  const strings = collectStrings(content);
  const others = content.settings.languages.filter(l => l !== 'fr');
  const translated = others.map(l => strings.filter(s => content.translations[l]?.[s.text]).length);
  const pct = others.length ? Math.round((Math.min(...translated) / strings.length) * 100) : 100;
  const kpis = [
    { label: 'messages non lus', value: inbox.filter(m => !m.read).length, to: 'messages', alert: true },
    { label: 'conversations avec l\'assistant', value: convos.length, to: 'conversations' },
    { label: 'publications en ligne', value: content.publications.length, to: 'contenus-publications' },
    { label: 'textes traduits (min.)', value: `${pct} %`, to: 'langues' }
  ];
  const quick: [string, string][] = [['Une actualité', 'contenus-news'], ['Une publication', 'contenus-publications'], ['Un événement', 'contenus-events'], ['Une formation', 'contenus-formations'], ['Une opportunité', 'contenus-opportunities'], ['Un chercheur', 'contenus-researchers']];
  return (
    <>
      <div className="admin-head"><div><h1>Bonjour</h1><p>Vous êtes connecté en tant qu'administrateur principal. Cet onglet n'est visible que pour vous.</p></div></div>
      <div className="kpis">
        {kpis.map((k, i) => (
          <motion.button key={k.label} type="button" className={`kpi${k.alert && Number(k.value) > 0 ? ' alert' : ''}`} onClick={() => go(k.to)} style={{ textAlign: 'start' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <b>{k.value}</b><span>{k.label}</span>
          </motion.button>
        ))}
      </div>
      <div className="panel">
        <h2>Ajouter rapidement</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {quick.map(([l, to]) => <button key={to} type="button" className="btn btn-ghost btn-sm" onClick={() => go(to)}><Plus /> {l}</button>)}
        </div>
      </div>
      <div className="panel">
        <h2>État des services</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          <span className="status-line"><i className={ai ? 'on' : 'off'} /> Assistant {content.settings.assistantName} : {ai ? 'intelligence artificielle active (Gemini)' : 'mode hors ligne (réponses à partir des contenus du site). Ajoutez GEMINI_API_KEY sur le serveur pour activer l\'IA.'}</span>
          <span className="status-line"><i className={ai ? 'on' : 'off'} /> Traduction automatique : {ai ? 'disponible' : 'indisponible sans clé Gemini (traduction manuelle possible)'}</span>
          <span className="status-line"><i className="on" /> Langues proposées : {content.settings.languages.join(', ').toUpperCase()}</span>
          <span className="status-line"><i className="on" /> Dernière mise à jour des contenus : {new Date(content.updatedAt).toLocaleString('fr-FR')}</span>
        </div>
      </div>
    </>
  );
}

type SField = { key: keyof Settings; label: string; long?: boolean; help?: string };
const GROUPS: { title: string; fields: SField[] }[] = [
  { title: 'Identité', fields: [
    { key: 'siteName', label: 'Nom court' }, { key: 'fullName', label: 'Nom complet' }, { key: 'tagline', label: 'Signature (sous le logo)' }
  ] },
  { title: "Page d'accueil", fields: [
    { key: 'heroEyebrow', label: 'Surtitre' }, { key: 'heroTitle', label: 'Titre (début)' }, { key: 'heroHighlight', label: 'Titre (partie mise en valeur)' }, { key: 'heroLead', label: 'Texte d\'introduction', long: true }
  ] },
  { title: "Onglet L'Institut", fields: [
    { key: 'mission', label: 'Mission', long: true }, { key: 'vision', label: 'Vision', long: true }, { key: 'directorWord', label: 'Mot du Directeur', long: true },
    { key: 'directorName', label: 'Signature du mot' }, { key: 'history', label: 'Historique', long: true }, { key: 'governance', label: 'Gouvernance', long: true }
  ] },
  { title: 'Coordonnées', fields: [
    { key: 'address', label: 'Adresse' }, { key: 'phone', label: 'Téléphone' }, { key: 'email', label: 'E-mail' }, { key: 'hours', label: 'Horaires' }, { key: 'newsletterText', label: "Texte de la lettre d'information" }
  ] },
  { title: 'Assistant virtuel', fields: [
    { key: 'assistantName', label: "Nom de l'assistant", help: 'Affiché sur le bouton, dans la fenêtre de discussion et dans ses réponses.' },
    { key: 'assistantGreeting', label: "Message d'accueil", long: true }
  ] }
];

function SettingsForm() {
  const { content, setContent } = useSite();
  const toast = useToast();
  const [draft, setDraft] = useState<Settings | null>(content?.settings || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  if (!draft || !content) return null;
  const dirty = JSON.stringify(draft) !== JSON.stringify(content.settings);
  const save = async () => {
    setSaving(true); setError('');
    try { const c = await api.put<Content>('/api/admin/settings', draft); setContent(c); setDraft(c.settings); toast('Paramètres enregistrés'); }
    catch (e) { setError((e as Error).message); } finally { setSaving(false); }
  };
  return (
    <>
      <div className="admin-head">
        <div><h1>Textes et coordonnées</h1><p>Les textes fixes du site : accueil, présentation de l'institut, coordonnées, chiffres clés et assistant.</p></div>
        <button className="btn btn-primary" type="button" onClick={save} disabled={!dirty || saving}>{saving ? 'Enregistrement…' : dirty ? 'Enregistrer les modifications' : 'Tout est enregistré'}</button>
      </div>
      {error && <div className="notice err" style={{ marginBottom: 12 }}>{error}</div>}
      {GROUPS.map(g => (
        <div className="panel" key={g.title}>
          <h2>{g.title}</h2>
          <div className="form">
            {g.fields.map(f => (
              <div className="field" key={f.key}>
                <label htmlFor={`s-${f.key}`}>{f.label}</label>
                {f.long ? <textarea id={`s-${f.key}`} value={draft[f.key] as string} onChange={e => setDraft({ ...draft, [f.key]: e.target.value })} />
                  : <input id={`s-${f.key}`} value={draft[f.key] as string} onChange={e => setDraft({ ...draft, [f.key]: e.target.value })} />}
                {f.help && <span className="help">{f.help}</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="panel">
        <h2>Chiffres clés</h2>
        <div className="form">
          {draft.stats.map((s, i) => (
            <div className="row" key={i} style={{ gridTemplateColumns: '120px minmax(0,1fr) auto', alignItems: 'end' }}>
              <div className="field"><label htmlFor={`st-v-${i}`}>Valeur</label><input id={`st-v-${i}`} value={s.value} onChange={e => setDraft({ ...draft, stats: draft.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} /></div>
              <div className="field"><label htmlFor={`st-l-${i}`}>Libellé</label><input id={`st-l-${i}`} value={s.label} onChange={e => setDraft({ ...draft, stats: draft.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} /></div>
              <button className="icon-btn danger" type="button" aria-label="Retirer ce chiffre" onClick={() => setDraft({ ...draft, stats: draft.stats.filter((_, j) => j !== i) })}><Trash2 /></button>
            </div>
          ))}
          {draft.stats.length < 8 && <div><button className="btn btn-ghost btn-sm" type="button" onClick={() => setDraft({ ...draft, stats: [...draft.stats, { value: '0', label: 'nouveau chiffre' }] })}><Plus /> Ajouter un chiffre</button></div>}
        </div>
      </div>
    </>
  );
}

function Appearance() {
  const { content, setContent, previewPalette, isDark } = useSite();
  const toast = useToast();
  const current = content?.settings.palette || 'lagune';
  const [selected, setSelected] = useState<PaletteId>(current);
  const [saving, setSaving] = useState(false);
  useEffect(() => () => previewPalette(null), []);
  const choose = (id: PaletteId) => { setSelected(id); previewPalette(id); };
  const save = async () => {
    setSaving(true);
    try { const c = await api.put<Content>('/api/admin/settings', { palette: selected }); setContent(c); previewPalette(null); toast('Nouvelles couleurs appliquées à tout le site'); }
    finally { setSaving(false); }
  };
  return (
    <>
      <div className="admin-head">
        <div><h1>Couleurs et apparence</h1><p>Cliquez sur une palette : tout l'écran, y compris ce menu, prend ses couleurs pour que vous puissiez juger. Rien ne change pour les visiteurs avant d'appliquer.</p></div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {selected !== current && <button className="btn btn-ghost" type="button" onClick={() => choose(current)}>Revenir à la palette actuelle</button>}
          <button className="btn btn-primary" type="button" disabled={selected === current || saving} onClick={save}><Check /> {selected === current ? 'Palette en ligne' : 'Appliquer au site'}</button>
        </div>
      </div>
      <div className="palettes">
        {PALETTES.map((p, i) => {
          const tk = isDark ? p.dark : p.light;
          return (
            <motion.button key={p.id} type="button" className="palette" aria-pressed={selected === p.id} onClick={() => choose(p.id)}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }}>
              <div className="mini" style={{ background: tk.bg }}>
                <div className="tb" style={{ background: tk.deep }}><i style={{ background: tk.accent }} /><i style={{ background: tk.onDeep, opacity: .5 }} /></div>
                <div className="hero-m" style={{ background: `linear-gradient(120deg, ${tk.deep}, ${tk.deep2})` }}>
                  <i style={{ width: '62%', background: tk.onDeep }} /><i style={{ width: '40%', background: tk.accent }} /><i style={{ width: '24%', height: 16, borderRadius: 8, background: tk.accent, marginTop: 4 }} />
                </div>
                <div className="row-m" style={{ paddingTop: 8 }}><i style={{ background: tk.surface, border: `1px solid ${tk.line}` }} /><i style={{ background: tk.primarySoft }} /><i style={{ background: tk.primary }} /></div>
              </div>
              <div className="info">
                <b>{p.name}{p.id === current && <span className="tag accent" style={{ marginLeft: 8 }}>En ligne</span>}</b>
                <p>{p.story}</p>
                <div className="swatches">{[tk.deep, tk.primary, tk.accent, tk.primarySoft, tk.bg].map((c, j) => <span key={j} style={{ background: c }} title={c} />)}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <h2>Mode clair et mode sombre</h2>
        <p className="muted">Chaque palette existe en version claire et sombre. Le visiteur choisit avec le bouton soleil/lune en haut du site ; par défaut, le site suit le réglage de son téléphone ou de son ordinateur.</p>
      </div>
    </>
  );
}

const KIND_LABELS: Record<InboxMessage['kind'], string> = { contact: 'Contact', inscription: 'Inscription formation', etude: "Demande d'étude", partenariat: 'Partenariat', assistant: 'Via l\'assistant' };

function InboxView({ inbox, setInbox }: { inbox: InboxMessage[]; setInbox: (m: InboxMessage[]) => void }) {
  const [kind, setKind] = useState('');
  const [confirm, setConfirm] = useState<string | null>(null);
  const toast = useToast();
  const list = inbox.filter(m => !kind || m.kind === kind);
  const mark = async (m: InboxMessage, read: boolean) => { await api.patch(`/api/admin/inbox/${m.id}`, { read }); setInbox(inbox.map(x => (x.id === m.id ? { ...x, read } : x))); };
  return (
    <>
      <div className="admin-head"><div><h1>Messages reçus</h1><p>Formulaires de contact, inscriptions aux formations, demandes d'étude, et coordonnées laissées à l'assistant.</p></div></div>
      <div className="coll-tabs">
        <button type="button" className={`chip${!kind ? ' active' : ''}`} onClick={() => setKind('')}>Tous ({inbox.length})</button>
        {Object.entries(KIND_LABELS).map(([k, l]) => <button key={k} type="button" className={`chip${kind === k ? ' active' : ''}`} onClick={() => setKind(k)}>{l} ({inbox.filter(m => m.kind === k).length})</button>)}
      </div>
      <div className="items">
        {list.map(m => (
          <div key={m.id} className={`msg-row${m.read ? '' : ' unread'}`}>
            <div className="meta"><span className="tag">{KIND_LABELS[m.kind]}</span><span>{new Date(m.at).toLocaleString('fr-FR')}</span>{m.subject && <b style={{ color: 'var(--text)' }}>{m.subject}</b>}</div>
            <b>{m.name}</b>
            <div className="meta">{m.email && <span><Mail size={13} /> {m.email}</span>}{m.phone && <span>☎ {m.phone}</span>}</div>
            <pre>{m.message}</pre>
            <div className="row-actions" style={{ justifyContent: 'flex-start' }}>
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => mark(m, !m.read)}>{m.read ? 'Marquer non lu' : 'Marquer comme lu'}</button>
              {confirm === m.id
                ? <><button className="btn btn-danger btn-sm" type="button" onClick={async () => { await api.del(`/api/admin/inbox/${m.id}`); setInbox(inbox.filter(x => x.id !== m.id)); setConfirm(null); toast('Message supprimé'); }}>Oui, supprimer</button><button className="btn btn-ghost btn-sm" type="button" onClick={() => setConfirm(null)}>Annuler</button></>
                : <button className="btn btn-ghost btn-sm" type="button" onClick={() => setConfirm(m.id)}><Trash2 /> Supprimer</button>}
            </div>
          </div>
        ))}
        {!list.length && <div className="panel"><p className="muted">Aucun message pour le moment.</p></div>}
      </div>
    </>
  );
}

function Conversations({ convos, setConvos }: { convos: Conversation[]; setConvos: (c: Conversation[]) => void }) {
  const { content } = useSite();
  const [open, setOpen] = useState<string | null>(convos[0]?.id || null);
  return (
    <>
      <div className="admin-head"><div><h1>Conversations avec {content?.settings.assistantName}</h1><p>Ce que les visiteurs demandent à l'assistant : utile pour repérer les informations qui manquent sur le site.</p></div></div>
      <div className="items">
        {convos.map(c => (
          <div key={c.id} className="msg-row">
            <div className="meta"><span className="tag">{c.lang.toUpperCase()}</span><span>{new Date(c.updatedAt).toLocaleString('fr-FR')}</span><span>{c.turns.length / 2} échange(s)</span><span className="mono">{c.visitor}</span></div>
            <b style={{ cursor: 'pointer' }} onClick={() => setOpen(open === c.id ? null : c.id)}>{c.turns[0]?.text.slice(0, 140)}</b>
            {open === c.id && <div className="convo">{c.turns.map((t, i) => <div key={i} className={t.role === 'user' ? 'u' : 'a'}>{t.text}</div>)}</div>}
            <div className="row-actions" style={{ justifyContent: 'flex-start' }}>
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => setOpen(open === c.id ? null : c.id)}>{open === c.id ? 'Replier' : 'Lire la conversation'}</button>
              <button className="btn btn-ghost btn-sm" type="button" onClick={async () => { await api.del(`/api/admin/conversations/${c.id}`); setConvos(convos.filter(x => x.id !== c.id)); }}><Trash2 /> Supprimer</button>
            </div>
          </div>
        ))}
        {!convos.length && <div className="panel"><p className="muted">Aucune conversation pour le moment.</p></div>}
      </div>
    </>
  );
}
