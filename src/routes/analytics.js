import express from "express";
import * as analyticsController from "../controllers/analytics.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Analytics are private and require JWT authentication
router.get("/dashboard", protect, analyticsController.getDashboardData);

export default router;
