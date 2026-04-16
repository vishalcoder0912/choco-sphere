import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, RefreshCw, ChevronDown, ChevronUp, Truck, CreditCard, Smartphone, Search, Filter,
} from "lucide-react";
import { toast } from "sonner";
import { type Order } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PAID: "#10b981",
  SHIPPED: "#3b82f6",
  DELIVERED: "#8b5cf6",
  CANCELLED: "#ef4444",
};

const OrdersPage = () => {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/orders`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      return data.data || [];
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Order status updated!");
      refetch();
    },
    onError: () => toast.error("Failed to update status"),
  });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !searchTerm ||
        order.id.toString().includes(searchTerm) ||
        ((order as any).user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        ((order as any).user?.email || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const orderStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      paid: orders.filter((o) => o.status === "PAID").length,
      shipped: orders.filter((o) => o.status === "SHIPPED").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted-foreground)" }}>
        <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
        <p>Loading all orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted-foreground)" }}>
        <Package size={48} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Orders</h2>
          <span style={{
            padding: "0.25rem 0.625rem",
            background: "#f59e0b22",
            color: "#f59e0b",
            borderRadius: "99px",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}>
            Demo Data
          </span>
        </div>
        <p style={{ color: "var(--muted-foreground)", margin: 0 }}>Manage and track all customer orders · <strong>Note:</strong> These are fake/demo products for demonstration purposes</p>
      </div>

      {/* Order Statistics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {Object.entries(orderStats).map(([key, value]) => (
          <div key={key} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>{value}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textTransform: "capitalize" }}>{key}</div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
            <input
              type="text"
              placeholder="Search by order ID, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.9rem 0.65rem 2.5rem",
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={16} style={{ color: "var(--muted-foreground)" }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "0.65rem 0.9rem",
              background: "var(--background)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
          {filteredOrders.length} of {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
        {filteredOrders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            expanded={expandedOrder === order.id}
            onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            onStatusChange={(status) => statusMutation.mutate({ orderId: order.id, status })}
            statusPending={statusMutation.isPending}
          />
        ))}
        {filteredOrders.length === 0 && orders.length > 0 && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
            No orders match your search or filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};

const OrderRow = ({
  order,
  expanded,
  onToggle,
  onStatusChange,
  statusPending,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (status: string) => void;
  statusPending: boolean;
}) => {
  const paymentIcon = order.paymentMethod === "UPI" ? <Smartphone size={14} /> : <CreditCard size={14} />;
  const statusColor = STATUS_COLORS[order.status] ?? "#888";

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "0.875rem", overflow: "hidden" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "1rem",
          padding: "1rem 1.25rem", background: "none", border: "none",
          cursor: "pointer", textAlign: "left", color: "var(--foreground)",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>Order #{order.id}</p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
            {(order as any).user?.name} · {(order as any).user?.email}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--muted-foreground)", fontSize: "0.8rem" }}>
          {paymentIcon}
          <span>{order.paymentMethod || "N/A"}</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>₹{(order.totalAmount / 100).toFixed(2)}</span>
        <span style={{
          padding: "0.25rem 0.625rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600,
          background: `${statusColor}22`, color: statusColor,
        }}>
          {order.status}
        </span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ borderTop: "1px solid var(--border)", padding: "1.25rem", display: "grid", gap: "1.25rem" }}>
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Items</h4>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.5rem" }}>
                    <img src={item.product.image} alt={item.product.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "0.375rem" }} />
                    <span style={{ fontSize: "0.9rem" }}>{item.product.name}</span>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", marginLeft: "auto" }}>×{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ background: "var(--background)", padding: "0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginBottom: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.8rem", fontWeight: 600 }}>
                    <Truck size={13} /> SHIPPING ADDRESS
                  </div>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>{order.shippingAddress || "—"}</p>
                </div>

                <div style={{ background: "var(--background)", padding: "0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginBottom: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.8rem", fontWeight: 600 }}>
                    {paymentIcon} PAYMENT
                  </div>
                  {order.paymentMethod === "UPI" ? (
                    <p style={{ margin: 0, fontSize: "0.875rem" }}>
                      UPI: <strong>{(order.paymentDetails as any)?.upiId || "—"}</strong>
                    </p>
                  ) : (
                    <p style={{ margin: 0, fontSize: "0.875rem" }}>
                      {(order.paymentDetails as any)?.cardholderName || "—"} · ****{(order.paymentDetails as any)?.last4 || "—"}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--muted-foreground)" }}>Update Status:</label>
                <select
                  defaultValue={order.status}
                  onChange={(e) => onStatusChange(e.target.value)}
                  disabled={statusPending}
                  style={{
                    padding: "0.5rem 0.75rem", background: "var(--background)", color: "var(--foreground)",
                    border: "1px solid var(--border)", borderRadius: "0.375rem", cursor: "pointer",
                  }}
                >
                  {["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
