import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddlewares.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// JWKS client for Microsoft identity platform
const client = jwksClient({
  jwksUri: "https://login.microsoftonline.com/common/discovery/v2.0/keys",
});

// Get public key from token header
function getKey(header, callback) {
  if (!header.kid) return callback(new Error("No KID found in token header"));
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

// Middleware to verify authentication
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return next(new ErrorHandler("User is not authenticated.", 401));

  // 🔧 Allow mock token for dev/testing
  if (token === "mock-access-token") {
    req.user = {
      name: "Dev User",
      email: "angelagao04@gmail.com",
      role: "Admin",
      accountVerified: true,
    };
    return next();
  }

  try {
    const decodedRaw = jwt.decode(token, { complete: true });
    console.log("📜 Decoded token header:", decodedRaw?.header);
    console.log("📜 Decoded token payload:", decodedRaw?.payload);

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, { clockTolerance: 120 }, (err, decodedToken) => {
        if (err) reject(err);
        else resolve(decodedToken);
      });
    });

    const email = decoded.preferred_username || decoded.upn || decoded.email;
    if (!email) return next(new ErrorHandler("Token missing email claim.", 401));

    const allowedDomain = "@socotec.us";
    const tempAllowedEmails = ["angelagao04@gmail.com", "xin520k@gmail.com"];
    const isAllowedEmail =
    email.endsWith(allowedDomain) || tempAllowedEmails.includes(email);

    if (!isAllowedEmail) {
      return next(
        new ErrorHandler(
          `Access denied for email "${email}". Only ${allowedDomain} or specific debug email allowed.`,
          403
        )
      );
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: decoded.name || "Microsoft User",
        email,
        microsoftId: decoded.oid,
        role: email === "angelagao04@gmail.com" ? "Admin" : "User",
        accountVerified: true,
      });
    }

    // ✅ Ensure role is attached to req.user
    req.user = {
      name: user.name,
      email: user.email,
      role: user.role,
      accountVerified: user.accountVerified,
      _id: user._id,
    };

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return next(new ErrorHandler("Invalid or expired Microsoft token.", 401));
  }
});

// Middleware to check role-based access
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `User with role "${req.user?.role}" is not authorized to access this route.`,
          403
        )
      );
    }
    next();
  };
};
