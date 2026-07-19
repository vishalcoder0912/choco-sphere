import { prisma } from "../models/prismaClient.js";
import { ApiError } from "../utils/apiError.js";
import QRCode from "qrcode";
import crypto from "crypto";

export const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `CS${timestamp}${random}`;
};

export const createPaymentReceipt = async (orderId, upiId, amount) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true }
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const merchantName = "ChocoVerse";
  const orderRef = order.orderNumber || `ORD-${order.id}`;
  const transactionNote = `Payment for Order ${orderRef}`;
  
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${(amount / 100).toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}&mref=${orderRef}`;

  const qrCodeData = await QRCode.toDataURL(upiUrl, {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF"
    },
    errorCorrectionLevel: "H"
  });

  const receipt = await prisma.paymentReceipt.upsert({
    where: { orderId },
    update: {
      upiId,
      amount,
      qrCodeData,
      status: "PENDING"
    },
    create: {
      orderId,
      upiId,
      amount,
      qrCodeData,
      status: "PENDING"
    }
  });

  return receipt;
};

export const updatePaymentReceipt = async (orderId, data) => {
  const numericOrderId = typeof orderId === "string" ? parseInt(orderId) : orderId;

  const receipt = await prisma.paymentReceipt.findUnique({
    where: { orderId: numericOrderId }
  });

  if (!receipt) {
    throw new ApiError(404, "Payment receipt not found");
  }

  return await prisma.paymentReceipt.update({
    where: { orderId: numericOrderId },
    data: {
      ...data,
      paidAt: data.status === "COMPLETED" ? new Date() : undefined
    }
  });
};

export const verifyPayment = async (orderId, adminUserId) => {
  const receipt = await prisma.paymentReceipt.findUnique({
    where: { orderId },
    include: { order: true }
  });

  if (!receipt) {
    throw new ApiError(404, "Payment receipt not found");
  }

  if (receipt.status === "COMPLETED") {
    throw new ApiError(400, "Payment already verified");
  }

  const updatedReceipt = await prisma.paymentReceipt.update({
    where: { orderId },
    data: {
      status: "COMPLETED",
      verifiedAt: new Date(),
      verifiedBy: adminUserId
    }
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID" }
  });

  console.log(`[PAYMENT] Payment verified for order ${orderId} by admin ${adminUserId}`);

  return updatedReceipt;
};

export const rejectPayment = async (orderId, adminUserId, reason) => {
  const receipt = await prisma.paymentReceipt.findUnique({
    where: { orderId },
    include: { order: true }
  });

  if (!receipt) {
    throw new ApiError(404, "Payment receipt not found");
  }

  const updatedReceipt = await prisma.paymentReceipt.update({
    where: { orderId },
    data: {
      status: "FAILED",
      verifiedAt: new Date(),
      verifiedBy: adminUserId
    }
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" }
  });

  console.log(`[PAYMENT] Payment rejected for order ${orderId}. Reason: ${reason}`);

  return updatedReceipt;
};

export const getPendingPayments = async () => {
  return await prisma.paymentReceipt.findMany({
    where: { status: "PENDING" },
    include: {
      order: {
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          items: {
            include: {
              product: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
