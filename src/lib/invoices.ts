import { collection, doc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { computeTotals, ProformaData } from './proforma';
import { getVisitorId } from './tracker';
import { getVisitSource } from './visitSource';

/**
 * Proforma invoices: every invoice is stored in `proformas` with a sequential number.
 *
 * Number = "PF" + 2-digit year + 6-digit sequence, 10 characters: PF26000001, PF26000002…
 * The sequence comes from `invoice_counters/{year}` and is taken in a transaction, so two
 * invoices can never share a number; firestore.rules only accepts counter + invoice together.
 */

export type InvoiceStatus = 'Émise' | 'Annulée';

export interface Invoice extends Omit<ProformaData, 'date'> {
  id: string;
  seq: number;
  year: number;
  status: InvoiceStatus;
  createdAt?: Timestamp;
  subtotal: number | null;
  discount: number | null;
  total: number | null;
  source?: string;
  visitorId?: string;
}

export const formatInvoiceNumber = (year: number, seq: number) =>
  `PF${String(year % 100).padStart(2, '0')}${String(seq).padStart(6, '0')}`;

/** Takes the next number and saves the invoice; returns its number and date */
export async function createInvoice(data: Omit<ProformaData, 'number' | 'date'>): Promise<{ number: string; date: Date }> {
  const year = new Date().getFullYear();
  const counterRef = doc(db, 'invoice_counters', String(year));
  const totals = computeTotals(data);

  return runTransaction(db, async (tx) => {
    const counter = await tx.get(counterRef);
    const seq = (counter.exists() ? (counter.data().last as number) : 0) + 1;
    const number = formatInvoiceNumber(year, seq);
    tx.set(counterRef, { last: seq });
    tx.set(doc(db, 'proformas', `${year}-${seq}`), {
      number,
      seq,
      year,
      status: 'Émise',
      formation: data.formation,
      modality: data.modality,
      session: data.session,
      duration: data.duration || '',
      participants: data.participants,
      unitPrice: data.unitPrice,
      subtotal: totals ? totals.subtotal : null,
      discount: totals ? totals.discount : null,
      total: totals ? totals.total : null,
      client: {
        name: data.client.name,
        company: data.client.company || '',
        phone: data.client.phone,
        email: data.client.email,
        isCompany: data.client.isCompany
      },
      source: getVisitSource(),
      visitorId: getVisitorId(),
      createdAt: serverTimestamp()
    });
    return { number, date: new Date() };
  });
}

/** Admin: all invoices, newest first */
export function useInvoices(): { invoices: Invoice[]; loading: boolean; error: string } {
  const [state, setState] = useState<{ invoices: Invoice[]; loading: boolean; error: string }>({ invoices: [], loading: true, error: '' });
  useEffect(() => onSnapshot(
    query(collection(db, 'proformas'), orderBy('createdAt', 'desc')),
    (snap) => setState({ invoices: snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Invoice, 'id'>) })), loading: false, error: '' }),
    (err) => { console.error('Invoices sync error:', err); setState({ invoices: [], loading: false, error: 'Impossible de charger les factures.' }); }
  ), []);
  return state;
}

export function setInvoiceStatus(id: string, status: InvoiceStatus) {
  return updateDoc(doc(db, 'proformas', id), { status });
}

/** Rebuilds the PDF data of a stored invoice */
export function toProformaData(inv: Invoice): ProformaData {
  return {
    number: inv.number,
    date: inv.createdAt ? inv.createdAt.toDate() : new Date(),
    formation: inv.formation,
    modality: inv.modality,
    session: inv.session,
    duration: inv.duration,
    participants: inv.participants,
    unitPrice: inv.unitPrice,
    client: inv.client,
    cancelled: inv.status === 'Annulée'
  };
}
