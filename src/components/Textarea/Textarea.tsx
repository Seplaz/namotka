import styles from '@/components/Textarea/Textarea.module.css';
import type { TextareaHTMLAttributes } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea className={`${styles.textarea} ${className ?? ''}`} {...props} />
  );
}
