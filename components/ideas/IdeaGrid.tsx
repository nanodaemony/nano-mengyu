"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Idea } from "@/lib/ideas/types";
import IdeaCard from "./IdeaCard";
import IdeaForm from "./IdeaForm";
import Button from "@/components/ui/Button";

export default function IdeaGrid() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [editOffset, setEditOffset] = useState<number | undefined>(undefined);
  const [formDirty, setFormDirty] = useState(false);

  function handleEditCard(idea: Idea, offset?: number) {
    if (formDirty) {
      if (!window.confirm("当前表单已有内容，是否覆盖？")) return;
    }
    setEditingIdea(idea);
    setEditOffset(offset);
  }

  function handleFormCreated() {
    setEditingIdea(null);
    setEditOffset(undefined);
    fetchIdeas();
  }

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ideas");
      if (!res.ok) {
        console.error("Failed to fetch ideas:", res.status, res.statusText);
        return;
      }
      const data = await res.json();
      setIdeas(data);
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);

  // Filter: active vs archived
  const filteredIdeas = useMemo(
    () => ideas.filter((i) => showArchived ? i.archived : !i.archived),
    [ideas, showArchived]
  );

  // Extract tags from unfiltered active ideas (for tag bar)
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    ideas.filter((i) => !i.archived).forEach((i) => i.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [ideas]);

  // Apply tag filter on top of active/archived filter
  const displayIdeas = useMemo(
    () => selectedTag
      ? filteredIdeas.filter((i) => i.tags?.includes(selectedTag))
      : filteredIdeas,
    [filteredIdeas, selectedTag]
  );

  // Sort: pinned first, then by date desc
  const sortedIdeas = useMemo(
    () => [...displayIdeas].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    }),
    [displayIdeas]
  );

  async function handleArchive(id: string) {
    const action = showArchived ? "unarchive" : "archive";
    try {
      const res = await fetch("/api/ideas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) {
        console.error("Failed to archive idea:", res.status, res.statusText);
        return;
      }
    } catch (err) {
      console.error("Failed to archive idea:", err);
      return;
    }
    fetchIdeas();
  }

  async function handlePin(id: string) {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    const action = idea.pinned ? "unpin" : "pin";
    try {
      const res = await fetch("/api/ideas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) {
        console.error("Failed to pin idea:", res.status, res.statusText);
        return;
      }
    } catch (err) {
      console.error("Failed to pin idea:", err);
      return;
    }
    fetchIdeas();
  }

  return (
    <div className="grid grid-cols-7 gap-6">
      {/* Left column — form + archive button */}
      <div className="col-span-3 flex flex-col gap-4">
        <IdeaForm
          onCreated={handleFormCreated}
          availableTags={allTags}
          editIdea={editingIdea}
          editOffset={editOffset}
          onDirtyChange={setFormDirty}
        />
        <Button
          variant={showArchived ? "primary" : "secondary"}
          onClick={() => { setShowArchived(!showArchived); setSelectedTag(null); }}
          className="w-full"
        >
          {showArchived ? "← 返回活跃卡片" : "📦 归档"}
        </Button>
      </div>

      {/* Right column — tags + cards */}
      <div className="col-span-4 flex flex-col gap-4">
        {/* Tag filter bar */}
        {!showArchived && allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                !selectedTag
                  ? "bg-blue-500 text-white"
                  : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              全部
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  selectedTag === tag
                    ? "bg-blue-500 text-white"
                    : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Cards list */}
        {sortedIdeas.length > 0 ? (
          <div className="flex flex-col gap-4">
            {sortedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onArchive={handleArchive}
                onPin={handlePin}
                onEdit={handleEditCard}
                showUnarchive={showArchived}
              />
            ))}
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-primary-500 mb-3" />
            <p className="text-sm text-[var(--color-text-secondary)]">加载中...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-3xl mb-3">✨</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {showArchived ? "没有已归档的卡片" : "还没有灵感卡片"}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
              {showArchived ? "" : "在左侧记录你的第一个想法吧"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
