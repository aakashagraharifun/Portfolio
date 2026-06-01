import { createClient } from '@supabase/supabase-js';

/**
 * Configure your Supabase project in the .env file
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables in .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
