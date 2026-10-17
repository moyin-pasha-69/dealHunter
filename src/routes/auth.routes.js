import express from "express";
import * as authController from "../controllers/auth.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(authController.userRegister);
router
  .route("/login")
  .post(authMiddleware.isUserRegistered, authController.loginUser);

export default router;
