import { NextRequest } from "next/server";
import { readJSON, writeJSON } from "@/lib/storage";
import { Todo } from "@/lib/todos/types";
import { nanoid } from "nanoid";

const FILE = "todos.json";

export async function GET() {
  const todos = await readJSON<Todo>(FILE);
  return Response.json(todos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const todos = await readJSON<Todo>(FILE);
  const todo: Todo = {
    id: nanoid(),
    title: body.title,
    done: false,
    priority: body.priority ?? "medium",
    tags: body.tags ?? [],
    createdAt: new Date().toISOString().split("T")[0],
  };
  todos.push(todo);
  await writeJSON(FILE, todos);
  return Response.json(todo, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const todos = await readJSON<Todo>(FILE);
  const idx = todos.findIndex((t) => t.id === body.id);
  if (idx === -1) return Response.json({ error: "not found" }, { status: 404 });
  todos[idx] = { ...todos[idx], ...body };
  await writeJSON(FILE, todos);
  return Response.json(todos[idx]);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const todos = await readJSON<Todo>(FILE);
  const filtered = todos.filter((t) => t.id !== id);
  await writeJSON(FILE, filtered);
  return Response.json({ ok: true });
}
