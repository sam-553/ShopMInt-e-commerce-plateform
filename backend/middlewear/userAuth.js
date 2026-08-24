import HandleError from "../utils/handleError.js";
import handleasyncError from "./handleasyncError.js";
import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

// ======================================================
// VERIFY USER AUTHENTICATION
// ======================================================

const verifyUserAuth = handleasyncError(async (req, res, next) => {
  console.log("========== AUTH DEBUG ==========");
  console.log("Request URL:", req.originalUrl);
  console.log("Request Method:", req.method);
  console.log("Origin:", req.headers.origin);
  console.log("Cookies:", req.cookies);
  console.log(
    "Token:",
    req.cookies?.token ? "TOKEN EXISTS" : "NO TOKEN"
  );
  console.log("================================");

  // Get JWT token from HTTP-only cookie
  const token = req.cookies?.token;

  // ----------------------------------------------------
  // Token does not exist
  // ----------------------------------------------------

  if (!token) {
    console.log("❌ AUTH FAILED: Token not found in cookies");

    return next(
      new HandleError(
        "Authentication is missing! Please login to continue.",
        401
      )
    );
  }

  // ----------------------------------------------------
  // Verify JWT token
  // ----------------------------------------------------

  try {
    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    console.log("✅ JWT decoded successfully");
    console.log("Decoded user ID:", decodedData.id);

    // --------------------------------------------------
    // Find user
    // --------------------------------------------------

    const user = await User.findById(decodedData.id);

    if (!user) {
      console.log("❌ AUTH FAILED: User not found");

      return next(
        new HandleError(
          "User not found.",
          401
        )
      );
    }

    // Attach authenticated user to request
    req.user = user;

    console.log("✅ USER AUTHENTICATED");
    console.log("User ID:", user._id);
    console.log("User Email:", user.email);
    console.log("================================");

    next();

  } catch (error) {
    console.error("❌ JWT ERROR:", error.message);

    return next(
      new HandleError(
        "Invalid or expired token. Please login again.",
        401
      )
    );
  }
});

// ======================================================
// ROLE BASED ACCESS
// ======================================================

const rolebasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new HandleError(
          "Authentication is required.",
          401
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new HandleError(
          `Role '${req.user.role}' is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};

// ======================================================
// EXPORT
// ======================================================

export {
  verifyUserAuth,
  rolebasedAccess,
};