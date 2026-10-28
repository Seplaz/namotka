import styles from '@/components/TaskColumn/TaskColumn.module.css';
import type { Task } from '@/types/task';
import { TaskCard } from '@/components/TaskCard/TaskCard';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type TaskColumnProps = {
  title: string;
  tasks: Task[];
  emptyImage?: string;
  emptyMessage?: string;
  onStartTask?: (taskId: string) => Promise<void>;
  onReturnTask?: (taskId: string) => Promise<void>;
  onCompleteTask?: (taskId: string) => Promise<void>;
};

export function TaskColumn({
  title,
  tasks,
  emptyImage,
  emptyMessage,
  onStartTask,
  onReturnTask,
  onCompleteTask,
}: TaskColumnProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={styles.column}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.content}>
        {tasks.length === 0 ? (
          <div className={styles.empty}>
            {emptyImage && <img src={emptyImage} alt="" />}
            {emptyMessage && <p>{emptyMessage}</p>}
          </div>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout={!shouldReduceMotion}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 10, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 0, y: -6, scale: 0.98 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  ease: 'easeOut',
                  layout: { duration: 0.2, ease: 'easeOut' },
                }}
              >
                <TaskCard
                  {...task}
                  onStartTask={onStartTask}
                  onReturnTask={onReturnTask}
                  onCompleteTask={onCompleteTask}
                  creatorName={task.creatorName}
                  assigneeName={task.assigneeName}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
