import { Clock, MapPin } from 'lucide-react';
import { formatOfferPrice } from '../data/formationOffers';

/** Hours, delivery mode and price of a training axis */
export default function FormationFacts({ offer, compact = false }: {
  offer?: { price: number; hours: number; modality: string };
  compact?: boolean;
}) {
  if (!offer) return null;
  const chip = `flex items-center rounded-lg px-2.5 py-1.5 ${compact ? 'text-[11px]' : 'text-xs'}`;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`${chip} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200`}>
        <Clock className="mr-1.5 h-3.5 w-3.5 shrink-0 text-brand-emerald" />
        {offer.hours} heures
      </span>
      <span className={`${chip} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200`}>
        <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0 text-brand-emerald" />
        {offer.modality}
      </span>
      <span className={`${chip} bg-[#8A1A24] font-bold text-white`}>{formatOfferPrice(offer.price)}</span>
    </div>
  );
}
