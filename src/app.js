import express from "express";
import healthRoutes from "./routes/health-check.routes.js";
import errorHandler from "./middleware/error.middlewares.js";

const app = express();

app.use(express.json());
app.use("/api/v1", healthRoutes);
app.get("/", (req, res, next) => {
  next(new Error("error message"));
});

app.use(errorHandler);
export default app;
