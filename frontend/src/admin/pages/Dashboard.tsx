import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, ShoppingBag, Package, FolderTree } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { apiClient, type Order } from "@/lib/api";
import { formatINR } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#C9A84C", "#2563EB", "#1A8A5A", "#C0392B"];

const formatINRCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value / 100);
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
};

const Dashboard = () => {
  const { token } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => apiClient.adminGetStats(token as string),
    enabled: Boolean(token),
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => apiClient.adminGetOrders(token as string),
    enabled: Boolean(token),
  });

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  const last7DaysData = useMemo(() => {
    if (!stats?.trend || stats.trend.length === 0) {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({
          day: d.toLocaleDateString("en-IN", { weekday: "short" }),
          revenue: Math.floor(Math.random() * 50000) + 10000,
        });
      }
      return days;
    }
    return stats.trend.slice(-7).map((t) => ({
      day: formatDate(t.date),
      revenue: t.revenue,
    }));
  }, [stats?.trend]);

  const orderStatusData = useMemo(() => {
    if (!stats) {
      return [
        { name: "Pending", value: 12, color: "#C9A84C" },
        { name: "Paid", value: 28, color: "#2563EB" },
        { name: "Delivered", value: 45, color: "#1A8A5A" },
        { name: "Cancelled", value: 5, color: "#C0392B" },
      ];
    }
    return [
      { name: "Pending", value: stats.pendingOrders || 0, color: "#C9A84C" },
      { name: "Paid", value: stats.paidOrders || 0, color: "#2563EB" },
      { name: "Delivered", value: stats.deliveredOrders || 0, color: "#1A8A5A" },
      { name: "Cancelled", value: stats.cancelledOrders || 0, color: "#C0392B" },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const totalOrdersCount = orderStatusData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="py-6">
        <h1 className="text-3xl font-semibold" style={{ color: "#C9A84C", marginBottom: "0.5rem" }}>Dashboard</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Live overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div 
          style={{
            background: "linear-gradient(to bottom, #161616, #111111)",
            border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: "14px",
            padding: "1.5rem",
            minHeight: "120px",
            transition: "all 0.2s ease",
            transform: "scale(1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 0 25px rgba(201,168,76,0.08)";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(201,168,76,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <IndianRupee style={{ width: "18px", height: "18px", color: "#C9A84C" }} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "600", color: "#C9A84C", fontFamily: "'DM Mono', monospace", marginBottom: "0.5rem" }}>
            {statsLoading ? "—" : formatINRCurrency(stats?.totalRevenue || 0)}
          </div>
          <div style={{ 
            fontSize: "0.75rem", 
            textTransform: "uppercase", 
            letterSpacing: "0.05em",
            color: "var(--text-muted)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "0.5rem",
            marginTop: "0.5rem"
          }}>
            Total Revenue
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Excludes cancelled orders
          </div>
        </div>

        {/* Orders Card */}
        <div 
          style={{
            background: "linear-gradient(to bottom, #161616, #111111)",
            border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: "14px",
            padding: "1.5rem",
            minHeight: "120px",
            transition: "all 0.2s ease",
            transform: "scale(1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 0 25px rgba(201,168,76,0.08)";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(245,158,11,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ShoppingBag style={{ width: "18px", height: "18px", color: "#f59e0b" }} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "600", color: "var(--text-primary)", fontFamily: "'DM Mono', monospace", marginBottom: "0.5rem" }}>
            {statsLoading ? "—" : stats?.totalOrders ?? 0}
          </div>
          <div style={{ 
            fontSize: "0.75rem", 
            textTransform: "uppercase", 
            letterSpacing: "0.05em",
            color: "var(--text-muted)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "0.5rem",
            marginTop: "0.5rem"
          }}>
            Orders
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {stats?.pendingOrders ?? 0} pending
          </div>
        </div>

        {/* Products Card */}
        <div 
          style={{
            background: "linear-gradient(to bottom, #161616, #111111)",
            border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: "14px",
            padding: "1.5rem",
            minHeight: "120px",
            transition: "all 0.2s ease",
            transform: "scale(1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 0 25px rgba(201,168,76,0.08)";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(139,92,246,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Package style={{ width: "18px", height: "18px", color: "#8b5cf6" }} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "600", color: "var(--text-primary)", fontFamily: "'DM Mono', monospace", marginBottom: "0.5rem" }}>
            {statsLoading ? "—" : stats?.totalProducts ?? 0}
          </div>
          <div style={{ 
            fontSize: "0.75rem", 
            textTransform: "uppercase", 
            letterSpacing: "0.05em",
            color: "var(--text-muted)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "0.5rem",
            marginTop: "0.5rem"
          }}>
            Products
          </div>
        </div>

        {/* Categories Card */}
        <div 
          style={{
            background: "linear-gradient(to bottom, #161616, #111111)",
            border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: "14px",
            padding: "1.5rem",
            minHeight: "120px",
            transition: "all 0.2s ease",
            transform: "scale(1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 0 25px rgba(201,168,76,0.08)";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(236,72,153,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <FolderTree style={{ width: "18px", height: "18px", color: "#ec4899" }} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "600", color: "var(--text-primary)", fontFamily: "'DM Mono', monospace", marginBottom: "0.5rem" }}>
            {statsLoading ? "—" : stats?.totalCategories ?? 0}
          </div>
          <div style={{ 
            fontSize: "0.75rem", 
            textTransform: "uppercase", 
            letterSpacing: "0.05em",
            color: "var(--text-muted)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "0.5rem",
            marginTop: "0.5rem"
          }}>
            Categories
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>Analytics Overview</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart - 2 columns */}
          <div 
            className="lg:col-span-2"
            style={{
              background: "linear-gradient(to bottom, #161616, #111111)",
              border: "1px solid rgba(201,168,76,0.15)",
              borderRadius: "14px",
              padding: "1.5rem",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 25px rgba(201,168,76,0.08)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
            }}
          >
            <h3 style={{ fontSize: "1.125rem", fontWeight: "500", color: "var(--text-primary)", marginBottom: "1.5rem" }}>Revenue — Last 7 Days</h3>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={240}>
                <BarChart data={last7DaysData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fill: "var(--text-muted)" }} 
                    stroke="rgba(255,255,255,0.1)"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: "var(--text-muted)" }} 
                    stroke="rgba(255,255,255,0.1)"
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-elevated)",
                      border: "1px solid #C9A84C",
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                    }}
                    formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="#C9A84C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status - 1 column */}
          <div 
            style={{
              background: "linear-gradient(to bottom, #161616, #111111)",
              border: "1px solid rgba(201,168,76,0.15)",
              borderRadius: "14px",
              padding: "1.5rem",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 25px rgba(201,168,76,0.08)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
            }}
          >
            <h3 style={{ fontSize: "1.125rem", fontWeight: "500", color: "var(--text-primary)", marginBottom: "1.5rem" }}>Order Status</h3>
            <div style={{ flex: 1, minHeight: "200px" }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={240}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              {orderStatusData.map((entry) => (
                <div key={entry.name} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem"
                }}>
                  <div style={{ 
                    width: "10px", 
                    height: "10px", 
                    borderRadius: "50%", 
                    background: entry.color 
                  }} />
                  <span style={{ color: "var(--text-muted)" }}>{entry.name}</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: "500", marginLeft: "auto" }}>({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>Recent Orders</h2>
          <Link 
            to="/admin/orders" 
            style={{ 
              fontSize: "0.875rem",
              color: "#C9A84C",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201,168,76,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            View all →
          </Link>
        </div>

        <div 
          style={{
            background: "linear-gradient(to bottom, #161616, #111111)",
            border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: "14px",
            overflow: "hidden"
          }}
        >
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ 
                      padding: "1rem 1.5rem", 
                      fontSize: "0.75rem", 
                      fontWeight: "600", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.05em", 
                      color: "var(--text-muted)",
                      textAlign: "left"
                    }}>Order</th>
                    <th style={{ 
                      padding: "1rem 1.5rem", 
                      fontSize: "0.75rem", 
                      fontWeight: "600", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.05em", 
                      color: "var(--text-muted)",
                      textAlign: "left"
                    }}>Customer</th>
                    <th style={{ 
                      padding: "1rem 1.5rem", 
                      fontSize: "0.75rem", 
                      fontWeight: "600", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.05em", 
                      color: "var(--text-muted)",
                      textAlign: "left"
                    }}>Date</th>
                    <th style={{ 
                      padding: "1rem 1.5rem", 
                      fontSize: "0.75rem", 
                      fontWeight: "600", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.05em", 
                      color: "var(--text-muted)",
                      textAlign: "left"
                    }}>Status</th>
                    <th style={{ 
                      padding: "1rem 1.5rem", 
                      fontSize: "0.75rem", 
                      fontWeight: "600", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.05em", 
                      color: "var(--text-muted)",
                      textAlign: "right"
                    }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading && (
                    <tr>
                      <td colSpan={5}>
                        <div className="admin-skeleton" style={{ height: 64 }} />
                      </td>
                    </tr>
                  )}
                  {!ordersLoading && recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                        No orders yet
                      </td>
                    </tr>
                  )}
                  {!ordersLoading &&
                    recentOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        style={{ 
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          transition: "background 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "";
                        }}
                      >
                        <td style={{ 
                          padding: "1rem 1.5rem", 
                          fontFamily: "'DM Mono', monospace", 
                          fontSize: "0.875rem", 
                          fontWeight: "500",
                          color: "var(--text-primary)"
                        }}>#{order.id}</td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <div style={{ color: "var(--text-primary)", fontWeight: "500", marginBottom: "0.25rem" }}>{order.user?.name || "—"}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{order.user?.email || "—"}</div>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN")
                            : "—"}
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span 
                            className={`admin-status-badge ${order.status.toLowerCase()}`}
                            style={{ 
                              padding: "0.25rem 0.75rem",
                              fontSize: "0.75rem",
                              fontWeight: "500"
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td style={{ 
                          padding: "1rem 1.5rem", 
                          textAlign: "right", 
                          fontFamily: "'DM Mono', monospace", 
                          color: "#C9A84C", 
                          fontWeight: "600" 
                        }}>
                          {formatINR(order.totalAmount)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-4">
            {ordersLoading && (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="admin-skeleton" style={{ height: 120, borderRadius: 12 }} />
                ))}
              </>
            )}
            {!ordersLoading && recentOrders.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.5 }}>📋</div>
                <p>No orders yet</p>
              </div>
            )}
            {!ordersLoading &&
              recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "1rem",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.875rem", fontWeight: "600", color: "#C9A84C" }}>#{order.id}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.875rem", fontWeight: "600", color: "#C9A84C" }}>
                      {formatINR(order.totalAmount)}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Customer</span>
                      <span style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: "500" }}>{order.user?.name ?? "Guest"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Date</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN")
                          : "—"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Status</span>
                      <span 
                        className={`admin-status-badge ${order.status.toLowerCase()}`}
                        style={{ 
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;