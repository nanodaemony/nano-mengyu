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

  async function handleDelete(id: string) {
    await fetch("/api/ideas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchIdeas();
  }

  return (
    <div className="space-y-6">
      <IdeaForm onCreated={fetchIdeas} />
      {ideas.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onDelete={() => handleDelete(idea.id)} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-[var(--color-text-secondary)]">还没有灵感卡片</p>
      )}
    </div>
  );
}
