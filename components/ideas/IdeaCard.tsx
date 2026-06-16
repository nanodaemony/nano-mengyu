"use client";

import { Idea } from "@/lib/ideas/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface IdeaCardProps {
  idea: Idea;
  onDelete: () => void;
}

export default function IdeaCard({ idea, onDelete }: IdeaCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium">{idea.title}</h3>
        <button
          onClick={onDelete}
          className="shrink-0 text-xs text-[var(--color-text-secondary)] hover:text-red-500"
        >
          删除
        </button>
      </div>
      {idea.content && (
        <p className="mt-2 text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap">
          {idea.content}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-1">
        {idea.tags?.map((tag) => (
          <Badge key={tag} variant="default">{tag}</Badge>
        ))}
      </div>
      <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{idea.createdAt}</p>
    </Card>
  );
}
