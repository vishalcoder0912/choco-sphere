import { ContentPage } from "@/components/ContentPage";
import { FileText, Scale, AlertTriangle, Gavel } from "lucide-react";

const TermsOfService = () => {
  return (
    <ContentPage
      title="Terms of Service"
      description="Please read our terms of service carefully before using NoirSane. By using our website and services, you agree to these terms."
      breadcrumbs={[{ label: "Terms of Service" }]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={24} style={{ color: "var(--primary)" }} />
            Acceptance of Terms
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            By accessing or using NoirSane's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Scale size={24} style={{ color: "var(--primary)" }} />
            Account Responsibilities
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
            When creating an account on NoirSane, you agree to:
          </p>
          <ul style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", paddingLeft: "1.5rem" }}>
            <li>Provide accurate, complete, and current information</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Be at least 18 years old or have parental/guardian consent</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={24} style={{ color: "var(--primary)" }} />
            Product Information
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
            While we strive to provide accurate product information, including descriptions, images, and pricing, we do not warrant that:
          </p>
          <ul style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", paddingLeft: "1.5rem" }}>
            <li>Product descriptions are completely error-free</li>
            <li>Colors displayed on our monitors are accurate</li>
            <li>All products are always in stock</li>
            <li>Pricing is free from typographical errors</li>
          </ul>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            In the event of a pricing error, we reserve the right to cancel orders and provide refunds.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Gavel size={24} style={{ color: "var(--primary)" }} />
            Order Acceptance and Payment
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
            We reserve the right to refuse or cancel any order for any reason, including but not limited to:
          </p>
          <ul style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)", paddingLeft: "1.5rem" }}>
            <li>Product availability issues</li>
            <li>Errors in product information or pricing</li>
            <li>Suspicion of fraudulent activity</li>
            <li>Violation of these Terms of Service</li>
          </ul>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            Payment is due at the time of order placement. We accept UPI, credit/debit cards, and other payment methods as specified on our website.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>Intellectual Property</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            All content on NoirSane, including text, graphics, logos, images, and software, is the property of NoirSane or its content suppliers and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our express written permission.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>Limitation of Liability</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            NoirSane shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or products. Our total liability to you for all claims shall not exceed the amount you paid for the specific product or service giving rise to the claim.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>Governing Law</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in India.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>Contact Information</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
            If you have any questions about these Terms of Service, please contact us at support@chocosphere.com
          </p>
        </section>
      </div>
    </ContentPage>
  );
};

export default TermsOfService;
