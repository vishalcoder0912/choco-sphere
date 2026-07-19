import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, FolderTree, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api";

const CATEGORY_ICONS: Record<string, string> = {
  "dark chocolate": "🖤",
  "milk chocolate": "🤎",
  "white chocolate": "🤍",
  truffles: "🍫",
  "gift boxes": "🎁",
  seasonal: "🌸",
  organic: "🌿",
};

type FormState = {
  name: string;
  description: string;
};

const emptyForm = (): FormState => ({
  name: "",
  description: "",
});

const CategoriesPage = () => {
  const { token } = useAuthStore();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(emptyForm());
  const [deleting, setDeleting] = useState<any>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => apiClient.adminGetCategories(token as string),
    enabled: Boolean(token),
  });

  const create = useMutation({
    mutationFn: (body: { name: string; description?: string }) =>
      apiClient.adminCreateCategory(token as string, body),
    onSuccess: () => {
      toast.success("Category created");
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      setForm(emptyForm());
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiClient.adminDeleteCategory(token as string, id),
    onSuccess: () => {
      toast.success("Category deleted");
      setDeleting(null);
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }
    create.mutate({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
    });
  };

  const getCategoryIcon = (name: string) => {
    const key = name.toLowerCase();
    return CATEGORY_ICONS[key] || "🍫";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold" style={{ color: "#C9A84C", marginBottom: "0.5rem" }}>Categories</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {categories.length} categor{categories.length !== 1 ? "ies" : "y"} defined
        </p>
      </div>

      {/* Layout: Categories grid and Add form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="admin-category-card">
                  <div className="admin-skeleton" style={{ width: "36px", height: "36px", borderRadius: "8px" }} />
                  <div className="admin-skeleton" style={{ height: "16px", marginBottom: "4px" }} />
                  <div className="admin-skeleton" style={{ height: "12px", width: "60px" }} />
                </div>
              ))}
            {!isLoading && categories.length === 0 && (
              <div className="col-span-full admin-empty">
                <div className="admin-empty-icon">
                  <FolderTree className="w-12 h-12" />
                </div>
                <p>No categories found</p>
              </div>
            )}
            {!isLoading &&
              categories.map((cat: any) => (
                <div
                  key={cat.id}
                  className="admin-category-card"
                  style={{
                    background: "linear-gradient(to bottom, #161616, #111111)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    borderRadius: "12px",
                    padding: "1rem",
                    transition: "all 0.2s ease",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(201,168,76,0.08)";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
                    e.currentTarget.style.boxShadow = "";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <button
                    className="absolute top-2 right-2 p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)"
                    }}
                    onClick={() => setDeleting(cat)}
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-start gap-3">
                    <div 
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: "rgba(201,168,76,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.125rem",
                        flexShrink: 0
                      }}
                    >
                      {getCategoryIcon(cat.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: "500",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {cat.name}
                      </h3>
                      <p 
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}
                      >
                        <span>{cat._count?.products ?? cat.productCount ?? 0}</span>
                        <span>products</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Add Category Form */}
        <div 
          style={{
            background: "linear-gradient(to bottom, #161616, #111111)",
            border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: "14px",
            padding: "1.5rem"
          }}
        >
          <h2 style={{ 
            fontSize: "1.125rem", 
            fontWeight: "500", 
            color: "var(--text-primary)", 
            marginBottom: "1.5rem" 
          }}>Add Category</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-muted)",
                marginBottom: "0.5rem"
              }}>
                Name
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  fontSize: "0.875rem",
                  minHeight: "44px",
                  transition: "all 0.2s ease"
                }}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dark Chocolate"
                required
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#C9A84C";
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-muted)",
                marginBottom: "0.5rem"
              }}>
                Description (optional)
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  fontSize: "0.875rem",
                  minHeight: "44px",
                  transition: "all 0.2s ease"
                }}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#C9A84C";
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
              />
            </div>

            {form.name && (
              <div style={{
                padding: "1rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px"
              }}>
                <p style={{
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--text-muted)",
                  marginBottom: "0.75rem"
                }}>
                  Preview
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div 
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(201,168,76,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.125rem"
                    }}
                  >
                    {getCategoryIcon(form.name)}
                  </div>
                  <div>
                    <p style={{ color: "var(--text-primary)", fontWeight: "500", fontSize: "0.875rem" }}>{form.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>0 products</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "#C9A84C",
                color: "var(--bg-base)",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: "500",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease",
                cursor: create.isPending ? "not-allowed" : "pointer",
                opacity: create.isPending ? 0.7 : 1
              }}
              disabled={create.isPending}
              onMouseEnter={(e) => {
                if (!create.isPending) {
                  e.currentTarget.style.background = "#E5C876";
                  e.currentTarget.style.transform = "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (!create.isPending) {
                  e.currentTarget.style.background = "#C9A84C";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              <Plus size={16} />
              {create.isPending ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleting(null);
          }}
        >
          <div className="admin-modal" style={{ maxWidth: "400px" }}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Delete Category?</h2>
              <button className="admin-modal-close" onClick={() => setDeleting(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: "var(--text-muted)" }}>
                Are you sure you want to delete "{deleting.name}"? Products in this category will need to be reassigned.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setDeleting(null)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => deleting && remove.mutate(deleting.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;