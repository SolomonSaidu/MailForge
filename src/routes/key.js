import express from "express";
import * as keyController from "../controllers/key.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All key routes require a logged-in user (JWT)
router.use(protect);

router.post("/", keyController.createKey);
router.get("/", keyController.getKeys);
router.delete("/:id", keyController.revokeKey);

export default router;
