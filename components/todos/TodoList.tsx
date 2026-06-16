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

  return (
    <div className="space-y-4">
      <TodoForm onCreated={fetchTodos} />
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
          <p className="text-center text-sm text-[var(--color-text-secondary)]">还没有待办，添加一条吧</p>
        )}
      </div>
    </div>
  );
}
