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

const EMPTY_VALUE = '__select_unassigned__';

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

  const internalValue = value === '' ? EMPTY_VALUE : value;

  const handleValueChange = (nextValue: string | null) => {
    onChange(
      nextValue === EMPTY_VALUE || nextValue == null ? '' : (nextValue as T),
    );
  };

  return (
    <div className={rootClassName}>
      <ShadcnSelect
        name={name}
        value={internalValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={selectId}
          className={styles.trigger}
          aria-invalid={Boolean(error)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          className={styles.content}
          align="start"
          side="bottom"
          sideOffset={-52}
          alignItemWithTrigger={false}
        >
          <SelectItem value={EMPTY_VALUE} className={styles.item}>
            {placeholder}
          </SelectItem>

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
