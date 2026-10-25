export type TaskStatus = 'new' | 'in_progress' | 'completed' | 'waiting';

export type Task = {
  id: string;
  task_number: number;
  description: string;
  inn: string;
  phone: string;
  status: TaskStatus;
  scheduled_at: string | null;
  created_at: string;
  assigned_to: string | null;
  assigneeName: string | null;
};
