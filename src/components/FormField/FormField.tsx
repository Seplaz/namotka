import styles from '@/components/FormField/FormField.module.css';
import { AnimatedError } from '@/components/AnimatedError/AnimatedError';
import type { ReactNode } from 'react';

type FormFieldProps = {
  label?: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  const errorId = `${htmlFor}-error`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      <AnimatedError id={errorId} message={error ?? ''} />
    </div>
  );
}
