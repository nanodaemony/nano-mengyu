"use client";

import { useState, useEffect, useCallback } from "react";
import { WatchItem } from "@/lib/stocks/types";
import Card from "@/components/ui/Card";
import { Button, Input } from "@/components/ui";

export default function WatchList() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [symbol, setSymbol] = useState("");
  const [reason, setReason] = useState("");

  const fetchWatchlist = useCallback(async () => {
    const res = await fetch("/api/stocks/watchlist");
    setItems(await res.json());
  }, []);

  useEffect(() => { fetchWatchlist(); }, [fetchWatchlist]);

  async function handleAdd() {
    if (!symbol.trim()) return;
    await fetch("/api/stocks/watchlist", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: symbol.toUpperCase().trim(),
        name: symbol.toUpperCase().trim(),
        addedAt: new Date().toISOString().split("T")[0],
        reason,
        notes: [],
      }),
    });
    setSymbol("");
    setReason("");
    fetchWatchlist();
  }

  async function handleDelete(symbol: string) {
    await fetch("/api/stocks/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });
    fetchWatchlist();
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="TSLA" className="w-24" />
        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="关注理由" className="flex-1" />
        <Button onClick={handleAdd} size="sm">添加</Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.symbol}>
            <div className="flex items-center justify-between">
              <span className="font-medium">{item.symbol}</span>
              <button onClick={() => handleDelete(item.symbol)} className="text-xs text-red-500 hover:text-red-700">删除</button>
            </div>
            {item.reason && (
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{item.reason}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
