import styles from '@/components/Archive/Archive.module.css';
import type { Task } from '@/types/task';
import { TaskColumn } from '@/components/TaskColumn/TaskColumn';

type ArchiveProps = {
  tasks: Task[];
};

export function Archive({ tasks }: ArchiveProps) {
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const cancelledTasks = tasks.filter((task) => task.status === 'cancelled');

  return (
    <main className={styles.archive}>
      <TaskColumn
        title="Завершённые"
        tasks={completedTasks}
        emptyMessage="Завершённых намоток пока нет"
      />

      <TaskColumn
        title="Отменённые"
        tasks={cancelledTasks}
        emptyMessage="Отменённых намоток пока нет"
      />
    </main>
  );
}
