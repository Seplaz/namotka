import { useEffect, useState } from 'react';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { Loader } from '@/components/Loader/Loader';
import { supabase } from '@/lib/supabase';
import {
  createTask,
  getTasks,
  updateTaskStatus,
  type NewTaskData,
} from '@/services/tasksService';
import type { Task } from '@/types/task';
import { useToast } from '@/hooks/useToast';

export function DashboardPage() {
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadTasks() {
      try {
        setLoadError(null);

        const loadedTasks = await getTasks();

        if (isCurrent) {
          setTasks(loadedTasks);
        }
      } catch (error) {
        console.error('Не удалось загрузить намотки:', error);

        if (isCurrent) {
          setLoadError(
            'Не удалось загрузить задачи. Попробуйте обновить страницу.',
          );
          showToast({
            type: 'error',
            message: 'Не удалось загрузить намотки. И не надо.',
          });
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadTasks();

    const channel = supabase
      .channel('dashboard-tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        async (payload) => {
          console.log('Realtime task event:', payload);

          try {
            const latestTasks = await getTasks();

            if (isCurrent) {
              setTasks(latestTasks);
            }
          } catch (error) {
            console.error('Не удалось обновить задачи через Realtime:', error);
          }
        },
      )
      .subscribe((status) => {
        console.log('Tasks Realtime status:', status);
      });

    return () => {
      isCurrent = false;
      void supabase.removeChannel(channel);
    };
  }, [showToast]);

  async function handleCreateTask(data: NewTaskData) {
    await createTask(data);

    try {
      const latestTasks = await getTasks();
      setTasks(latestTasks);
    } catch (error) {
      console.error('Намотка создана, но не удалось обновить список:', error);

      showToast({
        type: 'error',
        message: 'Намотка создана, но список не удалось обновить',
      });
    }
  }

  async function handleStartTask(taskId: string) {
    const updatedTask = await updateTaskStatus(taskId, 'in_progress');

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? updatedTask : task)),
    );
  }

  async function handleReturnTask(taskId: string) {
    const updatedTask = await updateTaskStatus(taskId, 'waiting');

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? updatedTask : task)),
    );
  }

  async function handleCompleteTask(taskId: string) {
    const updatedTask = await updateTaskStatus(taskId, 'completed');

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

  return (
    <Dashboard
      tasks={tasks}
      onCreateTask={handleCreateTask}
      onStartTask={handleStartTask}
      onReturnTask={handleReturnTask}
      onCompleteTask={handleCompleteTask}
    />
  );
}
