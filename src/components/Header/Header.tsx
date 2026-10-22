import logo from '@/assets/logo.svg';
import styles from '@/components/Header/Header.module.css';
import { Link } from '@/components/Link/Link';
import { Navigation } from '@/components/Navigation/Navigation';

type HeaderProps = {
  isAuthenticated: boolean;
  username?: string;
  onLogout: () => void;
};

export function Header({
  isAuthenticated,
  username = '',
  onLogout,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link to={isAuthenticated ? '/dashboard' : '/login'}>
        <img className={styles.logo} src={logo} alt="NAMOTKA" />
      </Link>

      {isAuthenticated && (
        <Navigation username={username} onLogout={onLogout} />
      )}
    </header>
  );
}
