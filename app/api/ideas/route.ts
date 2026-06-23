import { NextRequest } from "next/server";
import { readJSON, writeJSON } from "@/lib/storage";
import { Idea } from "@/lib/ideas/types";
import { nanoid } from "nanoid";
import { unlink } from "fs/promises";
import path from "path";
import fs from "fs";

const FILE = "ideas.json";
const IMAGES_DIR = path.join(process.cwd(), "data", "ideas", "images");

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

async function deleteAssociatedImages(content: string) {
  const imageUrlRegex = /\/api\/ideas\/images\/([^)"'\s]+)/g;
  let match: RegExpExecArray | null;
  const deletePromises: Promise<void>[] = [];

  while ((match = imageUrlRegex.exec(content)) !== null) {
    const filename = match[1];
    // Sanitize: ensure no path traversal
    if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) continue;
    const filePath = path.join(IMAGES_DIR, filename);
    if (filePath.startsWith(IMAGES_DIR) && fs.existsSync(filePath)) {
      deletePromises.push(unlink(filePath).catch(() => {}));
    }
  }

  await Promise.all(deletePromises);
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const ideas = await readJSON<Idea>(FILE);
    const card = ideas.find((i) => i.id === id);
    if (!card) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // Clean up associated images before deleting the card
    if (card.content) {
      await deleteAssociatedImages(card.content);
    }

    const filtered = ideas.filter((i) => i.id !== id);
    await writeJSON(FILE, filtered);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete idea:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, action } = body;
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
    case "update":
      if (body.title !== undefined) ideas[index].title = body.title;
      if (body.content !== undefined) ideas[index].content = body.content;
      if (body.tags !== undefined) ideas[index].tags = body.tags;
      break;
    default:
      return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  await writeJSON(FILE, ideas);
  return Response.json(ideas[index]);
}
