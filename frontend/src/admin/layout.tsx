import { Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Smartphone, Settings, ArrowLeft, History, QrCode, Bell, BellRing, Tag, Ticket } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useState, useEffect } from "react";

const NavLink = ({ to, icon, children, badge }: { to: string; icon: React.ReactNode; children: React.ReactNode; badge?: number }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        textDecoration: "none",
        color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
        fontWeight: isActive ? 600 : 500,
        fontSize: "0.95rem",
        transition: "all 0.2s",
        background: isActive ? "color-mix(in srgb, var(--primary) 15%, transparent)" : "transparent",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "var(--secondary)";
          e.currentTarget.style.color = "var(--foreground)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--muted-foreground)";
        }
      }}
    >
      {icon}
      {children}
      {badge && badge > 0 && (
        <span style={{
          marginLeft: "auto",
          background: "#ef4444",
          color: "white",
          fontSize: "0.7rem",
          fontWeight: 700,
          padding: "0.15rem 0.4rem",
          borderRadius: "99px",
          minWidth: "18px",
          textAlign: "center"
        }}>
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
};

const AdminLayout = () => {
  const [pendingCount, setPendingCount] = useState(0);

  const { data: pendingPayments = [] } = useQuery({
    queryKey: ["pending-payments-count"],
    queryFn: () => apiClient.getPendingPayments("admin-token"),
    enabled: false,
    refetchInterval: 30000,
  });

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const payments = await apiClient.getPendingPayments("admin-token");
        setPendingCount(payments?.length || 0);
      } catch {
        setPendingCount(0);
      }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <header style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/" style={{ color: "var(--muted-foreground)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ArrowLeft size={20} />
            <span style={{ fontSize: "0.9rem" }}>Back to Store</span>
          </Link>
          <div style={{ width: "1px", height: "24px", background: "var(--border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <LayoutDashboard size={24} color="var(--primary)" />
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Admin Panel</h1>
          </div>
        </div>

        {pendingCount > 0 && (
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "99px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.85rem",
            fontWeight: 600
          }}>
            <BellRing size={16} />
            {pendingCount} payment{pendingCount > 1 ? "s" : ""} pending verification
          </div>
        )}
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 65px)" }}>
        <aside style={{
          width: "280px",
          background: "var(--card)",
          borderRight: "1px solid var(--border)",
          padding: "1.5rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 1rem 0.5rem" }}>
              Overview
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <NavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />}>
                Dashboard
              </NavLink>
            </nav>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 1rem 0.5rem" }}>
              Order Management
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <NavLink to="/admin" icon={<Package size={18} />}>
                All Orders
              </NavLink>
              <NavLink to="/admin/payments" icon={<QrCode size={18} />} badge={pendingCount}>
                UPI Payments
              </NavLink>
            </nav>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 1rem 0.5rem" }}>
              Store Management
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <NavLink to="/admin/products" icon={<Settings size={18} />}>
                Products
              </NavLink>
              <NavLink to="/admin/categories" icon={<Tag size={18} />}>
                Categories
              </NavLink>
              <NavLink to="/admin/coupons" icon={<Ticket size={18} />}>
                Coupons
              </NavLink>
              <NavLink to="/admin/upi" icon={<Smartphone size={18} />}>
                UPI Settings
              </NavLink>
            </nav>
          </div>

          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 1rem 0.5rem" }}>
              Reports
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <NavLink to="/admin/history" icon={<History size={18} />}>
                Transaction History
              </NavLink>
            </nav>
          </div>
        </aside>

        <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
