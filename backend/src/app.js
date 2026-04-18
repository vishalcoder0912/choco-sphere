import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import apiRoutes from "./routes/index.js";

const app = express();

/* =========================
   ✅ ALLOWED ORIGINS
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:58017",
  "https://frontend-livid-six-34.vercel.app",
  env.frontendUrl,
  env.frontendUrl?.replace("https://", "http://"),
  env.frontendUrl?.replace("http://", "https://"),
].filter(Boolean);

/* =========================
   ✅ CORS CONFIG (FIXED)
========================= */
app.use(cors({
  origin: (origin, callback) => {
    if (env.nodeEnv === "development") {
      return callback(null, true);
    }
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log("❌ Blocked by CORS:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

/* =========================
   ✅ PRE-FLIGHT FIX (IMPORTANT)
========================= */
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

/* =========================
   ✅ BODY PARSER
========================= */
app.use(express.json({ limit: "1mb" }));

/* =========================
   ✅ HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

/* =========================
   ✅ ROUTES
========================= */
app.use("/api", apiRoutes);

/* =========================
   ✅ ERROR HANDLING
========================= */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;