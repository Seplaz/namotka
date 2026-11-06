import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';
import {
  isTaskStatus,
  isTaskPriority,
  type Task,
  type TaskStatus,
  type TaskPriority,
} from '@/types/task';

const TASK_SELECT = `
  id,
  task_number,
  description,
  inn,
  phone,
  status,
  priority,
  scheduled_at,
  created_at,
  created_by,
  assigned_to,
  creator:profiles!tasks_created_by_fkey(first_name, last_name),
  assignee:profiles!tasks_assigned_to_fkey(first_name, last_name)
`;

type ProfileName = {
  first_name: string | null;
  last_name: string | null;
};

type TaskRow = Pick<
  Tables<'tasks'>,
  | 'id'
  | 'task_number'
  | 'description'
  | 'inn'
  | 'phone'
  | 'status'
  | 'priority'
  | 'scheduled_at'
  | 'created_at'
  | 'created_by'
  | 'assigned_to'
> & {
  creator: ProfileName | null;
  assignee: ProfileName | null;
};

export type NewTaskData = {
  inn: string;
  phone: string;
  description: string;
  scheduledAt: string | null;
  assignedTo: string | null;
  priority: TaskPriority;
};

function formatFullName(profile: ProfileName | null): string | null {
  if (!profile) return null;

  const fullName = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();

  return fullName || null;
}

function mapTaskToTask(task: TaskRow): Task {
  if (!isTaskStatus(task.status)) {
    throw new Error(`Неизвестный статус задачи: ${task.status}`);
  }

  if (!isTaskPriority(task.priority)) {
    throw new Error(`Неизвестный приоритет задачи: ${task.priority}`);
  }

  return {
    id: task.id,
    task_number: task.task_number,
    description: task.description,
    inn: task.inn,
    phone: task.phone,
    status: task.status,
    priority: task.priority,
    scheduled_at: task.scheduled_at,
    created_at: task.created_at,
    created_by: task.created_by,
    assigned_to: task.assigned_to,
    creatorName: formatFullName(task.creator),
    assigneeName: formatFullName(task.assignee),
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

export async function getTasks(
  statuses?: readonly TaskStatus[],
): Promise<Task[]> {
  let query = supabase.from('tasks').select(TASK_SELECT);

  if (statuses?.length) {
    query = query.in('status', [...statuses]);
  }

  const { data, error } = await query
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

  if (error) throw error;

  const { data, error: taskError } = await supabase
    .from('tasks')
    .select(TASK_SELECT)
    .eq('id', taskId)
    .single();

  if (taskError) throw taskError;

  return mapTaskToTask(data as TaskRow);
}
