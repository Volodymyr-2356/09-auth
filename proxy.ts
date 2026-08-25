import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = false;
  let setCookies: string[] = [];

  // Если есть хотя бы один токен,
  // проверяем/восстанавливаем сессию
  if (accessToken || refreshToken) {
    try {
      const session = await checkSession();

      isAuthenticated = session.data.success;

      setCookies = session.headers['set-cookie'] ?? [];
    } catch {
      isAuthenticated = false;
    }
  }

  // Неавторизованный пользователь пытается открыть приватный маршрут
  if (isPrivateRoute && !isAuthenticated) {
    const response = NextResponse.redirect(new URL('/sign-in', request.url));

    for (const cookie of setCookies) {
      response.headers.append('set-cookie', cookie);
    }

    return response;
  }

  // Авторизованный пользователь пытается открыть публичный маршрут
  if (isPublicRoute && isAuthenticated) {
    const response = NextResponse.redirect(new URL('/', request.url));

    for (const cookie of setCookies) {
      response.headers.append('set-cookie', cookie);
    }

    return response;
  }
  const response = NextResponse.next();

  // Передаём новые cookies от API браузеру
  for (const cookie of setCookies) {
    response.headers.append('set-cookie', cookie);
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
