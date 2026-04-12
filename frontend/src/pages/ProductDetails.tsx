import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag, ArrowLeft } from "lucide-react";
import { apiClient, type Product } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const fallbackProducts: Product[] = [
  { id: 1, name: "Dark Truffle Collection", price: 2999, image: product1, description: "Handcrafted dark chocolate truffles with exotic flavors.", categoryId: 1, category: { id: 1, name: "Dark Chocolate" } },
  { id: 2, name: "Milk Chocolate Elegance", price: 2499, image: product2, description: "Smooth milk chocolate infused with vanilla and caramel.", categoryId: 2, category: { id: 2, name: "Milk Chocolate" } },
  { id: 3, name: "White Chocolate Bliss", price: 2799, image: product3, description: "Premium white chocolate with raspberry and pistachio.", categoryId: 3, category: { id: 3, name: "White Chocolate" } },
];

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0", 10);
  const addItem = useCartStore((state) => state.addItem);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: apiClient.getProducts,
  });

  const catalog = productsQuery.data?.length ? productsQuery.data : fallbackProducts;
  const product = catalog.find((p) => p.id === productId);

  if (productsQuery.isLoading) {
    return <div style={{ padding: "8rem 2rem", textAlign: "center" }}>Loading product...</div>;
  }

  if (!product) {
    return (
      <div style={{ padding: "8rem 2rem", textAlign: "center" }}>
        <h2>Product not found</h2>
        <Link to="/products" style={{ color: "var(--primary)", textDecoration: "none", marginTop: "1rem", display: "inline-block" }}>
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div style={{ padding: "8rem 2rem 4rem", maxWidth: "1280px", margin: "0 auto" }}>
      <Link to="/products" style={{ display: "inline-flex", alignItems: "center", color: "var(--muted-foreground)", textDecoration: "none", marginBottom: "3rem", fontSize: "0.9rem", fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}>
        <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
        Back to Catalog
      </Link>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "start" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ width: "100%", borderRadius: "1.5rem", overflow: "hidden", aspectRatio: "1/1", background: "var(--card)" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <span style={{ textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.1em", fontWeight: 600, color: "var(--primary)" }}>
              {product.category.name}
            </span>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, margin: "0.5rem 0", lineHeight: 1.2 }}>{product.name}</h1>
            <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--foreground)" }}>
              ${(product.price / 100).toFixed(2)}
            </div>
          </div>

          <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "var(--muted-foreground)", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
            {product.description}
          </p>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                padding: "1.25rem",
                borderRadius: "99rem",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                fontWeight: 600,
                fontSize: "1.1rem",
                cursor: "pointer",
                border: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
