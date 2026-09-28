import styles from '@/components/FormField/FormField.module.css';
import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
