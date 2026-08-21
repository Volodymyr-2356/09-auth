import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  return (
    <>
      <li className={css.navigationItem}>
        <a href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </a>
      </li>

      <li className={css.navigationItem}>
        <p className={css.userEmail}>User email</p>
        <button className={css.logoutButton}>Logout</button>
      </li>

      <li className={css.navigationItem}>
        <a href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </a>
      </li>

      <li className={css.navigationItem}>
        <a href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </a>
      </li>
    </>
  );
}
