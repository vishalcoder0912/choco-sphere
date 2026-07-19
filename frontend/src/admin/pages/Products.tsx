import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Package, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { apiClient, type Product, type ProductInput } from "@/lib/api";
import { formatINR } from "@/lib/utils";

type FormState = {
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId: string;
};

const emptyForm = (): FormState => ({
  name: "",
  description: "",
  price: "",
  image: "",
  categoryId: "",
});

const Products = () => {
  const { token } = useAuthStore();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => apiClient.adminGetProducts(token as string),
    enabled: Boolean(token),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => apiClient.adminGetCategories(token as string),
    enabled: Boolean(token),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
    );
  }, [products, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: (product.price / 100).toString(),
      image: product.image,
      categoryId: String(product.categoryId),
    });
    setDialogOpen(true);
  };

  const buildPayload = (): ProductInput | null => {
    const priceNum = Number(form.price);
    const categoryId = Number(form.categoryId);
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.image.trim() ||
      !Number.isFinite(priceNum) ||
      priceNum <= 0 ||
      !Number.isInteger(categoryId)
    ) {
      toast.error("Please fill all fields correctly.");
      return null;
    }
    return {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Math.round(priceNum * 100),
      image: form.image.trim(),
      categoryId,
    };
  };

  const create = useMutation({
    mutationFn: (body: ProductInput) =>
      apiClient.adminCreateProduct(token as string, body),
    onSuccess: () => {
      toast.success("Product created");
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      setDialogOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: ProductInput }) =>
      apiClient.adminUpdateProduct(token as string, id, body),
    onSuccess: () => {
      toast.success("Product updated");
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      setDialogOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiClient.adminDeleteProduct(token as string, id),
    onSuccess: () => {
      toast.success("Product deleted");
      setDeleting(null);
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();
    if (!payload) return;
    if (editing) update.mutate({ id: editing.id, body: payload });
    else create.mutate(payload);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold" style={{ color: "#C9A84C", marginBottom: "0.5rem" }}>Products</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {products.length} product{products.length !== 1 ? "s" : ""} in catalog
          </p>
        </div>
        <button
          className="px-6 py-3 font-medium rounded-lg transition-all duration-200 min-h-[44px] flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: "#C9A84C", 
            color: "var(--bg-base)",
            border: "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#E5C876";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#C9A84C";
            e.currentTarget.style.transform = "scale(1)";
          }}
          onClick={openCreate}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="w-full lg:max-w-md">
        <div className="admin-search">
          <Search className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="admin-input"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="admin-product-card">
              <div className="admin-product-image">
                <div className="admin-skeleton" style={{ width: "100%", height: "100%" }} />
              </div>
              <div className="admin-product-info">
                <div className="admin-skeleton" style={{ height: "16px", marginBottom: "8px" }} />
                <div className="admin-skeleton" style={{ height: "12px", width: "60%" }} />
              </div>
            </div>
          ))}
        {!isLoading && filtered.length === 0 && (
          <div className="col-span-full admin-empty">
            <div className="admin-empty-icon">
              <Package className="w-12 h-12" />
            </div>
            <p>No products found</p>
          </div>
        )}
        {!isLoading &&
          filtered.map((p) => (
            <div 
              key={p.id} 
              className="admin-product-card"
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRadius: "14px",
                overflow: "hidden",
                transition: "all 0.2s ease",
                transform: "scale(1)"
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
              {/* Product Image */}
              <div className="admin-product-image" style={{ 
                height: "160px", 
                background: "var(--bg-surface)",
                position: "relative",
                overflow: "hidden"
              }}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center"
                    }}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                      // Show fallback icon
                      const fallback = document.createElement('div');
                      fallback.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted)"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>';
                      fallback.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);';
                      target.parentElement?.appendChild(fallback);
                    }}
                  />
                ) : (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "var(--text-muted)"
                  }}>
                    <Package size={48} />
                  </div>
                )}
              </div>

              {/* Product Content */}
              <div className="admin-product-info" style={{ padding: "1rem" }}>
                <h3 
                  className="admin-product-name" 
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
                  {p.name}
                </h3>
                <p 
                  className="admin-product-category" 
                  style={{ 
                    fontSize: "0.75rem", 
                    color: "var(--text-muted)", 
                    marginBottom: "0.75rem" 
                  }}
                >
                  {p.category?.name || "—"}
                </p>
                <p 
                  className="admin-product-price" 
                  style={{ 
                    fontSize: "1rem", 
                    fontWeight: "600", 
                    color: "#C9A84C",
                    fontFamily: "'DM Mono', monospace",
                    marginBottom: "1rem"
                  }}
                >
                  {formatINR(p.price)}
                </p>
                
                {/* Action Buttons */}
                <div className="admin-product-actions" style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    style={{
                      flex: 1,
                      borderColor: "#C9A84C",
                      color: "#C9A84C",
                      fontSize: "0.75rem",
                      minHeight: "36px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(201,168,76,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                    onClick={() => openEdit(p)}
                  >
                    <Pencil size={12} style={{ marginRight: "0.25rem" }} />
                    Edit
                  </button>
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    style={{
                      flex: 1,
                      borderColor: "rgba(192,57,43,0.3)",
                      color: "#F87171",
                      fontSize: "0.75rem",
                      minHeight: "36px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(192,57,43,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                    onClick={() => setDeleting(p)}
                  >
                    <Trash2 size={12} style={{ marginRight: "0.25rem" }} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {dialogOpen && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setDialogOpen(false);
        }}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button className="admin-modal-close" onClick={() => setDialogOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Name</label>
                  <input
                    className="admin-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Belgian Dark Box"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    className="admin-textarea"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="A short product description..."
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Price (₹)</label>
                    <input
                      className="admin-input"
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="2999"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <div className="admin-select">
                      <select
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Image URL</label>
                  <input
                    className="admin-input"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                  {form.image && (
                    <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden" }}>
                      <img
                        src={form.image}
                        alt="preview"
                        style={{ width: "100%", height: 100, objectFit: "contain" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={create.isPending || update.isPending}
                >
                  {editing
                    ? update.isPending
                      ? "Saving..."
                      : "Save Changes"
                    : create.isPending
                    ? "Creating..."
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleting && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setDeleting(null);
        }}>
          <div className="admin-modal" style={{ maxWidth: 400 }}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Delete Product?</h2>
              <button className="admin-modal-close" onClick={() => setDeleting(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ opacity: 0.8 }}>
                Are you sure you want to delete "{deleting.name}"? This action cannot be undone.
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

export default Products;