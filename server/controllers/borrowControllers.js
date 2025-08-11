import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";

// RECORD borrowed book
export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const currentUser = req.user;

  if (!currentUser) {
    return next(new ErrorHandler("User not found in system", 404));
  }

  const {
    bookId,
    price,
    office,
    division,
    costCenter,
    userName,
    shippedLocation,
    procurementVendor,
    manufacturer,
    modelNumber,
    serviceTag,
    computerName,
    unitCost,
    preparedBy,
    dateIssued,
    datePurchased,
    warrantyExpire,
    currentAge,
    monitor,
    monitorDatePurchased,
    monitorAge,
    monitorSize,
    monitorQuantity,
    dockingStation,
    laptopServiceTag,
    dockingStationWarrantyExpire,
    notes,
    age2025,
    age2026,
    age2027,
    age2028,
    remainingPurchase2025,
    plannedPurchase2026,
    plannedPurchase2027,
    plannedPurchase2028,
    borrowDate,
    dueDate,
  } = req.body;

  const borrow = await Borrow.create({
    user: {
      id: currentUser._id,
      name: currentUser.name || userName,
      email: currentUser.email,
    },
    book: bookId,
    price,
    office,
    division,
    costCenter,
    userName,
    shippedLocation,
    procurementVendor,
    manufacturer,
    modelNumber,
    serviceTag,
    computerName,
    unitCost,
    preparedBy,
    dateIssued,
    datePurchased,
    warrantyExpire,
    currentAge,
    monitor,
    monitorDatePurchased,
    monitorAge,
    monitorSize,
    monitorQuantity,
    dockingStation,
    laptopServiceTag,
    dockingStationWarrantyExpire,
    notes,
    age2025,
    age2026,
    age2027,
    age2028,
    remainingPurchase2025,
    plannedPurchase2026,
    plannedPurchase2027,
    plannedPurchase2028,
    borrowDate,
    dueDate,
  });

  res.status(200).json({
    success: true,
    message: "Borrowed device recorded successfully.",
    borrow,
  });
});

// UPDATE borrow record
export const updateBorrowRecord = catchAsyncErrors(async (req, res, next) => {
  const currentUser = req.user;

  if (!currentUser || currentUser.role !== 'Admin') {
    return next(new ErrorHandler("You do not have permission to update borrow records", 403));
  }

  const borrowId = req.params.id;
  const updateData = req.body;

  const borrow = await Borrow.findById(borrowId);
  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found", 404));
  }

  Object.keys(updateData).forEach((key) => {
    if (key !== "email" && key !== "userName") {
      borrow[key] = updateData[key];
    }
  });

  if (updateData.email) borrow.user.email = updateData.email;
  if (updateData.userName) borrow.user.name = updateData.userName;

  await borrow.save();

  res.status(200).json({
    success: true,
    message: "Borrow record updated successfully",
    borrow,
  });
});

// DELETE borrow record
export const deleteBorrowRecord = catchAsyncErrors(async (req, res, next) => {
  const currentUser = req.user;

  if (!currentUser || currentUser.role !== 'Admin') {
    return next(new ErrorHandler("You do not have permission to delete borrow records", 403));
  }

  const borrowId = req.params.id;
  const borrow = await Borrow.findById(borrowId);

  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found", 404));
  }

  await borrow.deleteOne();

  res.status(200).json({
    success: true,
    message: "Borrow record deleted successfully.",
  });
});

// GET borrowed books for logged-in user
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const currentUser = req.user;

  if (!currentUser) {
    return next(new ErrorHandler("User not found in system", 404));
  }

  const borrowedBooks = await Borrow.find({ "user.id": currentUser._id }).populate("book");

  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

// GET all borrowed books for Admin
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
  const currentUser = req.user;

  if (!currentUser || currentUser.role !== 'Admin') {
    return next(new ErrorHandler("You do not have permission to view all borrow records", 403));
  }

  const borrowedBooks = await Borrow.find()
    .populate("book")
    .populate("user.id", "email name microsoftId");

  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

// RETURN borrowed book
export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
  const currentUser = req.user;

  if (!currentUser) {
    return next(new ErrorHandler("User not found in system", 404));
  }

  const { bookId } = req.params;
  const { targetUserEmail } = req.body;
  const email = targetUserEmail || currentUser.email;

  if (targetUserEmail && targetUserEmail !== currentUser.email && currentUser.role !== 'Admin') {
    return next(new ErrorHandler("You do not have permission to return books for other users", 403));
  }

  const book = await Book.findById(bookId);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && b.returned === false
  );
  if (!borrowedBook) {
    return next(new ErrorHandler("Book not borrowed.", 400));
  }

  borrowedBook.returned = true;
  await user.save();

  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrow = await Borrow.findOne({
    book: bookId,
    "user.email": email,
    returnDate: null,
  });
  if (!borrow) {
    return next(new ErrorHandler("Book not borrowed.", 400));
  }

  borrow.returnDate = new Date();
  await borrow.save();

  res.status(200).json({
    success: true,
    message: `The book has been returned successfully. The total charges are $${book.price}`,
  });
});
