import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected paths
const protectedPaths = ['/dashboard', '/profile', '/settings'];
const authPaths = ['/register', '/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for api routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname === path);

  // Get the token from cookies
  const token = request.cookies.get('session')?.value;

  // Allow registration page access regardless of token
  if (pathname === '/register') {
    return NextResponse.next();
  }

  // If there's no token and trying to access protected routes
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If there's a token and trying to access auth routes
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 