// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "../types";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "qty"> & { qty?: number }) => void;
  removeItem: (cartItemId: string) => void;
  updateQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
};

const STORAGE_KEY = "khaanacon_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CartItem[];
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (payload: Omit<CartItem, "id" | "qty"> & { qty?: number }) => {
    setItems((prev) => {
      const id = `${payload.restaurantId}__${payload.itemId}`;
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        return prev.map((p) => (p.id === id ? { ...p, qty: p.qty + (payload.qty ?? 1) } : p));
      }
      const newItem: CartItem = {
        id,
        restaurantId: payload.restaurantId,
        restaurantName: payload.restaurantName,
        itemId: payload.itemId,
        name: payload.name,
        price: payload.price,
        qty: payload.qty ?? 1,
        notes: payload.notes ?? "",
      };
      return [...prev, newItem];
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((p) => p.id !== cartItemId));
  };

  const updateQty = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) => prev.map((p) => (p.id === cartItemId ? { ...p, qty } : p)));
  };

  const clearCart = () => setItems([]);

  const getTotal = () => items.reduce((s, it) => s + (it.price ?? 0) * it.qty, 0);

  const getCount = () => items.reduce((s, it) => s + it.qty, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clearCart, getTotal, getCount }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
