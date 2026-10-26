import { config } from "dotenv";
import { databaseConfigured, getPrisma } from "../src/lib/server/prisma";
import { databaseError } from "../src/lib/server/prisma-repository";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });
async function main() {
  if (!databaseConfigured()) throw new Error("Preencha DATABASE_URL em apps/web/.env.local com a conexão PostgreSQL do Supabase.");
  const client = getPrisma();
  try {
    await client.$queryRaw`SELECT 1`;
    const [products, settings] = await Promise.all([client.product.count(), client.storeSettings.findUnique({ where: { id: true } })]);
    console.log(JSON.stringify({ connected: true, orm: "Prisma", products, initialized: settings?.initialized ?? false }));
  } catch (error) { throw databaseError(error); }
  finally { await client.$disconnect(); }
}
main().catch((error) => { console.error(error instanceof Error ? error.message : "Falha ao conectar com Prisma."); process.exitCode = 1; });
