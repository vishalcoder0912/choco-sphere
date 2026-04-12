import { Router } from "express";
import { createOneOrder, getOrdersForUser } from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createOneOrder);
router.get("/:userId", authenticate, getOrdersForUser);

export default router;
