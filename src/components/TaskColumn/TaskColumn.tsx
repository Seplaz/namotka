import styles from '@/components/TaskColumn/TaskColumn.module.css';
import { Title } from '../Title/Title';

type TaskColumnProps = {
  title: string;
  children: React.ReactNode;
};

export function TaskColumn({ title, children }: TaskColumnProps) {
  return (
    <section className={styles.column}>
      <Title>{title}</Title>
      <div>{children}</div>
    </section>
  );
}
