import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';
import { isTaskStatus, type Task, type TaskStatus } from '@/types/task';

const TASK_SELECT = `
  id,
  task_number,
  description,
  inn,
  phone,
  status,
  scheduled_at,
  created_at,
  assigned_to,
  assignee:profiles!tasks_assigned_to_fkey(username)
`;

type TaskRow = Pick<
  Tables<'tasks'>,
  | 'id'
  | 'task_number'
  | 'description'
  | 'inn'
  | 'phone'
  | 'status'
  | 'scheduled_at'
  | 'created_at'
  | 'assigned_to'
> & {
  assignee: { username: string } | null;
};

export type NewTaskData = {
  inn: string;
  phone: string;
  description: string;
  scheduledAt: string | null;
};

function mapTaskToTask(task: TaskRow): Task {
  if (!isTaskStatus(task.status)) {
    throw new Error(`Неизвестный статус задачи: ${task.status}`);
  }

  return {
    id: task.id,
    task_number: task.task_number,
    description: task.description,
    inn: task.inn,
    phone: task.phone,
    status: task.status,
    scheduled_at: task.scheduled_at,
    created_at: task.created_at,
    assigned_to: task.assigned_to,
    assigneeName: task.assignee?.username ?? null,
  };
}

export async function createTask(data: NewTaskData): Promise<Task> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('Необходимо войти в учётную запись.');
  }

  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      inn: data.inn,
      phone: data.phone,
      description: data.description,
      scheduled_at: data.scheduledAt,
      status: 'new',
      created_by: user.id,
    })
    .select(TASK_SELECT)
    .single();

  if (error) throw error;

  return mapTaskToTask(task as TaskRow);
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_SELECT)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((task) => mapTaskToTask(task as TaskRow));
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<Task> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('Необходимо войти в учётную запись.');
  }

  const updates =
    status === 'in_progress'
      ? { status, assigned_to: user.id }
      : status === 'waiting'
        ? { status, assigned_to: null }
        : { status };

  const { data: task, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select(TASK_SELECT)
    .single();

  if (error) throw error;

  return mapTaskToTask(task as TaskRow);
}
