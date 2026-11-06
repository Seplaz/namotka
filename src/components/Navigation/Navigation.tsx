import styles from '@/components/Navigation/Navigation.module.css';
import { Link } from '@/components/Link/Link';
import { LogOut } from 'lucide-react';

type NavigationProps = {
  fullName: string;
  onLogout: () => void;
};

export function Navigation({ fullName, onLogout }: NavigationProps) {
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
        <span className={styles.username}>{fullName}</span>
        <button className={styles.logout} type="button" onClick={onLogout}>
          <LogOut size={16} />
          Выйти
        </button>
      </div>
    </nav>
  );
}
