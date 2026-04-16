import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, CheckCircle, Edit2, Trash2, X, Folder } from "lucide-react";
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

const CategoriesPage = () => {
  const [form, setForm] = useState({ name: "" });
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: categories = [], isLoading, refetch: refetchCategories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/categories`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      return data.data || [];
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      });
      if (!response.ok) throw new Error("Failed to create category");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Category created successfully!");
      setSuccess(true);
      setForm({ name: "" });
      refetchCategories();
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/categories/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      });
      if (!response.ok) throw new Error("Failed to update category");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Category updated successfully!");
      setSuccess(true);
      resetForm();
      refetchCategories();
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/categories/${categoryId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete category");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      refetchCategories();
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete category"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const handleEdit = (category: any) => {
    setIsEditing(true);
    setEditingId(category.id);
    setForm({ name: category.name });
  };

  const handleDelete = (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category? This may affect products in this category.")) {
      deleteMutation.mutate(categoryId);
    }
  };

  const resetForm = () => {
    setForm({ name: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Categories</h2>
          <p style={{ color: "var(--muted-foreground)", margin: 0 }}>Manage product categories</p>
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
            <Plus size={16} /> Add Category
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
                  <Tag size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{editingId ? "Edit Category" : "Add New Category"}</h3>
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
                  <CheckCircle size={16} /> Category {editingId ? "updated" : "created"} successfully!
                </motion.div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Category Name *</label>
                  <input required name="name" value={form.name} onChange={handleChange} placeholder="e.g. Dark Chocolate" style={inputStyle} />
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
                  {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : (editingId ? "Update Category" : "Add Category")}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category List */}
      {!isEditing && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Folder size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Category List</h3>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
              <div style={{ width: "24px", height: "24px", border: "2px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
              <p>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
              <Folder size={48} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
              <p>No categories yet. Add your first category!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {categories.map((category: any) => (
                <div
                  key={category.id}
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
                    width: "48px",
                    height: "48px",
                    borderRadius: "0.5rem",
                    background: "var(--primary)15",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Tag size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>{category.name}</p>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                      ID: {category.id}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEdit(category)}
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
                      onClick={() => handleDelete(category.id)}
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

export default CategoriesPage;
