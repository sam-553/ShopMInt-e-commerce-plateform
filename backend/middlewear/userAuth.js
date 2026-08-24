import HandleError from "../utils/handleError.js";
import handleasyncError from "./handleasyncError.js";
import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

// Middleware to verify JWT token
const verifyUserAuth = handleasyncError(async (req, res, next) => {
  try {
    let token = null;

    // --------------------------------
    // 1. Get token from Authorization header
    // --------------------------------
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // --------------------------------
    // 2. Fallback: get token from cookie
    // --------------------------------
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // --------------------------------
    // 3. Token missing
    // --------------------------------
    if (!token) {
      return next(
        new HandleError(
          "Authentication is missing! Please login to continue.",
          401
        )
      );
    }

    // --------------------------------
    // 4. Verify JWT
    // --------------------------------
    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    // --------------------------------
    // 5. Find user
    // --------------------------------
    const user = await User.findById(decodedData.id);

    if (!user) {
      return next(
        new HandleError(
          "User no longer exists.",
          401
        )
      );
    }

    req.user = user;

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);

    return next(
      new HandleError(
        "Invalid or expired token. Please login again.",
        401
      )
    );
  }
});

// Role-based access middleware
const rolebasedAccess = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return next(
        new HandleError(
          "Authentication required.",
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

export {
  verifyUserAuth,
  rolebasedAccess
};