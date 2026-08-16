import { collection, addDoc, doc, setDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Helper to generate a simple unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Get or create a persistent Visitor ID
export function getVisitorId(): string {
  let id = localStorage.getItem('cx_visitor_id');
  if (!id) {
    id = 'v_' + generateId();
    localStorage.setItem('cx_visitor_id', id);
  }
  return id;
}

// Get or create a Session ID (resets when tab is closed)
export function getSessionId(): string {
  let id = sessionStorage.getItem('cx_session_id');
  if (!id) {
    id = 's_' + generateId();
    sessionStorage.setItem('cx_session_id', id);
  }
  return id;
}

// Get identified email if available
export function getVisitorEmail(): string | null {
  return localStorage.getItem('cx_visitor_email');
}

// Set identified email
export function setVisitorEmail(email: string) {
  localStorage.setItem('cx_visitor_email', email.trim().toLowerCase());
}

// Track a page/tab visit
export async function trackVisit(page: string) {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const email = getVisitorEmail();
    const userAgent = navigator.userAgent;

    // Log the visit to Firestore
    await addDoc(collection(db, 'visits'), {
      visitorId,
      sessionId,
      timestamp: Timestamp.now(),
      email,
      userAgent,
      page
    });

    // If we have an email, update the subscriber's last visit time too
    if (email) {
      await setDoc(doc(db, 'subscribers', email), {
        email,
        visitorId,
        lastVisitAt: Timestamp.now()
      }, { merge: true });
    }
  } catch (err) {
    console.error('Error tracking visit:', err);
  }
}

// Track a new subscription
export async function trackSubscription(email: string, isSubscribed: boolean = true) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const visitorId = getVisitorId();
    
    // Save locally
    setVisitorEmail(cleanEmail);

    // Save to Firestore subscribers collection
    await setDoc(doc(db, 'subscribers', cleanEmail), {
      email: cleanEmail,
      visitorId,
      subscribedAt: Timestamp.now(),
      lastVisitAt: Timestamp.now(),
      isSubscribed
    }, { merge: true });

    // Track an immediate visit as identified
    await trackVisit('newsletter_subscribe');
  } catch (err) {
    console.error('Error tracking subscription:', err);
  }
}
