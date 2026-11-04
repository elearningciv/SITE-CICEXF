import type { Content, Session } from '../types';
import { DEMO, demoRequest } from './demo';

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  if (DEMO) return demoRequest(method, url, body) as Promise<T>;
  const res = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Erreur ${res.status}`);
  return data as T;
}

export const api = {
  content: () => request<Content>('GET', '/api/content'),
  session: () => request<Session>('GET', '/api/session'),
  login: (email: string, password: string) => request<Session>('POST', '/api/login', { email, password }),
  logout: () => request<Session>('POST', '/api/logout', {}),
  sendMessage: (m: Record<string, string>) => request<{ ok: true }>('POST', '/api/messages', m),
  ask: (payload: { message: string; history: { role: string; text: string }[]; lang: string; conversationId?: string; visitorId: string }) =>
    request<{ answer: string; conversationId: string; source: string }>('POST', '/api/assistant', payload),

  get: <T,>(url: string) => request<T>('GET', url),
  put: <T,>(url: string, body: unknown) => request<T>('PUT', url, body),
  post: <T,>(url: string, body: unknown) => request<T>('POST', url, body),
  patch: <T,>(url: string, body: unknown) => request<T>('PATCH', url, body),
  del: <T,>(url: string) => request<T>('DELETE', url)
};

export function visitorId() {
  try {
    let id = localStorage.getItem('capdev_visitor');
    if (!id) { id = 'v-' + Math.random().toString(36).slice(2, 12); localStorage.setItem('capdev_visitor', id); }
    return id;
  } catch {
    return 'v-anonyme';
  }
}
