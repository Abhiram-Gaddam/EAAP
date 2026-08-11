import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isAdminPage = pathname.startsWith('/admin');
  const isUserPage = pathname.startsWith('/user');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isUserApi = pathname.startsWith('/api/user');

  const isProtectedPage = isAdminPage || isUserPage;
  const isProtectedApi = isAdminApi || isUserApi;

  // Helper to bail out correctly depending on route type
  const deny = (status: number, message: string) => {
    if (isProtectedApi) {
      return NextResponse.json({ error: message }, { status });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  };

  if (!token && (isProtectedPage || isProtectedApi)) {
    return deny(401, 'Unauthorized');
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      if ((isAdminPage || isAdminApi) && role !== 'ADMIN') {
        return isAdminApi
          ? NextResponse.json({ error: 'Forbidden' }, { status: 403 })
          : NextResponse.redirect(new URL('/user/dashboard', request.url));
      }

      if (isAuthRoute) {
        if (role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/user/dashboard', request.url));
      }
    } catch (error) {
      if (isProtectedApi) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      }
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
    '/api/admin/:path*',
    '/api/user/:path*',
    '/login',
    '/register',
  ],
};