import { ApiError } from "./apiError.js";

export const parseNumericId = (value, resourceName) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new ApiError(400, `Invalid ${resourceName} id`);
  }

  return parsedValue;
};
