import logo from '@/assets/logo.svg';
import styles from '@/components/Header/Header.module.css';
import { Link } from '@/components/Link/Link';
import { Navigation } from '@/components/Navigation/Navigation';

type HeaderProps = {
  isAuthenticated: boolean;
  fullName?: string;
  onLogout: () => void;
};

export function Header({
  isAuthenticated,
  fullName = '',
  onLogout,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link to={isAuthenticated ? '/dashboard' : '/login'}>
        <img className={styles.logo} src={logo} alt="NAMOTKA" />
      </Link>

      {isAuthenticated && (
        <Navigation fullName={fullName} onLogout={onLogout} />
      )}
    </header>
  );
}
