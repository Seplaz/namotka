import { useEffect, useState } from 'react';
import { Archive } from '@/components/Archive/Archive';
import { Loader } from '@/components/Loader/Loader';
import { getTasks } from '@/services/tasksService';
import type { Task } from '@/types/task';
import { useToast } from '@/hooks/useToast';

export function ArchivePage() {
  const { showToast } = useToast();

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
        console.error('Не удалось загрузить намотки:', error);
        showToast({
          type: 'error',
          message: 'Не удалось загрузить намотки.',
        });

        if (isCurrent) {
          setLoadError(
            'Не удалось загрузить архив. Попробуйте обновить страницу.',
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

  return <Archive tasks={tasks} />;
}
