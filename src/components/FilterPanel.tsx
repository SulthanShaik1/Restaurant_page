export default function FilterPanel({ cuisines, filters, onChange }: any) {
  return (
    <div className="card p-3 mb-3">
      <div className="row g-2 align-items-center">

        <div className="col-md-5">
          <input
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            className="form-control"
            placeholder="Search restaurants..."
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.cuisine}
            onChange={(e) => onChange("cuisine", e.target.value)}
          >
            {cuisines.map((c: string) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.minRating}
            onChange={(e) => onChange("minRating", Number(e.target.value))}
          >
            <option value={0}>All ratings</option>
            <option value={3}>3 & above</option>
            <option value={4}>4 & above</option>
            <option value={4.5}>4.5 & above</option>
          </select>
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.sortBy}
            onChange={(e) => onChange("sortBy", e.target.value)}
          >
            <option value="">Sort</option>
            <option value="rating">Top rated</option>
            <option value="cost">Cost low-high</option>
            <option value="delivery">Fastest</option>
          </select>
        </div>

        <div className="col-md-1">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              onChange("search", "");
              onChange("cuisine", "All");
              onChange("minRating", 0);
              onChange("sortBy", "");
            }}
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}
