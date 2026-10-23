import { supabase } from '@/lib/supabase';

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
