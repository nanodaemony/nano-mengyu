interface PriceResult {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export async function fetchPrice(symbol: string): Promise<PriceResult | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta) return null;
    return {
      symbol: meta.symbol,
      price: meta.regularMarketPrice,
      change: meta.chartPreviousClose
        ? meta.regularMarketPrice - meta.chartPreviousClose
        : 0,
      changePercent: meta.chartPreviousClose
        ? ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100
        : 0,
    };
  } catch {
    return null;
  }
}

export async function fetchPrices(symbols: string[]): Promise<Map<string, PriceResult>> {
  const results = await Promise.allSettled(
    symbols.map((s) => fetchPrice(s))
  );
  const map = new Map();
  symbols.forEach((s, i) => {
    if (results[i].status === "fulfilled" && results[i].value) {
      map.set(s, results[i].value);
    }
  });
  return map;
}
