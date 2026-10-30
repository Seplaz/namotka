import styles from '@/components/ToastProvider/ToastProvider.module.css';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Toast } from '@/components/Toast/Toast';
import { ToastContext, type ToastOptions } from '@/contexts/ToastContext';

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 5000;

type ToastItem = ToastOptions & {
  id: number;
  timerKey: number;
};

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  const showToast = useCallback((options: ToastOptions) => {
    const id = ++nextId.current;

    setToasts((current) => {
      const existingIndex = current.findIndex(
        (toast) =>
          toast.type === options.type && toast.message === options.message,
      );

      if (existingIndex !== -1) {
        const updated = [...current];
        const existing = updated[existingIndex];

        updated[existingIndex] = {
          ...existing,
          ...options,
          id: existing.id,
          timerKey: id,
        };

        return updated;
      }

      const newToast: ToastItem = {
        ...options,
        id,
        timerKey: id,
      };

      return [...current, newToast].slice(-MAX_TOASTS);
    });
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toastVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -24,
    },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className={styles.container}>
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                opacity: {
                  duration: shouldReduceMotion ? 0 : 0.2,
                  ease: 'easeOut',
                },
                y: {
                  duration: shouldReduceMotion ? 0 : 0.25,
                  ease: 'easeInOut',
                },
              }}
            >
              <ToastWithTimer
                toast={toast}
                onClose={() => dismissToast(toast.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

type ToastWithTimerProps = {
  toast: ToastItem;
  onClose: () => void;
};

function ToastWithTimer({ toast, onClose }: ToastWithTimerProps) {
  const duration = toast.duration ?? DEFAULT_DURATION;

  useEffect(() => {
    if (duration <= 0) return;

    const timerId = setTimeout(onClose, duration);

    return () => clearTimeout(timerId);
  }, [duration, toast.timerKey, onClose]);

  return <Toast type={toast.type} message={toast.message} />;
}
