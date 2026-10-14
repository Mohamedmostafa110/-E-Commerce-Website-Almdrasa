import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Firebase is configured through Vite env variables (see .env.example).
 * When they are missing the app transparently falls back to a local,
 * browser-based account store so the whole shop keeps working.
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

export const firebaseApp = isFirebaseConfigured ? initializeApp(config) : null;
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
