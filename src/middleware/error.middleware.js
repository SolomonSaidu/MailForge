/**
 * Centralized error handling middleware.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.stack || err.message}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace only in development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

/**
 * Custom error class for API errors.
 */
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
