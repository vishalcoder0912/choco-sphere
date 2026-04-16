import { ContentPage } from "@/components/ContentPage";
import { Shield, Eye, Lock, Database, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <ContentPage
      title="Privacy Policy"
      description="Your privacy is important to us. Learn how we collect, use, and protect your personal information."
      breadcrumbs={[{ label: "Privacy Policy" }]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={24} style={{ color: "var(--primary)" }} />
            Information We Collect
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
            We collect information you provide directly to us, including:
          </p>
          <ul style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", paddingLeft: "1.5rem" }}>
            <li>Name, email address, and phone number when you create an account</li>
            <li>Shipping and billing addresses for order fulfillment</li>
            <li>Payment information (processed securely through third-party payment gateways)</li>
            <li>Order history and preferences</li>
            <li>Communication preferences and newsletter subscriptions</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Eye size={24} style={{ color: "var(--primary)" }} />
            How We Use Your Information
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
            We use your information to:
          </p>
          <ul style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", paddingLeft: "1.5rem" }}>
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Provide customer support</li>
            <li>Send promotional emails and newsletters (with your consent)</li>
            <li>Improve our products and services</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Database size={24} style={{ color: "var(--primary)" }} />
            Data Security
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
          </p>
          <ul style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", paddingLeft: "1.5rem", marginTop: "1rem" }}>
            <li>SSL encryption for all data transmissions</li>
            <li>Secure payment processing through trusted gateways</li>
            <li>Regular security audits and updates</li>
            <li>Restricted access to personal data</li>
            <li>Secure storage systems with backup protocols</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Lock size={24} style={{ color: "var(--primary)" }} />
            Data Sharing
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
            We do not sell your personal information to third parties. We may share your information only with:
          </p>
          <ul style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", paddingLeft: "1.5rem" }}>
            <li>Shipping partners for order delivery</li>
            <li>Payment processors for transaction processing</li>
            <li>Service providers who assist in operating our website</li>
            <li>Legal authorities when required by law</li>
          </ul>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginTop: "1rem" }}>
            All third parties are contractually obligated to protect your information and use it only for the purposes specified.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Mail size={24} style={{ color: "var(--primary)" }} />
            Marketing Communications
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            With your consent, we may send you promotional emails about new products, special offers, and other updates. You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or by contacting us at support@noirsane.com.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>Cookies and Tracking</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
            We use cookies and similar technologies to:
          </p>
          <ul style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", paddingLeft: "1.5rem" }}>
            <li>Remember your preferences and login information</li>
            <li>Analyze website traffic and user behavior</li>
            <li>Personalize your experience</li>
            <li>Improve our website performance</li>
          </ul>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginTop: "1rem" }}>
            You can manage cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>Your Rights</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
            You have the right to:
          </p>
          <ul style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", paddingLeft: "1.5rem" }}>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Object to processing of your data</li>
          </ul>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginTop: "1rem" }}>
            To exercise these rights, please contact us at support@noirsane.com
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>Policy Updates</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>Contact Us</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            If you have any questions about this Privacy Policy or our data practices, please contact us at support@noirsane.com
          </p>
        </section>
      </div>
    </ContentPage>
  );
};

export default PrivacyPolicy;
