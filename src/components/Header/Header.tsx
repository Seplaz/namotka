import logo from '@/assets/logo.svg';
import styles from '@/components/Header/Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src={logo} alt="NAMOTKA" />
    </header>
  );
}
