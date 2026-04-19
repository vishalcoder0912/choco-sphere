import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  categoryName?: string;
}

export const ProductCard = ({ id, name, price, image, description, categoryName }: ProductCardProps) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const items = useCartStore((state) => state.items);
  const [imageLoaded, setImageLoaded] = useState(false);

  const cartItem = items.find((item) => item.id === id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id, name, price, image, description });
    toast.success("Added to cart", {
      description: `${name} has been added to your cart.`,
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id, name, price, image, description });
    toast.success("Added +1", {
      description: `${name} × ${quantity + 1}`,
      duration: 800,
    });
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity === 1) {
      removeItem(id);
      toast.success("Removed from cart", {
        description: `${name} has been removed from your cart.`,
      });
    } else {
      updateQuantity(id, quantity - 1);
      toast.success("Removed -1", {
        description: `${name} × ${quantity - 1}`,
        duration: 800,
      });
    }
  };

  const handleNavigate = () => {
    navigate(`/products/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={styles.card}
    >
      <div className={styles.imageWrapper} onClick={handleNavigate} style={{ cursor: 'pointer' }}>
        {!imageLoaded && <div className={styles.skeleton} />}
        <motion.img
          src={image}
          alt={name}
          className={`${styles.image} ${imageLoaded ? styles.imageLoaded : ''}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <div className={styles.overlay} />
      </div>
      
      <div className={styles.content}>
        {categoryName ? <span className={styles.categoryBadge}>{categoryName}</span> : null}
        <h3 className={styles.title} onClick={handleNavigate} style={{ cursor: 'pointer' }}>{name}</h3>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        <div className={styles.priceRow}>
          <span className={styles.price}>
            ₹{(price / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      
      <div className={styles.footer}>
        {quantity === 0 ? (
          <motion.button
            onClick={handleAddToCart}
            className={styles.addButton}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ShoppingCart className={styles.icon} />
            Add to Cart
          </motion.button>
        ) : (
          <motion.div
            className={styles.quantityControl}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDecrement}
              className={styles.quantityButton}
              aria-label="Decrease quantity"
            >
              <Minus className={styles.quantityIcon} />
            </button>
            <span className={styles.quantity}>{quantity}</span>
            <button
              onClick={handleIncrement}
              className={styles.quantityButton}
              aria-label="Increase quantity"
            >
              <Plus className={styles.quantityIcon} />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
