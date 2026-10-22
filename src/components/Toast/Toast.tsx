import styles from '@/components/Toast/Toast.module.css';
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'error';

type ToastProps = {
  type: ToastType;
  message: string;
  onClose?: () => void;
  className?: string;
};

const toastIcons = {
  success: CircleCheck,
  warning: CircleAlert,
  error: CircleX,
};

export function Toast({ type, message, onClose, className }: ToastProps) {
  const Icon = toastIcons[type];

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${className ?? ''}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-atomic="true"
    >
      <Icon className={styles.icon} size={20} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
      </div>

      {onClose && (
        <button
          className={styles.close}
          type="button"
          onClick={onClose}
          aria-label="Закрыть уведомление"
        >
          <CircleX size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
