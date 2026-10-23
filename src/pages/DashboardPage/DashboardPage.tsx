import { Dashboard } from '@/components/Dashboard/Dashboard';

export function DashboardPage() {
  const tasks = [
    // {
    //   id: 1,
    //   description: 'Помочь с регистрацией в Диадоке',
    //   inn: '6658497833',
    //   phone: '88005000899',
    //   status: 'new' as const,
    // },
    // {
    //   id: 2,
    //   description: 'Сделать МЧД на сотрудника для ЭДО и Логистики',
    //   inn: '6658497833',
    //   phone: '88005000899',
    //   status: 'in_progress' as const,
    // },
  ];

  function handleCreateTask() {
    // модальное окно
  }

  return <Dashboard tasks={tasks} onCreateTask={handleCreateTask} />;
}
