import { FileText, MessageCircle } from 'lucide-react';
import { formatSize, useCatalogueMeta } from '../lib/catalogue';
import CatalogueActions from './CatalogueActions';

/** "Catalogue" tab: one job, letting visitors view or download the training catalogue PDF */
export default function Catalogue({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { meta, loading } = useCatalogueMeta();

  return (
    <div id="catalogue-view" className="bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-emerald dark:text-orange-300">Catalogue</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Catalogue des formations</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          Retrouvez l'ensemble de nos formations, leurs programmes, durées et tarifs dans notre catalogue au format PDF.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-8">
          {loading ? (
            <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ) : meta ? (
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
              <CatalogueActions meta={meta} />
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
      </div>
    </div>
  );
}
