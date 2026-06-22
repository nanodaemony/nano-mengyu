"use client";

import { useState, useEffect, useCallback } from "react";
import { Idea } from "@/lib/ideas/types";
import IdeaCard from "./IdeaCard";
import IdeaForm from "./IdeaForm";

export default function IdeaGrid() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const fetchIdeas = useCallback(async () => {
    const res = await fetch("/api/ideas");
    const data = await res.json();
    setIdeas(data);
  }, []);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);

  async function handleArchive(id: string) {
    const idea = ideas.find((i) => i.id === id);
    await fetch("/api/ideas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: idea?.archived ? "unarchive" : "archive" }),
    });
    fetchIdeas();
  }

  async function handlePin(id: string) {
    const idea = ideas.find((i) => i.id === id);
    await fetch("/api/ideas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: idea?.pinned ? "unpin" : "pin" }),
    });
    fetchIdeas();
  }

  return (
    <div className="space-y-6">
      <IdeaForm onCreated={fetchIdeas} />

      {ideas.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onArchive={handleArchive} onPin={handlePin} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-3xl mb-3">✨</p>
          <p className="text-sm text-[var(--color-text-secondary)]">还没有灵感卡片</p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">在上面记录你的第一个想法吧</p>
        </div>
      )}
    </div>
  );
}
