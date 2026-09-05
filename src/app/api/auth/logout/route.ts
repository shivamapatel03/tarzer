import { NextResponse } from 'next/server';
import { logoutAdmin, isAdminAuthenticated } from '@/lib/auth';

export async function POST() {
  await logoutAdmin();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated, user: authenticated ? { email: 'admin@tarzer.in', role: 'ADMIN' } : null });
}
