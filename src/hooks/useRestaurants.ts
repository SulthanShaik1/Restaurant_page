// src/hooks/useRestaurants.ts
import { useEffect, useMemo, useState } from "react";
import type { Restaurant } from "../types";

type FiltersLocal = {
  cuisine: string; // "All" or actual cuisine
  minRating: number;
  sortBy: "rating" | "cost" | "delivery" | "";
  search: string;
};

const INITIAL_FILTERS: FiltersLocal = {
  cuisine: "All",
  minRating: 0,
  sortBy: "",
  search: "",
};

export function useRestaurants() {
  const [all, setAll] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersLocal>(INITIAL_FILTERS);

  useEffect(() => {
    setLoading(true);
    const base = import.meta.env.BASE_URL || "/";
    fetch(`${base}data/restaurants.json`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load data");
        return r.json();
      })
      .then((data: Restaurant[]) => {
        setAll(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, []);

  // debounced search value derived from filters.search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(id);
  }, [filters.search]);

  // derive unique cuisines robustly (supports string, array, or comma-separated)
  const cuisines = useMemo(() => {
    const set = new Set<string>();
    all.forEach((r) => {
      const c = (r as any).cuisine;
      if (!c) return;
      if (Array.isArray(c)) {
        c.forEach((ci) => {
          if (ci) set.add(String(ci).trim());
        });
      } else if (typeof c === "string") {
        c.split(",").map((s) => s.trim()).filter(Boolean).forEach((ci) => set.add(ci));
      } else {
        set.add(String(c));
      }
    });
    return ["All", ...Array.from(set)];
  }, [all]);

  // filter + sort logic with safe guards
  const filtered = useMemo(() => {
    let res = all.slice();

    // Cuisine filter
    if (filters.cuisine && filters.cuisine !== "All") {
      res = res.filter((r) => {
        const c = (r as any).cuisine;
        if (!c) return false;
        if (Array.isArray(c)) return c.includes(filters.cuisine);
        if (typeof c === "string") return c.toLowerCase().includes(String(filters.cuisine).toLowerCase());
        return String(c).toLowerCase().includes(String(filters.cuisine).toLowerCase());
      });
    }

    // Min rating
    if (Number(filters.minRating) > 0) {
      res = res.filter((r) => {
        const nr = Number((r as any).rating ?? 0);
        return nr >= filters.minRating;
      });
    }

    // Search (debounced)
    if (debouncedSearch && debouncedSearch.trim()) {
      const s = debouncedSearch.trim().toLowerCase();
      res = res.filter((r) => {
        const name = String(r.name ?? "").toLowerCase();
        const short = String((r as any).shortDescription ?? (r as any).description ?? "").toLowerCase();
        const cuisineJoined =
          Array.isArray((r as any).cuisine) ? (r as any).cuisine.join(" ").toLowerCase()
          : String((r as any).cuisine ?? "").toLowerCase();
        const inMenu =
          Array.isArray((r as any).menu) &&
          (r as any).menu.some((m: any) => String(m.name ?? "").toLowerCase().includes(s));

        return (
          name.includes(s) ||
          short.includes(s) ||
          cuisineJoined.includes(s) ||
          inMenu
        );
      });
    }

    // Sorting
    if (filters.sortBy === "rating") {
      res.sort((a, b) => (Number((b as any).rating) || 0) - (Number((a as any).rating) || 0));
    } else if (filters.sortBy === "cost") {
      res.sort((a, b) => (Number((a as any).costForTwo) || 0) - (Number((b as any).costForTwo) || 0));
    } else if (filters.sortBy === "delivery") {
      res.sort((a, b) => (Number((a as any).deliveryTimeMins) || 999) - (Number((b as any).deliveryTimeMins) || 999));
    }

    return res;
  }, [all, filters.cuisine, filters.minRating, filters.sortBy, debouncedSearch]);

  function setFilter<K extends keyof FiltersLocal>(k: K, value: FiltersLocal[K]) {
    setFilters((s) => ({ ...s, [k]: value }));
  }

  return {
    all,
    loading,
    error,
    results: filtered,
    cuisines,
    filters,
    setFilter,
  };
}
