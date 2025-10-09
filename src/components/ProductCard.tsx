import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export const ProductCard = ({ id, name, price, image, description }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({ id, name, price, image });
    toast.success("Added to cart", {
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden shadow-card hover:shadow-luxury transition-smooth border-border">
        <div className="relative overflow-hidden group">
          <motion.img
            src={image}
            alt={name}
            className="w-full h-64 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
        </div>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-serif font-semibold mb-2">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gradient-gold">
              ${(price / 100).toFixed(2)}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full luxury-gradient hover:opacity-90 transition-smooth text-primary-foreground"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
