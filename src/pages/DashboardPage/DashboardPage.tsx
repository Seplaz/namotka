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
import type { Comment } from '@/types/comment';
import { createComment, getComments } from '@/services/commentsService';

function groupCommentsByTask(comments: Comment[]): Record<string, Comment[]> {
  return comments.reduce<Record<string, Comment[]>>((groups, comment) => {
    if (!groups[comment.task_id]) {
      groups[comment.task_id] = [];
    }

    groups[comment.task_id].push(comment);

    return groups;
  }, {});
}

export function DashboardPage() {
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [commentsByTask, setCommentsByTask] = useState<
    Record<string, Comment[]>
  >({});

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

    async function loadComments() {
      try {
        const loadedComments = await getComments();

        if (isCurrent) {
          setCommentsByTask(groupCommentsByTask(loadedComments));
        }
      } catch (error) {
        console.error('Не удалось загрузить комментарии:', error);

        if (isCurrent) {
          showToast({
            type: 'error',
            message: 'Не удалось загрузить комментарии',
          });
        }
      }
    }

    void loadTasks();
    void loadComments();

    const channel = supabase
      .channel('dashboard-realtime')
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
        },
        async () => {
          try {
            const latestComments = await getComments();

            if (isCurrent) {
              setCommentsByTask(groupCommentsByTask(latestComments));
            }
          } catch (error) {
            console.error(
              'Не удалось обновить комментарии через Realtime:',
              error,
            );
          }
        },
      )
      .subscribe((status) => {
        console.log('Dashboard Realtime status:', status);
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

  async function handleAddComment(taskId: string, content: string) {
    const newComment = await createComment(taskId, content);

    setCommentsByTask((current) => {
      const taskComments = current[taskId] ?? [];

      if (taskComments.some((comment) => comment.id === newComment.id)) {
        return current;
      }

      return {
        ...current,
        [taskId]: [...taskComments, newComment],
      };
    });
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
      commentsByTask={commentsByTask}
      onCreateTask={handleCreateTask}
      onStartTask={handleStartTask}
      onReturnTask={handleReturnTask}
      onCompleteTask={handleCompleteTask}
      onAddComment={handleAddComment}
    />
  );
}
