import "dotenv/config";

const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV !== "build") {
  console.warn(`Warning: Missing environment variables: ${missingEnvVars.join(", ")}`);
}

const frontendUrls = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map(url => url.trim())
  .filter(Boolean);

export const env = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-change-in-production",
  port: Number(process.env.PORT) || 5000,
  frontendUrl: frontendUrls[0],
  frontendUrls,
  nodeEnv: process.env.NODE_ENV || "development",
};
