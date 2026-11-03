// ADI's server (Firebase Cloud Function, Gemini + the site's content)
export const ADILINE_API_URL = import.meta.env.VITE_ADILINE_API_URL
  || 'https://europe-west1-project-a93f5a0f-743d-4552-852.cloudfunctions.net/adilineChat';

/** Sends one request to ADI and returns her whole answer as text (used by the admin tools) */
export async function askAdiline(message: string): Promise<string> {
  const res = await fetch(ADILINE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: [] })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const raw = await res.text();
  let text = '';
  let failed = false;
  for (const line of raw.split('\n')) {
    if (!line.startsWith('data: ')) continue;
    let event: { type?: string; text?: string } | null = null;
    try { event = JSON.parse(line.slice(6)); } catch { continue; }
    if (event?.type === 'chunk' && event.text) text += event.text;
    if (event?.type === 'error') failed = true;
  }
  if (failed || !text.trim()) throw new Error('ADI indisponible');
  return text.trim();
}
