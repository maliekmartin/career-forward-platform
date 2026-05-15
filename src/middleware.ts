import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block all /coach/* routes (B2B side not available yet - launching Q2 2027)
  if (pathname.startsWith('/coach')) {
    return NextResponse.redirect(new URL('/register/coach', request.url));
  }

  // Block /pricing page (B2B only - redirect to coach coming soon)
  if (pathname === '/pricing') {
    return NextResponse.redirect(new URL('/register/coach', request.url));
  }

  return NextResponse.next();
}

// Configure which routes middleware should run on
export const config = {
  matcher: [
    '/coach/:path*',
    '/pricing',
  ],
};
