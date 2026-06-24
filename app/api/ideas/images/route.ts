import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const IMAGES_DIR = path.join(process.cwd(), "data", "ideas", "images");

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
]);

const EXT_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return Response.json(
        { error: `Unsupported image type: ${file.type}` },
        { status: 400 }
      );
    }

    const ext = EXT_MAP[file.type] ?? "png";
    const filename = `${nanoid()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(IMAGES_DIR, filename);

    await mkdir(IMAGES_DIR, { recursive: true });
    await writeFile(filePath, buffer);

    return Response.json({ url: `/api/ideas/images/${filename}` }, { status: 201 });
  } catch (err) {
    console.error("Image upload failed:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
