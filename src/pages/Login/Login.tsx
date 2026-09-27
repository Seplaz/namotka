import styles from '@/pages/Login/Login.module.css';
import { Title } from '@/components/Title/Title';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';

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
      </div>
    </div>
  );
}
