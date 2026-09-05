import { cookies } from 'next/headers';
import { db } from './db';

const SESSION_COOKIE_NAME = 'tarzer_admin_session';
const SESSION_SECRET = process.env.ADMIN_SECRET || 'tarzer_super_secret_jwt_key_2026';

export async function loginAdmin(email: string, pass: string): Promise<boolean> {
  const isValid = db.verifyAdminCredentials(email, pass);
  if (!isValid) return false;

  const cookieStore = await cookies();
  // Store an authenticated session value
  const sessionToken = Buffer.from(JSON.stringify({ email, role: 'ADMIN', ts: Date.now() })).toString('base64');
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });

  return true;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    if (!session || !session.value) return false;

    const decoded = JSON.parse(Buffer.from(session.value, 'base64').toString('utf-8'));
    return decoded && decoded.role === 'ADMIN';
  } catch {
    return false;
  }
}
