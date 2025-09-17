// Database types for Matsya Ocean Insights

export interface Species {
  id: string;
  scientific_name: string;
  common_name?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order_name?: string;
  family?: string;
  genus?: string;
  species_name?: string;
  authority?: string;
  year_described?: number;
  conservation_status?: string;
  habitat?: string;
  distribution?: string;
  depth_range?: string;
  length_max?: number;
  weight_max?: number;
  obis_id?: string;
  gbif_id?: string;
  fishbase_id?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface EDNASample {
  id: string;
  sample_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  collection_date: string;
  depth_meters?: number;
  temperature_celsius?: number;
  salinity?: number;
  ph_level?: number;
  species_detected?: number;
  total_sequences?: number;
  sequence_count?: number;
  avg_sequence_length?: number;
  diversity_index?: number;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  processing_status?: 'pending' | 'uploaded' | 'analyzing' | 'completed' | 'failed';
  file_path?: string;
  file_url?: string;
  file_size?: number;
  file_type?: string;
  file_format?: string;
  processed_at?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DNASequence {
  id: string;
  edna_sample_id: string;
  sequence_name: string;
  sequence_data: string;
  sequence_length: number;
  gene_marker?: string;
  quality_score?: number;
  blast_results?: any;
  species_matches?: any;
  best_match_species?: string;
  best_match_confidence?: number;
  created_at: string;
}

export interface Analysis {
  id: string;
  name: string;
  type: string;
  description?: string;
  parameters?: any;
  results?: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  created_by?: string;
  created_at: string;
  completed_at?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  institution?: string;
  role: 'researcher' | 'student' | 'educator' | 'admin';
  bio?: string;
  avatar_url?: string;
  location?: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ResearchProject {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  start_date?: string;
  end_date?: string;
  location_name?: string;
  bounding_box?: any;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface SpeciesSearchResult {
  species: Species[];
  total: number;
  page: number;
  per_page: number;
}

export interface OBISResponse {
  results: Array<{
    scientificName: string;
    family?: string;
    genus?: string;
    specificEpithet?: string;
    decimalLatitude?: number;
    decimalLongitude?: number;
    depth?: number;
    eventDate?: string;
    basisOfRecord?: string;
  }>;
  total: number;
}

export interface ClassificationResult {
  species: string;
  confidence: number;
  alternatives: Array<{
    species: string;
    confidence: number;
  }>;
}

export interface BLASTResult {
  query_id: string;
  matches: Array<{
    accession: string;
    species: string;
    identity: number;
    e_value: number;
    bit_score: number;
    alignment_length: number;
  }>;
}