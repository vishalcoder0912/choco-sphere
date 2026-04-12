import { prisma } from "../models/prismaClient.js";
import { ApiError } from "../utils/apiError.js";
import { parseNumericId } from "../utils/parseNumericId.js";

const productInclude = {
  category: true,
};

const normalizePrice = (price) => {
  const parsedPrice = Number(price);

  if (!Number.isInteger(parsedPrice) || parsedPrice < 0) {
    throw new ApiError(400, "Price must be a non-negative integer in cents");
  }

  return parsedPrice;
};

const validateCategory = async (categoryId) => {
  const parsedCategoryId = parseNumericId(categoryId, "category");
  const category = await prisma.category.findUnique({
    where: { id: parsedCategoryId },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return parsedCategoryId;
};

export const getProducts = async () =>
  prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

export const createProduct = async ({ name, description, price, image, categoryId }) => {
  if (
    !name?.trim() ||
    !description?.trim() ||
    price === undefined ||
    !image?.trim() ||
    categoryId === undefined
  ) {
    throw new ApiError(400, "Name, description, price, image, and categoryId are required");
  }

  const parsedCategoryId = await validateCategory(categoryId);

  return prisma.product.create({
    data: {
      name: name.trim(),
      description: description.trim(),
      price: normalizePrice(price),
      image: image.trim(),
      categoryId: parsedCategoryId,
    },
    include: productInclude,
  });
};

export const updateProduct = async (id, payload) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  const updateData = {};

  if (payload.name !== undefined) {
    if (!payload.name?.trim()) {
      throw new ApiError(400, "Product name cannot be empty");
    }

    updateData.name = payload.name.trim();
  }

  if (payload.description !== undefined) {
    if (!payload.description?.trim()) {
      throw new ApiError(400, "Product description cannot be empty");
    }

    updateData.description = payload.description.trim();
  }

  if (payload.image !== undefined) {
    if (!payload.image?.trim()) {
      throw new ApiError(400, "Product image cannot be empty");
    }

    updateData.image = payload.image.trim();
  }

  if (payload.price !== undefined) {
    updateData.price = normalizePrice(payload.price);
  }

  if (payload.categoryId !== undefined) {
    updateData.categoryId = await validateCategory(payload.categoryId);
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one product field is required for update");
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
    include: productInclude,
  });
};

export const deleteProduct = async (id) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  const linkedOrderItem = await prisma.orderItem.findFirst({
    where: { productId: id },
    select: { id: true },
  });

  if (linkedOrderItem) {
    throw new ApiError(409, "Product cannot be deleted because it is referenced by an order");
  }

  return prisma.product.delete({
    where: { id },
  });
};
