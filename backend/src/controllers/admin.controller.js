import { getAllOrders, updateOrderStatus } from "../services/order.service.js";
import { prisma } from "../models/prismaClient.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseNumericId } from "../utils/parseNumericId.js";

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await getAllOrders();
  res.status(200).json({
    success: true,
    data: orders,
  });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const orderId = parseNumericId(req.params.id, "order");
  const { status } = req.body;
  if (!status) {
    throw new ApiError(400, "Status is required");
  }
  const order = await updateOrderStatus(orderId, status);
  res.status(200).json({
    success: true,
    data: order,
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image, categoryId } = req.body;
  
  if (!name || !description || !price || !image || !categoryId) {
    throw new ApiError(400, "All product fields are required");
  }

  const categoryIdNum = parseInt(categoryId, 10);

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseInt(price, 10),
      image,
      categoryId: categoryIdNum,
    },
    include: {
      category: true,
    }
  });

  res.status(201).json({
    success: true,
    data: product,
  });
});
