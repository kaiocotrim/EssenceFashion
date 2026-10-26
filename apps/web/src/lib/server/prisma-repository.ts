import "server-only";
import { Prisma, type PrismaClient } from "../../generated/prisma/client";
import { initialManagement, type ManagementData, type Shipment, type ShippingSettings } from "../management";
import type { Product } from "../catalog";

type Transaction = Prisma.TransactionClient;
export class RevisionConflictError extends Error {
  constructor() { super("Os dados mudaram em outra aba. Atualize o painel e tente novamente."); }
}

export function databaseError(error: unknown): Error {
  if (error instanceof RevisionConflictError) return error;
  // Prisma may wrap the PostgreSQL diagnostic inside its driver adapter metadata.
  // Inspect it only for classification; never return raw messages/connection URLs.
  function details(value: unknown, depth = 0): string {
    if (depth > 4 || value === null) return "";
    if (typeof value === "string") return value;
    if (typeof value !== "object") return "";
    return [value instanceof Error ? value.message : "", ...Object.values(value).map((child) => details(child, depth + 1))].join(" ");
  }
  const diagnostic = details(error);
  if (/ECIRCUITBREAKER|circuit breaker/i.test(diagnostic)) return new Error("O Supabase bloqueou temporariamente novas conexões após falhas de autenticação. Confira a senha do banco e aguarde até 2 minutos sem novas tentativas.");
  if (/28P01|password authentication failed|invalid password/i.test(diagnostic)) return new Error("O Supabase recusou a senha PostgreSQL. Confira a senha do banco em DATABASE_URL e DIRECT_URL.");
  const code = error && typeof error === "object" && "code" in error ? error.code : "";
  if (code === "P2002") return new Error("Este código já está cadastrado. Atualize o painel e tente novamente.");
  if (code === "P2021" || code === "P2022") return new Error("A estrutura do banco ainda não foi instalada. Execute a migração Prisma.");
  if (code === "P2034") return new RevisionConflictError();
  return new Error("Não foi possível acessar o PostgreSQL pelo Prisma. Verifique a conexão DATABASE_URL e as migrações.");
}

async function readState(tx: Transaction): Promise<ManagementData> {
  const settings = await tx.storeSettings.findUnique({ where: { id: true } });
  if (!settings?.initialized) return initialManagement();
  const [rows, movements, shipments] = await Promise.all([
    tx.product.findMany({ orderBy: { id: "asc" }, include: { variants: { orderBy: { position: "asc" } } } }),
    tx.stockMovement.findMany({ orderBy: [{ occurredAt: "desc" }, { id: "asc" }] }),
    tx.shipment.findMany({ orderBy: [{ createdAt: "desc" }, { id: "asc" }] }),
  ]);
  const products: Product[] = rows.map((row) => ({
    id: Number(row.id), sku: row.sku, name: row.name, category: row.category,
    price: Number(row.price), compareAt: row.compareAt === null ? undefined : Number(row.compareAt),
    color: row.color, image: row.image, tag: row.tag, description: row.description,
    occasion: row.occasion as Product["occasion"], fabric: row.fabric ?? undefined,
    active: row.active, featured: row.featured, isNew: row.isNew,
    sizes: row.variants.map((variant) => variant.size),
    stock: Object.fromEntries(row.variants.map((variant) => [variant.size, variant.quantity])),
  }));
  return { revision: settings.revision, shipping: settings.shipping as unknown as ShippingSettings, products,
    movements: movements.map((row) => ({ id: row.id, productId: Number(row.productId), productName: row.productName, size: row.size, before: row.beforeQuantity, after: row.afterQuantity, reason: row.reason, at: row.occurredAt.toISOString() })),
    shipments: shipments.map((row) => ({ ...row, service: row.service as Shipment["service"], status: row.status as Shipment["status"], createdAt: row.createdAt.toISOString() })),
  };
}

export function readPrismaManagement(client: PrismaClient) {
  return client.$transaction((tx) => readState(tx), { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead, timeout: 30000 });
}

async function persistState(tx: Transaction, next: ManagementData) {
  for (const product of next.products) {
    const fields = { sku: product.sku!, name: product.name, category: product.category,
      price: new Prisma.Decimal(product.price), compareAt: product.compareAt === undefined ? null : new Prisma.Decimal(product.compareAt),
      color: product.color, image: product.image, tag: product.tag, description: product.description,
      occasion: product.occasion ?? null, fabric: product.fabric ?? null,
      active: product.active !== false, featured: product.featured === true, isNew: product.isNew === true };
    await tx.product.upsert({ where: { id: BigInt(product.id) }, create: { id: BigInt(product.id), ...fields }, update: fields });
  }
  // The store revision is locked; replacing the grade is atomic for all readers.
  await tx.productVariant.deleteMany({});
  const variants = next.products.flatMap((product) => product.sizes.map((size, position) => ({ productId: BigInt(product.id), size, position, quantity: product.stock?.[size] ?? 0 })));
  if (variants.length) await tx.productVariant.createMany({ data: variants });
  for (const shipment of next.shipments) {
    const fields = { reference: shipment.reference, recipient: shipment.recipient, destination: shipment.destination, service: shipment.service, status: shipment.status, tracking: shipment.tracking };
    await tx.shipment.upsert({ where: { id: shipment.id }, create: { id: shipment.id, ...fields, createdAt: new Date(shipment.createdAt) }, update: fields });
  }
  if (next.movements.length) await tx.stockMovement.createMany({ skipDuplicates: true, data: next.movements.map((movement) => ({ id: movement.id, productId: BigInt(movement.productId), productName: movement.productName, size: movement.size, beforeQuantity: movement.before, afterQuantity: movement.after, reason: movement.reason, occurredAt: new Date(movement.at) })) });
  await tx.stockMovement.deleteMany({ where: { id: { notIn: next.movements.map((movement) => movement.id) } } });
  await tx.storeSettings.update({ where: { id: true }, data: { revision: next.revision, initialized: true, shipping: next.shipping as unknown as Prisma.InputJsonValue, updatedAt: new Date() } });
}

export function mutatePrismaManagement(client: PrismaClient, update: (state: ManagementData) => ManagementData) {
  return client.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT revision FROM public.essen_store_settings WHERE id = true FOR UPDATE`;
    const previous = await readState(tx);
    const next = update(previous);
    if (next.revision !== previous.revision + 1) throw new RevisionConflictError();
    await persistState(tx, next);
    return next;
  }, { timeout: 30000, maxWait: 10000 });
}

export async function initializePrismaManagement(client: PrismaClient, state: ManagementData) {
  return client.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<{ initialized: boolean }[]>`SELECT initialized FROM public.essen_store_settings WHERE id = true FOR UPDATE`;
    if (!rows.length || rows[0].initialized) throw new Error("A loja já foi inicializada. A importação não sobrescreve dados existentes.");
    const next = { ...state, revision: 1 };
    await persistState(tx, next);
    return next;
  }, { timeout: 30000, maxWait: 10000 });
}
