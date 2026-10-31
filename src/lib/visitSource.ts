// Where a visitor came from (a social post link carries ?utm_source=linkedin&utm_campaign=...).
// Remembered for the visit, then added to any request the visitor sends, so the admin sees
// which network brings registrations.

const KEY = 'cicexf_visit_source';

const NETWORK_NAMES: Record<string, string> = {
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp'
};

/** Called once at start-up */
export function captureVisitSource() {
  try {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source');
    if (!source) return;
    const network = NETWORK_NAMES[source.toLowerCase()] || source;
    const campaign = params.get('utm_campaign');
    sessionStorage.setItem(KEY, campaign ? `${network} (${campaign})` : network);
  } catch {
    // storage unavailable: nothing to remember
  }
}

/** e.g. "LinkedIn (formation-gestion-comptable)", or '' for a direct visit */
export function getVisitSource(): string {
  try {
    return sessionStorage.getItem(KEY) || '';
  } catch {
    return '';
  }
}
