// // src/components/FilterModal.tsx
// import { useEffect, useState } from "react";
// import type { Filters } from "../types";

// type Props = {
//   show: boolean;
//   onClose: () => void;
//   cuisines: string[];
//   initial?: Filters;
//   onApply: (filters: Filters) => void;
//   onClear?: () => void;
// };

// export default function FilterModal({
//   show,
//   onClose,
//   cuisines,
//   initial,
//   onApply,
//   onClear,
// }: Props) {
//   const [query, setQuery] = useState<string>(initial?.query ?? "");
//   const [selectedSet, setSelectedSet] = useState<Set<string>>(() => {
//     const s = new Set<string>();
//     if (initial?.cuisines && Array.isArray(initial.cuisines)) {
//       initial.cuisines.forEach((c) => c && s.add(c));
//     } else if (initial?.cuisine) {
//       initial.cuisine
//         .split(",")
//         .map((p) => p.trim())
//         .filter(Boolean)
//         .forEach((c) => s.add(c));
//     }
//     return s;
//   });

//   // modal minRating is nullable while Filters.minRating is a number | undefined.
//   const [minRating, setMinRating] = useState<number | null>(initial?.minRating ?? null);
//   const [sortBy, setSortBy] = useState<Filters["sortBy"]>(initial?.sortBy ?? "relevance");

//   useEffect(() => {
//     if (show) {
//       setQuery(initial?.query ?? "");
//       const s = new Set<string>();
//       if (initial?.cuisines && Array.isArray(initial.cuisines)) {
//         initial.cuisines.forEach((c) => c && s.add(c));
//       } else if (initial?.cuisine) {
//         initial.cuisine
//           .split(",")
//           .map((p) => p.trim())
//           .filter(Boolean)
//           .forEach((c) => s.add(c));
//       }
//       setSelectedSet(s);
//       setMinRating(initial?.minRating ?? null);
//       setSortBy(initial?.sortBy ?? "relevance");
//     }
//     // intentionally only respond to modal open/initial changes
//   }, [show, initial]);

//   const toggleCuisine = (c: string) => {
//     setSelectedSet((prev) => {
//       const next = new Set(prev);
//       if (next.has(c)) next.delete(c);
//       else next.add(c);
//       return next;
//     });
//   };

//   const apply = () => {
//     const cuisinesArray = Array.from(selectedSet);
//     // Ensure we pass types that match Filters: don't pass null for minRating
//     const filtersToSend: Filters = {
//       query,
//       cuisines: cuisinesArray,
//       // convert null -> undefined so it fits optional number type
//       minRating: minRating ?? undefined,
//       sortBy: sortBy as Filters["sortBy"],
//     };
//     onApply(filtersToSend);
//     onClose();
//   };

//   const clearAll = () => {
//     setQuery("");
//     setSelectedSet(new Set());
//     setMinRating(null);
//     setSortBy("relevance");
//     if (onClear) onClear();
//   };

//   if (!show) return null;

//   return (
//     <div className="modal show d-block" tabIndex={-1} aria-modal="true">
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content">
//           <div className="modal-header d-flex justify-content-between align-items-center">
//             <h5 className="modal-title m-0">Filters</h5>

//             <button
//               className="btn-close"
//               onClick={onClose}
//               aria-label="Close"
//             />
//           </div>


//           <div className="modal-body">
//             {/* Search */}
//             <div className="mb-3">
//               <label className="form-label small">Search</label>
//               <input
//                 className="form-control"
//                 placeholder="Search restaurants, dishes, cuisines"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 aria-label="Search restaurants and dishes"
//               />
//             </div>

//             {/* Cuisine multi-select */}
//             <div className="mb-3">
//               <label className="form-label small">Cuisine</label>
//               <div className="d-flex flex-wrap gap-2">
//                 {cuisines.map((c) => {
//                   const active = selectedSet.has(c);
//                   return (
//                     <label
//                       key={c}
//                       style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
//                       className="btn btn-sm btn-outline-secondary"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={active}
//                         onChange={() => toggleCuisine(c)}
//                         style={{ marginRight: 6 }}
//                       />
//                       <span style={{ pointerEvents: "none" }}>{c}</span>
//                     </label>
//                   );
//                 })}
//               </div>
//               <div className="small text-muted mt-1">
//                 Selected: {Array.from(selectedSet).length > 0 ? Array.from(selectedSet).join(", ") : "Any"}
//               </div>
//             </div>

//             {/* Rating */}
//             <div className="mb-3">
//               <label className="form-label small">Minimum Rating</label>
//               <div className="d-flex gap-2 align-items-center">
//                 {[4.5, 4.0, 3.5, 3.0].map((r) => {
//                   const active = minRating === r;
//                   return (
//                     <button
//                       key={r}
//                       type="button"
//                       className={`btn btn-sm ${active ? "btn-accent" : "btn-outline-secondary"}`}
//                       onClick={() => setMinRating(active ? null : r)}
//                     >
//                       {r} ★
//                     </button>
//                   );
//                 })}
//                 <div className="ms-auto text-muted small">Selected: {minRating ?? "Any"}</div>
//               </div>
//             </div>

//             {/* Sort */}
//             <div className="mb-1">
//               <label className="form-label small">Sort by</label>
//               <select
//                 className="form-select form-select-sm"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value as Filters["sortBy"])}
//               >
//                 <option value="relevance">Relevance</option>
//                 <option value="rating">Rating</option>
//                 <option value="deliveryTime">Delivery time</option>
//                 <option value="minOrder">Min order</option>
//               </select>
//             </div>
//           </div>

//           <div className="modal-footer">
//             <button className="btn btn-outline-secondary" onClick={clearAll}>
//               Clear
//             </button>
//             <button className="btn btn-outline-secondary" onClick={onClose}>
//               Cancel
//             </button>
//             <button className="btn btn-accent" onClick={apply}>
//               Apply filters
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


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
  const [query, setQuery] = useState<string>(initial?.query ?? "");
  const [selectedSet, setSelectedSet] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (initial?.cuisines && Array.isArray(initial.cuisines)) {
      initial.cuisines.forEach((c) => c && s.add(c));
    } else if (initial?.cuisine) {
      initial.cuisine
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((c) => s.add(c));
    }
    return s;
  });

  const [minRating, setMinRating] = useState<number | null>(initial?.minRating ?? null);
  const [sortBy, setSortBy] = useState<Filters["sortBy"]>(initial?.sortBy ?? "relevance");

  useEffect(() => {
    if (show) {
      setQuery(initial?.query ?? "");
      const s = new Set<string>();
      if (initial?.cuisines && Array.isArray(initial.cuisines)) {
        initial.cuisines.forEach((c) => c && s.add(c));
      } else if (initial?.cuisine) {
        initial.cuisine
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
          .forEach((c) => s.add(c));
      }
      setSelectedSet(s);
      setMinRating(initial?.minRating ?? null);
      setSortBy(initial?.sortBy ?? "relevance");
    }
  }, [show, initial]);

  const toggleCuisine = (c: string) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const apply = () => {
    const cuisinesArray = Array.from(selectedSet);
    const filtersToSend: Filters = {
      query,
      cuisines: cuisinesArray,
      minRating: minRating ?? undefined,
      sortBy: sortBy as Filters["sortBy"],
    };
    onApply(filtersToSend);
    onClose();
  };

  const clearAll = () => {
    setQuery("");
    setSelectedSet(new Set());
    setMinRating(null);
    setSortBy("relevance");
    if (onClear) onClear();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} aria-modal="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title m-0">Filters</h5>

            <button
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
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

            {/* Cuisine multi-select */}
            <div className="mb-3">
              <label className="form-label small">Cuisine</label>
              <div className="d-flex flex-wrap gap-2">
                {cuisines.map((c) => {
                  const active = selectedSet.has(c);
                  return (
                    <label
                      key={c}
                      className="btn btn-sm btn-outline-secondary inline-flex-center"
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleCuisine(c)}
                        className="me-2"
                      />
                      <span className="no-pointer">{c}</span>
                    </label>
                  );
                })}
              </div>
              <div className="small text-muted mt-1">
                Selected: {Array.from(selectedSet).length > 0 ? Array.from(selectedSet).join(", ") : "Any"}
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
