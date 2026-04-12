import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
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
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({ id, name, price, image, description });
    toast.success("Added to cart", {
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={styles.card}
    >
      <div className={styles.imageWrapper}>
        <motion.img
          src={image}
          alt={name}
          className={styles.image}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <div className={styles.overlay} />
      </div>
      
      <div className={styles.content}>
        {categoryName ? <span className={styles.categoryBadge}>{categoryName}</span> : null}
        <h3 className={styles.title}>{name}</h3>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        <div className={styles.priceRow}>
          <span className={styles.price}>
            ${(price / 100).toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className={styles.footer}>
        <button
          onClick={handleAddToCart}
          className={styles.addButton}
        >
          <ShoppingCart className={styles.icon} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};
