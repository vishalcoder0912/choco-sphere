import { Router } from "express";
import {
  createOneProduct,
  deleteOneProduct,
  getAllProducts,
  getOneProduct,
  updateOneProduct,
} from "../controllers/product.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getOneProduct);
router.post("/", authenticate, authorize("ADMIN"), createOneProduct);
router.put("/:id", authenticate, authorize("ADMIN"), updateOneProduct);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteOneProduct);

export default router;
