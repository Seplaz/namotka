import { supabase } from '@/lib/supabase';
import type { Task, TaskStatus } from '@/types/task';

export type NewTaskData = {
  inn: string;
  phone: string;
  description: string;
  scheduledAt: string | null;
};

export async function createTask(data: NewTaskData) {
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
    .select()
    .single();

  if (error) throw error;

  return task;
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(
      'id, task_number, description, inn, phone, status, scheduled_at, created_at',
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select(
      'id, task_number, description, inn, phone, status, scheduled_at, created_at',
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}
