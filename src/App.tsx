// src/App.tsx
import { useState } from "react";
import FilterModal from "./components/FilterModal";
import type { Filters as ModalFilters } from "./types";
import { useRestaurants } from "./hooks/useRestaurants";
import RestaurantCard from "./components/RestaurantCard";
import RestaurantModal from "./components/RestaurantModal";
import type { Restaurant } from "./types";

export default function App() {
  const { results, cuisines, filters, setFilter, loading, error } = useRestaurants();

  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<Restaurant | null>(null);

  const modalInitial: ModalFilters = {
    query: filters.search ?? "",
    cuisines: Array.isArray(filters.cuisines)
      ? filters.cuisines
      : typeof filters.cuisine === "string" && filters.cuisine !== "All"
      ? filters.cuisine.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [],
    minRating: filters.minRating ?? 0,
    sortBy: (filters.sortBy === "" ? "relevance" : (filters.sortBy as ModalFilters["sortBy"])) ?? "relevance",
  };

  const onApplyModal = (f: ModalFilters) => {
    setFilter("search", f.query ?? "");
    if (Array.isArray(f.cuisines)) setFilter("cuisines", f.cuisines);
    else if ((f as any).cuisine) setFilter("cuisine", (f as any).cuisine);
    setFilter("minRating", f.minRating ?? 0);

    if (f.sortBy === "rating") setFilter("sortBy", "rating");
    else if (f.sortBy === "deliveryTime") setFilter("sortBy", "delivery");
    else if (f.sortBy === "minOrder") setFilter("sortBy", "cost");
    else setFilter("sortBy", "");
    setFilterOpen(false);
  };

  const onClearModal = () => {
    setFilter("search", "");
    setFilter("cuisines", []);
    setFilter("minRating", 0);
    setFilter("sortBy", "");
    setFilterOpen(false);
  };

  return (
    <>
      <header className="header d-flex align-items-center justify-content-between px-3">
        <div>
          <h1 className="header-accent">KhaanaNow24</h1>
          <h5 className="text-muted">Bringing your favourite food even closer to your door.</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button
            className="filters-btn header-only"
            onClick={() => setFilterOpen(true)}
          >
            Filters
          </button>

          <button className="btn btn-outline-secondary">Login</button>

          <button className="btn btn-accent">Sign In</button>
        </div>
      </header>

      <main className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            {Array.isArray(filters.cuisines) && filters.cuisines.length > 0 && (
              <span className="ms-3 text-muted">Cuisine: {filters.cuisines.join(", ")}</span>
            )}
            {filters.minRating > 0 && (
              <span className="ms-3 text-muted">Min rating: {filters.minRating}</span>
            )}
          </div>

          <div>
            {(filters.search || (Array.isArray(filters.cuisines) && filters.cuisines.length > 0) || filters.minRating > 0) && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setFilter("search", "");
                  setFilter("cuisines", []);
                  setFilter("minRating", 0);
                  setFilter("sortBy", "");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="row g-4">
          {loading ? (
            <div className="col-12 text-center">Loading…</div>
          ) : error ? (
            <div className="col-12 alert alert-danger">{error}</div>
          ) : results.length === 0 ? (
            <div className="col-12 alert alert-warning">No restaurants found.</div>
          ) : (
            results.map((r) => (
              <div key={r.id ?? r.name} className="col-12 col-md-6 col-lg-4">
                <RestaurantCard restaurant={r} onSelect={(rest) => setSelected(rest)} />
              </div>
            ))
          )}
        </div>
      </main>

      <FilterModal
        show={filterOpen}
        onClose={() => setFilterOpen(false)}
        cuisines={cuisines.filter((c) => c !== "All")}
        initial={modalInitial}
        onApply={onApplyModal}
        onClear={onClearModal}
      />

      <button className="filters-fab" onClick={() => setFilterOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
          <path d="M10 18h4v-2h-4v2zm-7-9v2h18V9H3zm4-5v2h10V4H7z" fill="currentColor" />
        </svg>
        Filters
      </button>

      {selected && (
        <RestaurantModal restaurant={selected} show={!!selected} onHide={() => setSelected(null)} />
      )}
    </>
  );
}
