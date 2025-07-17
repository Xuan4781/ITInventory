import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { addBook, deleteBook, getAllBooks } from "../controllers/bookController.js";
import express from "express";

const router = express.Router();

router.post("/admin/add", isAuthenticated,"Authorized", addBook)
router.get("/all", isAuthenticated, getAllBooks);
router.delete("/delete/:id", isAuthenticated, "Authorized", deleteBook);




export default router;