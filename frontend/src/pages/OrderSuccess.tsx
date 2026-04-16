import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Home, CreditCard, Smartphone, QrCode, Clock, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient, type Order } from "@/lib/api";
import styles from "./Index.module.css";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) setOrderId(parseInt(id, 10));
  }, [searchParams]);

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      try {
        return await apiClient.getOrder(orderId);
      } catch {
        return null;
      }
    },
    enabled: Boolean(orderId),
    retry: false,
  });

  const order = orderQuery.data;
  const isUpiPayment = order?.paymentMethod === "UPI";
  const needsVerification = isUpiPayment && order?.status === "PAYMENT_PENDING";

  return (
    <div style={{ padding: "8rem 2rem 4rem", maxWidth: "720px", margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", damping: 20 }}
        style={{
          textAlign: "center",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "1.5rem",
          padding: "3rem 2rem",
          boxShadow: "var(--shadow-elevated)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 12 }}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: needsVerification 
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #10b981, #34d399)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          {needsVerification ? (
            <Clock size={40} color="white" />
          ) : (
            <CheckCircle2 size={40} color="white" />
          )}
        </motion.div>

        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-serif)", fontWeight: 700, marginBottom: "0.75rem" }}>
          {needsVerification ? "Payment Submitted!" : "Order Confirmed!"}
        </h1>

        <p style={{ color: "var(--muted-foreground)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
          {needsVerification 
            ? "Your payment has been submitted and is awaiting admin verification. You will be notified once confirmed."
            : "Thank you for your purchase. Your order has been placed successfully and is being processed."}
        </p>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Order Number</span>
                <p style={{ fontWeight: 700, fontSize: "1.1rem", margin: "0.25rem 0 0" }}>#{order.orderNumber || order.id}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</span>
                <p style={{ 
                  fontWeight: 700, 
                  fontSize: "1.1rem", 
                  margin: "0.25rem 0 0", 
                  color: order.status === "PAID" ? "#10b981" : order.status === "PAYMENT_PENDING" ? "#667eea" : "#f59e0b" 
                }}>
                  {order.status === "PAYMENT_PENDING" ? "Awaiting Verification" : order.status}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Items</span>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0" }}>
                  <span style={{ fontSize: "0.9rem" }}>{item.product.name} x {item.quantity}</span>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>₹{((item.price * item.quantity) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid var(--border)", fontWeight: 700, fontSize: "1.1rem" }}>
              <span>Total</span>
              <span>₹{(order.totalAmount / 100).toFixed(2)}</span>
            </div>
          </motion.div>
        )}

        {order?.shippingAddress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              padding: "1.25rem",
              marginBottom: "1.5rem",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Package size={16} color="var(--primary)" />
              <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Shipping To</span>
            </div>
            <p style={{ fontSize: "0.9rem", margin: 0, color: "var(--foreground)" }}>{order.shippingAddress}</p>
          </motion.div>
        )}

        {order?.paymentMethod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              padding: "1.25rem",
              marginBottom: "1.5rem",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {order.paymentMethod === "UPI" ? <QrCode size={16} color="var(--primary)" /> : <CreditCard size={16} color="var(--primary)" />}
              <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Payment Details</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "0.85rem", margin: 0, color: "var(--muted-foreground)" }}>Method</p>
                <p style={{ fontSize: "0.95rem", fontWeight: 600, margin: "0.25rem 0 0" }}>
                  {order.paymentMethod === "UPI" ? "UPI QR Payment" : "Credit/Debit Card"}
                </p>
              </div>
              {(order.paymentDetails as any)?.transactionId && (
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.85rem", margin: 0, color: "var(--muted-foreground)" }}>Transaction ID</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 600, margin: "0.25rem 0 0", fontFamily: "monospace" }}>
                    {(order.paymentDetails as any).transactionId}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {needsVerification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "1rem",
              padding: "1.25rem",
              marginBottom: "1.5rem",
              color: "white",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.95rem", fontWeight: 600 }}>What happens next?</h4>
                <ol style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.85rem", lineHeight: 1.8, opacity: 0.9 }}>
                  <li>Our admin team will verify your UPI payment</li>
                  <li>You'll receive a notification once confirmed</li>
                  <li>Your order will be processed and shipped</li>
                </ol>
              </div>
            </div>
          </motion.div>
        )}

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <motion.button
              className={styles.heroCta}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Home size={16} />
              Back to Home
            </motion.button>
          </Link>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <motion.button
              style={{
                padding: "0.75rem 1.5rem",
                background: "var(--secondary)",
                color: "var(--foreground)",
                border: "none",
                borderRadius: "9999px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.9rem"
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Package size={16} />
              Continue Shopping
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
