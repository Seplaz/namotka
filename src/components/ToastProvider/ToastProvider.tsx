import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { Toast } from '@/components/Toast/Toast';
import {
  ToastContext,
  type ToastOptions,
  // type ToastType,
} from '@/contexts/ToastContext';

import styles from '@/components/ToastProvider/ToastProvider.module.css';

type ToastItem = ToastOptions & {
  id: number;
};

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((options: ToastOptions) => {
    const id = ++nextId.current;

    setToasts((current) => [...current, { ...options, id }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className={styles.container}>
        {toasts.map((toast) => (
          <ToastWithTimer
            key={toast.id}
            toast={toast}
            onClose={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

type ToastWithTimerProps = {
  toast: ToastItem;
  onClose: () => void;
};

function ToastWithTimer({ toast, onClose }: ToastWithTimerProps) {
  const { duration = 3000 } = toast;

  useEffect(() => {
    if (duration <= 0) return;

    const timerId = setTimeout(onClose, duration);

    return () => clearTimeout(timerId);
  }, [duration, onClose]);

  return <Toast type={toast.type} message={toast.message} onClose={onClose} />;
}
