"use client";

import { useState, FormEvent } from "react";
import { Button, Input } from "@/components/ui";

interface TodoFormProps {
  onCreated: () => void;
}

const PRIORITIES = [
  { value: "high" as const, label: "高" },
  { value: "medium" as const, label: "中" },
  { value: "low" as const, label: "低" },
];

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
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="添加新的待办..."
        />
      </div>

      {/* Priority toggle */}
      <div className="flex rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-0.5">
        {PRIORITIES.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPriority(p.value)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
              priority === p.value
                ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-[0_1px_2px_rgba(30,27,46,0.06)]"
                : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Button type="submit" size="md">
        添加
      </Button>
    </form>
  );
}
