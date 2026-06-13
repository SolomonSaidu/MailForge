import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const version = "v1";
app.use(`/api/${version}/auth`, authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
