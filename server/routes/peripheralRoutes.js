import express from "express";
import {
  getAllPeripheralLoans,
  createPeripheralLoan,
  deletePeripheralLoan,
  updatePeripheralLoan, // ✅ Added this
} from "../controllers/peripheralController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, isAuthorized("Admin"), getAllPeripheralLoans)
  .post(isAuthenticated, isAuthorized("Admin"), createPeripheralLoan);

router
  .route("/:id")
  .put(isAuthenticated, isAuthorized("Admin"), updatePeripheralLoan) // ✅ Added this
  .delete(isAuthenticated, isAuthorized("Admin"), deletePeripheralLoan);

export default router;
