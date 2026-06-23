import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  // console.log("MIDDLEWARE HIT:", request.nextUrl.pathname);

  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/user');

  if (!token && (isAdminRoute || isUserRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET  );
      const { payload } = await jwtVerify(token, secret);
      
      const role = payload.role as string;

      if (isAdminRoute && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/user/dashboard', request.url));
      }

      if (isAuthRoute) {
        if (role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/user/dashboard', request.url));
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/user/:path*', 
    '/login', 
    '/register'
  ],
};