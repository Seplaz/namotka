import styles from '@/components/Register/Register.module.css';
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

const EMAIL_DOMAIN_ERROR =
  'Регистрация доступна только с почтой @kontur-irkutsk.ru или @kontur-store.ru';

function isCorporateEmail(email: string): boolean {
  return /^[^\s@]+@(?:kontur-irkutsk\.ru|kontur-store\.ru)$/i.test(
    email.trim(),
  );
}

export function Register() {
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    firstName.trim().length >= 2 &&
    firstName.trim().length <= 60 &&
    lastName.trim().length >= 2 &&
    lastName.trim().length <= 60 &&
    isCorporateEmail(email) &&
    password.length >= 8 &&
    password.length <= 128;

  const shouldReduceMotion = useReducedMotion();

  const formAnimation = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : formVariants;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid || isSubmitting) return;

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedEmail = email.trim();

    if (!isCorporateEmail(normalizedEmail)) {
      setEmailError(EMAIL_DOMAIN_ERROR);
      return;
    }

    setEmailError('');
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            first_name: normalizedFirstName,
            last_name: normalizedLastName,
          },
        },
      });

      if (error) {
        if (error.code === 'over_email_send_rate_limit') {
          showToast({
            type: 'warning',
            message: 'Слишком много попыток отправки письма, попробуйте позже',
          });
        } else if (
          error.code === 'user_already_exists' ||
          error.code === 'email_exists'
        ) {
          showToast({
            type: 'error',
            message: 'Возможно, аккаунт уже существует, попробуйте войти',
          });
        } else {
          showToast({
            type: 'error',
            message: 'Не удалось зарегистрироваться, попробуйте позже',
          });
        }

        return;
      }

      if (data.user && data.user.identities?.length === 0) {
        showToast({
          type: 'error',
          message: 'Этот email уже зарегистрирован, попробуйте войти',
        });

        return;
      }

      if (data.session) {
        showToast({
          type: 'success',
          message: 'Регистрация прошла успешно',
        });
      } else {
        showToast({
          type: 'warning',
          message: 'Проверьте электронную почту для подтверждения аккаунта',
        });
      }
    } catch {
      showToast({
        type: 'error',
        message: 'Ошибка соединения, проверьте интернет и попробуйте ещё раз',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.register}>
      <Title className={styles.title}>Регистрация</Title>

      <motion.form
        className={styles.form}
        variants={formAnimation}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
      >
        <FormField label="Имя" htmlFor="first-name">
          <Input
            id="first-name"
            type="text"
            name="given-name"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
            minLength={2}
            maxLength={60}
          />
        </FormField>

        <FormField label="Фамилия" htmlFor="last-name">
          <Input
            id="last-name"
            type="text"
            name="family-name"
            autoComplete="family-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
            minLength={2}
            maxLength={60}
          />
        </FormField>

        <FormField label="Электронная почта" htmlFor="email" error={emailError}>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              const value = event.target.value;
              setEmail(value);

              if (!value.trim()) {
                setEmailError('');
                return;
              }

              setEmailError(isCorporateEmail(value) ? '' : EMAIL_DOMAIN_ERROR);
            }}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? 'email-error' : undefined}
            required
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
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
                  transition={{ duration: 0.1, ease: 'easeOut' }}
                >
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </FormField>

        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          loading={isSubmitting}
          loadingText="Регистрируем…"
        >
          Зарегистрироваться
        </Button>

        <Link to="/login">Войти</Link>
      </motion.form>
    </div>
  );
}
