interface DomainAxisSelectProps {
  domains: { id: string; title: string; subDomains?: { title: string }[] }[];
  domain: string;
  axis: string;
  onDomainChange: (title: string) => void;
  onAxisChange: (title: string) => void;
  selectClassName?: string;
}

/**
 * Domain + axis pickers fed by the domains managed in "Domaines & axes".
 * A value that no longer exists in the list (older content) stays selectable.
 */
export default function DomainAxisSelect({ domains, domain, axis, onDomainChange, onAxisChange, selectClassName }: DomainAxisSelectProps) {
  const cls = selectClassName || 'w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white font-medium';
  const current = domains.find(d => d.title === domain);
  const axes = current?.subDomains?.map(s => s.title).filter(Boolean) || [];
  return (
    <>
      <div className="space-y-1.5">
        <label className="block font-bold">Domaine :</label>
        <select
          value={domain}
          onChange={(e) => { onDomainChange(e.target.value); onAxisChange(''); }}
          className={cls}
        >
          <option value="">— Choisir un domaine —</option>
          {domain && !current && <option value={domain}>{domain}</option>}
          {domains.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="block font-bold">Axe :</label>
        <select
          value={axis}
          onChange={(e) => onAxisChange(e.target.value)}
          disabled={!domain}
          className={`${cls} disabled:opacity-50`}
        >
          <option value="">{domain ? (axes.length ? '— Choisir un axe —' : 'Aucun axe dans ce domaine') : "Choisissez d'abord un domaine"}</option>
          {axis && !axes.includes(axis) && <option value={axis}>{axis}</option>}
          {axes.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
    </>
  );
}
