# Navigation Restructure: Remove Sidebar Tabs, Homepage-Centric Navigation

- **Date:** 2026-06-23
- **Status:** Draft
- **Author:** nano

## Overview

Restructure the personal portal's navigation: remove the left sidebar tabs and mobile bottom tab bar, making the homepage the sole navigation hub. Each module (stocks, todos, ideas) becomes a standalone page with its own minimal top bar.

## Motivation

The current layout has three navigation surfaces (desktop sidebar, mobile bottom bar, mobile drawer) that compete with each other and take up screen space. The user prefers a clean, focused experience: land on the homepage, pick a module, and work in that module distraction-free.

## Route Structure

```
app/
├── layout.tsx              Root layout (ThemeProvider only)
├── page.tsx                Homepage (module cards + theme toggle)
├── globals.css
├── RootClient.tsx          Simplified flex container (or removed)
│
└── (portal)/               Route group — no URL impact
    ├── layout.tsx          Shared module layout (ModuleNavbar + children)
    ├── stocks/page.tsx
    ├── todos/page.tsx
    └── ideas/page.tsx
```

Using Next.js App Router's Route Group `(portal)` to share a layout across all module pages without affecting URL paths. This is the cleanest separation since:

- The homepage needs no navbar
- Module pages share a navbar that's different from the current one
- Route groups are standard Next.js — no custom logic, no conditionals in layout

## Component Architecture

### New Components

#### `ModuleNavbar` (`components/layout/ModuleNavbar.tsx`)

"use client" component rendered inside `(portal)/layout.tsx`.

```
┌─────────────────────────────────────────────┐
│  灵感卡片 (double-click 回首页)        ⚙️   │
└─────────────────────────────────────────────┘
```

- **Left:** Module name emoji + label, derived from `usePathname()` — stocks → "📈 股票分析", todos → "✅ 待办事项", ideas → "💡 灵感卡片"
- **Double-click** on name → `router.push("/")`
- **Right:** Gear icon button `⚙️` — currently a placeholder with no action handler. Marked `// TODO: module settings`
- **No** theme toggle (moved to homepage)
- **No** hamburger menu, sidebar, drawer
- **Styling:** `sticky top-0 z-40 h-14`, border-bottom, `backdrop-blur-lg`, same visual weight as current Navbar

#### `ThemeToggle` (`components/layout/ThemeToggle.tsx`)

Small floating button in the bottom-right corner of the homepage.

- Sun/moon icon toggle (same as current)
- Positioned absolutely at `bottom-6 right-6`
- Only rendered on the homepage

### Deleted Components

| Component | File | Reason |
|-----------|------|--------|
| Sidebar | `components/layout/Sidebar.tsx` | No more left sidebar tabs |
| MobileTabBar | `components/layout/MobileTabBar.tsx` | No more bottom tab navigation |
| SideDrawer | `components/layout/SideDrawer.tsx` | No more mobile drawer menu |
| Navbar | `components/layout/Navbar.tsx` | Replaced by ModuleNavbar + homepage standalone design |
| config | `components/layout/config.ts` | NAV_ITEMS inlined into homepage |

### Modified Components

#### `app/layout.tsx`

Remove `RootClient` wrapper (or simplify it significantly). Root layout becomes:

```tsx
export default function RootLayout({ children }) {
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

#### `app/RootClient.tsx`

Either removed entirely (no longer needed since there's no shared layout chrome) or kept as a thin flex container if layout spacing requires it. Prefer removal.

#### `app/page.tsx`

- Remove all layout chrome (navbar references are gone by default)
- Add `ThemeToggle` component at bottom-right
- Keep existing 3-card grid unchanged
- Module data (`MODULES` array) stays inlined here (it was already)

#### Module Pages (`stocks/page.tsx`, `todos/page.tsx`, `ideas/page.tsx`)

No functional changes. The only difference is they are now inside `(portal)/` directory:

```
app/(portal)/stocks/page.tsx
app/(portal)/todos/page.tsx
app/(portal)/ideas/page.tsx
```

File contents remain identical to current versions.

#### `(portal)/layout.tsx` (NEW)

```tsx
import ModuleNavbar from "@/components/layout/ModuleNavbar";

export default function PortalLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ModuleNavbar />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
```

Server component — wraps children with ModuleNavbar client component.

## Navigation Flows

```
Homepage (/)
  ├─ click "股票分析" card → /stocks  (ModuleNavbar shows "📈 股票分析")
  ├─ click "待办事项" card → /todos   (ModuleNavbar shows "✅ 待办事项")
  └─ click "灵感卡片" card → /ideas   (ModuleNavbar shows "💡 灵感卡片")

Module page (/stocks, /todos, /ideas)
  └─ double-click navbar module name → router.push("/") → back to homepage
```

- No cross-module navigation within module pages
- No bottom tab bar
- No sidebar
- Back-to-home by double-clicking the module name in the navbar

## Data Flow

Module name → icon mapping lives in `ModuleNavbar` via a local lookup:

```ts
const MODULE_MAP = {
  "/stocks": { icon: "📈", label: "股票分析" },
  "/todos":  { icon: "✅", label: "待办事项" },
  "/ideas":  { icon: "💡", label: "灵感卡片" },
} as const;
```

No external state management, no API calls for navigation metadata.

## Edge Cases

- **Direct URL access:** `/stocks` entered in address bar → `ModuleNavbar` uses `usePathname()` to derive label → works correctly
- **Unknown path in portal layout:** ModuleNavbar falls back to empty title (should not happen in practice)
- **Double-click timing:** Uses native `onDoubleClick` event — no custom debounce needed for this use case
- **ModuleNavbar on homepage:** ModuleNavbar is only rendered inside `(portal)/layout.tsx`, never on `/`. No cross-contamination.
- **Mobile viewports:** No dedicated mobile navigation — same layout works responsively. The ModuleNavbar collapses width normally on small screens.

## Error Handling

- ModuleNavbar gracefully handles unknown paths by showing a generic title
- ThemeToggle gracefully handles SSR by deferring render until mounted (same pattern as current)
- Double-click navigation uses `router.push()` which handles both client-side and full-page transitions

## Files Changed Summary

| Action | File |
|--------|------|
| 🗑️ Delete | `components/layout/Sidebar.tsx` |
| 🗑️ Delete | `components/layout/MobileTabBar.tsx` |
| 🗑️ Delete | `components/layout/SideDrawer.tsx` |
| 🗑️ Delete | `components/layout/Navbar.tsx` |
| 🗑️ Delete | `components/layout/config.ts` |
| ✨ Create | `components/layout/ModuleNavbar.tsx` |
| ✨ Create | `components/layout/ThemeToggle.tsx` |
| ✨ Create | `app/(portal)/layout.tsx` |
| ✏️ Modify | `app/layout.tsx` |
| ✏️ Modify | `app/page.tsx` |
| ✏️ Modify or 🗑️ Delete | `app/RootClient.tsx` |
| 🚚 Move | `app/stocks/page.tsx` → `app/(portal)/stocks/page.tsx` |
| 🚚 Move | `app/todos/page.tsx` → `app/(portal)/todos/page.tsx` |
| 🚚 Move | `app/ideas/page.tsx` → `app/(portal)/ideas/page.tsx` |
