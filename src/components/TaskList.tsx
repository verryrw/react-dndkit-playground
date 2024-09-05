import { SortableContext } from '@dnd-kit/sortable';
import { Task } from '../types/Task';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
}
export default function TaskList({ tasks }: TaskListProps) {
  const tasksId = tasks.map((task) => task.id);

  return (
    <div className="mt-4 flex flex-col gap-2">
      <SortableContext items={tasksId}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}
