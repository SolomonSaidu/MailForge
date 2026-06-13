import * as emailService from "../services/email.service.js";

/**
 * Controller to handle sending an email.
 * This endpoint is intended for use with an API Key.
 */
export const send = async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    // Basic validation
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: to, subject, and either html or text.",
      });
    }

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
  } catch (error) {
    console.error("Email Sending Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send email",
    });
  }
};

/**
 * Controller to fetch email logs for the authenticated user.
 */
export const getLogs = async (req, res) => {
  try {
    const logs = await emailService.getEmailHistory(req.user.id);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
