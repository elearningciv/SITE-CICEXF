import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import config from '../firebase-applet-config.json';

// Firestore only: visitors never need Firebase Auth (see firebaseAuth.ts, used by the admin)
export const app = initializeApp(config);
export const db = getFirestore(app, config.firestoreDatabaseId || '(default)');
