import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { setVisitorEmail, getVisitorId } from './tracker';
// xlsx is heavy and only needed for admin exports: loaded on demand
const loadXlsx = () => import('xlsx');

export interface Prospect {
  id?: string;
  name: string;
  email: string;
  phone: string;
  type: 'Inscription Individuelle' | 'Demande Entreprise' | 'Contact / Renseignement' | 'Candidature Formation';
  target: string;
  session?: string;
  modality?: string;
  company?: string;
  participants?: string;
  notes?: string;
  channel: 'En ligne' | 'WhatsApp' | 'Email';
  status: 'Nouveau' | 'Contacté' | 'En cours' | 'Inscrit' | 'Archivé';
  createdAt?: any;
}

/**
 * Enregistre un prospect en base de données Firestore
 * (Appelé automatiquement à chaque validation de formulaire : en ligne, WhatsApp ou Email)
 */
export async function saveProspect(data: {
  name: string;
  email: string;
  phone: string;
  type: Prospect['type'];
  target: string;
  session?: string;
  modality?: string;
  company?: string;
  participants?: string;
  notes?: string;
  channel: Prospect['channel'];
  status?: Prospect['status'];
}): Promise<string | null> {
  try {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone.trim();
    const cleanName = data.name.trim();

    setVisitorEmail(cleanEmail);

    const docRef = await addDoc(collection(db, 'prospects'), {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      type: data.type,
      target: data.target || 'Non spécifié',
      session: data.session || 'À convenir',
      modality: data.modality || 'Non précisé',
      company: data.company || '',
      participants: data.participants || '1',
      notes: data.notes || '',
      channel: data.channel,
      status: data.status || 'Nouveau',
      visitorId: getVisitorId(),
      createdAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l’enregistrement du prospect :', error);
    return null;
  }
}

/**
 * Exporte une liste de prospects vers un véritable fichier Excel (.xlsx)
 */
export async function exportProspectsToExcel(prospects: Prospect[], customFilename?: string) {
  const XLSX = await loadXlsx();
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = customFilename || `Prospects_CICEXF_${dateStr}.xlsx`;

  // Préparation des lignes de données tabulaires
  const dataRows = prospects.map((p, index) => {
    let dateFormatted = 'Récent';
    if (p.createdAt) {
      if (p.createdAt instanceof Timestamp) {
        dateFormatted = p.createdAt.toDate().toLocaleString('fr-FR');
      } else if (p.createdAt.toDate) {
        dateFormatted = p.createdAt.toDate().toLocaleString('fr-FR');
      } else if (p.createdAt instanceof Date) {
        dateFormatted = p.createdAt.toLocaleString('fr-FR');
      }
    }

    return {
      'N°': index + 1,
      'Date Enregistrement': dateFormatted,
      'Statut': p.status || 'Nouveau',
      'Nom & Prénom': p.name || '',
      'Téléphone (WhatsApp)': p.phone || '',
      'Email': p.email || '',
      'Type de Demande': p.type || '',
      'Formation / Spécialité': p.target || '',
      'Session Souhaitée': p.session || '',
      'Modalité': p.modality || '',
      'Entreprise / Organisme': p.company || '',
      'Nb Participants': p.participants || '',
      'Canal de Soumission': p.channel || '',
      'Remarques / Message': p.notes || ''
    };
  });

  // Création de la feuille Excel
  const worksheet = XLSX.utils.json_to_sheet(dataRows);

  // Ajustement de la largeur des colonnes pour un rendu professionnel
  worksheet['!cols'] = [
    { wch: 6 },   // N°
    { wch: 20 },  // Date
    { wch: 14 },  // Statut
    { wch: 26 },  // Nom
    { wch: 20 },  // Téléphone
    { wch: 28 },  // Email
    { wch: 24 },  // Type
    { wch: 34 },  // Formation
    { wch: 22 },  // Session
    { wch: 18 },  // Modalité
    { wch: 24 },  // Entreprise
    { wch: 16 },  // Participants
    { wch: 20 },  // Canal
    { wch: 40 }   // Notes
  ];

  // Création du classeur
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Prospects CICEXF');

  // Téléchargement direct
  XLSX.writeFile(workbook, filename);
}

/**
 * Exporte une fiche individuelle de prospect sous forme de fichier Excel
 */
export async function exportSingleProspectToExcel(p: Prospect) {
  const XLSX = await loadXlsx();
  let dateFormatted = 'Récent';
  if (p.createdAt) {
    if (p.createdAt instanceof Timestamp) {
      dateFormatted = p.createdAt.toDate().toLocaleString('fr-FR');
    } else if (p.createdAt.toDate) {
      dateFormatted = p.createdAt.toDate().toLocaleString('fr-FR');
    } else if (p.createdAt instanceof Date) {
      dateFormatted = p.createdAt.toLocaleString('fr-FR');
    }
  }

  const ficheRows = [
    { 'Propriété': 'FICHE PROSPECT CICEXF', 'Valeur': p.name },
    { 'Propriété': 'Date de Soumission', 'Valeur': dateFormatted },
    { 'Propriété': 'Statut Dossier', 'Valeur': p.status || 'Nouveau' },
    { 'Propriété': 'Nom & Prénom', 'Valeur': p.name },
    { 'Propriété': 'Téléphone WhatsApp', 'Valeur': p.phone },
    { 'Propriété': 'Adresse Email', 'Valeur': p.email },
    { 'Propriété': 'Type de Demande', 'Valeur': p.type },
    { 'Propriété': 'Formation / Sujet', 'Valeur': p.target },
    { 'Propriété': 'Session Souhaitée', 'Valeur': p.session || 'À convenir' },
    { 'Propriété': 'Modalité', 'Valeur': p.modality || 'Non précisé' },
    { 'Propriété': 'Entreprise / Organisme', 'Valeur': p.company || 'Candidature Particulier' },
    { 'Propriété': 'Nombre de Participants', 'Valeur': p.participants || '1' },
    { 'Propriété': 'Canal de Transmission', 'Valeur': p.channel },
    { 'Propriété': 'Remarques / Message', 'Valeur': p.notes || 'Aucun message particulier' }
  ];

  const worksheet = XLSX.utils.json_to_sheet(ficheRows);
  worksheet['!cols'] = [{ wch: 28 }, { wch: 45 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Fiche Inscription');

  const safeName = (p.name || 'Prospect').replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(workbook, `Fiche_${safeName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}
