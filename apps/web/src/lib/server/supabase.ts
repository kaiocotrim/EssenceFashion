import "server-only";

export const productImageBucket = "essen-product-images";

export function supabaseConfigured() {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Public browser settings alone do not enable privileged server access.
  if (!process.env.SUPABASE_URL && !key) return false;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || !key) throw new Error("Configure SUPABASE_URL e SUPABASE_SECRET_KEY no servidor.");
  return true;
}

function configuration() {
  if (!supabaseConfigured()) throw new Error("O Supabase ainda não foi configurado no servidor.");
  const url = new URL((process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!);
  if (url.protocol !== "https:" || !url.hostname.endsWith(".supabase.co") || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("SUPABASE_URL deve ser o endereço HTTPS do seu projeto Supabase.");
  const key = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!;
  if (!key.startsWith("sb_secret_")) {
    try { if (JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString()).role !== "service_role") throw new Error(); }
    catch { throw new Error("Use uma chave secreta do servidor (secret ou service_role), nunca uma chave pública."); }
  }
  return { url: url.origin, key };
}

export async function supabaseRequest<T>(pathname: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = configuration();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  // Legacy service_role keys are JWTs; the newer secret keys use apikey only.
  if (!key.startsWith("sb_secret_")) headers.set("Authorization", `Bearer ${key}`);
  let response: Response;
  try { response = await fetch(`${url}${pathname}`, { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(15000), redirect: "error" }); }
  catch { throw new Error("Não foi possível alcançar o Supabase. Verifique a conexão e tente novamente."); }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (error.message === "ESSEN_REVISION_CONFLICT") throw new Error("Os dados mudaram em outra aba. Atualize o painel e tente novamente.");
    if (response.status === 401 || response.status === 403) throw new Error("O Supabase recusou o acesso. Confira a chave secreta configurada no servidor.");
    if (error.code === "PGRST202" || error.code === "42P01") throw new Error("A estrutura do banco ainda não foi instalada. Aplique a migração Supabase da Essen Fashion.");
    if (response.status === 409 || error.code === "23505") throw new Error("Este cadastro já existe. Atualize o painel antes de tentar novamente.");
    throw new Error("O Supabase não concluiu a operação. Verifique a migração e o armazenamento do projeto.");
  }
  if (response.status === 204 || response.headers.get("content-length") === "0") return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function ensureProductImageBucket() {
  const buckets = await supabaseRequest<{ id: string; public: boolean }[]>("/storage/v1/bucket");
  const existing = buckets.find((bucket) => bucket.id === productImageBucket);
  if (existing) {
    if (!existing.public) throw new Error("O bucket de fotos existente é privado. Configure um bucket público de catálogo antes de continuar.");
    return;
  }
  await supabaseRequest("/storage/v1/bucket", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: productImageBucket, name: productImageBucket, public: true, file_size_limit: 4194304, allowed_mime_types: ["image/jpeg", "image/png", "image/webp"] }) });
}

export async function uploadProductImage(name: string, content: Buffer, type: string) {
  await ensureProductImageBucket();
  await supabaseRequest(`/storage/v1/object/${productImageBucket}/${name}`, { method: "POST", headers: { "Content-Type": type, "x-upsert": "false" }, body: new Uint8Array(content) });
  return `${configuration().url}/storage/v1/object/public/${productImageBucket}/${name}`;
}
