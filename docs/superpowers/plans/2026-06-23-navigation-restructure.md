# Navigation Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove sidebar tabs, mobile tab bar, and drawer navigation. Make homepage the sole navigation hub with floating theme toggle. Each module page gets a clean top bar showing its name (double-click to return home) and a gear icon placeholder.

**Architecture:** Use Next.js App Router Route Group `(portal)/` to give module pages a shared layout with a new ModuleNavbar. RootClient is stripped of all old navigation chrome. Homepage is standalone with no navbar. Old layout components are deleted.

**Tech Stack:** Next.js 15 (App Router), React, Tailwind CSS

## Global Constraints

- All files live under `app/` and `components/` directories
- Module pages (stocks, todos, ideas) keep their existing content unchanged — only their directory and layout wrapper change
- ThemeToggle uses the same sun/moon icon pattern as the current Navbar
- ModuleNavbar derives module name from `usePathname()` — no external config or state
- Gear icon button has no action handler — marked `// TODO: module settings`
- Double-click on module name calls `router.push("/")`
- Floating ThemeToggle on homepage is positioned at `bottom-6 right-6`
- No unit tests required — verification via `npm run dev` visual check and `npm run build`

---

### Task 1: Simplify RootClient and root layout

**Files:**
- Modify: `app/layout.tsx`
- Modify or Delete: `app/RootClient.tsx`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a clean root layout that renders children directly without old navigation chrome

- [ ] **Step 1: Simplify RootClient.tsx**

Remove all old layout chrome imports and state. RootClient becomes a thin flex wrapper — or gets removed entirely.

If removing RootClient entirely (`app/layout.tsx` renders `{children}` directly):

```bash
rm app/RootClient.tsx
```

If keeping a thin wrapper (prefer removal, but only if layout.tsx doesn't need a client boundary), replace content:

```tsx
"use client";

import { ReactNode } from "react";

export default function RootClient({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col">{children}</div>;
}
```

- [ ] **Step 2: Update root layout to remove RootClient dependency**

Modify `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "个人门户",
  description: "股票分析 · 待办事项 · 灵感卡片",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected: Build succeeds. Homepage renders without errors. Module pages render without errors but have no chrome (no navbar, no sidebar — just raw page content).

---

### Task 2: Create ModuleNavbar component

**Files:**
- Create: `components/layout/ModuleNavbar.tsx`

**Interfaces:**
- Produces: `<ModuleNavbar />` — self-contained client component, renders a sticky top bar with module name (double-click to go home) and a gear icon placeholder

- [ ] **Step 1: Create ModuleNavbar.tsx**

```tsx
"use client";

import { usePathname, useRouter } from "next/navigation";

const MODULE_MAP: Record<string, { icon: string; label: string }> = {
  "/stocks": { icon: "📈", label: "股票分析" },
  "/todos": { icon: "✅", label: "待办事项" },
  "/ideas": { icon: "💡", label: "灵感卡片" },
} as const;

export default function ModuleNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const module = Object.entries(MODULE_MAP).find(([href]) =>
    pathname.startsWith(href)
  );

  const title = module ? `${module[1].icon} ${module[1].label}` : "";

  const handleDoubleClick = () => {
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-lg px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <span
          className="text-base font-semibold text-[var(--color-text)] cursor-default select-none"
          onDoubleClick={handleDoubleClick}
          title="双击返回主页"
        >
          {title}
        </span>
      </div>

      <button
        className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors cursor-default"
        aria-label="设置"
        // TODO: module settings
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </header>
  );
}
```

- [ ] **Step 2: Verify component compiles**

```bash
npm run build
```

Expected: Build succeeds. Component is not yet rendered anywhere so no visible change.

---

### Task 3: Create ThemeToggle component

**Files:**
- Create: `components/layout/ThemeToggle.tsx`

**Interfaces:**
- Produces: `<ThemeToggle />` — client component, renders a floating sun/moon toggle button

- [ ] **Step 1: Create ThemeToggle.tsx**

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] shadow-lg hover:shadow-xl hover:text-[var(--color-text)] transition-all duration-200"
      aria-label="切换主题"
    >
      {mounted && theme === "dark" ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Verify component compiles**

```bash
npm run build
```

Expected: Build succeeds.

---

### Task 4: Create portal layout and move module pages

**Files:**
- Create: `app/(portal)/layout.tsx`
- Move: `app/stocks/page.tsx` → `app/(portal)/stocks/page.tsx`
- Move: `app/todos/page.tsx` → `app/(portal)/todos/page.tsx`
- Move: `app/ideas/page.tsx` → `app/(portal)/ideas/page.tsx`

**Interfaces:**
- Consumes: `ModuleNavbar` from `@/components/layout/ModuleNavbar`
- Produces: Module pages rendered with the new shared top bar layout

- [ ] **Step 1: Create `app/(portal)/layout.tsx`**

```tsx
import ModuleNavbar from "@/components/layout/ModuleNavbar";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ModuleNavbar />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/(portal)` directories and move module pages**

```bash
mkdir -p app/"(portal)"/stocks
mkdir -p app/"(portal)"/todos
mkdir -p app/"(portal)"/ideas
```

- [ ] **Step 3: Move page.tsx files into portal**

```bash
git mv app/stocks/page.tsx app/"(portal)"/stocks/page.tsx
git mv app/todos/page.tsx app/"(portal)"/todos/page.tsx
git mv app/ideas/page.tsx app/"(portal)"/ideas/page.tsx
```

- [ ] **Step 4: Verify module pages render with new navbar**

```bash
npm run dev
```

Expected (manual check):
- Navigate to `/stocks` → page renders with top bar showing "📈 股票分析" and gear icon
- Navigate to `/todos` → top bar shows "✅ 待办事项"
- Navigate to `/ideas` → top bar shows "💡 灵感卡片"
- Double-click module name → navigates back to `/`
- Homepage (`/`) has NO top bar

- [ ] **Step 5: Clean up old empty directories**

```bash
rmdir app/stocks
rmdir app/todos
rmdir app/ideas
```

- [ ] **Step 6: Commit**

```bash
git add app/"(portal)"/ app/layout.tsx app/RootClient.tsx app/stocks app/todos app/ideas
git commit -m "feat: restructure navigation — portal layout with ModuleNavbar, module pages moved to route group

- Remove old layout chrome from RootClient
- Create ModuleNavbar with pathname-based label and double-click-to-home
- Create (portal) route group for shared module layout
- Move stocks/todos/ideas pages into portal group

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: Update homepage with ThemeToggle

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `ThemeToggle` from `@/components/layout/ThemeToggle`

- [ ] **Step 1: Add ThemeToggle import and render to homepage**

Modify `app/page.tsx` — add the import and render ThemeToggle at the bottom:

```tsx
import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle";

const MODULES = [
  {
    href: "/stocks",
    accent: "stocks" as const,
    icon: "📈",
    title: "股票分析",
    desc: "持仓管理 · 交易记录 · 自选监控",
    stats: "组合追踪",
  },
  {
    href: "/todos",
    accent: "todos" as const,
    icon: "✅",
    title: "待办事项",
    desc: "管理你的每日任务和优先级",
    stats: "任务看板",
  },
  {
    href: "/ideas",
    accent: "ideas" as const,
    icon: "💡",
    title: "灵感卡片",
    desc: "随手记录想法和笔记",
    stats: "知识收藏",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl pt-8 md:pt-16">
      {/* Hero */}
      <div className="text-center mb-10 md:mb-14">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text)]">
          个人门户
        </h1>
        <p className="mt-3 text-[var(--color-text-secondary)] text-base md:text-lg">
          股票分析 · 待办事项 · 灵感卡片
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--color-text-tertiary)]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-module-stocks" />
          <span>持仓</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-module-todos ml-2" />
          <span>任务</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-module-ideas ml-2" />
          <span>灵感</span>
        </div>
      </div>

      {/* Module cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        {MODULES.map((m) => (
          <Link key={m.href} href={m.href} className="group block">
            <div
              className={`relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_1px_3px_rgba(30,27,46,0.06),0_1px_2px_rgba(30,27,46,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(30,27,46,0.1)] dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.35)] border-t-[3px] ${
                m.accent === "stocks"
                  ? "border-t-module-stocks"
                  : m.accent === "todos"
                  ? "border-t-module-todos"
                  : "border-t-module-ideas"
              }`}
            >
              <div className="text-3xl mb-3">{m.icon}</div>
              <h2 className="text-lg font-semibold text-[var(--color-text)] group-hover:text-primary-500 transition-colors">
                {m.title}
              </h2>
              <p className="mt-1.5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {m.desc}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>进入</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-10 text-center text-xs text-[var(--color-text-tertiary)]">
        数据存储于本地，仅你可见
      </p>

      {/* Theme toggle */}
      <ThemeToggle />
    </div>
  );
}
```

- [ ] **Step 2: Verify homepage renders with theme toggle**

```bash
npm run dev
```

Expected (manual):
- Homepage shows the 3 cards, no navbar
- Bottom-right has a floating theme toggle button
- Clicking it toggles dark/light mode
- Module pages have ModuleNavbar but DO NOT show the ThemeToggle

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx components/layout/ThemeToggle.tsx
git commit -m "feat(homepage): add floating ThemeToggle, remove navbar dependency

- Add ThemeToggle component (bottom-right floating button)
- Keep homepage as server component, ThemeToggle is the only client island

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: Delete obsolete layout files

**Files:**
- Delete: `components/layout/Sidebar.tsx`
- Delete: `components/layout/MobileTabBar.tsx`
- Delete: `components/layout/SideDrawer.tsx`
- Delete: `components/layout/Navbar.tsx`
- Delete: `components/layout/config.ts`

**Interfaces:** None — these files are no longer imported anywhere.

- [ ] **Step 1: Delete all unused layout files**

```bash
rm components/layout/Sidebar.tsx
rm components/layout/MobileTabBar.tsx
rm components/layout/SideDrawer.tsx
rm components/layout/Navbar.tsx
rm components/layout/config.ts
```

- [ ] **Step 2: Verify build passes with files removed**

```bash
npm run build
```

Expected: Build succeeds with no errors. No "module not found" or "unused import" errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/
git commit -m "chore: remove obsolete layout components

- Delete Sidebar, MobileTabBar, SideDrawer, Navbar, config
- All replaced by ModuleNavbar + homepage-centric navigation

Co-Authored-By: Claude <noreply@anthropic.com>"
```
