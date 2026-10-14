import styles from '@/components/NewTask/NewTask.module.css';
import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { Title } from '@/components/Title/Title';
import { FormField } from '@/components/FormField/FormField';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';

type NewTaskProps = {
  onClose: () => void;
};

export function NewTask({ onClose }: NewTaskProps) {
  const [inn, setInn] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
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

  return (
    <div className={styles.new}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <Title className={styles.title}>Новая намотка</Title>
          <button type="button" className={styles.close} onClick={onClose}>
            <X size={16} />
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
          <Input
            id="description"
            type="text"
            name="description"
            placeholder="Кратко опишите задачу"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </FormField>

        <FormField
          label="Когда позвонить? (необязательно)"
          htmlFor="scheduledDate"
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
            />
          </div>
          <div className={styles.actions}>
            <Button
              type="button"
              className={styles.quickDate}
              onClick={() => handleDateChange(getLocalDate())}
            >
              Сегодня
            </Button>

            <Button
              type="button"
              className={styles.quickDate}
              onClick={() => handleDateChange(getLocalDate(1))}
            >
              Завтра
            </Button>
          </div>
        </FormField>

        <p className={styles.hint}>
          Можно оставить пустым, если звонок не запланирован.
        </p>

        <Button type="submit" disabled={!isFormValid}>
          Намотать
        </Button>
      </form>
    </div>
  );
}
