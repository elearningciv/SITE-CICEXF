import { getAuth } from 'firebase/auth';
import { app } from './firebase';

// Kept apart from firebase.ts so that Firebase Auth is only downloaded by administrators
export const auth = getAuth(app);
