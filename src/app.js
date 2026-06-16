import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import keyRoutes from "./routes/key.js";
import emailRoutes from "./routes/email.js";
import analyticsRoutes from "./routes/analytics.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Global Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: "Too many requests from this IP, please try again later." },
});

// Middlewares
app.use(limiter);
app.use(cors());
app.use(express.json());

// Routes
const version = "v1";
app.use(`/api/${version}/auth`, authRoutes);
app.use(`/api/${version}/keys`, keyRoutes);
app.use(`/api/${version}/emails`, emailRoutes);
app.use(`/api/${version}/analytics`, analyticsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use(errorHandler);

export default app;
