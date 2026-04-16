import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface FilterPanelProps {
  categories: Category[];
  selectedCategories: number[];
  onCategoryToggle: (categoryId: number) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
  minPrice: number;
  maxPrice: number;
}

export function FilterPanel({
  categories,
  selectedCategories,
  onCategoryToggle,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
  minPrice,
  maxPrice,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (index: 0 | 1, value: string) => {
    const numValue = parseInt(value) || 0;
    const newRange: [number, number] = [...priceRange];
    newRange[index] = numValue;
    
    // Ensure min doesn't exceed max and vice versa
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[0] = newRange[1];
    }
    if (index === 1 && newRange[1] < newRange[0]) {
      newRange[1] = newRange[0];
    }
    
    onPriceRangeChange(newRange);
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceRange[0] > minPrice || priceRange[1] < maxPrice;

  return (
    <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: "1.5rem", border: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.5rem 0.75rem",
              background: "transparent",
              color: "var(--muted-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--secondary)";
              e.currentTarget.style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--muted-foreground)";
            }}
          >
            <X size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          onClick={() => toggleSection("categories")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 0",
            background: "transparent",
            border: "none",
            color: "var(--foreground)",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <span>Categories</span>
          {expandedSections.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {expandedSections.categories && (
          <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {categories.map((category) => (
              <label
                key={category.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--secondary)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => onCategoryToggle(category.id)}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "var(--primary)",
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: "0.9rem", color: "var(--foreground)" }}>{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 0",
            background: "transparent",
            border: "none",
            color: "var(--foreground)",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <span>Price Range</span>
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {expandedSections.price && (
          <div style={{ marginTop: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginBottom: "0.25rem", display: "block" }}>
                  Min: ₹{(priceRange[0] / 100).toFixed(0)}
                </label>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginBottom: "0.25rem", display: "block" }}>
                  Max: ₹{(priceRange[1] / 100).toFixed(0)}
                </label>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
              <span>₹{(priceRange[0] / 100).toFixed(0)}</span>
              <span>—</span>
              <span>₹{(priceRange[1] / 100).toFixed(0)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
