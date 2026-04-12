import express from "express";
import { getOrders, updateOrder, createProduct } from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/orders", getOrders);
router.patch("/orders/:id", updateOrder);
router.post("/products", createProduct);

export default router;
