import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

export function ImageGallery({ images, alt = "Product image" }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        {/* Main Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1/1",
            borderRadius: "1.5rem",
            overflow: "hidden",
            background: "var(--card)",
          }}
        >
          <motion.img
            key={selectedIndex}
            src={images[selectedIndex]}
            alt={`${alt} ${String(selectedIndex + 1)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.95)",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(-50%) scale(1)"}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNext}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.95)",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(-50%) scale(1)"}
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Zoom Button */}
          <button
            onClick={() => openLightbox(selectedIndex)}
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255, 255, 255, 0.95)",
              color: "var(--foreground)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            aria-label="Zoom image"
          >
            <ZoomIn size={18} />
          </button>

          {/* Image Counter */}
          {images.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "99px",
                background: "rgba(0, 0, 0, 0.6)",
                color: "white",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1rem",
              overflowX: "auto",
              paddingBottom: "0.5rem",
              scrollbarWidth: "none",
            }}
          >
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                style={{
                  flex: "0 0 auto",
                  width: "80px",
                  height: "80px",
                  borderRadius: "var(--radius)",
                  border: selectedIndex === index ? "2px solid var(--primary)" : "2px solid transparent",
                  padding: 0,
                  background: "transparent",
                  cursor: "pointer",
                  opacity: selectedIndex === index ? 1 : 0.6,
                  transition: "all 0.2s",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = String(selectedIndex === index ? 1 : 0.8)}
                onMouseLeave={(e) => e.currentTarget.style.opacity = String(selectedIndex === index ? 1 : 0.6)}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${alt} ${String(index + 1)}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLightbox}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.95)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <motion.img
              key={selectedIndex}
              src={images[selectedIndex]}
              alt={`${alt} ${String(selectedIndex + 1)}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "var(--radius)",
              }}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            <div
              style={{
                position: "absolute",
                bottom: "2rem",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "0.5rem 1rem",
                borderRadius: "99px",
                background: "rgba(0, 0, 0, 0.6)",
                color: "white",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
