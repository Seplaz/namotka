import styles from '@/components/Select/Select.module.css';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
      <ShadcnSelect
        name={name}
        value={value || undefined}
        onValueChange={(nextValue) => onChange(nextValue as T)}
        disabled={disabled}
      >
        <SelectTrigger
          id={selectId}
          className={styles.trigger}
          aria-invalid={Boolean(error)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className={styles.content}>
          <SelectItem className={styles.item}>{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={styles.item}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
