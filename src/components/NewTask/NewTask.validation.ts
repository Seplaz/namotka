import type { NewTaskDraft } from './NewTask.types';

export type NewTaskErrors = Partial<
  Record<'client' | 'phone' | 'description' | 'schedule', string>
>;

export type ParsedClient = {
  inn: string;
  kpp: string;
  name: string;
};

export function parseClientQuery(value: string): ParsedClient {
  const query = value.trim();

  const match = query.match(/^(\d{10}|\d{12})(?:\s*[-–—]\s*(\d{9}))?\s+(.+)$/u);

  if (!match) {
    return {
      inn: '',
      kpp: '',
      name: '',
    };
  }

  return {
    inn: match[1],
    kpp: match[2] ?? '',
    name: match[3].trim(),
  };
}

export function isValidClientQuery(value: string): boolean {
  const client = parseClientQuery(value);

  return (
    /^(\d{10}|\d{12})$/.test(client.inn) &&
    (!client.kpp || /^\d{9}$/.test(client.kpp)) &&
    client.name.length >= 2 &&
    client.name.length <= 255
  );
}

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

  if (!isValidClientQuery(draft.clientQuery)) {
    errors.client =
      'Введите ИНН, необязательный КПП и название организации. Например: 3810336910-384901001 ООО "СБ-ГРУПП"';
  }

  if (!normalizePhone(draft.phone)) {
    errors.phone = 'Введите номер из 10 или 11 цифр';
  }

  const descriptionLength = draft.description.trim().length;

  if (descriptionLength < 1 || descriptionLength > 1000) {
    errors.description = 'Описание должно содержать от 1 до 1000 символов';
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
