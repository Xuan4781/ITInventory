import express from "express";
import { getUser, logout, syncMicrosoftUser } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/microsoft-sync", syncMicrosoftUser);
router.get("/me", isAuthenticated, getUser);
router.get("/logout", isAuthenticated, logout);

export default router;
