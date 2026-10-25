import { supabase } from '@/lib/supabase';
import type { Task, TaskStatus } from '@/types/task';

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

export type NewTaskData = {
  inn: string;
  phone: string;
  description: string;
  scheduledAt: string | null;
};

type TaskWithAssignee = Omit<Task, 'assigneeName'> & {
  assignee: { username: string | null }[] | { username: string | null } | null;
};

function mapTaskToTask(task: TaskWithAssignee): Task {
  const assignee = task.assignee;

  const assigneeName = Array.isArray(assignee)
    ? (assignee[0]?.username ?? null)
    : (assignee?.username ?? null);

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
    assigneeName,
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

  return mapTaskToTask(task);
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_SELECT)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapTaskToTask);
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
      ? {
          status,
          assigned_to: user.id,
        }
      : status === 'waiting'
        ? {
            status,
            assigned_to: null,
          }
        : {
            status,
          };

  const { data: task, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select(TASK_SELECT)
    .single();

  if (error) throw error;

  return mapTaskToTask(task);
}
