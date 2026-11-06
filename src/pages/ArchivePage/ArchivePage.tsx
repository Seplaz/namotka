import { useEffect, useState } from 'react';
import { Archive } from '@/components/Archive/Archive';
import { Loader } from '@/components/Loader/Loader';
import { getTasks } from '@/services/tasksService';
import { getComments } from '@/services/commentsService';
import { supabase } from '@/lib/supabase';
import type { Task } from '@/types/task';
import type { Comment } from '@/types/comment';
import { useToast } from '@/hooks/useToast';

function groupCommentsByTask(comments: Comment[]): Record<string, Comment[]> {
  return comments.reduce<Record<string, Comment[]>>((groups, comment) => {
    if (!groups[comment.task_id]) {
      groups[comment.task_id] = [];
    }

    groups[comment.task_id].push(comment);

    return groups;
  }, {});
}

export function ArchivePage() {
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [commentsByTask, setCommentsByTask] = useState<
    Record<string, Comment[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    let archivedTaskIds: string[] = [];

    async function loadComments(taskIds: readonly string[]) {
      if (taskIds.length === 0) {
        if (isCurrent) {
          setCommentsByTask({});
        }
        return;
      }

      try {
        const loadedComments = await getComments(taskIds);

        if (isCurrent) {
          setCommentsByTask(groupCommentsByTask(loadedComments));
        }
      } catch (error) {
        console.error('Не удалось загрузить комментарии:', error);

        if (isCurrent) {
          showToast({
            type: 'error',
            message: 'Не удалось загрузить комментарии.',
          });
        }
      }
    }

    async function refreshArchive() {
      const loadedTasks = await getTasks(['completed']);

      if (!isCurrent) return;

      archivedTaskIds = loadedTasks.map((task) => task.id);
      setTasks(loadedTasks);

      await loadComments(archivedTaskIds);
    }

    async function loadInitialArchive() {
      try {
        setLoadError(null);
        await refreshArchive();
      } catch (error) {
        console.error('Не удалось загрузить архив:', error);

        if (isCurrent) {
          setLoadError(
            'Не удалось загрузить архив. Попробуйте обновить страницу.',
          );
          showToast({
            type: 'error',
            message: 'Не удалось загрузить архив.',
          });
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialArchive();

    const channel = supabase
      .channel('archive-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        async () => {
          try {
            await refreshArchive();
          } catch (error) {
            console.error('Не удалось обновить архив через Realtime:', error);
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
        },
        async () => {
          await loadComments(archivedTaskIds);
        },
      )
      .subscribe((status) => {
        console.log('Archive Realtime status:', status);
      });

    return () => {
      isCurrent = false;
      void supabase.removeChannel(channel);
    };
  }, [showToast]);

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

  return <Archive tasks={tasks} commentsByTask={commentsByTask} />;
}
