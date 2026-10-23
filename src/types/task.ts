export type TaskStatus = 'new' | 'in_progress' | 'completed' | 'waiting';

export type Task = {
  id: string;
  description: string;
  inn: string;
  phone: string;
  status: TaskStatus;
};
