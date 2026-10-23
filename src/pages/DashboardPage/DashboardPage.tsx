import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { createTask, type NewTaskData } from '@/services/tasksService';

type Task = {
  id: string;
  description: string;
  inn: string;
  phone: string;
  status: 'new' | 'in_progress' | 'completed' | 'waiting';
};

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  async function handleCreateTask(data: NewTaskData) {
    const createdTask = await createTask(data);

    setTasks((currentTasks) => [...currentTasks, createdTask as Task]);
  }

  return <Dashboard tasks={tasks} onCreateTask={handleCreateTask} />;
}
