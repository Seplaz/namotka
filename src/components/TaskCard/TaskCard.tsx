import styles from '@/components/TaskCard/TaskCard.module.css';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { Check, Undo2, ArrowRight, ChevronDown } from 'lucide-react';
import { TaskSchedule } from '@/components/TaskSchedule/TaskSchedule';
import { Button } from '../Button/Button';
import { TaskStatus } from '../TaskStatus/TaskStatus';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { TaskPriority } from '@/components/TaskPriority/TaskPriority';
import type {
  TaskStatus as TaskStatusValue,
  TaskPriority as TaskPriorityValue,
} from '@/types/task';
import { CopyButton } from '@/components/CopyButton/CopyButton';

type TaskCardProps = {
  id: string;
  task_number: number;
  description: string;
  inn: string;
  phone: string;
  status: TaskStatusValue;
  priority: TaskPriorityValue;
  scheduled_at: string | null;
  created_at: string;
  creatorName: string | null;
  assigned_to: string | null;
  assigneeName: string | null;
  expanded: boolean;
  onToggleExpand: () => void;
  onStartTask?: (taskId: string) => Promise<void>;
  onReturnTask?: (taskId: string) => Promise<void>;
  onCompleteTask?: (taskId: string) => Promise<void>;
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
  priority,
  scheduled_at,
  creatorName,
  assigneeName,
  expanded,
  onToggleExpand,
  onStartTask,
  onReturnTask,
  onCompleteTask,
}: TaskCardProps) {
  const { showToast } = useToast();
  const [isStarting, setIsStarting] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const isNew = status === 'new';
  const isWaiting = status === 'waiting';
  const isInProgress = status === 'in_progress';
  const hasActions = isNew || isWaiting || isInProgress;

  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : {
        height: { duration: 0.2, ease: 'easeInOut' as const },
        opacity: { duration: 0.15, ease: 'easeOut' as const },
      };

  async function handleStart() {
    if (!onStartTask) return;

    try {
      setIsStarting(true);
      await onStartTask(id);
    } catch (error) {
      console.error('Не удалось начать намотку:', error);
      showToast({
        type: 'error',
        message: 'Не удалось начать намотку, и слава богу',
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
        message: 'Намотка возвращена',
      });
    } catch (error) {
      console.error('Не удалось вернуть намотку:', error);
      showToast({
        type: 'error',
        message: 'Не удалось вернуть намотку',
      });
    } finally {
      setIsReturning(false);
    }
  }

  async function handleComplete() {
    if (!onCompleteTask) return;

    try {
      setIsCompleting(true);

      await onCompleteTask(id);

      showToast({
        type: 'success',
        message: 'Намотка завершена и перенесена в архив',
      });
    } catch (error) {
      console.error('Не удалось завершить намотку:', error);

      showToast({
        type: 'error',
        message: 'Не удалось завершить намотку',
      });
    } finally {
      setIsCompleting(false);
    }
  }

  return (
    <motion.article
      layout="position"
      className={styles.card}
      transition={{
        layout: {
          type: 'tween',
          duration: shouldReduceMotion ? 0 : 0.25,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      {/* Header */}
      <button
        type="button"
        className={styles.header}
        onClick={onToggleExpand}
        aria-expanded={expanded}
        aria-controls={`task-content-${id}`}
      >
        <div className={styles.title}>
          <div className={styles.taskMeta}>
            <motion.span
              className={styles.expandIcon}
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.25,
                ease: 'easeInOut',
              }}
              aria-hidden="true"
            >
              <ChevronDown size={20} />
            </motion.span>

            <span className={styles.number}># {task_number}</span>
          </div>

          <TaskStatus status={status} />
        </div>

        <div className={styles.task}>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.schedule}>
          {scheduled_at && <TaskSchedule scheduledAt={scheduled_at} />}
          <TaskPriority priority={priority} />
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={`task-content-${id}`}
            className={styles.details}
            key="task-content"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={transition}
            style={{ overflow: 'hidden' }}
          >
            {/* Info */}
            <div className={styles.info}>
              <div className={styles.assign}>
                <div className={styles.field}>
                  <span className={styles.label}>Намотчик</span>
                  <span className={styles.value}>
                    {creatorName ?? 'Неизвестный пользователь'}
                  </span>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Намотанный</span>
                  <span className={styles.value}>
                    {assigneeName ?? 'Не назначен'}
                  </span>
                </div>
              </div>

              <div className={styles.contacts}>
                <div className={styles.field}>
                  <span className={styles.label}>ИНН</span>
                  <div className={styles.value}>
                    <span>{inn}</span>
                    <CopyButton value={inn} label="ИНН" />
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Номер телефона</span>
                  <div className={styles.value}>
                    <span>{phone}</span>
                    <CopyButton value={phone} label="номер телефона" />
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className={styles.comments}>
                {/* <Comments taskId={id} /> */}
              </div>
            </div>

            {/* Actions */}
            {hasActions && (
              <div className={styles.actions}>
                {(isNew || isWaiting) && (
                  <Button
                    type="button"
                    icon={<ArrowRight size={16} />}
                    onClick={handleStart}
                    loading={isStarting}
                  >
                    Намотаться
                  </Button>
                )}

                {isInProgress && (
                  <>
                    <Button
                      type="button"
                      icon={<Undo2 size={16} />}
                      onClick={handleReturn}
                      loading={isReturning}
                      disabled={isCompleting}
                    >
                      Вернуть
                    </Button>

                    <Button
                      type="button"
                      icon={<Check size={16} />}
                      onClick={handleComplete}
                      loading={isCompleting}
                      disabled={isReturning}
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
    </motion.article>
  );
}
