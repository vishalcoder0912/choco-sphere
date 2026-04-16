import { ContentPage } from "@/components/ContentPage";
import { Package, Truck, Clock, Shield } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <ContentPage
      title="Shipping Policy"
      description="Everything you need to know about our shipping options, delivery times, and packaging."
      breadcrumbs={[{ label: "Shipping Policy" }]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Truck size={24} style={{ color: "var(--primary)" }} />
            Shipping Options
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ padding: "1.25rem", background: "var(--secondary)", borderRadius: "var(--radius)" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Standard Shipping (3-5 Business Days)</div>
              <div style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>₹49 for orders under ₹999 | FREE for orders over ₹999</div>
            </div>
            <div style={{ padding: "1.25rem", background: "var(--secondary)", borderRadius: "var(--radius)" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Express Shipping (1-2 Business Days)</div>
              <div style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>₹99 for all orders</div>
            </div>
            <div style={{ padding: "1.25rem", background: "var(--secondary)", borderRadius: "var(--radius)" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Same-Day Delivery (Select Cities)</div>
              <div style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>₹149 for orders placed before 2 PM</div>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={24} style={{ color: "var(--primary)" }} />
            Processing Time
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            Orders are processed within 1-2 business days. During peak seasons (holidays, special occasions), processing may take up to 3 business days. You will receive a confirmation email with tracking information once your order ships.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Package size={24} style={{ color: "var(--primary)" }} />
            Packaging
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
            All our chocolates are carefully packaged in temperature-controlled materials to ensure they arrive in perfect condition. We use eco-friendly packaging wherever possible.
          </p>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            During summer months (April-September), we include ice packs and insulated packaging at no additional cost to protect your chocolates from melting.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={24} style={{ color: "var(--primary)" }} />
            Delivery Guarantee
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            If your chocolates arrive damaged or melted, please contact us within 24 hours of delivery with photos. We will either replace your order or issue a full refund, no questions asked.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>International Shipping</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            Currently, we only ship within India. We are working on expanding our international shipping options. Stay tuned for updates!
          </p>
        </section>
      </div>
    </ContentPage>
  );
};

export default ShippingPolicy;
