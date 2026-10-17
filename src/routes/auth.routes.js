import express from "express";
import * as authController from "../controllers/auth.controller.js";
const router = express.Router();

router
  .route("/register")
  .post(authController.userRegister)
  .get(authController.getAllUser);

export default router;
