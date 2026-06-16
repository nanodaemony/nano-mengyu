import { NextRequest } from "next/server";
import { readJSON, writeJSON } from "@/lib/storage";
import { Idea } from "@/lib/ideas/types";
import { nanoid } from "nanoid";

const FILE = "ideas.json";

export async function GET() {
  const ideas = await readJSON<Idea>(FILE);
  return Response.json(ideas);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const ideas = await readJSON<Idea>(FILE);
  const idea: Idea = {
    id: nanoid(),
    title: body.title,
    content: body.content,
    tags: body.tags ?? [],
    createdAt: new Date().toISOString().split("T")[0],
  };
  ideas.unshift(idea);
  await writeJSON(FILE, ideas);
  return Response.json(idea, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const ideas = await readJSON<Idea>(FILE);
  const filtered = ideas.filter((i) => i.id !== id);
  await writeJSON(FILE, filtered);
  return Response.json({ ok: true });
}
