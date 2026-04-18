import { ApiError } from "../utils/apiError.js";

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} was not found`));
};

export const errorHandler = (error, req, res, next) => {
  console.error("ERROR HANDLER:", error);
  
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "A unique field already exists with this value",
      details: error.meta,
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

  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof ApiError ? error.message : "Internal server error";

  console.error("FULL ERROR:", error.stack);
  
  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};
