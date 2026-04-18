import { createOrder, getOrdersByUserId, updateOrderStatus } from "../services/order.service.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseNumericId } from "../utils/parseNumericId.js";

export const createOneOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, paymentDetails } = req.body;
  const order = await createOrder({
    userId: req.user.id,
    items,
    shippingAddress,
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

  const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const order = await updateOrderStatus(orderId, status);

  res.status(200).json({
    success: true,
    message: "Order status updated",
    data: order,
  });
});
