import styles from '@/components/Register/Register.module.css';
import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { Title } from '@/components/Title/Title';
import { FormField } from '@/components/FormField/FormField';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { Link } from '@/components/Link/Link';

export function Register() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.register}>
      <Title className={styles.title}>Регистрация</Title>
      <form className={styles.form}>
        <FormField label="Имя" htmlFor="name">
          <Input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={60}
            pattern="[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё '\u002D]{1,59}"
            title="Допустимы только кириллица или латиница, пробелы, дефис и апостроф"
          />
          <span className={styles.hint}>
            Кириллица или латиница, пробелы, дефис и апостроф
          </span>
        </FormField>
        <FormField label="Логин" htmlFor="login">
          <Input
            id="login"
            type="text"
            name="login"
            autoComplete="username"
            required
            minLength={3}
            maxLength={30}
            pattern="[A-Za-z0-9_]{3,30}"
            title="От 3 до 30 символов: латинские буквы, цифры и _"
          />
          <span className={styles.hint}>
            От 3 до 30 символов: латинские буквы, цифры и _
          </span>
        </FormField>
        <FormField label="Пароль" htmlFor="password">
          <div className={styles.password}>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
            />

            <button
              type="button"
              className={styles.eye}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              aria-pressed={showPassword}
            >
              {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
            </button>
          </div>
          <span className={styles.hint}>
            Минимум 8 символов: латинские буквы, цифры и спецсимволы
          </span>
        </FormField>

        <Button type="submit">Зарегистрироваться</Button>
        <Link href="/login">Войти</Link>
      </form>
    </div>
  );
}
