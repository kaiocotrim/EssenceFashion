import { products, type Product } from "./catalog";

export type Shipment = {
  id: string; reference: string; recipient: string; destination: string;
  service: "PAC" | "SEDEX"; status: "preparing" | "posted" | "delivered";
  tracking: string; createdAt: string;
};
export type ShippingSettings = {
  originZip: string; weight: number; length: number; width: number; height: number;
  pacPrice: number; sedexPrice: number; pacDays: number; sedexDays: number;
};
export type StockMovement = { id: string; productId: number; productName: string; size: string; before: number; after: number; reason: string; at: string };
export type ManagementData = { products: Product[]; shipping: ShippingSettings; shipments: Shipment[]; movements: StockMovement[]; revision: number };
export const defaultShipping: ShippingSettings = { originZip: "", weight: 0.3, length: 25, width: 20, height: 5, pacPrice: 19.9, sedexPrice: 29.9, pacDays: 8, sedexDays: 3 };
export const managedDeliveryOptions = (settings: ShippingSettings) => [
  { id: "standard", name: "Correios · PAC", description: `${settings.pacDays} dias úteis · Valor fixo demonstrativo, sem cotação por CEP`, price: settings.pacPrice },
  { id: "express", name: "Correios · SEDEX", description: `${settings.sedexDays} dias úteis · Valor fixo demonstrativo, sem cotação por CEP`, price: settings.sedexPrice },
];
export const stockTotal = (product: Product) => Object.values(product.stock ?? {}).reduce((a, b) => a + b, 0);
export const initialManagement = (): ManagementData => ({
  products: products.map((product) => ({ ...product, active: true, sku: `ESS-${String(product.id).padStart(4, "0")}`, stock: Object.fromEntries(product.sizes.map((size) => [size, 0])) })),
  shipping: { ...defaultShipping }, shipments: [], movements: [], revision: 0,
});

function text(value: unknown, label: string, max = 120) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new Error(`${label}: preencha um valor válido (até ${max} caracteres).`);
  return value.trim();
}
function number(value: unknown, label: string, max: number, integer = false) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > max || (integer && !Number.isInteger(value))) throw new Error(`${label}: informe um número válido entre 0 e ${max}.`);
  return value;
}
export function validateProduct(input: Product): Product {
  const name = text(input.name, "Nome");
  const image = text(input.image, "Imagem", 1000);
  if (!/^\/images\/[a-zA-Z0-9/_.-]+$/.test(image) && !/^\/api\/media\/[a-f0-9-]+\.(?:png|jpg|webp)$/.test(image) && !/^photo-[a-zA-Z0-9-]+$/.test(image)) {
    let url: URL; try { url = new URL(image); } catch { throw new Error("Use uma foto enviada ou uma URL HTTPS."); }
    if (url.protocol !== "https:" || url.username || url.password) throw new Error("A URL da imagem deve usar HTTPS.");
  }
  if (!Array.isArray(input.sizes) || !input.sizes.length || input.sizes.length > 12) throw new Error("Informe de 1 a 12 tamanhos.");
  const sizes = [...new Set(input.sizes.map((size) => text(size, "Tamanho", 12)))];
  const stock = Object.fromEntries(sizes.map((size) => [size, number(input.stock?.[size] ?? 0, `Estoque ${size}`, 100000, true)]));
  const price = number(input.price, "Preço", 1000000);
  if (price <= 0) throw new Error("O preço deve ser maior que zero.");
  const compareAt = input.compareAt ? number(input.compareAt, "Preço original", 1000000) : undefined;
  if (compareAt && compareAt <= price) throw new Error("O preço original deve ser maior que o preço de venda.");
  return { id: input.id, name, image, price: Math.round(price * 100) / 100, compareAt,
    category: text(input.category, "Categoria", 50), color: text(input.color, "Cor", 50),
    sku: text(input.sku, "SKU", 50), description: text(input.description, "Descrição", 3000),
    tag: typeof input.tag === "string" ? input.tag.slice(0, 40) : "", fabric: typeof input.fabric === "string" ? input.fabric.slice(0, 60) : "",
    occasion: input.occasion === "Festa" ? "Festa" : "Casual", sizes, stock,
    active: input.active === true, featured: input.featured === true, isNew: input.isNew === true };
}

export function applyManagementAction(data: ManagementData, action: { type: string; product?: Product; id?: number; size?: string; quantity?: number; reason?: string; settings?: ShippingSettings; shipment?: Shipment }, id: string, now: string): ManagementData {
  const next = structuredClone(data);
  if (action.type === "product") {
    if (!action.product) throw new Error("Produto não informado.");
    const product = validateProduct(action.product);
    const existing = next.products.find((item) => item.id === product.id);
    if (product.id !== 0 && !existing) throw new Error("Produto não encontrado.");
    if (next.products.some((item) => item.id !== product.id && item.sku?.toLowerCase() === product.sku?.toLowerCase())) throw new Error("Este SKU já está em uso.");
    product.id = existing?.id ?? Math.max(0, ...next.products.map((item) => item.id)) + 1;
    for (const size of new Set([...(existing?.sizes ?? []), ...product.sizes])) {
      const before = existing?.stock?.[size] ?? 0, after = product.stock?.[size] ?? 0;
      if (before !== after) next.movements.unshift({ id: `${id}-${size}`, productId: product.id, productName: product.name, size, before, after, reason: existing ? "Edição do produto" : "Estoque inicial", at: now });
    }
    next.products = existing ? next.products.map((item) => item.id === product.id ? product : item) : [...next.products, product];
  } else if (action.type === "stock") {
    const product = next.products.find((item) => item.id === action.id);
    if (!product || !action.size || !product.sizes.includes(action.size)) throw new Error("Produto ou tamanho não encontrado.");
    const after = number(action.quantity, "Quantidade", 100000, true), before = product.stock?.[action.size] ?? 0;
    const reason = text(action.reason, "Motivo", 160);
    product.stock = { ...product.stock, [action.size]: after };
    if (before !== after) next.movements.unshift({ id, productId: product.id, productName: product.name, size: action.size, before, after, reason, at: now });
  } else if (action.type === "shipping") {
    const settings = action.settings;
    if (!settings || !/^\d{8}$/.test(settings.originZip)) throw new Error("Informe o CEP de origem com 8 dígitos.");
    next.shipping = { originZip: settings.originZip,
      weight: number(settings.weight, "Peso", 100), length: number(settings.length, "Comprimento", 200), width: number(settings.width, "Largura", 200), height: number(settings.height, "Altura", 200),
      pacPrice: number(settings.pacPrice, "Frete PAC", 10000), sedexPrice: number(settings.sedexPrice, "Frete SEDEX", 10000), pacDays: number(settings.pacDays, "Prazo PAC", 90, true), sedexDays: number(settings.sedexDays, "Prazo SEDEX", 90, true) };
    if ([next.shipping.weight, next.shipping.length, next.shipping.width, next.shipping.height, next.shipping.pacDays, next.shipping.sedexDays].some((value) => value <= 0)) throw new Error("Peso, medidas e prazos devem ser maiores que zero.");
  } else if (action.type === "shipment") {
    const input = action.shipment;
    if (!input) throw new Error("Envio não informado.");
    const existing = next.shipments.find((item) => item.id === input.id);
    if (input.id && !existing) throw new Error("Envio não encontrado.");
    const tracking = typeof input.tracking === "string" ? input.tracking.trim().toUpperCase() : "";
    if (tracking && !/^[A-Z]{2}\d{9}[A-Z]{2}$/.test(tracking)) throw new Error("O rastreio deve ter 2 letras, 9 números e 2 letras.");
    if (!["preparing", "posted", "delivered"].includes(input.status)) throw new Error("Status inválido.");
    if (input.status !== "preparing" && !tracking) throw new Error("Informe o código de rastreio antes de marcar como postado ou entregue.");
    const shipment: Shipment = { id: existing?.id ?? id, reference: text(input.reference, "Pedido", 60), recipient: text(input.recipient, "Destinatário", 100), destination: text(input.destination, "Destino", 120), service: input.service === "SEDEX" ? "SEDEX" : "PAC", status: input.status, tracking, createdAt: existing?.createdAt ?? now };
    next.shipments = existing ? next.shipments.map((item) => item.id === shipment.id ? shipment : item) : [shipment, ...next.shipments];
  } else throw new Error("Operação inválida.");
  next.movements = next.movements.slice(0, 1000);
  next.revision++;
  return next;
}
