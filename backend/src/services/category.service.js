import { prisma } from "../models/prismaClient.js";
import { ApiError } from "../utils/apiError.js";

export const getCategories = async () =>
  prisma.category.findMany({
    orderBy: { name: "asc" },
  });

export const createCategory = async ({ name }) => {
  if (!name?.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  const normalizedName = name.trim();
  const existingCategory = await prisma.category.findUnique({
    where: { name: normalizedName },
  });

  if (existingCategory) {
    throw new ApiError(409, "Category already exists");
  }

  return prisma.category.create({
    data: { name: normalizedName },
  });
};
