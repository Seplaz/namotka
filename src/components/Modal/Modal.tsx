import styles from '@/components/Modal/Modal.module.css';
import { ReactNode } from 'react';

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
};


