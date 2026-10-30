import styles from './CopyButton.module.css';
import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type CopyButtonProps = {
  value: string;
  label: string;
};

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 1500);
    } catch (error) {
      console.error('Не удалось скопировать значение:', error);
    }
  }

  return (
    <button
      type="button"
      className={styles.copy}
      onClick={handleCopy}
      aria-label={copied ? `${label}: скопировано` : `Скопировать ${label}`}
      title={copied ? 'Скопировано' : `Скопировать ${label}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'check' : 'copy'}
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.7 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.1,
            ease: 'easeOut',
          }}
          className={styles.icon}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}