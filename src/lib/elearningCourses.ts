// Administration: opening status of the e-learning certifications (collection elearning_courses).
// A course with no document keeps its default status (open for a new course). Closing is reversible;
// deleting is final (the Firestore rules refuse any change once a course is deleted).
import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { CourseStatus } from '../data/elearning';

export function useCourseStatuses() {
  const [statuses, setStatuses] = useState<Record<string, CourseStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => onSnapshot(collection(db, 'elearning_courses'), (snap) => {
    setStatuses(Object.fromEntries(snap.docs.map((d) => [d.id, d.data().status as CourseStatus])));
    setLoading(false);
  }, (e) => {
    console.error('Statut des certifications :', e);
    setError("Impossible de lire l'état des certifications.");
    setLoading(false);
  }), []);
  return { statuses, loading, error };
}

export const setCourseStatus = (courseId: string, status: CourseStatus) =>
  setDoc(doc(db, 'elearning_courses', courseId), { status, updatedAt: serverTimestamp() });
