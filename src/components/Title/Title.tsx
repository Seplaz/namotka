import styles from '@/components/Title/Title.module.css';

type TitleProps = {
  children: string;
};

export function Title({ children }: TitleProps) {
  return <h1 className={styles.title}>{children}</h1>;
}
