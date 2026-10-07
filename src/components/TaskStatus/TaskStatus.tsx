import styles from '@/components/TaskStatus/TaskStatus.module.css';
import { Circle, CircleCheck, CircleDot, LoaderCircle } from 'lucide-react';

type TaskStatusValue = 'new' | 'waiting' | 'in_progress' | 'completed';

type TaskStatusProps = {
  status: TaskStatusValue;
};

const statusConfig = {
  new: {
    label: 'Новая',
    icon: Circle,
  },
  waiting: {
    label: 'Ожидает',
    icon: CircleDot,
  },
  in_progress: {
    label: 'В работе',
    icon: LoaderCircle,
  },
  completed: {
    label: 'Завершено',
    icon: CircleCheck,
  },
} satisfies Record<TaskStatusValue, { label: string; icon: typeof Circle }>;

export function TaskStatus({ status }: TaskStatusProps) {
  const { label, icon: Icon } = statusConfig[status];

  return (
    <span className={`${styles.status} ${styles[status]}`}>
      <Icon />
      {label}
    </span>
  );
}
