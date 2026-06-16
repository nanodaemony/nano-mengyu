"use client";

import { useState, FormEvent } from "react";
import { Button, Input } from "@/components/ui";
import Card from "@/components/ui/Card";

interface PortfolioFormProps {
  onSaved: () => void;
}

export default function PortfolioForm({ onSaved }: PortfolioFormProps) {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [shares, setShares] = useState("");
  const [avgCost, setAvgCost] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!symbol.trim() || !shares || !avgCost) return;
    await fetch("/api/stocks/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: symbol.toUpperCase().trim(),
        name: name.trim() || symbol.toUpperCase().trim(),
        shares: Number(shares),
        avgCost: Number(avgCost),
        currency: "USD",
        notes: "",
      }),
    });
    setSymbol("");
    setName("");
    setShares("");
    setAvgCost("");
    onSaved();
  }

  return (
    <Card>
      <h2 className="mb-3 font-medium">新增持仓</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="AAPL" label="代码" />
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Apple Inc." label="名称" />
        <Input value={shares} onChange={(e) => setShares(e.target.value)} type="number" placeholder="100" label="持仓数量" />
        <Input value={avgCost} onChange={(e) => setAvgCost(e.target.value)} type="number" step="0.01" placeholder="150.00" label="成本价" />
        <Button type="submit" className="col-span-2 sm:col-span-4">保存</Button>
      </form>
    </Card>
  );
}
