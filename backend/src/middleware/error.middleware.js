import { ApiError } from "../utils/apiError.js";

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} was not found`));
};

export const errorHandler = (error, req, res, next) => {
  console.error("========== ERROR HANDLER ==========");
  console.error("Timestamp:", new Date().toISOString());
  console.error("Method:", req.method);
  console.error("URL:", req.originalUrl);
  console.error("Error name:", error.name);
  console.error("Error message:", error.message);
  console.error("Error code:", error.code);
  if (error.stack) {
    console.error("Stack trace:", error.stack);
  }
  console.error("==================================");
  
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "A unique field already exists with this value",
      error: process.env.NODE_ENV === "development" ? error.meta : undefined,
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "The requested record was not found",
    });
  }

  if (error.code === "P2003") {
    return res.status(409).json({
      success: false,
      message: "Operation blocked because the record is still referenced by related data",
    });
  }

  if (error.code === "P2000") {
    return res.status(400).json({
      success: false,
      message: "Invalid value for field",
      details: error.meta,
    });
  }

  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof ApiError ? error.message : "An unexpected error occurred while processing your request";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};