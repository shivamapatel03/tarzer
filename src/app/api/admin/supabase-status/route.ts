import { NextResponse } from 'next/server';
import { testSupabaseConnection } from '@/lib/supabase';

export async function GET() {
  const result = await testSupabaseConnection();
  return NextResponse.json({
    ...result,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dmnfohvegrwfbntogxcc.supabase.co',
    configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  });
}
