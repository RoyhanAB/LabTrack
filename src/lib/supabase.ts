import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseConfig) {
  console.warn("⚠️ Missing Supabase credentials in .env.local - Running in demo mode");
}

export const supabase = createClient(
  hasSupabaseConfig ? supabaseUrl : 'https://example.supabase.co',
  hasSupabaseConfig ? supabaseAnonKey : 'demo-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Test connection
if (typeof window !== 'undefined' && hasSupabaseConfig) {
  supabase.from('users').select('count', { count: 'exact', head: true })
    .then(({ error }) => {
      if (error) {
        console.error('❌ Supabase connection error:', error.message);
        console.log('💡 Tip: Check if database schema is set up correctly');
      } else {
        console.log('✅ Supabase connected successfully');
      }
    });
}
