import styles from '@/components/TaskDetails/TaskDetails.module.css';

import { useState } from 'react';
import { ArrowRight, Check, MoveRight, Undo2 } from 'lucide-react';

import { useToast } from '@/hooks/useToast';

import type { Task } from '@/types/task';
import type { Comment } from '@/types/comment';

import { TaskStatus } from '@/components/TaskStatus/TaskStatus';
import { TaskPriority } from '@/components/TaskPriority/TaskPriority';
import { TaskSchedule } from '@/components/TaskSchedule/TaskSchedule';
import { CopyButton } from '@/components/CopyButton/CopyButton';
import { Comments } from '@/components/Comments/Comments';
import { Button } from '@/components/Button/Button';

type TaskDetailsProps = {
  task: Task | null;
  comments: Comment[];
  onStartTask: (taskId: string) => Promise<void>;
  onReturnTask: (taskId: string) => Promise<void>;
  onCompleteTask: (taskId: string) => Promise<void>;
  onAddComment: (taskId: string, content: string) => Promise<void>;
};

type PendingAction = 'start' | 'return' | 'complete' | null;

export function TaskDetails({
  task,
  comments,
  onStartTask,
  onReturnTask,
  onCompleteTask,
  onAddComment,
}: TaskDetailsProps) {
  const { showToast } = useToast();

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  if (!task) {
    return (
      <section className={styles.details}>
        <div className={styles.empty}>
          <p>Выберите намотку из списка</p>
        </div>
      </section>
    );
  }

  const taskId = task.id;

  const isNew = task.status === 'new';
  const isWaiting = task.status === 'waiting';
  const isInProgress = task.status === 'in_progress';

  const hasActions = isNew || isWaiting || isInProgress;

  const clientName = task.client?.name ?? 'Клиент не указан';
  const inn = task.client?.inn ?? '';
  const kpp = task.client?.kpp ?? '';

  async function performAction(
    action: Exclude<PendingAction, null>,
    callback: (taskId: string) => Promise<void>,
    successMessage?: string,
    errorMessage = 'Не удалось изменить статус намотки',
  ) {
    if (pendingAction) return;

    try {
      setPendingAction(action);

      await callback(taskId);

      if (successMessage) {
        showToast({
          type: 'success',
          message: successMessage,
        });
      }
    } catch (error) {
      console.error('Ошибка выполнения действия с намоткой:', error);

      showToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setPendingAction(null);
    }
  }

  function handleStart() {
    return performAction(
      'start',
      onStartTask,
      undefined,
      'Не удалось начать намотку, и слава богу',
    );
  }

  function handleReturn() {
    return performAction(
      'return',
      onReturnTask,
      'Намотка возвращена',
      'Не удалось вернуть намотку',
    );
  }

  function handleComplete() {
    return performAction(
      'complete',
      onCompleteTask,
      'Намотка завершена и перенесена в архив',
      'Не удалось завершить намотку',
    );
  }

  return (
    <section className={styles.details}>
      <header className={styles.header}>
        <span className={styles.number}># {task.task_number}</span>

        <TaskStatus status={task.status} />
      </header>

      <h2 className={styles.description}>{task.description}</h2>

      <div className={styles.meta}>
        <div className={styles.people}>
          <span className={styles.creator}>
            {task.creatorName ?? 'Неизвестный пользователь'}
          </span>
          <MoveRight size={16} />
          <span className={styles.assignee}>
            {task.assigneeName ?? 'Не назначен'}
          </span>
        </div>

        {task.scheduled_at && (
          <div className={styles.schedule}>
            <TaskSchedule scheduledAt={task.scheduled_at} />
          </div>
        )}

        <span className={styles.priority}>
          <TaskPriority priority={task.priority} />
        </span>
      </div>

      <div className={styles.divider} />

      <section className={styles.client}>
        <div className={styles.field}>
          <span className={styles.label}>Название</span>

          <span className={styles.value} title={clientName}>
            {clientName}
          </span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>ИНН</span>

          <div className={styles.copy}>
            <span>{inn || '—'}</span>

            {inn && <CopyButton value={inn} label="ИНН" />}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>КПП</span>

          <div className={styles.copy}>
            <span>{kpp || '—'}</span>

            {kpp && <CopyButton value={kpp} label="КПП" />}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Телефон</span>

          <div className={styles.copy}>
            <span>{task.phone}</span>

            <CopyButton value={task.phone} label="номер телефона" />
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* Комментарии */}
      <div className={styles.comments}>
        <Comments
          key={task.id}
          comments={comments}
          onAddComment={(content) => onAddComment(taskId, content)}
          canAddComment={task.status !== 'completed'}
        />
      </div>

      {/* Действия */}
      {hasActions && (
        <div className={styles.actions}>
          {(isNew || isWaiting) && (
            <Button
              type="button"
              icon={<ArrowRight size={16} />}
              onClick={handleStart}
              loading={pendingAction === 'start'}
              disabled={pendingAction !== null}
            >
              Намотаться
            </Button>
          )}

          {isInProgress && (
            <>
              <Button
                type="button"
                icon={<Undo2 size={16} />}
                onClick={handleReturn}
                loading={pendingAction === 'return'}
                disabled={pendingAction !== null}
              >
                Вернуть
              </Button>

              <Button
                type="button"
                icon={<Check size={16} />}
                onClick={handleComplete}
                loading={pendingAction === 'complete'}
                disabled={pendingAction !== null}
              >
                Завершить
              </Button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
