import styles from '@/pages/Login/Login.module.css';
import { Title } from '@/components/Title/Title';
import { FormField } from '@/components/FormField/FormField';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { Link } from '@/components/Link/Link';

export function Login() {
  return (
    <div className={styles.login}>
      <Title className={styles.title}>Добро пожаловать</Title>
      <form className={styles.form}>
        <FormField label="Логин" htmlFor="login">
          <Input id="login" type="text" name="login" autoComplete="username" />
        </FormField>
        <FormField label="Пароль" htmlFor="password">
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
          />
        </FormField>

        <Button type="submit">Войти</Button>
        <Link href="/register">Зарегистрироваться</Link>
      </form>
    </div>
  );
}
