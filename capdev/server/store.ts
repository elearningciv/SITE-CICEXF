import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { SEED } from './seed.ts';
import type { Content, Conversation, InboxMessage } from '../src/types.ts';

// Small JSON-file store. Each file is rewritten atomically (temp file + rename),
// so a crash mid-write never leaves a half-written file.

export const DATA_DIR = path.resolve(process.env.DATA_DIR || './data');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8')) as T;
  } catch {
    return structuredClone(fallback);
  }
}

function writeJson(file: string, value: unknown) {
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, target);
}

let content: Content = readJson<Content>('content.json', SEED);
// New settings added to the seed later are filled in for existing sites
content.settings = { ...SEED.settings, ...content.settings };
content.translations ||= {};
// Earlier format: publications had a date and an axis; researchers had a category (doctoral students included)
content.publications = content.publications.map((p: any) => ({
  ...p,
  publicationYear: p.publicationYear || String(p.date || '').slice(0, 4),
  researchYear: p.researchYear || String(p.date || '').slice(0, 4),
  description: p.description ?? p.summary ?? ''
}));
content.researchers = content.researchers
  .filter((r: any) => r.category !== 'Doctorants')
  .map((r: any) => ({ id: r.id, name: r.name, grade: r.grade || r.title || 'Docteur', specialty: r.specialty || r.bio || '', photo: r.photo }));
if (!fs.existsSync(path.join(DATA_DIR, 'content.json'))) writeJson('content.json', content);

let inbox: InboxMessage[] = readJson<InboxMessage[]>('inbox.json', []);
let conversations: Conversation[] = readJson<Conversation[]>('conversations.json', []);

export const newId = (prefix: string) => `${prefix}-${crypto.randomBytes(5).toString('hex')}`;

export const store = {
  getContent: () => content,
  saveContent(next: Content) {
    content = { ...next, updatedAt: new Date().toISOString() };
    writeJson('content.json', content);
    return content;
  },

  getInbox: () => inbox,
  addMessage(msg: Omit<InboxMessage, 'id' | 'at' | 'read'>) {
    const full: InboxMessage = { ...msg, id: newId('m'), at: new Date().toISOString(), read: false };
    inbox = [full, ...inbox].slice(0, 5000);
    writeJson('inbox.json', inbox);
    return full;
  },
  updateMessage(id: string, patch: Partial<InboxMessage>) {
    inbox = inbox.map(m => (m.id === id ? { ...m, ...patch, id: m.id } : m));
    writeJson('inbox.json', inbox);
  },
  deleteMessage(id: string) {
    inbox = inbox.filter(m => m.id !== id);
    writeJson('inbox.json', inbox);
  },

  getConversations: () => conversations,
  logTurns(id: string, visitor: string, lang: string, turns: Conversation['turns']) {
    const now = new Date().toISOString();
    const existing = conversations.find(c => c.id === id);
    if (existing) {
      existing.turns.push(...turns);
      existing.updatedAt = now;
      existing.lang = lang;
    } else {
      conversations.unshift({ id, visitor, startedAt: now, updatedAt: now, lang, turns: [...turns] });
    }
    conversations = conversations.slice(0, 2000);
    writeJson('conversations.json', conversations);
  },
  deleteConversation(id: string) {
    conversations = conversations.filter(c => c.id !== id);
    writeJson('conversations.json', conversations);
  }
};
