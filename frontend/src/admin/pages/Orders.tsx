import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Eye, RefreshCw, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { apiClient, type Order } from "@/lib/api";
import { formatINR } from "@/lib/utils";

const STATUSES: Order["status"][] = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_FILTERS: Array<"ALL" | Order["status"]> = [
  "ALL",
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
];

const STATUS_STYLES: Record<Order["status"], { bg: string; text: string; border: string }> = {
  PENDING: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
  PAID: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  SHIPPED: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30" },
  DELIVERED: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  CANCELLED: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
};

const Orders = () => {
  const { token } = useAuthStore();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | Order["status"]>("ALL");
  const [viewing, setViewing] = useState<Order | null>(null);

  const {
    data: orders = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => apiClient.adminGetOrders(token as string),
    enabled: Boolean(token),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiClient.adminUpdateOrderStatus(token as string, id, status),
    onSuccess: () => {
      toast.success("Order status updated");
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const matchesStatus = filter === "ALL" || o.status === filter;
        const q = search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          String(o.id).includes(q) ||
          (o.user?.name ?? "").toLowerCase().includes(q) ||
          (o.user?.email ?? "").toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
      }),
    [orders, filter, search]
  );

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <p className="admin-page-subtitle">
          {orders.length} total · {filtered.length} shown
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="admin-filter-tabs">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            className={`admin-filter-tab ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
        <button
          className="admin-btn admin-btn-ghost admin-btn-sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="admin-mb-6">
        <div className="admin-search">
          <Search className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, name, or email..."
            className="admin-input"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="admin-desktop-only">
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h3 className="admin-table-title">All Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th className="admin-hidden-mobile">Date</th>
                  <th className="admin-hidden-mobile">Items</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7}>
                        <div className="admin-skeleton" style={{ height: 48 }} />
                      </td>
                    </tr>
                  ))}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="admin-text-center py-8" style={{ color: "var(--text-muted)" }}>
                      No orders match your filters
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  filtered.map((order) => {
                    return (
                      <tr key={order.id}>
                        <td className="font-mono">
                          <span style={{ 
                            display: "inline-flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            width: "32px", 
                            height: "32px", 
                            borderRadius: "8px", 
                            fontSize: "11px", 
                            fontWeight: "bold", 
                            background: "var(--gold-dim)", 
                            color: "var(--gold)" 
                          }}>#{order.id}</span>
                        </td>
                        <td>
                          <div style={{ color: "var(--text-primary)", fontWeight: "500" }}>{order.user?.name || "—"}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{order.user?.email || "—"}</div>
                        </td>
                        <td className="admin-hidden-mobile" style={{ color: "var(--text-muted)" }}>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN")
                            : "—"}
                        </td>
                        <td className="admin-hidden-mobile" style={{ color: "var(--text-muted)" }}>{order.items.length}</td>
                        <td>
                          <span className={`admin-status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "'DM Mono', monospace", color: "var(--gold)" }}>
                          {formatINR(order.totalAmount)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="admin-btn admin-btn-ghost admin-btn-icon"
                            onClick={() => setViewing(order)}
                            aria-label="View order"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="admin-mobile-only admin-mobile-cards">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="admin-skeleton" style={{ height: 120, borderRadius: 12 }} />
          ))}
        {!isLoading && filtered.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">📋</div>
            <p>No orders match your filters</p>
          </div>
        )}
        {!isLoading &&
          filtered.map((order) => (
            <div key={order.id} className="admin-mobile-card">
              <div className="admin-mobile-card-header">
                <span className="admin-mobile-card-title font-mono" style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "8px", 
                  fontSize: "11px", 
                  fontWeight: "bold", 
                  background: "var(--gold-dim)", 
                  color: "var(--gold)" 
                }}>#{order.id}</span>
                <span className="font-mono" style={{ color: "var(--gold)" }}>
                  {formatINR(order.totalAmount)}
                </span>
              </div>
              <div className="admin-mobile-card-content">
                <div className="admin-mobile-card-row">
                  <span className="admin-mobile-card-label">Customer</span>
                  <span className="admin-mobile-card-value">{order.user?.name ?? "Guest"}</span>
                </div>
                <div className="admin-mobile-card-row">
                  <span className="admin-mobile-card-label">Email</span>
                  <span className="admin-mobile-card-value">{order.user?.email ?? "—"}</span>
                </div>
                <div className="admin-mobile-card-row">
                  <span className="admin-mobile-card-label">Date</span>
                  <span className="admin-mobile-card-value">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN")
                      : "—"}
                  </span>
                </div>
                <div className="admin-mobile-card-row">
                  <span className="admin-mobile-card-label">Items</span>
                  <span className="admin-mobile-card-value">{order.items.length}</span>
                </div>
                <div className="admin-mobile-card-row">
                  <span className="admin-mobile-card-label">Status</span>
                  <span className={`admin-status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <button
                className="admin-btn admin-btn-ghost admin-btn-sm"
                style={{ width: "100%", marginTop: "12px" }}
                onClick={() => setViewing(order)}
              >
                <Eye size={14} />
                View Details
              </button>
            </div>
          ))}
      </div>

      {/* Order Details Modal */}
      {viewing && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setViewing(null);
        }}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Order #{viewing.id}</h2>
              <button className="admin-modal-close" onClick={() => setViewing(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-form-label">Customer</label>
                <div style={{ color: "var(--text-primary)", marginBottom: "4px" }}>{viewing.user?.name || "—"}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{viewing.user?.email}</div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <div className="admin-select">
                  <select
                    value={viewing.status}
                    onChange={(e) =>
                      updateStatus.mutate({
                        id: viewing.id,
                        status: e.target.value,
                      })
                    }
                    className="admin-input"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Items</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {viewing.items.map((item) => (
                    <div
                      key={item.id}
                      className="admin-category-item"
                      style={{ padding: "12px" }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-md object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      <div className="admin-category-details">
                        <div className="admin-category-name">{item.product.name}</div>
                        <div className="admin-category-count">Qty: {item.quantity} × {formatINR(item.product.price)}</div>
                      </div>
                      <div style={{ color: "var(--text-primary)", fontWeight: "bold", fontFamily: "'DM Mono', monospace" }}>
                        {formatINR(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-form-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "var(--text-muted)" }}>Total</span>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
                  {formatINR(viewing.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;