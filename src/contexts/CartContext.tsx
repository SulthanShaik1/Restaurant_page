import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;           // unique id for the menu item (e.g. restaurantId + '-' + menuId)
  restaurantId: string; // which restaurant this belongs to
  restaurantName?: string;
  menuId: string;       // original menu id
  name: string;
  price: number;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "qty" | "id">, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "hungrynow_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = (incoming: Omit<CartItem, "qty" | "id">, qty = 1) => {
    setItems((prev) => {
      // id uniquely identifies menu entry per restaurant
      const id = `${incoming.restaurantId}-${incoming.menuId}`;
      const found = prev.find((p) => p.id === id);
      if (found) {
        return prev.map((p) =>
          p.id === id ? { ...p, qty: p.qty + qty } : p
        );
      } else {
        const next: CartItem = {
          id,
          restaurantId: incoming.restaurantId,
          restaurantName: incoming.restaurantName,
          menuId: incoming.menuId,
          name: incoming.name,
          price: incoming.price,
          qty,
        };
        return [...prev, next];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  };

  const clearCart = () => setItems([]);

  const getTotal = () =>
    items.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0);

  const getTotalItems = () => items.reduce((s, it) => s + it.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, getTotal, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
