import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import { sendToken } from "../utils/sendToken.js";

// Microsoft login: sync or create user
export const syncMicrosoftUser = catchAsyncErrors(async (req, res, next) => {
  const { email, name, role } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: name || email.split("@")[0],
      email,
      role: role || "User",
      accountVerified: true,
    });
  }

  sendToken(user, 200, "Microsoft login successful", res);
});

// Get currently logged in user
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout the user
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});
