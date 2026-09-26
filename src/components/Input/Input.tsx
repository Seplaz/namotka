import styles from '@/components/Input/Input.module.css';
import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <input className={`${styles.input} ${className ?? ''}`} {...props} />;
}
