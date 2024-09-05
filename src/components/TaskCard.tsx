import { useState } from 'react';
import { Task } from '../types/Task';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: isEditing,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-yellow-500 p-2 rounded-md card-item shadow-md min-h-24 hover:cursor-grab hover:shadow-xl transition duration-200"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-yellow-500 p-2 rounded-md card-item shadow-md min-h-24 hover:cursor-grab hover:shadow-xl transition duration-200">
      {task.content}
    </div>
  );
}
