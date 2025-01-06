import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user');

  console.log('Pathname:', request.nextUrl.pathname);
  console.log('User cookie:', user);


  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/parent/dashboard') || 
      request.nextUrl.pathname.startsWith('/teacher/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // console.log(user);

    // Check correct role access
    const userData = user.value ? JSON.parse(user.value) : null;
    const isParentRoute = request.nextUrl.pathname.startsWith('/parent/');
    const isTeacherRoute = request.nextUrl.pathname.startsWith('/teacher/');

    

    if ((isParentRoute && userData?.role !== 'parent') || 
        (isTeacherRoute && userData?.role !== 'teacher')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/parent/:path*', '/teacher/:path*']
};