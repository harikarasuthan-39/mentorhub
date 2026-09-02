import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error";

import authRoutes from "./routes/authRoutes";
import studentRoutes from "./routes/studentRoutes";
import meetingRoutes from "./routes/meetingRoutes";
import issueRoutes from "./routes/issueRoutes";
import actionRoutes from "./routes/actionRoutes";
import aiRoutes from "./routes/aiRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import reportRoutes from "./routes/reportRoutes";
import exportRoutes from "./routes/exportRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import departmentRoutes from "./routes/departmentRoutes";

const app = express();

// Enable trust proxy for reverse proxy and container load balancer environments
app.set("trust proxy", 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
if (env.nodeEnv === "development") app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false,
    xForwardedForHeader: false,
  },
});
app.use("/api", limiter);

app.get("/api/health", (_req, res) => res.json({ success: true, status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/actions", actionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/departments", departmentRoutes);

// Catch unhandled API routes
app.use("/api/*", notFoundHandler);
app.use(errorHandler);

export default app;
