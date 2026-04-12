import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Package, Plus, RefreshCw, X, ChevronDown,
  ChevronUp, LayoutDashboard, Tag, Truck, CreditCard, Smartphone,
  AlertCircle, CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient, Order, Category } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type Tab = "orders" | "products";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PAID: "#10b981",
  SHIPPED: "#3b82f6",
  DELIVERED: "#8b5cf6",
  CANCELLED: "#ef4444",
};

const inputStyle: React.CSSProperties = {
  background: "var(--background)",
  color: "var(--foreground)",
  border: "1px solid var(--border)",
  padding: "0.65rem 0.9rem",
  borderRadius: "0.5rem",
  fontSize: "0.9rem",
  width: "100%",
  boxSizing: "border-box" as any,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  // Redirect non-admins
  if (!user || user.role !== "ADMIN") {
    return (
      <div style={{ padding: "8rem 2rem", textAlign: "center" }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: "0 auto 1rem" }} />
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Access Denied</h1>
        <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>You need ADMIN privileges to access this page.</p>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: 600 }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "6rem 1.5rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <LayoutDashboard size={28} color="var(--primary)" />
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>Admin Dashboard</h1>
        </div>
        <p style={{ color: "var(--muted-foreground)", margin: 0 }}>Manage orders, update statuses, and add products to the store.</p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "2px solid var(--border)", paddingBottom: "0" }}>
        {([["orders", "All Orders", ShoppingBag], ["products", "Add Product", Plus]] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as Tab)}
            style={{
              padding: "0.75rem 1.25rem", background: "none", border: "none",
              borderBottom: activeTab === key ? "2px solid var(--primary)" : "2px solid transparent",
              marginBottom: "-2px",
              color: activeTab === key ? "var(--primary)" : "var(--muted-foreground)",
              fontWeight: activeTab === key ? 700 : 500,
              cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.95rem",
              transition: "color 0.2s",
            }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "orders" ? (
          <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OrdersTab token={token!} expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder} />
          </motion.div>
        ) : (
          <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AddProductTab token={token!} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ────────────────────────────────────────────── */
/*  ORDERS TAB                                    */
/* ────────────────────────────────────────────── */

const OrdersTab = ({
  token,
  expandedOrder,
  setExpandedOrder,
}: {
  token: string;
  expandedOrder: number | null;
  setExpandedOrder: (id: number | null) => void;
}) => {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => apiClient.getAllOrdersAsAdmin(token),
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      apiClient.updateOrderStatus(token, orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated!");
    },
    onError: () => toast.error("Failed to update status"),
  });

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
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
        {orders.length} total order{orders.length !== 1 ? "s" : ""}
      </p>
      {orders.map((order) => (
        <OrderRow
          key={order.id}
          order={order}
          expanded={expandedOrder === order.id}
          onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
          onStatusChange={(status) => statusMutation.mutate({ orderId: order.id, status })}
          statusPending={statusMutation.isPending}
        />
      ))}
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
      {/* Row summary */}
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
        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>${(order.totalAmount / 100).toFixed(2)}</span>
        <span style={{
          padding: "0.25rem 0.625rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600,
          background: `${statusColor}22`, color: statusColor,
        }}>
          {order.status}
        </span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Expanded details */}
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

              {/* Order Items */}
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
                {/* Shipping */}
                <div style={{ background: "var(--background)", padding: "0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginBottom: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.8rem", fontWeight: 600 }}>
                    <Truck size={13} /> SHIPPING ADDRESS
                  </div>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>{order.shippingAddress || "—"}</p>
                </div>

                {/* Payment details */}
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

              {/* Update Status */}
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

/* ────────────────────────────────────────────── */
/*  ADD PRODUCT TAB                               */
/* ────────────────────────────────────────────── */

const AddProductTab = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", description: "", price: "", image: "", categoryId: "" });
  const [success, setSuccess] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: apiClient.getCategories,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const createMutation = useMutation({
    mutationFn: () =>
      apiClient.createProductAsAdmin(token, {
        name: form.name,
        description: form.description,
        price: parseInt(form.price) * 100, // convert dollars to cents
        image: form.image,
        categoryId: parseInt(form.categoryId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added to the store! 🍫");
      setSuccess(true);
      setForm({ name: "", description: "", price: "", image: "", categoryId: "" });
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create product"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: "560px" }}
    >
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <Tag size={20} color="var(--primary)" />
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Add New Product</h2>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: "#10b98122", borderRadius: "0.5rem", marginBottom: "1rem", color: "#10b981" }}
          >
            <CheckCircle size={16} /> Product added successfully!
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Product Name *</label>
            <input required name="name" value={form.name} onChange={handleChange} placeholder="e.g. Belgian Dark Box" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Description *</label>
            <textarea
              required name="description" value={form.description}
              onChange={handleChange as any}
              placeholder="A short product description..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Price (USD) *</label>
              <input required type="number" min="0.01" step="0.01" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 29.99" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Category *</label>
              <select required name="categoryId" value={form.categoryId} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select category</option>
                {categories.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Image URL *</label>
            <input required name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg" style={inputStyle} />
          </div>

          {form.image && (
            <img src={form.image} alt="Preview" onError={(e) => (e.currentTarget.style.display = "none")} style={{ height: "120px", objectFit: "cover", borderRadius: "0.5rem", border: "1px solid var(--border)" }} />
          )}

          <button
            type="submit"
            disabled={createMutation.isPending}
            style={{
              padding: "0.875rem", background: createMutation.isPending ? "var(--muted)" : "var(--primary)",
              color: createMutation.isPending ? "var(--muted-foreground)" : "var(--primary-foreground)",
              border: "none", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.95rem",
              cursor: createMutation.isPending ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              marginTop: "0.25rem",
            }}
          >
            <Plus size={16} />
            {createMutation.isPending ? "Adding..." : "Add Product to Store"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
