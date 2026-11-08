import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import config from '../firebase-applet-config.json';

// Learners use a separate Firebase app instance: their session never mixes with an
// administrator's session on the same browser, and is only downloaded on the E-learning tab.
export const learnerApp = initializeApp(config, 'elearning');
export const learnerAuth = getAuth(learnerApp);
export const learnerDb = getFirestore(learnerApp, config.firestoreDatabaseId || '(default)');
