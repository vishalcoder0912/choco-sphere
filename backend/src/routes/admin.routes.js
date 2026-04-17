import express from "express";
import {
  getOrders,
  updateOrder,
  deleteOrder,
  listProducts,
  createOneProduct,
  updateOneProduct,
  deleteOneProduct,
  listCategories,
  createOneCategory,
  updateOneCategory,
  deleteOneCategory,
  getStats,
} from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

// Dashboard
router.get("/stats", getStats);

// Orders
router.get("/orders", getOrders);
router.patch("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

// Products
router.get("/products", listProducts);
router.post("/products", createOneProduct);
router.patch("/products/:id", updateOneProduct);
router.delete("/products/:id", deleteOneProduct);

// Categories
router.get("/categories", listCategories);
router.post("/categories", createOneCategory);
router.patch("/categories/:id", updateOneCategory);
router.delete("/categories/:id", deleteOneCategory);

export default router;
