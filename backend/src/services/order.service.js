import { prisma } from "../models/prismaClient.js";
import { ApiError } from "../utils/apiError.js";
import crypto from "crypto";

const orderInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
  items: {
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  },
};

/**
 * Generate a unique order number like CS-XXXXXX
 */
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `CS-${timestamp}${random}`;
};

const normalizeItems = (items) => {
  if (!items) {
    throw new ApiError(400, "Items are required");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Order must include at least one item");
  }

  const mergedItems = new Map();

  for (const item of items) {
    if (!item || typeof item !== "object") {
      throw new ApiError(400, "Each item must be a valid object");
    }
    
    const productId = Number(item?.productId);
    const quantity = Number(item?.quantity);

    if (!productId || !Number.isInteger(productId) || productId <= 0) {
      throw new ApiError(400, "Each order item must include a valid productId (positive integer)");
    }

    if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
      throw new ApiError(400, "Each order item must include a quantity greater than zero");
    }

    const previousQuantity = mergedItems.get(productId) ?? 0;
    mergedItems.set(productId, previousQuantity + quantity);
  }

  return [...mergedItems.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
};

export const createOrder = async ({ userId, items, shippingAddress, paymentMethod, paymentDetails }) => {
  console.log("[ORDER SERVICE] Creating order for userId:", userId);
  console.log("[ORDER SERVICE] Items:", JSON.stringify(items));
  console.log("[ORDER SERVICE] Shipping:", shippingAddress);
  console.log("[ORDER SERVICE] Payment:", paymentMethod);

  const normalizedItems = normalizeItems(items);
  const productIds = normalizedItems.map((item) => item.productId);

  console.log("[ORDER SERVICE] Fetching products:", productIds);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  console.log("[ORDER SERVICE] Found products:", products.length);

  if (products.length !== productIds.length) {
    const foundIds = products.map(p => p.id);
    const missingIds = productIds.filter(id => !foundIds.includes(id));
    console.error("[ORDER SERVICE] Product not found error. Requested:", productIds, "Found:", foundIds, "Missing:", missingIds);
    throw new ApiError(404, `Products not found: ${missingIds.join(", ")}`);
  }

  const productsById = new Map(products.map((product) => [product.id, product]));
  const totalAmount = normalizedItems.reduce((total, item) => {
    const product = productsById.get(item.productId);
    return total + product.price * item.quantity;
  }, 0);

  console.log("[ORDER SERVICE] Total amount:", totalAmount);

  const orderNumber = generateOrderNumber();

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        totalAmount,
        status: "PENDING",
        shippingAddress,
        paymentMethod,
        paymentDetails,
        items: {
          create: normalizedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: orderInclude,
    });

    console.log("[ORDER SERVICE] Order created successfully:", order.id, "orderNumber:", order.orderNumber);
    return order;
  } catch (error) {
    console.error("[ORDER SERVICE] Prisma error creating order:");
    console.error("  Code:", error.code);
    console.error("  Message:", error.message);
    if (error.meta) console.error("  Meta:", JSON.stringify(error.meta));
    throw error;
  }
};

export const getOrdersByUserId = async (userId) =>
  prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });

export const getAllOrders = async () =>
  prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });

export const updateOrderStatus = async (orderId, status) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: orderInclude,
  });
};