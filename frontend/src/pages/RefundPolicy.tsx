import { ContentPage } from "@/components/ContentPage";
import { RotateCcw, AlertCircle, CheckCircle, Clock } from "lucide-react";

const RefundPolicy = () => {
  return (
    <ContentPage
      title="Refund & Return Policy"
      description="Our hassle-free refund policy ensures you can shop with confidence. Learn about our return process and refund timeline."
      breadcrumbs={[{ label: "Refund Policy" }]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={24} style={{ color: "var(--primary)" }} />
            30-Day Satisfaction Guarantee
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            We want you to be completely satisfied with your purchase. If you're not happy with your chocolates for any reason, you can return them within 30 days of delivery for a full refund or exchange.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <RotateCcw size={24} style={{ color: "var(--primary)" }} />
            Return Conditions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <CheckCircle size={20} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "0.25rem" }} />
              <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
                Products must be returned in their original packaging, at least 70% consumed
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <CheckCircle size={20} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "0.25rem" }} />
              <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
                Proof of purchase (order number or receipt) is required
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <CheckCircle size={20} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "0.25rem" }} />
              <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
                Returns must be initiated within 30 days of delivery date
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={24} style={{ color: "var(--primary)" }} />
            Non-Returnable Items
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
            The following items cannot be returned:
          </p>
          <ul style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", paddingLeft: "1.5rem" }}>
            <li>Customized or personalized chocolate orders</li>
            <li>Items marked as "Final Sale" or purchased during clearance sales</li>
            <li>Products that have been opened and are less than 70% consumed</li>
            <li>Gift cards and vouchers</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={24} style={{ color: "var(--primary)" }} />
            Refund Process
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ padding: "1rem", background: "var(--secondary)", borderRadius: "var(--radius)" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Step 1: Initiate Return</div>
              <div style={{ fontSize: "0.95rem", color: "var(--muted-foreground)" }}>Contact our support team with your order details and reason for return</div>
            </div>
            <div style={{ padding: "1rem", background: "var(--secondary)", borderRadius: "var(--radius)" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Step 2: Return Approval</div>
              <div style={{ fontSize: "0.95rem", color: "var(--muted-foreground)" }}>We'll review your request and approve within 1-2 business days</div>
            </div>
            <div style={{ padding: "1rem", background: "var(--secondary)", borderRadius: "var(--radius)" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Step 3: Ship Back</div>
              <div style={{ fontSize: "0.95rem", color: "var(--muted-foreground)" }}>We'll provide a prepaid shipping label for you to return the item</div>
            </div>
            <div style={{ padding: "1rem", background: "var(--secondary)", borderRadius: "var(--radius)" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Step 4: Refund Processed</div>
              <div style={{ fontSize: "0.95rem", color: "var(--muted-foreground)" }}>Once received, refund will be processed within 5-7 business days</div>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>Refund Methods</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            Refunds are issued to the original payment method used for the purchase. If you paid by UPI, the refund will be credited to your UPI ID. For orders paid via other methods, please contact support for alternative refund options.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>Damaged or Defective Products</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            If your chocolates arrive damaged, melted, or defective, please contact us within 24 hours of delivery with photos. We will either replace your order immediately or issue a full refund, including shipping costs.
          </p>
        </section>
      </div>
    </ContentPage>
  );
};

export default RefundPolicy;
