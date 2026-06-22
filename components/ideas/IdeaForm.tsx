"use client";

import { useState, FormEvent } from "react";
import { Button, Input } from "@/components/ui";
import Card from "@/components/ui/Card";

interface IdeaFormProps {
  onCreated: () => void;
}

export default function IdeaForm({ onCreated }: IdeaFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        content: content.trim(),
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      }),
    });
    setTitle("");
    setContent("");
    setTags("");
    onCreated();
  }

  return (
    <Card elevation="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="灵感标题"
          label="标题"
        />
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] tracking-wide uppercase">
            内容
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的灵感..."
            rows={3}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-150 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 resize-none"
          />
        </div>
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="标签1, 标签2, 标签3"
          label="标签（英文逗号分隔）"
        />
        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            保存灵感
          </Button>
        </div>
      </form>
    </Card>
  );
}
