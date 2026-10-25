import type { Product } from "./catalog";

export type CartItem = { productId: number; size: string; quantity: number };
export const MAX_QUANTITY = 10;
export const cartKey = (item: Pick<CartItem, "productId" | "size">) => `${item.productId}:${item.size}`;

export function normalizeCart(value: unknown, catalog: Product[]): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<CartItem[]>((cart, entry) => {
    if (!entry || typeof entry !== "object") return cart;
    const product = catalog.find((item) => item.id === entry.productId);
    if (!product || !product.sizes.includes(entry.size) || !Number.isSafeInteger(entry.quantity) || entry.quantity < 1) return cart;
    return addCartItem(cart, { productId: product.id, size: entry.size, quantity: entry.quantity });
  }, []);
}

export function addCartItem(cart: CartItem[], item: CartItem): CartItem[] {
  if (!Number.isSafeInteger(item.quantity) || item.quantity < 1) return cart;
  const existing = cart.find((entry) => cartKey(entry) === cartKey(item));
  if (!existing) return [...cart, { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity) }];
  return cart.map((entry) => cartKey(entry) === cartKey(item)
    ? { ...entry, quantity: Math.min(MAX_QUANTITY, entry.quantity + item.quantity) }
    : entry);
}

export function setCartQuantity(cart: CartItem[], key: string, quantity: number): CartItem[] {
  if (!Number.isSafeInteger(quantity)) return cart;
  if (quantity <= 0) return cart.filter((item) => cartKey(item) !== key);
  return cart.map((item) => cartKey(item) === key ? { ...item, quantity: Math.min(MAX_QUANTITY, quantity) } : item);
}

export function cartSubtotal(cart: CartItem[], catalog: Product[]): number {
  const cents = cart.reduce((sum, item) => {
    const product = catalog.find((entry) => entry.id === item.productId);
    return sum + (product ? Math.round(product.price * 100) * item.quantity : 0);
  }, 0);
  return cents / 100;
}

export function orderTotal(subtotal: number, shipping: number): number {
  return (Math.round(subtotal * 100) + Math.round(shipping * 100)) / 100;
}
