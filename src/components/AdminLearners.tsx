import { useEffect, useMemo, useState } from 'react';
import { collection, collectionGroup, getDocs, Timestamp } from 'firebase/firestore';
import { Archive, Award, Ban, Download, ExternalLink, GraduationCap, Loader2, PauseCircle, PlayCircle, RefreshCw, Search, Trash2, Users } from 'lucide-react';
import { db } from '../firebase';
import { CATALOG, PASS, courseStatus, type CourseStatus } from '../data/elearning';
import { setCourseStatus, useCourseStatuses } from '../lib/elearningCourses';
import type { Certificate } from '../lib/elearningApi';

/** Admin tab "E-learning": learners and their progress, opening of the certifications, archive of all certificates */

interface Learner {
  uid: string;
  nom: string; prenom: string; telephone: string; email: string; pays: string;
  activite: string; formation: string; experience: string;
  createdAt?: Timestamp;
}
interface LearnerProgress { uid: string; courseId: string; scores: Record<string, number>; attempts: Record<string, number>; certificate?: string; updatedAt?: Timestamp }
interface IssuedCertificate {
  number: string; uid: string; courseId: string; courseTitle: string; lastName: string; firstName: string; email?: string | null;
  average: number; hours: number; stats: Certificate['stats'];
  startedAt?: Timestamp; finishedAt?: Timestamp; issuedAt?: Timestamp; simulation?: boolean;
}

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
  const [section, setSection] = useState<'learners' | 'courses' | 'archive'>('learners');

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

  const tabs = [
    { id: 'learners' as const, label: 'Apprenants', icon: Users },
    { id: 'courses' as const, label: 'Certifications (ouverture)', icon: GraduationCap },
    { id: 'archive' as const, label: `Archives des certificats (${certificates.length})`, icon: Archive }
  ];
  const nav = (
    <div className="flex flex-wrap gap-2" role="tablist">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button key={id} role="tab" aria-selected={section === id} onClick={() => setSection(id)}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold border ${section === id ? 'bg-brand-blue text-white border-brand-blue' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
          <Icon className="w-4 h-4" />{label}
        </button>
      ))}
    </div>
  );
  if (section === 'courses') return <div className="space-y-5">{nav}<CoursesAdmin progress={progress} enrolledAt={enrolledAt} certificates={certificates} /></div>;
  if (section === 'archive') return <div className="space-y-5">{nav}<CertificateArchive certificates={certificates} onReload={() => setReload((n) => n + 1)} /></div>;

  return (
    <div className="space-y-5">
      {nav}
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

    </div>
  );
}

// ---------------------------------------------------------------------------
// Opening of the certifications: open by default, closing is reversible, deleting is final
// ---------------------------------------------------------------------------
const STATUS_LABEL: Record<CourseStatus, string> = { open: 'Ouverte', closed: 'Fermée', deleted: 'Supprimée' };

function CoursesAdmin({ progress, enrolledAt, certificates }: {
  progress: Map<string, LearnerProgress>; enrolledAt: Map<string, Timestamp | undefined>; certificates: IssuedCertificate[];
}) {
  const { statuses, loading, error } = useCourseStatuses();
  const [busy, setBusy] = useState('');
  const [actionError, setActionError] = useState('');

  const learnersOf = (id: string) => {
    const uids = new Set<string>();
    for (const k of [...progress.keys(), ...enrolledAt.keys()]) if (k.endsWith(`/${id}`)) uids.add(k.split('/')[0]);
    return uids.size;
  };
  const certsOf = (id: string) => certificates.filter((c) => c.courseId === id && !c.simulation).length;

  const change = async (id: string, title: string, next: CourseStatus) => {
    if (next === 'closed' && !window.confirm(`Fermer la certification « ${title} » ?\n\nElle disparaîtra du site pour les nouveaux inscrits. Les apprenants en cours gardent leur progression et la retrouveront à la réouverture. Les certificats délivrés restent valables.`)) return;
    if (next === 'deleted') {
      const typed = window.prompt(`Supprimer DÉFINITIVEMENT la certification « ${title} » ?\n\nElle ne pourra plus être rouverte. Les certificats déjà délivrés restent valables et archivés.\n\nTapez SUPPRIMER pour confirmer :`);
      if ((typed || '').trim().toUpperCase() !== 'SUPPRIMER') return;
    }
    setBusy(id); setActionError('');
    try {
      await setCourseStatus(id, next);
    } catch (e) {
      console.error('Statut de certification :', e);
      setActionError('Modification impossible. Vérifiez votre connexion administrateur, puis réessayez.');
    } finally {
      setBusy('');
    }
  };

  if (loading) return <p className="flex items-center gap-2 py-10 justify-center text-slate-500"><Loader2 className="w-5 h-5 animate-spin" /> Chargement des certifications…</p>;
  const rows = CATALOG.map((meta) => ({ meta, status: courseStatus(meta, statuses) }));
  const active = rows.filter((r) => r.status !== 'deleted');
  const deleted = rows.filter((r) => r.status === 'deleted');

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Une nouvelle certification est <strong>ouverte</strong> par défaut. La <strong>fermeture</strong> la retire du site sans rien effacer : vous pouvez la rouvrir à tout moment.
        La <strong>suppression</strong> est définitive. Dans tous les cas, les certificats déjà délivrés restent valables et disponibles dans les archives.
      </p>
      {(error || actionError) && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error || actionError}</p>}
      <div className="grid gap-3">
        {active.map(({ meta, status }) => (
          <div key={meta.id} className={`rounded-2xl border p-4 flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 ${status === 'open' ? 'border-emerald-300 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-800'}`}>
            <div className="flex-1 min-w-[240px]">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                {status === 'open' ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}{STATUS_LABEL[status]}
              </span>
              <p className="mt-1 font-extrabold text-slate-900 dark:text-white">{meta.title}</p>
              <p className="text-xs text-slate-500">{meta.domain} · {learnersOf(meta.id)} apprenant(s) inscrit(s) · {certsOf(meta.id)} certificat(s) délivré(s)</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {status === 'open' ? (
                <button onClick={() => change(meta.id, meta.title, 'closed')} disabled={busy === meta.id} className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400 text-amber-800 dark:text-amber-300 px-3 py-2 text-sm font-bold hover:bg-amber-50 dark:hover:bg-amber-950/40 disabled:opacity-50">
                  {busy === meta.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}Fermer
                </button>
              ) : (
                <button onClick={() => change(meta.id, meta.title, 'open')} disabled={busy === meta.id} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 text-white px-3 py-2 text-sm font-bold hover:bg-emerald-800 disabled:opacity-50">
                  {busy === meta.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}Ouvrir
                </button>
              )}
              <button onClick={() => change(meta.id, meta.title, 'deleted')} disabled={busy === meta.id} className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 text-red-700 dark:text-red-300 px-3 py-2 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-50">
                <Trash2 className="w-4 h-4" />Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
      {deleted.length > 0 && (
        <details className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300">Certifications supprimées ({deleted.length})</summary>
          <ul className="px-4 pb-4 space-y-1 text-sm text-slate-500">
            {deleted.map(({ meta }) => <li key={meta.id}>{meta.title} · {certsOf(meta.id)} certificat(s) archivé(s)</li>)}
          </ul>
        </details>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Archive of every certificate issued on the site, re-downloadable at any time
// ---------------------------------------------------------------------------
const iso = (t?: Timestamp) => (t ? t.toDate().toISOString() : '');
const toCertificate = (c: IssuedCertificate): Certificate => ({
  number: c.number, courseId: c.courseId, courseTitle: c.courseTitle, lastName: c.lastName, firstName: c.firstName,
  startedAt: iso(c.startedAt), finishedAt: iso(c.finishedAt), issuedAt: iso(c.issuedAt),
  average: c.average, hours: c.hours, stats: c.stats, simulation: !!c.simulation
});

function CertificateArchive({ certificates, onReload }: { certificates: IssuedCertificate[]; onReload: () => void }) {
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [course, setCourse] = useState('');
  const [showSpecimens, setShowSpecimens] = useState(false);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const years = useMemo(() => [...new Set(certificates.map((c) => c.issuedAt?.toDate().getFullYear()).filter(Boolean) as number[])].sort((a, b) => b - a), [certificates]);
  const courses = useMemo(() => [...new Map(certificates.map((c) => [c.courseId, c.courseTitle])).entries()], [certificates]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return certificates.filter((c) => (showSpecimens || !c.simulation)
      && (!year || String(c.issuedAt?.toDate().getFullYear()) === year)
      && (!course || c.courseId === course)
      && (!q || [c.number, c.lastName, c.firstName, c.email, c.courseTitle].join(' ').toLowerCase().includes(q)));
  }, [certificates, search, year, course, showSpecimens]);

  const official = certificates.filter((c) => !c.simulation);
  const thisYear = official.filter((c) => c.issuedAt?.toDate().getFullYear() === new Date().getFullYear()).length;

  const download = async (c: IssuedCertificate) => {
    setBusy(c.number); setError('');
    try {
      const { downloadCertificate } = await import('../lib/certificatePdf');
      await downloadCertificate(toCertificate(c));
    } catch (e) {
      console.error('PDF certificat :', e);
      setError("Le PDF n'a pas pu être créé. Réessayez.");
    } finally {
      setBusy('');
    }
  };

  const exportCsv = () => {
    const head = ['Numéro', 'Nom', 'Prénom', 'E-mail', 'Certification', 'Résultat (%)', 'Formation du', 'au', 'Délivré le', 'Type'];
    const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [head, ...filtered.map((c) => [c.number, c.lastName, c.firstName, c.email || '', c.courseTitle, c.average, fmt(c.startedAt), fmt(c.finishedAt), fmt(c.issuedAt), c.simulation ? 'Spécimen' : 'Officiel'])]
      .map((r) => r.map(cell).join(';'));
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `registre-certificats-elearning-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const field = 'rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm';
  const tiles: [string, number][] = [['Certificats délivrés', official.length], [`Délivrés en ${new Date().getFullYear()}`, thisYear], ['Spécimens de simulation', certificates.length - official.length]];
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Tous les certificats délivrés sur le site, conservés comme les factures. Si un apprenant perd son certificat, retrouvez-le ici par son nom ou son numéro
        et téléchargez le PDF pour le lui transmettre : il est recréé à l'identique à partir de l'enregistrement d'origine (même numéro, mêmes dates, même résultat).
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tiles.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom, prénom, e-mail ou numéro de certificat…" className={`${field} w-full pl-9`} />
        </div>
        <select value={year} onChange={(e) => setYear(e.target.value)} className={field} aria-label="Année">
          <option value="">Toutes les années</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={course} onChange={(e) => setCourse(e.target.value)} className={`${field} max-w-[260px]`} aria-label="Certification">
          <option value="">Toutes les certifications</option>
          {courses.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
        </select>
        <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><input type="checkbox" checked={showSpecimens} onChange={(e) => setShowSpecimens(e.target.checked)} />Afficher les spécimens</label>
        <button onClick={onReload} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold"><RefreshCw className="w-4 h-4" />Actualiser</button>
        <button onClick={exportCsv} disabled={!filtered.length} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-blue text-white text-sm font-bold disabled:opacity-40"><Download className="w-4 h-4" />Registre (CSV)</button>
      </div>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
      {!filtered.length ? (
        <p className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500">
          {certificates.length ? 'Aucun certificat ne correspond à la recherche.' : 'Aucun certificat délivré pour le moment.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="p-3">Numéro</th><th className="p-3">Titulaire</th><th className="p-3">Certification</th><th className="p-3">Résultat</th><th className="p-3">Délivré le</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.number} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-3 font-mono font-bold whitespace-nowrap">{c.number}{c.simulation && <span className="ml-2 rounded bg-violet-100 text-violet-800 px-1.5 py-0.5 text-[10px] font-sans font-extrabold uppercase">spécimen</span>}</td>
                  <td className="p-3"><span className="font-bold">{`${c.lastName} ${c.firstName}`.toLocaleUpperCase('fr-FR')}</span>{c.email && <div className="text-xs text-slate-500 break-all">{c.email}</div>}</td>
                  <td className="p-3 text-xs max-w-[260px]">{c.courseTitle}</td>
                  <td className="p-3 font-bold">{c.average} %</td>
                  <td className="p-3 whitespace-nowrap">{fmt(c.issuedAt)}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => download(c)} disabled={busy === c.number} title="Télécharger le certificat en PDF" className="inline-flex items-center gap-1 rounded-lg bg-brand-blue px-2.5 py-1.5 text-xs font-bold text-white disabled:opacity-60">
                        {busy === c.number ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} PDF
                      </button>
                      <a href={`/e-learning#verifier/${c.number}`} target="_blank" rel="noreferrer" title="Ouvrir la page de vérification publique" className="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                        <ExternalLink className="w-3.5 h-3.5" /> Vérifier
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
