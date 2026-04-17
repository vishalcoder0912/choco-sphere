import { prisma } from "../models/prismaClient.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseNumericId } from "../utils/parseNumericId.js";
import {
  getAllOrders,
  updateOrderStatus,
} from "../services/order.service.js";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/product.service.js";
import {
  createCategory,
  getCategories,
} from "../services/category.service.js";

/* ───────────── ORDERS ───────────── */

export const getOrders = asyncHandler(async (_req, res) => {
  const orders = await getAllOrders();
  res.status(200).json({ success: true, data: orders });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const orderId = parseNumericId(req.params.id, "order");
  const { status } = req.body;
  if (!status) throw new ApiError(400, "Status is required");
  const order = await updateOrderStatus(orderId, status);
  res.status(200).json({ success: true, data: order });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = parseNumericId(req.params.id, "order");
  const existing = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existing) throw new ApiError(404, "Order not found");
  await prisma.order.delete({ where: { id: orderId } });
  res.status(200).json({ success: true, message: "Order deleted" });
});

/* ───────────── PRODUCTS ───────────── */

export const listProducts = asyncHandler(async (_req, res) => {
  const products = await getProducts();
  res.status(200).json({ success: true, data: products });
});

export const createOneProduct = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json({ success: true, data: product });
});

export const updateOneProduct = asyncHandler(async (req, res) => {
  const productId = parseNumericId(req.params.id, "product");
  const product = await updateProduct(productId, req.body);
  res.status(200).json({ success: true, data: product });
});

export const deleteOneProduct = asyncHandler(async (req, res) => {
  const productId = parseNumericId(req.params.id, "product");
  await deleteProduct(productId);
  res.status(200).json({ success: true, message: "Product deleted" });
});

/* ───────────── CATEGORIES ───────────── */

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await getCategories();
  res.status(200).json({ success: true, data: categories });
});

export const createOneCategory = asyncHandler(async (req, res) => {
  const category = await createCategory(req.body);
  res.status(201).json({ success: true, data: category });
});

export const updateOneCategory = asyncHandler(async (req, res) => {
  const categoryId = parseNumericId(req.params.id, "category");
  const { name } = req.body;
  if (!name?.trim()) throw new ApiError(400, "Category name is required");
  const trimmed = name.trim();

  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing) throw new ApiError(404, "Category not found");

  const duplicate = await prisma.category.findFirst({
    where: { name: trimmed, NOT: { id: categoryId } },
  });
  if (duplicate) throw new ApiError(409, "Category name already in use");

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { name: trimmed },
  });
  res.status(200).json({ success: true, data: category });
});

export const deleteOneCategory = asyncHandler(async (req, res) => {
  const categoryId = parseNumericId(req.params.id, "category");
  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing) throw new ApiError(404, "Category not found");

  const linked = await prisma.product.findFirst({
    where: { categoryId },
    select: { id: true },
  });
  if (linked) {
    throw new ApiError(409, "Cannot delete category that has products");
  }

  await prisma.category.delete({ where: { id: categoryId } });
  res.status(200).json({ success: true, message: "Category deleted" });
});

/* ───────────── DASHBOARD STATS ───────────── */

export const getStats = asyncHandler(async (_req, res) => {
  const [orders, productsCount, categoriesCount, usersCount] = await Promise.all([
    prisma.order.findMany({
      select: { totalAmount: true, status: true, createdAt: true },
    }),
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count(),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  // Last 7 days revenue trend
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const trend = Array.from({ length: 7 }).map((_, idx) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - idx));
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const dayOrders = orders.filter(
      (o) => new Date(o.createdAt) >= day && new Date(o.createdAt) < next && o.status !== "CANCELLED"
    );
    return {
      date: day.toISOString().slice(0, 10),
      revenue: dayOrders.reduce((s, o) => s + o.totalAmount, 0),
      orders: dayOrders.length,
    };
  });

  res.status(200).json({
    success: true,
    data: {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: productsCount,
      totalCategories: categoriesCount,
      totalUsers: usersCount,
      pendingOrders: counts.PENDING ?? 0,
      paidOrders: counts.PAID ?? 0,
      shippedOrders: counts.SHIPPED ?? 0,
      deliveredOrders: counts.DELIVERED ?? 0,
      cancelledOrders: counts.CANCELLED ?? 0,
      trend,
    },
  });
});
