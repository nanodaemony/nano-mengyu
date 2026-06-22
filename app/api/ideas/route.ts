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
    pinned: false,
    archived: false,
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

export async function PATCH(request: NextRequest) {
  const { id, action } = await request.json();
  const ideas = await readJSON<Idea>(FILE);
  const index = ideas.findIndex((i) => i.id === id);
  if (index === -1) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  switch (action) {
    case "pin":
      ideas[index].pinned = true;
      break;
    case "unpin":
      ideas[index].pinned = false;
      break;
    case "archive":
      ideas[index].archived = true;
      break;
    case "unarchive":
      ideas[index].archived = false;
      break;
    default:
      return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  await writeJSON(FILE, ideas);
  return Response.json(ideas[index]);
}
