import styles from '@/components/Login/Login.module.css';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Title } from '@/components/Title/Title';
import { FormField } from '@/components/FormField/FormField';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { Link } from '@/components/Link/Link';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.login}>
      <Title className={styles.title}>Добро пожаловать</Title>
      <form className={styles.form}>
        <FormField label="Логин" htmlFor="login">
          <Input
            id="login"
            type="text"
            name="login"
            autoComplete="username"
            placeholder="Введите логин"
          />
        </FormField>
        <FormField label="Пароль" htmlFor="password">
          <div className={styles.password}>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="Введите пароль"
              required
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

        <Button type="submit">Войти</Button>
        <Link href="/register">Зарегистрироваться</Link>
      </form>
    </div>
  );
}
