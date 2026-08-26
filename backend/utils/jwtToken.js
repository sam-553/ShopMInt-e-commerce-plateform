const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const cookieExpireDays =
    Number(process.env.EXPIRE_COOKIE) || 7;

  const options = {
    expires: new Date(
      Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };

  console.log("SETTING COOKIE:", {
    secure: options.secure,
    sameSite: options.sameSite,
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