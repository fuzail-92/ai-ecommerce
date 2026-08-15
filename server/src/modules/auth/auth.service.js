const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

  // Generate access token
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    config.jwtAccessSecret,
    { expiresIn: config.jwtAccessExpiresIn },
  );

  // Generate refresh token
  const refreshToken = jwt.sign({ userId: user._id }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });

  // Store refresh token
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

  // Verify the refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  // Check if refresh token is still valid in our store
  if (!isRefreshTokenValid(refreshToken)) {
    throw new AppError("Refresh token has been revoked", 401);
  }

  // Fetch the user from database
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is disabled", 401);
  }

  // Generate new access token
  const newAccessToken = jwt.sign(
    { userId: user._id, role: user.role },
    config.jwtAccessSecret,
    { expiresIn: config.jwtAccessExpiresIn },
  );

  // Generate new refresh token
  const newRefreshToken = jwt.sign(
    { userId: user._id },
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpiresIn },
  );

  // Token rotation: revoke old refresh token, store new one
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

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
