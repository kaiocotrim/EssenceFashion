import test from "node:test";
import assert from "node:assert/strict";
import { addCartItem, cartKey, cartSubtotal, normalizeCart, orderTotal, setCartQuantity } from "../src/lib/cart.ts";
import { addressError, emptyAddress } from "../src/lib/checkout.ts";
import { installmentLabel, products } from "../src/lib/catalog.ts";

const item = { productId: 1, size: "M", quantity: 1 };

test("soma peças da mesma variante e mantém tamanhos diferentes separados", () => {
  const original = [item];
  const merged = addCartItem(original, { ...item, quantity: 2 });
  const result = addCartItem(merged, { ...item, size: "P", quantity: 1 });
  assert.equal(result.length, 2);
  assert.equal(result[0].quantity, 3);
  assert.equal(result[1].size, "P");
  assert.equal(original[0].quantity, 1);
});

test("limita a quantidade e remove somente a variante escolhida", () => {
  const cart = addCartItem([item], { ...item, size: "G", quantity: 20 });
  assert.equal(cart[1].quantity, 10);
  assert.equal(setCartQuantity(cart, cartKey(item), 99)[0].quantity, 10);
  const remaining = setCartQuantity(cart, cartKey(item), 0);
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].size, "G");
  assert.deepEqual(setCartQuantity(cart, cartKey(item), NaN), cart);
});

test("restaura a sacola descartando dados inválidos e unificando duplicatas", () => {
  const result = normalizeCart([
    item, { ...item, quantity: 2 }, null,
    { ...item, productId: 999 }, { ...item, size: "INVALIDO" },
    { ...item, quantity: -1 }, { ...item, quantity: "2" },
    { ...item, quantity: 1.5 },
  ], products);
  assert.deepEqual(result, [{ ...item, quantity: 3 }]);
  assert.deepEqual(normalizeCart({ cart: [] }, products), []);
});

test("calcula subtotal e frete em centavos, sem erro de ponto flutuante", () => {
  const subtotal = cartSubtotal([
    { productId: 1, size: "M", quantity: 3 },
    { productId: 4, size: "Único", quantity: 1 },
  ], products);
  assert.equal(subtotal, 799.6);
  assert.equal(orderTotal(subtotal, 19.9), 819.5);
  assert.equal(orderTotal(0.1, 0.2), 0.3);
});

const validAddress = {
  ...emptyAddress, email: "teste@example.com", name: "Pessoa Teste", phone: "11999999999",
  zip: "01001-000", street: "Rua de Teste", number: "123", district: "Centro", city: "São Paulo", state: "SP",
};

test("aceita endereço completo com complemento opcional", () => {
  assert.equal(addressError(validAddress), "");
});

test("impede pagamento com contato ou endereço incompleto", () => {
  for (const changes of [
    { email: "invalido" }, { name: "Pessoa" }, { phone: "123" }, { zip: "123" },
    { street: " " }, { number: " " }, { district: "" }, { city: "" }, { state: "XX" },
  ]) assert.notEqual(addressError({ ...validAddress, ...changes }), "", JSON.stringify(changes));
});


test("parcelamento distribui centavos sem alterar o total", () => {
  assert.equal(installmentLabel(189.9, 3), "3x de R$ 63,30");
  assert.equal(installmentLabel(209.8, 3), "1x de R$ 69,94 + 2x de R$ 69,93");
  assert.equal(installmentLabel(359.9, 3), "2x de R$ 119,97 + 1x de R$ 119,96");
});
