export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      next(error);
    });
  };
};
// Error handling middleware
// utils/globalErrorHandling.js

export const globalErrorHandling = (err, req, res, next) => {
  const statusCode = err.cause || err.statusCode || 500;

  if (process.env.MOOD === "DEV") {
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      errorName: err.name,
      stack: err.stack,
    });
  }

  // In production
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
};
