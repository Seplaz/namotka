import styles from '@/components/TaskColumn/TaskColumn.module.css';

type TaskColumnProps = {
  title?: string;
  children: React.ReactNode;
};

export function TaskColumn({ title, children }: TaskColumnProps) {
  return (
    <section className={styles.column}>
      <h2 className={styles.title}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
