import styles from '@/components/Archive/Archive.module.css';
import { useState } from 'react';
import type { Task } from '@/types/task';
import type { Comment } from '@/types/comment';
import { TaskColumn } from '@/components/TaskColumn/TaskColumn';
import { Input } from '@/components/Input/Input';

type ArchiveProps = {
  tasks: Task[];
  commentsByTask: Record<string, Comment[]>;
};

export function Archive({ tasks, commentsByTask }: ArchiveProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    if (!normalizedQuery) return true;

    const searchableFields = [
      task.task_number,
      task.description,
      task.inn,
      task.phone,
      task.creatorName,
      task.assigneeName,
    ];

    return searchableFields.some((field) =>
      String(field ?? '')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  });

  function handleToggleTask(taskId: string) {
    setExpandedTaskId((currentId) => (currentId === taskId ? null : taskId));
  }

  return (
    <main className={styles.archive}>
      <div className={styles.header}>
        <Input
          className={styles.search}
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Поиск по архиву"
        />
      </div>

      <TaskColumn
        title="Завершённые"
        tasks={filteredTasks}
        emptyMessage={
          normalizedQuery
            ? 'По вашему запросу ничего не найдено.'
            : 'Завершённых намоток пока нет.'
        }
        expandedTaskId={expandedTaskId}
        onToggleTask={handleToggleTask}
        commentsByTask={commentsByTask}
      />
    </main>
  );
}
