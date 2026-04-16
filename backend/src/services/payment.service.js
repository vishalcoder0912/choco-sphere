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
  const transactionNote = `Payment for Order ${order.orderNumber}`;
  
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${(amount / 100).toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}&mref=${order.orderNumber}`;

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
  const receipt = await prisma.paymentReceipt.findUnique({
    where: { orderId }
  });

  if (!receipt) {
    throw new ApiError(404, "Payment receipt not found");
  }

  return await prisma.paymentReceipt.update({
    where: { orderId },
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

  await createNotification(
    receipt.order.userId,
    "PAYMENT_VERIFIED",
    "Payment Verified!",
    `Your payment of ₹${(receipt.amount / 100).toFixed(2)} for order ${receipt.order.orderNumber} has been verified.`,
    { orderId, receiptId: receipt.id }
  );

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

  await createNotification(
    receipt.order.userId,
    "PAYMENT_REJECTED",
    "Payment Rejected",
    `Your payment for order ${receipt.order.orderNumber} was rejected. Reason: ${reason}`,
    { orderId, receiptId: receipt.id, reason }
  );

  return updatedReceipt;
};

export const createNotification = async (userId, type, title, message, data = null) => {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      data
    }
  });
};

export const getNotifications = async (userId, unreadOnly = false) => {
  return await prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly ? { isRead: false } : {})
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });
};

export const markNotificationRead = async (notificationId, userId) => {
  return await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true }
  });
};

export const markAllNotificationsRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
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
