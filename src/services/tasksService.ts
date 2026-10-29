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
  created_by,
  assigned_to,
  creator:profiles!tasks_created_by_fkey(username),
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
  | 'created_by'
  | 'assigned_to'
> & {
  creator: { username: string } | null;
  assignee: { username: string } | null;
};

type TaskPriority = 'low' | 'medium' | 'high';

export type NewTaskData = {
  inn: string;
  phone: string;
  description: string;
  scheduledAt: string | null;
  assignedTo: string | null;
  priority: TaskPriority;
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
    created_by: task.created_by,
    assigned_to: task.assigned_to,
    creatorName: task.creator?.username ?? null,
    assigneeName: task.assignee?.username ?? null,
  };
}
export async function createTask(data: NewTaskData): Promise<void> {
  const { error } = await supabase.rpc('create_task', {
    p_inn: data.inn,
    p_phone: data.phone,
    p_description: data.description,
    p_assigned_to: data.assignedTo ?? undefined,
    p_priority: data.priority ?? 'medium',
    p_scheduled_at: data.scheduledAt ?? undefined,
  });

  if (error) throw error;
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_SELECT)
    .order('created_at', { ascending: true })
    .order('task_number', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((task) => mapTaskToTask(task as TaskRow));
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<Task> {
  const { error } = await supabase.rpc('change_task_status', {
    p_task_id: taskId,
    p_new_status: status,
  });

  if (error) {
    throw error;
  }

  const tasks = await getTasks();
  const updatedTask = tasks.find((task) => task.id === taskId);

  if (!updatedTask) {
    throw new Error(
      'Статус изменён, но не удалось загрузить обновлённую задачу.',
    );
  }

  return updatedTask;
}
