import { CSSProperties } from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: CSSProperties;
}

export const Skeleton = ({
  width = "100%",
  height = "1rem",
  borderRadius = "0.5rem",
  style,
}: SkeletonProps) => (
  <div
    style={{
      width,
      height,
      borderRadius,
      background: "linear-gradient(90deg, var(--muted) 25%, var(--muted-foreground) 50%, var(--muted) 75%)",
      backgroundSize: "200% 100%",
      animation: "skeleton-loading 1.5s ease-in-out infinite",
      ...style,
    }}
  />
);

export const ProductCardSkeleton = () => (
  <div
    style={{
      background: "var(--card)",
      borderRadius: "1rem",
      border: "1px solid var(--border)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Skeleton height={200} borderRadius={0} />
    <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Skeleton width="80%" height={24} />
      <Skeleton width="60%" height={16} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
        <Skeleton width="40%" height={20} />
        <Skeleton width="30%" height={36} borderRadius="0.5rem" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.5rem",
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
    <Skeleton width={300} height={40} style={{ marginBottom: "2rem" }} />
    <ProductGridSkeleton count={6} />
  </div>
);

// Add animation keyframes to global styles
export const SkeletonStyles = () => (
  <style>{`
    @keyframes skeleton-loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `}</style>
);

export default Skeleton;
