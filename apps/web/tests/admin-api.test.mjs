import test, { after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, scryptSync } from "node:crypto";
import { createServer } from "node:net";
import { spawn } from "node:child_process";

const web = fileURLToPath(new URL("..", import.meta.url));
const directory = await mkdtemp(path.join(tmpdir(), "essence-admin-test-"));
const password = randomBytes(20).toString("hex"), salt = randomBytes(16).toString("hex");
await writeFile(path.join(directory, "admin.json"), JSON.stringify({ salt, hash: scryptSync(password, salt, 64).toString("hex"), secret: randomBytes(32).toString("hex") }));
const port = await new Promise((resolve) => { const socket = createServer(); socket.listen(0, "127.0.0.1", () => { const value = socket.address().port; socket.close(() => resolve(value)); }); });
const base = `http://localhost:${port}`;
const server = spawn(process.execPath, [fileURLToPath(new URL("../../../node_modules/next/dist/bin/next", import.meta.url)), "start", "-p", String(port)], { cwd: web, env: { ...process.env, ESSEN_DATA_DIRECTORY: directory, NODE_ENV: "production", DATABASE_URL: "", DIRECT_URL: "", SUPABASE_URL: "", SUPABASE_SECRET_KEY: "", SUPABASE_SERVICE_ROLE_KEY: "", VERCEL: "" }, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
let output = "";
server.stdout.on("data", (chunk) => { output += chunk; }); server.stderr.on("data", (chunk) => { output += chunk; });
after(async () => {
  server.kill();
  await new Promise((resolve) => { if (server.exitCode !== null) resolve(); else { server.once("exit", resolve); setTimeout(resolve, 2000); } });
  const resolved = path.resolve(directory);
  if (resolved.startsWith(path.resolve(tmpdir()) + path.sep) && path.basename(resolved).startsWith("essence-admin-test-")) await rm(resolved, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
});
let online = false;
for (let attempt = 0; attempt < 60; attempt++) {
  try { if ((await fetch(`${base}/api/admin/session`)).ok) { online = true; break; } } catch {}
  await new Promise((resolve) => setTimeout(resolve, 150));
}
assert.ok(online, `Servidor de teste não iniciou: ${output}`);
let cookie = "", data;
const get = (url, auth = true) => fetch(base + url, { headers: auth && cookie ? { Cookie: cookie } : {} });
const post = (url, body, origin = base) => fetch(base + url, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie }, body: JSON.stringify(body) });
async function mutate(action) {
  const response = await post("/api/admin/store", { ...action, revision: data.revision });
  assert.equal(response.status, 200, await response.clone().text()); data = await response.json();
}

test("área administrativa exige sessão e rejeita senha incorreta", async () => {
  assert.equal((await get("/api/admin/store", false)).status, 401);
  assert.equal((await post("/api/admin/upload", {})).status, 401);
  assert.equal((await post("/api/admin/session", { password: "invalid" })).status, 401);
  const response = await post("/api/admin/session", { password });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie"), /HttpOnly/i);
  assert.match(response.headers.get("set-cookie"), /SameSite=Strict/i);
  cookie = response.headers.get("set-cookie").split(";")[0];
  data = await (await get("/api/admin/store")).json();
  assert.equal(data.products.length, 11);
});
test("bloqueia alteração enviada de outro site", async () => {
  assert.equal((await post("/api/admin/store", { type: "stock", revision: data.revision, id: 2, size: "M", quantity: 6, reason: "Teste" }, "https://outro-site.example")).status, 400);
});
test("salva estoque e torna a alteração pública sem expor dados administrativos", async () => {
  await mutate({ type: "stock", id: 2, size: "M", quantity: 6, reason: "Teste de reposição" });
  const publicData = await (await get("/api/catalog", false)).json();
  assert.equal(publicData.products.find((item) => item.id === 2).stock.M, 6);
  assert.equal(publicData.movements, undefined); assert.equal(publicData.shipments, undefined);
  const persisted = JSON.parse(await readFile(path.join(directory, "store.json"), "utf8"));
  assert.equal(persisted.movements[0].after, 6);
});
test("recusa revisões antigas e serializa duas gravações concorrentes", async () => {
  assert.equal((await post("/api/admin/store", { type: "stock", revision: -1, id: 2, size: "M", quantity: 8, reason: "Antigo" })).status, 400);
  const action = { type: "stock", revision: data.revision, id: 2, size: "M", quantity: 7, reason: "Concorrência" };
  const responses = await Promise.all([post("/api/admin/store", action), post("/api/admin/store", action)]);
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 400]);
  data = await (await get("/api/admin/store")).json();
});
test("upload retorna foto persistida e bloqueia formato inválido", async () => {
  const form = new FormData(); form.set("file", new Blob(["not-an-image"], { type: "image/png" }), "fake.png");
  assert.equal((await fetch(base + "/api/admin/upload", { method: "POST", headers: { Cookie: cookie, Origin: base }, body: form })).status, 400);
  const buffer = await readFile(new URL("../public/images/products/vestido-aurora.webp", import.meta.url));
  const valid = new FormData(); valid.set("file", new Blob([buffer], { type: "image/webp" }), "foto.webp");
  const response = await fetch(base + "/api/admin/upload", { method: "POST", headers: { Cookie: cookie, Origin: base }, body: valid });
  assert.equal(response.status, 200); const { url } = await response.json();
  const image = await get(url, false); assert.equal(image.status, 200); assert.equal(image.headers.get("content-type"), "image/webp");
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), buffer);
});
test("novo cadastro pode ficar oculto e depois aparecer na vitrine e nos detalhes", async () => {
  await mutate({ type: "product", product: { ...data.products[0], id: 0, sku: "QA-NEW", name: "Produto de teste", active: false, stock: { M: 3 }, sizes: ["M"] } });
  const product = data.products.at(-1);
  assert.ok(!(await (await get("/api/catalog", false)).json()).products.some((item) => item.id === product.id));
  await mutate({ type: "product", product: { ...product, active: true } });
  assert.ok((await (await get("/api/catalog", false)).json()).products.some((item) => item.id === product.id));
  const detail = await get(`/produto/${product.id}`, false); assert.equal(detail.status, 200); assert.match(await detail.text(), /Produto de teste/);
});
test("configura frete e registra envio sem expor o destinatário no catálogo", async () => {
  await mutate({ type: "shipping", settings: { ...data.shipping, originZip: "01001000", pacPrice: 12.5 } });
  await mutate({ type: "shipment", shipment: { id: "", reference: "QA-1", recipient: "Cliente teste", destination: "São Paulo / SP", service: "PAC", status: "posted", tracking: "AA123456789BR" } });
  assert.equal(data.shipments.length, 1);
  const response = await get("/api/catalog", false), text = await response.text();
  assert.equal(JSON.parse(text).shipping.pacPrice, 12.5); assert.ok(!text.includes("Cliente teste"));
});
test("sair remove o cookie e pedidos sem sessão voltam a ser negados", async () => {
  const response = await fetch(base + "/api/admin/session", { method: "DELETE", headers: { Cookie: cookie, Origin: base } });
  assert.equal(response.status, 200); assert.match(response.headers.get("set-cookie"), /Max-Age=0|Expires=Thu, 01 Jan 1970/i);
  cookie = ""; assert.equal((await get("/api/admin/store")).status, 401);
});
