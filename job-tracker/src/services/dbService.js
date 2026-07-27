import { firebaseConfig } from '../config/firebase';

/**
 * Unified Firebase Firestore REST Cloud Database Service
 * Persists data to Firebase Firestore Cloud + LocalStorage for instant multi-device sync worldwide.
 */

const FIREBASE_REST_BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/tracker_data`;
const API_KEY = firebaseConfig.apiKey;

export const dbService = {
  getProvider() {
    return 'Firebase Firestore Cloud REST';
  },

  // Write data to LocalStorage + Firebase Firestore Cloud
  async setItem(key, data) {
    try {
      // 1. Save to local storage for zero latency
      localStorage.setItem(key, JSON.stringify(data));

      // 2. Sync asynchronously to Firebase Firestore Cloud API
      const url = `${FIREBASE_REST_BASE}/${key}?updateMask.fieldPaths=json_data&key=${API_KEY}`;
      const payload = {
        fields: {
          json_data: {
            stringValue: JSON.stringify(data)
          }
        }
      };

      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.warn('[Firebase Cloud Sync HTTP Error]:', res.status, await res.text());
      }

      return { success: true };
    } catch (err) {
      console.error(`[dbService] Error setting ${key}:`, err);
      return { success: false, error: err.message };
    }
  },

  // Read data from Firebase Firestore Cloud with LocalStorage fallback
  async getItem(key, fallback) {
    try {
      // 1. Try reading local storage first for speed
      const local = localStorage.getItem(key);
      let localData = local ? JSON.parse(local) : null;

      // 2. Fetch latest live cloud data from Firebase Firestore REST API
      const url = `${FIREBASE_REST_BASE}/${key}?key=${API_KEY}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const cloudResult = await response.json();
        const jsonString = cloudResult?.fields?.json_data?.stringValue;
        if (jsonString) {
          const cloudData = JSON.parse(jsonString);
          // Sync back to local storage
          localStorage.setItem(key, JSON.stringify(cloudData));
          return cloudData;
        }
      }

      return localData || fallback;
    } catch (err) {
      console.warn(`[dbService] Reading ${key} from cloud fallback to local:`, err);
      const local = localStorage.getItem(key);
      return local ? JSON.parse(local) : fallback;
    }
  },

  // Sync collection helper
  syncCollection(key, data) {
    this.setItem(key, data);
  }
};
