import styles from '@/components/NewTask/NewTask.module.css';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import type { NewTaskData } from '@/services/tasksService';
import { getSpecialists, type Specialist } from '@/services/profileService';
import {
  searchClients,
  findOrCreateClient,
  type Client,
} from '@/services/clientsService';
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
import { AnimatedError } from '@/components/AnimatedError/AnimatedError';
import {
  getLocalDate,
  normalizePhone,
  parseClientQuery,
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

type ClientSearchStatus = 'idle' | 'searching' | 'not-found' | 'error';

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

function formatClientQuery(client: Client): string {
  const requisites = client.kpp ? `${client.inn}-${client.kpp}` : client.inn;

  return `${requisites} ${client.name}`;
}

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
    clientQuery,
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

  const [clientSuggestions, setClientSuggestions] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearchStatus, setClientSearchStatus] =
    useState<ClientSearchStatus>('idle');
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);

  const clientSectionRef = useRef<HTMLDivElement>(null);

  const validationErrors: NewTaskErrors = hasSubmitted
    ? validateNewTask(draft)
    : {};

  const clientStatusMessage = selectedClient
    ? 'Клиент выбран'
    : clientQuery.trim().length < 2
      ? ''
      : clientSearchStatus === 'searching'
        ? 'Ищем совпадения...'
        : clientSearchStatus === 'not-found'
          ? 'Совпадений не найдено. Если клиент новый, он будет создан при создании намотки.'
          : clientSearchStatus === 'error'
            ? 'Не удалось выполнить поиск. При отправке формы система повторно проверит клиента и создаст его при необходимости.'
            : '';

  const clientStatusVariant = selectedClient
    ? 'success'
    : clientSearchStatus === 'error'
      ? 'error'
      : 'info';

  function updateDraft<K extends keyof NewTaskDraft>(
    field: K,
    value: NewTaskDraft[K],
  ) {
    onDraftChange({
      ...draft,
      [field]: value,
    });
  }

  // Поиск клиентов по неполному ИНН, КПП или названию.
  // Изменений в базе данных здесь не происходит.
  useEffect(() => {
    const query = clientQuery.trim();

    if (query.length < 2 || selectedClient) {
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(async () => {
      setClientSearchStatus('searching');

      try {
        const results = await searchClients(query);

        if (cancelled) return;

        setClientSuggestions(results);
        setClientSearchStatus(results.length > 0 ? 'idle' : 'not-found');
        setIsClientMenuOpen(true);
      } catch (error) {
        console.error('Ошибка поиска клиентов:', error);

        if (!cancelled) {
          setClientSuggestions([]);
          setClientSearchStatus('error');
          setIsClientMenuOpen(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [clientQuery, selectedClient]);

  // Закрытие списка при клике за пределами поля клиента.
  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (
        clientSectionRef.current &&
        !clientSectionRef.current.contains(event.target as Node)
      ) {
        setIsClientMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, []);

  // Загрузка доступных специалистов.
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

  function handleClientQueryChange(value: string) {
    updateDraft('clientQuery', value);

    setSelectedClient(null);
    setClientSuggestions([]);
    setClientSearchStatus('idle');
    setIsClientMenuOpen(false);
  }

  function handleSelectClient(client: Client) {
    setSelectedClient(client);
    setClientSuggestions([]);
    setClientSearchStatus('idle');
    setIsClientMenuOpen(false);

    updateDraft('clientQuery', formatClientQuery(client));
  }

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

    const parsedClient = parseClientQuery(clientQuery);
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) return;

    const scheduledAt =
      scheduleCall && scheduledDate && scheduledTime
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : null;

    setIsSubmitting(true);

    try {
      // Ищем существующего клиента или создаём нового.
      const clientResult = await findOrCreateClient(
        parsedClient.inn,
        parsedClient.kpp || null,
        parsedClient.name,
      );

      // Создаём намотку с полученным client_id.
      await onSubmit({
        clientId: clientResult.client.id,
        contactName: '',
        phone: normalizedPhone,
        description: description.trim(),
        scheduledAt,
        assignedTo: specialistId || null,
        priority,
      });

      onDraftChange({ ...initialTaskDraft });
      setHasSubmitted(false);
      setSelectedClient(null);
      setClientSuggestions([]);
      setClientSearchStatus('idle');
      setIsClientMenuOpen(false);

      showToast({
        type: 'success',
        message: 'Намотка успешно создана.',
      });

      onClose();
    } catch (error) {
      console.error('Ошибка создания намотки:', error);

      showToast({
        type: 'error',
        message:
          'Не удалось создать намотку. Проверьте данные и повторите попытку.',
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
            disabled={isSubmitting}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Клиент */}
        <FormField
          label="Клиент"
          htmlFor="clientQuery"
          error={validationErrors.client}
        >
          <div className={styles.clientInputWrapper} ref={clientSectionRef}>
            <Input
              id="clientQuery"
              type="text"
              name="clientQuery"
              autoComplete="off"
              placeholder="Введите ИНН, КПП или название организации"
              value={clientQuery}
              onChange={(event) => handleClientQueryChange(event.target.value)}
              onFocus={() => {
                if (clientSuggestions.length > 0) {
                  setIsClientMenuOpen(true);
                }
              }}
              aria-invalid={Boolean(validationErrors.client)}
              aria-describedby={
                clientStatusMessage ? 'client-status' : undefined
              }
              aria-expanded={isClientMenuOpen}
              aria-controls="client-suggestions"
              role="combobox"
              disabled={isSubmitting}
            />

            <AnimatePresence>
              {isClientMenuOpen && clientSuggestions.length > 0 && (
                <motion.div
                  id="client-suggestions"
                  className={styles.clientResults}
                  role="listbox"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.12 }}
                >
                  {clientSuggestions.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      role="option"
                      aria-selected={selectedClient?.id === client.id}
                      className={styles.clientResult}
                      onPointerDown={(event) => event.preventDefault()}
                      onClick={() => handleSelectClient(client)}
                    >
                      <span className={styles.clientResultName}>
                        {client.name}
                      </span>

                      <span className={styles.clientResultMeta}>
                        ИНН: {client.inn}
                        {client.kpp ? ` · КПП: ${client.kpp}` : ''}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatedError
            id="client-status"
            variant={clientStatusVariant}
            message={clientStatusMessage}
          />
        </FormField>

        {/* Телефон */}
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
            disabled={isSubmitting}
          />
        </FormField>

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
            disabled={isSubmitting}
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
            disabled={
              isSubmitting || isLoadingSpecialists || specialists.length === 0
            }
            aria-describedby={specialistsError ? 'specialist-error' : undefined}
          />
        </FormField>

        <label className={styles.schedule}>
          <input
            type="checkbox"
            checked={scheduleCall}
            disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={!scheduledDate || isSubmitting}
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
