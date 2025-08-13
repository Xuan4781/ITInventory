import { PeripheralLoan } from "../models/peripheralLoanModel.js";
import { Request } from "../models/requestModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const updateRequestStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "Approved", "Denied"];
  if (!validStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid status", 400));
  }

  // Populate both user and device
  const request = await Request.findById(id).populate("user").populate("device");

  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  if (request.status === status) {
    return next(new ErrorHandler(`Request already marked as ${status}`, 400));
  }

  request.status = status;

  let peripheralLoan = null;

  if (status === "Approved") {
    // Use device name if populated, otherwise fallback to ID string
    const deviceName = request.device?.name || request.device?._id || request.device;

    peripheralLoan = await PeripheralLoan.create({
      equipment: deviceName,
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
