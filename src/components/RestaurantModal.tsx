// import { useEffect, useState } from "react";
// import type { Restaurant, MenuItem } from "../types";

// type Props = {
//   restaurant: Restaurant | null;
//   onClose: () => void;
// };

// export default function RestaurantModal({ restaurant, onClose }: Props) {
//   const [cart, setCart] = useState<MenuItem[]>([]);

//   useEffect(() => {
//     const raw = localStorage.getItem("cart_v1");
//     if (raw) setCart(JSON.parse(raw));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart_v1", JSON.stringify(cart));
//   }, [cart]);

//   if (!restaurant) return null;

//   function addItem(item: MenuItem) {
//     setCart((c) => [...c, item]);
//   }

//   function removeItem(idx: number) {
//     setCart((c) => c.filter((_, i) => i !== idx));
//   }

//   return (
//     <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ background: "rgba(0,0,0,0.3)" }}>
//       <div className="modal-dialog modal-lg" role="document">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">{restaurant.name}</h5>
//             <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
//           </div>
//           <div className="modal-body">
//             <img src={restaurant.image} alt={restaurant.name} className="img-fluid mb-3" />
//             <p>{restaurant.shortDescription}</p>

//             <h6>Menu</h6>
//             <div className="list-group mb-3">
//               {restaurant.menu?.map((m) => (
//                 <div key={m.id} className="list-group-item d-flex justify-content-between align-items-center">
//                   <div>
//                     <div><strong>{m.name}</strong></div>
//                     <small>₹{m.price}</small>
//                   </div>
//                   <button className="btn btn-outline-success btn-sm" onClick={() => addItem(m)}>
//                     Add
//                   </button>
//                 </div>
//               ))}
//             </div>

//             <h6>Cart ({cart.length})</h6>
//             <ul className="list-group mb-2">
//               {cart.map((it, i) => (
//                 <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
//                   <span>{it.name} — ₹{it.price}</span>
//                   <button className="btn btn-sm btn-danger" onClick={() => removeItem(i)}>Remove</button>
//                 </li>
//               ))}
//               {cart.length === 0 && <li className="list-group-item text-muted">Cart is empty</li>}
//             </ul>
//             <div>
//               <strong>Total: ₹{cart.reduce((s, c) => s + c.price, 0)}</strong>
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onClose}>Close</button>
//             <button className="btn btn-accent" disabled={cart.length === 0}>Checkout (mock)</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function RestaurantModal({
  show,
  onHide,
  restaurant,
}: {
  show: boolean;
  onHide: () => void;
  restaurant: any | null;
}) {
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!show) setAddedIds({});
  }, [show]);

  if (!show || !restaurant) return null;

  const fallback =
    "https://source.unsplash.com/1600x900/?restaurant-food&sig=fallback";

  const handleAdd = (menuItem: any) => {
    addToCart({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      menuId: menuItem.id,
      name: menuItem.name,
      price: Number(menuItem.price) || 0,
    });

    const key = `${restaurant.id}-${menuItem.id}`;
    setAddedIds((s) => ({ ...s, [key]: true }));
    setTimeout(() => {
      setAddedIds((s) => {
        const c = { ...s };
        delete c[key];
        return c;
      });
    }, 900);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
      role="dialog"
      aria-modal
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
        }}
      >
        <img
          src={restaurant.image}
          alt={restaurant.name}
          style={{ width: "100%", height: 240, objectFit: "cover" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallback;
          }}
        />

        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h4 style={{ margin: 0 }}>{restaurant.name}</h4>
              <div style={{ color: "#6c757d", marginTop: 6 }}>{restaurant.shortDescription}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ marginBottom: 6 }}>
                <strong>{restaurant.rating}</strong> ★
              </div>
              <div style={{ color: "#6c757d" }}>₹{restaurant.costForTwo} for two</div>
              <div style={{ color: "#6c757d" }}>{restaurant.deliveryTimeMins} mins</div>
            </div>
          </div>

          <h6 style={{ marginTop: 18 }}>Popular dishes</h6>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {Array.isArray(restaurant.menu) && restaurant.menu.length > 0 ? (
              restaurant.menu.map((m: any) => {
                const key = `${restaurant.id}-${m.id}`;
                return (
                  <div key={m.id} style={{ flex: "1 1 45%", minWidth: 220 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        <div style={{ color: "#6c757d" }}>₹{m.price}</div>
                      </div>
                      <div>
                        <button
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "1px solid #0d6efd",
                            background: addedIds[key] ? "#0d6efd" : "#fff",
                            color: addedIds[key] ? "#fff" : "#0d6efd",
                            cursor: "pointer",
                          }}
                          onClick={() => handleAdd(m)}
                          disabled={!!addedIds[key]}
                        >
                          {addedIds[key] ? "Added" : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ color: "#6c757d" }}>Menu not available.</div>
            )}
          </div>

          <div style={{ marginTop: 18, textAlign: "right" }}>
            <button
              onClick={onHide}
              style={{ marginRight: 8, padding: "8px 12px", borderRadius: 8 }}
            >
              Close
            </button>
            <button
              onClick={() => onHide()}
              style={{ padding: "8px 14px", borderRadius: 8, background: "#ff4d4f", color: "#fff", border: "none" }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
