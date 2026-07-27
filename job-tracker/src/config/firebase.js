/**
 * Firebase Database & Authentication Configuration
 * 
 * To activate real-time Firebase / Firestore cloud database:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new Firebase project and enable Firestore Database & Authentication.
 * 3. Copy your project credentials into `.env` (see `.env.example`).
 */

// Fallback configuration object reading Vite environment variables
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

console.log(`[Database Engine] Firebase Configured: ${isFirebaseConfigured ? 'YES (Cloud Active)' : 'NO (Using Local Storage Fallback)'}`);
