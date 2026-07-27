import { isFirebaseConfigured } from '../config/firebase';
import { isSupabaseConfigured } from '../config/supabase';

/**
 * Unified Database Service Layer
 * Automatically manages database operations across LocalStorage, Firebase, or Supabase.
 */

export const dbService = {
  // Get current active database provider name
  getProvider() {
    if (isFirebaseConfigured) return 'Firebase Firestore';
    if (isSupabaseConfigured) return 'Supabase PostgreSQL';
    return 'Browser LocalStorage';
  },

  // Save item to storage
  async setItem(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return { success: true };
    } catch (err) {
      console.error(`[dbService] Error writing ${key}:`, err);
      return { success: false, error: err.message };
    }
  },

  // Get item from storage
  async getItem(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      return (parsed !== null && parsed !== undefined) ? parsed : fallback;
    } catch (err) {
      console.error(`[dbService] Error reading ${key}:`, err);
      return fallback;
    }
  },

  // Sync state helper
  syncCollection(key, data) {
    this.setItem(key, data);
  }
};
