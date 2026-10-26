import "server-only";
import { cookies } from "next/headers";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertWritable, dataDirectory } from "./management-db";
import { databaseConfigured, getPrisma } from "./prisma";
import { databaseError } from "./prisma-repository";

const authFile = path.join(dataDirectory, "admin.json");
const cookieName = "essen-admin";
type Admin = { salt: string; hash: string; secret: string };
export async function getAdmin(): Promise<Admin | null> {
  assertWritable();
  if (databaseConfigured()) {
    try { return await getPrisma().admin.findUnique({ where: { id: true }, select: { salt: true, hash: true, secret: true } }); }
    catch (error) { throw databaseError(error); }
  }
  try { return JSON.parse(await readFile(authFile, "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) throw new Error("Origem da solicitação não permitida.");
}
export async function createAdmin(password: string, request: Request) {
  assertWritable();
  if (process.env.NODE_ENV !== "development" || !["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname)) throw new Error("O primeiro acesso deve ser configurado pelo localhost em desenvolvimento.");
  if (password.length < 10 || password.length > 128) throw new Error("Crie uma senha com 10 a 128 caracteres.");
  const salt = randomBytes(16).toString("hex");
  const admin: Admin = { salt, hash: scryptSync(password, salt, 64).toString("hex"), secret: randomBytes(32).toString("hex") };
  if (databaseConfigured()) {
    try { await getPrisma().admin.create({ data: { id: true, ...admin } }); }
    catch (error) { throw databaseError(error); }
    return admin;
  }
  await mkdir(dataDirectory, { recursive: true });
  try { await writeFile(authFile, JSON.stringify(admin), { flag: "wx", mode: 0o600 }); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new Error("O administrador já foi configurado. Faça login."); throw error; }
  return admin;
}
export function validPassword(password: string, admin: Admin) {
  return password.length <= 128 && timingSafeEqual(scryptSync(password, admin.salt, 64), Buffer.from(admin.hash, "hex"));
}
export async function startSession(admin: Admin) {
  const value = `${Date.now() + 12 * 60 * 60 * 1000}.${randomBytes(16).toString("hex")}`;
  const signature = createHmac("sha256", admin.secret).update(value).digest("hex");
  (await cookies()).set(cookieName, `${value}.${signature}`, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 43200 });
}
export async function authenticated() {
  const admin = await getAdmin();
  const token = (await cookies()).get(cookieName)?.value;
  if (!admin || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || !/^\d+$/.test(parts[0]) || Number(parts[0]) < Date.now() || !/^[a-f0-9]{64}$/.test(parts[2])) return false;
  const signature = createHmac("sha256", admin.secret).update(`${parts[0]}.${parts[1]}`).digest();
  return timingSafeEqual(signature, Buffer.from(parts[2], "hex"));
}
export async function endSession() { (await cookies()).delete(cookieName); }
