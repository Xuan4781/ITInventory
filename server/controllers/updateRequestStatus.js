import { PeripheralLoan } from "../models/peripheralLoanModel.js";
import ManagerRequest from "../models/managerRequestModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// 🔄 Update request status and optionally create a peripheral loan
export const updateRequestStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const request = await ManagerRequest.findById(id).populate("user");

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

    request.peripheralLoanId = peripheralLoan._id;
  }

  await request.save();

  res.status(200).json({
    success: true,
    request,
    peripheralLoan,
  });
});
