import styles from '@/components/NewTask/NewTask.module.css';
import { useEffect, useState, type FormEvent } from 'react';
import { useToast } from '@/hooks/useToast';
import type { NewTaskData } from '@/services/tasksService';
import { getSpecialists, type Specialist } from '@/services/profileService';
import { X, Check } from 'lucide-react';
import { FormField } from '@/components/FormField/FormField';
import { Input } from '@/components/Input/Input';
import { Textarea } from '@/components/Textarea/Textarea';
import {
  RadioGroup,
  type RadioOption,
} from '@/components/RadioGroup/RadioGroup';
import { Select, type SelectOption } from '@/components/Select/Select';
import { Button } from '@/components/Button/Button';
import { AnimatedError } from '@/components/AnimatedError/AnimatedError';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type TaskPriority = 'low' | 'medium' | 'high';

const priorityOptions: RadioOption<TaskPriority>[] = [
  { value: 'low', label: 'Низкая' },
  { value: 'medium', label: 'Средняя' },
  { value: 'high', label: 'Высокая' },
];

type NewTaskProps = {
  onClose: () => void;
  onSubmit: (data: NewTaskData) => Promise<void>;
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

export function NewTask({ onClose, onSubmit }: NewTaskProps) {
  const { showToast } = useToast();
  const [inn, setInn] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [scheduleCall, setScheduleCall] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [innError, setInnError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [scheduleError, setScheduleError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [specialistId, setSpecialistId] = useState<string>('');
  const [isLoadingSpecialists, setIsLoadingSpecialists] = useState(true);
  const [specialistsError, setSpecialistsError] = useState('');

  function normalizePhone(value: string): string | null {
    const digits = value.replace(/\D/g, '');

    if (digits.length === 10) {
      return `8${digits}`;
    }

    if (digits.length === 11 && digits.startsWith('7')) {
      return `8${digits.slice(1)}`;
    }

    if (digits.length === 11 && digits.startsWith('8')) {
      return digits;
    }

    return null;
  }

  const isScheduleValid =
    !scheduleCall ||
    (scheduledDate !== '' &&
      scheduledTime !== '' &&
      scheduledDate >= getLocalDate());

  const isFormValid =
    /^(\d{10}|\d{12})$/.test(inn.trim()) &&
    normalizePhone(phone) !== null &&
    description.trim() !== '' &&
    isScheduleValid;

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
      label: specialist.username,
    }),
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const normalizedInn = inn.trim();
    const normalizedPhone = normalizePhone(phone);
    const normalizedDescription = description.trim();

    const isInnValid = /^(\d{10}|\d{12})$/.test(normalizedInn);

    setInnError(isInnValid ? '' : 'ИНН должен содержать 10 или 12 цифр');

    setPhoneError(normalizedPhone ? '' : 'Введите корректный номер телефона');

    if (!isInnValid || !normalizedPhone || !normalizedDescription) {
      return;
    }

    if (scheduleCall && (!scheduledDate || !scheduledTime)) {
      setScheduleError('Укажите дату и время звонка');
      return;
    }

    setScheduleError('');

    let scheduledAt: string | null = null;

    if (scheduleCall) {
      const localDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

      if (Number.isNaN(localDateTime.getTime())) {
        setScheduleError('Укажите корректную дату и время');
        return;
      }

      if (localDateTime.getTime() <= Date.now()) {
        setScheduleError('Дата и время звонка должны быть в будущем');
        return;
      }

      scheduledAt = localDateTime.toISOString();
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        inn: normalizedInn,
        phone: normalizedPhone,
        description: normalizedDescription,
        scheduledAt,
        assignedTo: specialistId || null,
        priority,
      });

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

  function getLocalDate(offset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function handleDateChange(value: string) {
    setScheduledDate(value);
    setScheduleError('');

    if (!value) {
      setScheduledTime('');
    }
  }

  const shouldReduceMotion = useReducedMotion();

  const formAnimation = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : formVariants;

  return (
    <div className={styles.new}>
      <motion.form
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
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <FormField label="ИНН" htmlFor="inn">
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
              const value = event.target.value.replace(/\D/g, '').slice(0, 12);
              setInn(value);
              setInnError(
                value.length > 0 && value.length !== 10 && value.length !== 12
                  ? 'ИНН должен содержать 10 или 12 цифр'
                  : '',
              );
            }}
            aria-invalid={Boolean(innError)}
            aria-describedby={innError ? 'inn-error' : undefined}
            required
          />
          <AnimatedError id="inn-error" message={innError} />
        </FormField>

        <FormField label="Телефон" htmlFor="phone">
          <Input
            id="phone"
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (900) 123-45-67"
            value={phone}
            onChange={(event) => {
              const value = event.target.value;
              setPhone(value);

              if (!value.trim()) {
                setPhoneError('');
                return;
              }

              setPhoneError(
                normalizePhone(value) ? '' : 'Введите номер из 10 или 11 цифр',
              );
            }}
            aria-invalid={Boolean(phoneError)}
            aria-describedby={phoneError ? 'phone-error' : undefined}
            required
          />
          <AnimatedError id="phone-error" message={phoneError} />
        </FormField>

        <FormField label="Суть намотки" htmlFor="description">
          <Textarea
            id="description"
            name="description"
            placeholder="Что нужно сделать?"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            maxLength={1000}
            showCounter
            required
          />
        </FormField>

        <FormField label="Важность намотки" htmlFor="priority">
          <RadioGroup
            name="priority"
            value={priority}
            onChange={setPriority}
            options={priorityOptions}
          />
        </FormField>

        <FormField label="Кого будем наматывать?" htmlFor="specialist">
          <Select
            id="specialist"
            name="specialist"
            value={specialistId}
            onChange={setSpecialistId}
            options={specialistOptions}
            placeholder={
              isLoadingSpecialists
                ? 'Никого, общая намотка'
                : specialists.length === 0
                  ? 'Нет доступных намотантов'
                  : 'Никого, общая намотка'
            }
            disabled={isLoadingSpecialists || specialists.length === 0}
            error={specialistsError || undefined}
          />
        </FormField>

        <label className={styles.schedule}>
          <input
            type="checkbox"
            checked={scheduleCall}
            onChange={(event) => {
              const checked = event.target.checked;
              setScheduleCall(checked);

              if (!checked) {
                setScheduledDate('');
                setScheduledTime('');
                setScheduleError('');
              }
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
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={scheduleVariants}
              transition={
                shouldReduceMotion ? { duration: 0 } : scheduleTransition
              }
              style={{ overflow: 'hidden' }}
            >
              <FormField label="Дата звонка" htmlFor="scheduledDate">
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
                    required
                  />

                  <Input
                    className={styles.time}
                    id="scheduledTime"
                    type="time"
                    name="scheduledTime"
                    value={scheduledTime}
                    onChange={(event) => {
                      setScheduledTime(event.target.value);
                      setScheduleError('');
                    }}
                    disabled={!scheduledDate}
                    aria-label="Время звонка"
                    required
                  />
                </div>
                <AnimatedError message={scheduleError} />
              </FormField>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Отправляем намотку...' : 'Намотать'}
        </Button>
      </motion.form>
    </div>
  );
}
