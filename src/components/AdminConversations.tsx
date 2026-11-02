import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Loader2, Search, Trash2 } from 'lucide-react';
import { Conversation, deleteConversation, loadMessages, useConversations } from '../lib/adilineConversations';
import { useInvoices } from '../lib/invoices';
import { buildConversationsHtml, downloadHtml, ReportMessage, reportDate } from '../lib/adminReports';

/** Admin tab "Discussions": every conversation with ADILINE, one entry per person, and the file with all of them */
export default function AdminConversations() {
  const { conversations, loading, error } = useConversations();
  const { invoices } = useInvoices();
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [openMessages, setOpenMessages] = useState<ReportMessage[] | null>(null);
  const [exporting, setExporting] = useState(false);
  const [actionError, setActionError] = useState('');

  // Who is who: what the person told ADILINE, completed by their invoice; otherwise "Visiteur n", numbered by arrival
  const people = useMemo(() => {
    const byArrival = [...conversations].sort((a, b) => (a.startedAt?.toMillis() ?? 0) - (b.startedAt?.toMillis() ?? 0));
    const rank = new Map(byArrival.map((c, i) => [c.id, i + 1]));
    return new Map(conversations.map(c => {
      const client = invoices.find(i => i.visitorId === c.id)?.client;
      return [c.id, {
        label: c.contact?.name || client?.name || `Visiteur ${rank.get(c.id)}`,
        whatsapp: c.contact?.whatsapp || client?.phone || '',
        email: c.contact?.email || client?.email || ''
      }];
    }));
  }, [conversations, invoices]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c => {
      const p = people.get(c.id);
      return [p?.label, p?.whatsapp, p?.email, c.lastPreview].join(' ').toLowerCase().includes(q);
    });
  }, [conversations, people, search]);

  const withWhatsapp = conversations.filter(c => people.get(c.id)?.whatsapp).length;

  const toggle = async (id: string) => {
    if (openId === id) { setOpenId(null); return; }
    setOpenId(id); setOpenMessages(null); setActionError('');
    try { setOpenMessages(await loadMessages(id)); } catch { setActionError('Impossible de charger cette discussion.'); }
  };

  const downloadFile = async () => {
    setExporting(true); setActionError('');
    try {
      const items = [];
      for (const c of conversations) {
        const p = people.get(c.id);
        items.push({
          label: p?.label || 'Visiteur',
          whatsapp: p?.whatsapp,
          email: p?.email,
          startedAt: c.startedAt ? c.startedAt.toDate() : null,
          lastMessageAt: c.lastMessageAt ? c.lastMessageAt.toDate() : null,
          messages: await loadMessages(c.id)
        });
      }
      downloadHtml(buildConversationsHtml(items), `Discussions-ADILINE-${reportDate()}.html`);
    } catch (err) {
      console.error('Conversations file error:', err);
      setActionError('Le fichier n\'a pas pu être généré. Réessayez.');
    } finally {
      setExporting(false);
    }
  };

  const remove = async (c: Conversation) => {
    if (!window.confirm(`Supprimer définitivement la discussion avec ${people.get(c.id)?.label} ?`)) return;
    try { await deleteConversation(c.id); if (openId === c.id) setOpenId(null); } catch { setActionError('Suppression impossible. Réessayez.'); }
  };

  const when = (c: Conversation) => c.lastMessageAt ? c.lastMessageAt.toDate().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

  return (
    <div className="p-4 sm:p-5 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Toutes les discussions d'ADILINE, regroupées par interlocuteur : les messages de deux personnes ne se mélangent jamais.
        </p>
        <label className="relative w-full sm:w-72 shrink-0">
          <span className="sr-only">Rechercher une discussion</span>
          <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, WhatsApp, e-mail…"
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><p className="text-xs font-bold uppercase text-slate-500">Interlocuteurs</p><p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{conversations.length}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><p className="text-xs font-bold uppercase text-slate-500">Numéros WhatsApp</p><p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{withWhatsapp}</p></div>
      </div>

      <button
        onClick={downloadFile}
        disabled={exporting || !conversations.length}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
      >
        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
        Télécharger le fichier de toutes les discussions (HTML, imprimable en PDF)
      </button>

      {(error || actionError) && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error || actionError}</p>}

      {loading ? (
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {conversations.length ? 'Aucune discussion ne correspond à la recherche.' : 'Aucune discussion pour le moment : elles apparaîtront ici dès le prochain échange avec ADILINE.'}
        </p>
      ) : (
        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {filtered.map(c => {
            const p = people.get(c.id);
            const isOpen = openId === c.id;
            return (
              <div key={c.id}>
                <div className="flex items-center gap-2 p-3">
                  <button onClick={() => toggle(c.id)} className="flex min-w-0 flex-1 items-start gap-2 text-left cursor-pointer">
                    {isOpen ? <ChevronDown className="mt-0.5 w-4 h-4 shrink-0 text-slate-500" /> : <ChevronRight className="mt-0.5 w-4 h-4 shrink-0 text-slate-500" />}
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-900 dark:text-white">{p?.label}</span>
                      <span className="block text-xs text-slate-500">
                        {[p?.whatsapp && `WhatsApp ${p.whatsapp}`, p?.email, `${c.messageCount ?? 0} message(s)`, when(c)].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                  </button>
                  <button onClick={() => remove(c)} title="Supprimer cette discussion" className="rounded-lg border border-slate-300 p-1.5 text-slate-500 hover:text-red-700 dark:border-slate-700 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {isOpen && (
                  <div className="space-y-2 bg-slate-50 p-3 dark:bg-slate-950/50">
                    {openMessages === null && !actionError && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                    {openMessages?.map((m, i) => (
                      <div key={i} className={`rounded-xl p-2.5 text-sm ${m.role === 'user' ? 'ml-6 sm:ml-16 bg-emerald-50 dark:bg-emerald-950/30' : 'mr-6 sm:mr-16 bg-white dark:bg-slate-900'}`}>
                        <p className="text-xs font-bold text-slate-500">{m.role === 'user' ? p?.label : 'ADILINE'} · {m.at ? m.at.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : ''}</p>
                        <p className="mt-0.5 whitespace-pre-wrap break-words text-slate-800 dark:text-slate-200">{m.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
