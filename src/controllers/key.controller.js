import * as keyService from "../services/key.service.js";

/**
 * Controller to create a new API key.
 * The plainTextKey is only visible in this response.
 */
export const createKey = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: "Key name is required" });
    }

    // req.user was attached by the 'protect' middleware
    const apiKeyData = await keyService.createApiKey(req.user.id, name);

    res.status(201).json({
      success: true,
      message: "API Key created successfully. Store it safely!",
      data: apiKeyData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Controller to list all keys for the authenticated user.
 */
export const getKeys = async (req, res) => {
  try {
    const keys = await keyService.listUserKeys(req.user.id);
    res.status(200).json({ success: true, data: keys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Controller to revoke an API key.
 */
export const revokeKey = async (req, res) => {
  try {
    const { id } = req.params;
    await keyService.revokeKey(req.user.id, id);

    res.status(200).json({
      success: true,
      message: "API Key revoked successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
