import { fcfa } from './proforma';

/**
 * Files downloaded from the admin: every ADI conversation (one section per person, so two
 * simultaneous conversations never mix) and every invoice (by domain, then thematic).
 * Messages come from visitors: everything is escaped before going into the HTML.
 */

export interface ReportMessage {
  role: 'user' | 'assistant';
  text: string;
  at: Date | null;
  attachmentName?: string;
}

export interface ReportConversation {
  label: string;
  whatsapp?: string;
  email?: string;
  startedAt: Date | null;
  lastMessageAt: Date | null;
  messages: ReportMessage[];
}

export interface ReportInvoice {
  number: string;
  date: Date | null;
  status: string;
  formation: string;
  modality?: string;
  session?: string;
  participants: number;
  total: number | null;
  client?: { name?: string; company?: string; phone?: string; email?: string; isCompany?: boolean };
}

const esc = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
));

/** Escaped text, keeping the **bold** of ADI's answers */
const messageHtml = (text: string) => esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

const day = (d: Date | null) => d ? d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
const time = (d: Date | null) => d ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

export const reportDate = () => new Date().toISOString().slice(0, 10);

const page = (title: string, summary: string, style: string, body: string) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>
  body { margin: 0; background: #f1f5f9; color: #0f172a; font: 15px/1.5 Arial, Helvetica, sans-serif; }
  main { max-width: 1000px; margin: 0 auto; padding: 24px 16px 48px; }
  h1 { margin: 0; font-size: 24px; }
  .summary { margin: 4px 0 16px; color: #475569; }
  .print { padding: 10px 16px; border: 0; border-radius: 8px; background: #8A1A24; color: #fff; font-weight: bold; cursor: pointer; }
  .card { margin-top: 20px; padding: 18px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; }
  ${style}
  @media print { body { background: #fff; } .print { display: none; } .card { break-inside: auto; border-color: #94a3b8; } }
</style>
</head>
<body>
<main>
<h1>${esc(title)}</h1>
<p class="summary">${esc(summary)}</p>
<button class="print" onclick="window.print()">Imprimer / enregistrer en PDF</button>
${body}
</main>
</body>
</html>
`;

export function buildConversationsHtml(conversations: ReportConversation[]): string {
  const total = conversations.reduce((sum, c) => sum + c.messages.length, 0);

  const toc = conversations.map((c, i) =>
    `<li><a href="#p${i + 1}">${esc(c.label)}</a> : ${c.messages.length} message(s)${c.whatsapp ? `, WhatsApp ${esc(c.whatsapp)}` : ''}</li>`
  ).join('');

  const sections = conversations.map((c, i) => {
    let currentDay = '';
    const rows = c.messages.map(m => {
      const d = day(m.at);
      const separator = d !== currentDay ? `<p class="day">${esc(d)}</p>` : '';
      currentDay = d;
      const who = m.role === 'user' ? c.label : 'ADI';
      const attachment = m.attachmentName ? `<div class="file">Pièce jointe : ${esc(m.attachmentName)}</div>` : '';
      return `${separator}<div class="msg ${m.role}"><div class="who">${esc(who)} <span>${esc(time(m.at))}</span></div>${attachment}<div class="text">${messageHtml(m.text)}</div></div>`;
    }).join('');
    const details = [
      c.whatsapp && `WhatsApp : ${esc(c.whatsapp)}`,
      c.email && `E-mail : ${esc(c.email)}`,
      `Du ${esc(day(c.startedAt))} au ${esc(day(c.lastMessageAt))}`,
      `${c.messages.length} message(s)`
    ].filter(Boolean).join(' · ');
    return `<section class="card" id="p${i + 1}"><h2>${i + 1}. ADI et ${esc(c.label)}</h2><p class="meta">${details}</p>${rows}</section>`;
  }).join('\n');

  return page(
    'Discussions avec ADI',
    `${conversations.length} interlocuteur(s), ${total} message(s). Fichier généré le ${day(new Date())} à ${time(new Date())}.`,
    `h2 { margin: 0; font-size: 18px; color: #8A1A24; }
  .meta { margin: 4px 0 12px; padding-bottom: 12px; border-bottom: 2px solid #8A1A24; color: #475569; font-size: 13px; }
  .toc { margin: 8px 0 0; padding-left: 22px; }
  .day { margin: 14px 0 8px; text-align: center; color: #64748b; font-size: 12px; font-weight: bold; }
  .msg { margin: 8px 0; padding: 10px 12px; border-radius: 10px; }
  .msg.assistant { margin-right: 12%; background: #eff6ff; }
  .msg.user { margin-left: 12%; background: #f0fdf4; }
  .who { font-size: 12px; font-weight: bold; }
  .who span { font-weight: normal; color: #64748b; }
  .file { font-size: 12px; color: #475569; font-style: italic; }
  .text { white-space: pre-wrap; overflow-wrap: anywhere; }
  @media print { .msg { break-inside: avoid; } }`,
    `<div class="card"><strong>Interlocuteurs</strong><ol class="toc">${toc}</ol></div>\n${sections}`
  );
}

const normTitle = (t: string) => (t || '')
  .replace(/Nouvelle\s+Formation\s+d['’]Excellence\s*[:\-–—]?\s*/gi, '')
  .trim()
  .toLowerCase();

export function buildInvoicesHtml(
  invoices: ReportInvoice[],
  formations: { title: string; domain?: string; thematic?: string }[]
): string {
  const byTitle = new Map(formations.map(f => [normTitle(f.title), f]));

  // Domain -> thematic -> invoices, alphabetical, the unclassified ones last
  const tree = new Map<string, Map<string, ReportInvoice[]>>();
  for (const inv of invoices) {
    const f = byTitle.get(normTitle(inv.formation));
    const domain = f?.domain?.trim() || 'Domaine non renseigné';
    const thematic = f?.thematic?.trim() || 'Thématique non renseignée';
    if (!tree.has(domain)) tree.set(domain, new Map());
    const themes = tree.get(domain)!;
    if (!themes.has(thematic)) themes.set(thematic, []);
    themes.get(thematic)!.push(inv);
  }
  const sorted = <T,>(m: Map<string, T>, last: string) => [...m.entries()].sort(([a], [b]) =>
    a === last ? 1 : b === last ? -1 : a.localeCompare(b, 'fr'));

  const sumOf = (list: ReportInvoice[]) => list.filter(i => i.status !== 'Annulée').reduce((sum, i) => sum + (i.total || 0), 0);
  const money = (n: number | null) => n === null || n === undefined ? 'À confirmer' : fcfa(n);

  const row = (inv: ReportInvoice) => {
    const c = inv.client || {};
    const who = c.isCompany && c.company ? `${c.company} (${c.name || ''})` : c.name;
    return `<tr class="${inv.status === 'Annulée' ? 'off' : ''}">
<td class="num">${esc(inv.number)}</td><td>${esc(day(inv.date))}</td>
<td>${esc(who)}<br><small>${esc(c.phone)} · ${esc(c.email)}</small></td>
<td>${esc(inv.formation)}<br><small>${esc(inv.modality)} · ${esc(inv.session)}</small></td>
<td class="c">${esc(inv.participants)}</td><td class="r">${esc(money(inv.total))}</td><td>${esc(inv.status)}</td></tr>`;
  };

  const body = sorted(tree, 'Domaine non renseigné').map(([domain, themes]) => {
    const all = [...themes.values()].flat();
    const groups = sorted(themes, 'Thématique non renseignée').map(([thematic, list]) => `<h3>${esc(thematic)} <span>${list.length} facture(s) · ${esc(fcfa(sumOf(list)))}</span></h3>
<div class="scroll"><table><thead><tr><th>N°</th><th>Date</th><th>Client</th><th>Formation</th><th>Part.</th><th>Total</th><th>Statut</th></tr></thead><tbody>${list.map(row).join('')}</tbody></table></div>`).join('\n');
    return `<section class="card"><h2>${esc(domain)} <span>${all.length} facture(s) · ${esc(fcfa(sumOf(all)))}</span></h2>${groups}</section>`;
  }).join('\n');

  return page(
    'Factures établies par ADI',
    `${invoices.length} facture(s), classées par domaine et par thématique. Montant total hors factures annulées : ${fcfa(sumOf(invoices))}. Fichier généré le ${day(new Date())} à ${time(new Date())}.`,
    `h2 { margin: 0; font-size: 19px; color: #8A1A24; }
  h3 { margin: 18px 0 6px; font-size: 15px; }
  h2 span, h3 span { font-size: 12px; font-weight: normal; color: #475569; }
  .scroll { overflow-x: auto; }
  table { width: 100%; min-width: 720px; border-collapse: collapse; font-size: 13px; }
  th { background: #f8fafc; text-align: left; }
  th, td { padding: 7px 8px; border: 1px solid #e2e8f0; vertical-align: top; }
  small { color: #64748b; }
  .num { font-family: monospace; font-weight: bold; white-space: nowrap; }
  .c { text-align: center; }
  .r { text-align: right; white-space: nowrap; font-weight: bold; }
  .off { opacity: .55; text-decoration: line-through; }`,
    body
  );
}

export function downloadHtml(html: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
