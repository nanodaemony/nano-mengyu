import Link from "next/link";
import { NAV_ITEMS } from "./config";

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-56 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
