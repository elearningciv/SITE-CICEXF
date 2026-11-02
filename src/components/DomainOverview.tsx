import { CheckCircle2 } from 'lucide-react';
import { DomainIntervention } from '../types';

/** A domain's presentation, objectives, target audience and expected results */
export default function DomainOverview({ domain }: { domain: DomainIntervention }) {
  const columns = [
    { title: 'Objectifs', items: domain.objectives },
    { title: 'Public cible', items: domain.publicCible },
    { title: 'Résultats attendus', items: domain.resultatsAttendus }
  ].filter(column => column.items?.length);

  return (
    <div className="space-y-4">
      {domain.description && (
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-emerald dark:text-orange-300">Présentation du domaine</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200 sm:text-[15px]">{domain.description}</p>
        </div>
      )}
      {columns.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {columns.map(column => (
            <div key={column.title} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#8A1A24] dark:text-red-300">{column.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {column.items!.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-emerald dark:text-orange-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
