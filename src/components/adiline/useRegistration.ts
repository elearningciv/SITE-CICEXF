import { useRef, useState } from 'react';
import { saveProspect } from '../../lib/prospects';
import { buildProformaPdf, computeTotals, fcfa, parsePrice, ProformaData } from '../../lib/proforma';
import { createInvoice } from '../../lib/invoices';

/**
 * Guided registration inside the ADILINE conversation: one question at a time (with answer
 * buttons), checks each answer, shows a summary, then saves the request and hands over a
 * proforma invoice as a PDF. Runs in the browser: no AI involved, so answers are exact.
 */

export interface RegistrationFormation {
  id: string;
  title: string;
  price?: string;
  modality?: string;
  duration?: string;
}

export interface ProformaAttachment {
  number: string;
  url: string;
  fileName: string;
  total: string;
}

export interface FlowMessage {
  id: string;
  role: 'assistant';
  text: string;
  timestamp: Date;
  choices?: string[];
  proforma?: ProformaAttachment;
}

type Step = 'formation' | 'type' | 'name' | 'company' | 'phone' | 'email' | 'participants' | 'session' | 'modality' | 'confirm';

interface Answers {
  formation?: RegistrationFormation;
  isCompany?: boolean;
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  participants?: number;
  session?: string;
  modality?: string;
}

const SESSIONS = ['Session en cours (Inscriptions ouvertes)', 'Session sur-mesure'];
const MODALITIES = ['Présentiel', 'En ligne', 'Hybride'];
const CONFIRM = "Confirmer l'inscription";
const RESTART = 'Recommencer';
const CANCEL = 'Annuler';

/** "je veux m'inscrire", "inscription", "proforma", "un devis"… */
export const REGISTRATION_RE = /(m['’ ]?inscrire|inscri(re|ption|vez)|pro-?\s?forma|devis)/i;

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

export function useRegistration(
  formations: RegistrationFormation[],
  push: (message: FlowMessage) => void
) {
  const [step, setStep] = useState<Step | null>(null);
  const answers = useRef<Answers>({});

  const say = (text: string, choices?: string[], extra: Partial<FlowMessage> = {}) =>
    push({ id: 'reg_' + Date.now() + Math.random().toString(36).slice(2, 6), role: 'assistant', text, timestamp: new Date(), choices, ...extra });

  const findFormation = (text: string) => {
    const t = norm(text);
    if (!t) return undefined;
    return formations.find(f => norm(f.title) === t)
      || formations.find(f => t.includes(norm(f.title)) || norm(f.title).includes(t))
      || formations.find(f => norm(f.title).split(' ').filter(w => w.length > 4).some(w => t.includes(w)));
  };

  const ask = (next: Step) => {
    setStep(next);
    const a = answers.current;
    switch (next) {
      case 'formation':
        return say('Avec plaisir ! Pour quelle formation souhaitez-vous vous inscrire ?', formations.slice(0, 10).map(f => f.title));
      case 'type':
        return say(`Formation choisie : **${a.formation!.title}**.\n\nL'inscription est-elle individuelle ou pour une entreprise / organisation ?`, ['Individuelle', 'Entreprise / organisation']);
      case 'name':
        return say(a.isCompany ? 'Le nom complet de la personne à contacter ?' : 'Votre nom complet ?');
      case 'company':
        return say('Le nom de votre entreprise ou organisation ?');
      case 'phone':
        return say('Votre numéro de téléphone (WhatsApp de préférence) ?');
      case 'email':
        return say('Votre adresse e-mail ?');
      case 'participants':
        return say('Combien de participants ? (remise de 10 % dès 3 personnes, 15 % dès 5)', ['1', '2', '3', '5', '10']);
      case 'session':
        return say('Quelle session souhaitez-vous ?', SESSIONS);
      case 'modality': {
        const preferred = MODALITIES.find(m => norm(a.formation?.modality || '').includes(norm(m)));
        return say('Quelle modalité préférez-vous ?', preferred === 'Hybride' ? ['Hybride'] : preferred ? [preferred, ...MODALITIES.filter(m => m !== preferred)] : MODALITIES);
      }
      case 'confirm': {
        const unit = parsePrice(a.formation!.price);
        const totals = computeTotals({ participants: a.participants!, unitPrice: unit });
        const lines = [
          `- Formation : **${a.formation!.title}**`,
          `- ${a.isCompany ? `Entreprise : ${a.company} (contact : ${a.name})` : `Nom : ${a.name}`}`,
          `- Téléphone : ${a.phone}`,
          `- E-mail : ${a.email}`,
          `- Participants : ${a.participants}`,
          `- Session : ${a.session} · ${a.modality}`,
          totals
            ? `- Montant : **${fcfa(totals.total)}**${totals.discount ? ` (remise de ${Math.round(totals.rate * 100)} % incluse)` : ''}, payable en 2 ou 3 tranches`
            : '- Montant : communiqué par le cabinet'
        ];
        return say(`Voici le récapitulatif de votre inscription :\n\n${lines.join('\n')}\n\nTout est correct ?`, [CONFIRM, RESTART, CANCEL]);
      }
    }
  };

  /** Starts the guided registration; a formation named in the request is picked up directly */
  const start = (requestText = '') => {
    answers.current = {};
    const guess = findFormation(requestText);
    if (guess) {
      answers.current.formation = guess;
      ask('type');
    } else {
      ask('formation');
    }
  };

  const cancel = () => {
    setStep(null);
    answers.current = {};
    say("C'est noté, j'ai annulé l'inscription. Je reste à votre disposition pour toute question.");
  };

  const finish = async () => {
    setStep(null);
    const a = answers.current;
    const unit = parsePrice(a.formation!.price);
    const totals = computeTotals({ participants: a.participants!, unitPrice: unit });
    const invoiceData: Omit<ProformaData, 'number' | 'date'> = {
      formation: a.formation!.title,
      modality: a.modality!,
      session: a.session!,
      duration: a.formation!.duration,
      participants: a.participants!,
      unitPrice: unit,
      client: { name: a.name!, company: a.company, phone: a.phone!, email: a.email!, isCompany: !!a.isCompany }
    };

    // Official sequential number, stored with the invoice in the admin's "Factures" folder
    let number: string;
    let date: Date;
    try {
      ({ number, date } = await createInvoice(invoiceData));
    } catch (err) {
      console.error('Invoice numbering error:', err);
      say("Je n'ai pas pu établir votre proforma (problème de connexion). Merci de réessayer dans un instant, ou écrivez-nous sur WhatsApp au **+225 07 01 97 00 65**.", [CONFIRM, CANCEL]);
      setStep('confirm');
      return;
    }

    const id = await saveProspect({
      name: a.name!,
      email: a.email!,
      phone: a.phone!,
      type: a.isCompany ? 'Demande Entreprise' : 'Inscription Individuelle',
      target: a.formation!.title,
      session: a.session,
      modality: a.modality,
      company: a.isCompany ? a.company : '',
      participants: String(a.participants),
      notes: `Inscription via ADILINE · Proforma ${number} · ${totals ? `Total ${fcfa(totals.total)}` : 'Montant à confirmer'}`,
      channel: 'En ligne'
    });
    if (!id) console.warn('Prospect not saved; the invoice', number, 'is stored in the Factures folder');
    try {
      const blob = await buildProformaPdf({ ...invoiceData, number, date });
      say(
        `Votre inscription est enregistrée, merci **${a.name}** !\n\nVoici votre **facture proforma n° ${number}**. Un conseiller vous contacte au ${a.phone} pour confirmer votre place et les modalités de paiement.`,
        undefined,
        { proforma: { number, url: URL.createObjectURL(blob), fileName: `Proforma-CICEXF-${number}.pdf`, total: totals ? fcfa(totals.total) : 'À confirmer' } }
      );
    } catch (err) {
      console.error('Proforma error:', err);
      say(`Votre inscription est enregistrée, merci **${a.name}** ! La proforma n'a pas pu être générée ici : un conseiller vous l'envoie au ${a.email}.`);
    }
    answers.current = {};
  };

  /** Returns true when the text was an answer for the registration in progress */
  const handle = (text: string): boolean => {
    if (!step) return false;
    const value = text.trim();
    const a = answers.current;
    if (/^(annuler|stop|arr[eê]ter)$/i.test(value) || value === CANCEL) { cancel(); return true; }
    if (value === RESTART) { start(''); return true; }

    switch (step) {
      case 'formation': {
        const f = findFormation(value);
        if (!f) { say("Je n'ai pas trouvé cette formation. Choisissez-la dans la liste :", formations.slice(0, 10).map(x => x.title)); return true; }
        a.formation = f; ask('type'); return true;
      }
      case 'type':
        a.isCompany = /entreprise|organisation|soci[eé]t[eé]|ong|structure|minist/i.test(value);
        if (!a.isCompany) a.participants = 1;
        ask('name'); return true;
      case 'name':
        if (value.length < 3) { say('Merci d\'indiquer votre nom complet (au moins 3 caractères).'); return true; }
        a.name = value; ask(a.isCompany ? 'company' : 'phone'); return true;
      case 'company':
        if (value.length < 2) { say("Merci d'indiquer le nom de l'entreprise ou de l'organisation."); return true; }
        a.company = value; ask('phone'); return true;
      case 'phone':
        if (value.replace(/\D/g, '').length < 8) { say('Ce numéro semble incomplet : pouvez-vous le vérifier (au moins 8 chiffres) ?'); return true; }
        a.phone = value; ask('email'); return true;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { say("Cette adresse e-mail ne semble pas valide : pouvez-vous la vérifier ?"); return true; }
        a.email = value.toLowerCase(); ask(a.isCompany ? 'participants' : 'session'); return true;
      case 'participants': {
        const n = parseInt(value.replace(/\D/g, ''), 10);
        if (!n || n < 1 || n > 500) { say('Indiquez un nombre de participants (par exemple 4).', ['1', '2', '3', '5', '10']); return true; }
        a.participants = n; ask('session'); return true;
      }
      case 'session':
        a.session = SESSIONS.find(s => norm(s) === norm(value)) || (/mesure/i.test(value) ? SESSIONS[1] : SESSIONS[0]);
        ask('modality'); return true;
      case 'modality':
        a.modality = MODALITIES.find(m => norm(value).includes(norm(m))) || a.formation?.modality || 'Hybride';
        ask('confirm'); return true;
      case 'confirm':
        if (value === CONFIRM || /^(oui|ok|confirm|valid|d'accord)/i.test(value)) { void finish(); return true; }
        say('Souhaitez-vous confirmer, recommencer ou annuler ?', [CONFIRM, RESTART, CANCEL]); return true;
    }
    return false;
  };

  return { active: step !== null, start, handle };
}
