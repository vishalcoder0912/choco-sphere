import { ReactNode } from "react";
import { Package, Search, ShoppingCart, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem 2rem",
      textAlign: "center",
      background: "var(--card)",
      borderRadius: "1rem",
      border: "1px solid var(--border)",
    }}
  >
    <div
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "var(--muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.5rem",
        color: "var(--muted-foreground)",
      }}
    >
      {icon || <Package size={40} />}
    </div>
    <h3
      style={{
        fontSize: "1.25rem",
        fontWeight: 600,
        margin: "0 0 0.5rem 0",
        color: "var(--foreground)",
      }}
    >
      {title}
    </h3>
    {description && (
      <p
        style={{
          color: "var(--muted-foreground)",
          margin: "0 0 1.5rem 0",
          maxWidth: "400px",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    )}
    {action && (
      <button
        onClick={action.onClick}
        style={{
          padding: "0.75rem 1.5rem",
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "none",
          borderRadius: "0.5rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {action.label}
      </button>
    )}
  </div>
);

// Pre-built empty states for common use cases
export const NoProducts = ({ onBrowse }: { onBrowse: () => void }) => (
  <EmptyState
    icon={<Package size={40} />}
    title="No Products Found"
    description="We couldn't find any products matching your criteria. Try adjusting your filters or browse all products."
    action={{ label: "Browse All Products", onClick: onBrowse }}
  />
);

export const NoSearchResults = ({ onClear }: { onClear: () => void }) => (
  <EmptyState
    icon={<Search size={40} />}
    title="No Search Results"
    description="We couldn't find any products matching your search. Try different keywords or clear your search."
    action={{ label: "Clear Search", onClick: onClear }}
  />
);

export const EmptyCart = ({ onShop }: { onShop: () => void }) => (
  <EmptyState
    icon={<ShoppingCart size={40} />}
    title="Your Cart is Empty"
    description="Looks like you haven't added any products to your cart yet. Start shopping to fill it up!"
    action={{ label: "Start Shopping", onClick: onShop }}
  />
);

export const NoOrders = () => (
  <EmptyState
    icon={<Package size={40} />}
    title="No Orders Yet"
    description="You haven't placed any orders yet. Browse our delicious chocolates and place your first order!"
  />
);

export const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <EmptyState
    icon={<AlertCircle size={40} />}
    title="Something Went Wrong"
    description="We encountered an error while loading the data. Please try again."
    action={{ label: "Try Again", onClick: onRetry }}
  />
);

export default EmptyState;
