export type TaskStatus =
  | 'new'
  | 'in_progress'
  | 'completed'
  | 'waiting'
  | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high';

export function isTaskStatus(status: string): status is TaskStatus {
  return (
    status === 'new' ||
    status === 'in_progress' ||
    status === 'completed' ||
    status === 'waiting' ||
    status === 'cancelled'
  );
}

export function isTaskPriority(value: string): value is TaskPriority {
  return value === 'low' || value === 'medium' || value === 'high';
}

export type Task = {
  id: string;
  task_number: number;
  description: string;
  inn: string;
  phone: string;
  status: TaskStatus;
  priority: TaskPriority;
  scheduled_at: string | null;
  created_at: string;
  created_by: string;
  assigned_to: string | null;
  creatorName: string | null;
  assigneeName: string | null;
};
