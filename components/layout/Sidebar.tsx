"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { NAV_ITEMS } from "./config";

interface SidebarProps {
  width: number;
  onWidthChange: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

const COLLAPSE_THRESHOLD = 120;

export default function Sidebar({ width, onWidthChange, minWidth = 64, maxWidth = 480 }: SidebarProps) {
  const pathname = usePathname();
  const dragging = useRef(false);
  const collapsed = width < COLLAPSE_THRESHOLD;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging.current) return;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, e.clientX));
      onWidthChange(newWidth);
    },
    [minWidth, maxWidth, onWidthChange]
  );

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <aside
      className="hidden lg:flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] relative shrink-0 transition-[width] duration-150"
      style={{ width }}
    >
      <nav className={`flex flex-col gap-1 ${collapsed ? "items-center py-4" : "p-3 py-4"}`}>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center rounded-xl text-sm font-medium transition-all duration-150 ${
                collapsed
                  ? "justify-center w-10 h-10 text-xl"
                  : "gap-3 px-3 py-2.5"
              } ${
                active
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              }`}
            >
              {active && !collapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary-500" />
              )}
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize transition-colors hover:bg-primary-400/40 active:bg-primary-500/50"
      />
    </aside>
  );
}
