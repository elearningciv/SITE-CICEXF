import { useEffect, useRef, useState } from 'react';
import { FileText, Loader2, MessageCircle } from 'lucide-react';
import { downloadCatalogue, formatSize, loadCatalogueBlob, useCatalogueMeta } from '../lib/catalogue';
import CatalogueActions from './CatalogueActions';

/** "Catalogue" tab: one job, letting visitors view or download the training catalogue PDF */
export default function Catalogue({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { meta, loading } = useCatalogueMeta();
  // Direct links (?action=ouvrir / ?action=telecharger) run their action once on arrival
  const [action] = useState(() => new URLSearchParams(window.location.search).get('action'));
  const [status, setStatus] = useState<string>('');
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (loading || done.current || (action !== 'ouvrir' && action !== 'telecharger')) return;
    done.current = true;
    window.history.replaceState(window.history.state, '', '/catalogue');
    if (!meta) return;
    setStatus(action === 'ouvrir' ? 'Ouverture du catalogue…' : 'Téléchargement du catalogue…');
    // "Open" shows the PDF inside this page; devices without a PDF reader get the file instead
    const canView = (navigator as Navigator & { pdfViewerEnabled?: boolean }).pdfViewerEnabled !== false;
    (action === 'ouvrir' && canView
      ? loadCatalogueBlob(meta).then(blob => { setViewerUrl(URL.createObjectURL(blob)); })
      : downloadCatalogue(meta))
      .then(() => setStatus(action === 'telecharger' || !canView ? 'Le téléchargement a démarré. Retrouvez le fichier dans vos téléchargements.' : ''))
      .catch((err) => { console.error('Catalogue link error:', err); setStatus("Le catalogue n'a pas pu être chargé : utilisez les boutons ci-dessous."); });
  }, [loading, meta, action]);

  return (
    <div id="catalogue-view" className="bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
      <div className={`mx-auto px-4 sm:px-6 ${viewerUrl ? 'max-w-6xl' : 'max-w-3xl'}`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-emerald dark:text-orange-300">Catalogue</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Catalogue des formations</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          Retrouvez l'ensemble de nos formations, leurs programmes, durées et tarifs dans notre catalogue au format PDF.
        </p>

        {status && (
          <p className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            {status.endsWith('…') && <Loader2 className="w-4 h-4 animate-spin" />} {status}
          </p>
        )}

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-8">
          {loading ? (
            <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ) : meta ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300">
                    <FileText className="w-7 h-7" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900 dark:text-white" title={meta.name}>{meta.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      PDF · {formatSize(meta.size)} · mis à jour le {new Date(meta.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
              <CatalogueActions meta={meta} withLinks />
            </div>
          ) : (
            <div className="text-center">
              <FileText className="mx-auto w-10 h-10 text-slate-400" />
              <p className="mt-3 font-bold text-slate-900 dark:text-white">Le catalogue sera bientôt disponible en téléchargement.</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">En attendant, demandez-le à nos conseillers : nous vous l'envoyons sans délai.</p>
              <button
                onClick={() => setActiveTab('contact')}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-emerald px-5 py-3 text-sm font-bold text-white hover:bg-brand-emerald-dark cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> Nous contacter
              </button>
            </div>
          )}
        </div>

        {viewerUrl && meta && (
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{meta.name}</p>
              <button onClick={() => setViewerUrl(null)} className="shrink-0 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer">Fermer l&apos;aperçu</button>
            </div>
            <iframe src={viewerUrl} title={`Catalogue : ${meta.name}`} className="h-[80vh] w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
