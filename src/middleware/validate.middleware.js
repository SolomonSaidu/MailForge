import { ApiError } from "./error.middleware.js";

/**
 * Middleware to validate request data against a Zod schema.
 * @param {import("zod").ZodSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    let message = "Validation failed";
    
    if (error.errors && Array.isArray(error.errors)) {
      message = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
    } else if (error.message) {
      message = error.message;
    }
    
    next(new ApiError(message, 400));
  }
};
