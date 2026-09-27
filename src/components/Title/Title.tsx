import styles from '@/components/Title/Title.module.css';

type TitleProps = {
  children: string;
  className?: string;
};

export function Title({ children, className }: TitleProps) {
  return <h1 className={`${styles.title} ${className ?? ''}`}>{children}</h1>;
}
