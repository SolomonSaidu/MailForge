import crypto from "crypto";
import prisma from "../config/db.js";
import { ApiError } from "../middleware/error.middleware.js";

/**
 * Generates a secure, random API key with a prefix.
 * Format: mf_live_[random string]
 */
const generateKey = () => {
  const randomBytes = crypto.randomBytes(24).toString("hex");
  return `mf_live_${randomBytes}`;
};

/**
 * Creates a SHA-256 hash of the provided key.
 */
const hashKey = (key) => {
  return crypto.createHash("sha256").update(key).digest("hex");
};

/**
 * Service to create a new API key for a user.
 * Stores the hash and returns the plain-text key (ONLY ONCE).
 */
export const createApiKey = async (userId, name) => {
  const plainTextKey = generateKey();
  const keyHash = hashKey(plainTextKey);

  const apiKey = await prisma.apiKey.create({
    data: {
      name,
      keyHash,
      userId,
    },
  });

  return {
    id: apiKey.id,
    name: apiKey.name,
    plainTextKey, // This is returned only now
    createdAt: apiKey.createdAt,
  };
};

/**
 * Retrieves all keys for a specific user.
 * Note: We do NOT return the keyHash to the client.
 */
export const listUserKeys = async (userId) => {
  return await prisma.apiKey.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      revoked: true,
      createdAt: true,
    },
  });
};

/**
 * Revokes an API key so it can no longer be used.
 */
export const revokeKey = async (userId, keyId) => {
  try {
    return await prisma.apiKey.update({
      where: { 
        id: keyId,
        userId // Security: Ensure the user owns the key they are revoking
      },
      data: { revoked: true },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError("API Key not found or unauthorized", 404);
    }
    throw error;
  }
};
