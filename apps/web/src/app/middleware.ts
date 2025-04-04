import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/register',
];

// Paths that should not be accessible when authenticated
const AUTH_PATHS = [
  '/sign-in',
  '/sign-up',
];

// Paths that are always accessible
const PUBLIC_PATHS = [
  '/',
  '/about',
  '/contact',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the session cookie
  const session = request.cookies.get('session')?.value;
  const isAuthenticated = !!session;

  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  const isAuthPath = AUTH_PATHS.some(path => pathname.startsWith(path));
  
  // Handle registration flow
  if (pathname.startsWith('/register')) {
    // If not authenticated, redirect to sign-in
    if (!isAuthenticated) {
      const url = new URL('/sign-in', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
    // If authenticated but no user type selected, redirect to type selection
    if (pathname === '/register') {
      return NextResponse.redirect(new URL('/register/type', request.url));
    }
    
    // Allow access to registration steps
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to sign-in from protected pages
  if (!isAuthenticated && isProtectedPath) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /static/ (public files)
     * 4. /*.extension (files with extensions)
     */
    '/((?!api|_next|static|.*\\..*).*)',
  ],
}; 