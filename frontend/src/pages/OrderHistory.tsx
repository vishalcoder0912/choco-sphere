import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, ChevronDown, ChevronUp, ArrowLeft, ShoppingBag, Calendar, MapPin, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";
import { apiClient, type Order } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const OrderHistory = () => {
  const { user, token } = useAuthStore();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => apiClient.getOrdersByUser(user!.id, token!),
    enabled: !!user && !!token,
  });

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "#f59e0b";
      case "PROCESSING":
        return "#3b82f6";
      case "SHIPPED":
        return "#8b5cf6";
      case "DELIVERED":
        return "#22c55e";
      case "CANCELLED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <Clock size={16} />;
      case "PROCESSING":
        return <Package size={16} />;
      case "SHIPPED":
        return <Package size={16} />;
      case "DELIVERED":
        return <CheckCircle size={16} />;
      case "CANCELLED":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "8rem 2rem 4rem", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
          Please Login
        </h2>
        <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>
          You need to be logged in to view your order history
        </p>
        <Link
          to="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            borderRadius: "99rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Login to Continue
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: "8rem 2rem 4rem", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        Loading orders...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div style={{ padding: "8rem 2rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
        <Link 
          to="/products"
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            color: "var(--muted-foreground)", 
            textDecoration: "none", 
            marginBottom: "2rem",
            fontSize: "0.9rem", 
            fontWeight: 500 
          }}
        >
          <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
          Back to Shop
        </Link>
        
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "var(--card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
            }}
          >
            <ShoppingBag size={48} style={{ color: "var(--muted-foreground)" }} />
          </motion.div>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
            No orders yet
          </h2>
          <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>
            Start shopping to see your order history
          </p>
          <Link
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: "99rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "8rem 2rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
      <Link 
        to="/products"
        style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          color: "var(--muted-foreground)", 
          textDecoration: "none", 
          marginBottom: "2rem",
          fontSize: "0.9rem", 
          fontWeight: 500 
        }}
      >
        <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
        Back to Shop
      </Link>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Order History
        </h1>
        <p style={{ color: "var(--muted-foreground)" }}>
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            style={{
              background: "var(--card)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--secondary)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--card)"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flex: 1 }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "var(--secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Package size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                    <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                      {order.orderNumber}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "99px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        background: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                      }}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Calendar size={14} />
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                    <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
                      ₹{(order.totalAmount / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginRight: "0.5rem" }}>
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </span>
                {expandedOrder === order.id ? (
                  <ChevronUp size={20} style={{ color: "var(--muted-foreground)" }} />
                ) : (
                  <ChevronDown size={20} style={{ color: "var(--muted-foreground)" }} />
                )}
              </div>
            </div>

            {expandedOrder === order.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  borderTop: "1px solid var(--border)",
                  padding: "1.5rem",
                  background: "var(--secondary)",
                }}
              >
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Order Items
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          padding: "0.75rem",
                          background: "var(--card)",
                          borderRadius: "var(--radius)",
                        }}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{item.product.name}</div>
                          <div style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                            Qty: {item.quantity} × ₹{(item.price / 100).toFixed(2)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700 }}>
                          ₹{((item.price * item.quantity) / 100).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  {order.shippingAddress && (
                    <div>
                      <h3 style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <MapPin size={14} />
                        Shipping Address
                      </h3>
                      <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                        {order.shippingAddress}
                      </p>
                    </div>
                  )}
                  {order.paymentMethod && (
                    <div>
                      <h3 style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <CreditCard size={14} />
                        Payment Method
                      </h3>
                      <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
                        {order.paymentMethod}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                      Total Amount
                    </h3>
                    <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)" }}>
                      ₹{(order.totalAmount / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                  <Link
                    to={`/products`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      borderRadius: "var(--radius)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "opacity 0.2s",
                    }}
                  >
                    <ShoppingBag size={14} />
                    Shop Again
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
