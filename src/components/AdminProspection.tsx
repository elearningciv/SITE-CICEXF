import { useMemo, useState } from 'react';
import { Check, Copy, ExternalLink, Facebook, Instagram, Linkedin, Loader2, Megaphone, Search, Sparkles, Users } from 'lucide-react';
import { Formation } from '../types';
import { askAdiline } from '../lib/adilineApi';
import { SITE_URL } from '../seo';

/**
 * Admin tab "Prospection": tools for the team to promote the trainings on social networks
 * without breaking their rules (no scraping, no automated messages):
 *  1. ready-to-post texts per network, with a tracked link (the source shows in each request);
 *  2. a LinkedIn targeting kit (profiles to look for, search links, message templates) used by hand;
 *  3. the setup guide for ADILINE on the Facebook page and Instagram account (official Meta webhook).
 */

type Network = 'linkedin' | 'facebook' | 'instagram' | 'tiktok';

const NETWORKS: { id: Network; label: string }[] = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' }
];

const WHATSAPP = '+225 07 01 97 00 65';
const WEBHOOK_URL = 'https://europe-west1-project-a93f5a0f-743d-4552-852.cloudfunctions.net/metaWebhook';

const isPlaceholder = (text?: string) => !text || /(.)\1{7,}/i.test(text.replace(/\s/g, ''));
const slugify = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, 60);
const hashtag = (t: string) => '#' + t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2).slice(0, 3).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');

export const trackedLink = (network: Network, campaign: string) =>
  `${SITE_URL}/formations?utm_source=${network}&utm_medium=social&utm_campaign=${campaign}`;

// Profiles to look for, by keywords of the formation's domain (used when the formation has no "Public cible")
const PERSONAS_BY_DOMAIN: [RegExp, string[]][] = [
  [/suivi|[ée]valuation|projet|programme/i, ['Responsable suivi-évaluation', 'Chef de projet ONG', 'Coordonnateur de programme', 'Chargé de projets']],
  [/financ|comptab|investissement/i, ['Comptable', 'Directeur administratif et financier', 'Contrôleur de gestion', 'Analyste financier']],
  [/qhse|s[ée]curit[ée]|qualit[ée]|environnement/i, ['Responsable QHSE', 'Responsable qualité', 'Chargé HSE', 'Responsable environnement']],
  [/informatique|data|donn[ée]es|num[ée]rique/i, ['Data analyst', 'Responsable informatique', 'Chargé de données', 'Responsable système d\'information']],
  [/territor|sig|urban|cadastr/i, ['Urbaniste', 'Géomaticien', 'Agent de collectivité territoriale', 'Chargé de planification']],
  [/management|ressources humaines|[ée]quipe|rh/i, ['Responsable ressources humaines', 'Manager d\'équipe', 'Directeur des ressources humaines', 'Chef de service']],
  [/formation|capacit/i, ['Responsable formation', 'Ingénieur pédagogique', 'Directeur des ressources humaines', 'Formateur']]
];
const DEFAULT_PERSONAS = ['Responsable formation', 'Directeur des ressources humaines', 'Chef de projet', 'Responsable suivi-évaluation'];

function personasFor(f?: Formation): string[] {
  if (!f) return DEFAULT_PERSONAS;
  const fromAdmin = (f.targetPublic || []).filter(t => !isPlaceholder(t) && t.length < 60);
  if (fromAdmin.length >= 2) return fromAdmin.slice(0, 6);
  const text = `${f.title} ${f.domain} ${f.specialty || ''}`;
  return (PERSONAS_BY_DOMAIN.find(([re]) => re.test(text))?.[1]) || DEFAULT_PERSONAS;
}

function templatePost(network: Network, f: Formation | undefined, link: string): string {
  const title = f?.title || 'nos formations certifiantes';
  const desc = f && !isPlaceholder(f.shortDescription) ? f.shortDescription : 'Des formations pratiques animées par des experts, pour des compétences directement utiles à votre poste.';
  const facts = f ? [f.duration && `Durée : ${f.duration}`, f.modality && `Format : ${f.modality}`, f.price && `Tarif : ${f.price}, payable en 2 ou 3 tranches`].filter(Boolean) : [];
  const tags = ['#CICEXF', '#Formation', '#Abidjan', f?.domain ? hashtag(f.domain) : '#CoteDIvoire'].join(' ');
  switch (network) {
    case 'linkedin':
      return `Nouvelle session : ${title}\n\n${desc}\n\n${facts.map(x => `- ${x}`).join('\n')}${facts.length ? '\n' : ''}- Certificat de formation délivré par le CICEXF\n\nProgramme détaillé et inscription : ${link}\n\n${tags}`;
    case 'facebook':
      return `Inscriptions ouvertes : ${title}\n\n${desc}\n\n${facts.join('\n')}${facts.length ? '\n' : ''}\nInscrivez-vous ici : ${link}\nUne question ? Écrivez-nous en message privé ou sur WhatsApp au ${WHATSAPP}.\n\n${tags}`;
    case 'instagram':
      return `${title}\n\n${desc}\n\n${facts.join('\n')}${facts.length ? '\n' : ''}\nInscription : lien en bio, ou écrivez-nous en message privé.\n\n${tags} #Competences #Carriere`;
    case 'tiktok':
      return `Idée de vidéo (30 s)\n1. Accroche (3 s) : « Vous voulez progresser en ${f?.domain || 'gestion de projet'} ? »\n2. Trois points clés de la formation ${title}, un par plan.\n3. Appel à l'action : « Lien en bio pour vous inscrire, paiement en 2 ou 3 tranches. »\n\nLégende : ${title} : inscriptions ouvertes au CICEXF à Abidjan. ${tags}`;
  }
}

function invitationNote(persona: string, f?: Formation) {
  return `Bonjour [Prénom], je suis [votre nom] du cabinet CICEXF à Abidjan. Votre parcours de ${persona.toLowerCase()} m'intéresse : nous accompagnons les professionnels de votre domaine${f ? ` (formation « ${f.title} »)` : ''}. Ravi d'échanger avec vous.`;
}

function followUpMessage(f?: Formation) {
  return `Bonjour [Prénom], merci d'avoir accepté l'invitation. Nous ouvrons ${f ? `une session de la formation « ${f.title} »${f.modality ? ` (${f.modality.toLowerCase()})` : ''}` : 'de nouvelles sessions de formation'}, pensée pour des professionnels comme vous. Si le sujet vous intéresse, je peux vous envoyer le programme ; sinon, aucun souci. Bonne journée !`;
}

function CopyButton({ text, label = 'Copier' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); } catch { /* clipboard blocked */ } }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
    >
      {done ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {done ? 'Copié' : label}
    </button>
  );
}

export default function AdminProspection({ formations }: { formations: Formation[] }) {
  const usable = useMemo(() => formations.filter(f => f.title && !isPlaceholder(f.title)), [formations]);
  const [section, setSection] = useState<'posts' | 'linkedin' | 'meta'>('posts');
  const [formationId, setFormationId] = useState<string>('');
  const [network, setNetwork] = useState<Network>('linkedin');
  const [aiText, setAiText] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const formation = usable.find(f => f.id === formationId);
  const campaign = formation ? slugify(formation.slug || formation.title) : 'cabinet';
  const link = trackedLink(network, campaign);
  const key = `${formationId}|${network}`;
  const draft = aiText[key] ?? templatePost(network, formation, link);
  const personas = personasFor(formation);

  const writeWithAdiline = async () => {
    setBusy(true); setError('');
    const info = formation
      ? `Formation : ${formation.title}. Domaine : ${formation.domain}. Durée : ${formation.duration}. Format : ${formation.modality}. Tarif : ${formation.price} (paiement en 2 ou 3 tranches).${isPlaceholder(formation.shortDescription) ? '' : ` Description : ${formation.shortDescription}`}`
      : 'Sujet : présenter le CICEXF et ses formations certifiantes à Abidjan.';
    const style: Record<Network, string> = {
      linkedin: 'ton professionnel, 900 caractères au plus, 3 à 5 hashtags à la fin',
      facebook: 'ton chaleureux, 700 caractères au plus, rappel du WhatsApp ' + WHATSAPP + ', 3 hashtags',
      instagram: 'ton dynamique, phrases courtes, « lien en bio » au lieu du lien, 6 à 8 hashtags',
      tiktok: "un script de vidéo de 30 secondes (accroche, 3 points, appel à l'action « lien en bio ») puis une légende courte avec hashtags"
    };
    try {
      const text = await askAdiline(
        `Tâche interne de l'équipe CICEXF (pas une question de visiteur) : rédige une publication ${NETWORKS.find(n => n.id === network)!.label} pour promouvoir le CICEXF. ${info} Style : ${style[network]}.` +
        (network === 'linkedin' || network === 'facebook' ? ` Termine par ce lien exact : ${link}` : '') +
        ' Réponds uniquement avec le texte prêt à publier, sans introduction ni commentaire, sans Markdown.'
      );
      setAiText(prev => ({ ...prev, [key]: text.replace(/\*\*/g, '') }));
    } catch {
      setError("ADILINE n'a pas pu rédiger pour le moment : le modèle ci-dessous reste utilisable.");
    } finally {
      setBusy(false);
    }
  };

  const shareUrl: Record<Network, string> = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/upload'
  };

  const tab = (id: typeof section, label: string, Icon: typeof Megaphone) => (
    <button
      onClick={() => setSection(id)}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer ${section === id ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'}`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  const selectCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white';

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Outils pour faire connaître vos formations sur les réseaux, dans le respect de leurs règles et de la protection des données :
        pas de collecte automatique de profils ni de messages envoyés par un robot.
      </p>

      <div className="flex flex-wrap gap-2">
        {tab('posts', 'Publications', Megaphone)}
        {tab('linkedin', 'Ciblage LinkedIn', Linkedin)}
        {tab('meta', 'ADILINE sur Facebook & Instagram', Facebook)}
      </div>

      {section !== 'meta' && (
        <label className="block max-w-xl space-y-1 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Formation à promouvoir</span>
          <select value={formationId} onChange={(e) => setFormationId(e.target.value)} className={selectCls}>
            <option value="">Le cabinet et l'ensemble des formations</option>
            {usable.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
          </select>
        </label>
      )}

      {/* 1. Ready-to-post texts */}
      {section === 'posts' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {NETWORKS.map(n => (
              <button
                key={n.id}
                onClick={() => setNetwork(n.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold cursor-pointer ${network === n.id ? 'bg-brand-emerald text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
              >
                {n.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800">
            <textarea
              value={draft}
              onChange={(e) => setAiText(prev => ({ ...prev, [key]: e.target.value }))}
              rows={12}
              className="w-full resize-y rounded-t-2xl bg-white p-4 text-sm leading-relaxed text-slate-900 outline-none dark:bg-slate-950 dark:text-white"
            />
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
              <button
                onClick={writeWithAdiline}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60 cursor-pointer"
              >
                {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {aiText[key] ? 'Proposer une autre version' : 'Rédiger avec ADILINE'}
              </button>
              <CopyButton text={draft} label="Copier le texte" />
              <a href={shareUrl[network]} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                <ExternalLink className="w-3.5 h-3.5" /> Ouvrir {NETWORKS.find(n => n.id === network)!.label}
              </a>
              {aiText[key] && (
                <button onClick={() => setAiText(prev => { const next = { ...prev }; delete next[key]; return next; })} className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">
                  Revenir au modèle
                </button>
              )}
            </div>
          </div>
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

          <div className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900">
            <p className="font-bold text-slate-900 dark:text-white">Lien suivi pour {NETWORKS.find(n => n.id === network)!.label}</p>
            <p className="mt-1 break-all font-mono text-xs text-slate-700 dark:text-slate-300">{link}</p>
            <div className="mt-2"><CopyButton text={link} label="Copier le lien" /></div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Chaque demande envoyée par un visiteur arrivé par ce lien porte la mention « Source : {NETWORKS.find(n => n.id === network)!.label} » dans
              Devis &amp; Inscriptions. Sur Instagram et TikTok, placez ce lien dans la bio du compte.
            </p>
          </div>
        </div>
      )}

      {/* 2. LinkedIn targeting kit (used by hand) */}
      {section === 'linkedin' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
              <Users className="w-4 h-4" /> Profils à rechercher
            </p>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {personas.map(p => (
                <li key={p} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                  <span className="text-sm text-slate-800 dark:text-slate-200">{p}</span>
                  <span className="flex gap-2">
                    <a href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${p} Abidjan`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-[#0A66C2] px-3 py-1.5 text-xs font-bold text-white">
                      <Search className="w-3.5 h-3.5" /> Côte d'Ivoire
                    </a>
                    <a href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${p} Afrique de l'Ouest`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[#0A66C2] px-3 py-1.5 text-xs font-bold text-[#0A66C2]">
                      <Search className="w-3.5 h-3.5" /> Afrique de l'Ouest
                    </a>
                  </span>
                </li>
              ))}
            </ul>
            <p className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
              Les recherches s'ouvrent dans votre propre compte LinkedIn. Pour cibler des organisations : recherchez aussi « ONG Abidjan », « cabinet de conseil Abidjan » ou le nom d'un projet.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Note d'invitation</p>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">{invitationNote(personas[0], formation)}</p>
              <p className="mt-2 text-xs text-slate-500">{invitationNote(personas[0], formation).length} / 300 caractères (limite de LinkedIn)</p>
              <div className="mt-3"><CopyButton text={invitationNote(personas[0], formation)} /></div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Message après acceptation</p>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">{followUpMessage(formation)}</p>
              <div className="mt-3"><CopyButton text={followUpMessage(formation)} /></div>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 p-4 text-sm text-slate-800 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-slate-200 dark:ring-amber-900">
            <p className="font-bold">Bonnes pratiques pour garder un compte en bonne santé</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Une vingtaine d'invitations par jour au plus, toujours envoyées à la main et personnalisées ([Prénom], poste).</li>
              <li>N'envoyez le programme qu'aux personnes qui ont répondu ; respectez un refus ou une absence de réponse.</li>
              <li>Publiez régulièrement (onglet Publications) : un profil actif reçoit davantage d'acceptations.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 3. ADILINE on the Facebook page and Instagram account */}
      {section === 'meta' && (
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            Une fois activé, ADILINE répond automatiquement aux personnes qui écrivent à votre page Facebook ou à votre compte Instagram
            professionnel, et chaque nouvelle conversation ainsi que chaque formulaire de publicité Facebook/Instagram arrive dans
            <strong> Devis &amp; Inscriptions</strong> (canal « Facebook » ou « Instagram »).
          </p>

          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <strong>Préparer les comptes</strong> : page Facebook du cabinet, compte Instagram professionnel relié à cette page, et un compte
              <a className="font-semibold text-brand-blue underline dark:text-sky-300" href="https://business.facebook.com/" target="_blank" rel="noreferrer"> Meta Business</a> dont vous êtes administrateur.
            </li>
            <li>
              <strong>Créer une application</strong> sur <a className="font-semibold text-brand-blue underline dark:text-sky-300" href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer">developers.facebook.com</a> (type « Business »),
              y ajouter les produits <em>Messenger</em>, <em>Instagram</em> et <em>Webhooks</em>, puis générer le jeton d'accès de la page.
            </li>
            <li>
              <strong>Enregistrer les 3 codes dans Firebase</strong> depuis votre terminal (la commande vous demande chaque valeur ; ne la collez nulle part ailleurs) :
              <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-slate-100">{`firebase.cmd functions:secrets:set META_VERIFY_TOKEN --project project-a93f5a0f-743d-4552-852
firebase.cmd functions:secrets:set META_APP_SECRET --project project-a93f5a0f-743d-4552-852
firebase.cmd functions:secrets:set META_PAGE_TOKEN --project project-a93f5a0f-743d-4552-852
firebase.cmd deploy --only functions:cicexf:metaWebhook --project project-a93f5a0f-743d-4552-852`}</pre>
              <span className="text-xs">META_VERIFY_TOKEN : une phrase de votre choix · META_APP_SECRET : « Clé secrète » de l'application · META_PAGE_TOKEN : jeton de la page.</span>
            </li>
            <li>
              <strong>Relier Meta à ADILINE</strong> : dans l'application, rubrique Webhooks, indiquez l'adresse ci-dessous et la même phrase que META_VERIFY_TOKEN,
              puis abonnez la page aux champs <em>messages</em> et <em>leadgen</em> (et le compte Instagram au champ <em>messages</em>).
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <code className="break-all rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">{WEBHOOK_URL}</code>
                <CopyButton text={WEBHOOK_URL} label="Copier l'adresse" />
              </div>
            </li>
            <li>
              <strong>Faire valider l'application par Meta</strong> (« App Review » pour les autorisations de messagerie et de formulaires), puis la passer en mode « Live ».
            </li>
          </ol>

          <p className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900">
            <Instagram className="w-4 h-4 shrink-0" />
            LinkedIn et TikTok ne permettent pas à un petit cabinet de brancher un assistant sur leur messagerie : utilisez pour eux les onglets Publications et Ciblage LinkedIn.
          </p>
        </div>
      )}
    </div>
  );
}
