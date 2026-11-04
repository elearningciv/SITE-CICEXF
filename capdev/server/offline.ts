import type { Content } from '../src/types.ts';

export const fmtDate = (d: string) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'date à venir');
export const axeTitle = (c: Content, id: string) => c.axes.find(a => a.id === id)?.title || '';

// ---------- Offline answers (no API key, or the AI service failed) ----------

const STOP = new Set('le la les un une des de du d l et ou en au aux a à pour sur dans par avec est sont je vous nous il elle on que qui quoi quel quelle quels quelles comment ce cette ces mon ma mes votre vos ne pas plus y the of and to in for is are what how do does i you me'.split(' '));
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const tokens = (s: string) => norm(s).split(/[^a-z0-9]+/).filter(w => w.length > 2 && !STOP.has(w));

interface Doc { kind: string; title: string; text: string; page: string }

function docs(c: Content): Doc[] {
  return [
    ...c.axes.map(a => ({ kind: 'Axe de recherche', title: `${a.code} · ${a.title}`, text: `${a.summary} ${a.description}`, page: '/' })),
    ...c.projects.map(p => ({ kind: 'Projet', title: p.title, text: `${p.summary} ${p.status} ${axeTitle(c, p.axe)}`, page: '/' })),
    ...c.publications.map(p => ({ kind: p.type, title: p.title, text: `${p.description} ${p.summary} ${p.authors} ${p.reference} ${p.zone} publication ${p.publicationYear}`, page: '/publications' })),
    ...c.formations.map(f => ({ kind: 'Formation', title: f.title, text: `${f.summary} formation seminaire ${f.duration} ${f.mode} ${f.status} ${f.date ? fmtDate(f.date) : ''}`, page: '/accompagnement' })),
    ...c.services.map(x => ({ kind: 'Expertise', title: x.title, text: `${x.summary} etude evaluation expertise`, page: '/expertise' })),
    ...c.opportunities.map(o => ({ kind: o.kind, title: o.title, text: `${o.summary} opportunite ${o.kind} date limite ${fmtDate(o.deadline)}`, page: '/actualites' })),
    ...c.news.map(n => ({ kind: 'Actualité', title: n.title, text: `${n.summary} actualite ${n.category}`, page: '/actualites' })),
    ...c.events.map(e => ({ kind: e.kind, title: e.title, text: `${e.place} agenda evenement ${fmtDate(e.date)}`, page: '/actualites' })),
    ...(c.gallery || []).map(g => ({ kind: g.category, title: g.title, text: `${g.summary} ${g.body} ${g.place} galerie activite realisee`, page: '/galerie' })),
    ...c.researchers.map(r => ({ kind: 'Docteur', title: `${r.name} (${r.grade})`, text: `${r.specialty} ${r.grade} docteur chercheur expert equipe`, page: '/expertise' }))
  ];
}

export function offlineAnswer(c: Content, message: string, lang: string): string {
  const en = lang !== 'fr';
  const tr = (s: string) => (en ? c.translations[lang]?.[s] || s : s);
  const q = norm(message);
  const s = c.settings;
  if (/^(bonjour|bonsoir|salut|hello|hi|hey)\b/.test(q) && q.length < 25) {
    return en ? `Hello! I am ${s.assistantName}, ${s.siteName}'s virtual assistant. Ask me about our research, publications, training or opportunities.` : s.assistantGreeting;
  }
  if (/(contact|adresse|telephone|joindre|horaire|email|mail|address|phone)/.test(q)) {
    return `${en ? 'You can reach us here' : 'Vous pouvez nous joindre ici'} :\n• ${tr(s.address)}\n• ${tr(s.phone)}\n• ${s.email}\n• ${tr(s.hours)}\n(${en ? 'page' : 'page'} /contact)`;
  }
  if (/(qui etes|presente|mission|c est quoi|what is|who are)/.test(q)) {
    return `${tr(s.mission)}\n\n(page /institut)`;
  }
  if (/(partenariat|partnership|collabor|etude|evaluation|consult)/.test(q) && !/(formation|seminaire)/.test(q)) {
    return en
      ? 'Gladly. Describe your need in two or three sentences and leave an e-mail address or WhatsApp number: I will pass your request on to the team. (page /expertise)'
      : "Avec plaisir. Décrivez votre besoin en deux ou trois phrases et laissez une adresse e-mail ou un numéro WhatsApp : je transmets votre demande à l'équipe. (page /expertise)";
  }
  // Topic questions get a structured list rather than a keyword search
  const bullets = (items: string[]) => items.map(i => `• ${i}`).join('\n');
  const searchIn = (kind: string) => /(sur|about|concernant|on)\s+\S+/.test(q) && kind === 'pub';
  if (/(formation|seminaire|atelier|cours|training|course|inscri|accompagn)/.test(q)) {
    const list = [...c.formations].sort((a, b) => (a.date || '9').localeCompare(b.date || '9'));
    return `${en ? 'Our training courses' : 'Nos formations'} :\n${bullets(list.map(f => `**${tr(f.title)}** — ${tr(f.duration)}, ${tr(f.mode)}, ${f.date ? fmtDate(f.date) : tr('Sur demande')} (${tr(f.status)})`))}\n\n${en ? 'You can register online' : 'Inscription en ligne'} : page /accompagnement`;
  }
  if (/(bourse|stage|appel|recrut|opportun|candidat|scholarship|internship|grant|job)/.test(q)) {
    const list = [...c.opportunities].sort((a, b) => a.deadline.localeCompare(b.deadline));
    return `${en ? 'Current opportunities' : 'Opportunités en cours'} :\n${bullets(list.map(o => `**${tr(o.title)}** (${tr(o.kind)}) — ${en ? 'deadline' : 'date limite'} ${fmtDate(o.deadline)}`))}\n\n(page /actualites)`;
  }
  if (/(agenda|evenement|colloque|conference|event)/.test(q)) {
    const list = [...c.events].sort((a, b) => a.date.localeCompare(b.date));
    return `${en ? 'Upcoming events' : 'Agenda'} :\n${bullets(list.map(e => `**${fmtDate(e.date)}** · ${tr(e.title)}`))}\n\n(page /actualites)`;
  }
  if (/(axe|theme|programme|domaine)/.test(q) && !/(publication|article)/.test(q)) {
    return `${en ? 'Our research areas' : 'Nos axes de recherche'} :\n${bullets(c.axes.map(a => `**${tr(a.title)}** — ${tr(a.summary)}`))}\n\n(page d'accueil)`;
  }
  if (/(publication|article|rapport|policy|brief|document de travail|working paper|report)/.test(q) && !searchIn('pub')) {
    const list = [...c.publications].sort((a, b) => b.publicationYear.localeCompare(a.publicationYear)).slice(0, 5);
    return `${en ? 'Latest publications' : 'Dernières publications'} :\n${bullets(list.map(p => `**${tr(p.title)}** (${tr(p.type)}, ${p.publicationYear})`))}\n\n(page /publications)`;
  }
  if (/(chercheur|equipe|researcher|team|docteur|expert|specialis)/.test(q)) {
    return `${en ? 'Our doctors' : 'Nos docteurs'} :\n${bullets(c.researchers.slice(0, 8).map(r => `**${tr(r.name)}** — ${tr(r.grade)}, ${tr(r.specialty)}`))}\n\n(page /expertise)`;
  }

  const qt = tokens(message);
  const scored = docs(c)
    .map(d => {
      const hay = tokens(`${d.title} ${d.text} ${d.kind}`);
      let score = 0;
      for (const w of qt) if (hay.some(h => h === w || (w.length > 4 && (h.startsWith(w.slice(0, 5)) || w.startsWith(h.slice(0, 5)))))) score++;
      return { d, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  if (!scored.length) {
    return en
      ? "I don't have that information yet. You can write to the team from the Contact page, or leave me your e-mail and I will pass your question on."
      : "Je n'ai pas encore cette information. Vous pouvez écrire à l'équipe depuis la page Contact, ou me laisser votre e-mail : je transmets votre question.";
  }
  const head = en ? 'Here is what I found:' : "Voici ce que j'ai trouvé :";
  const body = scored.map(({ d }) => `• **${tr(d.title)}** (${tr(d.kind)}) — page ${d.page}`).join('\n');
  return `${head}\n${body}`;
}

