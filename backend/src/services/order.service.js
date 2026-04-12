import { prisma } from "../models/prismaClient.js";
import { ApiError } from "../utils/apiError.js";

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

const normalizeItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Order must include at least one item");
  }

  const mergedItems = new Map();

  for (const item of items) {
    const productId = Number(item?.productId);
    const quantity = Number(item?.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new ApiError(400, "Each order item must include a valid productId");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
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
  const normalizedItems = normalizeItems(items);
  const productIds = normalizedItems.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length !== productIds.length) {
    throw new ApiError(404, "One or more selected products were not found");
  }

  const productsById = new Map(products.map((product) => [product.id, product]));
  const totalAmount = normalizedItems.reduce((total, item) => {
    const product = productsById.get(item.productId);
    return total + product.price * item.quantity;
  }, 0);

  return prisma.order.create({
    data: {
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
