import styles from '@/components/Dashboard/Dashboard.module.css';
import { useState } from 'react';
import type { Task } from '@/types/task';
import type { NewTaskData } from '@/services/tasksService';
import { TaskColumn } from '@/components/TaskColumn/TaskColumn';
import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/Modal/Modal';
import { NewTask } from '@/components/NewTask/NewTask';
import { AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

type DashboardProps = {
  tasks: Task[];
  onCreateTask: (data: NewTaskData) => Promise<void>;
  onStartTask: (taskId: string) => Promise<void>;
  onReturnTask: (taskId: string) => Promise<void>;
  onCompleteTask: (taskId: string) => Promise<void>;
};

export function Dashboard({
  tasks,
  onCreateTask,
  onStartTask,
  onReturnTask,
  onCompleteTask,
}: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const newTasks = tasks.filter((task) => task.status === 'new');

  const waitingTasks = tasks.filter((task) => task.status === 'waiting');

  const newColumnTasks = [...newTasks, ...waitingTasks];

  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress');

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    <main className={styles.dashboard}>
      <TaskColumn
        title="Новые"
        tasks={newColumnTasks}
        emptyMessage="Намоток нет"
        onStartTask={onStartTask}
        onReturnTask={onReturnTask}
        onCompleteTask={onCompleteTask}
      />

      <TaskColumn
        title="В работе"
        tasks={inProgressTasks}
        emptyMessage="В работе ничего нет, но стоит ли наматываться?"
        onStartTask={onStartTask}
        onReturnTask={onReturnTask}
        onCompleteTask={onCompleteTask}
      />

      <Button type="button" icon={<Plus size={16} />} onClick={handleOpenModal}>
        Новая намотка
      </Button>

      <AnimatePresence>
        {isModalOpen && (
          <Modal onClose={handleCloseModal} titleId="new-task-title">
            <NewTask onClose={handleCloseModal} onSubmit={onCreateTask} />
          </Modal>
        )}
      </AnimatePresence>
    </main>
  );
}
