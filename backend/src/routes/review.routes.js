import { Router } from "express";
import { getProductReviews, addReview, deleteReview } from "../controllers/review.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:productId/reviews", getProductReviews);
router.post("/:productId/reviews", authenticate, addReview);
router.delete("/reviews/:reviewId", authenticate, deleteReview);

export default router;
