export const asyncHandler = (handler) => async (req, res, next) => {
  try {
    console.log("ASYNC HANDLER - calling handler");
    await handler(req, res, next);
    console.log("ASYNC HANDLER - handler completed");
  } catch (error) {
    console.error("ASYNC HANDLER ERROR:", error);
    next(error);
  }
};
