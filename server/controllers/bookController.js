import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const addBook = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(new ErrorHandler("Only admins can add device models.", 403));
  }

  const {
    name,
    modelNumber,
    procurementVendor,
    manufacturer
  } = req.body;

  if (!name || !modelNumber || !procurementVendor || !manufacturer) {
    return next(new ErrorHandler("Missing required fields.", 400));
  }

  const book = await Book.create({
    name,
    modelNumber,
    procurementVendor,
    manufacturer,
  });

  res.status(201).json({
    success: true,
    message: "Device model added successfully",
    book,
  });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(new ErrorHandler("Only admins can delete device models.", 403));
  }

  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  await book.deleteOne();
  res.status(200).json({
    success: true,
    message: "Book deleted successfully.",
  });
});
export const getAllBooks = catchAsyncErrors(async(req, res, next) => {
    const books = await Book.find();
    res.status(200).json({
        success:true,
        books,
    });
});

