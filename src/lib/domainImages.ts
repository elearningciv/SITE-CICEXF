import { DomainIntervention } from '../types';

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

// Default illustration chosen from the domain name; an image set in the admin always takes precedence
const KEYWORD_IMAGES: [RegExp, string][] = [
  [/aviation|a[ée]ro|transport/i, unsplash('photo-1436491865332-7a61a109cc05')],
  [/financ|investissement/i, unsplash('photo-1544377193-33dcf4d68fb5')],
  [/informatique|r[ée]seau|num[ée]rique|data|digital/i, unsplash('photo-1451187580459-43490279c0fa')],
  [/territor|cadastr|sig\b|urban/i, unsplash('photo-1524661135-423995f22d0b')],
  [/qhse|hygi[eè]ne|s[ée]curit[ée]|environnement|qualit[ée]/i, unsplash('photo-1513694203232-719a280e022f')],
  [/[ée]tudes?|enqu[eê]te|recherche|socio/i, unsplash('photo-1531482615713-2afd69097998')],
  [/suivi|[ée]valuation|projet|programme/i, unsplash('photo-1517245386807-bb43f82c33c4')],
  [/audit/i, unsplash('photo-1454165804606-c3d57bc86b40')],
  [/conseil|strat[ée]g|organisation/i, unsplash('photo-1552664730-d307ca884978')],
  [/formation|renforcement|capacit[ée]s|p[ée]dagog/i, unsplash('photo-1524178232363-1fb2b075b655')],
  [/ressources humaines|management|accompagnement/i, unsplash('photo-1522071820081-009f0129c71c')]
];

const FALLBACK = unsplash('photo-1434030216411-0b793f4b4173');

export function getDomainImage(domain: Pick<DomainIntervention, 'id'> & { title?: string; imageUrl?: string }): string {
  if (domain.imageUrl) return domain.imageUrl;
  const name = `${domain.title || ''} ${domain.id}`;
  return KEYWORD_IMAGES.find(([re]) => re.test(name))?.[1] || FALLBACK;
}
