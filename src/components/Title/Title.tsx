import styles from '@/components/Title/Title.module.css';
import { motion, useReducedMotion } from 'motion/react';

type TitleProps = {
  children: string;
  className?: string;
};

const titleVariants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0 },
  transition: {
    duration: 0.45,
    ease: 'easeOut' as const,
  },
};

export function Title({ children, className }: TitleProps) {
  const shouldReduceMotion = useReducedMotion();

  const titleAnimation = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : titleVariants;

  return (
    <motion.h1
      className={`${styles.title} ${className ?? ''}`}
      variants={titleAnimation}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.h1>
  );
}
