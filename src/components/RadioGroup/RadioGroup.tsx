import styles from '@/components/RadioGroup/RadioGroup.module.css';
import type { LucideIcon } from 'lucide-react';

export type RadioOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
};

type RadioGroupProps<T extends string = string> = {
  name: string;
  value: T;
  options: RadioOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
};

export function RadioGroup<T extends string = string>({
  name,
  value,
  options,
  onChange,
  disabled = false,
  className,
}: RadioGroupProps<T>) {
  return (
    <div
      className={`${styles.group} ${className ?? ''}`}
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || Boolean(option.disabled);
        const Icon = option.icon;

        return (
          <label
            key={option.value}
            className={[
              styles.option,
              isSelected ? styles.selected : '',
              isDisabled ? styles.disabled : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <input
              className={styles.input}
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              disabled={isDisabled}
              onChange={() => onChange(option.value)}
            />

            {Icon && (
              <Icon className={styles.icon} size={18} aria-hidden="true" />
            )}

            <span className={styles.label}>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
