import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
  '/api/auth',  // Keep API auth routes public
  '/_next',     // Next.js internals
  '/images',    // Public assets
  '/fonts',     // Public assets
];

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if the path is in public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get the token from the session cookie
  const session = request.cookies.get('session');

  // If there's no session, redirect to sign in
  if (!session) {
    const signInUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (API routes)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (inside public directory)
     * 4. /images/* (inside public directory)
     * 5. /favicon.ico, /site.webmanifest (inside public directory)
     */
    '/((?!api/auth|_next|fonts|images|[\\w-]+\\.\\w+).*)',
  ],
}; 