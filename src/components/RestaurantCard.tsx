// src/components/RestaurantCard.tsx
import type { Restaurant } from "../types";

type Props = {
  r?: Restaurant;
  restaurant?: Restaurant;
  onOpen?: (r: Restaurant) => void;
  onSelect?: (r: Restaurant | null) => void;
};

export default function RestaurantCard(props: Props) {
  const rest = (props.r ?? props.restaurant) as Restaurant;

  const onClick = () => {
    if (props.onOpen) props.onOpen(rest);
    if (props.onSelect) props.onSelect(rest);
  };

  const imgSrc = rest.image ?? "/fallback.png";

  return (
    <article className="card-restaurant">
      <div className="pos-relative">
        <img
          className="card-img-top"
          src={imgSrc}
          alt={rest.name ?? "Restaurant image"}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/fallback.png";
          }}
        />
      </div>

      <div className="card-body">
        <h5 className="card-title mb-6">
          {rest.name}
        </h5>

        <div className="card-sub mb-10">
          {(rest.cuisine ?? "Various")}
        </div>

        <div className="meta-row mb-12">
          <div className="fw-700">
            {rest.rating ?? "—"} ★
          </div>

          <div className="text-muted">•</div>

          <div className="text-muted">
            {rest.costForTwo ? `₹${rest.costForTwo}` : "— for two"}
          </div>

          <div className="text-muted">•</div>

          <div className="text-muted">
            {rest.deliveryTimeMins
              ? `${rest.deliveryTimeMins} min`
              : "30–40 min"}
          </div>
        </div>

        <p className="card-desc mb-12 lh-14">
          {rest.shortDescription ?? ""}
        </p>

        <div className="d-flex align-items-center">
          <button
            className="btn-view"
            onClick={onClick}
            aria-label={`View ${rest.name}`}
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}
