export interface Holding {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currency: string;
  notes: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: "buy" | "sell";
  symbol: string;
  shares: number;
  price: number;
  currency: string;
  fee: number;
  notes: string;
}

export interface WatchItem {
  symbol: string;
  name: string;
  addedAt: string;
  reason: string;
  notes: string[];
}
