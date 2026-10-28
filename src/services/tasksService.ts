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

      assigned_to: data.assignedTo,
      priority: data.priority,
      assignment_type: data.assignedTo ? 'direct' : 'open',
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
