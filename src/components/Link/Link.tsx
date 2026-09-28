import styles from '@/components/Link/Link.module.css';
import type { AnchorHTMLAttributes } from 'react';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link({ className, ...props }: LinkProps) {
  return <a className={`${styles.link} ${className ?? ''}`} {...props} />;
}
