import styles from '@/components/TaskColumn/TaskColumn.module.css';
import type { Task } from '@/types/task';
import { TaskCard } from '@/components/TaskCard/TaskCard';

type TaskColumnProps = {
  title: string;
  tasks: Task[];
  emptyImage?: string;
  emptyMessage?: string;
};

export function TaskColumn({
  title,
  tasks,
  emptyImage,
  emptyMessage,
}: TaskColumnProps) {
  return (
    <section className={styles.column}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.content}>
        {tasks.length === 0 ? (
          <div className={styles.empty}>
            {emptyImage && <img src={emptyImage} alt="" />}

            {emptyMessage && <p>{emptyMessage}</p>}
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} {...task} />)
        )}
      </div>
    </section>
  );
}
