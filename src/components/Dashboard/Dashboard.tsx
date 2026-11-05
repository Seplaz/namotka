import styles from '@/components/Dashboard/Dashboard.module.css';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

import type { Task } from '@/types/task';
import type { NewTaskData } from '@/services/tasksService';

import { TaskColumn } from '@/components/TaskColumn/TaskColumn';
import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/Modal/Modal';
import { NewTask } from '@/components/NewTask/NewTask';

import {
  initialTaskDraft,
  type NewTaskDraft,
} from '@/components/NewTask/NewTask.types';
import { Input } from '@/components/Input/Input';

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
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const [taskDraft, setTaskDraft] = useState<NewTaskDraft>({
    ...initialTaskDraft,
  });

  const [searchQuery, setSearchQuery] = useState('');

  // const newTasks = tasks.filter((task) => task.status === 'new');

  // const waitingTasks = tasks.filter((task) => task.status === 'waiting');

  // const newColumnTasks = [...newTasks, ...waitingTasks];

  // const inProgressTasks = tasks.filter((task) => task.status === 'in_progress');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    if (!normalizedQuery) return true;

    const searchableFields = [
      task.task_number,
      task.description,
      task.inn,
      task.phone,
      task.creatorName,
      task.assigneeName,
    ];

    return searchableFields.some((field) =>
      String(field ?? '')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  });

  const newColumnTasks = filteredTasks.filter(
    (task) => task.status === 'new' || task.status === 'waiting',
  );

  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === 'in_progress',
  );

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleToggleTask(taskId: string) {
    setExpandedTaskId((currentId) => (currentId === taskId ? null : taskId));
  }

  return (
    <main className={styles.dashboard}>
      <div className={styles.header}>
        <Input
          className={styles.search}
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Поиск по намоткам"
        />
        <Button
          className={styles.button}
          type="button"
          icon={<Plus size={16} />}
          onClick={handleOpenModal}
        >
          Новая намотка
        </Button>
      </div>

      <div className={styles.content}>
        <TaskColumn
          title="Список намоток"
          tasks={newColumnTasks}
          emptyMessage="Намотки отсутствуют."
          onStartTask={onStartTask}
          onReturnTask={onReturnTask}
          onCompleteTask={onCompleteTask}
          expandedTaskId={expandedTaskId}
          onToggleTask={handleToggleTask}
        />

        <TaskColumn
          title="В работе"
          tasks={inProgressTasks}
          emptyMessage="Здесь ничего нет, но стоит ли наматываться?"
          onStartTask={onStartTask}
          onReturnTask={onReturnTask}
          onCompleteTask={onCompleteTask}
          expandedTaskId={expandedTaskId}
          onToggleTask={handleToggleTask}
        />

        <AnimatePresence>
          {isModalOpen && (
            <Modal onClose={handleCloseModal} titleId="new-task-title">
              <NewTask
                draft={taskDraft}
                onDraftChange={setTaskDraft}
                onClose={handleCloseModal}
                onSubmit={onCreateTask}
              />
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
