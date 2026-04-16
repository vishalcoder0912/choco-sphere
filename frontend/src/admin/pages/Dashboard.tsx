import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Package, IndianRupee, Users, ShoppingCart, TrendingUp, Clock,
  ArrowUpRight, ArrowDownRight, RefreshCw
} from "lucide-react";

const Dashboard = () => {
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
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

  const { data: pendingPayments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["pending-payments"],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/pending-payments`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.data || [];
      } catch {
        return [];
      }
    },
  });

  // Calculate analytics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const completedOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${(totalRevenue / 100).toLocaleString()}`,
      icon: <IndianRupee size={24} />,
      color: "#10b981",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: <ShoppingCart size={24} />,
      color: "#3b82f6",
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      icon: <Clock size={24} />,
      color: "#f59e0b",
      trend: "-3.1%",
      trendUp: false,
    },
    {
      title: "Completed Orders",
      value: completedOrders.toString(),
      icon: <Package size={24} />,
      color: "#8b5cf6",
      trend: "+15.3%",
      trendUp: true,
    },
  ];

  if (ordersLoading || paymentsLoading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted-foreground)" }}>
        <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>Dashboard</h2>
        <p style={{ color: "var(--muted-foreground)", margin: "0.5rem 0 0" }}>
          Overview of your store performance and recent activity
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: `${stat.color}15`,
                color: stat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {stat.icon}
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: stat.trendUp ? "#10b981" : "#ef4444",
              }}>
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.25rem" }}>{stat.value}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{stat.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Additional Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <TrendingUp size={20} style={{ color: "var(--primary)" }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Average Order Value</h3>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            ₹{(avgOrderValue / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            Per order average
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <Users size={20} style={{ color: "var(--primary)" }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Pending Payments</h3>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            {pendingPayments.length}
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            Awaiting verification
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          padding: "1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>Recent Orders</h3>
          <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            Last 5 orders
          </span>
        </div>

        {orders.slice(0, 5).length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
            <Package size={48} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
            <p>No orders yet</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  background: "var(--background)",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "var(--primary)15",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}>
                  #{order.id}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>
                    {(order as any).user?.name || "Unknown"}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                    {(order as any).user?.email || "No email"}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>
                    ₹{(order.totalAmount / 100).toFixed(2)}
                  </p>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.15rem 0.4rem",
                    borderRadius: "99px",
                    background: order.status === "DELIVERED" ? "#10b98122" : order.status === "PENDING" ? "#f59e0b22" : "#3b82f622",
                    color: order.status === "DELIVERED" ? "#10b981" : order.status === "PENDING" ? "#f59e0b" : "#3b82f6",
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
