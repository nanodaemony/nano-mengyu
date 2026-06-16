"use client";

import { useState, FormEvent } from "react";
import { Button, Input } from "@/components/ui";

interface TodoFormProps {
  onCreated: () => void;
}

export default function TodoForm({ onCreated }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), priority }),
    });
    setTitle("");
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="添加新的待办..."
        className="flex-1"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as typeof priority)}
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 text-sm"
      >
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <Button type="submit" size="sm">添加</Button>
    </form>
  );
}
