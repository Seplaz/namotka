
import styles from '@/components/Textarea/Textarea.module.css';
import { useId, type TextareaHTMLAttributes } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  showCounter?: boolean;
};

export function Textarea({
  className,
  showCounter = false,
  maxLength,
  value,
  defaultValue,
  onChange,
  id,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  const currentLength =
    value !== undefined
      ? String(value).length
      : String(defaultValue ?? '').length;

  return (
    <div className={styles.wrapper}>
      <textarea
        {...props}
        id={textareaId}
        className={`${styles.textarea} ${showCounter ? styles.withCounter : ''} ${className ?? ''}`}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        aria-describedby={
          showCounter
            ? `${props['aria-describedby'] ?? ''} ${textareaId}-counter`.trim()
            : props['aria-describedby']
        }
      />

      {showCounter && maxLength !== undefined && (
        <span
          id={`${textareaId}-counter`}
          className={styles.counter}
          aria-live="polite"
        >
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
  );
}
