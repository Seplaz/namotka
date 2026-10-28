import styles from '@/components/Select/Select.module.css';
import { ChevronDown } from 'lucide-react';

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type SelectProps<T extends string = string> = {
  name: string;
  value: T | '';
  options: SelectOption<T>[];
  onChange: (value: T | '') => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  className?: string;
};

export function Select<T extends string = string>({
  name,
  value,
  options,
  onChange,
  placeholder = 'Кого намотать?',
  disabled = false,
  error,
  id,
  className,
}: SelectProps<T>) {
  const selectId = id ?? name;
  const errorId = `${selectId}-error`;

  const rootClassName = [
    styles.root,
    error && styles.hasError,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      <div className={styles.control}>
        <select
          id={selectId}
          name={name}
          value={value}
          disabled={disabled}
          className={styles.select}
          onChange={(event) => {
            onChange(event.target.value as T | '');
          }}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.chevron} size={20} aria-hidden="true" />
      </div>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
