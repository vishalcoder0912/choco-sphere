import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import styles from "./CartDrawer.module.css";

interface CartDrawerProps {
  open: boolean;
  checkoutPending: boolean;
  isAuthenticated: boolean;
  userName?: string;
  onClose: () => void;
  onCheckout: () => void;
  onOpenAuth: () => void;
}

export const CartDrawer = ({
  open,
  checkoutPending,
  isAuthenticated,
  userName,
  onClose,
  onCheckout,
  onOpenAuth,
}: CartDrawerProps) => {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className={open ? styles.shellOpen : styles.shell} aria-hidden={!open}>
      <div className={styles.backdrop} onClick={onClose} role="presentation" />
      <aside className={styles.drawer}>
        <div className={styles.header}>
          <div>
            <span className={styles.kicker}>Shopping Cart</span>
            <h2 className={styles.title}>Your cocoa picks</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close cart drawer">
            <X size={18} />
          </button>
        </div>

        <div className={styles.accountBanner}>
          {isAuthenticated ? (
            <p>
              Checkout as <strong>{userName}</strong>
            </p>
          ) : (
            <p>Sign in before checkout so your order can be saved.</p>
          )}
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingBag size={28} />
              <h3>Your cart is empty</h3>
              <p>Add artisan collections from the catalog to start your order.</p>
            </div>
          ) : (
            <div className={styles.items}>
              {items.map((item) => (
                <article key={item.id} className={styles.item}>
                  <img className={styles.image} src={item.image} alt={item.name} />
                  <div className={styles.itemBody}>
                    <div className={styles.itemTop}>
                      <div>
                        <h3 className={styles.itemTitle}>{item.name}</h3>
                        {item.description ? <p className={styles.itemDescription}>{item.description}</p> : null}
                      </div>
                      <button
                        className={styles.iconButton}
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className={styles.itemBottom}>
                      <span className={styles.price}>₹{item.price.toLocaleString("en-IN")}</span>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.iconButton}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={styles.iconButton}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>
          <p className={styles.footerNote}>Taxes and shipping are calculated after order confirmation.</p>

          {isAuthenticated ? (
            <button className={styles.checkoutButton} onClick={onCheckout} disabled={items.length === 0 || checkoutPending}>
              {checkoutPending ? "Please wait..." : "Proceed to Checkout"}
            </button>
          ) : (
            <button className={styles.checkoutButton} onClick={onOpenAuth}>
              Sign In To Checkout
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
