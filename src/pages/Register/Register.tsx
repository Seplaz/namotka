import styles from '@/pages/Register/Register.module.css';
import { Title } from '@/components/Title/Title';
import { FormField } from '@/components/FormField/FormField';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { Link } from '@/components/Link/Link';

export function Register() {
  return (
    <div className={styles.register}>
      <Title className={styles.title}>Регистрация в NAMOTKA</Title>
      <form className={styles.form}>
        <FormField label="Имя" htmlFor="name">
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="Мамут Рахал"
            autoComplete="name"
          />
        </FormField>
        <FormField label="Логин" htmlFor="login">
          <Input
            id="login"
            type="text"
            name="login"
            placeholder="mamut_rahal"
            autoComplete="username"
          />
        </FormField>
        <FormField label="Пароль" htmlFor="password">
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </FormField>

        <Button type="submit">Зарегистрироваться</Button>
        <Link href="/login">Войти</Link>
      </form>
    </div>
  );
}
