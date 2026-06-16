import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export async function readJSON<T>(filePath: string): Promise<T[]> {
  const fullPath = path.join(DATA_DIR, filePath);
  try {
    const raw = await fs.readFile(fullPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeJSON<T>(filePath: string, data: T[]): Promise<void> {
  const fullPath = path.join(DATA_DIR, filePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
}
