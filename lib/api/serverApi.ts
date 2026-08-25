import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';

import { nextServer } from './api';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

interface CheckSessionResponse {
  success: boolean;
}

export async function checkSession(): Promise<
  AxiosResponse<CheckSessionResponse>
> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  return nextServer.get<CheckSessionResponse>('/auth/session', {
    headers: {
      Cookie: cookieHeader,
    },
  });
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  const response = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`/notes/${id}`);

  return response.data;
}

interface FetchNotesParams {
  page: number;
  search?: string;
  perPage: number;
  tag?: NoteTag | 'all';
  sortBy?: 'created' | 'updated';
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes({
  page,
  search,
  perPage,
  tag,
  sortBy,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const params: {
    page: number;
    search?: string;
    perPage: number;
    tag?: NoteTag;
    sortBy?: 'created' | 'updated';
  } = {
    page,
    search,
    perPage,
    sortBy,
  };

  if (tag && tag !== 'all') {
    params.tag = tag;
  }

  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params,
  });

  return response.data;
}
