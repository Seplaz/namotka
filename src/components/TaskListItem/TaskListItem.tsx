import styles from '@/components/TaskListItem/TaskListItem.module.css';

import type { Task } from '@/types/task';

import { TaskStatus } from '@/components/TaskStatus/TaskStatus';
import { TaskPriority } from '@/components/TaskPriority/TaskPriority';
import { TaskSchedule } from '@/components/TaskSchedule/TaskSchedule';
import { MoveRight } from 'lucide-react';

type TaskListItemProps = {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string) => void;
};

export function TaskListItem({
  task,
  isSelected,
  onSelect,
}: TaskListItemProps) {
  return (
    <button
      type="button"
      className={styles.item}
      data-selected={isSelected}
      aria-pressed={isSelected}
      aria-label={`Выбрать намотку № ${task.task_number}`}
      onClick={() => onSelect(task.id)}
    >
      <span className={styles.header}>
        <span className={styles.summary}>
          <span className={styles.number}># {task.task_number}</span>
          <span className={styles.description}>{task.description}</span>
        </span>
        
        <TaskStatus status={task.status} />
      </span>

      <span className={styles.footer}>
          <span className={styles.client}>
            {task.client.name ?? 'Клиент не указан'}
          </span>

          <span className={styles.people}>
            <span className={styles.creator}>
              {task.creatorName ?? 'Неизвестно'}
            </span>
            <MoveRight size={16} />
            <span className={styles.assignee}>
              {task.assigneeName ?? 'Не назначен'}
            </span>
          </span>

          {task.scheduled_at && (
            <span className={styles.schedule}>
              <TaskSchedule scheduledAt={task.scheduled_at} />
            </span>
          )}

          <span className={styles.priority}>
            <TaskPriority priority={task.priority} />
          </span>
      </span>
    </button>
  );
}
