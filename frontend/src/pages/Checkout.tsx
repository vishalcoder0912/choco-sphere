import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, Truck, CreditCard, Smartphone, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api";

type PaymentMethod = "CARD" | "UPI";

const inputStyle: React.CSSProperties = {
  background: "var(--background)",
  color: "var(--foreground)",
  border: "1px solid var(--border)",
  padding: "0.75rem 1rem",
  borderRadius: "0.5rem",
  fontSize: "0.95rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartTotal = useCartStore((state) => state.total());
  const { user, token } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
  const [upiCopied, setUpiCopied] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    address: "",
    city: "",
    zip: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    upiId: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock UPI ID for the store — in production this would be real merchant UPI
  const STORE_UPI_ID = "chocoverse@okhdfc";
  const upiDeepLink = `upi://pay?pa=${STORE_UPI_ID}&pn=ChocoVerse&am=${(cartTotal / 100).toFixed(2)}&cu=INR&tn=ChocoVerse+Order`;

  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      navigate("/products");
    }
  }, [cartItems, navigate, isSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(STORE_UPI_ID);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Please sign in before placing your order");
      if (cartItems.length === 0) throw new Error("Your cart is empty");

      const shippingAddress = `${form.firstName} ${form.lastName}, ${form.address}, ${form.city} - ${form.zip}`;
      const paymentDetails =
        paymentMethod === "CARD"
          ? { cardholderName: form.cardName, last4: form.cardNumber.slice(-4) }
          : { upiId: form.upiId };

      return apiClient.createOrder(
        token,
        cartItems.map((item) => ({ productId: item.id, quantity: item.quantity })),
        shippingAddress,
        paymentMethod,
        paymentDetails
      );
    },
    onSuccess: () => {
      setIsSuccess(true);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed! Thank you for your purchase 🍫");
      navigate("/account");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Unable to place order");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "UPI" && !form.upiId.trim()) {
      toast.error("Please enter your UPI ID to confirm payment.");
      return;
    }
    checkoutMutation.mutate();
  };

  if (cartItems.length === 0 && !isSuccess) return null;

  return (
    <div style={{ padding: "6rem 1.5rem 4rem", maxWidth: "1080px", margin: "0 auto" }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "2.5rem", textAlign: "center" }}
      >
        Secure Checkout
      </motion.h1>

      <div className="checkout-desktop-split" style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
        <style>{`
          @media (min-width: 768px) {
            .checkout-desktop-split { flex-direction: row !important; }
            .checkout-form-col { flex: 1.5; }
            .checkout-summary-col { flex: 1; }
          }
          .pay-tab { transition: all 0.2s; cursor: pointer; }
          .pay-tab:hover { opacity: 0.85; }
        `}</style>

        {/* LEFT — Form */}
        <motion.div
          className="checkout-form-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <form id="checkout-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Shipping */}
            <div style={{ background: "var(--card)", padding: "1.75rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <Truck size={20} color="var(--primary)" />
                <h2 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Shipping Information</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <input required name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" style={inputStyle} />
                <input required name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" style={inputStyle} />
                <input required name="address" value={form.address} onChange={handleChange} placeholder="Street Address" style={{ ...inputStyle, gridColumn: "1 / -1" }} />
                <input required name="city" value={form.city} onChange={handleChange} placeholder="City" style={inputStyle} />
                <input required name="zip" value={form.zip} onChange={handleChange} placeholder="Pin Code" style={inputStyle} />
              </div>
            </div>

            {/* Payment Method Toggle */}
            <div style={{ background: "var(--card)", padding: "1.75rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <Lock size={20} color="var(--primary)" />
                <h2 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Payment Method</h2>
              </div>

              {/* Tab Switcher */}
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {(["CARD", "UPI"] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    className="pay-tab"
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      borderRadius: "0.625rem",
                      border: `2px solid ${paymentMethod === method ? "var(--primary)" : "var(--border)"}`,
                      background: paymentMethod === method ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "transparent",
                      color: paymentMethod === method ? "var(--primary)" : "var(--muted-foreground)",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    {method === "CARD" ? <CreditCard size={16} /> : <Smartphone size={16} />}
                    {method === "CARD" ? "Credit / Debit Card" : "UPI Payment"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {paymentMethod === "CARD" ? (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}
                  >
                    <input required name="cardName" value={form.cardName} onChange={handleChange} placeholder="Name on Card" style={{ ...inputStyle, gridColumn: "1 / -1" }} />
                    <input required name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="Card Number" maxLength={19} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
                    <input required name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" style={inputStyle} />
                    <input required name="cvc" value={form.cvc} onChange={handleChange} placeholder="CVC" maxLength={4} style={inputStyle} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="upi"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}
                  >
                    {/* QR Code */}
                    <div style={{ padding: "1rem", background: "white", borderRadius: "0.75rem", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
                      <QRCodeSVG
                        value={upiDeepLink}
                        size={180}
                        level="H"
                        includeMargin
                      />
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", textAlign: "center", maxWidth: "320px" }}>
                      Scan this QR code with any UPI app (GPay, PhonePe, Paytm) to pay <strong style={{ color: "var(--foreground)" }}>₹{(cartTotal / 100).toFixed(2)}</strong>
                    </p>

                    {/* Merchant UPI ID */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      background: "var(--background)", border: "1px solid var(--border)",
                      borderRadius: "0.5rem", padding: "0.75rem 1rem", width: "100%",
                    }}>
                      <span style={{ flex: 1, fontSize: "0.9rem", fontFamily: "monospace", color: "var(--foreground)" }}>{STORE_UPI_ID}</span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)", display: "flex" }}
                      >
                        {upiCopied ? <CheckCircle2 size={18} color="green" /> : <Copy size={18} />}
                      </button>
                    </div>

                    {/* UPI ID confirmation */}
                    <div style={{ width: "100%" }}>
                      <label style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", display: "block", marginBottom: "0.4rem" }}>
                        Enter your UPI ID to confirm payment
                      </label>
                      <input
                        name="upiId"
                        value={form.upiId}
                        onChange={handleChange}
                        placeholder="yourname@okaxis / @okhdfc"
                        style={inputStyle}
                      />
                    </div>

                    <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", textAlign: "center" }}>
                      ⚠️ This is a demo store. No real transaction will be processed.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>

        {/* RIGHT — Summary */}
        <motion.div
          className="checkout-summary-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div style={{
            background: "var(--card)", padding: "1.75rem", borderRadius: "1rem",
            border: "1px solid var(--border)", position: "sticky", top: "6rem",
          }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Order Summary</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.5rem", maxHeight: "280px", overflowY: "auto" }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <img src={item.image} alt={item.name} style={{ width: "54px", height: "54px", objectFit: "cover", borderRadius: "0.5rem" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", margin: 0 }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem", flexShrink: 0 }}>
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
                <span>Subtotal</span><span>${(cartTotal / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
                <span>Shipping</span><span>Free</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.15rem", marginTop: "0.5rem" }}>
                <span>Total</span>
                <span>${(cartTotal / 100).toFixed(2)}</span>
              </div>
              {paymentMethod === "UPI" && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>
                  <span>≈ INR</span><span>₹{(cartTotal / 100).toFixed(2)}</span>
                </div>
              )}
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={checkoutMutation.isPending || !user}
              style={{
                width: "100%", padding: "1rem",
                background: (!user || checkoutMutation.isPending) ? "var(--muted)" : "var(--primary)",
                color: (!user || checkoutMutation.isPending) ? "var(--muted-foreground)" : "var(--primary-foreground)",
                border: "none", borderRadius: "0.625rem", fontWeight: 600, fontSize: "1rem",
                cursor: (!user || checkoutMutation.isPending) ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                transition: "opacity 0.2s",
              }}
            >
              {checkoutMutation.isPending ? "Processing..." : !user ? "Log In to Checkout" : "Place Order"}
              {!checkoutMutation.isPending && user && <ShieldCheck size={18} />}
            </button>

            {/* Payment method badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginTop: "0.875rem", color: "var(--muted-foreground)", fontSize: "0.8rem" }}>
              {paymentMethod === "CARD" ? <CreditCard size={14} /> : <Smartphone size={14} />}
              <span>Paying via {paymentMethod === "CARD" ? "Card" : "UPI"} · SSL Secured</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
