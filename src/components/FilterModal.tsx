// src/components/FilterModal.tsx
import { useEffect, useState } from "react";
import type { Filters } from "../types";

type Props = {
  show: boolean;
  onClose: () => void;
  cuisines: string[];
  initial?: Filters;
  onApply: (filters: Filters) => void;
  onClear?: () => void;
};

export default function FilterModal({
  show,
  onClose,
  cuisines,
  initial,
  onApply,
  onClear,
}: Props) {
  const [query, setQuery] = useState(initial?.query ?? "");
  const [cuisine, setCuisine] = useState<string | null>(initial?.cuisine ?? null);
  const [minRating, setMinRating] = useState<number | null>(initial?.minRating ?? null);
  const [sortBy, setSortBy] = useState<Filters["sortBy"]>(initial?.sortBy ?? "relevance");

  useEffect(() => {
    if (show) {
      setQuery(initial?.query ?? "");
      setCuisine(initial?.cuisine ?? null);
      setMinRating(initial?.minRating ?? null);
      setSortBy(initial?.sortBy ?? "relevance");
    }
  }, [show, initial]);

  const apply = () => {
    onApply({
      query,
      cuisine,
      minRating,
      sortBy,
    });
    onClose();
  };

  const clearAll = () => {
    setQuery("");
    setCuisine(null);
    setMinRating(null);
    setSortBy("relevance");
    if (onClear) onClear();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} aria-modal="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header align-items-center">
            <h5 className="modal-title">Filters</h5>

            <div className="d-flex gap-2">
              <button className="btn-close" onClick={onClose} />
            </div>
          </div>

          <div className="modal-body">
            {/* Search */}
            <div className="mb-3">
              <label className="form-label small">Search</label>
              <input
                className="form-control"
                placeholder="Search restaurants, dishes, cuisines"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search restaurants and dishes"
              />
            </div>

            {/* Cuisine chips */}
            <div className="mb-3">
              <label className="form-label small">Cuisine</label>
              <div className="d-flex flex-wrap gap-2">
                {cuisines.map((c) => {
                  const active = cuisine === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      className={`btn btn-sm ${active ? "btn-accent" : "btn-outline-secondary"}`}
                      onClick={() => setCuisine(active ? null : c)}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-3">
              <label className="form-label small">Minimum Rating</label>
              <div className="d-flex gap-2 align-items-center">
                {[4.5, 4.0, 3.5, 3.0].map((r) => {
                  const active = minRating === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      className={`btn btn-sm ${active ? "btn-accent" : "btn-outline-secondary"}`}
                      onClick={() => setMinRating(active ? null : r)}
                    >
                      {r} ★
                    </button>
                  );
                })}
                <div className="ms-auto text-muted small">Selected: {minRating ?? "Any"}</div>
              </div>
            </div>

            {/* Sort */}
            <div className="mb-1">
              <label className="form-label small">Sort by</label>
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as Filters["sortBy"])}
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="deliveryTime">Delivery time</option>
                <option value="minOrder">Min order</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={clearAll}>
              Clear
            </button>
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-accent" onClick={apply}>
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

