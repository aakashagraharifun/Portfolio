import { createClient } from '@supabase/supabase-js';

/**
 * Configure your Supabase project in the .env file
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables in .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
