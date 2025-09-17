import axios from 'axios';
import { useSupabase, getSupabaseClient } from './supabaseClient';
// Try to import the generated supabase client (if present)
let generatedSupabase: any = null;
try {
  // Import via relative path; this file exists in the repo (`src/integrations/supabase/client.ts`)
  // Use standard import-like require to avoid top-level ESM/CJS mismatch in the test runner.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  generatedSupabase = require('../integrations/supabase/client').supabase;
} catch (e) {
  generatedSupabase = null;
}

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000/api';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// If a generated supabase client is present, sync its session token into the axios client.
const trySyncGeneratedSupabase = async () => {
  if (!generatedSupabase) return;
  try {
    const { data } = await generatedSupabase.auth.getSession();
    const session = data?.session ?? null;
    setAuthToken(session?.access_token ?? null);

    // Subscribe to auth changes
    const { data: sub } = generatedSupabase.auth.onAuthStateChange((_event: any, sess: any) => {
      setAuthToken(sess?.access_token ?? null);
    });
    void sub;
  } catch (e) {
    // ignore
  }
};

// Best-effort sync on module load
void trySyncGeneratedSupabase();

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
});

// Request interceptor to attach token
api.interceptors.request.use((cfg) => {
  if (authToken) cfg.headers = { ...cfg.headers, Authorization: `Bearer ${authToken}` };
  return cfg;
});

// Simple response interceptor (could centralize error handling)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Pass through for now
    return Promise.reject(err);
  }
);

export const fetchSpecies = async (): Promise<any[]> => {
  // Local-first: if SUPABASE is enabled via env, use the lightweight supabaseClient helper
  try {
    const supClient = getSupabaseClient();
    if (supClient && (import.meta.env.VITE_USE_SUPABASE === 'true')) {
      const { data, error } = await supClient.from('species').select('*');
      if (error) throw error;
      return data ?? [];
    }
  } catch (e) {
    // fallback to local API
  }
  const resp = await api.get('/species');
  return (resp.data as any[]) ?? [];
};

export const obisSync = async () => {
  // Trigger sync on local backend (Supabase doesn't run OBIS sync server-side here)
  const resp = await api.post('/obis/sync');
  return resp.data;
};

export const classifyImage = async (file: File) => {
  const form = new FormData();
  form.append('file', file);
  const resp = await api.post('/classify', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resp.data;
};

export const wsUrl = (path = '/ws/updates') => {
  const base = API_BASE.replace('/api', '');
  return base.replace(/^http/, 'ws') + path;
};
