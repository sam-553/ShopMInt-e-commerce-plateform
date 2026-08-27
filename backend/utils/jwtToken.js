const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const cookieExpireDays =
    Number(process.env.EXPIRE_COOKIE) || 7;

  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    expires: new Date(
      Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  console.log("SETTING COOKIE:", {
    secure: options.secure,
    sameSite: options.sameSite,
    httpOnly: options.httpOnly,
    path: options.path,
    expires: options.expires,
  });

  return res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user,
      message:
        statusCode === 200
          ? "Login successful"
          : "Account created successfully",
    });
};

export default sendToken;