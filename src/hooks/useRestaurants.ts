import { useEffect, useMemo, useState } from "react";
import type { Restaurant } from "../types";

type Filters = {
  cuisine: string | "All";
  minRating: number;
  sortBy: "rating" | "cost" | "delivery" | "";
  search: string;
};

export function useRestaurants() {
  const [all, setAll] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    cuisine: "All",
    minRating: 0,
    sortBy: "",
    search: ""
  });

  useEffect(() => {
    setLoading(true);
    fetch("/data/restaurants.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load data");
        return r.json();
      })
      .then((data: Restaurant[]) => {
        setAll(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, []);

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(id);
  }, [filters.search]);

  const cuisines = useMemo(() => {
    const set = new Set<string>();
    all.forEach((r) => r.cuisine.forEach((c) => set.add(c)));
    return ["All", ...Array.from(set)];
  }, [all]);

  const filtered = useMemo(() => {
    let res = all.slice();

    if (filters.cuisine !== "All") {
      res = res.filter((r) => r.cuisine.includes(filters.cuisine));
    }

    if (filters.minRating > 0) {
      res = res.filter((r) => r.rating >= filters.minRating);
    }

    if (debouncedSearch.trim()) {
      const s = debouncedSearch.toLowerCase();
      res = res.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          (r.shortDescription && r.shortDescription.toLowerCase().includes(s)) ||
          r.cuisine.join(" ").toLowerCase().includes(s)
      );
    }

    if (filters.sortBy === "rating") {
      res.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === "cost") {
      res.sort((a, b) => a.costForTwo - b.costForTwo);
    } else if (filters.sortBy === "delivery") {
      res.sort((a, b) => a.deliveryTimeMins - b.deliveryTimeMins);
    }

    return res;
  }, [all, filters.cuisine, filters.minRating, filters.sortBy, debouncedSearch]);

  function setFilter<K extends keyof Filters>(k: K, value: Filters[K]) {
    setFilters((s) => ({ ...s, [k]: value }));
  }

  return {
    all,
    loading,
    error,
    results: filtered,
    cuisines,
    filters,
    setFilter
  };
}
