import { motion } from "framer-motion";
import { ChevronRight, Heart, Star, Sparkles, Gift, Truck, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ChocolateHero3D } from "@/components/ChocolateHero3D";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import styles from "./Index.module.css";

const featuredProducts = [
  {
    id: 1,
    name: "Dark Truffle Collection",
    price: 2999,
    image: product1,
    description: "Handcrafted dark chocolate truffles with exotic flavors",
  },
  {
    id: 2,
    name: "Milk Chocolate Elegance",
    price: 2499,
    image: product2,
    description: "Smooth milk chocolate infused with vanilla and caramel",
  },
  {
    id: 3,
    name: "White Chocolate Bliss",
    price: 2799,
    image: product3,
    description: "Premium white chocolate with raspberry and pistachio",
  },
];

const features = [
  { icon: Gift, title: "Gift Wrapping", text: "Luxury packaging with personalized notes for every occasion." },
  { icon: Truck, title: "Free Shipping", text: "Complimentary delivery on all orders over $50, worldwide." },
  { icon: ShieldCheck, title: "Quality Guaranteed", text: "Only the finest cocoa beans, ethically sourced from around the globe." },
];

const testimonials = [
  { text: "The most exquisite chocolates I've ever tasted. Every bite is pure luxury.", name: "Isabella R.", role: "Food Critic", initials: "IR" },
  { text: "ChocoVerse has ruined all other chocolate for me — in the best way possible.", name: "Marcus L.", role: "Chocolate Enthusiast", initials: "ML" },
  { text: "Beautifully crafted and delivered with such care. A true artisan experience.", name: "Sophia K.", role: "Loyal Customer", initials: "SK" },
];

const marqueeItems = ["Handcrafted with Love", "Ethically Sourced", "Premium Cocoa", "Artisan Quality", "Luxury Experience", "Small Batch", "Made Fresh Daily", "Gift Ready"];

const Index = () => {
  return (
    <div className={styles.page}>
      <Header />
      
      {/* Hero Section */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroParticles}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.particle} />
          ))}
        </div>

        <div className={styles.heroContent}>
          <motion.span
            className={styles.heroTagline}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={14} style={{ marginRight: 6, display: 'inline' }} />
            Artisan Chocolate Since 2020
          </motion.span>

          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Experience Luxury in Every Bite
          </motion.h1>
          
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Artisan chocolates crafted with passion, presented with elegance — where every flavor tells a story
          </motion.p>
          
          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <motion.button
              className={styles.heroCta}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Collection
              <ChevronRight size={18} />
            </motion.button>
            <motion.button
              className={styles.heroCtaSecondary}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Our Story
              <Heart size={16} />
            </motion.button>
          </motion.div>
        </div>
        
        <ChocolateHero3D />
      </section>

      {/* Marquee */}
      <div className={styles.marqueeSection}>
        <div className={styles.marqueeTrack}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              <span className={styles.marqueeDot} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <section id="shop" className={styles.section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Featured Collections</h2>
          <p className={styles.sectionSubtitle}>
            Discover our most beloved chocolate creations, handpicked for you
          </p>
        </motion.div>
        
        <div className={styles.productsGrid}>
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Why ChocoVerse</h2>
          <p className={styles.sectionSubtitle}>
            We go above and beyond to deliver a premium chocolate experience
          </p>
        </motion.div>

        <div className={styles.featuresGrid}>
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className={styles.featureIcon}>
                <feat.icon size={24} />
              </div>
              <h3 className={styles.featureTitle}>{feat.title}</h3>
              <p className={styles.featureText}>{feat.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
          <p className={styles.sectionSubtitle}>
            Join thousands of chocolate lovers who trust ChocoVerse
          </p>
        </motion.div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className={styles.testimonialCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className={styles.testimonialQuote}>"</div>
              <p className={styles.testimonialText}>{t.text}</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>{t.initials}</div>
                <div>
                  <div className={styles.testimonialName}>{t.name}</div>
                  <div className={styles.testimonialRole}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.storySection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Our Story</h2>
        </motion.div>
        <motion.div 
          className={styles.story}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.storyTitle}>A Passion for Perfection</h2>
          <p className={styles.storyText}>
            At ChocoVerse, we believe chocolate is more than just a treat—it's an experience, 
            a journey through flavors, textures, and emotions. Our master chocolatiers pour 
            their hearts into every creation, blending traditional techniques with innovative 
            flavors to craft chocolates that tell a story. Each piece is a testament to our 
            commitment to quality, sustainability, and the art of chocolate making.
          </p>
        </motion.div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className={styles.ctaTitle}>Ready to Indulge?</h2>
          <p className={styles.ctaText}>
            Subscribe to our newsletter and get 15% off your first order, plus early access to new collections.
          </p>
          <motion.button
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Star size={18} />
            Shop Now
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>ChocoVerse</div>
        <p className={styles.footerText}>© 2025 ChocoVerse. Crafted with love and cocoa.</p>
      </footer>
    </div>
  );
};

export default Index;
