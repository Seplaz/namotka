import styles from '@/components/Link/Link.module.css';
import { Link as RouterLink, type LinkProps } from 'react-router-dom';

type Props = Omit<LinkProps, 'className'> & {
  className?: string;
};

export function Link({ className, ...props }: Props) {
  return (
    <RouterLink className={`${styles.link} ${className ?? ''}`} {...props} />
  );
}
