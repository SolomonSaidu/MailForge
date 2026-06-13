import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

/**
 * Middleware to protect routes and ensure the user is authenticated via JWT.
 * 
 * Logic:
 * 1. Extract the token from the Authorization header (Bearer token).
 * 2. Verify the token using the secret.
 * 3. Find the user in the database.
 * 4. Attach the user to the request object (req.user).
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the token payload (userId)
      // We exclude the passwordHash for security
      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

/**
 * Middleware to authenticate service requests using an API Key.
 * 
 * Logic:
 * 1. Extract the key from the 'x-api-key' header.
 * 2. Hash the provided key using SHA-256 (to match our stored hashes).
 * 3. Look up the hash in the ApiKey table.
 * 4. Attach the key owner (user) to req.user for use in the controller.
 */
import crypto from "crypto";

export const serviceAuth = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed: No API Key provided in 'x-api-key' header.",
    });
  }

  try {
    // 1. Hash the incoming key to compare with the stored hash
    const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

    // 2. Find the key in the database
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
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Invalid or revoked API Key.",
      });
    }

    // 3. Attach the user and key info to the request
    req.user = keyRecord.user;
    req.apiKeyId = keyRecord.id;

    next();
  } catch (error) {
    console.error("Service Auth Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error during authentication" });
  }
};
