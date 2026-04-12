import { useState, useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { apiClient, type Category, type Product } from "@/lib/api";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import styles from "./Index.module.css"; // Reuse the css for now

const fallbackCategories: Category[] = [
  { id: 1, name: "Dark Chocolate" },
  { id: 2, name: "Milk Chocolate" },
  { id: 3, name: "White Chocolate" },
];

const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "Dark Truffle Collection",
    price: 2999,
    image: product1,
    description: "Handcrafted dark chocolate truffles with exotic flavors.",
    categoryId: 1,
    category: fallbackCategories[0],
  },
  {
    id: 2,
    name: "Milk Chocolate Elegance",
    price: 2499,
    image: product2,
    description: "Smooth milk chocolate infused with vanilla and caramel.",
    categoryId: 2,
    category: fallbackCategories[1],
  },
  {
    id: 3,
    name: "White Chocolate Bliss",
    price: 2799,
    image: product3,
    description: "Premium white chocolate with raspberry and pistachio.",
    categoryId: 3,
    category: fallbackCategories[2],
  },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: apiClient.getProducts,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: apiClient.getCategories,
  });

  const categories = categoriesQuery.data?.length ? categoriesQuery.data : fallbackCategories;
  const catalog = productsQuery.data?.length ? productsQuery.data : fallbackProducts;
  
  const normalizedSearch = deferredSearchTerm.trim().toLowerCase();
  const filteredProducts = catalog.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch) ||
      product.category.name.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: "8rem 2rem 4rem", maxWidth: "1280px", margin: "0 auto" }}>
      <section id="shop" className={styles.section} style={{ paddingTop: 0 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className={styles.sectionTitle} style={{ textAlign: "center" }}>Featured Collections</h1>
          <p className={styles.sectionSubtitle} style={{ textAlign: "center", marginBottom: "3rem" }}>
            Search the catalog, filter by category, and add premium selections straight into your cart.
          </p>
        </motion.div>

        <div className={styles.catalogToolbar}>
          <label className={styles.searchField}>
            <Search size={18} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by product, flavor, or category"
            />
          </label>

          <div className={styles.categoryPills}>
            <button
              className={selectedCategory === "all" ? styles.categoryActive : styles.categoryButton}
              onClick={() => setSelectedCategory("all")}
              type="button"
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={selectedCategory === category.id ? styles.categoryActive : styles.categoryButton}
                onClick={() => setSelectedCategory(category.id)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {productsQuery.isLoading ? <p className={styles.catalogState}>Loading catalog...</p> : null}
        {productsQuery.error ? <p className={styles.catalogNotice}>The API is unavailable right now, so bundled products are being shown.</p> : null}

        {filteredProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    description={product.description}
                    categoryName={product.category.name}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.catalogEmpty}>
            <ShoppingBag size={24} />
            <h3>No products match this filter</h3>
            <p>Try clearing the search or choosing another category.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;
