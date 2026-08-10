import { firebaseConfig } from '../config/firebase';

/**
 * Unified Firebase Firestore REST Cloud Database Service
 * Real-time bidirectional data persistence across devices & panels via Firebase Firestore Cloud REST API.
 */

const FIREBASE_REST_BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/tracker_data`;
const API_KEY = firebaseConfig.apiKey;

export const dbService = {
  getProvider() {
    return 'Firebase Firestore Cloud REST API';
  },

  // Write data to LocalStorage + Firebase Firestore Cloud REST API
  async setItem(key, data) {
    try {
      if (data === undefined || data === null) return { success: false, error: 'Data is null' };

      // 1. Save locally for zero-latency local fallback
      const jsonStr = JSON.stringify(data);
      localStorage.setItem(key, jsonStr);

      // 2. Sync to Firebase Firestore Cloud API
      const url = `${FIREBASE_REST_BASE}/${key}?key=${API_KEY}`;
      const payload = {
        fields: {
          json_data: {
            stringValue: jsonStr
          },
          updatedAt: {
            stringValue: new Date().toISOString()
          }
        }
      };

      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[Firebase Cloud Sync Error] Key: ${key}, Status: ${res.status}`, errorText);
        return { success: false, cloudSynced: false, error: errorText };
      }

      console.log(`[Firebase Cloud Sync Success] Key: ${key} synced to Firestore.`);
      return { success: true, cloudSynced: true };
    } catch (err) {
      console.error(`[dbService] Error setting ${key}:`, err);
      return { success: false, cloudSynced: false, error: err.message };
    }
  },

  // Read data from Firebase Firestore Cloud with LocalStorage fallback
  async getItem(key, fallback = []) {
    try {
      const local = localStorage.getItem(key);
      const localData = local ? JSON.parse(local) : null;

      // Fetch latest live cloud data from Firebase Firestore REST API
      const url = `${FIREBASE_REST_BASE}/${key}?key=${API_KEY}`;
      const response = await fetch(url, { cache: 'no-store' });
      
      if (response.ok) {
        const cloudResult = await response.json();
        const jsonString = cloudResult?.fields?.json_data?.stringValue;
        if (jsonString) {
          const cloudData = JSON.parse(jsonString);
          if (Array.isArray(cloudData)) {
            // Cache back to local storage
            localStorage.setItem(key, JSON.stringify(cloudData));
            return cloudData;
          }
        }
      }

      return localData || fallback;
    } catch (err) {
      console.warn(`[dbService] Reading ${key} from cloud fallback to local:`, err);
      const local = localStorage.getItem(key);
      return local ? JSON.parse(local) : fallback;
    }
  },

  // Fetch all collections from cloud in parallel
  async fetchAllCollections() {
    const keys = [
      'jt_jobs',
      'jt_applications',
      'jt_personal_apps',
      'jt_users_db',
      'jt_courses',
      'jt_mentorships',
      'jt_mentor_apps',
      'jt_messages'
    ];

    const results = {};
    await Promise.all(
      keys.map(async (key) => {
        try {
          const data = await this.getItem(key, null);
          if (data && Array.isArray(data)) {
            results[key] = data;
          }
        } catch (e) {
          console.warn(`[dbService] fetchAllCollections failed for ${key}`, e);
        }
      })
    );
    return results;
  },

  // Sync collection helper
  syncCollection(key, data) {
    return this.setItem(key, data);
  }
};
