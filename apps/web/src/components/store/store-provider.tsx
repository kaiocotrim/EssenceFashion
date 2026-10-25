"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { products } from "@/lib/catalog";
import { addCartItem, cartSubtotal, setCartQuantity } from "@/lib/cart";
import { getServerShoppingSnapshot, getShoppingSnapshot, subscribeShopping, updateShopping } from "@/lib/shopping-storage";

function useStoreState() {
  const shopping = useSyncExternalStore(subscribeShopping, getShoppingSnapshot, getServerShoppingSnapshot);
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [notice, setNotice] = useState("");

  function selectCategory(value: string) {
    setCategory(value);
    setQuery("");
    setFavoritesOnly(false);
  }
  function addToBag(productId: number, size: string, quantity = 1) {
    const product = products.find((item) => item.id === productId);
    if (!product?.sizes.includes(size)) return;
    updateShopping((state) => ({ ...state, cart: addCartItem(state.cart, { productId, size, quantity }) }));
    setNotice(`${product.name}, tamanho ${size}, na sua sacola.`);
  }
  function toggleFavorite(id: number) {
    updateShopping((state) => ({ ...state, favorites: state.favorites.includes(id)
      ? state.favorites.filter((value) => value !== id) : [...state.favorites, id] }));
  }
  function updateQuantity(key: string, quantity: number) {
    updateShopping((state) => ({ ...state, cart: setCartQuantity(state.cart, key, quantity) }));
  }
  function clearBag() {
    updateShopping((state) => ({ ...state, cart: [] }));
  }

  return {
    ...shopping, category, query, favoritesOnly, notice,
    setQuery, setFavoritesOnly, selectCategory, addToBag, toggleFavorite, updateQuantity, clearBag,
    count: shopping.cart.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cartSubtotal(shopping.cart, products),
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
