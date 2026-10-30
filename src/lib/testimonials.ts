import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Testimonial } from '../types';

// Testimonials are managed from the admin console and stored in a single settings document
// (app_settings is already readable by everyone and writable by admins only).
const TESTIMONIALS_DOC = doc(db, 'app_settings', 'testimonials');

export function useTestimonials(): Testimonial[] {
  const [items, setItems] = useState<Testimonial[]>([]);
  useEffect(() => onSnapshot(
    TESTIMONIALS_DOC,
    (snap) => setItems(((snap.data()?.items as Testimonial[]) || []).filter(t => t && t.text)),
    (err) => console.error('Error syncing testimonials:', err)
  ), []);
  return items;
}

export function saveTestimonials(items: Testimonial[]) {
  return setDoc(TESTIMONIALS_DOC, { items, updatedAt: new Date().toISOString() });
}
