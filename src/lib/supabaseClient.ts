import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration comes from Vite env vars. Keep placeholders for local use.
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

// Returns a Supabase client instance when configuration is present.
export const getSupabaseClient = (): SupabaseClient | null => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

// Hook wrapper for components to inspect env-driven behavior
export const useSupabase = (): { enabled: boolean; supabase?: SupabaseClient } => {
  const enabled = !!SUPABASE_URL && !!SUPABASE_ANON_KEY && (import.meta.env.VITE_USE_SUPABASE === 'true');
  if (!enabled) return { enabled: false };
  const supabase = getSupabaseClient()!;
  return { enabled: true, supabase };
};

export default null;
