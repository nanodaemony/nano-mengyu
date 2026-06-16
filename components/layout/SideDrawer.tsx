"use client";

import Link from "next/link";
import { NAV_ITEMS } from "./config";

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SideDrawer({ open, onClose }: SideDrawerProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="relative h-full w-64 bg-[var(--color-bg)] p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold">导航</span>
              <button onClick={onClose} className="text-[var(--color-text-secondary)]" aria-label="关闭菜单">✕</button>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
