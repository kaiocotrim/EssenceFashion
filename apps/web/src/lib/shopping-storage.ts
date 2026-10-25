import { products } from "./catalog";
import { normalizeCart, type CartItem } from "./cart";

type ShoppingState = { cart: CartItem[]; favorites: number[]; ready: boolean };
const storageKey = "essence-fashion:shopping:v1";
const serverState: ShoppingState = { cart: [], favorites: [], ready: false };
let snapshot: ShoppingState | undefined;
const listeners = new Set<() => void>();

function load(): ShoppingState {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return {
      cart: normalizeCart(value?.cart, products),
      favorites: Array.isArray(value?.favorites)
        ? [...new Set<number>(value.favorites.filter((id: unknown) => products.some((product) => product.id === id)))]
        : [],
      ready: true,
    };
  } catch {
    return { cart: [], favorites: [], ready: true };
  }
}

export function getShoppingSnapshot() {
  snapshot ??= load();
  return snapshot;
}

export function getServerShoppingSnapshot() { return serverState; }

export function subscribeShopping(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) {
      snapshot = load();
      listeners.forEach((notify) => notify());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}

export function updateShopping(update: (state: ShoppingState) => ShoppingState) {
  snapshot = update(getShoppingSnapshot());
  try {
    localStorage.setItem(storageKey, JSON.stringify({ cart: snapshot.cart, favorites: snapshot.favorites }));
  } catch { /* Navigation still works when browser storage is unavailable. */ }
  listeners.forEach((listener) => listener());
}
