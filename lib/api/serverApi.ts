import { nextServer } from './api';
import { cookies } from 'next/headers';

export async function checkSession(cookies: string) {
  const res = await nextServer.get('/auth/session', {
    headers: {
      Cookie: cookies,
    },
  });
  return res.data;
}

export async function getMe(cookies: string) {
  const response = await nextServer.get('/users/me', {
    headers: {
      Cookie: cookies,
    },
  });

  return response.data;
}
