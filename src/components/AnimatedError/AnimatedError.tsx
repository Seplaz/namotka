import styles from '@/components/AnimatedError/AnimatedError.module.css';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type AnimatedErrorProps = {
  id?: string;
  message: string;
};

const errorVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    y: -4,
  },
  visible: {
    opacity: 1,
    height: 'auto',
    y: 0,
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -4,
  },
};

const errorTransition = {
  height: {
    duration: 0.15,
    ease: 'easeInOut' as const,
  },
  opacity: {
    duration: 0.15,
    ease: 'easeOut' as const,
  },
  y: {
    duration: 0.15,
    ease: 'easeOut' as const,
  },
};

export function AnimatedError({ id, message }: AnimatedErrorProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          key="error"
          id={id}
          className={styles.error}
          role="alert"
          variants={errorVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={shouldReduceMotion ? { duration: 0 } : errorTransition}
          style={{ overflow: 'hidden' }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
