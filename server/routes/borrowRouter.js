import express from "express";
import {
  borrowedBooks,
  getBorrowedBooksForAdmin,
  recordBorrowedBook,
  returnBorrowBook,
  deleteBorrowRecord,
  updateBorrowRecord
} from "../controllers/borrowControllers.js";
import { isAuthenticated , isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ For Admin - get all borrowed books
router.get("/borrowed-books-by-users", isAuthenticated, isAuthorized("Admin"), getBorrowedBooksForAdmin);

// ✅ For regular user - get their own borrowed books
router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);

// ✅ Record a borrow (Admin only)
router.post("/record-borrow-book", isAuthenticated, isAuthorized("Admin"), recordBorrowedBook);

// ✅ Return device (Admin only)
router.put("/return-borrowed-book/:bookId", isAuthenticated, isAuthorized("Admin"), returnBorrowBook);

// ✅ Update a borrow record (Admin only)
router.put("/update/:id", isAuthenticated, isAuthorized("Admin"), updateBorrowRecord);

// ✅ Delete a borrow record (Admin only)
router.delete("/:id", isAuthenticated, isAuthorized("Admin"), deleteBorrowRecord);

export default router;
