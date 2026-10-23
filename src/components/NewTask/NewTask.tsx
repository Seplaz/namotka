import styles from '@/components/NewTask/NewTask.module.css';
import { useState, type FormEvent } from 'react';
import { X, Check } from 'lucide-react';
import { FormField } from '@/components/FormField/FormField';
import { Input } from '@/components/Input/Input';
import { Textarea } from '../Textarea/Textarea';
import { Button } from '@/components/Button/Button';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type NewTaskProps = {
  onClose: () => void;
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

export function NewTask({ onClose }: NewTaskProps) {
  const [inn, setInn] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleCall, setScheduleCall] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const isFormValid =
    inn.trim() !== '' && phone.trim() !== '' && description.trim() !== '';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) return;

    console.log({
      inn: inn.trim(),
      phone: phone.trim(),
      description: description.trim(),
      scheduledDate: scheduledDate || null,
      scheduledTime: scheduledTime || null,
    });
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
            placeholder="Введите ИНН"
            value={inn}
            onChange={(event) => setInn(event.target.value)}
            required
          />
        </FormField>

        <FormField label="Телефон" htmlFor="phone">
          <Input
            id="phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="Введите номер"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
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
            required
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
                    onChange={(event) => setScheduledTime(event.target.value)}
                    disabled={!scheduledDate}
                    aria-label="Время звонка"
                    required
                  />
                </div>
              </FormField>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" disabled={!isFormValid}>
          Намотать
        </Button>
      </motion.form>
    </div>
  );
}
