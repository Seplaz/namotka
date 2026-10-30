import styles from './TaskPriority.module.css';
import { ArrowDown, Minus, ArrowUp } from 'lucide-react';
import type { TaskPriority as TaskPriorityValue } from '@/types/task';

type TaskPriorityProps = {
  priority: TaskPriorityValue;
};

const priorityConfig = {
  low: {
    label: 'Низкий',
    className: styles.low,
    Icon: ArrowDown,
  },
  medium: {
    label: 'Средний',
    className: styles.medium,
    Icon: Minus,
  },
  high: {
    label: 'Высокий',
    className: styles.high,
    Icon: ArrowUp,
  },
} satisfies Record<
  TaskPriorityValue,
  {
    label: string;
    className: string;
    Icon: typeof ArrowDown;
  }
>;

export function TaskPriority({ priority }: TaskPriorityProps) {
  const { label, className, Icon } = priorityConfig[priority];

  return (
    <span className={`${styles.priority} ${className}`}>
      <Icon size={16} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
