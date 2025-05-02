import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const currentPath = request.nextUrl.pathname;

  // Paths that require authentication
  const protectedPaths = ['/dashboard'];
  
  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path));

  if (isProtectedPath && !authCookie) {
    // Redirect to sign-in page with the return URL
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('redirect', currentPath);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
} 