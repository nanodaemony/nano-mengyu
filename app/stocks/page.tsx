import PortfolioTable from "@/components/stocks/PortfolioTable";
import TransactionList from "@/components/stocks/TransactionList";
import WatchList from "@/components/stocks/WatchList";

export default function StocksPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold">📈 股票分析</h1>
      <section>
        <h2 className="mb-4 text-lg font-medium">持仓</h2>
        <PortfolioTable />
      </section>
      <section>
        <h2 className="mb-4 text-lg font-medium">自选股</h2>
        <WatchList />
      </section>
      <section>
        <h2 className="mb-4 text-lg font-medium">交易流水</h2>
        <TransactionList />
      </section>
    </div>
  );
}
