import { useState } from 'react';
import { BookOpen, Check, Copy, Download, Eye, Link2, Loader2 } from 'lucide-react';
import { CatalogueMeta, catalogueLink, downloadCatalogue, openCatalogue, useCatalogueMeta } from '../lib/catalogue';

/**
 * "Consulter" + "Télécharger" buttons for the training catalogue (page, articles, ADILINE).
 * With withLinks, it also shows the direct links a visitor can click later or share.
 */
export default function CatalogueActions({ meta, compact = false, withLinks = false }: { meta: CatalogueMeta; compact?: boolean; withLinks?: boolean }) {
  const [busy, setBusy] = useState<'view' | 'download' | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const run = async (kind: 'view' | 'download') => {
    setError('');
    // The tab is opened right away (inside the click) so pop-up blockers let it through
    // Phones without a built-in PDF reader get the file instead of an empty tab
    if (kind === 'view' && (navigator as Navigator & { pdfViewerEnabled?: boolean }).pdfViewerEnabled === false) kind = 'download';
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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(catalogueLink('telecharger'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError('Copie impossible : faites un appui long sur le lien pour le copier.');
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

      {withLinks && (
        <div className="mt-3 space-y-1.5 border-t border-slate-200 pt-3 text-xs dark:border-slate-700">
          <p className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300"><Link2 className="w-3.5 h-3.5" /> Liens directs</p>
          <a href={catalogueLink('ouvrir')} target="_blank" rel="noreferrer" className="block break-all font-semibold text-brand-blue underline underline-offset-2 dark:text-sky-300">
            Ouvrir le catalogue dans le navigateur
          </a>
          <a href={catalogueLink('telecharger')} target="_blank" rel="noreferrer" className="block break-all font-semibold text-brand-blue underline underline-offset-2 dark:text-sky-300">
            Télécharger le catalogue (PDF)
          </a>
          <button type="button" onClick={copyLink} className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Lien copié' : 'Copier le lien de téléchargement'}
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

/** Single "Consulter le catalogue de formation" button (shown only when a catalogue is published) */
export function ViewCatalogueButton() {
  const { meta } = useCatalogueMeta();
  const [busy, setBusy] = useState(false);
  if (!meta) return null;

  const view = async () => {
    const canView = (navigator as Navigator & { pdfViewerEnabled?: boolean }).pdfViewerEnabled !== false;
    // The tab is opened right away (inside the click) so pop-up blockers let it through
    const win = canView ? window.open('about:blank', '_blank') : null;
    setBusy(true);
    try {
      if (canView) await openCatalogue(meta, win);
      else await downloadCatalogue(meta);
    } catch (err) {
      console.error('Catalogue error:', err);
      win?.close();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={view}
      disabled={busy}
      className="px-4 py-2 rounded-lg border border-[#8A1A24] text-[#8A1A24] hover:bg-[#8A1A24]/5 dark:border-red-300 dark:text-red-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
      <span>Consulter le catalogue de formation</span>
    </button>
  );
}
