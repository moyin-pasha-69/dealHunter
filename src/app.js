import express from "express";
import healthRoutes from "./routes/health-check.routes.js";

const app = express();

app.use("/api/v1", healthRoutes);

export default app;
