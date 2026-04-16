import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { History, RefreshCw, CreditCard, Smartphone, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

const STATUS_COLORS: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  PENDING: { color: "#f59e0b", bg: "#f59e0b22", icon: <Clock size={14} /> },
  PAYMENT_PENDING: { color: "#f59e0b", bg: "#f59e0b22", icon: <Clock size={14} /> },
  PAID: { color: "#10b981", bg: "#10b98122", icon: <CheckCircle size={14} /> },
  SHIPPED: { color: "#3b82f6", bg: "#3b82f622", icon: <CheckCircle size={14} /> },
  DELIVERED: { color: "#8b5cf6", bg: "#8b5cf622", icon: <CheckCircle size={14} /> },
  CANCELLED: { color: "#ef4444", bg: "#ef444422", icon: <XCircle size={14} /> },
  FAILED: { color: "#ef4444", bg: "#ef444422", icon: <XCircle size={14} /> },
  REFUNDED: { color: "#8b5cf6", bg: "#8b5cf622", icon: <History size={14} /> },
};

const HistoryPage = () => {
  const [filter, setFilter] = useState<"ALL" | "PAID" | "PENDING" | "FAILED">("ALL");

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-orders-history"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/orders`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      return data.data || [];
    },
  });

  const filteredOrders = orders.filter((order: any) => 
    filter === "ALL" || order.status === filter
  );

  // Calculate statistics
  const stats = {
    total: orders.length,
    paid: orders.filter((o: any) => o.status === "PAID").length,
    pending: orders.filter((o: any) => o.status === "PENDING").length,
    failed: orders.filter((o: any) => o.status === "FAILED" || o.status === "CANCELLED").length,
    totalRevenue: orders
      .filter((o: any) => o.status === "PAID")
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0),
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted-foreground)" }}>
        <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
        <p>Loading transaction history...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <History size={28} color="var(--primary)" />
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>Transaction History</h2>
        </div>
        <p style={{ color: "var(--muted-foreground)", margin: 0 }}>
          View all payment transactions and order history
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard title="Total Orders" value={stats.total} color="#3b82f6" />
        <StatCard title="Paid Orders" value={stats.paid} color="#10b981" />
        <StatCard title="Pending" value={stats.pending} color="#f59e0b" />
        <StatCard title="Revenue" value={`₹${(stats.totalRevenue / 100).toFixed(2)}`} color="#8b5cf6" />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {(["ALL", "PAID", "PENDING", "FAILED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              background: filter === f ? "var(--primary)" : "var(--muted)",
              color: filter === f ? "var(--primary-foreground)" : "var(--foreground)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            {f === "ALL" ? "All Transactions" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
        <button
          onClick={() => { refetch(); toast.success("History refreshed"); }}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
            background: "var(--background)",
            color: "var(--foreground)",
            cursor: "pointer",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginLeft: "auto",
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Transactions List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
          Showing {filteredOrders.length} transaction{filteredOrders.length !== 1 ? "s" : ""}
        </p>
        
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)", background: "var(--card)", borderRadius: "1rem", border: "1px solid var(--border)" }}>
            <History size={48} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
            <p>No transactions found.</p>
          </div>
        ) : (
          filteredOrders.map((order: any, index: number) => (
            <TransactionCard key={order.id} order={order} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      background: "var(--card)",
      borderRadius: "1rem",
      padding: "1.25rem",
      border: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    }}
  >
    <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", fontWeight: 500 }}>{title}</span>
    <span style={{ fontSize: "1.5rem", fontWeight: 700, color }}>{value}</span>
  </motion.div>
);

const TransactionCard = ({ order, index }: { order: any; index: number }) => {
  const status = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING;
  const paymentIcon = order.paymentMethod === "UPI" ? <Smartphone size={16} /> : <CreditCard size={16} />;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        background: "var(--card)",
        borderRadius: "0.875rem",
        border: "1px solid var(--border)",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      {/* Order ID */}
      <div style={{ minWidth: "100px" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>#{order.id}</p>
        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <Calendar size={12} />
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Customer Info */}
      <div style={{ flex: 1, minWidth: "150px" }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>{order.user?.name || "Unknown"}</p>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{order.user?.email || "No email"}</p>
      </div>

      {/* Payment Method */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "100px" }}>
        <span style={{ color: "var(--muted-foreground)" }}>{paymentIcon}</span>
        <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>{order.paymentMethod || "N/A"}</span>
      </div>

      {/* Amount */}
      <div style={{ minWidth: "100px", textAlign: "right" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem" }}>₹{(order.totalAmount / 100).toFixed(2)}</p>
        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
          {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Status Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.35rem 0.75rem",
          borderRadius: "99px",
          fontSize: "0.8rem",
          fontWeight: 600,
          background: status.bg,
          color: status.color,
          minWidth: "100px",
          justifyContent: "center",
        }}
      >
        {status.icon}
        {order.status}
      </div>
    </motion.div>
  );
};

export default HistoryPage;
