import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
