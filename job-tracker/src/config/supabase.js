/**
 * Supabase PostgreSQL Database Configuration
 * 
 * To activate Supabase PostgreSQL cloud database:
 * 1. Go to https://supabase.com
 * 2. Create a new project and copy your URL & Anon Key into `.env`.
 */

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || "",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ""
};

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

console.log(`[Database Engine] Supabase Configured: ${isSupabaseConfigured ? 'YES (PostgreSQL Active)' : 'NO (Using Local Storage Fallback)'}`);
