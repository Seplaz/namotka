import styles from '@/components/Toast/Toast.module.css';
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error';

type ToastProps = {
  type: ToastType;
  message: string;
  className?: string;
};

const toastIcons = {
  success: CircleCheck,
  warning: CircleAlert,
  error: CircleX,
};

export function Toast({ type, message, className }: ToastProps) {
  const Icon = toastIcons[type];

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${className ?? ''}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-atomic="true"
    >
      <Icon className={styles.icon} size={20} aria-hidden="true" />

      <span className={styles.message}>{message}</span>
    </div>
  );
}
