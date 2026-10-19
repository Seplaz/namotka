import styles from '@/components/Register/Register.module.css';
import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { Title } from '@/components/Title/Title';
import { FormField } from '@/components/FormField/FormField';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { Link } from '@/components/Link/Link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

const formVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.45,
    ease: 'easeOut' as const,
  },
};

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const formAnimation = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : formVariants;

  return (
    <div className={styles.register}>
      <Title className={styles.title}>Регистрация</Title>
      <motion.form
        className={styles.form}
        variants={formAnimation}
        initial="hidden"
        animate="visible"
      >
        <FormField label="Имя" htmlFor="name">
          <Input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={60}
            pattern="[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё '\u002D]{1,59}"
            title="Допустимы только кириллица или латиница, пробелы, дефис и апостроф"
          />
          <span className={styles.hint}>
            Кириллица или латиница, пробелы, дефис и апостроф
          </span>
        </FormField>
        <FormField label="Логин" htmlFor="login">
          <Input
            id="login"
            type="text"
            name="login"
            autoComplete="username"
            required
            minLength={3}
            maxLength={30}
            pattern="[A-Za-z0-9_]{3,30}"
            title="От 3 до 30 символов: латинские буквы, цифры и _"
          />
          <span className={styles.hint}>
            От 3 до 30 символов: латинские буквы, цифры и _
          </span>
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
          <span className={styles.hint}>
            Минимум 8 символов: латинские буквы, цифры и спецсимволы
          </span>
        </FormField>

        <Button type="submit">Зарегистрироваться</Button>
        <Link href="/login">Войти</Link>
      </motion.form>
    </div>
  );
}
