import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase Config:', {
    url: supabaseUrl ? '✓ Loaded' : '✗ Missing',
    key: supabaseAnonKey ? '✓ Loaded' : '✗ Missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials missing!');
    console.error('URL:', supabaseUrl);
    console.error('Key:', supabaseAnonKey ? 'Present' : 'Missing');
}

export const supabase: SupabaseClient = createClient(supabaseUrl || '', supabaseAnonKey || '')
