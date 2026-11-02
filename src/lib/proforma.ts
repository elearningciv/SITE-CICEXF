// Proforma invoice (PDF) produced at the end of a registration with ADILINE.
// jsPDF is heavy, so it is downloaded only when a proforma is generated.

export interface ProformaData {
  number: string;
  date: Date;
  formation: string;
  modality: string;
  session: string;
  duration?: string;
  participants: number;
  unitPrice: number | null; // FCFA, null when the formation has no published price
  client: { name: string; company?: string; phone: string; email: string; isCompany: boolean };
  /** Cancelled invoices are printed with a visible ANNULÉE mark */
  cancelled?: boolean;
}

/** Same rules as ADILINE's quote tool: -10 % from 3 participants, -15 % from 5 */
export function discountRate(participants: number) {
  return participants >= 5 ? 0.15 : participants >= 3 ? 0.1 : 0;
}

export function computeTotals(p: Pick<ProformaData, 'participants' | 'unitPrice'>) {
  if (p.unitPrice === null) return null;
  const subtotal = p.unitPrice * p.participants;
  const rate = discountRate(p.participants);
  const discount = Math.round(subtotal * rate);
  return { subtotal, rate, discount, total: subtotal - discount };
}

/** "450 000 FCFA" -> 450000 ; anything without a number -> null */
export function parsePrice(price?: string): number | null {
  const digits = (price || '').replace(/[^\d]/g, '');
  const value = digits ? parseInt(digits, 10) : NaN;
  return Number.isFinite(value) && value > 0 ? value : null;
}

/** 1250000 -> "1 250 000 FCFA" (plain spaces: the PDF fonts have no narrow no-break space) */
export const fcfa = (n: number) => `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA`;


const CABINET = {
  name: "Cabinet International de Consultance, d'Expertise et de Formation",
  address: 'Cocody Palmeraie, Rue de la Clinique, Immeuble Prestige, 3e étage - Abidjan, Côte d\'Ivoire',
  contact: 'Tél. / WhatsApp : +225 07 01 97 00 65 · +225 05 74 22 22 46 · cabinetcicexf@gmail.com',
  site: 'www.cicexf.com'
};

export async function buildProformaPdf(p: ProformaData): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  const M = 18;
  const blue: [number, number, number] = [0, 59, 111];
  const terracotta: [number, number, number] = [138, 46, 28];
  const slate: [number, number, number] = [71, 85, 105];
  const dateFr = p.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const valid = new Date(p.date.getTime() + 30 * 24 * 3600 * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Header band
  doc.setFillColor(...blue);
  doc.rect(0, 0, W, 34, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('CICEXF', M, 16);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(CABINET.name, M, 23);
  doc.text(CABINET.site, M, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('FACTURE PROFORMA', W - M, 16, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${p.number}`, W - M, 23, { align: 'right' });
  doc.text(`Date : ${dateFr} · Valable jusqu'au ${valid}`, W - M, 28, { align: 'right' });

  // Issuer / client blocks
  let y = 46;
  doc.setTextColor(...terracotta);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ÉMETTEUR', M, y);
  doc.text('CLIENT', 112, y);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const issuer = doc.splitTextToSize(`${CABINET.name}\n${CABINET.address}\n${CABINET.contact}`, 84);
  doc.text(issuer, M, y + 6);
  const clientLines = [
    p.client.isCompany && p.client.company ? p.client.company : '',
    p.client.isCompany ? `À l'attention de : ${p.client.name}` : p.client.name,
    `Tél. : ${p.client.phone}`,
    `E-mail : ${p.client.email}`
  ].filter(Boolean).join('\n');
  doc.text(doc.splitTextToSize(clientLines, 80), 112, y + 6);

  // Items table
  y = 92;
  const cols = [M, 108, 132, 160]; // description, qty, unit price, amount
  doc.setFillColor(241, 245, 249);
  doc.rect(M, y, W - 2 * M, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...blue);
  doc.text('Désignation', cols[0] + 2, y + 6);
  doc.text('Participants', cols[1] + 2, y + 6);
  doc.text('Prix unitaire', cols[2] + 2, y + 6);
  doc.text('Montant', W - M - 2, y + 6, { align: 'right' });

  y += 15;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  const titleLines = doc.splitTextToSize(`Formation : ${p.formation}`, cols[1] - cols[0] - 4);
  doc.text(titleLines, cols[0] + 2, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slate);
  const details = doc.splitTextToSize(
    [`Modalité : ${p.modality}`, `Session : ${p.session}`, p.duration ? `Durée : ${p.duration}` : ''].filter(Boolean).join(' · '),
    cols[1] - cols[0] - 4
  );
  doc.text(details, cols[0] + 2, y + titleLines.length * 4.6 + 1);

  const totals = computeTotals(p);
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(String(p.participants), cols[1] + 2, y);
  doc.text(p.unitPrice !== null ? fcfa(p.unitPrice) : 'Sur devis', cols[2] + 2, y);
  doc.text(totals ? fcfa(totals.subtotal) : 'À confirmer', W - M - 2, y, { align: 'right' });

  y += Math.max(18, titleLines.length * 4.6 + details.length * 4 + 8);
  doc.setDrawColor(226, 232, 240);
  doc.line(M, y, W - M, y);

  // Totals
  y += 8;
  const line = (label: string, value: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(...(bold ? blue : [30, 41, 59] as [number, number, number]));
    doc.setFontSize(bold ? 12 : 10);
    doc.text(label, 104, y);
    doc.text(value, W - M - 2, y, { align: 'right' });
    y += bold ? 9 : 7;
  };
  if (totals) {
    line('Sous-total', fcfa(totals.subtotal));
    if (totals.discount > 0) line(`Remise de groupe (-${Math.round(totals.rate * 100)} %)`, `- ${fcfa(totals.discount)}`);
    doc.setFillColor(248, 250, 252);
    doc.rect(100, y - 6, W - M - 100, 11, 'F');
    line('TOTAL', fcfa(totals.total), true);
  } else {
    line('TOTAL', 'Communiqué par le cabinet', true);
  }

  // Terms
  y += 8;
  doc.setTextColor(...terracotta);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('CONDITIONS', M, y);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const terms = [
    '- Paiement en 2 ou 3 tranches ; la place est confirmée à la réception du premier versement.',
    '- Modes de règlement : virement bancaire, chèque, Orange Money, Wave, MTN MoMo.',
    `- Proforma valable 30 jours, jusqu'au ${valid}.`,
    "- Document établi automatiquement par ADILINE, l'assistante virtuelle du CICEXF ; un conseiller vous contacte pour finaliser l'inscription."
  ];
  doc.text(doc.splitTextToSize(terms.join('\n'), W - 2 * M), M, y + 6);

  if (p.cancelled) {
    doc.setTextColor(220, 38, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(48);
    doc.text('ANNULÉE', W / 2, 170, { align: 'center', angle: 20 });
  }

  // Footer
  doc.setDrawColor(...terracotta);
  doc.setLineWidth(0.6);
  doc.line(M, 280, W - M, 280);
  doc.setFontSize(8);
  doc.setTextColor(...slate);
  doc.text(`${CABINET.name} · ${CABINET.site}`, W / 2, 286, { align: 'center' });

  return doc.output('blob');
}
