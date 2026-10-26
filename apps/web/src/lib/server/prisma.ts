import "server-only";
import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

export const databaseConfigured = () => Boolean(process.env.DATABASE_URL);

export function createPrismaClient(connectionString: string) {
  const url = new URL(connectionString);
  if (!["postgresql:", "postgres:"].includes(url.protocol)) throw new Error("DATABASE_URL deve ser uma conexão PostgreSQL.");
  const adapter = new PrismaPg({ connectionString, max: 3, connectionTimeoutMillis: 10000, idleTimeoutMillis: 30000 });
  return new PrismaClient({ adapter, errorFormat: "minimal", log: [] });
}

const globalPrisma = globalThis as unknown as { essenPrisma?: ReturnType<typeof createPrismaClient>; essenPrismaConfiguration?: string };
export function getPrisma() {
  if (!process.env.DATABASE_URL) throw new Error("Configure DATABASE_URL com a conexão PostgreSQL do Supabase no arquivo .env.local.");
  const configuration = createHash("sha256").update(process.env.DATABASE_URL).digest("hex");
  if (!globalPrisma.essenPrisma || globalPrisma.essenPrismaConfiguration !== configuration) {
    const previous = globalPrisma.essenPrisma;
    globalPrisma.essenPrisma = createPrismaClient(process.env.DATABASE_URL);
    globalPrisma.essenPrismaConfiguration = configuration;
    void previous?.$disconnect().catch(() => {});
  }
  return globalPrisma.essenPrisma;
}
