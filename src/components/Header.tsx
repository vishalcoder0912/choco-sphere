import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";

export const Header = () => {
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <motion.h1 
            className="text-2xl md:text-3xl font-serif font-bold text-gradient-gold"
            whileHover={{ scale: 1.05 }}
          >
            ChocoVerse
          </motion.h1>
          <nav className="hidden md:flex gap-6">
            <a href="#home" className="text-foreground hover:text-gold transition-smooth">Home</a>
            <a href="#shop" className="text-foreground hover:text-gold transition-smooth">Shop</a>
            <a href="#about" className="text-foreground hover:text-gold transition-smooth">About</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gold text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold"
              >
                {cartCount}
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
