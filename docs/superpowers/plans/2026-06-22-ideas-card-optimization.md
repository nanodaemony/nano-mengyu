# Ideas Card Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize the ideas page with two-column layout, pin/archive functionality, and tag filtering.

**Architecture:** JSON-file-backed CRUD with React client components. Data model gains `pinned` and `archived` boolean fields. API gets a PATCH endpoint for status toggles. UI reorganized into 1:2 left/right layout with tag-based filtering.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, TypeScript, JSON file storage

## Global Constraints

- All card styling must remove the yellow top border (no `accent` prop on Card)
- Normal card background: `bg-[var(--color-surface-alt)]`
- Pinned card background: `bg-amber-50` / `dark:bg-amber-900/20`
- Layout ratio: left column 1, right column 2 (`grid-cols-3`, left spans 1, right spans 2)
- One card per row in the right column
- ⋮ menu uses a simple dropdown (no external library)
- All text labels in Chinese

---

### Task 1: Update data model and add API PATCH endpoint

**Files:**
- Modify: `lib/ideas/types.ts`
- Modify: `app/api/ideas/route.ts`

**Interfaces:**
- Consumes: existing `Idea` interface, `readJSON`/`writeJSON` helpers
- Produces: `Idea` with `pinned` + `archived` fields, `PATCH /api/ideas` endpoint

- [ ] **Step 1: Add `pinned` and `archived` fields to the Idea type**

Edit `lib/ideas/types.ts`:

```typescript
export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  pinned: boolean;
  archived: boolean;
}
```

- [ ] **Step 2: Update POST handler to include new default fields**

Edit `app/api/ideas/route.ts`. In the POST handler, change the new Idea creation to include the new fields:

```typescript
const idea: Idea = {
  id: nanoid(),
  title: body.title,
  content: body.content,
  tags: body.tags ?? [],
  createdAt: new Date().toISOString().split("T")[0],
  pinned: false,
  archived: false,
};
```

- [ ] **Step 3: Add PATCH handler for archive/pin toggles**

Add to `app/api/ideas/route.ts`:

```typescript
export async function PATCH(request: NextRequest) {
  const { id, action } = await request.json();
  const ideas = await readJSON<Idea>(FILE);
  const index = ideas.findIndex((i) => i.id === id);
  if (index === -1) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  switch (action) {
    case "pin":
      ideas[index].pinned = true;
      break;
    case "unpin":
      ideas[index].pinned = false;
      break;
    case "archive":
      ideas[index].archived = true;
      break;
    case "unarchive":
      ideas[index].archived = false;
      break;
    default:
      return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  await writeJSON(FILE, ideas);
  return Response.json(ideas[index]);
}
```

- [ ] **Step 4: Verify the build compiles**

```bash
cd /c/Users/nano/Desktop/nano-portal && npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add lib/ideas/types.ts app/api/ideas/route.ts
git commit -m "feat(ideas): add pinned/archived fields and PATCH API endpoint"
```

---

### Task 2: Update page header (remove subtitle)

**Files:**
- Modify: `app/ideas/page.tsx`

- [ ] **Step 1: Remove the subtitle paragraph**

Edit `app/ideas/page.tsx`:

```typescript
import IdeaGrid from "@/components/ideas/IdeaGrid";

export default function IdeasPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-block w-1 h-6 rounded-full bg-module-ideas" />
          <h1 className="text-2xl font-bold tracking-tight">灵感卡片</h1>
        </div>
      </div>
      <IdeaGrid />
    </div>
  );
}
```

The key change: remove the `<p>` element with "记录一闪而过的想法".

- [ ] **Step 2: Commit**

```bash
git add app/ideas/page.tsx
git commit -m "feat(ideas): remove subtitle from page header"
```

---

### Task 3: Rewrite IdeaCard component

**Files:**
- Modify: `components/ideas/IdeaCard.tsx`

**Interfaces:**
- Consumes: `Idea` type from `@/lib/ideas/types`
- Produces: Card component with ⋮ dropdown menu, no delete button, conditional background colors

- [ ] **Step 1: Rewrite IdeaCard component**

Edit `components/ideas/IdeaCard.tsx`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add components/ideas/IdeaCard.tsx
git commit -m "feat(ideas): redesign IdeaCard with menu, archive/pin actions"
```

---

### Task 4: Update IdeaForm (remove accent styling)

**Files:**
- Modify: `components/ideas/IdeaForm.tsx`

- [ ] **Step 1: Remove the `accent` prop from Card**

Edit `components/ideas/IdeaForm.tsx`. Change the Card wrapping the form:

```typescript
<Card elevation="sm">
```

Before: `<Card accent="ideas" elevation="sm">`. Remove the `accent="ideas"` prop.

- [ ] **Step 2: Commit**

```bash
git add components/ideas/IdeaForm.tsx
git commit -m "feat(ideas): remove accent styling from IdeaForm Card"
```

---

### Task 5: Rewrite IdeaGrid (two-column layout, tags, archive toggle)

**Files:**
- Modify: `components/ideas/IdeaGrid.tsx`

**Interfaces:**
- Consumes: `Idea` type, `IdeaCard`, `IdeaForm` components
- Produces: Full two-column layout with state management for view mode and tag filter

- [ ] **Step 1: Rewrite IdeaGrid component**

Edit `components/ideas/IdeaGrid.tsx`:

```typescript
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Idea } from "@/lib/ideas/types";
import IdeaCard from "./IdeaCard";
import IdeaForm from "./IdeaForm";
import Button from "@/components/ui/Button";

export default function IdeaGrid() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    const res = await fetch("/api/ideas");
    const data = await res.json();
    setIdeas(data);
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
    await fetch("/api/ideas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    fetchIdeas();
  }

  async function handlePin(id: string) {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    const action = idea.pinned ? "unpin" : "pin";
    await fetch("/api/ideas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    fetchIdeas();
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left column — form + archive button */}
      <div className="col-span-1 flex flex-col gap-4">
        <IdeaForm onCreated={fetchIdeas} />
        <Button
          variant={showArchived ? "primary" : "secondary"}
          onClick={() => { setShowArchived(!showArchived); setSelectedTag(null); }}
          className="w-full"
        >
          {showArchived ? "← 返回活跃卡片" : "📦 归档"}
        </Button>
      </div>

      {/* Right column — tags + cards */}
      <div className="col-span-2 flex flex-col gap-4">
        {/* Tag filter bar */}
        {!showArchived && allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                !selectedTag
                  ? "bg-primary-500 text-white"
                  : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              全部
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedTag === tag
                    ? "bg-primary-500 text-white"
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
                showUnarchive={showArchived}
              />
            ))}
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
```

- [ ] **Step 2: Commit**

```bash
git add components/ideas/IdeaGrid.tsx
git commit -m "feat(ideas): implement two-column layout with tag filtering and archive toggle"
```

---

### Task 6: Verify the complete build

- [ ] **Step 1: Run TypeScript check**

```bash
cd /c/Users/nano/Desktop/nano-portal && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 2: Start dev server and manually verify**

```bash
cd /c/Users/nano/Desktop/nano-portal && npm run dev
```

Visit `/ideas` and verify:
- [ ] Two-column layout with form on left, cards on right
- [ ] No subtitle "记录一闪而过的想法"
- [ ] No yellow top border on any card
- [ ] Normal cards have light gray background
- [ ] Can create a new idea via the form
- [ ] ⋮ menu shows "置顶" and "归档" options
- [ ] Clicking "置顶" moves card to top and changes background to yellow
- [ ] Clicking "归档" removes card from view
- [ ] Clicking "📦 归档" button switches to archived view
- [ ] Archived cards show "取消归档" option in ⋮ menu
- [ ] Tag filters appear at top of right column
- [ ] Clicking a tag filters cards by that tag
- [ ] Clicking "全部" removes tag filter

- [ ] **Step 3: Commit any remaining changes**

```bash
git add -A
git commit -m "feat(ideas): complete ideas card optimization"
```
