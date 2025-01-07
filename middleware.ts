import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user');
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next();
  }

  // Protected routes
  if (pathname.startsWith('/parent/') || pathname.startsWith('/teacher/')) {
    if (!user?.value) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const userData = JSON.parse(user.value);
      const isParentRoute = pathname.startsWith('/parent/');
      const isTeacherRoute = pathname.startsWith('/teacher/');

      if ((isParentRoute && userData?.role !== 'parent') || 
          (isTeacherRoute && userData?.role !== 'teacher')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};