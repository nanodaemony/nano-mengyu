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
    <div className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 shadow-[0_1px_2px_rgba(30,27,46,0.04)] transition-all duration-150 hover:border-module-todos/30 hover:shadow-[0_2px_8px_rgba(30,27,46,0.06)] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
      {/* Custom checkbox */}
      <button
        onClick={onToggle}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-150 ${
          todo.done
            ? "bg-module-todos border-module-todos text-white"
            : "border-[var(--color-border)] hover:border-module-todos/50 group-hover:border-module-todos/30"
        }`}
      >
        {todo.done && (
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className={`flex-1 text-sm transition-all duration-150 ${
          todo.done
            ? "line-through text-[var(--color-text-tertiary)]"
            : "text-[var(--color-text)]"
        }`}
      >
        {todo.title}
      </span>

      {/* Priority badge */}
      <Badge variant={priorityMap[todo.priority].variant}>
        {priorityMap[todo.priority].label}
      </Badge>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-xs text-[var(--color-text-tertiary)] hover:text-status-danger transition-all duration-150"
      >
        ✕
      </button>
    </div>
  );
}
