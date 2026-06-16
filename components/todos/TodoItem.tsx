"use client";

import { Todo } from "@/lib/todos/types";
import { Badge } from "@/components/ui";

const priorityMap = {
  high: { label: "高", variant: "danger" as const },
  medium: { label: "中", variant: "warning" as const },
  low: { label: "低", variant: "default" as const },
};

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 transition-colors hover:border-[var(--color-border)]">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={onToggle}
        className="h-4 w-4 rounded border-[var(--color-border)] text-primary-500"
      />
      <span className={`flex-1 text-sm ${todo.done ? "line-through text-[var(--color-text-secondary)]" : ""}`}>
        {todo.title}
      </span>
      <Badge variant={priorityMap[todo.priority].variant}>
        {priorityMap[todo.priority].label}
      </Badge>
      <button onClick={onDelete} className="text-xs text-red-500 hover:text-red-700">
        删除
      </button>
    </div>
  );
}
