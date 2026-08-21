import { Metadata } from 'next';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import App from './Notes.client';
import type { NoteTag } from '@/types/note';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];
  return {
    title: `Notes - ${tag} `,
    description: `Browse notes tagged with all tags.`,
    openGraph: {
      title: `Notes - ${tag} Tags `,
      description: `Browse notes tagged with all tags.`,
      url: `https://notehub.com/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes - ${tag} Tags | NoteHub`,
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: PageProps) {
  const { slug } = await params;

  const tag = slug[0] as NoteTag | 'all';
  console.log('SLUG:', slug);
  console.log('TAG:', tag);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({ page: 1, search: '', perPage: 12, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <App tag={tag} />
    </HydrationBoundary>
  );
}
