import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Star, Save, X } from 'lucide-react';
import { Testimonial } from '../types';
import { saveTestimonials, useTestimonials } from '../lib/testimonials';

const EMPTY = { name: '', role: '', organization: '', text: '', rating: 5 };

/** Admin tab: add, edit and remove the testimonials shown on the home and Réalisations pages */
export default function AdminTestimonials() {
  const items = useTestimonials();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const openNew = () => { setForm(EMPTY); setEditingId(null); setError(''); setShowForm(true); };
  const openEdit = (t: Testimonial) => {
    setForm({ name: t.name, role: t.role, organization: t.organization, text: t.text, rating: t.rating || 5 });
    setEditingId(t.id); setError(''); setShowForm(true);
  };

  const persist = async (next: Testimonial[]) => {
    setSaving(true); setError('');
    try {
      await saveTestimonials(next);
      return true;
    } catch (err) {
      console.error('Testimonial save error:', err);
      setError("Enregistrement impossible. Vérifiez que vous êtes connecté avec un compte administrateur.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entry: Testimonial = {
      id: editingId || `t_${Date.now()}`,
      name: form.name.trim(),
      role: form.role.trim(),
      organization: form.organization.trim(),
      text: form.text.trim(),
      rating: Math.min(5, Math.max(1, Number(form.rating) || 5)),
      avatarUrl: ''
    };
    const next = editingId ? items.map(t => (t.id === editingId ? entry : t)) : [...items, entry];
    if (await persist(next)) setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce témoignage du site ?')) return;
    await persist(items.filter(t => t.id !== id));
  };

  const input = 'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-emerald';

  return (
    <div className="p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          La section « Ce que disent nos participants » n'apparaît sur le site que lorsqu'au moins un témoignage est enregistré ici.
        </p>
        <button onClick={openNew} className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer">
          <Plus className="w-4 h-4" /><span>Ajouter un témoignage</span>
        </button>
      </div>

      {error && <p className="rounded-xl bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-700 dark:text-red-300">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1">
            <span>Nom du participant *</span>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder="Ex. : M. Kouassi Jean" />
          </label>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1">
            <span>Fonction</span>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={input} placeholder="Ex. : Responsable Suivi-Évaluation" />
          </label>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1">
            <span>Organisation</span>
            <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className={input} placeholder="Ex. : ONG, ministère, entreprise" />
          </label>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1">
            <span>Note (sur 5)</span>
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={input}>
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1 sm:col-span-2">
            <span>Témoignage *</span>
            <textarea required rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className={input} />
          </label>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 cursor-pointer">
              <X className="w-4 h-4" /><span>Annuler</span>
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-emerald hover:bg-brand-emerald-dark text-white flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer">
              <Save className="w-4 h-4" /><span>{saving ? 'Enregistrement…' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Aucun témoignage pour le moment : la section est masquée sur le site.
        </p>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {items.map(t => (
            <li key={t.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{[t.role, t.organization].filter(Boolean).join(' · ')}</p>
                  <p className="mt-1 flex gap-0.5 text-amber-500">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(t)} title="Modifier" className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(t.id)} title="Supprimer" className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="mt-2 text-sm italic text-slate-700 dark:text-slate-300 line-clamp-4">« {t.text} »</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
