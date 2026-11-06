import styles from '@/components/NewTask/NewTask.module.css';
import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, X } from 'lucide-react';

import { useToast } from '@/hooks/useToast';

import type { NewTaskData } from '@/services/tasksService';
import { getSpecialists, type Specialist } from '@/services/profileService';

import type { TaskPriority } from '@/types/task';

import {
  initialTaskDraft,
  type NewTaskDraft,
} from '@/components/NewTask/NewTask.types';

import { FormField } from '@/components/FormField/FormField';
import { Input } from '@/components/Input/Input';
import { Textarea } from '@/components/Textarea/Textarea';
import {
  RadioGroup,
  type RadioOption,
} from '@/components/RadioGroup/RadioGroup';
import { Select, type SelectOption } from '@/components/Select/Select';
import { Button } from '@/components/Button/Button';
import {
  getLocalDate,
  normalizePhone,
  validateNewTask,
  type NewTaskErrors,
} from '@/components/NewTask/NewTask.validation';

const priorityOptions: RadioOption<TaskPriority>[] = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

type NewTaskProps = {
  onClose: () => void;
  onSubmit: (data: NewTaskData) => Promise<void>;
  draft: NewTaskDraft;
  onDraftChange: (draft: NewTaskDraft) => void;
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.45,
    ease: 'easeOut' as const,
  },
};

const scheduleVariants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: 'auto',
    opacity: 1,
  },
};

const scheduleTransition = {
  height: {
    duration: 0.15,
    ease: 'easeInOut' as const,
  },
  opacity: {
    duration: 0.15,
    ease: 'easeOut' as const,
  },
};

export function NewTask({
  onClose,
  onSubmit,
  draft,
  onDraftChange,
}: NewTaskProps) {
  const { showToast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const formAnimation = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : formVariants;

  const {
    inn,
    phone,
    description,
    priority,
    scheduleCall,
    scheduledDate,
    scheduledTime,
    specialistId,
  } = draft;

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isLoadingSpecialists, setIsLoadingSpecialists] = useState(true);
  const [specialistsError, setSpecialistsError] = useState('');

  const validationErrors: NewTaskErrors = hasSubmitted
    ? validateNewTask(draft)
    : {};

  function updateDraft<K extends keyof NewTaskDraft>(
    field: K,
    value: NewTaskDraft[K],
  ) {
    onDraftChange({
      ...draft,
      [field]: value,
    });
  }

  useEffect(() => {
    let cancelled = false;

    async function loadSpecialists() {
      try {
        const data = await getSpecialists();

        if (cancelled) return;

        setSpecialists(data);
        setSpecialistsError('');
      } catch (error) {
        console.error('Ошибка загрузки специалистов:', error);

        if (!cancelled) {
          setSpecialistsError('Не удалось загрузить специалистов.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSpecialists(false);
        }
      }
    }

    void loadSpecialists();

    return () => {
      cancelled = true;
    };
  }, []);

  const specialistOptions: SelectOption<string>[] = specialists.map(
    (specialist) => ({
      value: specialist.id,
      label: [specialist.first_name, specialist.last_name]
        .filter(Boolean)
        .join(' '),
    }),
  );

  function handleDateChange(value: string) {
    onDraftChange({
      ...draft,
      scheduledDate: value,
      scheduledTime: value ? scheduledTime : '',
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setHasSubmitted(true);

    const errors = validateNewTask(draft);

    if (Object.keys(errors).length > 0) return;

    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) return;

    const scheduledAt =
      scheduleCall && scheduledDate && scheduledTime
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : null;

    setIsSubmitting(true);

    try {
      await onSubmit({
        inn: inn.trim(),
        phone: normalizedPhone,
        description: description.trim(),
        scheduledAt,
        assignedTo: specialistId || null,
        priority,
      });

      onDraftChange({ ...initialTaskDraft });
      setHasSubmitted(false);

      showToast({
        type: 'success',
        message: 'Опять работать? Минус вайб...',
      });

      onClose();
    } catch (error) {
      console.error(
        'Поделом, намотка не удалась. А может и не надо? Ошибка:',
        error,
      );

      showToast({
        type: 'error',
        message: 'Поделом, намотка не удалась. А может и не надо?',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.new}>
      <motion.form
        noValidate
        className={styles.form}
        onSubmit={handleSubmit}
        variants={formAnimation}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.header}>
          <h2 className={styles.title} id="new-task-title">
            Новая намотка
          </h2>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть окно"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.client}>
          <FormField label="ИНН" htmlFor="inn" error={validationErrors.inn}>
            <Input
              id="inn"
              type="text"
              name="inn"
              inputMode="numeric"
              autoComplete="off"
              placeholder="10 или 12 цифр"
              value={inn}
              maxLength={12}
              onChange={(event) => {
                const value = event.target.value
                  .replace(/\D/g, '')
                  .slice(0, 12);

                updateDraft('inn', value);
              }}
              aria-invalid={Boolean(validationErrors.inn)}
              aria-describedby={validationErrors.inn ? 'inn-error' : undefined}
              required
            />
          </FormField>

          <FormField
            label="Телефон"
            htmlFor="phone"
            error={validationErrors.phone}
          >
            <Input
              id="phone"
              type="tel"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 (900) 123-45-67"
              value={phone}
              onChange={(event) => updateDraft('phone', event.target.value)}
              aria-invalid={Boolean(validationErrors.phone)}
              aria-describedby={
                validationErrors.phone ? 'phone-error' : undefined
              }
              required
            />
          </FormField>
        </div>

        <FormField
          label="Суть намотки"
          htmlFor="description"
          error={validationErrors.description}
        >
          <Textarea
            id="description"
            name="description"
            placeholder="Что нужно сделать?"
            value={description}
            onChange={(event) => updateDraft('description', event.target.value)}
            rows={3}
            maxLength={1000}
            showCounter
            aria-invalid={Boolean(validationErrors.description)}
            aria-describedby={
              validationErrors.description ? 'description-error' : undefined
            }
            required
          />
        </FormField>

        <FormField label="Приоритет намотки" htmlFor="priority">
          <RadioGroup
            name="priority"
            value={priority}
            onChange={(value) => updateDraft('priority', value)}
            options={priorityOptions}
          />
        </FormField>

        <FormField
          label="Кого будем наматывать?"
          htmlFor="specialist"
          error={specialistsError}
        >
          <Select
            id="specialist"
            name="specialist"
            value={specialistId}
            onChange={(value) => updateDraft('specialistId', value)}
            options={specialistOptions}
            placeholder={
              isLoadingSpecialists
                ? 'Никого, общая намотка'
                : specialists.length === 0
                  ? 'Нет доступных намотантов'
                  : 'Никого, общая намотка'
            }
            disabled={isLoadingSpecialists || specialists.length === 0}
            aria-describedby={specialistsError ? 'specialist-error' : undefined}
          />
        </FormField>

        <label className={styles.schedule}>
          <input
            type="checkbox"
            checked={scheduleCall}
            onChange={(event) => {
              const checked = event.target.checked;

              onDraftChange({
                ...draft,
                scheduleCall: checked,
                ...(checked
                  ? {}
                  : {
                      scheduledDate: '',
                      scheduledTime: '',
                    }),
              });
            }}
          />

          <span className={styles.checkbox} aria-hidden="true">
            {scheduleCall && <Check size={16} />}
          </span>

          <span>Запланировать звонок</span>
        </label>

        <AnimatePresence initial={false}>
          {scheduleCall && (
            <motion.div
              key="schedule-fields"
              initial={shouldReduceMotion ? false : 'hidden'}
              animate="visible"
              exit={shouldReduceMotion ? undefined : 'hidden'}
              variants={scheduleVariants}
              transition={
                shouldReduceMotion ? { duration: 0 } : scheduleTransition
              }
              style={{ overflow: 'hidden' }}
            >
              <FormField
                label="Дата звонка"
                htmlFor="scheduledDate"
                error={validationErrors.schedule}
              >
                <div className={styles.datetime}>
                  <Input
                    className={styles.date}
                    id="scheduledDate"
                    type="date"
                    name="scheduledDate"
                    value={scheduledDate}
                    min={getLocalDate()}
                    onChange={(event) => handleDateChange(event.target.value)}
                    aria-label="Дата звонка"
                    aria-invalid={Boolean(validationErrors.schedule)}
                    aria-describedby={
                      validationErrors.schedule
                        ? 'scheduledDate-error'
                        : undefined
                    }
                    required
                  />

                  <Input
                    className={styles.time}
                    id="scheduledTime"
                    type="time"
                    name="scheduledTime"
                    value={scheduledTime}
                    onChange={(event) =>
                      updateDraft('scheduledTime', event.target.value)
                    }
                    disabled={!scheduledDate}
                    aria-label="Время звонка"
                    aria-invalid={Boolean(validationErrors.schedule)}
                    aria-describedby={
                      validationErrors.schedule
                        ? 'scheduledDate-error'
                        : undefined
                    }
                    required
                  />
                </div>
              </FormField>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          Намотать
        </Button>
      </motion.form>
    </div>
  );
}
