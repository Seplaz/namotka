import styles from '@/components/TaskSchedule/TaskSchedule.module.css';
import { Clock3 } from 'lucide-react';

type TaskScheduleProps = {
  scheduledAt: string;
};

export function TaskSchedule({ scheduledAt }: TaskScheduleProps) {
  const date = new Date(scheduledAt);

  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);

  return (
    <div className={styles.schedule}>
      <Clock3 size={16} aria-hidden="true" />
      <time dateTime={scheduledAt}>Позвонить {formattedDate}</time>
    </div>
  );
}
