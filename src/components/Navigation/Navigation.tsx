import styles from '@/components/Navigation/Navigation.module.css';
import { Link } from '@/components/Link/Link';

type NavigationProps = {
  username: string;
  onLogout: () => void;
};

export function Navigation({ username, onLogout }: NavigationProps) {
  return (
    <nav className={styles.navigation}>
      <span className={styles.username}>{username}</span>

      <Link className={styles.link} href="/dashboard">
        Намотки
      </Link>

      <Link className={styles.link} href="/dashboard">
        История
      </Link>

      <button className={styles.logout} type="button" onClick={onLogout}>
        Выйти
      </button>
    </nav>
  );
}
