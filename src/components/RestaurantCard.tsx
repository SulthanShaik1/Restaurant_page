import type { Restaurant } from "../types";

type Props = {
  r: Restaurant;
  onOpen: (r: Restaurant) => void;
};

export default function RestaurantCard({ r, onOpen }: Props) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img src={r.image} className="card-img-top" alt={r.name} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{r.name}</h5>
          <p className="card-text mb-1">
            <small>{r.cuisine.join(" • ")}</small>
          </p>
          <p className="card-text mb-2">
            <strong>{r.rating} ★</strong> • ₹{r.costForTwo} for two • {r.deliveryTimeMins} mins
          </p>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <button className="btn btn-accent btn-sm" onClick={() => onOpen(r)}>
              View
            </button>
            <span className="text-muted small">{r.shortDescription}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


