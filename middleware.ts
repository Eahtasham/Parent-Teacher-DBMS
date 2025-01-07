import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user');
  const { pathname } = request.nextUrl;

  // Handle authentication
  try {
    if (pathname.startsWith('/parent/dashboard') || pathname.startsWith('/teacher/dashboard')) {
      if (!user?.value) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const userData = JSON.parse(user.value);
      const isParentRoute = pathname.startsWith('/parent/');
      const isTeacherRoute = pathname.startsWith('/teacher/');

      if ((isParentRoute && userData?.role !== 'parent') || 
          (isTeacherRoute && userData?.role !== 'teacher')) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // If there's any error parsing the cookie, redirect to login
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/parent/:path*', '/teacher/:path*']
};