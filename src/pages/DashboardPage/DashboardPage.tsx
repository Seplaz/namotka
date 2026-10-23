import { useEffect, useState } from 'react';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { Loader } from '@/components/Loader/Loader';
import {
  createTask,
  getTasks,
  updateTaskStatus,
  type NewTaskData,
} from '@/services/tasksService';
import type { Task } from '@/types/task';

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadTasks() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const loadedTasks = await getTasks();

        if (isCurrent) {
          setTasks(loadedTasks);
        }
      } catch (error) {
        console.error('Не удалось загрузить задачи:', error);

        if (isCurrent) {
          setLoadError(
            'Не удалось загрузить задачи. Попробуйте обновить страницу.',
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadTasks();

    return () => {
      isCurrent = false;
    };
  }, []);

  async function handleCreateTask(data: NewTaskData) {
    const createdTask = await createTask(data);

    setTasks((currentTasks) => [createdTask as Task, ...currentTasks]);
  }

  async function handleStartTask(taskId: string) {
    const updatedTask = await updateTaskStatus(taskId, 'in_progress');

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? updatedTask : task)),
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (loadError) {
    return (
      <div>
        <p role="alert">{loadError}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Обновить страницу
        </button>
      </div>
    );
  }

  return <Dashboard tasks={tasks} onCreateTask={handleCreateTask} onStartTask={handleStartTask} />;
}
