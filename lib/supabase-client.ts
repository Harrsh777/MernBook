import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser usage (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted_date?: string;
  salary?: string;
  job_type?: string;
  experience_level?: string;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

export interface JobWithLike extends Job {
  is_liked?: boolean;
  liked_at?: string;
}

export interface LikedJob {
  id: string;
  user_id: string;
  job_id: string;
  liked_at: string;
}

export interface SearchJobsParams {
  search_query?: string;
  company_filter?: string;
  location_filter?: string;
  job_type_filter?: string;
  limit_count?: number;
  offset_count?: number;
}