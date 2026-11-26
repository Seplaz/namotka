import type { TaskPriority } from '@/types/task';

export type NewTaskDraft = {
  clientQuery: string;
  clientId: string;
  clientInn: string;
  clientKpp: string;
  clientName: string;
  contactName: string;
  phone: string;
  description: string;
  priority: TaskPriority;
  scheduleCall: boolean;
  scheduledDate: string;
  scheduledTime: string;
  specialistId: string;
};

export const initialTaskDraft: NewTaskDraft = {
  clientQuery: '',
  clientId: '',
  clientInn: '',
  clientKpp: '',
  clientName: '',
  contactName: '',
  phone: '',
  description: '',
  priority: 'medium',
  scheduleCall: false,
  scheduledDate: '',
  scheduledTime: '',
  specialistId: '',
};
