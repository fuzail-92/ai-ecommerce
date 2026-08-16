const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AppError = require("../../utils/appError");
const User = require("../users/user.model");
const config = require("../../config/env");

// ⚠️ In-memory refresh token store — development only
// In production, replace with Redis or database.
const refreshTokenStore = new Set();

// Store a refresh token
const storeRefreshToken = (token) => {
  refreshTokenStore.add(token);
};

// Check if a refresh token is valid
const isRefreshTokenValid = (token) => {
  return refreshTokenStore.has(token);
};

// Revoke a refresh token
const revokeRefreshToken = (token) => {
  refreshTokenStore.delete(token);
};

// Register a new user
const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  user.emailVerificationToken = hashedVerificationToken;
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // Development: log verification URL
  const verificationUrl = `http://localhost:5000/api/v1/auth/verify-email/${verificationToken}`;

  console.log(`🔗 Email verification link: ${verificationUrl}`);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

// Login a user
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email before login", 403);
  }

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    config.jwtAccessSecret,
    { expiresIn: config.jwtAccessExpiresIn },
  );

  const refreshToken = jwt.sign({ userId: user._id }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });

  storeRefreshToken(refreshToken);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

// Refresh access token using a valid refresh token
const refreshAccessToken = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  if (!isRefreshTokenValid(refreshToken)) {
    throw new AppError("Refresh token has been revoked", 401);
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is disabled", 401);
  }

  const newAccessToken = jwt.sign(
    { userId: user._id, role: user.role },
    config.jwtAccessSecret,
    { expiresIn: config.jwtAccessExpiresIn },
  );

  const newRefreshToken = jwt.sign(
    { userId: user._id },
    config.jwtRefreshSecret,
    {
      expiresIn: config.jwtRefreshExpiresIn,
    },
  );

  revokeRefreshToken(refreshToken);
  storeRefreshToken(newRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// Logout user by revoking refresh token
const logoutUser = async ({ refreshToken }) => {
  if (refreshToken && isRefreshTokenValid(refreshToken)) {
    revokeRefreshToken(refreshToken);
  }

  return { success: true };
};

// Forgot password
const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    // Do not reveal if email exists
    throw new AppError("If email exists, a reset link has been sent", 200);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // Development: log reset URL
  const resetUrl = `http://localhost:5000/api/v1/auth/reset-password/${resetToken}`;

  console.log(`🔗 Password reset link: ${resetUrl}`);

  return {
    message: "If email exists, a reset link has been sent",
  };
};

// Reset password using token
const resetPassword = async ({ token, newPassword }) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired password reset token", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return {
    message: "Password reset successful",
  };
};

// Verify email using token
const verifyEmail = async ({ token }) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return {
    message: "Email verified successfully",
  };
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
