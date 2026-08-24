'use client';
import Link from 'next/link';
import css from './NotesPage.module.css';
import NoteList from '@/components/NoteList/NoteList';
import { fetchNotes } from '@/lib/api';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
// import Modal from '@/components/Modal/Modal';
// import NoteForm from '@/components/NoteForm/NoteForm';
import type { NoteTag } from '@/types/note';

interface NotesClientProps {
  tag: NoteTag | 'all';
}
import { useDebouncedCallback } from 'use-debounce';

export default function App({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  //пошук реалізовуємо

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', page, search, tag],
    queryFn: () => fetchNotes({ page, search, perPage: 12, tag }),
    placeholderData: previousValues => previousValues,
  });
  console.log(data);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch}></SearchBox>
        {isLoading && <p>Loading...</p>}

        {error && <p>Error</p>}
        <Link className={css.button} href="/notes/action/create">
          Create Note +
        </Link>
        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}

        {/* {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onClose={() => setIsModalOpen(false)}></NoteForm>
          </Modal>
        )} */}
      </header>

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {data && data.notes.length === 0 && <p>Notes not Found</p>}
    </div>
  );
}
