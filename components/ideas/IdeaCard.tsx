"use client";

import { useState, useRef, useEffect } from "react";
import { Idea } from "@/lib/ideas/types";
import Badge from "@/components/ui/Badge";

interface IdeaCardProps {
  idea: Idea;
  onArchive: (id: string) => void;
  onPin: (id: string) => void;
  showUnarchive?: boolean;
}

const tagVariants = ["default", "success", "warning", "info"] as const;

export default function IdeaCard({ idea, onArchive, onPin, showUnarchive = false }: IdeaCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] p-5 shadow-[0_1px_3px_rgba(30,27,46,0.06),0_1px_2px_rgba(30,27,46,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] ${
        idea.pinned
          ? "bg-amber-50 dark:bg-amber-900/20"
          : "bg-[var(--color-surface-alt)]"
      }`}
    >
      {/* Header with title and menu */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-[var(--color-text)] line-clamp-2 flex-1">
          {idea.title}
        </h3>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-20 min-w-[120px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg">
              <button
                onClick={() => { onPin(idea.id); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <span>{idea.pinned ? "📌" : "📌"}</span>
                <span>{idea.pinned ? "取消置顶" : "置顶"}</span>
              </button>
              <button
                onClick={() => { onArchive(idea.id); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <span>📦</span>
                <span>{showUnarchive ? "取消归档" : "归档"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {idea.content && (
        <p className="mt-2 text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap line-clamp-4 leading-relaxed">
          {idea.content}
        </p>
      )}

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {idea.tags?.map((tag, i) => (
          <Badge key={tag} variant={tagVariants[i % tagVariants.length]}>
            {tag}
          </Badge>
        ))}
      </div>

      {/* Date */}
      <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">
        {idea.createdAt}
      </p>
    </div>
  );
}
