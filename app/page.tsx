import Link from "next/link";
import Card from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">个人门户</h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">股票分析 · 待办事项 · 灵感卡片</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/stocks">
          <Card hover className="text-center py-8">
            <div className="text-4xl">📈</div>
            <p className="mt-2 font-medium">股票分析</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">持仓、交易、自选股</p>
          </Card>
        </Link>
        <Link href="/todos">
          <Card hover className="text-center py-8">
            <div className="text-4xl">✅</div>
            <p className="mt-2 font-medium">待办事项</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">管理你的任务</p>
          </Card>
        </Link>
        <Link href="/ideas">
          <Card hover className="text-center py-8">
            <div className="text-4xl">💡</div>
            <p className="mt-2 font-medium">灵感卡片</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">记录你的想法</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
