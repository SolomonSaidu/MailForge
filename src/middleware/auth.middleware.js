import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "./error.middleware.js";

/**
 * Middleware to protect routes and ensure the user is authenticated via JWT.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      if (!req.user) {
        throw new ApiError("Not authorized, user not found", 401);
      }

      return next();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Not authorized, token failed", 401);
    }
  }

  if (!token) {
    throw new ApiError("Not authorized, no token", 401);
  }
});

/**
 * Middleware to authenticate service requests using an API Key.
 */
export const serviceAuth = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    throw new ApiError("Authentication failed: No API Key provided in 'x-api-key' header.", 401);
  }

  const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

  const keyRecord = await prisma.apiKey.findFirst({
    where: {
      keyHash: keyHash,
      revoked: false,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!keyRecord) {
    throw new ApiError("Authentication failed: Invalid or revoked API Key.", 401);
  }

  req.user = keyRecord.user;
  req.apiKeyId = keyRecord.id;

  next();
});
