import { NextRequest } from "next/server";
import { readJSON, writeJSON } from "@/lib/storage";
import { Transaction } from "@/lib/stocks/types";
import { nanoid } from "nanoid";

const FILE = "stocks/transactions.json";

export async function GET() {
  const txs = await readJSON<Transaction>(FILE);
  return Response.json(txs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const txs = await readJSON<Transaction>(FILE);
  const tx: Transaction = {
    id: nanoid(),
    date: body.date,
    type: body.type,
    symbol: body.symbol,
    shares: body.shares,
    price: body.price,
    currency: body.currency ?? "USD",
    fee: body.fee ?? 0,
    notes: body.notes ?? "",
  };
  txs.push(tx);
  await writeJSON(FILE, txs);
  return Response.json(tx, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const txs = await readJSON<Transaction>(FILE);
  const filtered = txs.filter((t) => t.id !== id);
  await writeJSON(FILE, filtered);
  return Response.json({ ok: true });
}
