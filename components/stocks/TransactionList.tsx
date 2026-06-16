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
    <div className="space-y-3">
      <Card>
        <h2 className="mb-3 font-medium">新增交易</h2>
        <div className="flex flex-wrap gap-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm" />
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm">
            <option value="buy">买入</option>
            <option value="sell">卖出</option>
          </select>
          <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="代码" className="w-20" />
          <Input value={shares} onChange={(e) => setShares(e.target.value)} type="number" placeholder="数量" className="w-20" />
          <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" placeholder="价格" className="w-24" />
          <Button onClick={handleAdd} size="sm">记录</Button>
        </div>
      </Card>
      <div className="space-y-1">
        {txs.map((tx) => (
          <div key={tx.id} className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm">
            <span className="text-[var(--color-text-secondary)] w-24">{tx.date}</span>
            <span className={`font-medium w-14 ${tx.type === "buy" ? "text-green-600" : "text-red-600"}`}>
              {tx.type === "buy" ? "买入" : "卖出"}
            </span>
            <span className="font-medium w-16">{tx.symbol}</span>
            <span className="text-[var(--color-text-secondary)] w-16 text-right">{tx.shares}</span>
            <span className="text-[var(--color-text-secondary)] w-20 text-right">{tx.price.toFixed(2)}</span>
            <button onClick={() => handleDelete(tx.id)} className="ml-auto text-xs text-red-500 hover:text-red-700">删除</button>
          </div>
        ))}
      </div>
    </div>
  );
}
