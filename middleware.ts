import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get the session token from cookies
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;

  // If no session token, redirect to login
  if (!sessionToken) {
    // Allow access to auth pages
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      return NextResponse.next();
    }
    
    // Redirect to login for protected routes
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Get user role from custom cookie (set after login)
  const userRole = request.cookies.get('user-role')?.value;

  // Role-based redirects
  if (userRole === 'ADMIN') {
    // Admin trying to access student/tutor routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/tutor')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  } else if (userRole === 'TUTOR') {
    // Tutor trying to access student/admin routes
    if (pathname.startsWith('/dashboard') && !pathname.startsWith('/tutor')) {
      return NextResponse.redirect(new URL('/tutor/dashboard', request.url));
    }
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/tutor/dashboard', request.url));
    }
  } else if (userRole === 'STUDENT') {
    // Student trying to access tutor/admin routes
    if (pathname.startsWith('/tutor')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If user is authenticated and trying to access login/register, redirect to dashboard
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (userRole === 'TUTOR') {
      return NextResponse.redirect(new URL('/tutor/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tutor/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};