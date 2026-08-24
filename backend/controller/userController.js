import Model from '../model/usermodel.js';
import handleasyncError from '../middlewear/handleasyncError.js';
import sendToken from '../utils/jwtToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import cloudinaryModule from 'cloudinary';
import bcrypt from 'bcryptjs';
import HandleError from '../utils/handleError.js';

const cloudinary = cloudinaryModule.v2;


// Register User
const userRegister = handleasyncError(async (req, res, next) => {
  const { name, password, email, avatar } = req.body;

  if (!name || !email || !password || !avatar) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingUser = await Model.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User with this email already exists." });
  }

  // Upload to Cloudinary
  const mycloud = await cloudinary.uploader.upload(avatar, {
    folder: "avatars",
    width: 300,
    crop: "scale"
  });

  const user = await Model.create({
    name,
    email,
    password, // ensure User model hashes it automatically
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url
    }
  });

  return sendToken(user, 201, res);
});

// Login User
const loginUser = handleasyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new HandleError("Email or password cannot be empty", 400));
  }

  const user = await Model.findOne({ email }).select("+password");

  if (!user) {
    return next(new HandleError("Invalid Email or password", 401));
  }

  
  const isMatch = await user.verifyPassword(password);

  if (!isMatch) {
    return next(new HandleError("Invalid Email or password", 401));
  }

  user.password = undefined;

  sendToken(user, 200, res);
});
// Logout User
const logOut = handleasyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: "Successfully Logged Out"
  });
});


const requestresetpassword = handleasyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(
      new HandleError("Please enter your email", 400)
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  console.log("Email received:", email);
  console.log("Searching for:", normalizedEmail);

  const user = await Model.findOne({
    email: normalizedEmail,
  });

  console.log(
    "User found:",
    user ? user._id : "No user found"
  );

  if (!user) {
    return next(
      new HandleError("User doesn't exist", 404)
    );
  }

  const resetToken = user.generatePasswordResetToken();

  console.log("Reset token generated");

  try {
    await user.save({
      validateBeforeSave: false,
    });

    const resetPasswordURL =
      `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

    console.log("Reset URL:", resetPasswordURL);

    const message = `
You requested a password reset for your Crazy Fashion account.

Click the link below to reset your password:

${resetPasswordURL}

This link will expire in 15 minutes.

If you did not request this password reset, please ignore this email.
    `;

    await sendEmail({
      email: user.email,
      subject: "Crazy Fashion - Password Reset",
      message,
    });

    return res.status(200).json({
      success: true,
      message: `Password reset email sent to ${user.email}`,
    });
  } catch (error) {
    console.error("Password reset email error:", error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return next(
      new HandleError(
        "Email couldn't be sent, please try again later.",
        500
      )
    );
  }
});

const resetPassword = handleasyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await Model.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new HandleError("Reset Password token is invalid or has expired", 400));
  }

  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new HandleError("Both password and confirmPassword are required", 400));
  }

  if (password !== confirmPassword) {
    return next(new HandleError("Passwords do not match", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

const getUserDetails = handleasyncError(async (req, res, next) => {
  const user = await Model.findById(req.user.id);
  res.status(200).json({
    success: true,
    user
  })


})

const updatePassword = handleasyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await Model.findById(req.user.id).select('+password');
  if (!user) {
    return next(new HandleError("User not found", 404));
  }

  const isMatch = await user.verifyPassword(oldPassword);
  if (!isMatch) {
    return next(new HandleError("Old password is incorrect", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new HandleError("New passwords do not match", 400));
  }

  if (newPassword.length < 8) {
    return next(new HandleError("Password must be at least 8 characters long", 400));
  }

  user.password = newPassword;

  await user.save();

  
  sendToken(user, 200, res);
});


const updateProfile = handleasyncError(async (req, res, next) => {
  const { name, email, avatar } = req.body; // Add avatar

  const updateUserDetails = { name, email };

  if (avatar) {
  
    const mycloud = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
      width: 300,
      crop: "scale",
    });
    updateUserDetails.avatar = {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    };
  }

  const user = await Model.findByIdAndUpdate(req.user.id, updateUserDetails, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user,
  });
});


const getUsersList = handleasyncError(async (req, res, next) => {
  const users = await Model.find();
  res.status(200).json({
    success: true,
    users
  });
});

const getSingleUser = handleasyncError(async (req, res, next) => {
  const { id } = req.params;

  
  const user = await Model.findById(id);
  if (!user) {
    return next(new HandleError(`User doesn't exist with this id: ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});


const updateUserRole = handleasyncError(async (req, res, next) => {
  const { role } = req.body;
  const newUserData = {
    role
  }
  const user = await Model.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true
  })
  if (!user) {
    return next(new HandleError("User doesn't exist", 400))
  }
  res.status(200).json({
    success: true,
    user
  })


})

const deleteUser = handleasyncError(async (req, res, next) => {
  const userId = req.params.id;
  const user = await Model.findById(userId);

  if (!user) {
    return next(new HandleError("User doesn't exist", 404));
  }
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully"
  });
});
export {
  userRegister,
  loginUser,
  logOut,
  requestresetpassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getUsersList,
  getSingleUser,
  updateUserRole,
  deleteUser
};
