// // src/components/CartSidebar.tsx
// import { useCart } from "../context/CartContext";

// type Props = {
//   show: boolean;
//   onClose: () => void;
//   onCheckout?: () => void;
// };

// export default function CartSidebar({ show, onClose, onCheckout }: Props) {
//   const { items, updateQty, removeItem, clearCart, getTotal, getCount } = useCart();

//   const handleCheckout = () => {
//     if (onCheckout) onCheckout();
//     else {
//       console.log("Checkout clicked", items);
//       alert("Continue to checkout — implement your flow here.");
//     }
//   };

//   if (!show) return null;

//   return (
//     <div
//       className="cart-overlay"
//       style={{
//         position: "fixed",
//         right: 0,
//         top: 0,
//         height: "100%",
//         width: 380,
//         maxWidth: "95vw",
//         background: "#fff",
//         boxShadow: "-12px 0 24px rgba(0,0,0,0.12)",
//         zIndex: 2000,
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
//         <div>
//           <strong>Cart</strong>
//           <div className="small text-muted">{getCount()} items</div>
//         </div>
//         <div className="d-flex gap-2 align-items-center">
//           <button className="btn btn-sm btn-outline-secondary" onClick={clearCart}>
//             Clear
//           </button>
//           <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>

//       <div style={{ overflow: "auto", flex: 1, padding: 12 }}>
//         {items.length === 0 ? (
//           <div className="text-center text-muted py-5">Your cart is empty.</div>
//         ) : (
//           items.map((it) => (
//             <div key={it.id} className="d-flex align-items-center gap-3 mb-3">
//               <div style={{ flex: 1 }}>
//                 <div className="d-flex justify-content-between">
//                   <div>
//                     <div style={{ fontWeight: 600 }}>{it.name}</div>
//                     <div className="small text-muted">{it.restaurantName}</div>
//                     {it.notes && <div className="small text-muted">Note: {it.notes}</div>}
//                   </div>
//                   <div style={{ textAlign: "right" }}>
//                     <div style={{ fontWeight: 600 }}>₹{(it.price ?? 0).toFixed(2)}</div>
//                     <div className="small text-muted">₹{((it.price ?? 0) * it.qty).toFixed(2)}</div>
//                   </div>
//                 </div>

//                 <div className="mt-2 d-flex gap-2 align-items-center">
//                   <div className="input-group input-group-sm" style={{ width: 120 }}>
//                     <button
//                       className="btn btn-outline-secondary btn-sm"
//                       onClick={() => updateQty(it.id, it.qty - 1)}
//                     >
//                       -
//                     </button>
//                     <input
//                       className="form-control form-control-sm text-center"
//                       value={it.qty}
//                       onChange={(e) => {
//                         const v = Number(e.target.value || "0");
//                         if (!Number.isNaN(v)) updateQty(it.id, Math.max(0, Math.floor(v)));
//                       }}
//                       style={{ minWidth: 44 }}
//                     />
//                     <button
//                       className="btn btn-outline-secondary btn-sm"
//                       onClick={() => updateQty(it.id, it.qty + 1)}
//                     >
//                       +
//                     </button>
//                   </div>

//                   <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(it.id)}>
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="p-3 border-top">
//         <div className="d-flex justify-content-between align-items-center mb-2">
//           <div className="small text-muted">Subtotal</div>
//           <div style={{ fontWeight: 700 }}>₹{getTotal().toFixed(2)}</div>
//         </div>

//         <div className="d-grid gap-2">
//           <button className="btn btn-accent" onClick={handleCheckout} disabled={items.length === 0}>
//             Continue
//           </button>
//           <button className="btn btn-outline-secondary" onClick={clearCart}>
//             Clear Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/CartSidebar.tsx
import { useCart } from "../context/CartContext";

type Props = {
  show: boolean;
  onClose: () => void;
  onCheckout?: () => void;
};

export default function CartSidebar({ show, onClose, onCheckout }: Props) {
  const { items, updateQty, removeItem, clearCart, getTotal, getCount } = useCart();

  const handleCheckout = () => {
    if (onCheckout) onCheckout();
    else {
      console.log("Checkout clicked", items);
      alert("Continue to checkout — implement your flow here.");
    }
  };

  if (!show) return null;

  return (
    <div className="cart-overlay">
      <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
        <div>
          <strong>Cart</strong>
          <div className="small text-muted">{getCount()} items</div>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <button className="btn btn-sm btn-outline-secondary" onClick={clearCart}>
            Clear
          </button>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <div className="cart-sidebar-body">
        {items.length === 0 ? (
          <div className="text-center text-muted py-5">Your cart is empty.</div>
        ) : (
          items.map((it) => (
            <div key={it.id} className="d-flex align-items-center gap-3 mb-3">
              <div className="flex-1">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="fw-600">{it.name}</div>
                    <div className="small text-muted">{it.restaurantName}</div>
                    {it.notes && <div className="small text-muted">Note: {it.notes}</div>}
                  </div>
                  <div className="text-end">
                    <div className="fw-700">₹{(it.price ?? 0).toFixed(2)}</div>
                    <div className="small text-muted">₹{((it.price ?? 0) * it.qty).toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-2 d-flex gap-2 align-items-center">
                  <div className="input-group input-group-sm w-120">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQty(it.id, it.qty - 1)}
                    >
                      -
                    </button>
                    <input
                      className="form-control form-control-sm text-center min-w-44"
                      value={it.qty}
                      onChange={(e) => {
                        const v = Number(e.target.value || "0");
                        if (!Number.isNaN(v)) updateQty(it.id, Math.max(0, Math.floor(v)));
                      }}
                    />
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQty(it.id, it.qty + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(it.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-top">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="small text-muted">Subtotal</div>
          <div className="fw-700">₹{getTotal().toFixed(2)}</div>
        </div>

        <div className="d-grid gap-2">
          <button className="btn btn-accent" onClick={handleCheckout} disabled={items.length === 0}>
            Continue
          </button>
          <button className="btn btn-outline-secondary" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
