import styles from '@/components/Button/Button.module.css';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
};

export function Button({
  children,
  icon,
  iconPosition = 'left',
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={`${styles.button} ${className ?? ''}`} {...props}>
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
}
