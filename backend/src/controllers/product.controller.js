import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../services/product.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseNumericId } from "../utils/parseNumericId.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await getProducts();

  res.status(200).json({
    success: true,
    data: products,
  });
});

export const getOneProduct = asyncHandler(async (req, res) => {
  const productId = parseNumericId(req.params.id, "product");
  const product = await getProductById(productId);

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const createOneProduct = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

export const updateOneProduct = asyncHandler(async (req, res) => {
  const productId = parseNumericId(req.params.id, "product");
  const product = await updateProduct(productId, req.body);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

export const deleteOneProduct = asyncHandler(async (req, res) => {
  const productId = parseNumericId(req.params.id, "product");
  await deleteProduct(productId);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
