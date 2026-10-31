import { useEffect, useState } from 'react';
import { Testimonial } from '../types';

// Testimonials are managed from the admin console and stored in a single settings document
// (app_settings is already readable by everyone and writable by admins only).
// Firebase is loaded on demand so it never delays the first display of the site.
const loadDoc = () => Promise.all([import('../firebase'), import('firebase/firestore')])
  .then(([{ db }, firestore]) => ({ ref: firestore.doc(db, 'app_settings', 'testimonials'), ...firestore }));

export function useTestimonials(): Testimonial[] {
  const [items, setItems] = useState<Testimonial[]>([]);
  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;
    loadDoc().then(({ ref, onSnapshot }) => {
      if (cancelled) return;
      unsubscribe = onSnapshot(
        ref,
        (snap) => setItems(((snap.data()?.items as Testimonial[]) || []).filter(t => t && t.text)),
        (err) => console.error('Error syncing testimonials:', err)
      );
    }).catch((err) => console.error('Error loading testimonials:', err));
    return () => { cancelled = true; unsubscribe(); };
  }, []);
  return items;
}

export async function saveTestimonials(items: Testimonial[]) {
  const { ref, setDoc } = await loadDoc();
  return setDoc(ref, { items, updatedAt: new Date().toISOString() });
}
