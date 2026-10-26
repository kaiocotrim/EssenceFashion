import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { initialManagement, type ManagementData } from "../management";
import { supabaseConfigured } from "./supabase";
import { databaseConfigured, getPrisma } from "./prisma";
import { databaseError, mutatePrismaManagement, readPrismaManagement } from "./prisma-repository";

export const dataDirectory = process.env.ESSEN_DATA_DIRECTORY || path.join(process.cwd(), ".data");
const filename = path.join(dataDirectory, "store.json");
let queue: Promise<unknown> = Promise.resolve();
export function assertWritable() {
  if (!databaseConfigured() && (process.env.VERCEL || supabaseConfigured())) throw new Error("Configure DATABASE_URL com a conexão PostgreSQL do Supabase para usar o Prisma.");
}
export async function readManagement(): Promise<ManagementData> {
  assertWritable();
  if (databaseConfigured()) {
    try { return await readPrismaManagement(getPrisma()); }
    catch (error) { throw databaseError(error); }
  }
  try { return JSON.parse(await readFile(filename, "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return initialManagement(); throw error; }
}
export function mutateManagement(update: (data: ManagementData) => ManagementData) {
  const result = queue.then(async () => {
    assertWritable();
    if (databaseConfigured()) {
      try { return await mutatePrismaManagement(getPrisma(), update); }
      catch (error) {
        // Preserve validation messages raised by the application callback.
        if (error instanceof Error && !("code" in error) && !error.name.startsWith("Prisma")) throw error;
        throw databaseError(error);
      }
    }
    const previous = await readManagement();
    const next = update(previous);
    await mkdir(dataDirectory, { recursive: true });
    const temporary = `${filename}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(next, null, 2), { mode: 0o600 });
    await rename(temporary, filename);
    return next;
  });
  queue = result.catch(() => {});
  return result;
}
