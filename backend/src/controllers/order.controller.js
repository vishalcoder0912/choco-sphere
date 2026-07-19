import { createOrder, getOrdersByUserId, updateOrderStatus as updateStatus } from "../services/order.service.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseNumericId } from "../utils/parseNumericId.js";

export const createOneOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, city, state, zipCode, paymentMethod, paymentDetails } = req.body;

  console.log("[ORDER CONTROLLER] Received request body:", JSON.stringify(req.body));
  console.log("[ORDER CONTROLLER] User from auth:", req.user);

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Order must include at least one item");
  }

  if (!shippingAddress || typeof shippingAddress !== "string" || shippingAddress.length < 5) {
    throw new ApiError(400, "Valid shipping address is required (minimum 5 characters)");
  }

  if (!paymentMethod || !["CARD", "UPI", "COD"].includes(paymentMethod)) {
    throw new ApiError(400, "Valid payment method is required (CARD, UPI, or COD)");
  }

  const fullAddress = shippingAddress;
  
  const order = await createOrder({
    userId: req.user.id,
    items,
    shippingAddress: fullAddress,
    paymentMethod,
    paymentDetails,
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

export const getOrdersForUser = asyncHandler(async (req, res) => {
  const userId = parseNumericId(req.params.userId, "user");

  if (req.user.role !== "ADMIN" && req.user.id !== userId) {
    throw new ApiError(403, "You can only access your own orders");
  }

  const orders = await getOrdersByUserId(userId);

  res.status(200).json({
    success: true,
    data: orders,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = parseNumericId(req.params.id, "order");
  const { status } = req.body;

  const validStatuses = ["PENDING", "PAYMENT_PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const order = await updateStatus(orderId, status);

  res.status(200).json({
    success: true,
    message: "Order status updated",
    data: order,
  });
});