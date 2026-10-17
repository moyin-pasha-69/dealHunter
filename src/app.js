import express from "express";
import healthRoutes from "./routes/health-check.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use("/api/v1", healthRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);
export default app;
