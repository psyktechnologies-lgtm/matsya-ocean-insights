import axios from 'axios';
import { useSupabase, getSupabaseClient } from './supabaseClient';
import type { Species, EDNASample, DNASequence, Analysis, SpeciesSearchResult, OBISResponse, ClassificationResult } from '../types/database';

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

// ===== SPECIES API =====

export const fetchSpecies = async (params?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Species[]> => {
  // Local-first: if SUPABASE is enabled via env, use the lightweight supabaseClient helper
  try {
    const supClient = getSupabaseClient();
    if (supClient && (import.meta.env.VITE_USE_SUPABASE === 'true')) {
      let query = supClient.from('species').select('*');
      
      if (params?.search) {
        query = query.or(`scientific_name.ilike.%${params.search}%,common_name.ilike.%${params.search}%`);
      }
      
      if (params?.limit) {
        query = query.limit(params.limit);
      }
      
      if (params?.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    }
  } catch (e) {
    console.warn('Supabase fallback to local API:', e);
  }
  
  // Fallback to local API
  const resp = await api.get('/species', { params });
  return (resp.data as Species[]) ?? [];
};

export const getSpeciesById = async (id: string): Promise<Species | null> => {
  try {
    const supClient = getSupabaseClient();
    if (supClient && (import.meta.env.VITE_USE_SUPABASE === 'true')) {
      const { data, error } = await supClient
        .from('species')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    }
  } catch (e) {
    console.warn('Supabase fallback to local API:', e);
  }
  
  const resp = await api.get(`/species/${id}`);
  return resp.data as Species;
};

// ===== OBIS API INTEGRATION =====

export const fetchOBISData = async (scientificName: string): Promise<OBISResponse> => {
  try {
    const response = await axios.get('https://api.obis.org/occurrence', {
      params: {
        scientificname: scientificName,
        size: 100,
        fields: 'scientificName,family,genus,specificEpithet,decimalLatitude,decimalLongitude,depth,eventDate,basisOfRecord'
      }
    });
    
    return {
      results: (response.data as any).results || [],
      total: (response.data as any).total || 0
    };
  } catch (error) {
    console.error('OBIS API error:', error);
    return { results: [], total: 0 };
  }
};

export const obisSync = async (): Promise<{ message: string; count: number }> => {
  try {
    const supClient = getSupabaseClient();
    if (supClient && (import.meta.env.VITE_USE_SUPABASE === 'true')) {
      // Get popular species to sync from OBIS
      const popularSpecies = [
        'Thunnus albacares',
        'Epinephelus marginatus', 
        'Serranus scriba',
        'Hippocampus hippocampus',
        'Scyliorhinus canicula'
      ];
      
      let totalSynced = 0;
      
      for (const speciesName of popularSpecies) {
        const obisData = await fetchOBISData(speciesName);
        
        if (obisData.results.length > 0) {
          const result = obisData.results[0];
          
          // Check if species already exists
          const { data: existing } = await supClient
            .from('species')
            .select('id')
            .eq('scientific_name', result.scientificName)
            .single();
          
          if (!existing) {
            // Insert new species from OBIS data
            const { error } = await supClient.from('species').insert({
              scientific_name: result.scientificName,
              family: result.family,
              genus: result.genus,
              species_name: result.specificEpithet,
              latitude: result.decimalLatitude,
              longitude: result.decimalLongitude,
              habitat: `Depth: ${result.depth}m` || 'Marine environment',
              description: `Data from OBIS - ${result.basisOfRecord}`
            });
            
            if (!error) totalSynced++;
          }
        }
      }
      
      return { message: 'OBIS sync completed', count: totalSynced };
    }
  } catch (e) {
    console.warn('OBIS sync fallback to local API:', e);
  }
  
  // Trigger sync on local backend
  const resp = await api.post('/obis/sync');
  return resp.data as { message: string; count: number };
};

// ===== eDNA SAMPLES API =====

export const fetchEDNASamples = async (params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<EDNASample[]> => {
  try {
    const supClient = getSupabaseClient();
    if (supClient && (import.meta.env.VITE_USE_SUPABASE === 'true')) {
      let query = supClient.from('edna_samples').select('*');
      
      if (params?.status) {
        query = query.eq('status', params.status);
      }
      
      if (params?.limit) {
        query = query.limit(params.limit);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    }
  } catch (e) {
    console.warn('Supabase fallback to local API:', e);
  }
  
  const resp = await api.get('/edna-samples', { params });
  return resp.data as EDNASample[] ?? [];
};

export const uploadEDNASample = async (file: File, metadata: {
  sample_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  collection_date: string;
  depth_meters?: number;
  notes?: string;
}): Promise<EDNASample> => {
  try {
    const supClient = getSupabaseClient();
    if (supClient && (import.meta.env.VITE_USE_SUPABASE === 'true')) {
      // Upload file to Supabase Storage
      const fileName = `${metadata.sample_id}_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supClient.storage
        .from('edna-files')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Create database record
      const { data, error } = await supClient.from('edna_samples').insert({
        ...metadata,
        file_path: uploadData.path,
        file_size: file.size,
        file_type: file.type,
        status: 'uploaded'
      }).select().single();
      
      if (error) throw error;
      return data;
    }
  } catch (e) {
    console.warn('Supabase fallback to local API:', e);
  }
  
  // Fallback to local API
  const form = new FormData();
  form.append('file', file);
  Object.entries(metadata).forEach(([key, value]) => {
    form.append(key, value.toString());
  });
  
  const resp = await api.post('/edna-samples', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resp.data as EDNASample;
};

// ===== CLASSIFICATION API =====

export const classifyImage = async (file: File): Promise<ClassificationResult> => {
  const form = new FormData();
  form.append('file', file);
  const resp = await api.post('/classify', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resp.data as ClassificationResult;
};

// ===== ANALYSIS API =====

export const createAnalysis = async (analysis: {
  name: string;
  type: string;
  description?: string;
  parameters?: any;
}): Promise<Analysis> => {
  try {
    const supClient = getSupabaseClient();
    if (supClient && (import.meta.env.VITE_USE_SUPABASE === 'true')) {
      const { data, error } = await supClient.from('analyses').insert({
        ...analysis,
        status: 'pending',
        progress: 0
      }).select().single();
      
      if (error) throw error;
      return data;
    }
  } catch (e) {
    console.warn('Supabase fallback to local API:', e);
  }
  
  const resp = await api.post('/analyses', analysis);
  return resp.data as Analysis;
};

export const getAnalyses = async (): Promise<Analysis[]> => {
  try {
    const supClient = getSupabaseClient();
    if (supClient && (import.meta.env.VITE_USE_SUPABASE === 'true')) {
      const { data, error } = await supClient
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data ?? [];
    }
  } catch (e) {
    console.warn('Supabase fallback to local API:', e);
  }
  
  const resp = await api.get('/analyses');
  return resp.data as Analysis[] ?? [];
};

// ===== WEBSOCKET =====

export const wsUrl = (path = '/ws/updates') => {
  const base = API_BASE.replace('/api', '');
  return base.replace(/^http/, 'ws') + path;
};
