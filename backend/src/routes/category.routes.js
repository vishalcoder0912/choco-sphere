import { Router } from "express";
import { createOneCategory, getAllCategories } from "../controllers/category.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllCategories);
router.post("/", authenticate, authorize("ADMIN"), createOneCategory);

export default router;
