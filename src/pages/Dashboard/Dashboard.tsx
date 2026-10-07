import styles from '@/pages/Dashboard/Dashboard.module.css';
import { TaskColumn } from '@/components/TaskColumn/TaskColumn';
import { TaskStatus } from '@/components/TaskStatus/TaskStatus';
import { Button } from '@/components/Button/Button';

export function Dashboard() {
  return (
    <main className={styles.dashboard}>
      <TaskColumn title="Новые">
        <TaskStatus status="new" />
        <TaskStatus status="waiting" />
        <TaskStatus status="in_progress" />
        <TaskStatus status="completed" />
      </TaskColumn>
      <TaskColumn>
        <div></div>
      </TaskColumn>
      <Button className={styles.button} type="button">Новая намотка</Button>
    </main>
  );
}
