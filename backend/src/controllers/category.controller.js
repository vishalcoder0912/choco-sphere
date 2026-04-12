import { createCategory, getCategories } from "../services/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await getCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const createOneCategory = asyncHandler(async (req, res) => {
  const category = await createCategory(req.body);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});
