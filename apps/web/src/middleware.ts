import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths
const PROTECTED_PATHS = ['/talent'];
const AUTH_PATHS = ['/sign-in', '/register'];
const PUBLIC_PATHS = ['/', '/about'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Get session cookie
  const sessionCookie = request.cookies.get('session');

  // Check if user is authenticated
  const isAuthenticated = sessionCookie?.value && sessionCookie.value.length > 0;

  // Always allow access to public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Handle auth paths (sign-in, register)
  if (AUTH_PATHS.includes(pathname)) {
    // Clear any existing session when accessing auth pages
    if (isAuthenticated) {
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.delete('session');
      response.cookies.delete('registration_complete');
      return response;
    }
    return NextResponse.next();
  }

  // Handle protected paths (dashboard, etc.)
  if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }

  // Default: allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 