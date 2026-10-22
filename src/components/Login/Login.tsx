import styles from '@/components/Login/Login.module.css';
import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { Title } from '@/components/Title/Title';
import { FormField } from '@/components/FormField/FormField';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { Link } from '@/components/Link/Link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import type { FormEvent } from 'react';

const formVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.45,
    ease: 'easeOut' as const,
  },
};

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const formAnimation = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : formVariants;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`Ошибка входа: ${error.message}`);
      return;
    }

    alert('Вход успешно выполнен!');
  }

  return (
    <div className={styles.login}>
      <Title className={styles.title}>Добро пожаловать</Title>
      <motion.form
        className={styles.form}
        variants={formAnimation}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
      >
        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </FormField>
        <FormField label="Пароль" htmlFor="password">
          <div className={styles.password}>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className={styles.eye}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              aria-pressed={showPassword}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={showPassword ? 'eye' : 'eye-closed'}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </FormField>

        <Button type="submit">Войти</Button>
        <Link to="/register">Зарегистрироваться</Link>
      </motion.form>
    </div>
  );
}
