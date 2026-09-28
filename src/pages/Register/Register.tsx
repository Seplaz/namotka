import styles from '@/pages/Register/Register.module.css';
import { Title } from '@/components/Title/Title';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { Link } from '@/components/Link/Link';

export function Register() {
  return (
    <div className={styles.register}>
      <Title className={styles.title}>Регистрация в NAMOTKA</Title>
      <div className={styles.form}>
        <Input
          type="text"
          name="login"
          placeholder="Логин"
          autoComplete="username"
        />
        <Input
          type="password"
          name="password"
          placeholder="Пароль"
          autoComplete="new-password"
        />
        <Input
          type="password"
          name="passwordConfirm"
          placeholder="Повторите пароль"
          autoComplete="new-password"
        />
        <Button type="submit">Зарегистрироваться</Button>
        <Link href="/login">Войти</Link>
      </div>
    </div>
  );
}
