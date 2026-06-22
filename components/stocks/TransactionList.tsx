"use client";

import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/lib/stocks/types";
import Card from "@/components/ui/Card";
import { Button, Input } from "@/components/ui";

export default function TransactionList() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");

  const fetchTxs = useCallback(async () => {
    const res = await fetch("/api/stocks/transactions");
    setTxs(await res.json());
  }, []);

  useEffect(() => { fetchTxs(); }, [fetchTxs]);

  async function handleAdd() {
    if (!symbol.trim() || !shares || !price) return;
    await fetch("/api/stocks/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        type,
        symbol: symbol.toUpperCase().trim(),
        shares: Number(shares),
        price: Number(price),
      }),
    });
    setSymbol("");
    setShares("");
    setPrice("");
    fetchTxs();
  }

  async function handleDelete(id: string) {
    await fetch("/api/stocks/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTxs();
  }

  return (
    <div className="space-y-4">
      {/* Add transaction form */}
      <Card accent="stocks" elevation="sm">
        <h2 className="mb-4 text-sm font-semibold text-[var(--color-text)] tracking-wide uppercase">
          新增交易
        </h2>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] tracking-wide uppercase mb-1.5">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 transition-all duration-150"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] tracking-wide uppercase mb-1.5">类型</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 transition-all duration-150"
            >
              <option value="buy">买入</option>
              <option value="sell">卖出</option>
            </select>
          </div>
          <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="代码" className="w-20" />
          <Input value={shares} onChange={(e) => setShares(e.target.value)} type="number" placeholder="数量" className="w-20" />
          <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" placeholder="价格" className="w-24" />
          <Button onClick={handleAdd} size="md">记录</Button>
        </div>
      </Card>

      {/* Transaction list */}
      {txs.length > 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[0_1px_3px_rgba(30,27,46,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-surface-alt)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase">日期</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase">类型</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase">代码</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase">数量</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase">价格</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase">小计</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {txs.map((tx) => (
                  <tr key={tx.id} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-surface-hover)] transition-colors">
                    <td className="px-4 py-3 text-[var(--color-text-secondary)] font-mono text-xs">{tx.date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        tx.type === "buy"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                      }`}>
                        {tx.type === "buy" ? "买入" : "卖出"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold">{tx.symbol}</td>
                    <td className="px-4 py-3 text-right">{tx.shares}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm">{tx.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-medium">
                      {(tx.shares * tx.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(tx.id)}
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
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <p className="text-sm text-[var(--color-text-secondary)]">还没有交易记录</p>
        </div>
      )}
    </div>
  );
}
