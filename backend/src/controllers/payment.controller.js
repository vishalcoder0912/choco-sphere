import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../models/prismaClient.js";
import {
  createPaymentReceipt,
  updatePaymentReceipt,
  verifyPayment,
  rejectPayment,
  getPendingPayments,
} from "../services/payment.service.js";
import { ApiError } from "../utils/apiError.js";
import { parseNumericId } from "../utils/parseNumericId.js";

export const getPaymentReceipt = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  
  const receipt = await prisma.paymentReceipt.findUnique({
    where: { orderId: parseInt(orderId) },
    include: {
      order: {
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true } }
        }
      }
    }
  });

  if (!receipt) {
    throw new ApiError(404, "Payment receipt not found");
  }

  res.status(200).json({
    success: true,
    data: receipt
  });
});

export const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId, upiId } = req.body;

  if (!orderId || !upiId) {
    throw new ApiError(400, "Order ID and UPI ID are required");
  }

  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId) },
    include: { user: true }
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.userId !== req.user.id && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Not authorized to make payment for this order");
  }

  if (order.paymentMethod !== "UPI") {
    throw new ApiError(400, "This order is not configured for UPI payment");
  }

  const receipt = await createPaymentReceipt(order.id, upiId, order.totalAmount);

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAYMENT_PENDING" }
  });

  res.status(200).json({
    success: true,
    message: "Payment initiated. Please complete UPI payment.",
    data: {
      receiptId: receipt.id,
      qrCode: receipt.qrCodeData,
      amount: receipt.amount,
      upiId: receipt.upiId,
      orderNumber: order.orderNumber,
      validFor: "15 minutes"
    }
  });
});

export const initiatePaymentGuest = asyncHandler(async (req, res) => {
  const { orderId, upiId } = req.body;

  if (!orderId || !upiId) {
    throw new ApiError(400, "Order ID and UPI ID are required");
  }

  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId) }
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.paymentMethod !== "UPI") {
    throw new ApiError(400, "This order is not configured for UPI payment");
  }

  const receipt = await createPaymentReceipt(order.id, upiId, order.totalAmount);

  const paymentRef = `CV${order.id}${Date.now().toString().slice(-8)}`;
  
  await prisma.paymentReceipt.update({
    where: { id: receipt.id },
    data: { upiRefId: paymentRef }
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAYMENT_PENDING" }
  });

  res.status(200).json({
    success: true,
    message: "Payment initiated. Please complete UPI payment.",
    data: {
      receiptId: receipt.id,
      paymentRef: paymentRef,
      qrCode: receipt.qrCodeData,
      amount: receipt.amount,
      upiId: receipt.upiId,
      orderNumber: order.orderNumber,
      validFor: "15 minutes"
    }
  });
});

export const submitTransactionId = asyncHandler(async (req, res) => {
  const { orderId, transactionId, payerVpa, payerName } = req.body;

  if (!orderId || !transactionId) {
    throw new ApiError(400, "Order ID and Transaction ID are required");
  }

  const receipt = await prisma.paymentReceipt.findUnique({
    where: { orderId: parseInt(orderId) },
    include: { order: true }
  });

  if (!receipt) {
    throw new ApiError(404, "Payment receipt not found");
  }

  if (receipt.status === "COMPLETED") {
    throw new ApiError(400, "Payment already completed");
  }

  await updatePaymentReceipt(orderId, {
    transactionId,
    payerVpa,
    payerName,
    upiRefId: `UPI${Date.now()}`
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { 
      paymentDetails: {
        ...receipt.order.paymentDetails,
        transactionId,
        payerVpa,
        payerName,
        submittedAt: new Date().toISOString()
      }
    }
  });

  res.status(200).json({
    success: true,
    message: "Transaction submitted. Awaiting admin verification.",
    data: {
      receiptId: receipt.id,
      transactionId,
      status: "SUBMITTED"
    }
  });
});

export const submitTransactionGuest = asyncHandler(async (req, res) => {
  const { orderId, transactionId, payerVpa, payerName } = req.body;

  if (!orderId || !transactionId) {
    throw new ApiError(400, "Order ID and Transaction ID are required");
  }

  const receipt = await prisma.paymentReceipt.findUnique({
    where: { orderId: parseInt(orderId) },
    include: { order: true }
  });

  if (!receipt) {
    throw new ApiError(404, "Payment receipt not found");
  }

  if (receipt.status === "COMPLETED") {
    throw new ApiError(400, "Payment already completed");
  }

  await updatePaymentReceipt(orderId, {
    transactionId,
    payerVpa,
    payerName,
    upiRefId: `UPI${Date.now()}`
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { 
      status: "PAYMENT_PENDING",
      paymentDetails: {
        ...receipt.order.paymentDetails,
        transactionId,
        payerVpa,
        payerName,
        submittedAt: new Date().toISOString()
      }
    }
  });

  res.status(200).json({
    success: true,
    message: "Transaction submitted. Awaiting admin verification.",
    data: {
      receiptId: receipt.id,
      transactionId,
      status: "SUBMITTED"
    }
  });
});

export const verifyPaymentController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const receipt = await verifyPayment(parseInt(orderId), req.user.id);

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: receipt
  });
});

export const rejectPaymentController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  if (!reason) {
    throw new ApiError(400, "Rejection reason is required");
  }

  const receipt = await rejectPayment(parseInt(orderId), req.user.id, reason);

  res.status(200).json({
    success: true,
    message: "Payment rejected",
    data: receipt
  });
});

export const getPendingPaymentsController = asyncHandler(async (req, res) => {
  const payments = await getPendingPayments();

  res.status(200).json({
    success: true,
    data: payments
  });
});

export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const receipt = await prisma.paymentReceipt.findUnique({
    where: { orderId: parseInt(orderId) }
  });

  if (!receipt) {
    throw new ApiError(404, "Payment not initiated for this order");
  }

  res.status(200).json({
    success: true,
    data: {
      status: receipt.status,
      transactionId: receipt.transactionId,
      paidAt: receipt.paidAt,
      verifiedAt: receipt.verifiedAt
    }
  });
});
