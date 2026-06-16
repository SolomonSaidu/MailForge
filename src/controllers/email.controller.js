import * as emailService from "../services/email.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Controller to handle sending an email.
 * This endpoint is intended for use with an API Key.
 */
export const send = asyncHandler(async (req, res) => {
  const { from, to, subject, html, text } = req.body;

  // req.user and req.apiKeyId are provided by the serviceAuth middleware
  const result = await emailService.sendEmail(
    { from, to, subject, html, text },
    req.user.id,
    req.apiKeyId
  );

  res.status(200).json({
    success: true,
    message: "Email sent successfully",
    data: result.log,
  });
});

/**
 * Controller to fetch email logs for the authenticated user.
 */
export const getLogs = asyncHandler(async (req, res) => {
  const logs = await emailService.getEmailHistory(req.user.id);
  res.status(200).json({ success: true, data: logs });
});
