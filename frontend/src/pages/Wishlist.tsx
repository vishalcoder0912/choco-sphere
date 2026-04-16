import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

const Wishlist = () => {
  const { items: wishlistItems, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.name} added to cart`);
  };

  const handleRemoveItem = (id: number, name: string) => {
    removeItem(id);
    toast.info(`${name} removed from wishlist`);
  };

  const handleClearAll = () => {
    clearWishlist();
    toast.info("Wishlist cleared");
  };

  if (wishlistItems.length === 0) {
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
            <Heart size={48} style={{ color: "var(--muted-foreground)" }} />
          </motion.div>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
            Your wishlist is empty
          </h2>
          <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>
            Save your favorite chocolates for later
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
              transition: "opacity 0.2s",
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, margin: 0 }}>
            My Wishlist
          </h1>
          <button
            onClick={handleClearAll}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "transparent",
              color: "var(--muted-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--secondary)";
              e.currentTarget.style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--muted-foreground)";
            }}
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
        <p style={{ color: "var(--muted-foreground)" }}>
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
        {wishlistItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            style={{
              background: "var(--card)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div style={{ position: "relative", aspectRatio: "1/1", background: "var(--secondary)" }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                onClick={() => handleRemoveItem(item.id, item.name)}
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.95)",
                  color: "var(--destructive)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                aria-label="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div style={{ padding: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", lineHeight: 1.3 }}>
                {item.name}
              </h3>
              {item.description && (
                <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "0.75rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {item.description}
                </p>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  ₹{(item.price / 100).toFixed(2)}
                </span>
                <button
                  onClick={() => handleAddToCart(item)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    border: "none",
                    borderRadius: "99rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
