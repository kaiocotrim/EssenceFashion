import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import { initialManagement, type ManagementData } from "../src/lib/management";
import { databaseConfigured, getPrisma } from "../src/lib/server/prisma";
import { databaseError, initializePrismaManagement } from "../src/lib/server/prisma-repository";
import { ensureProductImageBucket, supabaseConfigured, uploadProductImage } from "../src/lib/server/supabase";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });
async function main() {
  if (!databaseConfigured()) throw new Error("Preencha DATABASE_URL no arquivo .env.local antes de importar.");
  const mode = process.argv[2];
  if (!["--seed", "--from-local"].includes(mode)) throw new Error("Escolha --seed ou --from-local.");
  const client = getPrisma();
  try {
    const settings = await client.storeSettings.findUnique({ where: { id: true } });
    if (!settings) throw new Error("Execute npm run db:migrate antes de importar.");
    if (settings.initialized) throw new Error("A loja já contém dados. A importação não sobrescreve os cadastros existentes.");
    const local = process.env.ESSEN_DATA_DIRECTORY || path.join(process.cwd(), ".data");
    const state: ManagementData = mode === "--from-local" ? JSON.parse(await readFile(path.join(local, "store.json"), "utf8")) : initialManagement();
    if (supabaseConfigured()) await ensureProductImageBucket();
    for (const product of state.products) {
      if (!product.image.startsWith("/api/media/")) continue;
      if (!supabaseConfigured()) throw new Error("Configure o Supabase Storage antes de importar fotos locais.");
      const name = product.image.split("/").at(-1)!;
      if (!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(name)) throw new Error("Uma foto local tem um nome inválido.");
      const extension = name.split(".").at(-1)!, type = extension === "jpg" ? "image/jpeg" : `image/${extension}`;
      product.image = await uploadProductImage(`${randomUUID()}.${extension}`, await readFile(path.join(local, "uploads", name)), type);
    }
    await initializePrismaManagement(client, state);
    console.log(`Importação Prisma concluída: ${state.products.length} produtos, ${state.shipments.length} envios e ${state.movements.length} movimentações. Os arquivos locais foram preservados.`);
    console.log("Crie o acesso pelo localhost conectado ao banco. A senha local não foi copiada.");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && String(error.code).startsWith("P")) throw databaseError(error);
    throw error;
  } finally { await client.$disconnect(); }
}
main().catch((error) => { console.error(error instanceof Error ? error.message : "Não foi possível importar."); process.exitCode = 1; });
