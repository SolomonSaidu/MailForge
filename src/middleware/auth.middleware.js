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
