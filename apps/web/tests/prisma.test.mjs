import test, { after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { createPrismaClient, getPrisma } from "../src/lib/server/prisma.ts";
import { initializePrismaManagement, readPrismaManagement, mutatePrismaManagement, RevisionConflictError, databaseError } from "../src/lib/server/prisma-repository.ts";
import { initialManagement, applyManagementAction } from "../src/lib/management.ts";

const db = await PGlite.create();
await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
const migration = await readFile(new URL("../prisma/migrations/202610260001_essen_management/migration.sql", import.meta.url), "utf8");
await db.exec(migration);
const server = new PGLiteSocketServer({ db, port: 0, host: "127.0.0.1", maxConnections: 1 });
await server.start();
const address = server.getServerConn();
const connectionString = address.startsWith("postgres") ? address : `postgresql://postgres:postgres@${address}/postgres`;
const client = createPrismaClient(connectionString);
after(async () => { await client.$disconnect(); await server.stop(); await db.close(); });
let state;
const action = (change) => mutatePrismaManagement(client, (previous) => applyManagementAction(previous, change, `test-${previous.revision}`, "2026-10-26T14:00:00.000Z"));

test("renova o cliente em memória quando a conexão é alterada", async () => {
  const previous = process.env.DATABASE_URL;
  try {
    process.env.DATABASE_URL = "postgresql://postgres:fixture-one@127.0.0.1:1/postgres";
    const first = getPrisma(); assert.equal(getPrisma(), first);
    process.env.DATABASE_URL = "postgresql://postgres:fixture-two@127.0.0.1:1/postgres";
    const second = getPrisma(); assert.notEqual(second, first); await second.$disconnect();
  } finally { if (previous === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = previous; }
});

test("diagnóstico diferencia bloqueio e senha recusada sem exibir credenciais", () => {
  const hidden = "postgresql://user:private-password@host/db";
  const blocked = databaseError({ code: "P2010", meta: { driverAdapterError: { cause: { message: `(ECIRCUITBREAKER) too many authentication failures ${hidden}` } } } });
  assert.match(blocked.message, /bloqueou temporariamente/); assert.ok(!blocked.message.includes("private-password"));
  assert.match(databaseError(new Error(`password authentication failed ${hidden}`)).message, /recusou a senha/);
});

test("Prisma conecta ao PostgreSQL e aplica o schema sem funções RPC", async () => {
  assert.deepEqual(await client.$queryRaw`SELECT 1 AS connected`, [{ connected: 1 }]);
  assert.equal(await client.product.count(), 0);
  assert.equal((await readPrismaManagement(client)).revision, 0);
  const routines = await client.$queryRaw`select count(*)::integer as count from pg_proc where proname in ('essen_read_store','essen_commit_store')`;
  assert.equal(routines[0].count, 0);
});
test("importa o catálogo com Decimal, estoque e ordem dos tamanhos", async () => {
  await initializePrismaManagement(client, initialManagement());
  state = await readPrismaManagement(client);
  assert.equal(state.products.length, 11); assert.equal(state.revision, 1);
  assert.equal(typeof state.products[0].price, "number");
  assert.deepEqual(state.products[0].sizes, ["PP", "P", "M", "G", "GG"]);
  assert.equal(await client.productVariant.count(), 51);
  await assert.rejects(initializePrismaManagement(client, initialManagement()), /já foi inicializada/);
});
test("ajusta estoque e persiste histórico pela transação Prisma", async () => {
  await action({ type: "stock", id: 2, size: "M", quantity: 8, reason: "Reposição" });
  state = await readPrismaManagement(client);
  assert.equal(state.products[1].stock.M, 8); assert.equal(state.movements[0].after, 8);
});
test("uma edição com revisão antiga não sobrescreve o banco", async () => {
  await assert.rejects(mutatePrismaManagement(client, (previous) => {
    if (previous.revision !== 0) throw new RevisionConflictError(); return previous;
  }), /outra aba/);
  assert.equal((await readPrismaManagement(client)).products[1].stock.M, 8);
});
test("rollback mantém preço, estoque e revisão quando uma gravação falha", async () => {
  const previous = await readPrismaManagement(client);
  await assert.rejects(mutatePrismaManagement(client, (value) => {
    const next = structuredClone(value); next.revision++; next.products[0].price = 0; next.products[1].stock.M = 99; return next;
  }));
  const current = await readPrismaManagement(client);
  assert.equal(current.products[0].price, previous.products[0].price); assert.equal(current.products[1].stock.M, 8); assert.equal(current.revision, previous.revision);
});
test("edita tamanhos e publicação sem apagar o produto", async () => {
  state = await readPrismaManagement(client);
  await action({ type: "product", product: { ...state.products[1], sizes: ["M", "G"], active: false } });
  state = await readPrismaManagement(client);
  assert.deepEqual(state.products[1].sizes, ["M", "G"]); assert.equal(state.products[1].active, false); assert.equal(state.products.length, 11);
});
test("envio e configuração de frete persistem pelos modelos Prisma", async () => {
  await action({ type: "shipment", shipment: { id: "", reference: "EF-1", recipient: "Cliente teste", destination: "São Paulo / SP", service: "PAC", status: "posted", tracking: "AA123456789BR" } });
  state = await readPrismaManagement(client);
  await action({ type: "shipping", settings: { ...state.shipping, originZip: "01001000", pacPrice: 12.5 } });
  state = await readPrismaManagement(client); assert.equal(state.shipments[0].tracking, "AA123456789BR"); assert.equal(state.shipping.pacPrice, 12.5);
});
test("credenciais administrativas usam o modelo Prisma e tabelas mantêm RLS", async () => {
  await client.admin.create({ data: { id: true, salt: "a".repeat(32), hash: "b".repeat(128), secret: "c".repeat(64) } });
  assert.equal((await client.admin.findUnique({ where: { id: true } })).hash.length, 128);
  const security = await client.$queryRaw`select relrowsecurity from pg_class where relname like 'essen_%' and relkind='r'`;
  assert.equal(security.length, 6); assert.ok(security.every((table) => table.relrowsecurity));
  await client.$disconnect();
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`SET ROLE ${role}`);
    await assert.rejects(db.query("select * from public.essen_admin"), /permission denied/);
    await assert.rejects(db.query("select * from public.essen_products"), /permission denied/);
    await db.exec("RESET ROLE");
  }
});
