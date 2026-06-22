"use client";

import { useState, useEffect, useCallback } from "react";
import { Todo } from "@/lib/todos/types";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = useCallback(async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  async function handleToggle(todo: Todo) {
    await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: todo.id, done: !todo.done }),
    });
    fetchTodos();
  }

  async function handleDelete(id: string) {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTodos();
  }

  const sorted = [...todos].sort((a, b) => {
    const prio = { high: 0, medium: 1, low: 2 };
    if (a.done !== b.done) return a.done ? 1 : -1;
    return prio[a.priority] - prio[b.priority];
  });

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="space-y-4">
      <TodoForm onCreated={fetchTodos} />

      {/* Summary */}
      {todos.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)] px-1">
          <span>共 {todos.length} 项</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
          <span>已完成 {doneCount}</span>
          {doneCount === todos.length && todos.length > 0 && (
            <span className="text-module-todos">🎉 全部完成！</span>
          )}
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {sorted.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => handleToggle(todo)}
            onDelete={() => handleDelete(todo.id)}
          />
        ))}
        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-sm text-[var(--color-text-secondary)]">还没有待办事项</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">在上方添加一条吧</p>
          </div>
        )}
      </div>
    </div>
  );
}
