import express from "express";
import { getUser, register } from "../controllers/authController.js";
import { verifyOTP } from "../controllers/authController.js";
import { login } from "../controllers/authController.js";
import { logout } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login)
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
export default router;