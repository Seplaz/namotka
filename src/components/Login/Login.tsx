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
import { useToast } from '@/hooks/useToast';

const formVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.45,
    ease: 'easeOut' as const,
  },
};

export function Login() {
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && password.length > 0;

  const shouldReduceMotion = useReducedMotion();

  const formAnimation = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : formVariants;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.code === 'email_not_confirmed') {
          showToast({
            type: 'warning',
            message: 'Необходимо подтвердить email по ссылке из письма, чтобы войти.',
          });
        } else if (error.code === 'invalid_credentials') {
          showToast({
            type: 'error',
            message: 'Неверный email или пароль.',
          });
        } else {
          showToast({
            type: 'error',
            message: 'Не удалось войти. Попробуй ещё раз позже.',
          });
        }

        return;
      }

      if (!data.user) {
        showToast({
          type: 'error',
          message: 'Не удалось получить данные пользователя.',
        });
        return;
      }

      showToast({
        type: 'success',
        message: 'Вход выполнен успешно.',
      });
    } catch {
      showToast({
        type: 'error',
        message: 'Ошибка соединения. Проверь интернет и попробуй ещё раз.',
      });
    } finally {
      setIsSubmitting(false);
    }
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
                  transition={{
                    duration: 0.1,
                    ease: 'easeOut',
                  }}
                >
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </FormField>

        <Button type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Входим...' : 'Войти'}
        </Button>

        <Link to="/register">Зарегистрироваться</Link>
      </motion.form>
    </div>
  );
}
