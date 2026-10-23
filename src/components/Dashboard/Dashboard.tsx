import styles from '@/components/Dashboard/Dashboard.module.css';
import { useState } from 'react';
import type { Task } from '@/types/task';
import type { NewTaskData } from '@/services/tasksService';
import { TaskColumn } from '@/components/TaskColumn/TaskColumn';
import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/Modal/Modal';
import { NewTask } from '@/components/NewTask/NewTask';
import { AnimatePresence } from 'motion/react';


type DashboardProps = {
  tasks: Task[];
  onCreateTask: (data: NewTaskData) => Promise<void>;
};

export function Dashboard({ tasks, onCreateTask }: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const newTasks = tasks.filter((task) => task.status === 'new');
  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress');

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    <main className={styles.dashboard}>
      <TaskColumn title="Новые" tasks={newTasks} emptyMessage="Намоток нет" />

      <TaskColumn title="В работе" tasks={inProgressTasks} emptyMessage="Наконец то нет работы и можно бездельничать" />

      <Button type="button" onClick={handleOpenModal}>
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
