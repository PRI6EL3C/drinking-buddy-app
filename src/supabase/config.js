import { createClient } from '@supabase/supabase-js';

// Supabase configuration - works on both local and Netlify
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://fyhkozglaisistmcwypr.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_UOByXo8GIcxERAbhEkvSIg_PefRcaWy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project-id.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key-here';
};
