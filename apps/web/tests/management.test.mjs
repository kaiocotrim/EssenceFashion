import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = (await readFile(new URL("../src/lib/management.ts", import.meta.url), "utf8")).replace('from "./catalog"', `from "${new URL("../src/lib/catalog.ts", import.meta.url).href}"`);
const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const { initialManagement, applyManagementAction, managedDeliveryOptions } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);
const mutate = (data, action) => applyManagementAction(data, action, "test-id", "2026-10-26T14:00:00.000Z");

test("começa com estoque zerado sem inventar quantidades", () => {
  const data = initialManagement();
  assert.equal(data.products.reduce((total, product) => total + Object.values(product.stock).reduce((a, b) => a + b, 0), 0), 0);
  assert.equal(data.movements.length, 0);
});
test("ajuste de estoque preserva outros tamanhos e registra antes/depois", () => {
  const data = initialManagement();
  const next = mutate(data, { type: "stock", id: 2, size: "M", quantity: 12, reason: "Reposição" });
  assert.equal(next.products.find((item) => item.id === 2).stock.M, 12);
  assert.equal(next.products.find((item) => item.id === 2).stock.P, 0);
  assert.equal(data.products.find((item) => item.id === 2).stock.M, 0);
  assert.deepEqual([next.movements[0].before, next.movements[0].after], [0, 12]);
  assert.equal(next.revision, 1);
});
test("recusa estoque negativo, fracionado e tamanho inexistente", () => {
  for (const quantity of [-1, 1.5, Infinity]) assert.throws(() => mutate(initialManagement(), { type: "stock", id: 2, size: "M", quantity, reason: "Ajuste" }));
  assert.throws(() => mutate(initialManagement(), { type: "stock", id: 2, size: "XXXL", quantity: 1, reason: "Ajuste" }));
});
test("novo produto recebe identificador e estoque por tamanho", () => {
  const data = initialManagement();
  const next = mutate(data, { type: "product", product: { ...data.products[0], id: 0, sku: "NOVA-001", name: "Nova peça", sizes: ["M"], stock: { M: 8 }, active: false } });
  const product = next.products.at(-1);
  assert.equal(product.id, 12); assert.equal(product.active, false); assert.deepEqual(product.stock, { M: 8 });
  assert.equal(next.movements[0].after, 8);
});
test("recusa SKU duplicado, URL insegura e preço inválido", () => {
  const data = initialManagement(), product = { ...data.products[0], id: 0 };
  assert.throws(() => mutate(data, { type: "product", product }), /SKU/);
  assert.throws(() => mutate(data, { type: "product", product: { ...product, sku: "NEW", image: "javascript:alert(1)" } }), /HTTPS/);
  assert.throws(() => mutate(data, { type: "product", product: { ...product, sku: "NEW", price: -2 } }), /Preço/);
});
test("retira uma peça da vitrine sem apagar o cadastro", () => {
  const data = initialManagement();
  const next = mutate(data, { type: "product", product: { ...data.products[0], active: false } });
  assert.equal(next.products.length, data.products.length);
  assert.equal(next.products[0].active, false);
});
test("envio postado exige rastreio válido e conserva a data ao editar", () => {
  const shipment = { id: "", reference: "EF-10", recipient: "Cliente teste", destination: "São Paulo / SP", service: "PAC", status: "posted", tracking: "" };
  assert.throws(() => mutate(initialManagement(), { type: "shipment", shipment }), /rastreio/);
  const next = mutate(initialManagement(), { type: "shipment", shipment: { ...shipment, tracking: "AA123456789BR" } });
  assert.equal(next.shipments[0].tracking, "AA123456789BR");
  const edited = mutate(next, { type: "shipment", shipment: { ...next.shipments[0], status: "delivered" } });
  assert.equal(edited.shipments.length, 1); assert.equal(edited.shipments[0].createdAt, next.shipments[0].createdAt);
});
test("configuração muda o frete demonstrativo e valida origem e medidas", () => {
  const data = initialManagement(), settings = { ...data.shipping, originZip: "01001000", pacPrice: 15.5 };
  const next = mutate(data, { type: "shipping", settings });
  assert.equal(managedDeliveryOptions(next.shipping)[0].price, 15.5);
  assert.match(managedDeliveryOptions(next.shipping)[0].description, /demonstrativo/);
  assert.throws(() => mutate(data, { type: "shipping", settings: { ...settings, originZip: "123" } }), /CEP/);
  assert.throws(() => mutate(data, { type: "shipping", settings: { ...settings, weight: 0 } }), /maiores/);
});
