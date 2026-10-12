import styles from '@/components/TaskCard/TaskCard.module.css';
import { useState } from 'react';
import { Copy, Undo2 } from 'lucide-react';
import { Button } from '../Button/Button';
import { TaskStatus } from '../TaskStatus/TaskStatus';

type TaskStatusValue = 'new' | 'waiting' | 'in_progress' | 'completed';

type TaskCardProps = {
  id: number;
  description: string;
  inn: string;
  phone: string;
  status: TaskStatusValue;
};

export function TaskCard({
  id,
  description,
  inn,
  phone,
  status,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isNew = status === 'new';
  const isInProgress = status === 'in_progress';

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span className={styles.id}>#{id}</span>
        {!expanded && <span className={styles.preview}>{description}</span>}
        <TaskStatus status={status} />
      </button>

      {expanded && (
        <div className={styles.content}>
          <p className={styles.description}>{description}</p>

          <div className={styles.info}>
            <div className={styles.field}>
              <span className={styles.label}>ИНН</span>
              <span className={styles.value}>
                {inn}
                <Copy size={16} />
              </span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Номер телефона</span>
              <span className={styles.value}>
                {phone}
                <Copy size={16} />
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            {isNew && (
              <Button type="button" onClick={() => {}}>
                Начать
              </Button>
            )}

            {isInProgress && (
              <>
                <Button
                  type="button"
                  icon={<Undo2 size={20} />}
                  onClick={() => {}}
                >
                  Вернуть
                </Button>

                <Button type="button" onClick={() => {}}>
                  Завершить
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
