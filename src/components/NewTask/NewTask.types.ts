import type { TaskPriority } from '@/types/task';

export type NewTaskDraft = {
  inn: string;
  phone: string;
  description: string;
  priority: TaskPriority;
  scheduleCall: boolean;
  scheduledDate: string;
  scheduledTime: string;
  specialistId: string;
};

export const initialTaskDraft: NewTaskDraft = {
  inn: '',
  phone: '',
  description: '',
  priority: 'medium',
  scheduleCall: false,
  scheduledDate: '',
  scheduledTime: '',
  specialistId: '',
};
