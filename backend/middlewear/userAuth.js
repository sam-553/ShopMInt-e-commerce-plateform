import HandleError from "../utils/handleError.js";
import handleasyncError from "./handleasyncError.js";
import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

const verifyUserAuth = handleasyncError(async (req, res, next) => {

  

  const token = req.cookies?.token;

  if (!token) {
    return next(
      new HandleError(
        "Authentication is missing! Please login to continue.",
        401
      )
    );
  }

  try {
    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    console.log("Decoded JWT:", decodedData);

    req.user = await User.findById(decodedData.id);

    if (!req.user) {
      return next(
        new HandleError("User not found", 401)
      );
    }

    next();

  } catch (error) {
    console.error("JWT ERROR:", error);

    return next(
      new HandleError(
        "Invalid or expired token. Please login again.",
        401
      )
    );
  }
});

const rolebasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new HandleError("Authentication required", 401)
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