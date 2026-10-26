import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { authenticated, sameOrigin } from "@/lib/server/admin-auth";
import { assertWritable, dataDirectory } from "@/lib/server/management-db";
import { supabaseConfigured, uploadProductImage } from "@/lib/server/supabase";
import { databaseConfigured } from "@/lib/server/prisma";

export async function POST(request: Request) {
  if (!await authenticated()) return Response.json({ error: "Faça login para enviar fotos." }, { status: 401 });
  try {
    sameOrigin(request); assertWritable();
    if (Number(request.headers.get("content-length") ?? 0) > 4.2 * 1024 * 1024) throw new Error("A foto deve ter até 4 MB.");
    const file = (await request.formData()).get("file");
    if (!(file instanceof File) || !file.size || file.size > 4 * 1024 * 1024) throw new Error("Escolha uma foto de até 4 MB.");
    const buffer = Buffer.from(await file.arrayBuffer());
    let extension = "";
    if (buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) extension = "png";
    else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) extension = "jpg";
    else if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") extension = "webp";
    if (!extension) throw new Error("Use uma imagem JPG, PNG ou WebP.");
    const name = `${randomUUID()}.${extension}`;
    if (supabaseConfigured()) {
      const type = extension === "jpg" ? "image/jpeg" : `image/${extension}`;
      return Response.json({ url: await uploadProductImage(name, buffer, type) });
    }
    if (databaseConfigured() || process.env.VERCEL) throw new Error("Configure a chave do Supabase Storage para enviar fotos para a loja na nuvem.");
    await mkdir(path.join(dataDirectory, "uploads"), { recursive: true });
    await writeFile(path.join(dataDirectory, "uploads", name), buffer, { mode: 0o600 });
    return Response.json({ url: `/api/media/${name}` });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Falha ao enviar foto." }, { status: 400 }); }
}
