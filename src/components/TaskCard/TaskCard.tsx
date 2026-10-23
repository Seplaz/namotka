import styles from '@/components/TaskCard/TaskCard.module.css';
import { useState } from 'react';
import { Check, Copy, Undo2 } from 'lucide-react';
import { Button } from '../Button/Button';
import { TaskStatus } from '../TaskStatus/TaskStatus';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type TaskStatusValue = 'new' | 'waiting' | 'in_progress' | 'completed';

type TaskCardProps = {
  id: number;
  description: string;
  inn: string;
  phone: string;
  status: TaskStatusValue;
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
  description,
  inn,
  phone,
  status,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<'inn' | 'phone' | null>(null);

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

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span className={styles.id}>#{id}</span>
        {/* {!expanded && <span className={styles.preview}>{description}</span>} */}
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
                  <Button type="button" onClick={() => {}}>
                    Начать
                  </Button>
                )}

                {isInProgress && (
                  <>
                    <Button
                      type="button"
                      icon={<Undo2 size={16} />}
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
