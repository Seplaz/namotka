import logo from '@/assets/logo.svg';
import styles from '@/components/Header/Header.module.css';
import { Link } from '@/components/Link/Link';
import { Navigation } from '@/components/Navigation/Navigation';

type HeaderProps = {
  username: string;
  onLogout: () => void;
};

export function Header({ username, onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link href="/dashboard">
        <img className={styles.logo} src={logo} alt="NAMOTKA" />
      </Link>

      <Navigation username={username} onLogout={onLogout} />
    </header>
  );
}
