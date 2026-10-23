import styles from '@/components/Modal/Modal.module.css';
import { type ReactNode, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
  titleId?: string;
};

export function Modal({ onClose, children, titleId }: ModalProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: 'easeOut' as const };

  return (
    <motion.div
      className={styles.overlay}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={transition}
      onMouseDown={handleBackdropClick}
    >
      <motion.div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
