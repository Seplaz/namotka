import styles from '@/components/TaskList/TaskList.module.css';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import type { Task } from '@/types/task';

import { TaskListItem } from '@/components/TaskListItem/TaskListItem';

type TaskListProps = {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  emptyMessage?: string;
  title?: string;
};

export function TaskList({
  tasks,
  selectedTaskId,
  onSelectTask,
  emptyMessage = 'Намотки отсутствуют',
  title = 'Список намоток',
}: TaskListProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={styles.list}>
      <h2 className={styles.title}>{title}</h2>

      {tasks.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.message}>{emptyMessage}</p>
        </div>
      ) : (
        <div className={styles.items}>
          <AnimatePresence initial={false} mode="popLayout">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout={!shouldReduceMotion}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 10,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        y: -6,
                      }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  ease: 'easeOut',
                  layout: {
                    duration: shouldReduceMotion ? 0 : 0.2,
                    ease: 'easeOut',
                  },
                }}
              >
                <TaskListItem
                  task={task}
                  isSelected={selectedTaskId === task.id}
                  onSelect={onSelectTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
