import express from "express";
import * as authRouter from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", authRouter.userRegister);
export default router;
