import styles from '@/components/Dashboard/Dashboard.module.css';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

import type { Task } from '@/types/task';
import type { Comment } from '@/types/comment';
import type { NewTaskData } from '@/services/tasksService';

import { TaskList } from '@/components/TaskList/TaskList';
import { TaskDetails } from '@/components/TaskDetails/TaskDetails';
import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/Modal/Modal';
import { NewTask } from '@/components/NewTask/NewTask';
import { Input } from '@/components/Input/Input';

import {
  initialTaskDraft,
  type NewTaskDraft,
} from '@/components/NewTask/NewTask.types';

type DashboardProps = {
  tasks: Task[];
  onCreateTask: (data: NewTaskData) => Promise<void>;
  onStartTask: (taskId: string) => Promise<void>;
  onReturnTask: (taskId: string) => Promise<void>;
  onCompleteTask: (taskId: string) => Promise<void>;
  commentsByTask: Record<string, Comment[]>;
  onAddComment: (taskId: string, content: string) => Promise<void>;
};

export function Dashboard({
  tasks,
  onCreateTask,
  onStartTask,
  onReturnTask,
  onCompleteTask,
  commentsByTask,
  onAddComment,
}: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [taskDraft, setTaskDraft] = useState<NewTaskDraft>({
    ...initialTaskDraft,
  });

  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const activeTasks = tasks.filter(
    (task) =>
      task.status === 'new' ||
      task.status === 'waiting' ||
      task.status === 'in_progress',
  );

  const filteredTasks = activeTasks.filter((task) => {
    if (!normalizedQuery) return true;

    const searchableFields = [
      task.task_number,
      task.description,
      task.client?.name,
      task.client?.inn,
      task.client?.kpp,
      task.phone,
      task.contactName,
      task.creatorName,
      task.assigneeName,
    ];

    return searchableFields.some((field) =>
      String(field ?? '')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  });

  const selectedTask =
    filteredTasks.find((task) => task.id === selectedTaskId) ??
    filteredTasks[0] ??
    null;

  function handleSelectTask(taskId: string) {
    setSelectedTaskId(taskId);
  }

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    <main className={styles.dashboard}>
      {/* Верхняя панель */}
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

      {/* Основная область */}
      <div className={styles.content}>
        <TaskList
          tasks={filteredTasks}
          selectedTaskId={selectedTask?.id ?? null}
          onSelectTask={handleSelectTask}
          emptyMessage="Намотки отсутствуют."
        />
        
        <TaskDetails
          task={selectedTask}
          comments={selectedTask ? (commentsByTask[selectedTask.id] ?? []) : []}
          onStartTask={onStartTask}
          onReturnTask={onReturnTask}
          onCompleteTask={onCompleteTask}
          onAddComment={onAddComment}
        />
      </div>

      {/* Модальное окно находится вне grid с двумя колонками */}
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
    </main>
  );
}
