import styles from '@/components/TaskColumn/TaskColumn.module.css';
import type { Task } from '@/types/task';
import { TaskCard } from '@/components/TaskCard/TaskCard';

type TaskColumnProps = {
  title: string;
  tasks: Task[];
  emptyImage?: string;
  emptyMessage?: string;
  onStartTask: (taskId: string) => Promise<void>;
  onReturnTask: (taskId: string) => Promise<void>;
};

export function TaskColumn({
  title,
  tasks,
  emptyImage,
  emptyMessage,
  onStartTask,
  onReturnTask,
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
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onStartTask={onStartTask}
              onReturnTask={onReturnTask}
            />
          ))
        )}
      </div>
    </section>
  );
}
