import express from "express";
import * as emailController from "../controllers/email.controller.js";
import { protect, serviceAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { sendEmailSchema } from "../validations/email.validation.js";

const router = express.Router();

/**
 * Route: POST /api/v1/emails/send
 * Used by external servers/apps via API Key.
 */
router.post("/send", serviceAuth, validate(sendEmailSchema), emailController.send);

/**
 * Route: GET /api/v1/emails/logs
 * Used by the human user via dashboard (JWT).
 */
router.get("/logs", protect, emailController.getLogs);

export default router;
