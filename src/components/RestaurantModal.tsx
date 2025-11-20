// src/components/RestaurantModal.tsx
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function RestaurantModal({
  show,
  onHide,
  restaurant,
}: {
  show: boolean;
  onHide: () => void;
  restaurant: any | null;
}) {
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!show) setAddedIds({});
  }, [show]);

  if (!show || !restaurant) return null;

  const fallback =
    "https://source.unsplash.com/1600x900/?restaurant-food&sig=fallback";

  const handleAdd = (menuItem: any) => {
    addItem({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      itemId: menuItem.id,
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
    <div className="modal-overlay" role="dialog" aria-modal>
      <div className="modal-card">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="modal-image"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallback;
          }}
        />

        <div className="p-20">
          <div className="d-flex justify-content-between gap-12 align-items-center">
            <div>
              <h4 className="m-0">{restaurant.name}</h4>
              <div className="text-muted mt-6">{restaurant.shortDescription}</div>
            </div>

            <div className="text-end">
              <div className="mb-6">
                <strong>{restaurant.rating}</strong> ★
              </div>
              <div className="text-muted">₹{restaurant.costForTwo} for two</div>
              <div className="text-muted">{restaurant.deliveryTimeMins} mins</div>
            </div>
          </div>

          <h6 className="mt-18">Popular dishes</h6>

          <div className="d-flex flex-wrap gap-12">
            {Array.isArray(restaurant.menu) && restaurant.menu.length > 0 ? (
              restaurant.menu.map((m: any) => {
                const key = `${restaurant.id}-${m.id}`;
                return (
                  <div key={m.id} className="menu-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-600">{m.name}</div>
                        <div className="text-muted">₹{m.price}</div>
                      </div>
                      <div>
                        <button
                          className={`btn-add ${addedIds[key] ? "active" : ""}`}
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
              <div className="text-muted">Menu not available.</div>
            )}
          </div>

          <div className="mt-18 text-end">
            <button onClick={onHide} className="inline-btn-small me-2">
              Close
            </button>
            <button onClick={() => onHide()} className="btn btn-accent">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
