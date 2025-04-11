import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Define paths
const PROTECTED_PATHS = ['/talent'];
const AUTH_PATHS = ['/sign-in', '/sign-up'];
const PUBLIC_PATHS = ['/', '/about'];
const REGISTRATION_PATH = '/register';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const pathname = request.nextUrl.pathname;

  // Check if user is authenticated
  const isAuthenticated = !!(sessionCookie?.value && sessionCookie.value.length > 0);

  // Check if user has completed registration
  const registrationComplete = request.cookies.get('registration_complete');
  const isRegistrationComplete = !!(registrationComplete?.value && registrationComplete.value === 'true');

  // Always allow access to public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Handle auth paths (sign-in, sign-up)
  if (AUTH_PATHS.includes(pathname)) {
    // If user is authenticated, check registration status
    if (isAuthenticated) {
      // If registration is not complete, redirect to registration
      if (!isRegistrationComplete) {
        return NextResponse.redirect(new URL('/register', request.url));
      }
      // If fully registered, redirect to dashboard
      return NextResponse.redirect(new URL('/talent', request.url));
    }
    // Not authenticated, allow access to auth pages
    return NextResponse.next();
  }

  // Handle registration path
  if (pathname === REGISTRATION_PATH || pathname.startsWith('/register/')) {
    // Must be authenticated to access registration
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    // If registration is already complete, redirect to dashboard
    if (isRegistrationComplete) {
      return NextResponse.redirect(new URL('/talent', request.url));
    }
    // Allow access to registration flow
    return NextResponse.next();
  }

  // Handle protected paths (dashboard, etc.)
  if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    // Must be authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    // Must have completed registration
    if (!isRegistrationComplete) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
    // Allow access to protected path
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