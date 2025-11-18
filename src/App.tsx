import { useState } from "react";
import { useRestaurants } from "./hooks/useRestaurants";
import FilterPanel from "./components/FilterPanel";
import RestaurantCard from "./components/RestaurantCard";
import RestaurantModal from "./components/RestaurantModal";
import type { Restaurant } from "./types";
import CartSidebar from "./components/CartSidebar";

export default function App() {
  const { results, cuisines, filters, setFilter, loading, error } = useRestaurants();
  const [selected, setSelected] = useState<Restaurant | null>(null);

  return (
    <div className="container py-4">
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="header-accent">HungryNow</h2>
          <small className="text-muted">React + TypeScript • Zomato-style demo</small>
        </div>
        <div>
          <button className="btn btn-outline-secondary me-2">Login</button>
          <button className="btn btn-accent">Get the App</button>
        </div>
      </header>

      <FilterPanel
        cuisines={cuisines}
        filters={filters}
        onChange={(k: any, v: any) => setFilter(k,v)}
      />

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {results.map((r) => (
          <RestaurantCard key={r.id} r={r} onOpen={(x) => setSelected(x)} />
        ))}
      </div>

      {selected && (
        <RestaurantModal restaurant={selected} show={!!selected} onHide={() => setSelected(null)} />
      )}

      <CartSidebar />

      {results.length === 0 && !loading && <div className="mt-4 alert alert-warning">No restaurants found.</div>}
    </div>
  );
}
