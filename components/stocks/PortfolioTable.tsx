"use client";

import { useState, useEffect, useCallback } from "react";
import { Holding } from "@/lib/stocks/types";
import PortfolioForm from "./PortfolioForm";

export default function PortfolioTable() {
  const [holdings, setHoldings] = useState<Holding[]>([]);

  const fetchHoldings = useCallback(async () => {
    const res = await fetch("/api/stocks/portfolio");
    setHoldings(await res.json());
  }, []);

  useEffect(() => { fetchHoldings(); }, [fetchHoldings]);

  async function handleDelete(symbol: string) {
    await fetch("/api/stocks/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });
    fetchHoldings();
  }

  return (
    <div className="space-y-4">
      <PortfolioForm onSaved={fetchHoldings} />
      {holdings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-secondary)]">
                <th className="pb-2 font-medium">代码</th>
                <th className="pb-2 font-medium">名称</th>
                <th className="pb-2 font-medium text-right">持仓</th>
                <th className="pb-2 font-medium text-right">成本价</th>
                <th className="pb-2 font-medium text-right">总成本</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.symbol} className="border-b border-[var(--color-border)]">
                  <td className="py-2 font-medium">{h.symbol}</td>
                  <td className="py-2 text-[var(--color-text-secondary)]">{h.name}</td>
                  <td className="py-2 text-right">{h.shares}</td>
                  <td className="py-2 text-right">{h.avgCost.toFixed(2)}</td>
                  <td className="py-2 text-right">{(h.shares * h.avgCost).toFixed(2)}</td>
                  <td className="py-2 text-right">
                    <button onClick={() => handleDelete(h.symbol)} className="text-xs text-red-500 hover:text-red-700">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-sm text-[var(--color-text-secondary)]">还没有持仓记录</p>
      )}
    </div>
  );
}
