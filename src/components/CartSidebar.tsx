import { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function CartSidebar() {
  const { items, getTotal, updateQty, removeFromCart, clearCart, getTotalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        aria-label="Open cart"
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 2000,
          background: "#ff4d4f",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          padding: "12px 16px",
          boxShadow: "0 8px 22px rgba(0,0,0,0.18)",
          cursor: "pointer",
        }}
      >
        🛒 Cart ({getTotalItems()})
      </button>

      {/* Overlay + sidebar */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1999,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 350,
              maxWidth: "100%",
              height: "100%",
              background: "#fff",
              padding: 16,
              overflowY: "auto",
              boxShadow: "0 0 40px rgba(0,0,0,0.25)",
            }}
          >
            <h5>Your Cart</h5>

            {items.length === 0 && (
              <div className="text-muted">Cart is empty.</div>
            )}

            {items.map((it) => (
              <div key={it.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <strong>{it.name}</strong>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {it.restaurantName}
                  </div>
                  <div style={{ fontSize: 13 }}>
                    ₹{it.price} × {it.qty} = <strong>₹{it.price * it.qty}</strong>
                  </div>
                </div>

                <div>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => updateQty(it.id, it.qty - 1)}
                  >
                    −
                  </button>
                  <span style={{ margin: "0 8px" }}>{it.qty}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => updateQty(it.id, it.qty + 1)}
                  >
                    +
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={() => removeFromCart(it.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {items.length > 0 && (
              <>
                <hr />
                <div style={{ fontSize: 18, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                  <span>Total</span>
                  <span>₹{getTotal()}</span>
                </div>

                <button className="btn btn-view w-100 mt-3">
                  Checkout
                </button>

                <button
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => clearCart()}
                >
                  Clear Cart
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
