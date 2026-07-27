/**
 * Firebase Database & Authentication Configuration
 * Active Project: trackerpro-app
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDIWZCoChlB7grTV8d9gxxRWRz8Ih0k62s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "trackerpro-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "trackerpro-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "trackerpro-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "256002247485",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:256002247485:web:2db1c1ea76c51f94101354",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3WBLEMGLML"
};

export const isFirebaseConfigured = true;

console.log(`[Database Engine] Active Firebase Project: ${firebaseConfig.projectId} (Cloud Active)`);
