import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { ChocolateHero3D } from "@/components/ChocolateHero3D";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Award, Heart } from "lucide-react";
import heroImage from "@/assets/hero-chocolate.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const featuredProducts = [
  {
    id: 1,
    name: "Artisan Truffle Collection",
    price: 4900,
    image: product1,
    description: "Handcrafted truffles with exotic flavors and gold accents",
  },
  {
    id: 2,
    name: "Dark Sea Salt Chocolate",
    price: 2900,
    image: product2,
    description: "70% cacao with Himalayan pink salt crystals",
  },
  {
    id: 3,
    name: "Premium Gift Box",
    price: 7900,
    image: product3,
    description: "Curated selection in luxury presentation box",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6"
              >
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium text-gold">Handcrafted Luxury</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
                Indulge in{" "}
                <span className="text-gradient-gold">Pure Elegance</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Discover our exquisite collection of artisanal chocolates, crafted with the finest ingredients and adorned with edible gold. Each piece is a masterwork of flavor and beauty.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" className="group">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg">
                  Our Story
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-chocolate/20 blur-3xl animate-pulse" />
              <ChocolateHero3D />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Premium Quality",
                description: "Single-origin cacao from the world's finest plantations",
              },
              {
                icon: Heart,
                title: "Handcrafted",
                description: "Every piece meticulously crafted by master chocolatiers",
              },
              {
                icon: Sparkles,
                title: "Luxury Experience",
                description: "Elegant packaging perfect for gifting or indulgence",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-4">
                  <feature.icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="shop" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our signature chocolates, each one a testament to craftsmanship and indulgence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="luxury" size="lg">
              View All Products
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section id="about" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={heroImage}
                alt="Artisan chocolate making"
                className="rounded-2xl shadow-luxury w-full h-[500px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Crafted with{" "}
                <span className="text-gradient-gold">Passion</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                For over two decades, we've been perfecting the art of chocolate making. Our master chocolatiers source the finest cacao beans from sustainable farms around the world.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Each creation is a harmonious blend of tradition and innovation, resulting in chocolates that delight the senses and create unforgettable moments.
              </p>
              <Button variant="hero" size="lg">
                Discover Our Journey
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-gradient-gold mb-4">
              ChocoVerse
            </h2>
            <p className="text-muted-foreground mb-6">
              Where artistry meets indulgence
            </p>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-gold transition-smooth">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-smooth">Terms of Service</a>
              <a href="#" className="hover:text-gold transition-smooth">Contact Us</a>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              © 2025 ChocoVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
