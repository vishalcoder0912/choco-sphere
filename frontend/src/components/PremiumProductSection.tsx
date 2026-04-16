import { useState } from "react";
import { motion } from "framer-motion";

interface PremiumProductSectionProps {
  className?: string;
}

const productImages = [
  "/chocolates/apple1.png",
  "/chocolates/apple2.png",
  "/chocolates/apple3.png",
  "/chocolates/apple4.png",
];

const PremiumProductSection = ({ className }: PremiumProductSectionProps) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <section
      className={className}
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1512 50%, #0d0b09 100%)",
        padding: "5rem 1.5rem",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          maxWidth: "1200px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "#f5e6d3",
              marginBottom: "1rem",
              fontFamily: "'Playfair Display', Georgia, serif",
              letterSpacing: "0.02em",
            }}
          >
            Apple Chocolate Delight
          </h2>
          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              color: "#a8927a",
              maxWidth: "540px",
              lineHeight: 1.7,
              fontFamily: "'Inter', -apple-system, sans-serif",
            }}
          >
            Luxury dark chocolate filled with apple caramel and topped with fruit cubes. 
            A perfect blend of richness and fruity sweetness.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.25rem",
            marginBottom: "2.5rem",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {productImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              onClick={() => setActiveImage(index)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{
                borderRadius: "1rem",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: activeImage === index 
                  ? "0 8px 32px rgba(201, 169, 118, 0.3)" 
                  : "0 4px 20px rgba(0, 0, 0, 0.4)",
                border: activeImage === index 
                  ? "2px solid #c9a976" 
                  : "2px solid transparent",
                transition: "all 0.3s ease",
              }}
            >
              <img
                src={image}
                alt={`Apple Chocolate ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  aspectRatio: "1",
                  transition: "transform 0.4s ease",
                }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#c9a976",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              ₹299
            </span>
            <span
              style={{
                fontSize: "1rem",
                color: "#6b5b4f",
                textDecoration: "line-through",
              }}
            >
              ₹499
            </span>
          </div>

          <motion.button
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 30px rgba(201, 169, 118, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "linear-gradient(135deg, #c9a976 0%, #a67c52 100%)",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "3rem",
              padding: "1rem 3rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontFamily: "'Inter', -apple-system, sans-serif",
              boxShadow: "0 4px 20px rgba(201, 169, 118, 0.3)",
            }}
          >
            Buy Now
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PremiumProductSection;