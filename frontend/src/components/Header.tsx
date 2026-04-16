import { useState } from "react";
import { LogOut, Menu, Moon, ShoppingCart, Sun, UserRound, X, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useThemeStore } from "@/store/themeStore";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Header.module.css";

interface HeaderProps {
  isAuthenticated: boolean;
  isAdmin?: boolean;
  userName?: string;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header = ({ isAuthenticated, isAdmin, userName, onOpenCart, onOpenAuth, onLogout }: HeaderProps) => {
  const cartCount = useCartStore((state) => state.totalItems());
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
              NOIRSANE
            </motion.h1>
            <nav className={styles.nav}>
              <Link to="/" className={styles.navLink}>Home</Link>
              <Link to="/products" className={styles.navLink}>Shop</Link>
              <Link to="/account" className={styles.navLink}>Orders</Link>
              {isAdmin && (
                <Link to="/admin" className={styles.navLink} style={{ color: "#f59e0b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <LayoutDashboard size={14} />
                  Admin
                </Link>
              )}
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

            {isAuthenticated ? (
              <>
                <div className={styles.userPill}>
                  <UserRound size={16} />
                  <span>{userName}</span>
                </div>
                <button className={styles.accountButton} onClick={onLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button className={styles.accountButton} onClick={onOpenAuth}>
                <UserRound size={16} />
                <span>Sign In</span>
              </button>
            )}

            <button className={styles.cartButton} onClick={onOpenCart}>
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
                <span className={styles.mobileNavLogo}>NOIRSANE</span>
              </div>
              <div className={styles.mobileNavLinks}>
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Shop', path: '/products' },
                  { name: 'Orders', path: '/account' }
                ].map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                  >
                    <Link
                      to={item.path}
                      className={styles.mobileNavLink}
                      onClick={closeMobile}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className={styles.mobileNavFooter}>
                <button
                  className={styles.mobileAction}
                  onClick={() => {
                    closeMobile();
                    if (isAuthenticated) {
                      onLogout();
                      return;
                    }

                    onOpenAuth();
                  }}
                >
                  {isAuthenticated ? "Logout" : "Sign In"}
                </button>
                <p className={styles.mobileNavFooterText}>Crafted with love & cocoa</p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
