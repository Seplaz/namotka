import styles from './AccessRestrictedPage.module.css';
import { ShieldAlert, LogOut } from 'lucide-react';
import { Button } from '@/components/Button/Button';

type AccessRestrictedPageProps = {
  message: string;
  onLogout: () => void;
};

export function AccessRestrictedPage({
  message,
  onLogout,
}: AccessRestrictedPageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <ShieldAlert size={24} />
        </div>

        <h1 className={styles.title}>Доступ ограничен</h1>

        <p className={styles.message} role="alert">
          {message}
        </p>

        <Button onClick={onLogout}>
          <LogOut size={16} />
          Выйти из аккаунта
        </Button>
      </div>
    </main>
  );
}
