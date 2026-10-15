import styles from '@/components/NewTask/NewTask.module.css';
import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { FormField } from '@/components/FormField/FormField';
import { Input } from '@/components/Input/Input';
import { Textarea } from '../Textarea/Textarea';
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
          <h2 className={styles.title}>Новая намотка</h2>
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
          <Textarea
            id="description"
            name="description"
            placeholder="Кратко опишите задачу"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            maxLength={1000}
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
        </FormField>

        <Button type="submit" disabled={!isFormValid}>
          Намотать
        </Button>
      </form>
    </div>
  );
}
