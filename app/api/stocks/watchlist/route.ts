import { NextRequest } from "next/server";
import { readJSON, writeJSON } from "@/lib/storage";
import { WatchItem } from "@/lib/stocks/types";

const FILE = "stocks/watchlist.json";

export async function GET() {
  const watchlist = await readJSON<WatchItem>(FILE);
  return Response.json(watchlist);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const watchlist = await readJSON<WatchItem>(FILE);
  const idx = watchlist.findIndex((w) => w.symbol === body.symbol);
  if (idx === -1) {
    watchlist.push(body);
  } else {
    watchlist[idx] = body;
  }
  await writeJSON(FILE, watchlist);
  return Response.json(body);
}

export async function DELETE(request: NextRequest) {
  const { symbol } = await request.json();
  const watchlist = await readJSON<WatchItem>(FILE);
  const filtered = watchlist.filter((w) => w.symbol !== symbol);
  await writeJSON(FILE, filtered);
  return Response.json({ ok: true });
}
