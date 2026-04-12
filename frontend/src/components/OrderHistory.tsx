import { PackageCheck, RefreshCw } from "lucide-react";
import type { Order } from "@/lib/api";
import styles from "./OrderHistory.module.css";

interface OrderHistoryProps {
  orders: Order[];
  loading: boolean;
  errorMessage?: string;
  onRefresh: () => void;
}

export const OrderHistory = ({ orders, loading, errorMessage, onRefresh }: OrderHistoryProps) => {
  return (
    <section id="orders" className={styles.section}>
      <div className={styles.header}>
        <div>
          <span className={styles.kicker}>Member Orders</span>
          <h2 className={styles.title}>Order history</h2>
        </div>
        <button className={styles.refreshButton} onClick={onRefresh} type="button">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? <p className={styles.helper}>Loading your latest orders...</p> : null}
      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

      {!loading && !errorMessage && orders.length === 0 ? (
        <div className={styles.emptyState}>
          <PackageCheck size={24} />
          <p>Your completed orders will appear here after checkout.</p>
        </div>
      ) : null}

      <div className={styles.grid}>
        {orders.map((order) => (
          <article key={order.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.orderId}>Order #{order.id}</span>
                <h3 className={styles.orderTitle}>{order.items.length} item(s)</h3>
              </div>
              <span className={styles.status}>{order.status}</span>
            </div>

            <p className={styles.date}>
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recently placed"}
            </p>

            <div className={styles.items}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <strong>${((item.product.price * item.quantity) / 100).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className={styles.totalRow}>
              <span>Total</span>
              <strong>${(order.totalAmount / 100).toFixed(2)}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
