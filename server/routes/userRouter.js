import express from "express";
import { getAllUsers, registerNewAdmin } from "../controllers/userController.js";
import {isAuthorized, isAuthenticated} from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post("/register-microsoft-admin", isAuthenticated, isAuthorized("Admin"), registerNewAdmin);



export default router;