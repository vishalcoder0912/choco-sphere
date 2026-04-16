import { ReactNode } from "react";
import { Breadcrumb } from "./Breadcrumb";

interface ContentPageProps {
  title: string;
  description?: string;
  children: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function ContentPage({ title, description, children, breadcrumbs }: ContentPageProps) {
  return (
    <div style={{ padding: "8rem 2rem 4rem", maxWidth: "1280px", margin: "0 auto" }}>
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      
      <div style={{ marginTop: breadcrumbs ? "2rem" : 0 }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: description ? "1rem" : "2rem" }}>
          {title}
        </h1>
        {description && (
          <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", marginBottom: "2rem", lineHeight: 1.6 }}>
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
