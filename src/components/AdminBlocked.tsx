import { ShieldAlert } from 'lucide-react';

/** What a visitor sees at /admin: no form, no address, nothing to try */
export default function AdminBlocked({ onHome }: { onHome: () => void }) {
  return (
    <div id="admin-blocked-view" className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-16 dark:bg-[#020817]">
      <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#8A1A24] dark:bg-red-950/40 dark:text-red-300">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <h1 className="mt-4 font-display text-xl font-extrabold text-slate-900 dark:text-white">Accès non autorisé</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Cette page n'est pas accessible au public.</p>
        <button
          type="button"
          onClick={onHome}
          className="mt-5 rounded-xl bg-[#8A1A24] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6D141C] cursor-pointer"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
