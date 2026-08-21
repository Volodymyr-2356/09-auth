import css from './LayoutNotes.module.css';

type Props = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export default function NotesLayout({ sidebar, children }: Props) {
  return (
    <>
      <section className={css.container}>
        <aside className={css.sidebar}>{sidebar}</aside>
        <div className={css.notesWrapper}>{children}</div>
      </section>
    </>
  );
}
