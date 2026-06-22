import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import fs from "fs";

const IMAGES_DIR = path.join(process.cwd(), "data", "ideas", "images");

const MIME_MAP: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Prevent path traversal
  if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const mime = MIME_MAP[ext];
  if (!mime) {
    return new Response("Unsupported file type", { status: 400 });
  }

  const filePath = path.join(IMAGES_DIR, filename);

  try {
    // Verify path is within IMAGES_DIR
    if (!filePath.startsWith(IMAGES_DIR)) {
      return new Response("Not found", { status: 404 });
    }

    if (!fs.existsSync(filePath)) {
      return new Response("Not found", { status: 404 });
    }

    const buffer = await readFile(filePath);
    return new Response(buffer, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
