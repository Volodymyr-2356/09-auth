'use client';
import { useId } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';

import css from './NoteForm.module.css';
// import * as Yup from 'yup';
import { createNote } from '@/lib/api';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

//Імпортуємо хук для зберігання чернетки

import { useNoteStore } from '@/lib/store/noteStore';

interface NoteFormProps {
  onClose?: () => void;
}

type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

// interface NoteFormValues {
//   title: string;
//   content: string;
//   tag: NoteTag;
// }

// const OrderFormSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, 'Title must be at least 3 characters')
//     .max(50, 'Title is too long')
//     .required('Title is required'),
//   content: Yup.string().max(500, 'Content is too long'),
//   tag: Yup.string()
//     .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
//     .required('Tag is required'),
// });

export default function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  // Викликаємо хук і отримуємо значення
  const { draft, setDraft, clearDraft } = useNoteStore();
  // Оголошуємо функцію для onChange щоб при зміні будь-якого
  // елемента форми оновити чернетку нотатки в сторі

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // 4. Коли користувач змінює будь-яке поле форми — оновлюємо стан
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
      // onClose();
    },
  });
  const fieldId = useId();

  const handleSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tag = formData.get('tag') as NoteTag;

    mutation.mutate({
      title,
      content,
      tag,
    });
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              router.back();
            }
          }}
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
