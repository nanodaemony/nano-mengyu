import PortfolioTable from "@/components/stocks/PortfolioTable";
import TransactionList from "@/components/stocks/TransactionList";
import WatchList from "@/components/stocks/WatchList";

export default function StocksPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-block w-1 h-6 rounded-full bg-module-stocks" />
          <h1 className="text-2xl font-bold tracking-tight">股票分析</h1>
        </div>
        <p className="ml-4 text-sm text-[var(--color-text-secondary)]">
          持仓管理 · 交易记录 · 自选监控
        </p>
      </div>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-module-stocks/60" />
          <h2 className="text-base font-semibold text-[var(--color-text)]">持仓</h2>
        </div>
        <PortfolioTable />
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-module-stocks/60" />
          <h2 className="text-base font-semibold text-[var(--color-text)]">自选股</h2>
        </div>
        <WatchList />
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-module-stocks/60" />
          <h2 className="text-base font-semibold text-[var(--color-text)]">交易流水</h2>
        </div>
        <TransactionList />
      </section>
    </div>
  );
}
