import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Missing Supabase credentials in .env.local - Running in demo mode");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Test connection
if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
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
