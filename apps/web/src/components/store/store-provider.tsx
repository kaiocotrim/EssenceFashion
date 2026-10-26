"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { type Collection } from "@/lib/catalog";
import { initialManagement, defaultShipping } from "@/lib/management";
import { addCartItem, cartKey, cartSubtotal, normalizeCart, setCartQuantity } from "@/lib/cart";
import { getServerShoppingSnapshot, getShoppingSnapshot, subscribeShopping, updateShopping } from "@/lib/shopping-storage";

function useStoreState() {
  const shopping = useSyncExternalStore(subscribeShopping, getShoppingSnapshot, getServerShoppingSnapshot);
  const [catalog, setCatalog] = useState(initialManagement().products);
  const [shipping, setShipping] = useState(defaultShipping);
  const [catalogReady, setCatalogReady] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogVersion, setCatalogVersion] = useState(0);
  useEffect(() => {
    let alive = true;
    let pending = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let failures = 0;
    const controller = new AbortController();
    async function refresh() {
      if (pending || !alive) return;
      pending = true;
      clearTimeout(retryTimer);
      setCatalogLoading(true);
      try {
        const response = await fetch("/api/catalog", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (alive) { setCatalog(data.products); setShipping(data.shipping); setCatalogReady(true); setCatalogError(""); failures = 0; }
      } catch {
        if (alive) {
          setCatalogError("Não foi possível atualizar o catálogo. Tente novamente antes de comprar.");
          if (++failures <= 2) retryTimer = setTimeout(() => { void refresh(); }, failures * 1500);
        }
      } finally {
        pending = false;
        if (alive) setCatalogLoading(false);
      }
    }
    void refresh();
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    window.addEventListener("essen-catalog-update", onFocus);
    window.addEventListener("storage", onFocus);
    return () => { alive = false; controller.abort(); clearTimeout(retryTimer); window.removeEventListener("focus", onFocus); window.removeEventListener("essen-catalog-update", onFocus); window.removeEventListener("storage", onFocus); };
  }, [catalogVersion]);
  const products = catalog.filter((product) => product.active !== false);
  const cart = normalizeCart(shopping.cart, products).map((item) => ({ ...item, quantity: Math.min(item.quantity, products.find((product) => product.id === item.productId)?.stock?.[item.size] ?? 0) })).filter((item) => item.quantity > 0);
  const [collection, setCollection] = useState<Collection>("featured");
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [notice, setNotice] = useState("");

  function selectCategory(value: string) {
    setCategory(value);
    setCollection("all");
    setQuery("");
    setFavoritesOnly(false);
  }
  function selectCollection(value: Collection) {
    selectCategory("Todos");
    setCollection(value);
  }
  function addToBag(productId: number, size: string, quantity = 1) {
    const product = products.find((item) => item.id === productId);
    const inBag = cart.find((item) => item.productId === productId && item.size === size)?.quantity ?? 0;
    if (!catalogReady || catalogError || !product?.sizes.includes(size) || !Number.isSafeInteger(quantity) || quantity <= 0 || inBag + quantity > (product.stock?.[size] ?? 0)) { setNotice("Quantidade indisponível para este tamanho."); return false; }
    updateShopping((state) => ({ ...state, cart: addCartItem(state.cart, { productId, size, quantity }) }));
    setNotice(`${product.name}, tamanho ${size}, na sua sacola.`);
    return true;
  }
  function toggleFavorite(id: number) {
    updateShopping((state) => ({ ...state, favorites: state.favorites.includes(id)
      ? state.favorites.filter((value) => value !== id) : [...state.favorites, id] }));
  }
  function updateQuantity(key: string, quantity: number) {
    const item = cart.find((entry) => cartKey(entry) === key);
    const limit = products.find((product) => product.id === item?.productId)?.stock?.[item?.size ?? ""] ?? 0;
    updateShopping((state) => ({ ...state, cart: setCartQuantity(state.cart, key, Math.min(quantity, limit)) }));
  }
  function clearBag() {
    updateShopping((state) => ({ ...state, cart: [] }));
  }

  return {
    ...shopping, cart, ready: shopping.ready && catalogReady, products, shipping, catalogError, catalogLoading, refreshCatalog: () => setCatalogVersion((version) => version + 1), category, query, favoritesOnly, notice, collection,
    setQuery, setFavoritesOnly, selectCategory, selectCollection, addToBag, toggleFavorite, updateQuantity, clearBag,
    count: cart.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cartSubtotal(cart, products),
  };
}

type StoreState = ReturnType<typeof useStoreState>;
const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStoreState();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used within StoreProvider");
  return store;
}
