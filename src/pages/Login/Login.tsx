import styles from '@/pages/Login/Login.module.css';
import { Input } from '@/components/Input/Input';

export function Login() {
  return (
    <div className={styles.page}>
      <p className={styles.title}>Добро пожаловать в NAMOTKA</p>
      <div className={styles.login}>
        <Input type='text' name='login' placeholder='Логин' autoComplete='username' />
        <Input type='password' name='password' placeholder='Пароль' autoComplete='current-password' />
      </div>
    </div>
  );
}
