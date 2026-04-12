import { motion } from "framer-motion";
import { ChevronRight, Gift, Heart, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { ChocolateHero3D } from "@/components/ChocolateHero3D";
import { useAuthStore } from "@/store/authStore";
import styles from "./Index.module.css";



const features = [
  { icon: Gift, title: "Gift Wrapping", text: "Luxury packaging with personalized notes for every occasion." },
  { icon: Truck, title: "Free Shipping", text: "Complimentary delivery on all orders over $50, worldwide." },
  { icon: ShieldCheck, title: "Quality Guaranteed", text: "Only the finest cocoa beans, ethically sourced from around the globe." },
];

const testimonials = [
  { text: "The most exquisite chocolates I've ever tasted. Every bite is pure luxury.", name: "Isabella R.", role: "Food Critic", initials: "IR" },
  { text: "ChocoVerse has ruined all other chocolate for me in the best way possible.", name: "Marcus L.", role: "Chocolate Enthusiast", initials: "ML" },
  { text: "Beautifully crafted and delivered with such care. A true artisan experience.", name: "Sophia K.", role: "Loyal Customer", initials: "SK" },
];

const marqueeItems = [
  "Handcrafted with Love",
  "Ethically Sourced",
  "Premium Cocoa",
  "Artisan Quality",
  "Luxury Experience",
  "Small Batch",
  "Made Fresh Daily",
  "Gift Ready",
];

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Index = () => {
  const { user } = useAuthStore();

  return (
    <div className={styles.page}>

      <section id="home" className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroParticles}>
          {[...Array(8)].map((_, index) => (
            <div key={index} className={styles.particle} />
          ))}
        </div>

        <div className={styles.heroContent}>
          <motion.span
            className={styles.heroTagline}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={14} style={{ marginRight: 6, display: "inline" }} />
            Artisan Chocolate Since 2020
          </motion.span>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            A complete chocolate storefront, now ready to shop
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Browse curated collections, build your cart, sign in securely, and place real orders through the new backend.
          </motion.p>

          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <Link to="/products" style={{ textDecoration: 'none' }}>
              <motion.button className={styles.heroCta} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                Shop Collections
                <ChevronRight size={18} />
              </motion.button>
            </Link>
            <Link to="/account" style={{ textDecoration: 'none' }}>
              <motion.button
                className={styles.heroCtaSecondary}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {user ? "View Orders" : "Join ChocoVerse"}
                <Heart size={16} />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <ChocolateHero3D />
      </section>

      <div className={styles.marqueeSection}>
        <div className={styles.marqueeTrack}>
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={index} className={styles.marqueeItem}>
              <span className={styles.marqueeDot} />
              {item}
            </span>
          ))}
        </div>
      </div>


      <section className={styles.featuresSection}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Why ChocoVerse</h2>
          <p className={styles.sectionSubtitle}>
            The visual identity stays premium, but the experience now behaves like a complete storefront.
          </p>
        </motion.div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <div className={styles.featureIcon}>
                <feature.icon size={24} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>



      <section className={styles.testimonialsSection}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
          <p className={styles.sectionSubtitle}>Join chocolate lovers who expect both premium taste and premium experience.</p>
        </motion.div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className={styles.testimonialCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <div className={styles.testimonialQuote}>"</div>
              <p className={styles.testimonialText}>{testimonial.text}</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>{testimonial.initials}</div>
                <div>
                  <div className={styles.testimonialName}>{testimonial.name}</div>
                  <div className={styles.testimonialRole}>{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="about" className={styles.storySection}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
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
          <h2 className={styles.storyTitle}>A passion for perfection</h2>
          <p className={styles.storyText}>
            At ChocoVerse, chocolate is more than a treat. It is a layered experience of flavor, texture, gifting, and emotion. This storefront now reflects that same standard on the technical side as well, with a modular backend and a frontend designed for real shopping, not only presentation.
          </p>
        </motion.div>
      </section>


    </div>
  );
};

export default Index;
