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
