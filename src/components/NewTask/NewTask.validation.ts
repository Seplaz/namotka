
import type { NewTaskDraft } from './NewTask.types';

export type NewTaskErrors = Partial<
  Record<
    | 'client'
    | 'inn'
    | 'kpp'
    | 'clientName'
    | 'phone'
    | 'description'
    | 'schedule',
    string
  >
>;

export function normalizePhone(value: string): string | null {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 10) return `8${digits}`;

  if (digits.length === 11 && digits.startsWith('7')) {
    return `8${digits.slice(1)}`;
  }

  if (digits.length === 11 && digits.startsWith('8')) {
    return digits;
  }

  return null;
}

export function getLocalDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function validateNewTask(
  draft: NewTaskDraft,
  now = new Date(),
): NewTaskErrors {
  const errors: NewTaskErrors = {};

  if (!draft.clientId) {
    if (!/^(\d{10}|\d{12})$/.test(draft.clientInn.trim())) {
      errors.inn = 'ИНН должен содержать 10 или 12 цифр';
    }

    if (
      draft.clientKpp.trim() &&
      !/^\d{9}$/.test(draft.clientKpp.trim())
    ) {
      errors.kpp = 'КПП должен содержать 9 цифр';
    }

    if (
      draft.clientName.trim().length < 2 ||
      draft.clientName.trim().length > 255
    ) {
      errors.clientName = 'Название должно содержать от 2 до 255 символов';
    }
  }

  if (!normalizePhone(draft.phone)) {
    errors.phone = 'Введите номер из 10 или 11 цифр';
  }

  if (!draft.description.trim()) {
    errors.description = 'Укажите суть намотки';
  }

  if (draft.scheduleCall) {
    if (!draft.scheduledDate || !draft.scheduledTime) {
      errors.schedule = 'Укажите дату и время звонка';
    } else {
      const scheduledAt = new Date(
        `${draft.scheduledDate}T${draft.scheduledTime}`,
      );

      if (Number.isNaN(scheduledAt.getTime())) {
        errors.schedule = 'Укажите корректную дату и время';
      } else if (scheduledAt.getTime() <= now.getTime()) {
        errors.schedule = 'Дата и время звонка должны быть в будущем';
      }
    }
  }

  return errors;
}
