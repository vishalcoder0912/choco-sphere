import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import orderRoutes from "./order.routes.js";
import productRoutes from "./product.routes.js";
import adminRoutes from "./admin.routes.js";
import reviewRoutes from "./review.routes.js";
import paymentRoutes from "./payment.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ChocoSphere API is running",
    version: "1.0.0",
  });
});

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/admin", adminRoutes);
router.use("/reviews", reviewRoutes);
router.use("/payment", paymentRoutes);
router.use("/upload", uploadRoutes);

export default router;
