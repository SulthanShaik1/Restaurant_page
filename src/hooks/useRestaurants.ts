// src/hooks/useRestaurants.ts
import { useEffect, useMemo, useState } from "react";
import type { Restaurant } from "../types";

// keep exported signature the same as before
export function useRestaurants() {
  const [all, setAll] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // expose friendly filters object (keeps legacy 'cuisine' string)
  const [filters, setFilters] = useState<any>({
    search: "",
    cuisine: "All",
    cuisines: [] as string[],
    minRating: 0,
    sortBy: "",
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Vite-friendly fetch: respects BASE_URL when app is hosted on a subpath (e.g. /Restaurant_page/)
    fetch(`${import.meta.env.BASE_URL}data/restaurants.json`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load restaurants.json: ${res.status}`);
        const data = (await res.json()) as Restaurant[];
        if (!mounted) return;
        const normalized = data.map((r) => {
          const clone: Restaurant = { ...r } as Restaurant;
          if (Array.isArray((r as any).cuisine)) {
            clone.cuisines = (r as any).cuisine;
          } else if (Array.isArray((r as any).cuisines)) {
            clone.cuisines = (r as any).cuisines;
          } else if (typeof (r as any).cuisine === "string") {
            clone.cuisines = (r as any).cuisine.split(",").map((s: string) => s.trim()).filter(Boolean);
          } else {
            clone.cuisines = [];
          }
          return clone;
        });
        setAll(normalized);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(String(err?.message ?? err));
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const cuisines = useMemo(() => {
    const s = new Set<string>();
    all.forEach((r) => (r.cuisines || []).forEach((c) => c && s.add(c)));
    return ["All", ...Array.from(s).sort()];
  }, [all]);

  const setFilter = (key: string, value: any) => {
    setFilters((prev: any) => {
      const next = { ...prev };
      if (key === "cuisine") {
        if (Array.isArray(value)) {
          next.cuisines = value;
          next.cuisine = value.length === 0 ? "All" : value.join(",");
        } else if (typeof value === "string") {
          next.cuisine = value;
          next.cuisines = value === "All" || !value ? [] : value.split(",").map((s: string) => s.trim()).filter(Boolean);
        } else {
          next.cuisine = "All";
          next.cuisines = [];
        }
      } else if (key === "cuisines") {
        next.cuisines = Array.isArray(value) ? value : [];
        next.cuisine = next.cuisines.length === 0 ? "All" : next.cuisines.join(",");
      } else if (key === "search") {
        next.search = String(value ?? "");
      } else if (key === "minRating") {
        next.minRating = Number(value ?? 0);
      } else if (key === "sortBy") {
        next.sortBy = String(value ?? "");
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const results = useMemo(() => {
    if (!all || all.length === 0) return [];

    const search = (filters.search ?? "").toString().trim().toLowerCase();
    const minRating = Number(filters.minRating ?? 0);
    const sortBy = (filters.sortBy ?? "") as string;

    let filterCuisines: string[] = [];
    if (Array.isArray(filters.cuisines) && filters.cuisines.length > 0) {
      filterCuisines = filters.cuisines;
    } else if (typeof filters.cuisine === "string" && filters.cuisine && filters.cuisine !== "All") {
      filterCuisines = filters.cuisine.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    const filtered = all.filter((r) => {
      if (minRating > 0 && (r.rating ?? 0) < minRating) return false;

      if (filterCuisines.length > 0) {
        const rcuis = Array.isArray(r.cuisines) ? r.cuisines : (typeof r.cuisine === "string" ? r.cuisine.split(",").map(s => s.trim()) : []);
        const intersects = rcuis.some((c) => filterCuisines.includes(c));
        if (!intersects) return false;
      }

      if (search) {
        const inName = (r.name ?? "").toLowerCase().includes(search);
        const inDesc = (r.shortDescription ?? "").toLowerCase().includes(search);
        const inMenu = Array.isArray(r.menu) && r.menu.some((m) => (m.name ?? "").toLowerCase().includes(search));
        const inCuisine = (r.cuisines || []).some((c) => c.toLowerCase().includes(search));
        if (!(inName || inDesc || inMenu || inCuisine)) return false;
      }

      return true;
    });

    const sorted = [...filtered];
    if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === "delivery") {
      sorted.sort((a, b) => (a.deliveryTimeMins ?? 0) - (b.deliveryTimeMins ?? 0));
    } else if (sortBy === "cost") {
      sorted.sort((a, b) => (a.costForTwo ?? 0) - (b.costForTwo ?? 0));
    }
    return sorted;
  }, [all, filters]);

  return {
    results,
    cuisines,
    filters,
    setFilter,
    loading,
    error,
  };
}
