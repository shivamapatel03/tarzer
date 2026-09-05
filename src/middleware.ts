import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const rawHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const hostname = rawHost.toLowerCase();
  const pathname = url.pathname;

  // 1. Skip static assets, API endpoints, and media files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/music') ||
    pathname.startsWith('/logos') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Check if request is targeted at the admin subdomain
  // Matches: admin.tarzer.shop, admin.localhost, etc.
  const isAdminSubdomain =
    hostname.startsWith('admin.') ||
    hostname.startsWith('admin-');

  // Check authentication session cookie
  const sessionCookie = req.cookies.get('tarzer_admin_session');
  const isAuthenticated = Boolean(sessionCookie && sessionCookie.value);

  // === ADMIN SUBDOMAIN (admin.tarzer.shop) ===
  if (isAdminSubdomain) {
    const isLoginPath = pathname === '/admin/login' || pathname === '/login';

    // If not authenticated, must go to login
    if (!isAuthenticated) {
      if (!isLoginPath) {
        const loginRedirect = new URL('/admin/login', req.url);
        return NextResponse.redirect(loginRedirect);
      }
      // If user navigated to /login, rewrite to /admin/login
      if (pathname === '/login') {
        url.pathname = '/admin/login';
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }

    // If authenticated and visiting login, go to root dashboard
    if (isLoginPath) {
      const homeRedirect = new URL('/', req.url);
      return NextResponse.redirect(homeRedirect);
    }

    // Rewrite admin.tarzer.shop/ -> /admin
    // admin.tarzer.shop/products -> /admin/products
    if (!pathname.startsWith('/admin')) {
      url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  }

  // === MAIN DOMAIN (tarzer.shop / tarzer.vercel.app) ===
  if (pathname.startsWith('/admin')) {
    const isLoginPath = pathname === '/admin/login';

    if (!isAuthenticated && !isLoginPath) {
      const loginRedirect = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginRedirect);
    }

    if (isAuthenticated && isLoginPath) {
      const dashboardRedirect = new URL('/admin', req.url);
      return NextResponse.redirect(dashboardRedirect);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
