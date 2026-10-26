import path from "node:path";
import { readFile } from "node:fs/promises";
import { dataDirectory } from "@/lib/server/management-db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(id)) return new Response(null, { status: 404 });
  try {
    const file = await readFile(path.join(dataDirectory, "uploads", id));
    return new Response(file, { headers: { "Content-Type": id.endsWith(".png") ? "image/png" : id.endsWith(".webp") ? "image/webp" : "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response(null, { status: 404 }); }
}
