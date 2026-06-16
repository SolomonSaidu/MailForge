import * as keyService from "../services/key.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/error.middleware.js";

/**
 * Controller to create a new API key.
 * The plainTextKey is only visible in this response.
 */
export const createKey = asyncHandler(async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    throw new ApiError("Key name is required", 400);
  }

  // req.user was attached by the 'protect' middleware
  const apiKeyData = await keyService.createApiKey(req.user.id, name);

  res.status(201).json({
    success: true,
    message: "API Key created successfully. Store it safely!",
    data: apiKeyData,
  });
});

/**
 * Controller to list all keys for the authenticated user.
 */
export const getKeys = asyncHandler(async (req, res) => {
  const keys = await keyService.listUserKeys(req.user.id);
  res.status(200).json({ success: true, data: keys });
});

/**
 * Controller to revoke an API key.
 */
export const revokeKey = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await keyService.revokeKey(req.user.id, id);

  res.status(200).json({
    success: true,
    message: "API Key revoked successfully",
  });
});
