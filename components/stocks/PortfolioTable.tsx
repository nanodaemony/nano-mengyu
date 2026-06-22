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

  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgCost, 0);

  return (
    <div className="space-y-4">
      <PortfolioForm onSaved={fetchHoldings} />

      {holdings.length > 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[0_1px_3px_rgba(30,27,46,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-surface-alt)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase">代码</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase">名称</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase">持仓</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase">成本价</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase">总成本</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.symbol} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-surface-hover)] transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-sm text-module-stocks">{h.symbol}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{h.name}</td>
                    <td className="px-4 py-3 text-right font-medium">{h.shares.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm">{h.avgCost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-medium">{(h.shares * h.avgCost).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(h.symbol)}
                        className="text-xs text-[var(--color-text-tertiary)] hover:text-status-danger transition-colors"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface-alt)] border-t border-[var(--color-border-light)] text-sm">
            <span className="text-[var(--color-text-secondary)]">总投入</span>
            <span className="font-mono font-semibold text-[var(--color-text)]">{totalCost.toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <p className="text-3xl mb-3">📊</p>
          <p className="text-sm text-[var(--color-text-secondary)]">还没有持仓记录</p>
        </div>
      )}
    </div>
  );
}
