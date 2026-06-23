"use client";

import { useState, useRef, useEffect } from "react";
import { Idea } from "@/lib/ideas/types";
import Badge from "@/components/ui/Badge";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface IdeaCardProps {
  idea: Idea;
  onArchive: (id: string) => void;
  onPin: (id: string) => void;
  onEdit?: (idea: Idea, offset?: number) => void;
  showUnarchive?: boolean;
}

const tagVariants = ["default", "success", "warning", "info"] as const;

export default function IdeaCard({ idea, onArchive, onPin, onEdit, showUnarchive = false }: IdeaCardProps) {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentOverflows, setContentOverflows] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const clickTimestamps = useRef<number[]>([]);

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
  }

  function handleContentClick(e: React.MouseEvent) {
    const now = Date.now();
    const recent = clickTimestamps.current.filter(t => now - t < 500);
    recent.push(now);
    clickTimestamps.current = recent;

    if (recent.length >= 3) {
      clickTimestamps.current = [];
      // Look for data-offset on the clicked element or its ancestors
      let target = e.target as HTMLElement | null;
      let offset: number | undefined;
      while (target && target !== e.currentTarget) {
        const val = target.getAttribute("data-offset");
        if (val !== null) {
          offset = parseInt(val, 10);
          break;
        }
        target = target.parentElement;
      }
      onEdit?.(idea, isNaN(offset!) ? undefined : offset);
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuPos(null);
      }
    }
    if (menuPos) {
      document.addEventListener("mousedown", handleClickOutside);
      // Close on scroll
      document.addEventListener("scroll", () => setMenuPos(null), { once: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuPos]);

  // Check if content overflows the collapsed container
  useEffect(() => {
    if (contentRef.current) {
      setContentOverflows(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [idea.content]);

  // Reset copied indicator after 1.5s
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={handleContentClick}
      className={`rounded-xl border border-[var(--color-border)] p-4 shadow-[0_1px_3px_rgba(30,27,46,0.06),0_1px_2px_rgba(30,27,46,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] ${
        idea.pinned
          ? "bg-amber-50 dark:bg-amber-900/20"
          : "bg-white dark:bg-[#16152b]"
      }`}
    >
      {/* Header with title */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[22px] font-semibold text-blue-900 dark:text-blue-300 line-clamp-2 flex-1">
          {idea.title}
        </h3>
        {idea.content && (
          <div className="relative shrink-0">
            <button
              onClick={() => { navigator.clipboard.writeText(idea.content); setCopied(true); }}
              aria-label="复制内容"
              title="复制 Markdown 内容"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors"
            >
              {copied ? (
                <span className="text-xs font-medium text-emerald-500">✓</span>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            {copied && (
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-emerald-500 font-medium">
                已复制
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right-click context menu */}
      {menuPos && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[120px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg"
          style={{ left: menuPos.x, top: menuPos.y }}
        >
          <button
            onClick={() => { onPin(idea.id); setMenuPos(null); }}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-base text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <span>📌</span>
            <span>{idea.pinned ? "取消置顶" : "置顶"}</span>
          </button>
          <button
            onClick={() => { onArchive(idea.id); setMenuPos(null); }}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-base text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <span>📦</span>
            <span>{showUnarchive ? "取消归档" : "归档"}</span>
          </button>
          {idea.content && (
            <button
              onClick={() => { setExpanded(!expanded); setMenuPos(null); }}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-base text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <span>{expanded ? "▲" : "▼"}</span>
              <span>{expanded ? "收起全文" : "展开全文"}</span>
            </button>
          )}
        </div>
      )}

      {/* Markdown content with expand/collapse */}
      {idea.content && (
        <div className="mt-3">
          <div
            ref={contentRef}
            className={`overflow-hidden transition-all duration-200 ${
              expanded ? "max-h-none" : "max-h-[300px]"
            }`}
          >
            <MarkdownRenderer content={idea.content} />
          </div>
          {(contentOverflows || expanded) && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="mt-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              {expanded ? "收起 ▲" : "展开全文 ▼"}
            </button>
          )}
        </div>
      )}

      {/* Tags + Date row */}
      <div className="mt-4 flex items-start gap-3">
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {idea.tags?.map((tag, i) => (
            <Badge key={tag} variant={tagVariants[i % tagVariants.length]}>
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-[var(--color-text-tertiary)] whitespace-nowrap shrink-0">
          {idea.createdAt}
        </p>
      </div>
    </div>
  );
}
