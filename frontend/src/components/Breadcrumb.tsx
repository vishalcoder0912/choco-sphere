import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
      <Link 
        to="/" 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "0.25rem",
          color: "var(--muted-foreground)", 
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--foreground)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted-foreground)"}
      >
        <Home size={14} />
        <span>Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ChevronRight size={14} style={{ color: "var(--border)" }} />
          {item.href ? (
            <Link
              to={item.href}
              style={{
                color: "var(--muted-foreground)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--foreground)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted-foreground)"}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
