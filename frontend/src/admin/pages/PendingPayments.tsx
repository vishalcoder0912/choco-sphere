import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, CheckCircle, XCircle, Clock, User, Package, Smartphone, Eye, Check, X, RefreshCw, Bell, BellRing, AlertCircle, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { apiClient, type PaymentReceipt } from "@/lib/api";

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
    PENDING: { bg: "#fef3c7", color: "#92400e", icon: <Clock size={14} />, label: "Awaiting Payment" },
    SUBMITTED: { bg: "#dbeafe", color: "#1e40af", icon: <ArrowRight size={14} />, label: "Transaction Submitted" },
    COMPLETED: { bg: "#d1fae5", color: "#065f46", icon: <CheckCircle size={14} />, label: "Verified" },
    FAILED: { bg: "#fee2e2", color: "#991b1b", icon: <XCircle size={14} />, label: "Failed" },
  };
  
  const { bg, color, icon, label } = config[status] || config.PENDING;
  
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.3rem",
      padding: "0.25rem 0.625rem",
      borderRadius: "99px",
      fontSize: "0.75rem",
      fontWeight: 600,
      background: bg,
      color: color,
    }}>
      {icon}
      {label}
    </span>
  );
};

const PendingPaymentsPage = () => {
  const queryClient = useQueryClient();
  const [selectedPayment, setSelectedPayment] = useState<PaymentReceipt | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { data: payments = [], isLoading, refetch } = useQuery({
    queryKey: ["pending-payments"],
    queryFn: () => apiClient.getPendingPayments("admin"),
    refetchInterval: 30000,
  });

  const verifyMutation = useMutation({
    mutationFn: (orderId: number) => apiClient.verifyPayment("admin", orderId),
    onSuccess: () => {
      toast.success("Payment verified successfully!");
      queryClient.invalidateQueries({ queryKey: ["pending-payments"] });
      setSelectedPayment(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: number; reason: string }) => 
      apiClient.rejectPayment("admin", orderId, reason),
    onSuccess: () => {
      toast.success("Payment rejected");
      queryClient.invalidateQueries({ queryKey: ["pending-payments"] });
      setShowRejectModal(false);
      setSelectedPayment(null);
      setRejectReason("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <QrCode size={24} color="var(--primary)" />
            UPI Payment Verification
          </h2>
          <p style={{ color: "var(--muted-foreground)", margin: "0.5rem 0 0", fontSize: "0.9rem" }}>
            Verify customer UPI payments and confirm order completion
          </p>
        </div>
        <button
          onClick={() => refetch()}
          style={{
            padding: "0.5rem 1rem",
            background: "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.85rem"
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {payments.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "1rem",
          padding: "1rem 1.5rem",
          color: "white",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <BellRing size={20} />
          <span style={{ fontWeight: 600 }}>{payments.length} payment(s) awaiting verification</span>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted-foreground)" }}>
          <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
          <p>Loading pending payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "4rem",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "1rem"
        }}>
          <CheckCircle size={48} style={{ margin: "0 auto 1rem", opacity: 0.4, color: "#10b981" }} />
          <h3 style={{ margin: "0 0 0.5rem" }}>All Caught Up!</h3>
          <p style={{ color: "var(--muted-foreground)", margin: 0 }}>
            No pending payments to verify. New payments will appear here automatically.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {payments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "var(--card)",
                  border: `2px solid ${selectedPayment?.id === payment.id ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: "0.875rem",
                  padding: "1.25rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onClick={() => setSelectedPayment(payment)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "1rem" }}>Order #{payment.order?.orderNumber}</span>
                      <PaymentStatusBadge status={payment.status} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.85rem" }}>
                      <User size={14} />
                      {payment.order?.user?.name} · {payment.order?.user?.email}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>₹{(payment.amount / 100).toFixed(2)}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", margin: "0.25rem 0 0" }}>
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {payment.transactionId && (
                  <div style={{
                    background: "var(--background)",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    marginBottom: "0.75rem"
                  }}>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", margin: "0 0 0.25rem" }}>Transaction ID</p>
                    <p style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "0.9rem", margin: 0 }}>{payment.transactionId}</p>
                    {payment.payerVpa && (
                      <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", margin: "0.25rem 0 0" }}>
                        Payer UPI: {payment.payerVpa}
                      </p>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.85rem" }}>
                  <Smartphone size={14} />
                  <span>UPI: {payment.upiId}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selectedPayment && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  position: "sticky",
                  top: "6rem",
                  height: "fit-content"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  <Eye size={18} color="var(--primary)" />
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>Payment Details</h3>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Order Number</span>
                    <span style={{ fontWeight: 600 }}>#{selectedPayment.order?.orderNumber}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Amount</span>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--primary)" }}>
                      ₹{(selectedPayment.amount / 100).toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>UPI ID</span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>{selectedPayment.upiId}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Customer</span>
                    <span>{selectedPayment.order?.user?.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Submitted</span>
                    <span style={{ fontSize: "0.85rem" }}>
                      {new Date(selectedPayment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedPayment.transactionId && (
                  <div style={{
                    background: "var(--background)",
                    padding: "1rem",
                    borderRadius: "0.75rem",
                    marginBottom: "1.5rem",
                    border: "1px solid var(--border)"
                  }}>
                    <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", fontWeight: 600 }}>Transaction Details</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>Transaction ID</span>
                        <span style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{selectedPayment.transactionId}</span>
                      </div>
                      {selectedPayment.payerVpa && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>Payer UPI</span>
                          <span style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{selectedPayment.payerVpa}</span>
                        </div>
                      )}
                      {selectedPayment.payerName && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>Payer Name</span>
                          <span style={{ fontSize: "0.8rem" }}>{selectedPayment.payerName}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>Status</span>
                        <PaymentStatusBadge status={selectedPayment.status} />
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", fontWeight: 600 }}>
                    <Package size={14} style={{ display: "inline", marginRight: "0.5rem" }} />
                    Order Items
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {selectedPayment.order?.items.map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                        <span>{item.product.name} x {item.quantity}</span>
                        <span style={{ fontWeight: 600 }}>₹{((item.price * item.quantity) / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => verifyMutation.mutate(selectedPayment.orderId)}
                    disabled={verifyMutation.isPending}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <CheckCircle size={16} />
                    {verifyMutation.isPending ? "Verifying..." : "Verify Payment"}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedPayment && (
            <div style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              padding: "3rem 1.5rem",
              textAlign: "center",
              position: "sticky",
              top: "6rem"
            }}>
              <QrCode size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
              <p style={{ color: "var(--muted-foreground)", margin: 0 }}>
                Select a payment to view details
              </p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showRejectModal && selectedPayment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 100
              }}
              onClick={() => setShowRejectModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "var(--card)",
                borderRadius: "1rem",
                padding: "1.5rem",
                width: "90%",
                maxWidth: "400px",
                zIndex: 101
              }}
            >
              <h3 style={{ margin: "0 0 1rem", fontSize: "1.1rem", fontWeight: 600 }}>Reject Payment</h3>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                Please provide a reason for rejecting this payment. The customer will be notified.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "0.75rem",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  background: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  resize: "vertical"
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => setShowRejectModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "var(--muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => rejectMutation.mutate({ orderId: selectedPayment.orderId, reason: rejectReason })}
                  disabled={!rejectReason.trim() || rejectMutation.isPending}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    cursor: rejectReason.trim() ? "pointer" : "not-allowed",
                    opacity: rejectReason.trim() ? 1 : 0.5
                  }}
                >
                  {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingPaymentsPage;
