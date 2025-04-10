import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Define paths
const PROTECTED_PATHS = ['/talent'];
const AUTH_PATHS = ['/sign-in', '/sign-up', '/login'];
const PUBLIC_PATHS = ['/', '/about'];
const REGISTRATION_PATH = '/register';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const pathname = request.nextUrl.pathname;

  // Check if user is authenticated
  const isAuthenticated = !!sessionCookie;

  // Check if user has completed registration
  const registrationComplete = request.cookies.get('registration_complete');

  // Handle protected paths
  if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (!registrationComplete) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
  }

  // Handle authentication paths
  if (AUTH_PATHS.some(path => pathname === path)) {
    if (isAuthenticated && registrationComplete) {
      // Only redirect to dashboard if both authenticated and registration is complete
      return NextResponse.redirect(new URL('/talent', request.url));
    }
  }

  // Handle registration path
  if (pathname === REGISTRATION_PATH) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (registrationComplete) {
      return NextResponse.redirect(new URL('/talent', request.url));
    }
  }

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