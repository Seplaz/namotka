import styles from './PageState.module.css';
import type { ReactNode } from 'react';
import { Button } from '@/components/Button/Button';

type PageStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  variant?: 'default' | 'warning' | 'danger';
};

export function PageState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}: PageStateProps) {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={`${styles.icon} ${styles[variant]}`}>{icon}</div>

        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description} role="alert">
          {description}
        </p>

        <Button onClick={onAction}>{actionLabel}</Button>
      </div>
    </main>
  );
}
