import express from "express";
import { healthChecker } from "../controller/health-check.controller.js";

const route = express.Router();

route.get("/health", healthChecker);

export default route;
