import { useState } from 'react';
import styles from '@/components/Archive/Archive.module.css';
import type { Task } from '@/types/task';
import { TaskColumn } from '@/components/TaskColumn/TaskColumn';

type ArchiveProps = {
  tasks: Task[];
};

export function Archive({ tasks }: ArchiveProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const completedTasks = tasks.filter((task) => task.status === 'completed');

  function handleToggleTask(taskId: string) {
    setExpandedTaskId((currentId) => (currentId === taskId ? null : taskId));
  }

  return (
    <main className={styles.archive}>
      <TaskColumn
        title="Завершённые"
        tasks={completedTasks}
        emptyMessage="Завершённых намоток пока нет."
        expandedTaskId={expandedTaskId}
        onToggleTask={handleToggleTask}
      />
    </main>
  );
}
