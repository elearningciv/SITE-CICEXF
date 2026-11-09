import { useEffect, useMemo, useState } from 'react';
import { collection, collectionGroup, getDocs, Timestamp } from 'firebase/firestore';
import { Award, Download, GraduationCap, Loader2, RefreshCw, Search, Users } from 'lucide-react';
import { db } from '../firebase';
import { CATALOG, PASS } from '../data/elearning';

/** Admin tab "E-learning": registered learners, their progress and the certificates issued */

interface Learner {
  uid: string;
  nom: string; prenom: string; telephone: string; email: string; pays: string;
  activite: string; formation: string; experience: string;
  createdAt?: Timestamp;
}
interface LearnerProgress { uid: string; courseId: string; scores: Record<string, number>; attempts: Record<string, number>; certificate?: string; updatedAt?: Timestamp }
interface IssuedCertificate { number: string; uid: string; courseTitle: string; lastName: string; firstName: string; average: number; issuedAt?: Timestamp; simulation?: boolean }

const fmt = (t?: Timestamp) => (t ? t.toDate().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '');

export default function AdminLearners() {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [progress, setProgress] = useState<Map<string, LearnerProgress>>(new Map());
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [enrolledAt, setEnrolledAt] = useState<Map<string, Timestamp | undefined>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      getDocs(collection(db, 'learners')),
      getDocs(collectionGroup(db, 'progress')),
      getDocs(collection(db, 'certificates')),
      getDocs(collectionGroup(db, 'enrollments'))
    ]).then(([ls, ps, cs, es]) => {
      if (cancelled) return;
      setLearners(ls.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<Learner, 'uid'>) }))
        .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)));
      setProgress(new Map(ps.docs.map((d) => {
        const uid = d.ref.parent.parent?.id || '';
        return [`${uid}/${d.id}`, { uid, courseId: d.id, ...(d.data() as Omit<LearnerProgress, 'uid' | 'courseId'>) }];
      })));
      setEnrolledAt(new Map(es.docs.map((d) => [`${d.ref.parent.parent?.id}/${d.id}`, d.data().enrolledAt as Timestamp | undefined])));
      setCertificates(cs.docs.map((d) => d.data() as IssuedCertificate)
        .sort((a, b) => (b.issuedAt?.toMillis() ?? 0) - (a.issuedAt?.toMillis() ?? 0)));
    }).catch((e) => {
      console.error('E-learning admin:', e);
      if (!cancelled) setError("Impossible de charger les données de l'e-learning.");
    }).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [reload]);

  // One line per certification the learner registered for (or started)
  const rows = useMemo(() => learners.map((l) => {
    const courses = CATALOG.map((meta) => {
      const key = `${l.uid}/${meta.id}`;
      const p = progress.get(key);
      if (!p && !enrolledAt.has(key)) return null;
      const done = p ? meta.steps.filter((s) => (p.scores?.[s.id] || 0) >= PASS).length : 0;
      const current = meta.steps.find((s) => (p?.scores?.[s.id] || 0) < PASS);
      return { meta, p, done, current, enrolledOn: enrolledAt.get(key) };
    }).filter((x): x is NonNullable<typeof x> => !!x);
    return { l, courses, enrolled: courses.length > 0 };
  }), [learners, progress, enrolledAt]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(({ l, courses }) => [l.nom, l.prenom, l.email, l.telephone, l.pays, l.formation, l.activite, ...courses.map((c) => `${c.meta.title} ${c.p?.certificate || ''}`)].join(' ').toLowerCase().includes(q));
  }, [rows, search]);

  const started = rows.filter((r) => r.enrolled).length;

  const exportCsv = () => {
    const head = ['Nom', 'Prénom', 'Téléphone', 'E-mail', 'Pays', "Domaine d'activité", 'Domaine de formation', 'Expérience', 'Compte créé le', 'Certification', 'Inscrit le', 'Étapes validées', 'Certificat'];
    const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const base = (l: Learner) => [l.nom, l.prenom, l.telephone, l.email, l.pays, l.activite, l.formation, l.experience, fmt(l.createdAt)];
    const lines = [head, ...rows.flatMap(({ l, courses }) => courses.length
      ? courses.map((c) => [...base(l), c.meta.title, fmt(c.enrolledOn), `${c.done}/${c.meta.steps.length}`, c.p?.certificate || ''])
      : [[...base(l), '', '', '', '']])]
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
          { icon: GraduationCap, label: 'Inscrits à une certification', value: started },
          { icon: Award, label: 'Certificats délivrés', value: certificates.filter((c) => !c.simulation).length }
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
              <tr><th className="p-3">Apprenant</th><th className="p-3">Contact</th><th className="p-3">Profil</th><th className="p-3">Compte créé le</th><th className="p-3">Progression</th><th className="p-3">Certificat</th></tr>
            </thead>
            <tbody>
              {filtered.map(({ l, courses }) => (
                <tr key={l.uid} className="border-t border-slate-100 dark:border-slate-800 align-top">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{l.nom.toLocaleUpperCase('fr-FR')} {l.prenom}<div className="text-xs font-normal text-slate-500">{l.pays}</div></td>
                  <td className="p-3"><a href={`mailto:${l.email}`} className="text-brand-blue dark:text-sky-300 break-all">{l.email}</a><div className="text-xs">{l.telephone}</div></td>
                  <td className="p-3 text-xs text-slate-600 dark:text-slate-300">{l.formation}<br />{l.activite} · {l.experience}</td>
                  <td className="p-3 whitespace-nowrap">{fmt(l.createdAt)}</td>
                  <td className="p-3 min-w-[220px]">
                    {!courses.length && <span className="text-xs text-slate-500">Pas encore inscrit à une certification</span>}
                    {courses.map(({ meta, p, done, current, enrolledOn }) => (
                      <div key={meta.id} className="mb-2 last:mb-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{meta.title}</div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"><i className="block h-full bg-brand-blue" style={{ width: `${(done / meta.steps.length) * 100}%` }} /></div>
                        <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{done}/{meta.steps.length} étapes{p && current ? ` · en cours : ${current.title.split(' : ')[0]}${p.scores?.[current.id] !== undefined ? ` (${p.scores[current.id]} %)` : ''}` : !p ? ' · pas commencé' : ''}{enrolledOn ? ` · inscrit le ${fmt(enrolledOn)}` : ''}</div>
                      </div>
                    ))}
                  </td>
                  <td className="p-3 whitespace-nowrap">{courses.some((c) => c.p?.certificate)
                    ? courses.filter((c) => c.p?.certificate).map((c) => <div key={c.meta.id} className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400"><Award className="w-4 h-4" />{c.p!.certificate}</div>)
                    : <span className="text-slate-400">—</span>}</td>
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
                    <td className="p-3 font-bold whitespace-nowrap">{c.number}{c.simulation && <span className="ml-2 rounded bg-violet-100 text-violet-800 px-1.5 py-0.5 text-[10px] font-extrabold uppercase">spécimen</span>}</td>
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
