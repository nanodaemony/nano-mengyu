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
    <div className="space-y-4">
      {/* Add form */}
      <div className="flex gap-2">
        <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="TSLA" className="w-24" />
        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="关注理由" className="flex-1" />
        <Button onClick={handleAdd} size="md" variant="primary">添加</Button>
      </div>

      {/* Watchlist grid */}
      {items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item.symbol} elevation="sm" className="group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-sm text-module-stocks">{item.symbol}</span>
                  {item.addedAt && (
                    <span className="text-xs text-[var(--color-text-tertiary)]">{item.addedAt}</span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.symbol)}
                  className="text-xs text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 hover:text-status-danger transition-all duration-150"
                >
                  ✕
                </button>
              </div>
              {item.reason && (
                <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">{item.reason}</p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <p className="text-sm text-[var(--color-text-secondary)]">还没有自选股</p>
        </div>
      )}
    </div>
  );
}
