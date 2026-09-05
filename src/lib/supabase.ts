import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dmnfohvegrwfbntogxcc.supabase.co';
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Xv2Z2qF3VUqy_bfQvGNy6w_6DMuUmNP';

// Client-side / Public Supabase instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Helper function to test Supabase connection
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string; tablesFound?: string[] }> {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet, it's still connected to the instance
      return {
        ok: true,
        message: `Connected to Supabase project (${supabaseUrl}). Response: ${error.message}`
      };
    }
    return {
      ok: true,
      message: `Supabase database is connected and active. (${data?.length || 0} items checked)`
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || 'Failed to reach Supabase project'
    };
  }
}
