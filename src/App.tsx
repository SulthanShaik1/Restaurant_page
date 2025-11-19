// src/App.tsx
import { useState } from "react";
import FilterModal from "./components/FilterModal";
import type { Filters as ModalFilters } from "./types";
import { useRestaurants } from "./hooks/useRestaurants";
import RestaurantCard from "./components/RestaurantCard";
import RestaurantModal from "./components/RestaurantModal";
import type { Restaurant } from "./types";

import { CartProvider, useCart } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";

function AppInner() {
  const { results, cuisines, filters, setFilter, loading, error } = useRestaurants();

  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<Restaurant | null>(null);

  // Cart state
  const [cartOpen, setCartOpen] = useState(false);
  const { getCount } = useCart();

  const modalInitial: ModalFilters = {
    query: filters.search ?? "",
    cuisines: Array.isArray(filters.cuisines)
      ? filters.cuisines
      : typeof filters.cuisine === "string" && filters.cuisine !== "All"
        ? filters.cuisine.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
    minRating: filters.minRating ?? 0,
    sortBy:
      (filters.sortBy === "" ? "relevance" : (filters.sortBy as ModalFilters["sortBy"])) ??
      "relevance",
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

        {/* RIGHT SIDE OF HEADER - Cart button sits before Sign In */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={() => setFilterOpen(true)}
            style={{ gap: 6 }}>
            🎛️ Filters
          </button>


          <button className="btn btn-outline-secondary">Login</button>

          {/* Cart button styled same as other header buttons */}
          <button
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
            title="Cart"
            style={{ gap: 8 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M7 4h-2l-1 2h-1v2h1l2 8h12v-2h-11l-1-4h12v-2h-12l1-4z" />
            </svg>
            <span>Cart</span>
            {/* show badge only when there are items */}
            {getCount() > 0 && <span className="cart-badge" aria-hidden="true">{getCount()}</span>}
          </button>

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
            {(filters.search ||
              (Array.isArray(filters.cuisines) && filters.cuisines.length > 0) ||
              filters.minRating > 0) && (
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

      {selected && (
        <RestaurantModal
          restaurant={selected}
          show={!!selected}
          onHide={() => setSelected(null)}
        />
      )}

      {/*  CART SIDEBAR */}
      <CartSidebar
        show={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => alert("Checkout flow pending")}
      />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}
