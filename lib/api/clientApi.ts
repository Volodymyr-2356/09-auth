import type { Note, NoteTag } from '@/types/note';
import { nextServer } from './api';

import axios from 'axios';

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

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

interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});

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
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
}

// Cоздание заметки
export async function createNote(noteData: CreateNoteData): Promise<Note> {
  const response = await nextServer.post<Note>('/notes', noteData, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data;
}

// Удаление заметки по ІД

export async function deleteNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
}

interface RegisterData {
  email: string;
  password: string;
}

export async function register(data: RegisterData) {
  const res = await nextServer.post('/auth/register', data);
  return res.data;
}

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const res = await nextServer.post('/auth/login', data);
  return res.data;
}

export async function checkSession() {
  const res = await nextServer.get('/auth/session');
  return res.data;
}

export async function getMe() {
  const res = await nextServer.get('/users/me');
  return res.data;
}

export async function logout() {
  const res = await nextServer.post('/auth/logout');
  return res.data;
}

interface UpdateProfileData {
  username: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const res = await nextServer.patch('/users/me', data);
  return res.data;
}
