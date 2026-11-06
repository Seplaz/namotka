import { useEffect, useRef, useState } from 'react';
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

const DASHBOARD_STATUSES = ['new', 'waiting', 'in_progress'] as const;

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

  const tasksRef = useRef<Task[]>([]);

  useEffect(() => {
    let isCurrent = true;

    async function refreshComments(taskIds: readonly string[]) {
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
            message: 'Не удалось загрузить комментарии',
          });
        }
      }
    }

    async function refreshTasks() {
      const loadedTasks = await getTasks(DASHBOARD_STATUSES);

      if (!isCurrent) return;

      tasksRef.current = loadedTasks;
      setTasks(loadedTasks);

      await refreshComments(loadedTasks.map((task) => task.id));
    }

    async function loadInitialData() {
      try {
        setLoadError(null);
        await refreshTasks();
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

    void loadInitialData();

    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        async () => {
          try {
            await refreshTasks();
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
          const taskIds = tasksRef.current.map((task) => task.id);
          await refreshComments(taskIds);
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
      const latestTasks = await getTasks(DASHBOARD_STATUSES);

      tasksRef.current = latestTasks;
      setTasks(latestTasks);
    } catch (error) {
      console.error('Намотка создана, но не удалось обновить список:', error);

      showToast({
        type: 'error',
        message: 'Намотка создана, но список не удалось обновить',
      });
    }
  }

  function applyUpdatedTask(updatedTask: Task) {
    const nextTasks = tasksRef.current.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );

    tasksRef.current = nextTasks;
    setTasks(nextTasks);

    if (
      updatedTask.status === 'completed' ||
      updatedTask.status === 'cancelled'
    ) {
      setCommentsByTask((current) => {
        const next = { ...current };
        delete next[updatedTask.id];
        return next;
      });
    }
  }

  async function handleStartTask(taskId: string) {
    const updatedTask = await updateTaskStatus(taskId, 'in_progress');
    applyUpdatedTask(updatedTask);
  }

  async function handleReturnTask(taskId: string) {
    const updatedTask = await updateTaskStatus(taskId, 'waiting');
    applyUpdatedTask(updatedTask);
  }

  async function handleCompleteTask(taskId: string) {
    const updatedTask = await updateTaskStatus(taskId, 'completed');
    applyUpdatedTask(updatedTask);
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
