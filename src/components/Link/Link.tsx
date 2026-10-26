import styles from '@/components/Link/Link.module.css';
import { NavLink as RouterLink, type NavLinkProps } from 'react-router-dom';

type Props = Omit<NavLinkProps, 'className'> & {
  className?: string;
};

export function Link({ className, ...props }: Props) {
  return (
    <RouterLink
      className={({ isActive }) =>
        [styles.link, isActive ? styles.active : '', className ?? '']
          .filter(Boolean)
          .join(' ')
      }
      {...props}
    />
  );
}
