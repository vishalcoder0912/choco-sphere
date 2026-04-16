import express from "express";
import {
  getPaymentReceipt,
  initiatePayment,
  submitTransactionId,
  getPaymentStatus,
  initiatePaymentGuest,
  submitTransactionGuest,
} from "../controllers/payment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/initiate-guest/:orderId", initiatePaymentGuest);
router.post("/submit-guest", submitTransactionGuest);
router.get("/receipt/:orderId", getPaymentReceipt);
router.get("/status/:orderId", getPaymentStatus);

router.use(authenticate);
router.post("/initiate/:orderId", initiatePayment);
router.post("/submit", submitTransactionId);

export default router;
