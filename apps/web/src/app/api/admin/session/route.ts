import { authenticated, createAdmin, endSession, getAdmin, sameOrigin, startSession, validPassword } from "@/lib/server/admin-auth";
import { databaseConfigured } from "@/lib/server/prisma";

let failures = 0;
let lockedUntil = 0;
export async function GET() {
  try {
    return Response.json({ configured: Boolean(await getAdmin()), authenticated: await authenticated(), local: process.env.NODE_ENV === "development", storage: databaseConfigured() ? "supabase" : "local", database: databaseConfigured() ? "prisma" : "local" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Não foi possível conectar ao banco." }, { status: 503 }); }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (Date.now() < lockedUntil) return Response.json({ error: "Muitas tentativas. Tente novamente em 15 minutos." }, { status: 429 });
    const input = await request.json();
    if (typeof input.password !== "string" || input.password.length > 128) throw new Error("Informe uma senha válida.");
    const admin = input.setup ? await createAdmin(input.password, request) : await getAdmin();
    if (!admin || !validPassword(input.password, admin)) {
      if (++failures >= 10) { lockedUntil = Date.now() + 15 * 60 * 1000; failures = 0; }
      return Response.json({ error: "Senha incorreta." }, { status: 401 });
    }
    failures = 0;
    await startSession(admin);
    return Response.json({ ok: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Não foi possível entrar." }, { status: 400 }); }
}
export async function DELETE(request: Request) {
  try { sameOrigin(request); await endSession(); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "Solicitação inválida." }, { status: 403 }); }
}
