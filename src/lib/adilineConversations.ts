import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ReportMessage } from './adminReports';

/**
 * ADILINE conversations, written by the server (functions/adiline.js): one document per visitor
 * in `adiline_conversations`, with that visitor's messages in its `messages` subcollection.
 */

export interface Conversation {
  id: string;
  startedAt?: Timestamp;
  lastMessageAt?: Timestamp;
  messageCount?: number;
  lastPreview?: string;
  contact?: { name?: string; whatsapp?: string; email?: string };
}

/** Admin: all conversations, most recent first */
export function useConversations(): { conversations: Conversation[]; loading: boolean; error: string } {
  const [state, setState] = useState<{ conversations: Conversation[]; loading: boolean; error: string }>({ conversations: [], loading: true, error: '' });
  useEffect(() => onSnapshot(
    query(collection(db, 'adiline_conversations'), orderBy('lastMessageAt', 'desc')),
    (snap) => setState({ conversations: snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Conversation, 'id'>) })), loading: false, error: '' }),
    (err) => { console.error('Conversations sync error:', err); setState({ conversations: [], loading: false, error: 'Impossible de charger les discussions.' }); }
  ), []);
  return state;
}

/** One visitor's messages in the order they were exchanged */
export async function loadMessages(conversationId: string): Promise<ReportMessage[]> {
  const snap = await getDocs(collection(db, 'adiline_conversations', conversationId, 'messages'));
  return snap.docs
    .map(d => d.data() as { role: 'user' | 'assistant'; text: string; at?: Timestamp; seq?: number; attachmentName?: string })
    .sort((a, b) => (a.at?.toMillis() ?? 0) - (b.at?.toMillis() ?? 0) || (a.seq ?? 0) - (b.seq ?? 0))
    .map(m => ({ role: m.role, text: m.text, at: m.at ? m.at.toDate() : null, attachmentName: m.attachmentName }));
}

export async function deleteConversation(conversationId: string) {
  const snap = await getDocs(collection(db, 'adiline_conversations', conversationId, 'messages'));
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
  await deleteDoc(doc(db, 'adiline_conversations', conversationId));
}
