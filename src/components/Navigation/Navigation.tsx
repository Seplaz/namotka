import styles from '@/components/Navigation/Navigation.module.css';
import { Link } from '@/components/Link/Link';
import { LogOut } from 'lucide-react';

type NavigationProps = {
  username: string;
  onLogout: () => void;
};

export function Navigation({ username, onLogout }: NavigationProps) {
  return (
    <nav className={styles.navigation}>
      <div className={styles.pages}>
        <Link className={styles.link} to="/dashboard">
          Намотки
        </Link>

        <Link className={styles.link} to="/archive">
          Архив
        </Link>
      </div>

      <div className={styles.account}>
        <span className={styles.username}>{username}</span>
        <button className={styles.logout} type="button" onClick={onLogout}>
          <LogOut size={16} />
          Выйти
        </button>
      </div>
    </nav>
  );
}
