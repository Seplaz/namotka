import styles from '@/components/TaskCard/TaskCard.module.css';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { Check, Copy, Undo2, ArrowRight } from 'lucide-react';
import { Button } from '../Button/Button';
import { TaskStatus } from '../TaskStatus/TaskStatus';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { TaskStatus as TaskStatusValue } from '@/types/task';

type TaskCardProps = {
  id: string;
  task_number: number;
  description: string;
  inn: string;
  phone: string;
  status: TaskStatusValue;
  scheduled_at: string | null;
  created_at: string;
  assigned_to: string | null;
  assigneeName: string | null;
  onStartTask?: (taskId: string) => Promise<void>;
  onReturnTask?: (taskId: string) => Promise<void>;
};

const contentVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
  },
  expanded: {
    height: 'auto',
    opacity: 1,
  },
};

export function TaskCard({
  id,
  task_number,
  description,
  inn,
  phone,
  status,
  scheduled_at,
  assigneeName,
  onStartTask,
  onReturnTask,
}: TaskCardProps) {
  const { showToast } = useToast();

  const [expanded, setExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<'inn' | 'phone' | null>(null);

  const [isStarting, setIsStarting] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const isNew = status === 'new';
  const isWaiting = status === 'waiting';
  const isInProgress = status === 'in_progress';
  const hasActions = isNew || isWaiting || isInProgress;

  const handleCopy = async (value: string, field: 'inn' | 'phone') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);

      window.setTimeout(() => {
        setCopiedField(null);
      }, 1500);
    } catch {
      setCopiedField(null);
    }
  };

  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : {
        height: { duration: 0.15, ease: 'easeInOut' as const },
        opacity: { duration: 0.15, ease: 'easeOut' as const },
      };

  const formattedDate = scheduled_at
    ? new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).format(new Date(scheduled_at))
    : null;

  async function handleStart() {
    if (!onStartTask) return;

    try {
      setIsStarting(true);
      await onStartTask(id);
    } catch (error) {
      console.error('Не удалось начать задачу:', error);
      showToast({
        type: 'error',
        message: 'Не удалось начать задачу.',
      });
    } finally {
      setIsStarting(false);
    }
  }

  async function handleReturn() {
    if (!onReturnTask) return;

    try {
      setIsReturning(true);
      await onReturnTask(id);

      showToast({
        type: 'success',
        message: 'Задача возвращена в новые.',
      });
    } catch (error) {
      console.error('Не удалось вернуть задачу:', error);
      showToast({
        type: 'error',
        message: 'Не удалось вернуть задачу.',
      });
    } finally {
      setIsReturning(false);
    }
  }

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className={styles.preview}>
          <span className={styles.number}># {task_number}</span>

          <div className={styles.schedule}>
            <span className={styles.title}>Время звонка</span>

            {scheduled_at && formattedDate ? (
              <time className={styles.text} dateTime={scheduled_at}>
                {formattedDate}
              </time>
            ) : (
              <span className={styles.text}>Не назначено</span>
            )}
          </div>
        </div>

        <TaskStatus status={status} />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className={styles.content}
            key="task-content"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={transition}
            style={{ overflow: 'hidden' }}
          >
            <p className={styles.description}>{description}</p>

            <div className={styles.info}>
              <div className={styles.field}>
                <span className={styles.label}>Исполнитель</span>

                <div className={styles.value}>
                  <span>{assigneeName ?? 'Не назначен'}</span>
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>ИНН</span>

                <div className={styles.value}>
                  <span>{inn}</span>

                  <button
                    type="button"
                    className={styles.copy}
                    onClick={() => handleCopy(inn, 'inn')}
                    aria-label="Скопировать ИНН"
                    title="Скопировать ИНН"
                  >
                    {copiedField === 'inn' ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Номер телефона</span>

                <div className={styles.value}>
                  <span>{phone}</span>

                  <button
                    type="button"
                    className={styles.copy}
                    onClick={() => handleCopy(phone, 'phone')}
                    aria-label="Скопировать номер телефона"
                    title="Скопировать номер телефона"
                  >
                    {copiedField === 'phone' ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {hasActions && (
              <div className={styles.actions}>
                {(isNew || isWaiting) && (
                  <Button
                    type="button"
                    icon={<ArrowRight size={16} />}
                    // iconPosition="right"
                    onClick={handleStart}
                    disabled={isStarting}
                  >
                    {isStarting ? 'Идёт намотка...' : 'Намотаться'}
                  </Button>
                )}

                {isInProgress && (
                  <>
                    <Button
                      type="button"
                      icon={<Undo2 size={16} />}
                      onClick={handleReturn}
                      disabled={isReturning}
                    >
                      {isReturning ? 'Возвращаем...' : 'Вернуть'}
                    </Button>

                    <Button
                      type="button"
                      icon={<Check size={16} />}
                      onClick={() => {}}
                    >
                      Завершить
                    </Button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
