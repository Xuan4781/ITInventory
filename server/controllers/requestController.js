import { Request } from "../models/requestModel.js";
import { PeripheralLoan } from "../models/peripheralLoanModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// ✅ Update request status and create peripheral loan if approved
export const updateRequestStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "Approved", "Denied"];
  if (!validStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid status", 400));
  }

  const request = await Request.findById(id);
  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  if (request.status === status) {
    return next(new ErrorHandler(`Request already marked as ${status}`, 400));
  }

  request.status = status;

  let peripheralLoan = null;

  if (status === "Approved") {
    peripheralLoan = await PeripheralLoan.create({
      equipment: request.category,
      borrowerName: request.user.name,
      dateLoaned: new Date(),
      returned: false,
    });
  }

  await request.save();

  res.status(200).json({
    success: true,
    request,
    peripheralLoan,
  });
});
