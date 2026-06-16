import { NextRequest } from "next/server";
import { readJSON, writeJSON } from "@/lib/storage";
import { Holding } from "@/lib/stocks/types";

const FILE = "stocks/portfolio.json";

export async function GET() {
  const portfolio = await readJSON<Holding>(FILE);
  return Response.json(portfolio);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const portfolio = await readJSON<Holding>(FILE);
  const idx = portfolio.findIndex((h) => h.symbol === body.symbol);
  if (idx === -1) {
    portfolio.push(body);
  } else {
    portfolio[idx] = body;
  }
  await writeJSON(FILE, portfolio);
  return Response.json(body);
}

export async function DELETE(request: NextRequest) {
  const { symbol } = await request.json();
  const portfolio = await readJSON<Holding>(FILE);
  const filtered = portfolio.filter((h) => h.symbol !== symbol);
  await writeJSON(FILE, filtered);
  return Response.json({ ok: true });
}
