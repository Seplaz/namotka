import styles from '@/components/TaskStatus/TaskStatus.module.css';
import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleX,
  LoaderCircle,
} from 'lucide-react';
import type { TaskStatus as TaskStatusValue } from '@/types/task';

type TaskStatusProps = {
  status: TaskStatusValue;
};

const statusConfig = {
  new: {
    label: 'Новая',
    icon: Circle,
  },
  waiting: {
    label: 'Возвращена',
    icon: CircleDashed,
  },
  in_progress: {
    label: 'В работе',
    icon: LoaderCircle,
  },
  completed: {
    label: 'Завершено',
    icon: CircleCheck,
  },
  cancelled: {
    label: 'Отменено',
    icon: CircleX,
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
