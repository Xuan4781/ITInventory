import { PeripheralLoan } from "../models/peripheralLoanModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

// 🔄 Get all peripheral loans
export const getAllPeripheralLoans = catchAsyncErrors(async (req, res, next) => {
  const peripherals = await PeripheralLoan.find();
  res.status(200).json({ success: true, peripherals });
});

// ➕ Create a new peripheral loan
export const createPeripheralLoan = catchAsyncErrors(async (req, res, next) => {
  const { equipment, borrowerName, dateLoaned, returned } = req.body;

  if (!equipment || !borrowerName) {
    return next(new ErrorHandler("Equipment and borrower name are required", 400));
  }

  const peripheral = await PeripheralLoan.create({
    equipment,
    borrowerName,
    dateLoaned,
    returned,
  });

  res.status(201).json({ success: true, peripheral });
});

// 🗑️ Delete a peripheral loan
export const deletePeripheralLoan = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const peripheral = await PeripheralLoan.findByIdAndDelete(id);

  if (!peripheral) {
    return next(new ErrorHandler("Peripheral not found", 404));
  }

  res.status(200).json({ success: true, message: "Peripheral deleted successfully" });
});

// ✏️ Update a peripheral loan
export const updatePeripheralLoan = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;

  const peripheral = await PeripheralLoan.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!peripheral) {
    return next(new ErrorHandler("Peripheral not found", 404));
  }

  res.status(200).json({ success: true, peripheral });
});
