import { randomUUID } from "node:crypto";
import { authenticated, sameOrigin } from "@/lib/server/admin-auth";
import { mutateManagement, readManagement } from "@/lib/server/management-db";
import { applyManagementAction } from "@/lib/management";

export async function GET() {
  if (!await authenticated()) return Response.json({ error: "Faça login para continuar." }, { status: 401 });
  return Response.json(await readManagement(), { headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  if (!await authenticated()) return Response.json({ error: "Sua sessão expirou. Entre novamente." }, { status: 401 });
  try {
    sameOrigin(request);
    const body = await request.text();
    if (body.length > 100000) throw new Error("Solicitação muito grande.");
    const action = JSON.parse(body);
    const next = await mutateManagement((data) => {
      if (action.revision !== data.revision) throw new Error("Os dados mudaram em outra aba. Atualize o painel e tente novamente.");
      return applyManagementAction(data, action, randomUUID(), new Date().toISOString());
    });
    return Response.json(next);
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Não foi possível salvar." }, { status: 400 }); }
}
