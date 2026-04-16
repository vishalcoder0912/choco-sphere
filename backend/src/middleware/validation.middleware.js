import { ApiError } from "../utils/apiError.js";

// Validation schemas
const validators = {
  // Auth validations
  register: (body) => {
    const errors = [];
    if (!body.name || body.name.length < 2) {
      errors.push("Name must be at least 2 characters");
    }
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push("Valid email is required");
    }
    if (!body.password || body.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    return errors;
  },

  login: (body) => {
    const errors = [];
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push("Valid email is required");
    }
    if (!body.password) {
      errors.push("Password is required");
    }
    return errors;
  },

  // Product validations
  createProduct: (body) => {
    const errors = [];
    if (!body.name || body.name.length < 2) {
      errors.push("Product name must be at least 2 characters");
    }
    if (!body.description || body.description.length < 10) {
      errors.push("Description must be at least 10 characters");
    }
    if (!body.price || isNaN(body.price) || body.price <= 0) {
      errors.push("Valid price is required");
    }
    if (!body.image || !/^https?:\/\/.+/.test(body.image)) {
      errors.push("Valid image URL is required");
    }
    if (!body.categoryId || isNaN(body.categoryId)) {
      errors.push("Valid category is required");
    }
    return errors;
  },

  // Order validations
  createOrder: (body) => {
    const errors = [];
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      errors.push("At least one item is required");
    }
    if (!body.shippingAddress || body.shippingAddress.length < 10) {
      errors.push("Valid shipping address is required");
    }
    if (!body.paymentMethod || !["CARD", "UPI", "COD"].includes(body.paymentMethod)) {
      errors.push("Valid payment method is required");
    }
    return errors;
  },

  // UPI validations
  upiSettings: (body) => {
    const errors = [];
    if (!body.upiId) {
      errors.push("UPI ID is required");
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(body.upiId)) {
      errors.push("Invalid UPI ID format (e.g., user@bank)");
    }
    return errors;
  },
};

// Middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const errors = validators[schema](req.body);
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    
    next();
  };
};

// Sanitize middleware
export const sanitize = (req, res, next) => {
  // Remove any HTML tags from string inputs
  const sanitizeString = (str) => {
    if (typeof str !== "string") return str;
    return str.replace(/<[^>]*>/g, "").trim();
  };

  // Sanitize request body
  if (req.body && typeof req.body === "object") {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }

  next();
};

export default { validate, sanitize };
