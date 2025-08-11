import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import { msalInstance } from "../../client/src/msalConfig.js";

// GET all verified users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  res.status(200).json({
    success: true,
    users,
  });
});

// Authenticate Microsoft user via decoded token (JWT-based)
export const authenticateMicrosoftUser = catchAsyncErrors(async (req, res, next) => {
  const currentUser = req.user;

  if (!currentUser || !currentUser.microsoftId) {
    return next(new ErrorHandler("Microsoft authentication failed", 401));
  }

  let user = await User.findOne({ microsoftId: currentUser.microsoftId });

  if (user) {
    user.lastLogin = new Date();
    await user.save();
  } else {
    user = await User.create({
      name: currentUser.name,
      email: currentUser.email,
      microsoftId: currentUser.microsoftId,
      accountVerified: true,
      role: "User",
    });
  }

  res.status(200).json({
    success: true,
    message: "Authentication successful",
    user,
  });
});

// Promote verified user to Admin with avatar upload
export const registerMicrosoftAdmin = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.role === "Admin") {
    return next(new ErrorHandler("User is already an admin", 400));
  }

  if (!req.files || !req.files.avatar) {
    return next(new ErrorHandler("Avatar file is required", 400));
  }

  const avatar = req.files.avatar;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File format not supported", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
    folder: "IT_Inventory_Admin_Avatars",
  }).catch((err) => {
    console.error("Cloudinary upload failed:", err);
    return next(new ErrorHandler("Failed to upload avatar image to cloudinary", 500));
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return next(new ErrorHandler("Failed to upload avatar image to cloudinary", 500));
  }

  user.avatar = {
    public_id: cloudinaryResponse.public_id,
    url: cloudinaryResponse.secure_url,
  };
  user.role = "Admin";

  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.email} promoted to Admin`,
    admin: user,
  });
});

// Microsoft sign-out (optional if you're using JWTs only)
export const signOutMicrosoftUser = catchAsyncErrors(async (req, res, next) => {
  req.session?.destroy?.();

  const logoutUri = msalInstance.getLogoutUri({
    postLogoutRedirectUri: process.env.MICROSOFT_LOGOUT_REDIRECT_URI,
  });

  res.status(200).json({
    success: true,
    logoutUri,
  });
});

export const registerNewAdmin = registerMicrosoftAdmin;
