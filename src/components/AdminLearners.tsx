import { useEffect, useMemo, useState } from 'react';
import { collection, collectionGroup, getDocs, Timestamp } from 'firebase/firestore';
import { Award, Download, GraduationCap, Loader2, RefreshCw, Search, Users } from 'lucide-react';
import { db } from '../firebase';
import { COURSES, PASS, type Course } from '../data/elearning';

/** Admin tab "E-learning": registered learners, their progress and the certificates issued */

interface Learner {
  uid: string;
  nom: string; prenom: string; telephone: string; email: string; pays: string;
  activite: string; formation: string; experience: string;
  createdAt?: Timestamp;
}
interface LearnerProgress { uid: string; courseId: string; scores: Record<string, number>; attempts: Record<string, number>; certificate?: string; updatedAt?: Timestamp }
interface IssuedCertificate { number: string; uid: string; courseTitle: string; lastName: string; firstName: string; average: number; issuedAt?: Timestamp }

const fmt = (t?: Timestamp) => (t ? t.toDate().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '');

export default function AdminLearners() {
  const [course, setCourse] = useState<Course | null>(null);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [progress, setProgress] = useState<Map<string, LearnerProgress>>(new Map());
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      COURSES[0].load(),
      getDocs(collection(db, 'learners')),
      getDocs(collectionGroup(db, 'progress')),
      getDocs(collection(db, 'certificates'))
    ]).then(([c, ls, ps, cs]) => {
      if (cancelled) return;
      setCourse(c);
      setLearners(ls.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<Learner, 'uid'>) }))
        .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)));
      setProgress(new Map(ps.docs.map((d) => {
        const uid = d.ref.parent.parent?.id || '';
        return [`${uid}/${d.id}`, { uid, courseId: d.id, ...(d.data() as Omit<LearnerProgress, 'uid' | 'courseId'>) }];
      })));
      setCertificates(cs.docs.map((d) => d.data() as IssuedCertificate)
        .sort((a, b) => (b.issuedAt?.toMillis() ?? 0) - (a.issuedAt?.toMillis() ?? 0)));
    }).catch((e) => {
      console.error('E-learning admin:', e);
      if (!cancelled) setError("Impossible de charger les données de l'e-learning.");
    }).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [reload]);

  const rows = useMemo(() => learners.map((l) => {
    const p = course ? progress.get(`${l.uid}/${course.id}`) : undefined;
    const done = course && p ? course.steps.filter((s) => (p.scores?.[s.id] || 0) >= PASS).length : 0;
    const current = course && p ? course.steps.find((s) => (p.scores?.[s.id] || 0) < PASS) : course?.steps[0];
    return { l, p, done, current };
  }), [learners, progress, course]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(({ l, p }) => [l.nom, l.prenom, l.email, l.telephone, l.pays, l.formation, l.activite, p?.certificate].join(' ').toLowerCase().includes(q));
  }, [rows, search]);

  const started = rows.filter((r) => r.p).length;
  const total = course?.steps.length || 0;

  const exportCsv = () => {
    const head = ['Nom', 'Prénom', 'Téléphone', 'E-mail', 'Pays', "Domaine d'activité", 'Domaine de formation', 'Expérience', 'Inscrit le', 'Étapes validées', 'Certificat'];
    const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [head, ...rows.map(({ l, p, done }) => [l.nom, l.prenom, l.telephone, l.email, l.pays, l.activite, l.formation, l.experience, fmt(l.createdAt), `${done}/${total}`, p?.certificate || ''])]
      .map((r) => r.map(cell).join(';'));
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `apprenants-elearning-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  if (loading) return <p className="flex items-center gap-2 py-12 justify-center text-slate-500"><Loader2 className="w-5 h-5 animate-spin" /> Chargement des apprenants…</p>;
  if (error) return <p className="py-12 text-center font-bold text-brand-emerald">{error}</p>;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Users, label: 'Comptes créés', value: learners.length },
          { icon: GraduationCap, label: 'Parcours commencés', value: started },
          { icon: Award, label: 'Certificats délivrés', value: certificates.length }
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3">
            <Icon className="w-7 h-7 text-brand-blue dark:text-sky-300" />
            <div><p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p><p className="text-xs font-bold text-slate-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un apprenant, un pays, un numéro de certificat…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <button onClick={() => setReload((n) => n + 1)} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold"><RefreshCw className="w-4 h-4" />Actualiser</button>
        <button onClick={exportCsv} disabled={!rows.length} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-blue text-white text-sm font-bold disabled:opacity-40"><Download className="w-4 h-4" />Exporter (CSV)</button>
      </div>

      {!rows.length ? (
        <p className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500">Aucun apprenant inscrit pour le moment.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="p-3">Apprenant</th><th className="p-3">Contact</th><th className="p-3">Profil</th><th className="p-3">Inscrit le</th><th className="p-3">Progression</th><th className="p-3">Certificat</th></tr>
            </thead>
            <tbody>
              {filtered.map(({ l, p, done, current }) => (
                <tr key={l.uid} className="border-t border-slate-100 dark:border-slate-800 align-top">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{l.nom.toLocaleUpperCase('fr-FR')} {l.prenom}<div className="text-xs font-normal text-slate-500">{l.pays}</div></td>
                  <td className="p-3"><a href={`mailto:${l.email}`} className="text-brand-blue dark:text-sky-300 break-all">{l.email}</a><div className="text-xs">{l.telephone}</div></td>
                  <td className="p-3 text-xs text-slate-600 dark:text-slate-300">{l.formation}<br />{l.activite} · {l.experience}</td>
                  <td className="p-3 whitespace-nowrap">{fmt(l.createdAt)}</td>
                  <td className="p-3 min-w-[170px]">
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"><i className="block h-full bg-brand-blue" style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">{done}/{total} étapes{p && current ? ` · en cours : ${current.title.split(' : ')[0]}${p.scores?.[current.id] !== undefined ? ` (${p.scores[current.id]} %)` : ''}` : !p ? ' · pas commencé' : ''}</div>
                  </td>
                  <td className="p-3 whitespace-nowrap">{p?.certificate ? <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400"><Award className="w-4 h-4" />{p.certificate}</span> : <span className="text-slate-400">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {certificates.length > 0 && (
        <div>
          <h3 className="mb-2 font-extrabold text-slate-900 dark:text-white">Certificats délivrés</h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="p-3">Numéro</th><th className="p-3">Titulaire</th><th className="p-3">Certification</th><th className="p-3">Moyenne</th><th className="p-3">Délivré le</th></tr>
              </thead>
              <tbody>
                {certificates.map((c) => (
                  <tr key={c.number} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="p-3 font-bold whitespace-nowrap">{c.number}</td>
                    <td className="p-3">{`${c.lastName} ${c.firstName}`.toLocaleUpperCase('fr-FR')}</td>
                    <td className="p-3 text-xs">{c.courseTitle}</td>
                    <td className="p-3">{c.average} %</td>
                    <td className="p-3 whitespace-nowrap">{fmt(c.issuedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
