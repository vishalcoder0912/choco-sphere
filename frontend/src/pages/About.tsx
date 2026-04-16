import { ContentPage } from "@/components/ContentPage";
import { Heart, Award, Users, Moon } from "lucide-react";

const About = () => {
  return (
    <ContentPage
      title="About NoirSane"
      description="Discover our dark passion for crafting forbidden confections, our commitment to the art of temptation."
      breadcrumbs={[{ label: "About" }]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
        {/* Our Story */}
        <section>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>The Origin</h2>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
            NoirSane emerged from the shadows in 2020, born from a fascination with the forbidden side of indulgence. What began as whispered experiments in a moonlit kitchen has evolved into a dark empire of confectionery artistry.
          </p>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--muted-foreground)" }}>
            We believe that true pleasure lies in embracing the shadows. Every creation is a masterpiece of contrast—bitter and sweet, dark and smooth, forbidden and irresistible.
          </p>
        </section>

        {/* Our Values */}
        <section>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>Our Dark Values</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            <div style={{ padding: "1.5rem", background: "var(--secondary)", borderRadius: "var(--radius)", textAlign: "center", border: "1px solid var(--noir-gray)" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                boxShadow: "0 0 15px var(--noir-red)"
              }}>
                <Moon size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Dark Excellence</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                We never compromise on darkness. Every ingredient is carefully selected from the finest shadowy sources.
              </p>
            </div>

            <div style={{ padding: "1.5rem", background: "var(--secondary)", borderRadius: "var(--radius)", textAlign: "center", border: "1px solid var(--noir-gray)" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                boxShadow: "0 0 15px var(--noir-red)"
              }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Shadow Mastery</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                Our dark artisans blend ancient secrets with forbidden techniques to create unique temptations.
              </p>
            </div>

            <div style={{ padding: "1.5rem", background: "var(--secondary)", borderRadius: "var(--radius)", textAlign: "center", border: "1px solid var(--noir-gray)" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                boxShadow: "0 0 15px var(--noir-red)"
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Inner Circle</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                Our initiates are at the heart of everything. We create moments of dark pleasure with every forbidden piece.
              </p>
            </div>

            <div style={{ padding: "1.5rem", background: "var(--secondary)", borderRadius: "var(--radius)", textAlign: "center", border: "1px solid var(--noir-gray)" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                boxShadow: "0 0 15px var(--noir-red)"
              }}>
                <Heart size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Hidden Passion</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                We are committed to ethical sourcing from the world's most mysterious cocoa regions.
              </p>
            </div>
          </div>
        </section>

        {/* Our Process */}
        <section>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>The Ritual</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: 700,
                boxShadow: "0 0 15px var(--noir-red)"
              }}>
                1
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>The Hunt</h3>
                <p style={{ fontSize: "1rem", color: "var(--muted-foreground)", lineHeight: 1.7 }}>
                  We seek out the rarest cocoa beans from the world's most shadowy plantations.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: 700,
                boxShadow: "0 0 15px var(--noir-red)"
              }}>
                2
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>The Transformation</h3>
                <p style={{ fontSize: "1rem", color: "var(--muted-foreground)", lineHeight: 1.7 }}>
                  Our shadow masters transform raw cocoa into exquisite darkness using ancient forbidden methods.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: 700,
                boxShadow: "0 0 15px var(--noir-red)"
              }}>
                3
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>The Judgment</h3>
                <p style={{ fontSize: "1rem", color: "var(--muted-foreground)", lineHeight: 1.7 }}>
                  Every creation passes through our dark council of experts to ensure it meets our exacting standards.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: 700,
                boxShadow: "0 0 15px var(--noir-red)"
              }}>
                4
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>The Delivery</h3>
                <p style={{ fontSize: "1rem", color: "var(--muted-foreground)", lineHeight: 1.7 }}>
                  Discreetly packaged and delivered under the cover of darkness to ensure your secrets remain safe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding: "2rem", background: "var(--secondary)", borderRadius: "var(--radius)", border: "1px solid var(--noir-gray)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "3rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.5rem", textShadow: "0 0 20px var(--noir-red)" }}>50+</div>
              <div style={{ fontSize: "1rem", color: "var(--muted-foreground)" }}>Forbidden Recipes</div>
            </div>
            <div>
              <div style={{ fontSize: "3rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.5rem", textShadow: "0 0 20px var(--noir-red)" }}>10K+</div>
              <div style={{ fontSize: "1rem", color: "var(--muted-foreground)" }}>Shadow Seekers</div>
            </div>
            <div>
              <div style={{ fontSize: "3rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.5rem", textShadow: "0 0 20px var(--noir-red)" }}>4.9</div>
              <div style={{ fontSize: "1rem", color: "var(--muted-foreground)" }}>Dark Rating</div>
            </div>
            <div>
              <div style={{ fontSize: "3rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.5rem", textShadow: "0 0 20px var(--noir-red)" }}>5</div>
              <div style={{ fontSize: "1rem", color: "var(--muted-foreground)" }}>Years in Shadow</div>
            </div>
          </div>
        </section>
      </div>
    </ContentPage>
  );
};

export default About;
