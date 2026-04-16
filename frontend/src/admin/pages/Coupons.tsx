import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Plus, CheckCircle, Edit2, Trash2, X, Percent, Calendar } from "lucide-react";
import { toast } from "sonner";

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

const CouponsPage = () => {
  const [form, setForm] = useState({ code: "", discount: "", expiry: "" });
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: coupons = [], isLoading, refetch: refetchCoupons } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/coupons`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch coupons");
      const data = await response.json();
      return data.data || [];
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/coupons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discount: parseInt(form.discount),
          expiry: form.expiry,
        }),
      });
      if (!response.ok) throw new Error("Failed to create coupon");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Coupon created successfully!");
      setSuccess(true);
      setForm({ code: "", discount: "", expiry: "" });
      refetchCoupons();
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create coupon"),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/coupons/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discount: parseInt(form.discount),
          expiry: form.expiry,
        }),
      });
      if (!response.ok) throw new Error("Failed to update coupon");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Coupon updated successfully!");
      setSuccess(true);
      resetForm();
      refetchCoupons();
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update coupon"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (couponId: number) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/coupons/${couponId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete coupon");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Coupon deleted successfully!");
      refetchCoupons();
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete coupon"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const handleEdit = (coupon: any) => {
    setIsEditing(true);
    setEditingId(coupon.id);
    setForm({ code: coupon.code, discount: coupon.discount.toString(), expiry: coupon.expiry });
  };

  const handleDelete = (couponId: number) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      deleteMutation.mutate(couponId);
    }
  };

  const resetForm = () => {
    setForm({ code: "", discount: "", expiry: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  const isExpired = (expiry: string) => {
    return new Date(expiry) < new Date();
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Coupons</h2>
          <p style={{ color: "var(--muted-foreground)", margin: 0 }}>Manage discount coupons</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: "0.625rem 1.25rem",
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Plus size={16} /> Add Coupon
          </button>
        )}
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: "2rem" }}
          >
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Ticket size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{editingId ? "Edit Coupon" : "Add New Coupon"}</h3>
                </div>
                <button
                  onClick={resetForm}
                  style={{
                    padding: "0.5rem",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "0.375rem",
                    color: "var(--muted-foreground)",
                    cursor: "pointer",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: "#10b98122", borderRadius: "0.5rem", marginBottom: "1rem", color: "#10b981" }}
                >
                  <CheckCircle size={16} /> Coupon {editingId ? "updated" : "created"} successfully!
                </motion.div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Coupon Code *</label>
                  <input required name="code" value={form.code} onChange={handleChange} placeholder="e.g. SUMMER2025" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Discount (%) *</label>
                    <input required type="number" min="1" max="100" name="discount" value={form.discount} onChange={handleChange} placeholder="e.g. 20" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Expiry Date *</label>
                    <input required type="date" name="expiry" value={form.expiry} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  style={{
                    padding: "0.875rem", background: (createMutation.isPending || updateMutation.isPending) ? "var(--muted)" : "var(--primary)",
                    color: (createMutation.isPending || updateMutation.isPending) ? "var(--muted-foreground)" : "var(--primary-foreground)",
                    border: "none", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.95rem",
                    cursor: (createMutation.isPending || updateMutation.isPending) ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <Plus size={16} />
                  {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : (editingId ? "Update Coupon" : "Add Coupon")}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupon List */}
      {!isEditing && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Ticket size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Active Coupons</h3>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
              <div style={{ width: "24px", height: "24px", border: "2px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
              <p>Loading coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
              <Ticket size={48} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
              <p>No coupons yet. Create your first coupon!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {coupons.map((coupon: any) => (
                <div
                  key={coupon.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    background: "var(--background)",
                    borderRadius: "0.75rem",
                    border: isExpired(coupon.expiry) ? "1px solid #ef4444" : "1px solid var(--border)",
                  }}
                >
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "0.5rem",
                    background: isExpired(coupon.expiry) ? "#ef444415" : "var(--primary)15",
                    color: isExpired(coupon.expiry) ? "#ef4444" : "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Percent size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>{coupon.code}</p>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                      {coupon.discount}% off · Expires: {new Date(coupon.expiry).toLocaleDateString()}
                    </p>
                    {isExpired(coupon.expiry) && (
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.15rem 0.4rem",
                        borderRadius: "99px",
                        background: "#ef444422",
                        color: "#ef4444",
                      }}>
                        Expired
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEdit(coupon)}
                      style={{
                        padding: "0.5rem",
                        background: "var(--secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.375rem",
                        color: "var(--foreground)",
                        cursor: "pointer",
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      style={{
                        padding: "0.5rem",
                        background: "#ef444415",
                        border: "1px solid #ef4444",
                        borderRadius: "0.375rem",
                        color: "#ef4444",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
