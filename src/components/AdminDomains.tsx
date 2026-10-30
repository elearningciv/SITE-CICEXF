import React, { useState } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronRight, ImagePlus, Settings2, Layers } from 'lucide-react';
import { db } from '../firebase';
import { compressImage } from '../lib/imageCompress';
import { getDomainImage } from '../lib/domainImages';

interface AdminDomainsProps {
  domains: any[];
  onDeleteDomain: (id: string) => void;
  onAdvancedEdit: (domain: any) => void;
}

const lines = (text: string) => text.split('\n').map(l => l.trim().replace(/^[-*•0-9.]+\s*/, '')).filter(Boolean);
const toText = (v: unknown) => (Array.isArray(v) ? v.join('\n') : typeof v === 'string' ? v : '');
const slugify = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const EMPTY_DOMAIN = { title: '', shortDescription: '', description: '', imageUrl: '' };
const EMPTY_AXIS = {
  domainId: '', title: '', description: '', imageUrl: '', presentationService: '',
  objectives: '', demarcheAccompagnement: '', resultatsAttendus: '', impactEntite: '', methodeEvaluation: ''
};

const input = 'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-emerald';
const label = 'text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1 block';

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try { onChange(await compressImage(file)); } catch { alert("Impossible de lire cette image."); } finally { setBusy(false); }
  };
  return (
    <div className="flex items-start gap-3">
      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700">
        {value ? <img src={value} alt="" className="h-full w-full object-contain" /> : null}
      </div>
      <div className="flex-1 space-y-2">
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
          <ImagePlus className="w-4 h-4" /> {busy ? 'Traitement…' : 'Choisir une image'}
          <input type="file" accept="image/*" onChange={pick} className="hidden" />
        </label>
        <input value={value.startsWith('data:') ? '' : value} onChange={(e) => onChange(e.target.value)} placeholder="… ou collez l'adresse (URL) d'une image" className={input} />
        {value && <button type="button" onClick={() => onChange('')} className="text-xs font-semibold text-red-600 cursor-pointer">Retirer l'image</button>}
      </div>
    </div>
  );
}

/** Admin tab: domains of intervention and the axes that belong to each domain */
export default function AdminDomains({ domains, onDeleteDomain, onAdvancedEdit }: AdminDomainsProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [domainForm, setDomainForm] = useState<typeof EMPTY_DOMAIN | null>(null);
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  const [axisForm, setAxisForm] = useState<typeof EMPTY_AXIS | null>(null);
  const [editingAxis, setEditingAxis] = useState<{ domainId: string; index: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const writeDomain = async (domain: any) => {
    setSaving(true); setError('');
    try {
      await setDoc(doc(db, 'accompagnements', domain.id), domain);
      return true;
    } catch (err) {
      console.error('Domain save error:', err);
      setError("Enregistrement impossible. Vérifiez votre connexion administrateur, puis réessayez (image trop lourde ?).");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ---- Domains ----
  const newDomain = () => { setAxisForm(null); setEditingDomainId(null); setDomainForm(EMPTY_DOMAIN); };
  const editDomain = (d: any) => {
    setAxisForm(null); setEditingDomainId(d.id);
    setDomainForm({ title: d.title || '', shortDescription: d.shortDescription || '', description: d.description || '', imageUrl: d.imageUrl || '' });
  };
  const saveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainForm) return;
    const existing = editingDomainId ? domains.find(d => d.id === editingDomainId) : null;
    const payload = existing
      ? { ...existing, ...domainForm, slug: slugify(domainForm.title) }
      : {
          id: `acc-${Date.now()}`,
          slug: slugify(domainForm.title),
          ...domainForm,
          presentationService: domainForm.description,
          iconName: 'Layers',
          subDomains: [],
          examples: [],
          createdAt: Timestamp.now()
        };
    if (await writeDomain(payload)) {
      setDomainForm(null);
      setOpen(o => ({ ...o, [payload.id]: true }));
    }
  };

  // ---- Axes ----
  const newAxis = (domainId = '') => { setDomainForm(null); setEditingAxis(null); setAxisForm({ ...EMPTY_AXIS, domainId }); };
  const editAxis = (domainId: string, index: number, s: any) => {
    setDomainForm(null); setEditingAxis({ domainId, index });
    setAxisForm({
      domainId,
      title: s.title || '',
      description: s.description || '',
      imageUrl: s.imageUrl || '',
      presentationService: s.presentationService || '',
      objectives: toText(s.objectives),
      demarcheAccompagnement: toText(s.demarcheAccompagnement),
      resultatsAttendus: toText(s.resultatsAttendus),
      impactEntite: s.impactEntite || '',
      methodeEvaluation: toText(s.methodeEvaluation)
    });
  };
  const saveAxis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!axisForm) return;
    const target = domains.find(d => d.id === axisForm.domainId);
    if (!target) { setError('Choisissez le domaine auquel appartient cet axe.'); return; }
    const previous = editingAxis ? domains.find(d => d.id === editingAxis.domainId)?.subDomains?.[editingAxis.index] : null;
    const axis = {
      ...(previous || {}),
      title: axisForm.title.trim(),
      description: axisForm.description.trim() || axisForm.presentationService.trim(),
      imageUrl: axisForm.imageUrl,
      presentationService: axisForm.presentationService.trim() || axisForm.description.trim(),
      objectives: lines(axisForm.objectives),
      demarcheAccompagnement: lines(axisForm.demarcheAccompagnement),
      resultatsAttendus: lines(axisForm.resultatsAttendus),
      impactEntite: axisForm.impactEntite.trim(),
      methodeEvaluation: lines(axisForm.methodeEvaluation)
    };
    const movedFromOtherDomain = editingAxis && editingAxis.domainId !== axisForm.domainId;
    // The axis may have moved to another domain: remove it from the old one first
    if (movedFromOtherDomain) {
      const source = domains.find(d => d.id === editingAxis!.domainId);
      if (source) {
        const ok = await writeDomain({ ...source, subDomains: (source.subDomains || []).filter((_: any, i: number) => i !== editingAxis!.index) });
        if (!ok) return;
      }
    }
    const subs = [...(target.subDomains || [])];
    if (editingAxis && !movedFromOtherDomain) subs[editingAxis.index] = axis; else subs.push(axis);
    if (await writeDomain({ ...target, subDomains: subs })) {
      setAxisForm(null); setEditingAxis(null);
      setOpen(o => ({ ...o, [target.id]: true }));
    }
  };
  const deleteAxis = async (domain: any, index: number) => {
    if (!window.confirm(`Supprimer l'axe « ${domain.subDomains[index]?.title} » ?`)) return;
    await writeDomain({ ...domain, subDomains: domain.subDomains.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Créez vos domaines d'intervention, puis ajoutez des axes en choisissant le domaine auquel chacun appartient.
          Ils s'affichent dans Accompagnement, Formations et sur la page d'accueil.
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={newDomain} className="bg-brand-blue hover:bg-brand-blue-dark text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" /> Nouveau domaine
          </button>
          <button onClick={() => newAxis()} className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" /> Nouvel axe
          </button>
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-700 dark:text-red-300">{error}</p>}

      {domainForm && (
        <form onSubmit={saveDomain} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4 space-y-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">{editingDomainId ? 'Modifier le domaine' : 'Nouveau domaine'}</h3>
          <label className={label}><span>Nom du domaine *</span>
            <input required value={domainForm.title} onChange={(e) => setDomainForm({ ...domainForm, title: e.target.value })} className={input} placeholder="Ex. : Ingénierie QHSE" />
          </label>
          <label className={label}><span>Résumé (une ou deux phrases)</span>
            <textarea rows={2} value={domainForm.shortDescription} onChange={(e) => setDomainForm({ ...domainForm, shortDescription: e.target.value })} className={input} />
          </label>
          <label className={label}><span>Présentation détaillée</span>
            <textarea rows={4} value={domainForm.description} onChange={(e) => setDomainForm({ ...domainForm, description: e.target.value })} className={input} />
          </label>
          <div className={label}><span>Image du domaine (page d'accueil et Accompagnement)</span>
            <ImageField value={domainForm.imageUrl} onChange={(v) => setDomainForm({ ...domainForm, imageUrl: v })} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setDomainForm(null)} className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"><X className="w-4 h-4" /> Annuler</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-blue text-white flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"><Save className="w-4 h-4" /> {saving ? 'Enregistrement…' : 'Enregistrer le domaine'}</button>
          </div>
        </form>
      )}

      {axisForm && (
        <form onSubmit={saveAxis} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <h3 className="md:col-span-2 text-sm font-black text-slate-900 dark:text-white">{editingAxis ? "Modifier l'axe" : 'Nouvel axe'}</h3>
          <label className={label}><span>Domaine concerné *</span>
            <select required value={axisForm.domainId} onChange={(e) => setAxisForm({ ...axisForm, domainId: e.target.value })} className={input}>
              <option value="">— Choisir un domaine —</option>
              {domains.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
          </label>
          <label className={label}><span>Titre de l'axe *</span>
            <input required value={axisForm.title} onChange={(e) => setAxisForm({ ...axisForm, title: e.target.value })} className={input} />
          </label>
          <label className={`${label} md:col-span-2`}><span>Description courte</span>
            <textarea rows={2} value={axisForm.description} onChange={(e) => setAxisForm({ ...axisForm, description: e.target.value })} className={input} />
          </label>
          <div className={`${label} md:col-span-2`}><span>Image de l'axe</span>
            <ImageField value={axisForm.imageUrl} onChange={(v) => setAxisForm({ ...axisForm, imageUrl: v })} />
          </div>
          <label className={`${label} md:col-span-2`}><span>1. Présentation du service</span>
            <textarea rows={3} value={axisForm.presentationService} onChange={(e) => setAxisForm({ ...axisForm, presentationService: e.target.value })} className={input} />
          </label>
          <label className={label}><span>2. Objectifs (un par ligne)</span>
            <textarea rows={4} value={axisForm.objectives} onChange={(e) => setAxisForm({ ...axisForm, objectives: e.target.value })} className={input} />
          </label>
          <label className={label}><span>3. Démarche d'accompagnement (une étape par ligne)</span>
            <textarea rows={4} value={axisForm.demarcheAccompagnement} onChange={(e) => setAxisForm({ ...axisForm, demarcheAccompagnement: e.target.value })} className={input} />
          </label>
          <label className={label}><span>4. Résultats attendus (un par ligne)</span>
            <textarea rows={4} value={axisForm.resultatsAttendus} onChange={(e) => setAxisForm({ ...axisForm, resultatsAttendus: e.target.value })} className={input} />
          </label>
          <label className={label}><span>6. Méthode d'évaluation (une par ligne)</span>
            <textarea rows={4} value={axisForm.methodeEvaluation} onChange={(e) => setAxisForm({ ...axisForm, methodeEvaluation: e.target.value })} className={input} />
          </label>
          <label className={`${label} md:col-span-2`}><span>5. Impact pour l'entité</span>
            <textarea rows={2} value={axisForm.impactEntite} onChange={(e) => setAxisForm({ ...axisForm, impactEntite: e.target.value })} className={input} />
          </label>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => { setAxisForm(null); setEditingAxis(null); }} className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"><X className="w-4 h-4" /> Annuler</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-emerald text-white flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"><Save className="w-4 h-4" /> {saving ? 'Enregistrement…' : "Enregistrer l'axe"}</button>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {domains.map(d => {
          const subs: any[] = d.subDomains || [];
          const isOpen = !!open[d.id];
          return (
            <li key={d.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="flex items-center gap-3 p-3">
                <button onClick={() => setOpen(o => ({ ...o, [d.id]: !isOpen }))} className="flex flex-1 items-center gap-3 text-left cursor-pointer min-w-0">
                  {isOpen ? <ChevronDown className="w-4 h-4 shrink-0 text-slate-500" /> : <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />}
                  <img src={getDomainImage(d)} alt="" referrerPolicy="no-referrer" className="h-12 w-16 shrink-0 rounded-lg object-cover bg-slate-100" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{d.title}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{subs.length} axe{subs.length > 1 ? 's' : ''}</span>
                  </span>
                </button>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => newAxis(d.id)} title="Ajouter un axe à ce domaine" className="p-2 rounded-lg text-brand-emerald hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"><Plus className="w-4 h-4" /></button>
                  <button onClick={() => editDomain(d)} title="Modifier le domaine" className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => onAdvancedEdit(d)} title="Édition avancée (logiciels, missions types…)" className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><Settings2 className="w-4 h-4" /></button>
                  <button onClick={() => onDeleteDomain(d.id)} title="Supprimer le domaine" className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {isOpen && (
                <ul className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  {subs.length === 0 && <li className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">Aucun axe dans ce domaine pour le moment.</li>}
                  {subs.map((s, i) => (
                    <li key={`${s.title}-${i}`} className="flex items-center gap-3 px-5 py-2.5">
                      <Layers className="w-4 h-4 shrink-0 text-slate-400" />
                      <span className="flex-1 truncate text-sm text-slate-800 dark:text-slate-200">{s.title}</span>
                      <button onClick={() => editAxis(d.id, i, s)} title="Modifier l'axe" className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => deleteAxis(d, i)} title="Supprimer l'axe" className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
