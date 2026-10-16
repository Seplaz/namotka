import styles from '@/components/Register/Register.module.css';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
            placeholder="Рулон Обоев"
          />
        </FormField>
        <FormField label="Логин" htmlFor="login">
          <Input
            id="login"
            type="text"
            name="login"
            autoComplete="username"
            placeholder="rulon_oboev"
          />
        </FormField>
        <FormField label="Пароль" htmlFor="password">
          <div className={styles.password}>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              required
              placeholder="Минимум 8 символов"
            />

            <button
              type="button"
              className={styles.eye}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </FormField>

        <Button type="submit">Зарегистрироваться</Button>
        <Link href="/login">Войти</Link>
      </form>
    </div>
  );
}
