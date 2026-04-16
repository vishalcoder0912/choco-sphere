import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, CheckCircle, ImageIcon, Loader2, AlertCircle, Edit2, Trash2, X, Package } from "lucide-react";
import { toast } from "sonner";
import { apiClient, type Category } from "@/lib/api";

// Fallback categories if API fails
const fallbackCategories = [
  { id: 1, name: "Dark Chocolate" },
  { id: 2, name: "Milk Chocolate" },
  { id: 3, name: "White Chocolate" },
  { id: 4, name: "Ruby Chocolate" },
  { id: 5, name: "Truffles" },
  { id: 6, name: "Nutty Chocolate" },
  { id: 7, name: "Fruit Chocolate" },
  { id: 8, name: "Spiced Chocolate" },
  { id: 9, name: "Organic & Fair Trade" },
  { id: 10, name: "Sugar-Free" },
];

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

const MAX_ADDITIONAL_IMAGES = 4;

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  image: string;
  images: string[];
  categoryId: string;
  stock: string;
  badge: string;
};

const createEmptyForm = (): ProductFormState => ({
  name: "",
  description: "",
  price: "",
  image: "",
  images: [],
  categoryId: "",
  stock: "",
  badge: "",
});

const normalizeImageList = (primaryImage: string, galleryImages: string[]) => {
  const uniqueImages = [primaryImage, ...galleryImages]
    .map((image) => image.trim())
    .filter(Boolean)
    .filter((image, index, array) => array.indexOf(image) === index);

  return {
    primaryImage: uniqueImages[0] ?? "",
    galleryImages: uniqueImages.slice(1, MAX_ADDITIONAL_IMAGES + 1),
  };
};

const getAllImages = (form: ProductFormState) => {
  const { primaryImage, galleryImages } = normalizeImageList(form.image, form.images);
  return [primaryImage, ...galleryImages].filter(Boolean);
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve((event.target?.result as string) || "");
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });

const ProductsPage = () => {
  const [form, setForm] = useState<ProductFormState>(createEmptyForm());
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: apiCategories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: apiClient.getCategories,
  });

  const { data: products = [], isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/products`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      return data.data || [];
    },
  });

  const categories = apiCategories.length > 0 ? apiCategories : fallbackCategories;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const invalidType = files.find((file) => !file.type.startsWith("image/"));
    if (invalidType) {
      toast.error("Please select an image file");
      return;
    }

    const oversizedFile = files.find((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFile) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      const uploadedImages = await Promise.all(files.map(readFileAsDataUrl));

      setForm((currentForm) => {
        const allImages = getAllImages(currentForm);
        const remainingSlots = MAX_ADDITIONAL_IMAGES + 1 - allImages.length;

        if (remainingSlots <= 0) {
          toast.error(`You can add up to ${MAX_ADDITIONAL_IMAGES + 1} total images`);
          return currentForm;
        }

        const nextImages = [...allImages, ...uploadedImages.slice(0, remainingSlots)];
        const { primaryImage, galleryImages } = normalizeImageList(nextImages[0] ?? "", nextImages.slice(1));
        return { ...currentForm, image: primaryImage, images: galleryImages };
      });

      if (files.length > MAX_ADDITIONAL_IMAGES + 1) {
        toast.success(`Added ${MAX_ADDITIONAL_IMAGES + 1} images`);
      } else {
        toast.success(`Added ${uploadedImages.length} image${uploadedImages.length === 1 ? "" : "s"}`);
      }
    } catch {
      toast.error("Failed to read image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setForm((currentForm) => {
      const newImages = [...currentForm.images];
      newImages.splice(index, 1);
      return { ...currentForm, images: newImages };
    });
  };

  const removeMainImage = () => {
    setForm((currentForm) => {
      const [nextPrimary = "", ...remainingImages] = currentForm.images;
      return {
        ...currentForm,
        image: nextPrimary,
        images: remainingImages,
      };
    });
  };

  const setPrimaryImage = (image: string) => {
    setForm((currentForm) => {
      const allImages = getAllImages(currentForm).filter((currentImage) => currentImage !== image);
      const { primaryImage, galleryImages } = normalizeImageList(image, allImages);
      return { ...currentForm, image: primaryImage, images: galleryImages };
    });
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const allImages = getAllImages(form);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseInt(form.price) * 100,
          stock: parseInt(form.stock) || 0,
          image: allImages[0],
          images: allImages,
          categoryId: parseInt(form.categoryId),
          badge: form.badge || null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create product");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Product added to the store! 🍫");
      setSuccess(true);
      setForm(createEmptyForm());
      refetchProducts();
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create product"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      const allImages = getAllImages(form);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/products/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseInt(form.price) * 100,
          image: allImages[0],
          images: allImages,
          categoryId: parseInt(form.categoryId),
          stock: parseInt(form.stock),
          badge: form.badge || null,
        }),
      });
      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Product updated successfully! 🍫");
      setSuccess(true);
      resetForm();
      setIsEditing(false);
      setEditingId(null);
      refetchProducts();
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/products/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      refetchProducts();
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete product"),
  });

  const handleEdit = (product: any) => {
    const normalizedImages = normalizeImageList(product.image || "", Array.isArray(product.images) ? product.images : []);
    setIsEditing(true);
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: (product.price / 100).toString(),
      image: normalizedImages.primaryImage,
      images: normalizedImages.galleryImages,
      categoryId: product.categoryId.toString(),
      stock: (product.stock || 0).toString(),
      badge: product.badge || "",
    });
  };

  const handleDelete = (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(productId);
    }
  };

  const resetForm = () => {
    setForm(createEmptyForm());
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Products</h2>
          <p style={{ color: "var(--muted-foreground)", margin: 0 }}>Manage your store catalog</p>
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
            <Plus size={16} /> Add Product
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
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{editingId ? "Edit Product" : "Add New Product"}</h3>
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
                  <CheckCircle size={16} /> Product {editingId ? "updated" : "added"} successfully!
                </motion.div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Product Name *</label>
            <input required name="name" value={form.name} onChange={handleChange} placeholder="e.g. Belgian Dark Box" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Description *</label>
            <textarea
              required name="description" value={form.description}
              onChange={handleChange as any}
              placeholder="A short product description..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Price (₹) *</label>
              <input required type="number" min="0.01" step="0.01" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 2999" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Stock *</label>
              <input required type="number" min="0" name="stock" value={form.stock} onChange={handleChange} placeholder="e.g. 100" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Category *</label>
              <div style={{ position: "relative" }}>
                <select
                  required
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  disabled={categoriesLoading}
                  style={{ ...inputStyle, cursor: categoriesLoading ? "not-allowed" : "pointer", paddingRight: categoriesLoading ? "2.5rem" : "0.9rem" }}
                >
                  <option value="">{categoriesLoading ? "Loading..." : "Select category"}</option>
                  {categories.map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {categoriesLoading && (
                  <Loader2 size={16} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", animation: "spin 1s linear infinite", color: "var(--muted-foreground)" }} />
                )}
              </div>
              {categoriesError && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.35rem", fontSize: "0.75rem", color: "#f59e0b" }}>
                  <AlertCircle size={12} />
                  <span>Using fallback categories (API unavailable)</span>
                </div>
              )}
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>Badge (Optional)</label>
              <input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. New, Best Seller" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.35rem" }}>
              <ImageIcon size={14} style={{ display: "inline", marginRight: "0.35rem" }} />
              Product Images *
            </label>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ cursor: "pointer", display: "inline-block" }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  disabled={getAllImages(form).length >= MAX_ADDITIONAL_IMAGES + 1}
                />
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1rem",
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  borderRadius: "0.5rem",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}>
                  {uploadingImage ? <Loader2 size={14} className="spin" /> : <ImageIcon size={14} />}
                  {uploadingImage ? "Uploading..." : "Choose Images"}
                </div>
              </label>
            </div>
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
              Select up to {MAX_ADDITIONAL_IMAGES + 1} images at once. The first image will be used as the primary image.
            </p>
            {form.images.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {form.images.map((img, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    <img
                      src={img}
                      alt={`Additional ${idx + 1}`}
                      style={{ width: "80px", height: "80px", borderRadius: "0.5rem", objectFit: "cover", border: "1px solid var(--border)" }}
                      onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                    />
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(img)}
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        left: "4px",
                        background: "rgba(0,0,0,0.65)",
                        border: "none",
                        borderRadius: "999px",
                        color: "white",
                        fontSize: "10px",
                        padding: "0.2rem 0.4rem",
                        cursor: "pointer",
                      }}
                    >
                      Make primary
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      style={{
                        position: "absolute", top: "-6px", right: "-6px", width: "18px", height: "18px",
                        background: "#ef4444", border: "none", borderRadius: "50%", color: "white", fontSize: "10px",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {form.image && (
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "0.5rem" }}>
                Gallery Preview ({getAllImages(form).length} image{getAllImages(form).length === 1 ? "" : "s"})
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.75rem" }}>
                {getAllImages(form).map((image, index) => (
                  <div key={`${image}-${index}`} style={{ position: "relative" }}>
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                      style={{ width: "100%", height: "110px", objectFit: "cover", borderRadius: "0.5rem", border: "1px solid var(--border)" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: "0.5rem",
                        bottom: "0.5rem",
                        background: "rgba(0,0,0,0.65)",
                        color: "white",
                        borderRadius: "999px",
                        padding: "0.2rem 0.45rem",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      {index === 0 ? "Primary" : `Image ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : (editingId ? "Update Product" : "Add Product to Store")}
          </button>
        </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product List */}
      {!isEditing && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Package size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Product Catalog</h3>
          </div>

          {productsLoading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
              <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
              <Package size={48} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
              <p>No products yet. Add your first product!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {products.map((product: any) => (
                <div
                  key={product.id}
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
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "0.5rem" }}
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>{product.name}</p>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                      ₹{(product.price / 100).toFixed(2)} · Stock: {product.stock || 0}
                    </p>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                      {(Array.isArray(product.images) && product.images.length > 0 ? product.images.length : 1)} image option(s)
                    </p>
                    {product.badge && (
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.15rem 0.4rem",
                        borderRadius: "99px",
                        background: "#f59e0b22",
                        color: "#f59e0b",
                      }}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEdit(product)}
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
                      onClick={() => handleDelete(product.id)}
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

export default ProductsPage;
