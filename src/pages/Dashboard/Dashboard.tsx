import { TaskColumn } from '@/components/TaskColumn/TaskColumn';
import styles from '@/pages/Dashboard/Dashboard.module.css';

export function Dashboard() {
  return (
    <main className={styles.dashboard}>
      <TaskColumn title="Новые">
        <div></div>
      </TaskColumn>
      <TaskColumn title="В работе">
        <div></div>
      </TaskColumn>
      <TaskColumn title="Завершённые">
        <div></div>
      </TaskColumn>
    </main>
  );
}
