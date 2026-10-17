import express from "express";
import { healthChecker } from "../controllers/health-check.controller.js";

const route = express.Router();

route.get("/health", healthChecker);

export default route;
