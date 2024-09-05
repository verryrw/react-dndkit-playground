import { useSortable } from '@dnd-kit/sortable';
import { ColumnType } from '../types/ColumnType';
import { Task } from '../types/Task';
import TaskList from './TaskList';
import { CSS } from '@dnd-kit/utilities';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

export default function Column({ column, tasks }: ColumnProps) {
  const { setNodeRef, transform, transition } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="bg-gray-600 min-h-[30rem] min-w-[18rem] rounded-md p-4">
      <h1 className="uppercase font-bold text-white text-center">{column.title}</h1>
      <TaskList tasks={tasks} />
    </div>
  );
}
