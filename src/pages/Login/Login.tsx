import styles from '@/pages/Login/Login.module.css';
import { Title } from '@/components/Title/Title';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { Link } from '@/components/Link/Link';

export function Login() {
  return (
    <div className={styles.page}>
      <Title className={styles.title}>Добро пожаловать в NAMOTKA</Title>
      <div className={styles.login}>
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
          autoComplete="current-password"
        />
        <Button type="submit">Войти</Button>
        <Link href="/register">Зарегистрироваться</Link>
      </div>
    </div>
  );
}
