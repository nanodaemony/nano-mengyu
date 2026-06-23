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
