import { useState } from 'react';
import { Task } from '../types/Task';
import Column from './Column';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import TaskCard from './TaskCard';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { ColumnType } from '../types/ColumnType';

export default function KanbanBoard() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [columns] = useState<ColumnType[]>([
    { id: 'col-waiting', title: 'Waiting' },
    { id: 'col-design', title: 'Design' },
    { id: 'col-profing', title: 'Profing' },
  ]);
  const columnsId = columns.map((column) => column.id);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 'task-1', columnId: 'col-waiting', content: 'task 1' },
    { id: 'task-2', columnId: 'col-design', content: 'task 2' },
    { id: 'task-3', columnId: 'col-profing', content: 'task 3' },
    { id: 'task-4', columnId: 'col-profing', content: 'task 4' },
    { id: 'task-5', columnId: 'col-profing', content: 'task 5' },
  ]);

  const filterTasks = (columnId: string) => {
    const filteredTasks: Task[] = tasks.filter((task) => task.columnId === columnId);
    return filteredTasks;
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current?.task);
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { over } = event;
    if (!over) return;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    console.log(over);
    if (!over) return;
    if (active.id === over.id) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        const overIndex = tasks.findIndex((task) => task.id === over.id);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        tasks[activeIndex].columnId = over.id as string;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}>
      <div className="flex gap-4 max-w-7xl mx-auto overflow-hidden p-4 border-2 border-gray-800 rounded-md">
        <SortableContext items={columnsId}>
          {columns.map((column) => (
            <Column key={column.id} column={column} tasks={filterTasks(column.id)} />
          ))}
        </SortableContext>

        {createPortal(
          <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>,
          document.body,
        )}
      </div>
    </DndContext>
  );
}
