import { createContext } from 'react';

export type ToastType = 'success' | 'warning' | 'error';

export type ToastOptions = {
  type: ToastType;
  message: string;
  duration?: number;
};

export type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
