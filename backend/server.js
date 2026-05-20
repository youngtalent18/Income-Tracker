import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import milestoneRoutes from "./routes/milestoneRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { rateLimit } from "./middleware/rateLimit.js";
import dns from "dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, ".env"), override: true });

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    name: "Income Tracker API",
    status: "ok",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.API_RATE_LIMIT_MAX || 300),
    keyPrefix: "api",
    skipAdmin: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/transactions", transactionRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Income Tracker API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start API", error);
    process.exit(1);
  }
}

start();
