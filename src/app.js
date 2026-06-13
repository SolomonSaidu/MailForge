import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import keyRoutes from "./routes/key.js";
import emailRoutes from "./routes/email.js";
import analyticsRoutes from "./routes/analytics.js";

const app = express();

// Middlewares
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

export default app;
