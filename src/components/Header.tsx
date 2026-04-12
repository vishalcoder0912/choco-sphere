import { useState } from "react";
import { ShoppingCart, Menu, X, Sun, Moon } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useThemeStore } from "@/store/themeStore";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Header.module.css";

export const Header = () => {
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const { isDark, toggle } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={styles.header}
      >
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <motion.h1 
              className={styles.logo}
              whileHover={{ scale: 1.05 }}
            >
              ChocoVerse
            </motion.h1>
            <nav className={styles.nav}>
              <a href="#home" className={styles.navLink}>Home</a>
              <a href="#shop" className={styles.navLink}>Shop</a>
              <a href="#about" className={styles.navLink}>About</a>
            </nav>
          </div>

          <div className={styles.actions}>
            <motion.button
              className={styles.themeButton}
              onClick={toggle}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: 'flex' }}
                  >
                    <Sun size={19} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: 'flex' }}
                  >
                    <Moon size={19} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <button className={styles.cartButton}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={styles.cartBadge}
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
            <button
              className={styles.menuButton}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMobile}
            />
            <motion.nav
              className={styles.mobileNav}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            >
              <div className={styles.mobileNavHeader}>
                <span className={styles.mobileNavLogo}>ChocoVerse</span>
              </div>
              <div className={styles.mobileNavLinks}>
                {['Home', 'Shop', 'About'].map((item, i) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={styles.mobileNavLink}
                    onClick={closeMobile}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
              <div className={styles.mobileNavFooter}>
                <p className={styles.mobileNavFooterText}>Crafted with love & cocoa</p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
