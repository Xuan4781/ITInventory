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

  // Populate device to get its name
  const request = await Request.findById(id).populate("device");
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
      equipment: request.device.name || request.device,
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



export const createRequest = catchAsyncErrors(async (req, res, next) => {
  const { deviceId, notes } = req.body;

  if (!deviceId) {
    return next(new ErrorHandler("Device ID is required.", 400));
  }

  const request = await Request.create({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
    device: deviceId,
    notes,
  });

  res.status(201).json({
    success: true,
    request,
  });
});

