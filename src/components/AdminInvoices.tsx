import { useMemo, useState } from 'react';
import { Ban, Download, Loader2, RotateCcw, Search } from 'lucide-react';
import { Invoice, setInvoiceStatus, toProformaData, useInvoices } from '../lib/invoices';
import { buildProformaPdf, fcfa } from '../lib/proforma';

/** Admin tab "Factures": every proforma issued by ADILINE, with its PDF */
export default function AdminInvoices() {
  const { invoices, loading, error } = useInvoices();
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter(i => [i.number, i.client?.name, i.client?.company, i.client?.email, i.client?.phone, i.formation].join(' ').toLowerCase().includes(q));
  }, [invoices, search]);

  const issued = invoices.filter(i => i.status !== 'Annulée');
  const totalIssued = issued.reduce((sum, i) => sum + (i.total || 0), 0);

  const download = async (inv: Invoice) => {
    setBusyId(inv.id); setActionError('');
    try {
      const blob = await buildProformaPdf(toProformaData(inv));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Proforma-CICEXF-${inv.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      console.error('Invoice PDF error:', err);
      setActionError('Le PDF n\'a pas pu être généré.');
    } finally {
      setBusyId(null);
    }
  };

  const toggleStatus = async (inv: Invoice) => {
    const next = inv.status === 'Annulée' ? 'Émise' : 'Annulée';
    if (next === 'Annulée' && !window.confirm(`Annuler la facture ${inv.number} ? Son numéro reste réservé.`)) return;
    setBusyId(inv.id); setActionError('');
    try { await setInvoiceStatus(inv.id, next); } catch { setActionError('Modification impossible. Réessayez.'); } finally { setBusyId(null); }
  };

  const dateOf = (inv: Invoice) => inv.createdAt ? inv.createdAt.toDate().toLocaleDateString('fr-FR') : '—';

  return (
    <div className="p-4 sm:p-5 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Toutes les factures proforma établies par ADILINE, numérotées dans l'ordre (PF + année + numéro). Une facture n'est jamais
          supprimée : elle peut être annulée, et son numéro reste réservé.
        </p>
        <label className="relative w-full sm:w-72 shrink-0">
          <span className="sr-only">Rechercher une facture</span>
          <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="N°, client, formation…"
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><p className="text-xs font-bold uppercase text-slate-500">Factures émises</p><p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{issued.length}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><p className="text-xs font-bold uppercase text-slate-500">Montant total</p><p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{fcfa(totalIssued)}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><p className="text-xs font-bold uppercase text-slate-500">Annulées</p><p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{invoices.length - issued.length}</p></div>
      </div>

      {(error || actionError) && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error || actionError}</p>}

      {loading ? (
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {invoices.length ? 'Aucune facture ne correspond à la recherche.' : 'Aucune facture pour le moment : elles apparaîtront ici dès la première inscription confirmée avec ADILINE.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50">
              <tr>
                <th className="p-3">N°</th>
                <th className="p-3">Date</th>
                <th className="p-3">Client</th>
                <th className="p-3">Formation</th>
                <th className="p-3 text-center">Part.</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3">Statut</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(inv => (
                <tr key={inv.id} className={inv.status === 'Annulée' ? 'opacity-60' : ''}>
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{inv.number}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{dateOf(inv)}</td>
                  <td className="p-3">
                    <span className="block font-semibold text-slate-900 dark:text-white">{inv.client?.isCompany && inv.client.company ? inv.client.company : inv.client?.name}</span>
                    <span className="block text-xs text-slate-500">{inv.client?.phone} · {inv.client?.email}</span>
                  </td>
                  <td className="p-3 max-w-[220px] truncate text-slate-700 dark:text-slate-300" title={inv.formation}>{inv.formation}</td>
                  <td className="p-3 text-center">{inv.participants}</td>
                  <td className="p-3 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">{inv.total !== null && inv.total !== undefined ? fcfa(inv.total) : 'À confirmer'}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${inv.status === 'Annulée' ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'}`}>{inv.status}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => download(inv)} disabled={busyId === inv.id} title="Télécharger le PDF" className="inline-flex items-center gap-1 rounded-lg bg-brand-blue px-2.5 py-1.5 text-xs font-bold text-white disabled:opacity-60 cursor-pointer">
                        {busyId === inv.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} PDF
                      </button>
                      <button onClick={() => toggleStatus(inv)} disabled={busyId === inv.id} title={inv.status === 'Annulée' ? 'Rétablir la facture' : 'Annuler la facture'} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                        {inv.status === 'Annulée' ? <RotateCcw className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                        {inv.status === 'Annulée' ? 'Rétablir' : 'Annuler'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
