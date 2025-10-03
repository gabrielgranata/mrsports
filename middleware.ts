import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_USER = process.env.ADMIN_USER ?? 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS ?? 'change-me';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  if (!isAdminPath) return NextResponse.next();

  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    return new NextResponse('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
    });
  }
  const base64 = auth.split(' ')[1] ?? '';
  // atob is available in the edge runtime
  const decoded = atob(base64);
  const [user, pass] = decoded.split(':');

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    return NextResponse.next();
  }
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
