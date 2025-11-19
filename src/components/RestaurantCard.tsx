// src/components/RestaurantCard.tsx

// type MenuItem = { id?: string; name?: string; price?: number };

// export type Restaurant = {
//   id?: string | number;
//   name?: string;
//   cuisine?: string;
//   image?: string;
//   rating?: number | string;
//   minOrder?: number | string;
//   deliveryTime?: number | string;
//   description?: string;
//   menu?: MenuItem[];
// };

// type Props = {
//   // supports both shapes to avoid prop mismatch
//   r?: Restaurant;
//   restaurant?: Restaurant;
//   onOpen?: (r: Restaurant) => void;
//   onSelect?: (r: Restaurant | null) => void;
// };

// export default function RestaurantCard(props: Props) {
//   const rest = (props.r ?? props.restaurant) as Restaurant;
//   const onClick = () => {
//     if (props.onOpen) props.onOpen(rest);
//     if (props.onSelect) props.onSelect(rest);
//   };

//   const imgSrc = rest.image ?? "/fallback.png";

//   return (
//     <article className="card-restaurant" style={{ width: "100%" }}>
//       <div style={{ position: "relative" }}>
//         <img
//           className="card-img-top"
//           src={imgSrc}
//           alt={rest.name ?? "Restaurant image"}
//           loading="lazy"
//           onError={(e) => {
//             (e.currentTarget as HTMLImageElement).src = "/fallback.png";
//           }}
//         />
//       </div>

//       <div className="card-body">
//         <h5 className="card-title" style={{ marginBottom: 6 }}>{rest.name}</h5>

//         <div className="card-sub" style={{ marginBottom: 10 }}>
//           {rest.cuisine ?? "Various"} • {rest.description ? "" : ""}
//         </div>

//         <div className="meta-row" style={{ marginBottom: 12 }}>
//           <div style={{ fontWeight: 700 }}>{rest.rating ?? "—"} ★</div>
//           <div style={{ color: "var(--muted)" }}>•</div>
//           <div style={{ color: "var(--muted)" }}>{rest.minOrder ? `₹${rest.minOrder}` : "— for two"}</div>
//           <div style={{ color: "var(--muted)" }}>•</div>
//           <div style={{ color: "var(--muted)" }}>{rest.deliveryTime ?? "30-40 min"}</div>
//         </div>

//         <p style={{ color: "var(--muted)", marginBottom: 12, lineHeight: 1.4 }}>
//           {rest.description ?? ""}
//         </p>

//         <div className="d-flex align-items-center">
//           <button className="btn-view" onClick={onClick} aria-label={`View ${rest.name}`}>
//             View
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }


// src/components/RestaurantCard.tsx
import type { Restaurant } from "../types";

type Props = {
  // supports both shapes to avoid prop mismatch
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
    <article className="card-restaurant" style={{ width: "100%" }}>
      <div style={{ position: "relative" }}>
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
        <h5 className="card-title" style={{ marginBottom: 6 }}>{rest.name}</h5>

        <div className="card-sub" style={{ marginBottom: 10 }}>
          {rest.cuisine ?? "Various"} • {rest.description ? "" : ""}
        </div>

        <div className="meta-row" style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>{rest.rating ?? "—"} ★</div>
          <div style={{ color: "var(--muted)" }}>•</div>
          <div style={{ color: "var(--muted)" }}>{rest.minOrder ? `₹${rest.minOrder}` : "— for two"}</div>
          <div style={{ color: "var(--muted)" }}>•</div>
          <div style={{ color: "var(--muted)" }}>{rest.deliveryTime ?? "30-40 min"}</div>
        </div>

        <p style={{ color: "var(--muted)", marginBottom: 12, lineHeight: 1.4 }}>
          {rest.description ?? ""}
        </p>

        <div className="d-flex align-items-center">
          <button className="btn-view" onClick={onClick} aria-label={`View ${rest.name}`}>
            View
          </button>
        </div>
      </div>
    </article>
  );
}
