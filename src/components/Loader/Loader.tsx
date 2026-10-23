import styles from '@/components/Loader/Loader.module.css';
import { LoaderCircle } from 'lucide-react';

export function Loader() {
  return (
    <div className={styles.loader} role="status" aria-label="Загрузка">
      <LoaderCircle size={64} aria-hidden="true" />
    </div>
  );
}
