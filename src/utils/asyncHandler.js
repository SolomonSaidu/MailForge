/**
 * Simple wrapper to catch errors in async express routes and pass them to the next middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
