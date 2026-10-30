import { useState } from 'react';
import { Download, Eye, Loader2 } from 'lucide-react';
import { CatalogueMeta, downloadCatalogue, openCatalogue } from '../lib/catalogue';

/** "Consulter" + "Télécharger" buttons for the training catalogue (page and ADILINE card) */
export default function CatalogueActions({ meta, compact = false }: { meta: CatalogueMeta; compact?: boolean }) {
  const [busy, setBusy] = useState<'view' | 'download' | null>(null);
  const [error, setError] = useState('');

  const run = async (kind: 'view' | 'download') => {
    setError('');
    // The tab is opened right away (inside the click) so pop-up blockers let it through
    const win = kind === 'view' ? window.open('about:blank', '_blank') : null;
    setBusy(kind);
    try {
      if (kind === 'view') await openCatalogue(meta, win);
      else await downloadCatalogue(meta);
    } catch (err) {
      console.error('Catalogue error:', err);
      win?.close();
      setError("Le catalogue n'a pas pu être chargé. Vérifiez votre connexion et réessayez.");
    } finally {
      setBusy(null);
    }
  };

  const size = compact ? 'px-3 py-2 text-xs' : 'px-5 py-3 text-sm';
  return (
    <div>
      <div className={`flex flex-wrap gap-2 ${compact ? '' : 'sm:gap-3'}`}>
        <button
          type="button"
          onClick={() => run('view')}
          disabled={busy !== null}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 cursor-pointer ${size}`}
        >
          {busy === 'view' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
          Consulter
        </button>
        <button
          type="button"
          onClick={() => run('download')}
          disabled={busy !== null}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-brand-emerald font-bold text-white hover:bg-brand-emerald-dark disabled:opacity-60 cursor-pointer ${size}`}
        >
          {busy === 'download' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Télécharger
        </button>
      </div>
      {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
