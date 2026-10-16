import styles from '@/pages/DashboardPage/DashboardPage.module.css';
import { TaskColumn } from '@/components/TaskColumn/TaskColumn';
import { Button } from '@/components/Button/Button';
import { TaskCard } from '@/components/TaskCard/TaskCard';

export function DashboardPage() {
  return (
    <main className={styles.dashboard}>
      <TaskColumn title="Новые">
        <TaskCard
          id={228}
          description="Помочь с регистрацией в Диадоке"
          inn="6658497833"
          phone="88005000899"
          status="new"
        />

        <TaskCard
          id={228}
          description="Помочь с регистрацией в Диадоке"
          inn="6658497833"
          phone="88005000899"
          status="completed"
        />

        <TaskCard
          id={228}
          description="Помочь с регистрацией в Диадоке"
          inn="6658497833"
          phone="88005000899"
          status="waiting"
        />
      </TaskColumn>
      <TaskColumn title="В работе">
        <TaskCard
          id={228}
          description="Помочь с регистрацией в Диадоке, сделать МЧД на сотрудника для ЭДО и Логистики"
          inn="6658497833"
          phone="88005000899"
          status="in_progress"
        />
      </TaskColumn>
      <Button type="button">
        Новая намотка
      </Button>
    </main>
  );
}
