import React, { useState } from 'react';
import { FileText, Trash2, UploadCloud } from 'lucide-react';
import { deleteCatalogue, formatSize, MAX_CATALOGUE_BYTES, uploadCatalogue, useCatalogueMeta } from '../lib/catalogue';
import CatalogueActions from './CatalogueActions';

/** Admin tab: upload, replace or remove the training catalogue PDF */
export default function AdminCatalogue() {
  const { meta, loading } = useCatalogueMeta();
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(''); setMessage(''); setProgress(0);
    try {
      await uploadCatalogue(file, setProgress);
      setMessage('Catalogue publié : il est disponible dans l\'onglet Catalogue et via ADILINE.');
    } catch (err: any) {
      console.error('Catalogue upload error:', err);
      setError(err?.message?.startsWith('Le ') ? err.message : "Envoi impossible. Vérifiez votre connexion administrateur, puis réessayez.");
    } finally {
      setProgress(null);
    }
  };

  const onDelete = async () => {
    if (!window.confirm('Retirer le catalogue du site ?')) return;
    setError(''); setMessage('');
    try {
      await deleteCatalogue();
      setMessage('Catalogue retiré du site.');
    } catch (err) {
      console.error('Catalogue delete error:', err);
      setError('Suppression impossible. Réessayez.');
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Ajoutez le PDF de votre catalogue de formation (15 Mo maximum). Les visiteurs le consultent ou le téléchargent depuis
        l'onglet « Catalogue », et ADILINE le propose dans la conversation quand on le lui demande.
      </p>

      {loading ? (
        <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      ) : meta ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-8 h-8 shrink-0 text-red-700 dark:text-red-300" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{meta.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatSize(meta.size)} · mis à jour le {new Date(meta.updatedAt).toLocaleString('fr-FR')}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CatalogueActions meta={meta} compact />
            <button onClick={onDelete} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer">
              <Trash2 className="w-4 h-4" /> Retirer
            </button>
          </div>
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Aucun catalogue en ligne pour le moment.
        </p>
      )}

      <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${progress !== null ? 'border-brand-emerald bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-slate-300 hover:border-brand-emerald dark:border-slate-700'}`}>
        <UploadCloud className="w-8 h-8 text-brand-emerald" />
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {progress !== null ? `Envoi en cours… ${progress} %` : meta ? 'Remplacer le catalogue (PDF)' : 'Choisir le PDF du catalogue'}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">PDF uniquement · {formatSize(MAX_CATALOGUE_BYTES)} maximum</span>
        <input type="file" accept="application/pdf,.pdf" onChange={onFile} disabled={progress !== null} className="hidden" />
      </label>

      {message && <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">{message}</p>}
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
    </div>
  );
}
