import { DomainIntervention } from '../types';

/** A domain's presentation; the audience it puts forward comes first in the label */
export default function DomainOverview({ domain, audienceLabel }: { domain: DomainIntervention; audienceLabel: string }) {
  if (!domain.description) return null;
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-emerald dark:text-orange-300">Présentation du domaine</h2>
        <span className="rounded-full bg-[#8A1A24]/10 px-3 py-1 text-xs font-bold text-[#8A1A24] dark:text-red-300">{audienceLabel}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200 sm:text-[15px]">{domain.description}</p>
    </div>
  );
}
